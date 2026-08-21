import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2, Volume2, Sparkles, AlertCircle } from 'lucide-react';

interface VoiceTranscriberProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

export const VoiceTranscriber: React.FC<VoiceTranscriberProps> = ({
  onTranscriptionComplete,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const startRecording = async () => {
    setError(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release mic
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        await sendAudioForTranscription(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((sec) => sec + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setError('Could not access microphone. Please allow audio permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const sendAudioForTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64DataUrl = reader.result as string;
        // Strip data:audio/webm;base64, prefix
        const base64Data = base64DataUrl.split(',')[1];

        const response = await fetch('/api/ai/transcribe-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioData: base64Data,
            mimeType: blob.type || 'audio/webm',
          }),
        });

        const data = await response.json();
        if (data.success && data.transcription) {
          onTranscriptionComplete(data.transcription);
        } else {
          setError(data.error || 'Speech could not be recognized clearly.');
        }
        setIsTranscribing(false);
      };
    } catch (err: any) {
      console.error('Transcription request failed:', err);
      setError('Transcription failed. Please try again.');
      setIsTranscribing(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {isRecording ? (
        <button
          type="button"
          onClick={stopRecording}
          className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs animate-pulse cursor-pointer"
          title="Click to stop and transcribe"
        >
          <MicOff className="w-4 h-4" />
          <span>Stop Recording ({recordingSeconds}s)</span>
        </button>
      ) : isTranscribing ? (
        <div className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-semibold shadow-xs">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          <span>Transcribing Voice with Gemini 3.5...</span>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={startRecording}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition-all cursor-pointer"
          title="Speak your strategy inquiry using microphone"
        >
          <Mic className="w-4 h-4 text-indigo-600" />
          <span className="hidden sm:inline">Voice Search</span>
        </button>
      )}

      {error && (
        <div className="absolute top-full left-0 mt-1 z-30 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] rounded-lg whitespace-nowrap shadow-md flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-2 font-bold hover:underline"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
