import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Landing       from "./pages/Landing";
import Phase1        from "./pages/Phase1_Chat";
import Phase2        from "./pages/Phase2_Pictograms";
import Phase3        from "./pages/Phase3_Phrases";
import Phase4        from "./pages/Phase4_SignAI";
import Phase5        from "./pages/Phase5_ScreenReader";
import Phase6        from "./pages/Phase6_Community";
import SymptomCommunicator from "./pages/SymptomCommunicator";
import EmergencySOS   from "./pages/EmergencySOS";

const NAV_ROUTES = [
  { path:"/",         label:"🏠 Home",          exact:true  },
  { path:"/chat",     label:"💬 Chat"                        },
  { path:"/board",    label:"🖼️ Pictograms"                  },
  { path:"/phrases",  label:"⚡ Phrases"                     },
  { path:"/signs",    label:"🤟 Sign AI"                     },
  { path:"/reader",   label:"📖 Screen Reader"               },
  { path:"/community",label:"🌍 Community"                   },
  { path:"/symptom",  label:"🤖 AI Symptom"                  },
  { path:"/emergency",label:"🚨 Emergency SOS"               },
];

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

  * { margin:0; padding:0; box-sizing:border-box; }

  :root {
    --bg:     #08041a;
    --bg2:    #0e0828;
    --border: #2a1560;
    --p:      #a855f7;
    --p2:     #c084fc;
    --cyan:   #06b6d4;
    --text:   #ede8ff;
    --muted:  #7c6aaa;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  .ut-navbar {
    position: fixed; top:0; left:0; right:0; z-index:1000;
    height: 56px; padding: 0 28px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(8,4,26,0.92); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }

  .ut-nav-logo {
    display: flex; align-items: center; gap: 8px;
    text-decoration: none;
    font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700;
    background: linear-gradient(90deg, var(--p2), var(--cyan));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .ut-nav-logo-icon {
    width: 28px; height: 28px; border-radius: 7px;
    background: linear-gradient(135deg, var(--p), var(--cyan));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 900; color: white;
    box-shadow: 0 0 14px rgba(168,85,247,0.4);
  }

  .ut-nav-links {
    display: flex; gap: 2px; align-items: center;
    overflow-x: auto; scrollbar-width: none;
  }
  .ut-nav-links::-webkit-scrollbar { display: none; }

  .ut-nav-item {
    padding: 6px 12px; border-radius: 8px;
    font-size: 12px; font-weight: 500;
    color: var(--muted); text-decoration: none;
    transition: all 0.18s; white-space: nowrap;
    font-family: 'DM Sans', sans-serif; border: 1px solid transparent;
  }
  .ut-nav-item:hover { color: var(--text); background: rgba(168,85,247,0.07); }
  .ut-nav-item.active {
    background: rgba(168,85,247,0.12);
    border-color: rgba(168,85,247,0.25);
    color: var(--p2);
  }

  .ut-phase-tag {
    font-size: 11px; padding: 3px 10px; border-radius: 100px;
    background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.25);
    color: var(--cyan); font-weight: 600; white-space: nowrap;
  }

  .ut-page { padding-top: 56px; min-height: 100vh; }
  .ut-page > * { animation: pageIn 0.3s ease both; }

  @keyframes pageIn {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ACCESSIBILITY ENHANCEMENTS */
  /* Skip Link */
  .skip-link {
    position: absolute; top: -40px; left: 6px; z-index: 10000;
    background: var(--p); color: white; padding: 8px 16px;
    text-decoration: none; border-radius: 4px; font-weight: 600;
    transition: top 0.2s;
  }
  .skip-link:focus { top: 6px; }

  /* Focus Indicators */
  *:focus {
    outline: 2px solid var(--cyan) !important;
    outline-offset: 2px !important;
  }
  button:focus, a:focus, input:focus, textarea:focus, select:focus {
    outline: 2px solid var(--p) !important;
    outline-offset: 2px !important;
  }

  /* High Contrast Mode */
  @media (prefers-contrast: high) {
    :root {
      --bg: #000000;
      --text: #ffffff;
      --muted: #cccccc;
      --border: #ffffff;
    }
  }

  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }

  .ut-404 {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 80vh;
    gap: 16px; text-align: center; padding: 24px;
  }

  .ut-404 h2 {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 900; color: var(--text);
  }

  .ut-404 p { color: var(--muted); max-width: 380px; line-height: 1.7; font-size: 15px; }

  .ut-404-btn {
    padding: 12px 28px; border-radius: 12px; border: none; cursor: pointer;
    background: linear-gradient(135deg, var(--p), var(--cyan));
    color: white; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 14px;
    text-decoration: none; display: inline-block;
  }

  @media(max-width: 768px) {
    .ut-navbar { padding: 0 16px; }
    .ut-phase-tag { display: none; }
    .ut-nav-item { padding: 5px 9px; font-size: 11px; }
  }
`;

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function GlobalNav() {
  const { pathname } = useLocation();
  const idx = NAV_ROUTES.findIndex(r => r.exact ? pathname === r.path : pathname.startsWith(r.path) && r.path !== "/");
  const tag = idx > 0 ? `Phase ${idx}` : "Home";
  return (
    <nav className="ut-navbar">
      <NavLink to="/" className="ut-nav-logo">
        <div className="ut-nav-logo-icon">U</div>
        UnifyTalk
      </NavLink>
      <div className="ut-nav-links">
        {NAV_ROUTES.map(r => (
          <NavLink key={r.path} to={r.path} end={r.exact}
            className={({ isActive }) => `ut-nav-item${isActive ? " active" : ""}`}>
            {r.label}
          </NavLink>
        ))}
      </div>
      <div className="ut-phase-tag">{tag}</div>
    </nav>
  );
}

function NotFound() {
  return (
    <div className="ut-404">
      <div style={{ fontSize: 52 }}>🔮</div>
      <h2>Page Not Found</h2>
      <p>This page doesn't exist. Head back home to explore UnifyTalk.</p>
      <NavLink to="/" className="ut-404-btn">← Back to Home</NavLink>
    </div>
  );
}

export default function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <BrowserRouter>
        <ScrollTop />
        <GlobalNav />
        <div className="ut-page" id="main-content">
          <Routes>
            <Route path="/"          element={<Landing />} />
            <Route path="/chat"      element={<Phase1  />} />
            <Route path="/board"     element={<Phase2  />} />
            <Route path="/phrases"   element={<Phase3  />} />
            <Route path="/signs"     element={<Phase4  />} />
            <Route path="/reader"    element={<Phase5  />} />
            <Route path="/community" element={<Phase6  />} />
            <Route path="/symptom"   element={<SymptomCommunicator />} />
            <Route path="/emergency" element={<EmergencySOS />} />
            <Route path="*"          element={<NotFound/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}