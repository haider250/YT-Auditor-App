import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { ComparisonReport, VideoAnalysis } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  savedAudits: { id: string; query: string; niche: string; timeframe: string; report: ComparisonReport; savedAt: any }[];
  bookmarkedVideos: { id: string; video: VideoAnalysis; createdAt: any }[];
  saveAuditToFirestore: (report: ComparisonReport, query: string, niche: string, timeframe: string) => Promise<string>;
  deleteSavedAudit: (id: string) => Promise<void>;
  toggleFirestoreBookmark: (video: VideoAnalysis) => Promise<void>;
  isBookmarked: (videoId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedAudits, setSavedAudits] = useState<any[]>([]);
  const [bookmarkedVideos, setBookmarkedVideos] = useState<any[]>([]);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Sync user doc
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          await setDoc(
            userRef,
            {
              userId: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || 'User',
              photoURL: currentUser.photoURL || '',
              lastLogin: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (e) {
          console.warn('Could not sync user profile to firestore:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Saved Audits & Bookmarks in Firestore when authenticated
  useEffect(() => {
    if (!user) {
      setSavedAudits([]);
      setBookmarkedVideos([]);
      return;
    }

    const auditsRef = collection(db, 'users', user.uid, 'savedAudits');
    const unsubscribeAudits = onSnapshot(
      auditsRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setSavedAudits(items);
      },
      (error) => {
        console.warn('Error listening to saved audits:', error);
      }
    );

    const bookmarksRef = collection(db, 'users', user.uid, 'bookmarks');
    const unsubscribeBookmarks = onSnapshot(
      bookmarksRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setBookmarkedVideos(items);
      },
      (error) => {
        console.warn('Error listening to bookmarks:', error);
      }
    );

    return () => {
      unsubscribeAudits();
      unsubscribeBookmarks();
    };
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google sign-in failed:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const saveAuditToFirestore = async (
    report: ComparisonReport,
    query: string,
    niche: string,
    timeframe: string
  ) => {
    if (!user) {
      throw new Error('Please sign in to save audits to your cloud account.');
    }
    const auditId = `audit_${Date.now()}`;
    const auditRef = doc(db, 'users', user.uid, 'savedAudits', auditId);
    await setDoc(auditRef, {
      id: auditId,
      userId: user.uid,
      query: query || niche,
      niche,
      timeframe,
      report,
      savedAt: new Date().toISOString(),
    });
    return auditId;
  };

  const deleteSavedAudit = async (id: string) => {
    if (!user) return;
    const auditRef = doc(db, 'users', user.uid, 'savedAudits', id);
    await deleteDoc(auditRef);
  };

  const toggleFirestoreBookmark = async (video: VideoAnalysis) => {
    if (!user) return;
    const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', video.id);
    const existing = bookmarkedVideos.find((b) => b.id === video.id);
    if (existing) {
      await deleteDoc(bookmarkRef);
    } else {
      await setDoc(bookmarkRef, {
        id: video.id,
        userId: user.uid,
        video,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const isBookmarked = (videoId: string) => {
    return bookmarkedVideos.some((b) => b.id === videoId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOut,
        savedAudits,
        bookmarkedVideos,
        saveAuditToFirestore,
        deleteSavedAudit,
        toggleFirestoreBookmark,
        isBookmarked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
