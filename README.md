# YouTube Online Earning Analyzer & Comment Sentiment Engine

> **Forensic AI Auditor for Online Earning Videos, Side Hustles, and Digital Business Strategies**  
> Powered by Google Gemini 3.7 Flash & Live Google Search Grounding.

---

## 🌟 Overview

**YouTube Online Earning Analyzer** is a full-stack investigative tool designed to cut through the hype and exaggerated income claims pervasive in online earning and side hustle videos on YouTube.

By grounding queries in live YouTube video releases and performing automated audience sentiment analysis across real viewer comments, the engine calculates an objective **Feasibility Score (0–100%)**, uncovers **hidden paywalls/catches**, and synthesizes side-by-side **Strategy Comparison Matrices**.

---

## 🚀 Key Features

- **🔍 Live YouTube & Web Grounding**: Leverages Gemini 3.7 Flash with Google Search Grounding to locate recent video uploads (past 7 days to 3 months) matching any niche, creator name, or keyword query.
- **💬 Real Audience Comment Sentiment Analysis**: Mines viewer feedback to detect proof of success, hidden expenses, saturation warnings, and scam alerts.
- **⚖️ Guru Claims vs. Actual Reality**: Directly contrasts thumbnail and hook promises (e.g., *"$10K in 7 Days with Zero Skills"*) with real-world execution requirements.
- **📊 Interactive Strategy Reality Matrix**: Sortable, filterable benchmark comparing startup costs, time-to-first-dollar, saturation, and community consensus.
- **🎯 Single Video URL Forensics**: Paste any specific YouTube video link or title to run an instant forensic audit on its feasibility.
- **⚔️ Strategy Showdown**: Compare 2–4 side hustles head-to-head (e.g., *AI Automation Agencies vs. Faceless YouTube Shorts*).
- **📥 Multi-Format Report Export**: Download comprehensive analysis reports as formatted Markdown, JSON, or copy directly to clipboard.
- **💾 Local Persistence**: Automatically saves search history and bookmarked strategies across sessions.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion
- **Backend**: Node.js, Express, Vite middleware integration, TypeScript (`tsx`)
- **AI & Grounding Engine**: `@google/genai` (Gemini 3.7 Flash with Google Search Grounding)
- **Bundler & Build**: Vite & `esbuild` for production single-file CommonJS bundling

---

## 📋 Prerequisites

- **Node.js**: Version 18.x or 20.x+
- **NPM** or **Bun** / **Yarn** / **PNPM**
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/).

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Gemini API Key (Required for live search & sentiment analysis)
GEMINI_API_KEY=your_gemini_api_key_here

# Port (Optional, defaults to 3000)
PORT=3000
```

---

## 🏃 Quick Start (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/yt-earning-auditor.git
   cd yt-earning-auditor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   # Edit .env and insert your GEMINI_API_KEY
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

---

## 📦 Production Build & Run

To build the optimized static assets and server bundle:

```bash
# Compile client and server
npm run build

# Start production server
npm start
```

---

## 🚢 Deployment Guide (GitHub Ready)

### 1. Deploy on Google Cloud Run (Recommended)
This app is container-ready. Deploy via Google Cloud CLI:

```bash
gcloud run deploy yt-earning-auditor \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_api_key_here
```

### 2. Deploy on Render
1. Create a new **Web Service** and connect your GitHub repository.
2. Select **Node** environment.
3. Configure build & start commands:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variable:
   - `GEMINI_API_KEY`: `your_api_key_here`

### 3. Deploy on Railway
1. Click **New Project** → **Deploy from GitHub repo**.
2. Railway will auto-detect the Node.js project.
3. Under **Variables**, add `GEMINI_API_KEY`.
4. Deploy!

### 4. Deploy with Docker
Build and run the Docker container:

```bash
docker build -t yt-earning-auditor .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_api_key_here yt-earning-auditor
```

---

## 📁 Project Structure

```
├── server.ts                 # Express server & Gemini AI search/analysis routes
├── index.html                # Single Page Application HTML entry
├── vite.config.ts            # Vite & Tailwind CSS plugins
├── metadata.json             # Applet capabilities and metadata
├── package.json              # Project dependencies and build scripts
├── src/
│   ├── main.tsx              # React DOM entry point
│   ├── App.tsx               # Primary application state, tabs, & filter coordinator
│   ├── index.css             # Tailwind CSS base styles
│   ├── types.ts              # TypeScript interfaces for analysis, comments, & reports
│   └── components/
│       ├── Header.tsx                 # Navigation bar, status indicator, export & saved bookmarks
│       ├── SearchControls.tsx         # Keyword search, category, timeframe, difficulty, budget selectors
│       ├── LiveAuditHero.tsx          # Initial interactive discovery hub with curated queries
│       ├── LiveAuditingIndicator.tsx  # Multi-step progress tracker during live search
│       ├── ExecutiveSummary.tsx       # KPI metrics, consensus analysis, top recommendation, trap spotlight
│       ├── VideoCard.tsx              # Detailed video card with comment quotes, roadmap, & sentiment
│       ├── SentimentBar.tsx           # Positive / Neutral / Negative visual ratio bar
│       ├── StrategyComparisonTable.tsx# Sortable side-by-side Strategy Reality Matrix
│       ├── SingleVideoAnalyzer.tsx    # Forensic URL inspector for specific YouTube videos
│       ├── StrategyShowdown.tsx       # Head-to-head comparison engine
│       └── ExportModal.tsx            # Multi-format report exporter (Markdown, JSON, Print)
└── dist/                     # Production build artifacts (generated on build)
```

---

## 📄 License

MIT License — feel free to use, modify, and distribute for personal or commercial projects.
