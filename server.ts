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

function cleanJsonResponse(rawText: string): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  
  // Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // If there's surrounding text, extract between first { or [ and last } or ]
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Search & Deep Sentiment Analysis of YouTube Online Earning Videos from the past month
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

      const prompt = `You are an elite investigative digital economy analyst and YouTube audience sentiment expert.
Perform a live search on YouTube and the web for videos published in the ${timeframe} (recent uploads within the last 30-45 days) specifically focusing on ONLINE EARNING, side hustles, making money online, AI automated businesses, freelancing, and digital products.
Target Niche / Focus: ${niche} ${customKeywords ? `(Keywords: ${customKeywords})` : ''}
Difficulty Preference: ${difficulty}
Budget Level: ${budget}

Your objectives:
1. Search and identify 5-8 distinct, real YouTube videos published in the past month about making money online / online earning. Look for actual titles, creator/channel names, authentic YouTube video URLs (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...), and real upload dates.
2. For EACH video found, thoroughly investigate:
   - What is the exact online earning strategy proposed?
   - What are the creator's claimed earnings and timeline? (e.g. "$5,000 in 7 days with AI")
   - AUDIENCE COMMENT SENTIMENT ANALYSIS: What are real viewers saying in the comments?
     * Identify real comment sentiments: Did viewers actually succeed? Did they face hidden paywalls, account bans, API costs, or extreme saturation?
     * Extract 3-4 representative comment quotes/themes (categorized as proof of success, hidden catch, saturation warning, or scam alert).
     * Calculate positive%, neutral%, negative% sentiment breakdown.
   - REAL FEASIBILITY & EFFECTIVENESS: Give an objective score (0 to 100) on whether this strategy actually works in practice, not just in theory.
   - GURU vs REALITY COMPARISON: Contrast what the video thumbnail/hook promises vs what commenters actually experienced.
   - HIDDEN CATCHES & PREREQUISITES: What the video glossed over (e.g. initial ad spend, Stripe merchant account requirements, copyright flags, high churn).
3. Synthesize a comprehensive Comparison Matrix comparing all identified strategies side-by-side to highlight:
   - The #1 truly effective strategy with the highest audience success rate.
   - The biggest "trap/hype" strategy that fails most viewers.
   - A comparison table comparing difficulty, startup cost, sentiment score, and practical viability.

RETURN ONLY A VALID JSON OBJECT matching this exact structure (no preamble, no markdown formatting outside JSON):
{
  "summary": "Detailed executive synthesis of the findings across recent YouTube online earning videos...",
  "timeframe": "${timeframe}",
  "searchQuery": "${niche} ${customKeywords}",
  "totalAnalyzed": 6,
  "topRecommendedStrategy": {
    "name": "Strategy Name",
    "whyEffective": "Reason based on commenter success and business fundamentals...",
    "targetAudience": "Who this works best for..."
  },
  "biggestTrapStrategy": {
    "name": "Trap Strategy Name",
    "whyMisleading": "Why the guru claims clash with commenter realities...",
    "commonPitfall": "Specific breakdown of where 90% of viewers fail..."
  },
  "strategyComparisonTable": [
    {
      "strategyName": "Strategy Name",
      "communitySentimentScore": 85,
      "practicalSuccessRate": "High (approx 40-50% with effort)",
      "startupCost": "$0 - $30",
      "difficulty": "Beginner",
      "keyPros": "Clear demand, immediate client feedback",
      "keyCons": "Requires outreach persistence",
      "verdict": "Verified Effective / Proceed"
    }
  ],
  "videos": [
    {
      "id": "vid-1",
      "title": "Exact or realistic Video Title",
      "channelName": "Channel Name",
      "channelUrl": "https://www.youtube.com/@channelName",
      "videoUrl": "https://www.youtube.com/watch?v=...",
      "videoId": "extracted_id_or_empty",
      "publishedDate": "e.g. 2 weeks ago (August 2026)",
      "viewsEstimate": "e.g. 145K views",
      "strategyName": "e.g. Niche B2B Lead Gen with Custom AI Workflows",
      "strategyCategory": "AI & Automation",
      "claimedEarning": "$10,000 / Month",
      "claimedTimeline": "30 Days",
      "realFeasibilityScore": 84,
      "effectivenessRating": "Highly Effective",
      "sentimentBreakdown": {
        "positivePercent": 74,
        "neutralPercent": 16,
        "negativePercent": 10
      },
      "overallSentiment": "Overwhelmingly Positive",
      "startupCapitalNeeded": "$0 - $50",
      "timeToFirstDollar": "2 - 3 weeks",
      "saturationLevel": "Low",
      "skillPrerequisites": ["Basic understanding of Make/Zapier", "Cold email fundamentals"],
      "hiddenCatches": ["Domain warmup takes 14 days", "Must handle email deliverability"],
      "pros": ["High profit margins", "Recurring monthly retainers"],
      "cons": ["Requires active outreach", "Client communication needed"],
      "representativeComments": [
        {
          "author": "TechFreelancer92",
          "sentiment": "positive",
          "comment": "Landed my first $750 client after sending 40 tailored video audits using this framework.",
          "likes": "420",
          "category": "proof_of_success"
        },
        {
          "author": "Marcus_Dev",
          "sentiment": "warning",
          "comment": "Make sure you factor in the OpenAI API costs when building multi-step automations.",
          "likes": "184",
          "category": "hidden_catch"
        }
      ],
      "audienceVerdict": "Commenters validate that businesses actively pay for this, but emphasize that lead quality matters more than spamming.",
      "guruVsRealityComparison": {
        "guruClaim": "No skills needed, 100% automated passive income while you sleep",
        "actualReality": "Active service business that requires client relationship management, but very lucrative once established."
      },
      "actionableRoadmap": [
        "Pick 1 specific B2B vertical (e.g. real estate agents or dental clinics)",
        "Build a sample 1-click lead qualification workflow",
        "Send 10 personalized Loom video demonstrations per day"
      ],
      "isRecommended": true
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
        },
      });

      const rawText = response.text || '';
      const parsedData = cleanJsonResponse(rawText);

      // Extract grounding links if available
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any) => web && web.uri)
        .map((web: any) => ({
          title: web.title || 'YouTube / Web Reference',
          url: web.uri,
        }));

      res.json({
        success: true,
        data: {
          ...parsedData,
          groundingSources: sources.length > 0 ? sources : undefined,
        },
      });
    } catch (error: any) {
      console.error('Error searching YouTube earning videos:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to search and analyze YouTube earning videos.',
      });
    }
  });

  // Deep Single Video Audit (User pastes any URL or video topic)
  app.post('/api/youtube/analyze-single-video', async (req, res) => {
    try {
      const { videoUrlOrQuery } = req.body;
      if (!videoUrlOrQuery || !videoUrlOrQuery.trim()) {
        return res.status(400).json({ success: false, error: 'Please provide a YouTube video URL or topic.' });
      }

      const ai = getGeminiClient();

      const prompt = `You are a forensic YouTube analyst specializing in online business models, income claims, and viewer feedback.
