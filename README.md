# Moodsmith 🎨✍️

**Moodsmith** is an AI-powered web application that analyzes the emotional undertones of a user's description (vibe/mood) and translates it into a cohesive visual style system. It generates customized color palettes, professional Google Fonts pairings, and provides direct export tools for CSS variables and JSON files.

Designed with a bold, dynamic, and colorful (rainbow-themed) **Neo-Brutalist** aesthetic.

---

## ✨ Key Features

1. **AI Mood Style Generator**:
   - Analyzes mood/vibe descriptions (e.g., *"cyberpunk synthwave"*, *"cozy autumn morning"*, *"vintage retro coffee shop"*).
   - Generates a **custom 5-color palette** with a unique name fitting the emotional vibe of the input.
   - Intelligently selects a **professional font pairing** (Heading + Body) from a curated database of Google Fonts.

2. **Neo-Brutalist UI/UX**:
   - High-contrast visual styling featuring thick black borders, brutalist shadow drop-shadows, curated bright colors (*coral, tangerine, lemon, lime, sky, grape*), and smooth micro-animations.

3. **Collapsible History Sidebar**:
   - Automatically saves generated styles locally in the browser (`localStorage`).
   - Allows users to instantly recall, review, or delete past generations.

4. **Interactive Export Dashboard**:
   - **CSS Variables Exporter**: Copy custom `:root` CSS properties directly to your clipboard for instant developer integration.
   - **JSON Exporter**: Download the complete generated `MoodResult` schema as a `.json` file using Blob and anchor tags.

5. **Rate Limiting & Input Validation**:
   - Robust input validation on the server side (max 150 characters, XSS protection).
   - Rate limiter powered by **Upstash Redis** (sliding window limit of 15 generations per 24 hours per IP) to prevent API abuse.

---

## 🛠️ Tech Stack & Libraries

- **Framework**: Next.js 15 (App Router, Server-side API Routes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with custom Neo-Brutalist themes & Font Loader)
- **AI Engine**: Groq SDK (`llama-3.1-8b-instant` with automatic fallback to `llama-3.3-70b-versatile`)
- **Database/Caching**: Upstash Redis (for remote rate limiting)
- **Local Storage**: Browser LocalStorage (for client history)

---

## 🚀 Getting Started Locally

Follow these steps to run Moodsmith on your local machine:

### 1. Prerequisites
Make sure you have **Node.js** (v18+) and **npm** installed.

### 2. Clone the Repository
```bash
git clone https://github.com/khanifnaufal/moodsmith.git
cd moodsmith
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a new file named `.env.local` in the root directory and add the following keys:

```env
# Groq Cloud API Key (for AI generation)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Upstash Redis Credentials (for rate limiting)
UPSTASH_REDIS_REST_URL=https://your-database-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token_here
```

*(Note: You can copy and reference from `.env.local.example` if available).*

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

### 6. Build the Project (Optional)
To verify TypeScript compilation and build the production bundle:
```bash
npx tsc --noEmit
npm run build
```

---

## 📦 Export Formats

### CSS Custom Properties (`:root`)
```css
:root {
  --color-1: #1A202C;
  --color-2: #ED8936;
  --color-3: #48BB78;
  --color-4: #38B2AC;
  --color-5: #4299E1;
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Open Sans', sans-serif;
}
```

### JSON Format
```json
{
  "id": "7acfa83b-9e48-4330-80ea-...",
  "palette": {
    "name": "Synthwave Cyberpunk",
    "colors": ["#161616", "#ff6b6b", "#ffa63d", "#ffd93d", "#9b5de5"]
  },
  "font": {
    "id": "cyberpunk-tech",
    "heading": "Orbitron",
    "body": "Share Tech Mono",
    "mood": ["futuristic", "cyberpunk", "tech"],
    "googleFontsUrl": "https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Share+Tech+Mono&display=swap"
  },
  "moodInput": "cyberpunk synthwave",
  "createdAt": "2026-06-27T04:54:15.123Z"
}
```

---

## 🔒 Security & API Key Protection

All interactions with Groq Cloud and Upstash Redis are executed strictly **server-side** within Next.js API Routes (`/api/generate`). Sensitive credentials such as your `GROQ_API_KEY` and Redis REST credentials are never exposed or transmitted to the client's browser, ensuring complete security for your infrastructure.
