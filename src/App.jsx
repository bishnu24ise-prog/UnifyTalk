import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { NotificationProvider, useNotifications } from "./context/NotificationContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { GlobalScreenReaderProvider, useGlobalScreenReader } from "./context/GlobalScreenReaderContext";
import NotificationBanner from "./components/NotificationBanner";
import ShortcutsModal from "./components/ShortcutsModal";

import Landing       from "./pages/Landing";
import Phase1        from "./pages/Phase1_Chat";
import Phase2        from "./pages/Phase2_Pictograms";
import Phase3        from "./pages/Phase3_Phrases";
import Phase4        from "./pages/Phase4_SignAI";
import Phase5        from "./pages/Phase5_ScreenReader";
import Phase6        from "./pages/Phase6_Community";
import SymptomCommunicator from "./pages/SymptomCommunicator";
import EmergencySOS   from "./pages/EmergencySOS";
import Auth           from "./pages/Auth";
import Dashboard      from "./pages/Dashboard";

const NAV_ROUTES = [
  { path:"/",         icon:"🏠", key:"home",         exact:true  },
  { path:"/chat",     icon:"💬", key:"chat"                      },
  { path:"/board",    icon:"🖼️", key:"pictograms"                },
  { path:"/phrases",  icon:"⚡", key:"phrases"                   },
  { path:"/signs",    icon:"🤟", key:"signAI"                    },
  { path:"/reader",   icon:"📖", key:"screenReader"              },
  { path:"/community",icon:"🌍", key:"community"                 },
  { path:"/symptom",  icon:"🤖", key:"symptoms"                  },
  { path:"/emergency",icon:"🚨", key:"emergency"                 },
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

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; transition: background 0.3s, color 0.3s; }

  /* GOOGLE TRANSLATE BANNER SUPPRESSION */
  .goog-te-banner-frame.skiptranslate,
  .goog-te-banner-frame,
  #goog-gt-tt,
  .goog-te-balloon-frame {
    display: none !important;
    visibility: hidden !important;
  }
  body {
    top: 0px !important;
    position: static !important;
  }
  .goog-text-highlight {
    background: transparent !important;
    box-shadow: none !important;
  }
  .skiptranslate iframe {
    display: none !important;
  }

  .ut-navbar {
    position: fixed; top:0; left:0; right:0; z-index:1000;
    height: 60px; padding: 0 20px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px;
    background: rgba(8,4,26,0.94); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    transition: background 0.3s;
  }

  [data-theme="light"] .ut-navbar { background: rgba(245,243,255,0.94); }
  [data-theme="high-contrast"] .ut-navbar { background: rgba(0,0,0,0.98); border-bottom-color: #fff; }

  .ut-nav-logo {
    display: flex; align-items: center; gap: 8px;
    text-decoration: none; flex-shrink: 0;
    font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700;
    background: linear-gradient(90deg, var(--p2), var(--cyan));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .ut-nav-logo-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, var(--p), var(--cyan));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 900; color: white;
    box-shadow: 0 0 14px rgba(168,85,247,0.4);
  }

  .ut-nav-links {
    display: flex; gap: 4px; align-items: center;
    overflow-x: auto; scrollbar-width: none;
    flex: 1 1 auto; min-width: 0;
    margin: 0 8px;
  }
  .ut-nav-links::-webkit-scrollbar { display: none; }

  .ut-nav-item {
    padding: 6px 11px; border-radius: 8px;
    font-size: 12px; font-weight: 500;
    color: var(--muted); text-decoration: none;
    transition: all 0.18s; white-space: nowrap; flex-shrink: 0;
    font-family: 'DM Sans', sans-serif; border: 1px solid transparent;
  }
  .ut-nav-item:hover { color: var(--text); background: rgba(168,85,247,0.08); }
  .ut-nav-item.active {
    background: rgba(168,85,247,0.14);
    border-color: rgba(168,85,247,0.28);
    color: var(--p2);
  }

  .ut-nav-right {
    display: flex; align-items: center; gap: 6px;
    flex-shrink: 0;
  }

  .ut-nav-auth {
    padding: 6px 14px; border-radius: 8px;
    font-size: 12px; font-weight: 600;
    text-decoration: none; cursor: pointer;
    border: 1px solid rgba(168,85,247,0.3);
    background: rgba(168,85,247,0.08);
    color: var(--p2);
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; white-space: nowrap;
  }
  .ut-nav-auth:hover { background: rgba(168,85,247,0.15); border-color: var(--p); }
  .ut-nav-auth.primary {
    background: linear-gradient(135deg, var(--p), var(--cyan));
    color: white; border: none;
    box-shadow: 0 0 12px rgba(168,85,247,0.25);
  }
  .ut-nav-auth.primary:hover { box-shadow: 0 4px 20px rgba(168,85,247,0.4); }
  
  .ut-nav-logout {
    padding: 6px 12px; border-radius: 8px;
    font-size: 12px; font-weight: 600;
    text-decoration: none; cursor: pointer;
    border: 1px solid rgba(244,63,94,0.3);
    background: rgba(244,63,94,0.08);
    color: #fb7185;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; white-space: nowrap;
    display: flex; align-items: center; gap: 4px;
  }
  .ut-nav-logout:hover {
    background: rgba(244,63,94,0.18);
    border-color: #f43f5e;
    color: #f43f5e;
  }

  .ut-nav-theme {
    padding: 6px 10px; border-radius: 8px;
    background: none; border: 1px solid var(--border);
    color: var(--muted); cursor: pointer;
    font-size: 14px; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .ut-nav-theme:hover { border-color: var(--p); color: var(--text); }

  .ut-nav-lang {
    padding: 6px 10px; border-radius: 8px;
    background: rgba(168,85,247,0.08); border: 1px solid var(--border);
    color: var(--text); cursor: pointer;
    font-size: 12px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    outline: none; transition: all 0.2s;
  }
  .ut-nav-lang:hover { border-color: var(--p); background: rgba(168,85,247,0.15); }
  .ut-nav-lang:focus { border-color: var(--cyan); }

  .ut-phase-tag {
    font-size: 11px; padding: 3px 10px; border-radius: 100px;
    background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.25);
    color: var(--cyan); font-weight: 600; white-space: nowrap;
  }

  /* HAMBURGER & MOBILE DRAWER */
  .ut-nav-hamburger {
    display: none;
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(168,85,247,0.1); border: 1px solid var(--border);
    color: var(--text); font-size: 18px; cursor: pointer;
    align-items: center; justify-content: center; transition: all 0.2s;
  }
  .ut-nav-hamburger:hover { border-color: var(--p); background: rgba(168,85,247,0.2); }

  .ut-mobile-drawer {
    display: none;
  }

  .ut-page { padding-top: 60px; min-height: 100vh; }
  .ut-page > * { animation: pageIn 0.3s ease both; }

  @keyframes pageIn {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* RESPONSIVE BREAKPOINTS */
  @media (max-width: 1200px) {
    .ut-phase-tag { display: none; }
  }

  @media (max-width: 860px) {
    .ut-navbar { padding: 0 14px; }
    .ut-nav-links { display: none !important; }
    .ut-nav-desktop-only { display: none !important; }
    .ut-nav-hamburger { display: flex !important; }

    .ut-mobile-drawer-overlay {
      position: fixed; inset: 0; z-index: 999;
      background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease;
    }

    .ut-mobile-drawer {
      display: flex !important;
      position: fixed; top: 60px; left: 0; right: 0; bottom: 0;
      background: rgba(8,4,26,0.98); backdrop-filter: blur(20px);
      border-top: 1px solid var(--border);
      z-index: 1000;
      flex-direction: column; padding: 20px 16px 40px;
      overflow-y: auto; gap: 8px;
      animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .ut-mobile-nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; border-radius: 12px;
      font-size: 14px; font-weight: 600;
      color: var(--text); text-decoration: none;
      background: var(--bg2); border: 1px solid var(--border);
      transition: all 0.2s;
    }
    .ut-mobile-nav-item:hover, .ut-mobile-nav-item.active {
      background: rgba(168,85,247,0.15);
      border-color: var(--p); color: var(--p2);
    }
    .ut-mobile-actions {
      margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border);
      display: flex; flex-direction: column; gap: 10px;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function GlobalNav() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { notify } = useNotifications();
  const { theme, cycleTheme } = useTheme();
  const { lang, changeLang, t, LANGUAGES } = useLanguage();
  const { isActive: isScreenReaderActive, toggleScreenReader } = useGlobalScreenReader();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Accessibility Keyboard Shortcuts (Alt+1..8, Alt+H, Alt+D, Alt+E, Alt+R, Alt+T, Alt+K, ?)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);
      
      // Toggle Shortcuts dialog with ? or Alt+K
      if (!isInput && (e.key === '?' || (e.altKey && e.key.toLowerCase() === 'k'))) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
        return;
      }

      if (e.key === 'Escape') {
        if (isShortcutsOpen) setIsShortcutsOpen(false);
        if (mobileOpen) setMobileOpen(false);
        return;
      }

      if (e.altKey && !e.ctrlKey && !e.metaKey && !isInput) {
        const key = e.key.toLowerCase();
        if (key === 'r') {
          e.preventDefault();
          toggleScreenReader();
          if (notify) notify({ message: isScreenReaderActive ? '🔇 Screen reader disabled' : '🗣️ Screen reader enabled', type: 'info' });
        } else if (key === 't') {
          e.preventDefault();
          cycleTheme();
        } else if (key === 'h' || key === '0') {
          e.preventDefault();
          navigate('/');
        } else if (key === '1') {
          e.preventDefault();
          navigate('/chat');
        } else if (key === '2') {
          e.preventDefault();
          navigate('/board');
        } else if (key === '3') {
          e.preventDefault();
          navigate('/phrases');
        } else if (key === '4') {
          e.preventDefault();
          navigate('/signs');
        } else if (key === '5') {
          e.preventDefault();
          navigate('/reader');
        } else if (key === '6') {
          e.preventDefault();
          navigate('/community');
        } else if (key === '7') {
          e.preventDefault();
          navigate('/symptom');
        } else if (key === '8' || key === 'e') {
          e.preventDefault();
          navigate('/emergency');
        } else if (key === 'd') {
          e.preventDefault();
          navigate('/dashboard');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScreenReaderActive, toggleScreenReader, cycleTheme, navigate, notify, isShortcutsOpen, mobileOpen]);

  const NAV_LABELS = { home: t('home') || 'Home', chat: t('chat'), pictograms: t('pictograms'), phrases: t('phrases'), signAI: t('signAI'), screenReader: t('screenReader'), community: t('community'), symptoms: t('symptoms'), emergency: t('emergency') };

  const idx = NAV_ROUTES.findIndex(r => r.exact ? pathname === r.path : pathname.startsWith(r.path) && r.path !== "/");
  const tag = idx > 0 ? `Phase ${idx}` : pathname === "/dashboard" ? t('dashboard') : pathname === "/auth" ? t('login') : NAV_LABELS.home;

  const themeIcons = { dark: '🌙', light: '☀️', 'high-contrast': '♿' };

  const handleLogout = () => {
    logout();
    if (notify) notify({ message: `👋 ${t('logout') || 'Signed out'}`, type: 'info' });
    navigate('/');
  };

  return (
    <>
      <nav className="ut-navbar" aria-label="Main navigation">
        <NavLink to="/" className="ut-nav-logo" title="UnifyTalk Home (Alt + H)" onClick={() => setMobileOpen(false)}>
          <div className="ut-nav-logo-icon">U</div>
          UnifyTalk
        </NavLink>
        <div className="ut-nav-links">
          {NAV_ROUTES.map(r => (
            <NavLink key={r.path} to={r.path} end={r.exact}
              className={({ isActive }) => `ut-nav-item${isActive ? " active" : ""}`}
              title={r.path === '/emergency' ? 'Emergency SOS (Alt + E / Alt + 8)' : undefined}>
              {r.icon} {NAV_LABELS[r.key] || r.key}
            </NavLink>
          ))}
        </div>
        <div className="ut-nav-right">
          <select
            className="ut-nav-lang"
            value={lang}
            onChange={(e) => changeLang(e.target.value)}
            aria-label={t('selectLanguage') || "Select Language"}
            title="Change Language"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code} style={{ background: '#0e0828', color: '#ede8ff' }}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
          <button
            className={`ut-nav-theme ${isScreenReaderActive ? 'active' : ''}`}
            onClick={toggleScreenReader}
            aria-label={isScreenReaderActive ? "Disable Global Screen Reader (Alt + R)" : "Enable Global Screen Reader (Alt + R)"}
            title="Toggle Global Screen Reader (Alt + R)"
            style={isScreenReaderActive ? { borderColor: 'var(--p)', color: 'var(--text)' } : {}}
          >
            {isScreenReaderActive ? '🗣️' : '🔇'}
          </button>
          <button
            className="ut-nav-theme"
            onClick={cycleTheme}
            aria-label={`Cycle Theme: ${theme} (Alt + T)`}
            title={`Theme: ${theme} (Alt + T)`}
          >
            {themeIcons[theme] || '🌙'}
          </button>
          <button
            className="ut-nav-theme ut-nav-desktop-only"
            onClick={() => setIsShortcutsOpen(true)}
            aria-label="Keyboard Shortcuts (Press ? or Alt + K)"
            title="Keyboard Shortcuts (Press ? or Alt + K)"
          >
            ⌨️
          </button>
          <div className="ut-nav-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {user ? (
              <>
                <button className="ut-nav-auth" onClick={() => navigate('/dashboard')} title={t('dashboard')}>
                  👤 {user.name?.split(' ')[0] || t('dashboard')}
                </button>
                <button className="ut-nav-logout" onClick={handleLogout} title={t('logout') || "Sign Out"} aria-label={t('logout') || "Sign Out"}>
                  🚪 {t('logout') || "Sign Out"}
                </button>
              </>
            ) : (
              <button className="ut-nav-auth primary" onClick={() => navigate('/auth')}>
                🔐 {t('login')}
              </button>
            )}
            <div className="ut-phase-tag">{tag}</div>
          </div>

          {/* Mobile hamburger button */}
          <button
            className="ut-nav-hamburger"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="ut-mobile-drawer-overlay" onClick={() => setMobileOpen(false)} />
          <div className="ut-mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>NAVIGATION</span>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(168,85,247,0.15)', color: 'var(--p2)' }}>{tag}</span>
            </div>

            {NAV_ROUTES.map(r => (
              <NavLink
                key={r.path}
                to={r.path}
                end={r.exact}
                className={({ isActive }) => `ut-mobile-nav-item${isActive ? " active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <span style={{ fontSize: 18 }}>{r.icon}</span>
                <span>{NAV_LABELS[r.key] || r.key}</span>
              </NavLink>
            ))}

            <div className="ut-mobile-actions">
              <button
                className="ut-mobile-nav-item"
                onClick={() => { setIsShortcutsOpen(true); setMobileOpen(false); }}
                style={{ background: 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%' }}
              >
                <span>⌨️</span>
                <span>Keyboard Shortcuts (Alt + K)</span>
              </button>

              {user ? (
                <>
                  <button
                    className="ut-mobile-nav-item"
                    onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}
                    style={{ background: 'rgba(168,85,247,0.1)', cursor: 'pointer', textAlign: 'left', width: '100%', borderColor: 'rgba(168,85,247,0.3)' }}
                  >
                    <span>👤</span>
                    <span>{user.name} ({t('dashboard')})</span>
                  </button>
                  <button
                    className="ut-mobile-nav-item"
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    style={{ background: 'rgba(244,63,94,0.1)', color: '#fb7185', borderColor: 'rgba(244,63,94,0.3)', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                  >
                    <span>🚪</span>
                    <span>{t('logout') || "Sign Out"}</span>
                  </button>
                </>
              ) : (
                <button
                  className="ut-mobile-nav-item"
                  onClick={() => { navigate('/auth'); setMobileOpen(false); }}
                  style={{ background: 'linear-gradient(135deg, var(--p), var(--cyan))', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%', justifyContent: 'center' }}
                >
                  <span>🔐</span>
                  <span>{t('login') || "Sign In"}</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </>
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

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', flexDirection:'column', gap:16 }}>
        <div style={{ fontSize:40, animation:'spin 1s linear infinite' }}>⏳</div>
        <p style={{ color:'var(--muted)', fontSize:14 }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    // Store intended destination so user lands there after login
    sessionStorage.setItem('redirectAfterLogin', pathname);
    return <Auth />;
  }

  return children;
}

export default function App() {
  return (
    <LanguageProvider>
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <style>{globalStyles}</style>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <BrowserRouter>
            <GlobalScreenReaderProvider>
            <ScrollTop />
            <GlobalNav />
            <NotificationBanner />
            <div className="ut-page" id="main-content">
              <Routes>
                <Route path="/"          element={<Landing />} />
                <Route path="/auth"      element={<Auth />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/chat"      element={<ProtectedRoute><Phase1 /></ProtectedRoute>} />
                <Route path="/board"     element={<ProtectedRoute><Phase2 /></ProtectedRoute>} />
                <Route path="/phrases"   element={<ProtectedRoute><Phase3 /></ProtectedRoute>} />
                <Route path="/signs"     element={<ProtectedRoute><Phase4 /></ProtectedRoute>} />
                <Route path="/reader"    element={<ProtectedRoute><Phase5 /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><Phase6 /></ProtectedRoute>} />
                <Route path="/symptom"   element={<ProtectedRoute><SymptomCommunicator /></ProtectedRoute>} />
                <Route path="/emergency" element={<ProtectedRoute><EmergencySOS /></ProtectedRoute>} />
                <Route path="*"          element={<NotFound/>} />
              </Routes>
            </div>
            </GlobalScreenReaderProvider>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
    </LanguageProvider>
  );
}