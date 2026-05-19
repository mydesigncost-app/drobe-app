import { useState } from "react";

const STYLE_OPTIONS = [
  { id: "minimal", label: "Minimal", desc: "Clean lines, neutral tones", emoji: "◻" },
  { id: "classic", label: "Classic", desc: "Timeless, polished, refined", emoji: "◈" },
  { id: "streetwear", label: "Street", desc: "Bold, urban, expressive", emoji: "◆" },
  { id: "romantic", label: "Romantic", desc: "Soft, feminine, flowing", emoji: "◇" },
  { id: "editorial", label: "Editorial", desc: "Avant-garde, statement pieces", emoji: "◉" },
  { id: "sporty", label: "Sporty", desc: "Athletic, functional, fresh", emoji: "○" },
];

const OCCASION_OPTIONS = [
  "Daily wear", "Work & meetings", "Date nights", "Travel", "Events & parties", "Gym & active"
];

const PRIORITY_OPTIONS = [
  { id: "outfit", label: "Daily outfit ideas" },
  { id: "closet", label: "Organize my closet" },
  { id: "shop", label: "Shop smarter" },
  { id: "travel", label: "Plan travel looks" },
];

const STEPS = ["welcome", "name", "style", "occasions", "priorities", "done"];

export default function DrobeOnboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [form, setForm] = useState({ name: "", styles: [], occasions: [], priorities: [] });

  const currentStep = STEPS[step];

  const goNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setStep((s) => Math.min(s + 1, STEPS.length - 1)); setAnimating(false); }, 280);
  };

  const goBack = () => {
    if (animating || step === 0) return;
    setAnimating(true);
    setTimeout(() => { setStep((s) => Math.max(s - 1, 0)); setAnimating(false); }, 280);
  };

  const toggleStyle = (id) => setForm((f) => ({ ...f, styles: f.styles.includes(id) ? f.styles.filter((s) => s !== id) : [...f.styles, id] }));
  const toggleOccasion = (o) => setForm((f) => ({ ...f, occasions: f.occasions.includes(o) ? f.occasions.filter((x) => x !== o) : [...f.occasions, o] }));
  const togglePriority = (id) => setForm((f) => ({ ...f, priorities: f.priorities.includes(id) ? f.priorities.filter((x) => x !== id) : [...f.priorities, id] }));

  const canProceed = () => {
    if (currentStep === "name") return form.name.trim().length > 0;
    if (currentStep === "style") return form.styles.length > 0;
    if (currentStep === "occasions") return form.occasions.length > 0;
    if (currentStep === "priorities") return form.priorities.length > 0;
    return true;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F6F1", fontFamily: "'Cormorant Garamond', 'Georgia', serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .drobe-screen { width: 100%; max-width: 420px; min-height: 100vh; display: flex; flex-direction: column; padding: 0 28px 40px; position: relative; }

        .welcome-screen { width: 100%; max-width: 420px; min-height: 100vh; display: flex; flex-direction: column; position: relative; overflow: hidden; }
        .welcome-bg { position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80&fit=crop&crop=top'); background-size: cover; background-position: center top; z-index: 0; }
        .welcome-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.5) 62%, rgba(0,0,0,0.88) 100%); z-index: 1; }
        .welcome-content { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: space-between; min-height: 100vh; padding: 64px 28px 48px; }

        .grain-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); opacity: 0.4; }

        .style-chip { border: 0.5px solid #D4CFC6; border-radius: 2px; padding: 14px 16px; cursor: pointer; transition: all 0.18s ease; background: transparent; text-align: left; }
        .style-chip:hover { border-color: #1A1A1A; background: #fff; }
        .style-chip.selected { border-color: #1A1A1A; background: #1A1A1A; color: #F8F6F1; }

        .pill { border: 0.5px solid #D4CFC6; border-radius: 100px; padding: 10px 20px; cursor: pointer; transition: all 0.18s ease; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 400; color: #1A1A1A; white-space: nowrap; }
        .pill:hover { border-color: #1A1A1A; }
        .pill.selected { background: #1A1A1A; color: #F8F6F1; border-color: #1A1A1A; }

        .priority-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 0.5px solid #E8E4DC; cursor: pointer; transition: all 0.15s ease; }
        .priority-row:first-child { border-top: 0.5px solid #E8E4DC; }
        .priority-row:hover .priority-check { border-color: #1A1A1A; }

        .priority-check { width: 20px; height: 20px; border: 1px solid #D4CFC6; border-radius: 2px; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; flex-shrink: 0; }
        .priority-check.checked { background: #1A1A1A; border-color: #1A1A1A; }

        .cta-btn { width: 100%; padding: 16px; background: #1A1A1A; color: #F8F6F1; border: none; border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.18s ease; }
        .cta-btn:hover:not(:disabled) { background: #2D2D2D; }
        .cta-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .cta-btn.ghost { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.35); }
        .cta-btn.ghost:hover { border-color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.08); }
        .cta-btn.ghost-dark { background: transparent; color: #1A1A1A; border: 0.5px solid #D4CFC6; }
        .cta-btn.ghost-dark:hover { border-color: #1A1A1A; }

        .name-input { width: 100%; background: transparent; border: none; border-bottom: 0.5px solid #D4CFC6; padding: 12px 0; font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: #1A1A1A; outline: none; transition: border-color 0.2s; }
        .name-input::placeholder { color: #C4BFB5; }
        .name-input:focus { border-bottom-color: #1A1A1A; }

        .progress-bar-track { width: 100%; height: 1px; background: #E8E4DC; position: relative; }
        .progress-bar-fill { height: 1px; background: #1A1A1A; transition: width 0.5s cubic-bezier(0.22,1,0.36,1); }

        .done-mark { width: 64px; height: 64px; border: 1px solid #1A1A1A; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; animation: scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards; }
        @keyframes scaleIn { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up   { animation: fadeUp 0.6s 0.00s ease both; }
        .fade-up-1 { animation: fadeUp 0.6s 0.12s ease both; }
        .fade-up-2 { animation: fadeUp 0.6s 0.25s ease both; }
        .fade-up-3 { animation: fadeUp 0.6s 0.40s ease both; }
        .fade-up-4 { animation: fadeUp 0.6s 0.55s ease both; }
      `}</style>

      <div className="grain-overlay" />

      {/* ── WELCOME: full-bleed photo ── */}
      {currentStep === "welcome" && (
        <div className="welcome-screen">
          <div className="welcome-bg" />
          <div className="welcome-overlay" />
          <div className="welcome-content">
            <div className="fade-up">
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.22em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
                Your personal AI stylist
              </span>
              <h1 style={{ fontSize: 76, fontWeight: 300, lineHeight: 0.88, letterSpacing: "-0.02em", color: "#fff", marginTop: 10 }}>
                DRO<br /><em style={{ fontStyle: "italic" }}>BE</em>
              </h1>
            </div>
            <div>
              <div className="fade-up-2" style={{ marginBottom: 32 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, fontWeight: 300 }}>
                  A wardrobe that thinks.<br />Style that knows you.
                </p>
              </div>
              <div className="fade-up-3" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button className="cta-btn" onClick={goNext}>Begin your style profile</button>
                <button className="cta-btn ghost" onClick={() => onComplete && onComplete()}>I already have an account</button>
              </div>
              <div className="fade-up-4" style={{ marginTop: 28, textAlign: "center" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
                  FEATURED IN VOGUE · ELLE · FORBES
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── INNER SCREENS: original white design ── */}
      {currentStep !== "welcome" && (
        <div className="drobe-screen" style={{ zIndex: 1 }}>
          <div style={{ paddingTop: 56, paddingBottom: 32 }}>
            {currentStep !== "done" && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888", letterSpacing: "0.04em" }}>← back</button>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#AAA", letterSpacing: "0.1em" }}>{step} / {STEPS.length - 2}</span>
              </div>
            )}
            {currentStep !== "done" && (
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${(step / (STEPS.length - 2)) * 100}%` }} />
              </div>
            )}
          </div>

          {/* NAME */}
          {currentStep === "name" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }} className="fade-up">
              <div style={{ marginBottom: 48 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.18em", color: "#888", textTransform: "uppercase", marginBottom: 16 }}>Let's start with you</p>
                <h2 style={{ fontSize: 38, fontWeight: 300, lineHeight: 1.1, color: "#1A1A1A" }}>What should<br />we call you?</h2>
              </div>
              <input className="name-input" placeholder="Your first name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && canProceed() && goNext()} autoFocus />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#AAA", marginTop: 12 }}>DROBE will use this to personalize your experience</p>
              <div style={{ marginTop: "auto", paddingTop: 40 }}>
                <button className="cta-btn" onClick={goNext} disabled={!canProceed()}>Continue</button>
              </div>
            </div>
          )}

          {/* STYLE */}
          {currentStep === "style" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }} className="fade-up">
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.18em", color: "#888", textTransform: "uppercase", marginBottom: 16 }}>Your aesthetic</p>
                <h2 style={{ fontSize: 38, fontWeight: 300, lineHeight: 1.1, color: "#1A1A1A", marginBottom: 8 }}>How would you<br />describe your style?</h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999" }}>Select all that apply</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "auto" }}>
                {STYLE_OPTIONS.map((s) => (
                  <button key={s.id} className={`style-chip${form.styles.includes(s.id) ? " selected" : ""}`} onClick={() => toggleStyle(s.id)}>
                    <div style={{ fontSize: 18, marginBottom: 6, opacity: 0.6 }}>{s.emoji}</div>
                    <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, opacity: 0.6, fontWeight: 300 }}>{s.desc}</div>
                  </button>
                ))}
              </div>
              <div style={{ paddingTop: 24 }}>
                <button className="cta-btn" onClick={goNext} disabled={!canProceed()}>Continue</button>
              </div>
            </div>
          )}

          {/* OCCASIONS */}
          {currentStep === "occasions" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }} className="fade-up">
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.18em", color: "#888", textTransform: "uppercase", marginBottom: 16 }}>Your lifestyle</p>
                <h2 style={{ fontSize: 38, fontWeight: 300, lineHeight: 1.1, color: "#1A1A1A", marginBottom: 8 }}>When do you<br />need to get dressed?</h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999" }}>Select all that apply</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: "auto" }}>
                {OCCASION_OPTIONS.map((o) => (
                  <button key={o} className={`pill${form.occasions.includes(o) ? " selected" : ""}`} onClick={() => toggleOccasion(o)}>{o}</button>
                ))}
              </div>
              <div style={{ paddingTop: 24 }}>
                <button className="cta-btn" onClick={goNext} disabled={!canProceed()}>Continue</button>
              </div>
            </div>
          )}

          {/* PRIORITIES */}
          {currentStep === "priorities" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }} className="fade-up">
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.18em", color: "#888", textTransform: "uppercase", marginBottom: 16 }}>Almost done</p>
                <h2 style={{ fontSize: 38, fontWeight: 300, lineHeight: 1.1, color: "#1A1A1A", marginBottom: 8 }}>What matters<br />most to you?</h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999" }}>DROBE will prioritize these features</p>
              </div>
              <div style={{ marginBottom: "auto" }}>
                {PRIORITY_OPTIONS.map((p) => (
                  <div key={p.id} className="priority-row" onClick={() => togglePriority(p.id)}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 300, color: "#1A1A1A" }}>{p.label}</span>
                    <div className={`priority-check${form.priorities.includes(p.id) ? " checked" : ""}`}>
                      {form.priorities.includes(p.id) && (
                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                          <path d="M1 4L4.5 7.5L11 1" stroke="#F8F6F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ paddingTop: 24 }}>
                <button className="cta-btn" onClick={goNext} disabled={!canProceed()}>Build my wardrobe</button>
              </div>
            </div>
          )}

          {/* DONE */}
          {currentStep === "done" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div className="done-mark fade-up" style={{ marginBottom: 32 }}>✓</div>
              <h2 className="fade-up-1" style={{ fontSize: 42, fontWeight: 300, lineHeight: 1.1, color: "#1A1A1A", marginBottom: 16 }}>
                {form.name ? `Welcome, ${form.name}.` : "Welcome."}
              </h2>
              <p className="fade-up-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#888", lineHeight: 1.7, maxWidth: 280, marginBottom: 48 }}>
                Your style profile is ready. Let's build your digital wardrobe.
              </p>
              <div className="fade-up-3" style={{ width: "100%" }}>
                <button className="cta-btn" onClick={() => onComplete && onComplete()}>Enter DROBE</button>
              </div>
              {form.styles.length > 0 && (
                <div className="fade-up-4" style={{ marginTop: 32, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                  {form.styles.map(s => (
                    <span key={s} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#AAA", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {STYLE_OPTIONS.find(o => o.id === s)?.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
