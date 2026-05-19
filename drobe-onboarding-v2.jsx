import { useState, useEffect } from "react";

const OCCASIONS = [
  { id:"work",      label:"Work",       desc:"Office, meetings",    emoji:"💼" },
  { id:"datenight", label:"Date Night", desc:"Romantic, evening",   emoji:"🌹" },
  { id:"casual",    label:"Casual",     desc:"Errands, relaxed",    emoji:"☕" },
  { id:"dinner",    label:"Dinner",     desc:"Restaurant, social",  emoji:"🍽" },
  { id:"event",     label:"Event",      desc:"Party, celebration",  emoji:"✨" },
  { id:"travel",    label:"Travel",     desc:"Airport, explore",    emoji:"✈️" },
  { id:"brunch",    label:"Brunch",     desc:"Weekend, social",     emoji:"🥂" },
  { id:"interview", label:"Interview",  desc:"Professional, formal",emoji:"🤝" },
  { id:"gym",       label:"Gym",        desc:"Active, athletic",    emoji:"💪" },
  { id:"wedding",   label:"Wedding",    desc:"Formal, celebratory", emoji:"💍" },
  { id:"custom",    label:"Custom",     desc:"Describe it yourself",emoji:"✏️" },
];

const FOLLOW_UPS = {
  work:      { setting:["Office","Remote","Client visit"], vibe:["Formal","Business casual","Creative"], time:["Morning","Full day","After work"] },
  datenight: { setting:["Indoor","Outdoor","Both"], vibe:["Casual","Upscale","Somewhere between"], time:["Daytime","Evening","Late night"], presence:["Stand out","Stay understated"] },
  casual:    { setting:["Indoors","Outdoors","Running errands"], vibe:["Relaxed","Put-together","Sporty"], time:["Morning","Afternoon","Evening"] },
  dinner:    { setting:["Restaurant","Home","Rooftop"], vibe:["Casual","Smart casual","Upscale"], time:["Early evening","Late evening"] },
  event:     { setting:["Indoor venue","Outdoor","Both"], vibe:["Festive","Elegant","Creative"], time:["Afternoon","Evening","Night"] },
  travel:    { setting:["Airport","City explore","Beach"], vibe:["Comfortable","Stylish","Practical"], time:["Early morning","Daytime","Red eye"] },
  brunch:    { setting:["Indoor","Outdoor patio","Rooftop"], vibe:["Casual chic","Dressy","Relaxed"], time:["Morning","Midday"] },
  default:   { setting:["Indoor","Outdoor"], vibe:["Relaxed","Polished","Bold"], time:["Morning","Afternoon","Evening"] },
};

const MOODS = ["Confident","Elegant","Relaxed","Powerful","Attractive","Creative","Minimal","Comfortable"];

