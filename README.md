# UnifyTalk — Frontend Codebase

> Breaking communication barriers for deaf, mute and blind individuals.
> Built by **Ansika**, **Bishnu Kumar Sardar** & **Pallavi M**
> Cambridge Institute of Technology & RNS Institute of Technology, Bengaluru

---

## Project Structure

```
unifytalk-frontend/
├── public/
│   ├── index.html          ← HTML entry point
│   └── logo.svg            ← UnifyTalk logo (SVG)
├── src/
│   ├── index.js            ← React entry point
│   ├── App.jsx             ← Router + Global Nav
│   ├── components/
│   │   └── Logo.jsx        ← Reusable logo component
│   └── pages/
│       ├── Landing.jsx         ← Home / Landing page (Cosmic Purple theme)
│       ├── Phase1_Chat.jsx     ← Chat: Speech↔Text, TTS, 3 disability modes
│       ├── Phase2_Pictograms.jsx ← Pictogram board: 76 symbols, sentence builder
│       ├── Phase3_Phrases.jsx  ← Quick phrases, emotion panel, SOS alerts
│       ├── Phase4_SignAI.jsx   ← Sign language detection (MediaPipe camera)
│       ├── Phase5_ScreenReader.jsx ← Screen reader, voice nav, Braille output
│       └── Phase6_Community.jsx ← Profiles, community forum, settings
├── package.json
└── README.md
```

---

## Routes

| URL            | Page                   |
|----------------|------------------------|
| `/`            | Landing Page           |
| `/chat`        | Phase 1 — Chat         |
| `/board`       | Phase 2 — Pictograms   |
| `/phrases`     | Phase 3 — Phrases      |
| `/signs`       | Phase 4 — Sign AI      |
| `/reader`      | Phase 5 — Screen Reader|
| `/community`   | Phase 6 — Community    |

---

## Setup & Run

### Prerequisites
- Node.js v18+ installed
- npm v9+

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
# Opens at http://localhost:3000

# 3. Build for production
npm run build
# Output in /build folder — ready to deploy
```

---

## Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod

# Your live URL will be: https://unifytalk.vercel.app
```

---

## Backend Integration Guide

This is a pure React frontend. To connect it to your backend:

### 1. API Base URL
Create a `.env` file in the root:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

Then use it in any page:
```js
const res = await fetch(`${process.env.REACT_APP_API_URL}/messages`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Hello' })
});
```

### 2. Key API Endpoints Needed

| Feature              | Endpoint (suggested)           | Method |
|----------------------|-------------------------------|--------|
| Send chat message    | `/api/messages`               | POST   |
| Get community posts  | `/api/posts`                  | GET    |
| Create post          | `/api/posts`                  | POST   |
| Like a post          | `/api/posts/:id/like`         | POST   |
| User login           | `/api/auth/login`             | POST   |
| User register        | `/api/auth/register`          | POST   |
| Get user profile     | `/api/users/:id`              | GET    |
| Update profile       | `/api/users/:id`              | PUT    |
| Save custom phrase   | `/api/phrases`                | POST   |
| Get saved phrases    | `/api/phrases`                | GET    |
| Sign language data   | `/api/signs/detect`           | POST   |
| SOS alert            | `/api/sos`                    | POST   |

### 3. Auth
Use JWT tokens. Store the token in localStorage:
```js
localStorage.setItem('ut_token', token);

// Add to all API calls:
headers: { 'Authorization': `Bearer ${localStorage.getItem('ut_token')}` }
```

---

## Tech Stack

| Layer        | Technology          |
|--------------|---------------------|
| Framework    | React 18            |
| Routing      | React Router v6     |
| Speech       | Web Speech API      |
| Sign Language| MediaPipe Hands     |
| Styling      | CSS-in-JS (inline)  |
| Fonts        | Playfair Display + DM Sans (Google Fonts) |
| Deployment   | Vercel (recommended) |

---

## Theme

**Cosmic Purple** — Deep violet `#08041a` background, purple `#a855f7` + cyan `#06b6d4` accents, Playfair Display serif typography.

---

## Team

| Name                  | Role                         | College                              |
|-----------------------|------------------------------|--------------------------------------|
| Ansika                | Lead Developer & Visionary   | Cambridge Institute of Technology    |
| Bishnu Kumar Sardar   | Backend & Systems Developer  | Cambridge Institute of Technology    |
| Pallavi M             | Research & Accessibility Lead| RNS Institute of Technology          |

---

*UnifyTalk — Every Voice. Every Ability. No Limits.*
