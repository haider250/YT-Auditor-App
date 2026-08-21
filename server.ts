import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractYouTubeId(urlOrStr: string): string | null {
  if (!urlOrStr) return null;
  const match = urlOrStr.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  return match ? match[1] : null;
}

function cleanJsonResponse(rawText: string): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let startIdx = -1;
    let endIdx = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
      endIdx = cleaned.lastIndexOf('}');
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
      endIdx = cleaned.lastIndexOf(']');
    }

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const jsonSubstr = cleaned.substring(startIdx, endIdx + 1);
      return JSON.parse(jsonSubstr);
    }
    throw new Error('Failed to parse model response into JSON format: ' + (err as Error).message);
  }
}

function normalizeVideo(video: any, index: number = 0): any {
  const videoId = video.videoId || extractYouTubeId(video.videoUrl || video.url || '') || `vid-${Date.now()}-${index}`;
  const videoUrl = video.videoUrl || (videoId && !videoId.startsWith('vid-') ? `https://www.youtube.com/watch?v=${videoId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(video.title || 'online earning strategy')}`);
  const thumbnailUrl = video.thumbnailUrl || (videoId && !videoId.startsWith('vid-') ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined);

  const realFeasibilityScore = typeof video.realFeasibilityScore === 'number' ? Math.min(100, Math.max(0, video.realFeasibilityScore)) : 65;
  const clickbaitScore = typeof video.clickbaitScore === 'number' 
    ? Math.min(100, Math.max(0, video.clickbaitScore))
    : Math.max(0, 100 - realFeasibilityScore + (video.claimedEarning?.includes('000') ? 15 : 0));

  let verdict = video.verdict;
  if (!verdict) {
    if (realFeasibilityScore >= 75) verdict = 'Genuine & Highly Viable';
    else if (realFeasibilityScore >= 55) verdict = 'Partially Viable (High Effort)';
    else if (clickbaitScore >= 70) verdict = 'Clickbait / Misleading Claims';
    else if (realFeasibilityScore <= 35) verdict = 'Predatory / Course Funnel Trap';
    else verdict = 'Overhyped / Extreme Saturation';
  }

  return {
    id: video.id || `video-${index + 1}`,
    title: video.title || 'Online Earning Strategy Overview',
    channelName: video.channelName || 'YouTube Creator',
    channelUrl: video.channelUrl || 'https://www.youtube.com',
    videoUrl,
    videoId,
    thumbnailUrl,
    publishedDate: video.publishedDate || 'Recent (Past 30 Days)',
    viewsEstimate: video.viewsEstimate || '100K+ views',
    strategyName: video.strategyName || video.title || 'Online Business Model',
    strategyCategory: video.strategyCategory || 'AI & Automation',
    claimedEarning: video.claimedEarning || '$5,000 / Month',
    claimedTimeline: video.claimedTimeline || '30 Days',
    realFeasibilityScore,
    clickbaitScore,
    verdict,
    effectivenessRating: video.effectivenessRating || (realFeasibilityScore >= 70 ? 'Highly Effective' : realFeasibilityScore >= 45 ? 'Moderately Effective' : 'Low Effectiveness'),
    realMedianMonthlyIncome: video.realMedianMonthlyIncome || '$200 - $800 / Month (Realistic)',
    realTimeCommitment: video.realTimeCommitment || '15 - 25 hrs/week',
    estimatedViewerSuccessRate: video.estimatedViewerSuccessRate || '10 - 20% with execution',
    sentimentBreakdown: video.sentimentBreakdown || { positivePercent: 65, neutralPercent: 20, negativePercent: 15 },
    overallSentiment: video.overallSentiment || (realFeasibilityScore >= 70 ? 'Overwhelmingly Positive' : 'Cautiously Optimistic'),
    startupCapitalNeeded: video.startupCapitalNeeded || '$0 - $50',
    timeToFirstDollar: video.timeToFirstDollar || '2 - 4 weeks',
    saturationLevel: video.saturationLevel || 'Medium',
    skillPrerequisites: Array.isArray(video.skillPrerequisites) ? video.skillPrerequisites : ['Basic Computer Skills'],
    hiddenCatches: Array.isArray(video.hiddenCatches) ? video.hiddenCatches : ['Takes consistent outreach and time'],
    redFlags: Array.isArray(video.redFlags) ? video.redFlags : [
      { flag: 'Unrealistic Timeline', severity: 'medium', explanation: 'Promise of instant wealth within days without prior skillset.' }
    ],
    pros: Array.isArray(video.pros) ? video.pros : ['Low capital barrier', 'Scalable if executed'],
    cons: Array.isArray(video.cons) ? video.cons : ['High initial persistence required', 'Platform rules can change'],
    representativeComments: Array.isArray(video.representativeComments) ? video.representativeComments : [
      {
        author: 'ViewerInsight',
        sentiment: 'positive',
        comment: 'Worked for me after 3 weeks of continuous testing and fine-tuning prompts.',
        likes: '350',
        category: 'proof_of_success'
      }
    ],
    audienceVerdict: video.audienceVerdict || 'Viewers confirm the logic is sound but caution that execution takes way more effort than the creator suggested.',
    guruVsRealityComparison: video.guruVsRealityComparison || {
      guruClaim: video.claimedEarning ? `Earn ${video.claimedEarning} effortlessly` : 'Passive income in minutes',
      actualReality: 'Requires active daily work and skill development to see steady revenue.',
    },
    actionableRoadmap: Array.isArray(video.actionableRoadmap) ? video.actionableRoadmap : [
      'Validate niche demand',
      'Set up baseline workflow',
      'Conduct direct outreach or launch product'
    ],
    honestAlternativeRecommendation: video.honestAlternativeRecommendation || 'Focus on high-ticket service arbitrage or genuine audience building rather than automated spam.',
    isRecommended: Boolean(video.isRecommended ?? (realFeasibilityScore >= 65)),
  };
}