Analyze the following YouTube video link or specific online earning video query:
"${videoUrlOrQuery}"

Search the web and YouTube for information about this specific video, its creator, the strategy presented, and most importantly, the REAL VIEWER COMMENTS and audience reception.

Investigate:
1. Video Title, Channel, estimated views, upload date, and core thesis.
2. The exact earning strategy: what is claimed vs what is required.
3. COMMENT SENTIMENT & AUDIENCE FEEDBACK:
   - What are commenters reporting? Did anyone replicate the results?
   - What are the major complaints, scam allegations, or hidden expenses highlighted by viewers?
   - Break down sentiment into positive%, neutral%, negative%.
4. Feasibility & Scam/Hype score (0 to 100).
5. The "Unsaid Truth": The hidden barriers the creator didn't emphasize (e.g. need existing audience, ad spend, high refund rate).
6. 4 representative comment snippets across categories (proof_of_success, hidden_catch, saturation_warning, scam_alert).
7. Clear step-by-step verdict and practical alternative if this strategy is flawed.

RETURN ONLY A VALID JSON OBJECT matching this structure:
{
  "video": {
    "id": "single-vid-1",
    "title": "Video Title",
    "channelName": "Channel Name",
    "channelUrl": "https://www.youtube.com/@channelName",
    "videoUrl": "${videoUrlOrQuery.startsWith('http') ? videoUrlOrQuery : 'https://www.youtube.com/results?search_query=' + encodeURIComponent(videoUrlOrQuery)}",
    "publishedDate": "Upload Date or Recent",
    "viewsEstimate": "View estimate",
    "strategyName": "Strategy Name",
    "strategyCategory": "AI & Automation",
    "claimedEarning": "e.g. $3,000 / Week",
    "claimedTimeline": "e.g. 14 Days",
    "realFeasibilityScore": 72,
    "effectivenessRating": "Moderately Effective",
    "sentimentBreakdown": {
      "positivePercent": 60,
      "neutralPercent": 25,
      "negativePercent": 15
    },
    "overallSentiment": "Cautiously Optimistic",
    "startupCapitalNeeded": "$100 - $300",
    "timeToFirstDollar": "3 - 6 weeks",
    "saturationLevel": "Medium",
    "skillPrerequisites": ["List of requirements"],
    "hiddenCatches": ["Hidden costs or caveats"],
    "pros": ["Key strengths"],
    "cons": ["Key downsides"],
    "representativeComments": [
      {
        "author": "Username",
        "sentiment": "positive",
        "comment": "Comment quote...",
        "likes": "120",
        "category": "proof_of_success"
      }
    ],
    "audienceVerdict": "Detailed synthesis of user comment consensus...",
    "guruVsRealityComparison": {
      "guruClaim": "What the video claimed",
      "actualReality": "What viewers and real data show"
    },
    "actionableRoadmap": ["Step 1", "Step 2", "Step 3"],
    "isRecommended": true
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
        },
      });

      const parsedData = cleanJsonResponse(response.text || '');
      res.json({ success: true, data: parsedData });
    } catch (error: any) {
      console.error('Error analyzing single video:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to analyze video.',
      });
    }
  });

  // Strategy Comparison Engine
  app.post('/api/youtube/compare-strategies', async (req, res) => {
    try {
      const { strategies } = req.body;
      const ai = getGeminiClient();

      const prompt = `Compare the following online earning strategies based on recent YouTube discussions, real user comment sentiment, and industry data:
Strategies to compare: ${JSON.stringify(strategies || ['AI Faceless YouTube Channels', 'Freelance AI Automation Agency (AAA)', 'Digital Products & Notion Templates', 'TikTok Shop Affiliate', 'Print on Demand on Etsy'])}

For each strategy, provide a rigorous reality-check based on what actual people in the YouTube comments and communities report about real earnings, failure rates, startup capital, time commitment, and true sustainability.

Return JSON in this format:
{
  "comparisonHeadline": "Executive overview of strategy showdown",
  "comparisonSummary": "Detailed comparative analysis...",
  "rankedStrategies": [
    {
      "rank": 1,
      "name": "Strategy Name",
      "effectivenessScore": 88,
      "communitySentiment": "82% Positive",
      "averageRealisticMonthlyIncome": "$1,500 - $6,000",
      "timeToFirstProfit": "3 - 5 weeks",
      "startupCost": "$0 - $50",
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
        model: 'gemini-3.7-flash',
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