const CLOSET_OUTFITS = {
  work: [
    { name:"Power Dressing",    vibe:"Authority · Sharp",    items:[{e:"🧥",n:"Tailored Blazer"},{e:"👔",n:"Dress Shirt"},{e:"👖",n:"Slim Trousers"},{e:"👞",n:"Oxford Shoes"}] },
    { name:"Polished Minimal",  vibe:"Clean · Confident",    items:[{e:"🧶",n:"Wool Turtleneck"},{e:"👗",n:"Pencil Skirt"},{e:"👜",n:"Structured Bag"},{e:"👠",n:"Block Heel"}] },
    { name:"Modern Executive",  vibe:"Contemporary · Bold",  items:[{e:"🧥",n:"Longline Coat"},{e:"🖤",n:"Monochrome Set"},{e:"💍",n:"Statement Watch"},{e:"👢",n:"Ankle Boot"}] },
  ],
  datenight: [
    { name:"Elevated Minimal",  vibe:"Refined · Evening",    items:[{e:"🧥",n:"Silk Blazer"},{e:"🖤",n:"Turtleneck"},{e:"👖",n:"Slim Trousers"},{e:"👢",n:"Chelsea Boot"}] },
    { name:"Romantic Edge",     vibe:"Feminine · Bold",      items:[{e:"👗",n:"Wrap Dress"},{e:"💍",n:"Gold Earrings"},{e:"👠",n:"Strappy Heel"},{e:"👜",n:"Mini Clutch"}] },
    { name:"Understated Luxe",  vibe:"Quiet · Polished",     items:[{e:"👔",n:"Linen Shirt"},{e:"👖",n:"Wide Trousers"},{e:"🕶",n:"Aviators"},{e:"👟",n:"Leather Sneaker"}] },
  ],
  casual: [
    { name:"Easy Sunday",       vibe:"Relaxed · Effortless", items:[{e:"👕",n:"Linen Tee"},{e:"🩳",n:"Wide Shorts"},{e:"👟",n:"Chunky Sneakers"},{e:"🧢",n:"Cap"}] },
    { name:"Chic Errand",       vibe:"Put-together · Easy",  items:[{e:"👔",n:"Button Shirt"},{e:"👖",n:"Wide-Leg Jeans"},{e:"👟",n:"White Sneakers"},{e:"🕶",n:"Sunglasses"}] },
    { name:"Sporty Luxe",       vibe:"Athletic · Stylish",   items:[{e:"🧥",n:"Track Jacket"},{e:"🩲",n:"Jogger"},{e:"👟",n:"Running Shoes"},{e:"🎒",n:"Backpack"}] },
  ],
  dinner: [
    { name:"Smart Casual",      vibe:"Polished · Relaxed",   items:[{e:"👔",n:"Oxford Shirt"},{e:"👖",n:"Chinos"},{e:"👞",n:"Loafers"},{e:"🕶",n:"Sunglasses"}] },
    { name:"Quiet Luxury",      vibe:"Understated · Rich",   items:[{e:"🧶",n:"Cashmere Knit"},{e:"👖",n:"Tailored Trousers"},{e:"👢",n:"Leather Boot"},{e:"💍",n:"Gold Ring"}] },
    { name:"Evening Glamour",   vibe:"Statement · Bold",     items:[{e:"✨",n:"Sequin Top"},{e:"👖",n:"Black Trousers"},{e:"👠",n:"Heeled Mules"},{e:"👜",n:"Evening Bag"}] },
  ],
  default: [
    { name:"Morning Minimal",   vibe:"Effortless · Clean",   items:[{e:"👔",n:"Button Shirt"},{e:"👖",n:"Wide-Leg Jeans"},{e:"👟",n:"White Sneakers"},{e:"🕶",n:"Aviators"}] },
    { name:"Chic Casual",       vibe:"Relaxed · Stylish",    items:[{e:"👕",n:"Linen Shirt"},{e:"🩳",n:"Tailored Shorts"},{e:"👟",n:"Loafers"},{e:"🧺",n:"Woven Bag"}] },
    { name:"Evening Edge",      vibe:"Dark · Confident",     items:[{e:"🧥",n:"Longline Coat"},{e:"🖤",n:"Turtleneck"},{e:"👖",n:"Straight Jeans"},{e:"👢",n:"Chelsea Boot"}] },
  ],
};

const STEPS = ["occasion","followup","mood","results","confirm"];