function normalizeReport(raw: any, queryInfo: { niche: string; customKeywords?: string; timeframe?: string }): any {
  const videos = Array.isArray(raw.videos) ? raw.videos.map((v: any, i: number) => normalizeVideo(v, i)) : [];

  const avgFeasibility = videos.length > 0
    ? Math.round(videos.reduce((sum: number, v: any) => sum + v.realFeasibilityScore, 0) / videos.length)
    : 60;
  const avgClickbait = videos.length > 0
    ? Math.round(videos.reduce((sum: number, v: any) => sum + v.clickbaitScore, 0) / videos.length)
    : 45;

  return {
    summary: raw.summary || 'Investigation into recent YouTube online earning uploads comparing guru promises against real viewer execution data.',
    timeframe: raw.timeframe || queryInfo.timeframe || 'Previous 1 month',
    searchQuery: raw.searchQuery || `${queryInfo.niche} ${queryInfo.customKeywords || ''}`.trim(),
    totalAnalyzed: videos.length,
    marketRealityOverview: raw.marketRealityOverview || {
      avgFeasibilityScore: avgFeasibility,
      avgClickbaitScore: avgClickbait,
      legitStrategiesCount: videos.filter((v: any) => v.realFeasibilityScore >= 70).length,
      trapStrategiesCount: videos.filter((v: any) => v.clickbaitScore >= 65 || v.realFeasibilityScore <= 45).length,
    },
    topRecommendedStrategy: raw.topRecommendedStrategy || {
      name: videos[0]?.strategyName || 'Niche B2B Automation Services',
      whyEffective: 'Proven demand and direct cash flow without high upfront capital requirements.',
      targetAudience: 'Individuals with problem-solving ability willing to do client outreach.',
      expectedOutcome: '$1,000 - $3,000 / month with steady client retention.',
    },
    biggestTrapStrategy: raw.biggestTrapStrategy || {
      name: '100% Automated Faceless AI Spam',
      whyMisleading: 'Massive channel de-monetization rates and zero retention from low-quality AI re-uploads.',
      commonPitfall: 'Spending weeks generating content only for YouTube to flag it as reused content.',
      hiddenCosts: 'Subscription costs for video generators, voiceover tools, and proxies.',
    },
    strategyComparisonTable: Array.isArray(raw.strategyComparisonTable)
      ? raw.strategyComparisonTable
      : videos.map((v: any) => ({
          strategyName: v.strategyName,
          communitySentimentScore: v.sentimentBreakdown?.positivePercent || 70,
          feasibilityScore: v.realFeasibilityScore,
          clickbaitLevel: v.clickbaitScore > 65 ? 'High / Sensational' : v.clickbaitScore > 35 ? 'Moderate Hype' : 'Low / Honest',
          practicalSuccessRate: v.estimatedViewerSuccessRate,
          startupCost: v.startupCapitalNeeded,
          difficulty: 'Intermediate',
          keyPros: v.pros?.[0] || 'Good income upside',
          keyCons: v.cons?.[0] || 'Requires learning curve',
          verdict: v.verdict,
        })),
    videos,
    groundingSources: raw.groundingSources,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Audio Transcription Endpoint using gemini-3.5-flash / multimodal input
  app.post('/api/ai/transcribe-audio', async (req, res) => {
    try {
      const { audioData, mimeType = 'audio/webm' } = req.body;
      if (!audioData) {
        return res.status(400).json({ success: false, error: 'Audio data is required for transcription.' });
      }

      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            inlineData: {
              data: audioData,
              mimeType: mimeType,
            },
          },
          {
            text: 'You are an accurate voice-to-text transcriber. Transcribe this spoken audio exactly as spoken. Focus on capturing search keywords, YouTube online earning strategies, side hustles, creator names, or questions. Return ONLY the transcribed text without quotes, formatting, or commentary.',
          },
        ],
      });

      const transcription = response.text ? response.text.trim() : '';

      res.json({
        success: true,
        transcription,
      });
    } catch (error: any) {
      console.error('Audio transcription error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to transcribe audio.',
      });
    }
  });

  // Search & Deep Sentiment Analysis of YouTube Online Earning Videos with Search Grounding
  app.post('/api/youtube/search-and-analyze', async (req, res) => {
    try {
      const {
        niche = 'All Online Earning Strategies',
        timeframe = 'Previous 1 month',
        difficulty = 'All Levels',
        budget = 'All Budgets',
        customKeywords = '',
      } = req.body;

      const ai = getGeminiClient();

      const prompt = `You are an elite forensic YouTube auditor and online business investigator.
Perform a LIVE SEARCH on YouTube and Google for recent video uploads published in the ${timeframe} (within the last 30-45 days) focusing on:
ONLINE EARNING, SIDE HUSTLES, MAKING MONEY ONLINE, AI AUTOMATION, DIGITAL PRODUCTS, FREELANCING, OR PASSIVE INCOME.

Target Niche / Focus: ${niche} ${customKeywords ? `(Keywords: ${customKeywords})` : ''}
Difficulty Preference: ${difficulty}
Budget Level: ${budget}

Your objectives:
1. Search and identify 5-8 distinct real YouTube videos published in the past month about making money online. Extract authentic video titles, creator/channel names, authentic YouTube video URLs (or watch IDs), view estimates, and upload dates.
2. For EACH video found, perform deep AUDIENCE FORENSICS:
   - What is the creator claiming? (Income hook like "$10k in 7 days", "100% automated passive income").
   - GURU CLAIM vs ACTUAL REALITY: What do real viewers discover when they try this?
   - CLICKBAIT & HYPE SCORE (0 to 100): How misleading or sensationalized is the title/thumbnail?
   - REAL FEASIBILITY SCORE (0 to 100): The objective probability that a beginner can make sustainable profit.
   - REALISTIC MONTHLY INCOME: Realistic median numbers (e.g. "$300 - $1,200 / month") vs Guru Claim.
   - REALISTIC TIME COMMITMENT: (e.g. "15-20 hours/week").
   - ESTIMATED VIEWER SUCCESS RATE: (e.g. "15% of viewers who consistently execute").
   - RED FLAGS & HIDDEN CATCHES: 2-3 specific red flags (e.g., "Sells $997 course in description", "Requires $500/mo software subscriptions", "High copyright strike risk on shorts").
   - AUDIENCE COMMENT SENTIMENT: Extract 4 real/representative viewer comments across categories:
     * 'proof_of_success': Legitimate viewers who made money and explained what worked.
     * 'hidden_catch': Hidden costs, API bills, or prerequisites left out of video.
     * 'saturation_warning': Marketplace saturated or copycats flooded.
     * 'scam_alert': Warning of bans, fake proof, or course funnel traps.
   - SENTIMENT RATIO: Positive%, Neutral%, Negative%.
   - VERDICT: Choose one: 'Genuine & Highly Viable' | 'Partially Viable (High Effort)' | 'Overhyped / Extreme Saturation' | 'Clickbait / Misleading Claims' | 'Predatory / Course Funnel Trap'.
   - ACTIONABLE ROADMAP: 3-4 honest steps to execute safely.
   - HONEST ALTERNATIVE: What to do instead if this video is clickbait.

3. Sift through the findings to synthesize:
   - Market Reality Overview (Avg feasibility score, avg clickbait index, count of legit vs trap strategies).
   - Top Recommended Strategy with expected realistic outcome.
   - Biggest Trap Strategy with specific breakdown of why it tricks viewers.
   - A side-by-side Strategy Comparison Table.

RETURN ONLY A VALID JSON OBJECT matching this exact structure:
{
  "summary": "Forensic executive summary contrasting guru promises with real comment data...",
  "timeframe": "${timeframe}",
  "searchQuery": "${niche} ${customKeywords}",
  "totalAnalyzed": 6,
  "marketRealityOverview": {
    "avgFeasibilityScore": 68,
    "avgClickbaitScore": 55,
    "legitStrategiesCount": 3,
    "trapStrategiesCount": 2
  },
  "topRecommendedStrategy": {
    "name": "Strategy Name",
    "whyEffective": "Reason based on real comment proof...",
    "targetAudience": "Who this works best for...",
    "expectedOutcome": "Realistic monthly profit and timeline..."
  },
  "biggestTrapStrategy": {
    "name": "Trap Strategy Name",
    "whyMisleading": "Detailed breakdown of the deception or extreme barrier...",
    "commonPitfall": "Where 90% of beginners fail...",
    "hiddenCosts": "Costs the video omitted..."
  },
  "strategyComparisonTable": [
    {
      "strategyName": "Strategy Name",
      "communitySentimentScore": 82,
      "feasibilityScore": 85,
      "clickbaitLevel": "Low / Honest",
      "practicalSuccessRate": "35-45%",
      "startupCost": "$0 - $30",
      "difficulty": "Beginner",
      "keyPros": "Immediate market demand",
      "keyCons": "Requires client communication",
      "verdict": "Genuine & Highly Viable"
    }
  ],
  "videos": [
    {
      "id": "vid-1",
      "title": "Exact Video Title",
      "channelName": "Channel Name",
      "channelUrl": "https://www.youtube.com/@Channel",
      "videoUrl": "https://www.youtube.com/watch?v=...",
      "videoId": "11-char-id-if-found",
      "publishedDate": "2 weeks ago",
      "viewsEstimate": "120K views",
      "strategyName": "Strategy Name",
      "strategyCategory": "AI & Automation",
      "claimedEarning": "$10,000 / Month",
      "claimedTimeline": "30 Days",
      "realFeasibilityScore": 82,
      "clickbaitScore": 25,
      "verdict": "Genuine & Highly Viable",
      "effectivenessRating": "Highly Effective",
      "realMedianMonthlyIncome": "$1,500 - $4,000 / Month",
      "realTimeCommitment": "15 - 20 hrs/week",
      "estimatedViewerSuccessRate": "30% of dedicated practitioners",
      "sentimentBreakdown": {
        "positivePercent": 75,
        "neutralPercent": 15,
        "negativePercent": 10
      },
      "overallSentiment": "Overwhelmingly Positive",
      "startupCapitalNeeded": "$0 - $50",
      "timeToFirstDollar": "2 - 3 weeks",
      "saturationLevel": "Low",
      "skillPrerequisites": ["Basic workflow logic", "Cold outreach"],
      "hiddenCatches": ["Domain warmup required", "API rate limits"],
      "redFlags": [
        {
          "flag": "High Effort Client Management",
          "severity": "medium",
          "explanation": "Not passive income - it is an active B2B service agency."
        }
      ],
      "pros": ["High profit margins", "Recurring client retainer potential"],
      "cons": ["Requires cold outreach and sales calls", "Client deliverable management"],
      "representativeComments": [
        {
          "author": "Marcus_Automation",
          "sentiment": "positive",
          "comment": "Closed my first $800 retainer using this exact Make.com lead scraper workflow.",
          "likes": "240",
          "category": "proof_of_success"
        },
        {
          "author": "TechWatch_22",
          "sentiment": "warning",
          "comment": "Be careful with OpenAI token billing when running multi-step loops.",
          "likes": "95",
          "category": "hidden_catch"
        }
      ],
      "audienceVerdict": "Viewers report high success when approaching local businesses directly.",
      "guruVsRealityComparison": {
        "guruClaim": "Zero work 100% passive AI money printer in your sleep",
        "actualReality": "Legitimate high-demand freelance service requiring active outreach and client onboarding."
      },
      "actionableRoadmap": [
        "Pick 1 local business vertical",
        "Build a working proof-of-concept automation in Make",
        "Send 15 video audits per day"
      ],
      "honestAlternativeRecommendation": "Focus on high-value client retention rather than churning cheap gigs.",
      "isRecommended": true
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
        },
      });

      const rawText = response.text || '';
      const parsedData = cleanJsonResponse(rawText);

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any) => web && web.uri)
        .map((web: any) => ({
          title: web.title || 'YouTube / Web Reference',
          url: web.uri,
        }));

      const normalized = normalizeReport({ ...parsedData, groundingSources: sources }, { niche, customKeywords, timeframe });

      res.json({
        success: true,
        data: normalized,
      });
    } catch (error: any) {
      console.error('Error searching YouTube earning videos:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to search and analyze YouTube earning videos.',
      });
    }
  });

  // Deep Single Video Audit (User pastes any URL or video topic) with Search Grounding
  app.post('/api/youtube/analyze-single-video', async (req, res) => {
    try {
      const { videoUrlOrQuery } = req.body;
      if (!videoUrlOrQuery || !videoUrlOrQuery.trim()) {
        return res.status(400).json({ success: false, error: 'Please provide a YouTube video URL or topic.' });
      }

      const ai = getGeminiClient();

      const prompt = `You are a forensic YouTube investigator specializing in online business models, income claims, and viewer feedback.
Analyze the following YouTube video link or specific online earning video query:
"${videoUrlOrQuery}"

Search YouTube and the web for information about this specific video, its creator, the exact strategy presented, and the REAL VIEWER COMMENTS & AUDIENCE SENTIMENT.

Investigate:
1. Video Title, Channel, estimated views, upload date, and core thesis.
2. The exact earning strategy: what is claimed vs what is required.
3. CLICKBAIT & HYPE SCORE (0 to 100): Assess thumbnail exaggeration, fake screenshots, or omitted costs.
4. AUDIENCE COMMENT FORENSICS:
   - What are commenters reporting? Did anyone replicate the results?
   - What are the major complaints, scam allegations, or hidden expenses highlighted by viewers?
   - Sentiment breakdown (positive%, neutral%, negative%).
5. REAL FEASIBILITY SCORE (0 to 100) and VERDICT ('Genuine & Highly Viable' | 'Partially Viable (High Effort)' | 'Overhyped / Extreme Saturation' | 'Clickbait / Misleading Claims' | 'Predatory / Course Funnel Trap').
6. REALISTIC NUMBERS: Real median monthly earnings vs Guru Claim, real time commitment, estimated success rate.
7. RED FLAGS: Specific deceptive tactics (e.g. undisclosed affiliate link, software paywall, high refund rate).
8. 4 representative comment snippets across categories (proof_of_success, hidden_catch, saturation_warning, scam_alert).
9. Honest step-by-step roadmap and alternative recommendation.

RETURN ONLY A VALID JSON OBJECT matching this structure:
{
  "video": {
    "id": "single-vid-1",
    "title": "Video Title",
    "channelName": "Channel Name",
    "channelUrl": "https://www.youtube.com/@Channel",
    "videoUrl": "${videoUrlOrQuery.startsWith('http') ? videoUrlOrQuery : 'https://www.youtube.com/results?search_query=' + encodeURIComponent(videoUrlOrQuery)}",
    "videoId": "${extractYouTubeId(videoUrlOrQuery) || ''}",
    "publishedDate": "Upload Date or Recent",
    "viewsEstimate": "View estimate",
    "strategyName": "Strategy Name",
    "strategyCategory": "AI & Automation",
    "claimedEarning": "$3,000 / Week",
    "claimedTimeline": "14 Days",
    "realFeasibilityScore": 72,
    "clickbaitScore": 35,
    "verdict": "Partially Viable (High Effort)",
    "effectivenessRating": "Moderately Effective",
    "realMedianMonthlyIncome": "$400 - $1,200 / Month",
    "realTimeCommitment": "15 - 20 hrs/week",
    "estimatedViewerSuccessRate": "15% with consistent execution",
    "sentimentBreakdown": {
      "positivePercent": 60,
      "neutralPercent": 25,
      "negativePercent": 15
    },
    "overallSentiment": "Cautiously Optimistic",
    "startupCapitalNeeded": "$50 - $150",
    "timeToFirstDollar": "3 - 5 weeks",
    "saturationLevel": "Medium",
    "skillPrerequisites": ["Basic tech skills", "Consistent posting"],
    "hiddenCatches": ["Requires patience and ad testing", "Platform fees"],
    "redFlags": [
      {
        "flag": "Underestimated Time Horizon",
        "severity": "medium",
        "explanation": "Takes 2-3 months to build traction rather than 14 days."
      }
    ],
    "pros": ["Accessible barrier", "High scalability"],
    "cons": ["Algorithm dependency", "High competition"],
    "representativeComments": [
      {
        "author": "RealUser",
        "sentiment": "positive",
        "comment": "Made my first sale on week 3 after tweaking the product mockups.",
        "likes": "110",
        "category": "proof_of_success"
      }
    ],
    "audienceVerdict": "Viewers acknowledge the strategy is real but emphasize that results are 5x slower than advertised.",
    "guruVsRealityComparison": {
      "guruClaim": "Get rich in 14 days with zero effort",
      "actualReality": "Viable side income that requires consistent weekly execution."
    },
    "actionableRoadmap": ["Step 1", "Step 2", "Step 3"],
    "honestAlternativeRecommendation": "Focus on high-quality niche products rather than generic mass uploads.",
    "isRecommended": true
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
        },
      });

      const parsedData = cleanJsonResponse(response.text || '');
      const rawVid = parsedData.video || parsedData;
      const normalizedVid = normalizeVideo(rawVid, 0);

      res.json({ success: true, data: { video: normalizedVid } });
    } catch (error: any) {
      console.error('Error analyzing single video:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to analyze video.',
      });
    }
  });

  // Strategy Comparison Engine with Search Grounding
  app.post('/api/youtube/compare-strategies', async (req, res) => {
    try {
      const { strategies } = req.body;
      const ai = getGeminiClient();

      const prompt = `Compare the following online earning strategies based on recent YouTube discussions, real user comment sentiment, and industry data:
Strategies to compare: ${JSON.stringify(strategies || ['AI Faceless YouTube Channels', 'Freelance AI Automation Agency (AAA)', 'Digital Products & Notion Templates', 'TikTok Shop Affiliate', 'Print on Demand on Etsy'])}

For each strategy, provide a rigorous reality-check based on what actual people in the YouTube comments and communities report about real earnings, failure rates, startup capital, time commitment, clickbait frequency, and true sustainability.

Return JSON in this format:
{
  "comparisonHeadline": "Executive overview of strategy showdown",
  "comparisonSummary": "Detailed comparative analysis...",
  "rankedStrategies": [
    {
      "rank": 1,
      "name": "Strategy Name",
      "effectivenessScore": 88,
      "feasibilityScore": 85,
      "clickbaitScore": 20,
      "communitySentiment": "82% Positive",
      "averageRealisticMonthlyIncome": "$1,500 - $6,000",
      "timeToFirstProfit": "3 - 5 weeks",
      "startupCost": "$0 - $50",
      "failureRate": "Moderate (Approx 55% quit before month 2)",
      "saturationScore": "Moderate (Skill differentiator)",
      "topPros": ["Pro 1", "Pro 2"],
      "topCons": ["Con 1", "Con 2"],
      "verdict": "Highest reliability and lowest capital risk."
    }
  ],
  "keyTakeaways": [
    "Takeaway 1",
    "Takeaway 2",
    "Takeaway 3"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
        },
      });

      const parsed = cleanJsonResponse(response.text || '');
      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error('Error comparing strategies:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to compare strategies.',
      });
    }
  });

  // Setup Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
