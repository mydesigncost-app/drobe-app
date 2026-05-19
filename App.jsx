import { useState } from "react";
import DrobeOnboarding from "./drobe-onboarding-v2";
import DigitalCloset   from "./drobe-closet";
import StyleAI         from "./drobe-style-ai";
import Dashboard       from "./drobe-dashboard";
import OutfitCalendar  from "./drobe-calendar";

const SCREENS = ["onboarding", "home", "closet", "styleai", "calendar"];

export default function App() {
  const [screen, setScreen] = useState("onboarding");

  const navigate = (to) => {
    if (SCREENS.includes(to)) setScreen(to);
  };

  const showNav = screen !== "onboarding";

  const NAV = [
    {
      id: "home", label: "Home",
      icon: (a) => <svg width="20" height="20" fill="none" stroke={a?"#1A1A1A":"#BBB"} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round"/></svg>
    },
    {
      id: "closet", label: "Closet",
      icon: (a) => <svg width="20" height="20" fill="none" stroke={a?"#1A1A1A":"#BBB"} strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
    },
    {
      id: "styleai", label: "Style AI",
      icon: (a) => <svg width="20" height="20" fill="none" stroke={a?"#1A1A1A":"#BBB"} strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" strokeLinecap="round"/></svg>
    },
    {
      id: "calendar", label: "Calendar",
      icon: (a) => <svg width="20" height="20" fill="none" stroke={a?"#1A1A1A":"#BBB"} strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/></svg>
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8F6F1",
      fontFamily: "'Cormorant Garamond','Georgia',serif",
      maxWidth: 420,
      margin: "0 auto",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .bottom-nav {
          position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 100%; max-width: 420px; height: 64px;
          background: #F8F6F1; border-top: 0.5px solid #E8E4DC;
          display: flex; align-items: center; justify-content: space-around;
          padding: 0 8px 8px; z-index: 100;
        }
        .nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          cursor: pointer; padding: 6px 16px; border-radius: 8px;
          transition: background 0.15s;
        }
        .nav-item:hover { background: #F0EDE8; }
        .nav-label {
          font-family: 'DM Sans', sans-serif; font-size: 9px;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .nav-dot { width: 4px; height: 4px; border-radius: 50%; background: #1A1A1A; }
        .screen-content { padding-bottom: ${showNav ? "64px" : "0"}; min-height: 100vh; }
      `}</style>

      {/* Active screen — only render the current one for performance */}
      <div className="screen-content">
        {screen === "onboarding" && (
          <DrobeOnboarding onComplete={() => navigate("home")} />
        )}
        {screen === "home" && (
          <Dashboard onNavigate={navigate} />
        )}
        {screen === "closet" && (
          <DigitalCloset onNavigate={navigate} />
        )}
        {screen === "styleai" && (
          <StyleAI onNavigate={navigate} />
        )}
        {screen === "calendar" && (
          <OutfitCalendar onNavigate={navigate} />
        )}
      </div>

      {/* Bottom nav — hidden on onboarding */}
      {showNav && (
        <nav className="bottom-nav">
          {NAV.map(({ id, label, icon }) => {
            const active = screen === id;
            return (
              <div key={id} className="nav-item" onClick={() => navigate(id)}>
                {icon(active)}
                <span className="nav-label" style={{ color: active ? "#1A1A1A" : "#BBB" }}>
                  {label}
                </span>
                {active && <div className="nav-dot" />}
              </div>
            );
          })}
        </nav>
      )}
    </div>
  );
}
