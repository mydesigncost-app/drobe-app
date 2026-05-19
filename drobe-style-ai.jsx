import { useState, useRef } from "react";

const QUICK_PROMPTS = [
  "Rooftop party 🥂",
  "First date 🌹",
  "Board meeting 💼",
  "Weekend brunch ☕",
  "Airport travel ✈️",
  "Gallery opening 🖼",
];

// Wardrobe items the AI knows about — replace with real user closet data later
const USER_CLOSET = [
  "Totême Collared Button Shirt (white, tops)",
  "Rag & Bone Slim-Fit Jeans (dark blue, bottoms)",
  "Agolde Blaze Oversized Coat (beige, outerwear)",
  "Saint Laurent Full-Grain Leather Boot (black, shoes)",
  "Bottega Veneta Aviator Sunglasses (gold, accessories)",
  "Loro Piana Virgin Wool Turtleneck (black, tops)",
  "Celine Jazz Wide-Leg Pants (black, bottoms)",
  "Nippon Made Mexico 66 Deluxe Sneakers (white, shoes)",
  "Paul Smith Cotton-Blend Twill Blazer (navy, outerwear)",
  "Polo Ralph Lauren Button-Down Shirt (light blue, tops)",
];

export default function StyleAI({ onNavigate }) {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [occasion, setOccasion] = useState("");
  const [outfits, setOutfits] = useState([]);
  const [saved, setSaved] = useState([]);
  const inputRef = useRef(null);

  const generate = async (text) => {
    const val = (text || prompt).trim();
    if (!val) return;
    setOccasion(val);
    setStatus("loading");
    setOutfits([]);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are DROBE, a luxury AI personal stylist. The user wants outfit ideas for: "${val}"

Their wardrobe includes:
${USER_CLOSET.map((item, i) => `${i + 1}. ${item}`).join("\n")}

Create exactly 3 outfit combinations using ONLY items from their wardrobe above. Each outfit should feel cohesive and appropriate for the occasion.

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "outfits": [
    {
      "name": "Outfit name (2-3 words, evocative)",
      "vibe": "2 short descriptors separated by ·",
      "items": [
        {"emoji": "👔", "name": "Short item name", "piece": "exact wardrobe item name"},
        {"emoji": "👖", "name": "Short item name", "piece": "exact wardrobe item name"},
        {"emoji": "🧥", "name": "Short item name", "piece": "exact wardrobe item name"},
        {"emoji": "👟", "name": "Short item name", "piece": "exact wardrobe item name"}
      ],
      "stylist_note": "One sentence styling tip for this look"
    }
  ]
}`
          }]
        })
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setOutfits(parsed.outfits || []);
      setStatus("done");
    } catch (err) {
      console.error("AI error:", err);
      // Graceful fallback if API fails
      setOutfits([
        { name: "Polished Edit", vibe: "Clean · Sharp", stylist_note: "Let the tailoring speak.", items: [{emoji:"👔",name:"Button Shirt"},{emoji:"👖",name:"Wide-Leg Pants"},{emoji:"🧥",name:"Tailored Blazer"},{emoji:"👟",name:"Leather Boot"}] },
        { name: "Minimal Luxe", vibe: "Refined · Quiet", stylist_note: "Less is always more.", items: [{emoji:"🧶",name:"Turtleneck"},{emoji:"👖",name:"Slim Jeans"},{emoji:"🧥",name:"Longline Coat"},{emoji:"🕶",name:"Aviators"}] },
        { name: "Downtown Cool", vibe: "Effortless · Chic", stylist_note: "The blazer does all the work.", items: [{emoji:"👕",name:"Crisp Shirt"},{emoji:"👖",name:"Straight Jeans"},{emoji:"🧥",name:"Overshirt"},{emoji:"👟",name:"White Sneakers"}] },
      ]);
      setStatus("done");
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") generate(); };

  const quickFill = (text) => {
    const clean = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim();
    setPrompt(clean);
    generate(clean);
  };

  const toggleSave = (i) => {
    setSaved(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#F8F6F1", fontFamily:"'Cormorant Garamond','Georgia',serif", display:"flex", flexDirection:"column", maxWidth:420, margin:"0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .prompt-row { display:flex; align-items:center; gap:10px; background:#fff; border:1px solid #E0DCD5; border-radius:100px; padding:10px 14px; transition:border-color 0.2s; }
        .prompt-row:focus-within { border-color:#1A1A1A; }
        .prompt-input { flex:1; background:transparent; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:14px; color:#1A1A1A; font-weight:300; }
        .prompt-input::placeholder { color:#C4BFB5; }
        .send-btn { width:32px; height:32px; background:#1A1A1A; border:none; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:transform 0.15s; }
        .send-btn:hover:not(:disabled) { transform:scale(1.08); }
        .send-btn:disabled { opacity:0.3; cursor:not-allowed; }

        .quick-pill { font-family:'DM Sans',sans-serif; font-size:11px; color:#888; border:1px solid #E0DCD5; border-radius:100px; padding:6px 14px; white-space:nowrap; cursor:pointer; background:transparent; transition:all 0.15s; flex-shrink:0; }
        .quick-pill:hover { border-color:#1A1A1A; color:#1A1A1A; }

        .outfit-card { background:#fff; border:0.5px solid #E8E4DC; border-radius:8px; margin-bottom:14px; overflow:hidden; animation:fadeUp 0.4s ease both; }
        .outfit-card:nth-child(2) { animation-delay:0.1s; }
        .outfit-card:nth-child(3) { animation-delay:0.2s; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }

        .item-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:#F0EDE8; }
        .item-cell { background:#F8F6F1; aspect-ratio:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; padding:8px 4px; }
        .item-emoji { font-size:24px; }
        .item-label { font-family:'DM Sans',sans-serif; font-size:9px; color:#AAA; text-align:center; line-height:1.2; font-weight:300; }

        .action-btn { background:none; border:none; cursor:pointer; color:#AAA; display:flex; align-items:center; gap:5px; font-family:'DM Sans',sans-serif; font-size:11px; transition:color 0.15s; padding:0; }
        .action-btn:hover { color:#1A1A1A; }
        .action-btn.saved { color:#1A1A1A; }
        .try-btn { background:#1A1A1A; color:#F8F6F1; border:none; border-radius:2px; padding:8px 16px; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; cursor:pointer; transition:background 0.15s; }
        .try-btn:hover { background:#2D2D2D; }

        .dot { width:6px; height:6px; border-radius:50%; background:#1A1A1A; animation:pulse 1.2s ease-in-out infinite; }
        .dot:nth-child(2) { animation-delay:0.2s; }
        .dot:nth-child(3) { animation-delay:0.4s; }
        @keyframes pulse { 0%,80%,100%{opacity:0.15;transform:scale(0.8);} 40%{opacity:1;transform:scale(1);} }`}</style>

      {/* HEADER */}
      <div style={{ padding:"48px 20px 16px", borderBottom:"0.5px solid #E8E4DC" }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:"0.2em", color:"#AAA", textTransform:"uppercase", marginBottom:6 }}>AI Stylist</p>
        <h1 style={{ fontSize:24, fontWeight:400, color:"#1A1A1A" }}>Style Me</h1>
      </div>

      {/* PROMPT */}
      <div style={{ padding:"14px 16px", borderBottom:"0.5px solid #E8E4DC" }}>
        <div className="prompt-row">
          <input
            ref={inputRef}
            className="prompt-input"
            placeholder="Style me for a rooftop party…"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="send-btn" onClick={() => generate()} disabled={status === "loading"}>
            <svg width="13" height="13" fill="none" stroke="#F8F6F1" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* QUICK PROMPTS */}
      <div style={{ padding:"10px 16px 0", display:"flex", gap:7, overflowX:"auto", flexShrink:0 }}>
        {QUICK_PROMPTS.map(q => (
          <button key={q} className="quick-pill" onClick={() => quickFill(q)}>{q}</button>
        ))}
      </div>

      {/* RESULTS */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px 100px" }}>

        {status === "idle" && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", textAlign:"center", padding:20 }}>
            <div style={{ fontSize:36, opacity:0.2, marginBottom:14 }}>✦</div>
            <h2 style={{ fontSize:22, fontWeight:300, color:"#1A1A1A", marginBottom:8 }}>Your AI stylist<br/>is ready</h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#BBB", fontWeight:300, lineHeight:1.7 }}>
              Describe an occasion above<br/>and get three curated looks<br/>from your wardrobe.
            </p>
          </div>
        )}

        {status === "loading" && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:14 }}>
            <div style={{ display:"flex", gap:6 }}>
              <div className="dot"/><div className="dot"/><div className="dot"/>
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#AAA", fontWeight:300, letterSpacing:"0.06em" }}>Styling your look…</p>
          </div>
        )}

        {status === "done" && (
          <>
            <div style={{ marginBottom:16 }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:"0.18em", color:"#AAA", textTransform:"uppercase", marginBottom:4 }}>Styled for</p>
              <h2 style={{ fontSize:22, fontWeight:300, color:"#1A1A1A", lineHeight:1.1, textTransform:"capitalize" }}>{occasion}</h2>
            </div>

            {outfits.map((outfit, i) => (
              <div key={i} className="outfit-card">
                <div style={{ padding:"12px 14px 10px", borderBottom:"0.5px solid #F0EDE8" }}>
                  <div style={{ fontSize:17, fontWeight:400, color:"#1A1A1A", marginBottom:2 }}>{outfit.name}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"#AAA", fontWeight:300, letterSpacing:"0.06em", textTransform:"uppercase" }}>{outfit.vibe}</div>
                </div>

                <div className="item-grid">
                  {outfit.items.map((item, j) => (
                    <div key={j} className="item-cell">
                      <div className="item-emoji">{item.emoji}</div>
                      <div className="item-label">{item.name}</div>
                    </div>
                  ))}
                </div>

                {outfit.stylist_note && (
                  <div style={{ padding:"10px 14px", borderBottom:"0.5px solid #F0EDE8" }}>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#888", fontWeight:300, fontStyle:"italic", lineHeight:1.5 }}>
                      "{outfit.stylist_note}"
                    </p>
                  </div>
                )}

                <div style={{ padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", gap:12 }}>
                    <button className={`action-btn${saved.includes(i) ? " saved" : ""}`} onClick={() => toggleSave(i)}>
                      <svg width="13" height="13" fill={saved.includes(i) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {saved.includes(i) ? "Saved" : "Save"}
                    </button>
                    <button className="action-btn">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Share
                    </button>
                  </div>
                  <button className="try-btn" onClick={() => onNavigate && onNavigate("calendar")}>Try on →</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
))}
      </div>
    </div>
  );
}