export default function PlanOutfit({ date = "Friday, June 13", onComplete, onBack }) {
  const [step, setStep]             = useState("occasion");
  const [occasion, setOccasion]     = useState(null);
  const [answers, setAnswers]       = useState({});
  const [mood, setMood]             = useState(null);
  const [loading, setLoading]       = useState(false);
  const [outfits, setOutfits]       = useState([]);
  const [chosen, setChosen]         = useState(null);

  const followUps = FOLLOW_UPS[occasion?.id] || FOLLOW_UPS.default;
  const progress = ((STEPS.indexOf(step) + 1) / STEPS.length) * 100;

  const goNext = (to) => setStep(to);
  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx === 0) { onBack && onBack(); return; }
    setStep(STEPS[idx - 1]);
  };

  const handleGenerate = () => {
    setLoading(true);
    setStep("results");
    const pool = CLOSET_OUTFITS[occasion?.id] || CLOSET_OUTFITS.default;
    setTimeout(() => {
      setOutfits(pool);
      setLoading(false);
    }, 1800);
  };

  const handleConfirm = () => {
    setStep("confirm");
    onComplete && onComplete({ date, occasion: occasion?.label, mood, outfit: outfits[chosen] });
  };

  const toggleAnswer = (group, val) => {
    setAnswers(a => ({ ...a, [group]: val }));
  };

  const stepLabel = {
    occasion: "1 of 4 · What's the occasion?",
    followup: "2 of 4 · A few quick questions",
    mood:     "3 of 4 · How do you want to feel?",
    results:  "4 of 4 · Your looks",
    confirm:  "Locked in",
  }[step];

  return (
    <div style={{ minHeight:"100vh", background:"#F8F6F1", fontFamily:"'Cormorant Garamond','Georgia',serif", display:"flex", flexDirection:"column", maxWidth:420, margin:"0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }

        .back-btn { background:none; border:1px solid #E0DCD5; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:border-color .15s; }
        .back-btn:hover { border-color:#1A1A1A; }

        .occ-chip { border:0.5px solid #D4CFC6; border-radius:4px; padding:14px 12px; cursor:pointer; background:transparent; text-align:left; transition:all .15s; }
        .occ-chip:hover { border-color:#1A1A1A; background:#fff; }
        .occ-chip.sel { border-color:#1A1A1A; background:#1A1A1A; color:#F8F6F1; }

        .pill { font-family:'DM Sans',sans-serif; font-size:12px; color:#1A1A1A; border:0.5px solid #D4CFC6; border-radius:100px; padding:8px 16px; cursor:pointer; background:transparent; transition:all .15s; white-space:nowrap; }
        .pill:hover { border-color:#1A1A1A; }
        .pill.sel { background:#1A1A1A; color:#F8F6F1; border-color:#1A1A1A; }

        .mood-chip { font-family:'DM Sans',sans-serif; font-size:13px; color:#1A1A1A; border:0.5px solid #D4CFC6; border-radius:100px; padding:12px 16px; cursor:pointer; background:transparent; transition:all .15s; text-align:center; font-weight:300; }
        .mood-chip:hover { border-color:#1A1A1A; }
        .mood-chip.sel { background:#1A1A1A; color:#F8F6F1; border-color:#1A1A1A; }

        .outfit-card { background:#fff; border:0.5px solid #E8E4DC; border-radius:8px; margin-bottom:10px; overflow:hidden; cursor:pointer; transition:all .15s; }
        .outfit-card:hover { border-color:#1A1A1A; }
        .outfit-card.sel { border:1.5px solid #1A1A1A; }
        .result-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:#F0EDE8; }
        .result-cell { background:#F8F6F1; aspect-ratio:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; padding:6px 3px; }

        .cta { width:100%; padding:16px; background:#1A1A1A; color:#F8F6F1; border:none; border-radius:2px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; transition:background .15s; }
        .cta:hover:not(:disabled) { background:#2D2D2D; }
        .cta:disabled { opacity:.3; cursor:not-allowed; }
        .cta-ghost { background:transparent; color:#1A1A1A; border:0.5px solid #D4CFC6; }
        .cta-ghost:hover { border-color:#1A1A1A; background:transparent; }

        .dot-load { width:6px; height:6px; border-radius:50%; background:#1A1A1A; animation:pulse 1.2s ease-in-out infinite; }
        .dot-load:nth-child(2) { animation-delay:.2s; }
        .dot-load:nth-child(3) { animation-delay:.4s; }
        @keyframes pulse { 0%,80%,100%{opacity:.15;transform:scale(.8);} 40%{opacity:1;transform:scale(1);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
        .fade-up { animation:fadeUp .35s ease both; }

        .confirm-card { background:#1A1A1A; border-radius:12px; padding:20px; margin-bottom:16px; }
        .prog-track { height:1px; background:#E8E4DC; margin-bottom:28px; }
        .prog-fill { height:1px; background:#1A1A1A; transition:width .5s cubic-bezier(.22,1,.36,1); }
      `}</style>

      <div style={{ flex:1, overflowY:"auto", padding:"48px 20px 32px" }}>

        {/* Top nav */}
        {step !== "confirm" && (
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <button className="back-btn" onClick={goBack}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"#AAA", letterSpacing:".1em", textTransform:"uppercase" }}>{stepLabel}</span>
          </div>
        )}

        {/* Progress bar */}
        {step !== "confirm" && (
          <div className="prog-track">
            <div className="prog-fill" style={{ width:`${progress}%` }}/>
          </div>
        )}

        {/* ── STEP 1: OCCASION ── */}
        {step === "occasion" && (
          <div className="fade-up">
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:".18em", color:"#AAA", textTransform:"uppercase", marginBottom:10 }}>{date}</p>
            <h2 style={{ fontSize:30, fontWeight:300, color:"#1A1A1A", lineHeight:1.1, marginBottom:6 }}>What are you<br />dressing for?</h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#AAA", fontWeight:300, marginBottom:24 }}>DROBE styles from your closet only</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:24 }}>
              {OCCASIONS.map(occ => (
                <div
                  key={occ.id}
                  className={`occ-chip${occasion?.id === occ.id ? " sel" : ""}`}
                  onClick={() => setOccasion(occ)}
                >
                  <div style={{ fontSize:20, marginBottom:6 }}>{occ.emoji}</div>
                  <div style={{ fontSize:14, fontWeight:400 }}>{occ.label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, opacity:.55, fontWeight:300, marginTop:2 }}>{occ.desc}</div>
                </div>
              ))}
            </div>
            <button className="cta" onClick={() => goNext("followup")} disabled={!occasion}>Continue</button>
          </div>
        )}

        {/* ── STEP 2: FOLLOW-UP ── */}
        {step === "followup" && (
          <div className="fade-up">
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:".18em", color:"#AAA", textTransform:"uppercase", marginBottom:10 }}>{occasion?.label}</p>
            <h2 style={{ fontSize:30, fontWeight:300, color:"#1A1A1A", lineHeight:1.1, marginBottom:6 }}>A few quick<br />questions</h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#AAA", fontWeight:300, marginBottom:24 }}>Helps the AI nail your look</p>
            <div style={{ display:"flex", flexDirection:"column", gap:20, marginBottom:24 }}>
              {Object.entries(followUps).map(([group, options]) => (
                <div key={group}>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#888", marginBottom:8, fontWeight:500, textTransform:"capitalize" }}>{group}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {options.map(opt => (
                      <button
                        key={opt}
                        className={`pill${answers[group] === opt ? " sel" : ""}`}
                        onClick={() => toggleAnswer(group, opt)}
                      >{opt}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="cta" onClick={() => goNext("mood")}>Continue</button>
          </div>
        )}

        {/* ── STEP 3: MOOD ── */}
        {step === "mood" && (
          <div className="fade-up">
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:".18em", color:"#AAA", textTransform:"uppercase", marginBottom:10 }}>Emotional styling</p>
            <h2 style={{ fontSize:30, fontWeight:300, color:"#1A1A1A", lineHeight:1.1, marginBottom:6 }}>How do you want<br />to feel?</h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#AAA", fontWeight:300, marginBottom:24 }}>The AI dresses you for that feeling</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:24 }}>
              {MOODS.map(m => (
                <div
                  key={m}
                  className={`mood-chip${mood === m ? " sel" : ""}`}
                  onClick={() => setMood(m)}
                >{m}</div>
              ))}
            </div>
            <button className="cta" onClick={handleGenerate} disabled={!mood}>Generate my looks</button>
          </div>
        )}

        {/* ── STEP 4: RESULTS ── */}
        {step === "results" && (
          <div className="fade-up">
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:".18em", color:"#AAA", textTransform:"uppercase", marginBottom:10 }}>From your closet only</p>
            <h2 style={{ fontSize:30, fontWeight:300, color:"#1A1A1A", lineHeight:1.1, marginBottom:6 }}>Your looks<br />for {date}</h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#AAA", fontWeight:300, marginBottom:16 }}>Tap a look to select it</p>

            {loading ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 0", gap:12 }}>
                <div style={{ display:"flex", gap:6 }}>
                  <div className="dot-load"/><div className="dot-load"/><div className="dot-load"/>
                </div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#AAA", fontWeight:300, letterSpacing:".06em" }}>Styling from your closet…</p>
              </div>
            ) : (
              <>
                {outfits.map((o, i) => (
                  <div
                    key={i}
                    className={`outfit-card${chosen === i ? " sel" : ""}`}
                    onClick={() => setChosen(i)}
                  >
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px 8px", borderBottom:".5px solid #F0EDE8" }}>
                      <div>
                        <div style={{ fontSize:15, fontWeight:400, color:"#1A1A1A" }}>{o.name}</div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:"#AAA", fontWeight:300, letterSpacing:".06em", textTransform:"uppercase", marginTop:2 }}>{o.vibe}</div>
                      </div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:"#AAA", border:".5px solid #E0DCD5", borderRadius:100, padding:"3px 10px" }}>Your closet</div>
                    </div>
                    <div className="result-grid">
                      {o.items.map((it, j) => (
                        <div key={j} className="result-cell">
                          <div style={{ fontSize:20 }}>{it.e}</div>
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:8, color:"#AAA", textAlign:"center" }}>{it.n}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="cta" style={{ marginTop:8 }} onClick={handleConfirm} disabled={chosen === null}>
                  Lock into calendar →
                </button>
              </>
            )}
          </div>
        )}

        {/* ── STEP 5: CONFIRM ── */}
        {step === "confirm" && chosen !== null && (
          <div className="fade-up" style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", paddingTop:20 }}>
            <div style={{ width:56, height:56, border:"1px solid #1A1A1A", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:20 }}>✓</div>
            <h2 style={{ fontSize:32, fontWeight:300, color:"#1A1A1A", marginBottom:8 }}>Locked in.</h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#AAA", fontWeight:300, lineHeight:1.7, maxWidth:240, marginBottom:28 }}>
              Your look is scheduled for<br />{date}. We'll remind you<br />the morning of.
            </p>
            <div className="confirm-card" style={{ width:"100%", textAlign:"left" }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:".18em", color:"rgba(248,246,241,.5)", textTransform:"uppercase", marginBottom:4 }}>{date}</p>
              <p style={{ fontSize:22, fontWeight:300, color:"#F8F6F1", marginBottom:14 }}>{outfits[chosen]?.name}</p>
              <div style={{ display:"flex", gap:8 }}>
                {outfits[chosen]?.items.map((it, i) => (
                  <div key={i} style={{ flex:1, background:"rgba(248,246,241,.1)", borderRadius:6, border:".5px solid rgba(248,246,241,.15)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, padding:"10px 4px" }}>
                    <div style={{ fontSize:20 }}>{it.e}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:8, color:"rgba(248,246,241,.5)", textAlign:"center" }}>{it.n}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:8 }}>
              <button className="cta cta-ghost" onClick={() => { setStep("occasion"); setOccasion(null); setMood(null); setChosen(null); setAnswers({}); }}>
                Plan another day
              </button>
              <button className="cta" onClick={() => onComplete && onComplete()}>View in calendar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
