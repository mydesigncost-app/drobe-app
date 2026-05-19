import { useState, useMemo } from "react";
import { FeedbackSheet } from "./drobe-feedback";
import PlanOutfit from "./drobe-plan-outfit";
 
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DOW = ["S","M","T","W","T","F","S"];
 
const OUTFITS = [
  { name:"Morning Minimal",   bg:"#D8D4CC", emoji:"👔", items:[{e:"👔",n:"Button Shirt"},{e:"👖",n:"Wide-Leg Jeans"},{e:"👟",n:"White Sneakers"},{e:"🕶",n:"Aviators"}] },
  { name:"Polished Presence", bg:"#C8C0B4", emoji:"🧥", items:[{e:"🧥",n:"Tailored Blazer"},{e:"🧶",n:"Turtleneck"},{e:"👖",n:"Slim Trousers"},{e:"👞",n:"Oxford Shoes"}] },
  { name:"Velvet Luxe",       bg:"#B8B0A0", emoji:"👗", items:[{e:"👗",n:"Velvet Dress"},{e:"💍",n:"Gold Earrings"},{e:"👢",n:"Ankle Boots"},{e:"🧣",n:"Silk Scarf"}] },
  { name:"Evening Edge",      bg:"#2C2C2C", emoji:"🧥", items:[{e:"🧥",n:"Longline Coat"},{e:"🖤",n:"Turtleneck"},{e:"👖",n:"Straight Jeans"},{e:"👢",n:"Chelsea Boot"}] },
  { name:"Chic Errand",       bg:"#D0C8BC", emoji:"👕", items:[{e:"👕",n:"Linen Shirt"},{e:"🩳",n:"Wide Shorts"},{e:"👟",n:"Chunky Sneakers"},{e:"🎒",n:"Canvas Tote"}] },
  { name:"Sunday Soft",       bg:"#C8B870", emoji:"👒", items:[{e:"👒",n:"Sun Hat"},{e:"👗",n:"Midi Dress"},{e:"🩴",n:"Sandals"},{e:"💍",n:"Gold Ring"}] },
  { name:"Sequin Glamour",    bg:"#3D2B1F", emoji:"✨", items:[{e:"✨",n:"Sequin Top"},{e:"👖",n:"Black Trousers"},{e:"👠",n:"Heeled Mules"},{e:"👜",n:"Mini Bag"}] },
];
 
const SWAP_ALTS = [
  [{e:"🧥",n:"Trench Coat"},{e:"👕",n:"Silk Blouse"},{e:"🧶",n:"Cardigan"},{e:"🥼",n:"Overshirt"},{e:"🎽",n:"Crop Top"},{e:"👔",n:"Dress Shirt"},{e:"🩱",n:"Bodysuit"},{e:"🩳",n:"Cami Top"}],
  [{e:"👖",n:"Wide Jeans"},{e:"👗",n:"Midi Skirt"},{e:"🩳",n:"Bermuda Shorts"},{e:"🎽",n:"Biker Short"},{e:"🧢",n:"Cargo Pants"},{e:"👚",n:"Maxi Skirt"},{e:"🩱",n:"Mini Skirt"},{e:"🧦",n:"Pleated Trouser"}],
  [{e:"👠",n:"Strappy Heel"},{e:"👟",n:"Chunky Sneaker"},{e:"🩴",n:"Leather Sandal"},{e:"👢",n:"Knee Boot"},{e:"🥿",n:"Ballet Flat"},{e:"👞",n:"Loafer"},{e:"🥾",n:"Chelsea Boot"},{e:"👡",n:"Kitten Heel"}],
  [{e:"🧣",n:"Silk Scarf"},{e:"💍",n:"Gold Chain"},{e:"🎩",n:"Wide Brim"},{e:"🧤",n:"Leather Gloves"},{e:"👜",n:"Mini Clutch"},{e:"🕶",n:"Cat-Eye Shades"},{e:"💄",n:"Bold Lip"},{e:"🩰",n:"Ballet Flat"}],
];
 
const TODAY = new Date();
 
function seedPlanned() {
  const p: Record<string, number> = {};
  [1,2,3,5,7,8,9,11,12,14,15,16,17,18,19,21,22,24,25,26,28].forEach((d, i) => {
    p[`${TODAY.getFullYear()}-${TODAY.getMonth()}-${d}`] = i % OUTFITS.length;
  });
  return p;
}
 
function cloneOutfits(arr: typeof OUTFITS) {
  return arr.map(o => ({ ...o, items: o.items.map(it => ({ ...it })) }));
}
 
interface Props {
  onNavigate?: (screen: string) => void;
}
 
export default function OutfitCalendar({ onNavigate }: Props) {
  const [viewYear, setViewYear]   = useState(TODAY.getFullYear());
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth());
  const [selected, setSelected]   = useState({ y: TODAY.getFullYear(), m: TODAY.getMonth(), d: TODAY.getDate() });
  const [planned, setPlanned]     = useState<Record<string, number>>(seedPlanned);
  const [outfitLib, setOutfitLib] = useState(() => cloneOutfits(OUTFITS));
  const [planCycle, setPlanCycle] = useState(0);
 
  // ── Popup state ───────────────────────────────────────────
  const [showDetail, setShowDetail] = useState(false);   // full-screen avatar popup
  const [activePiece, setActivePiece] = useState(0);     // which piece is highlighted
  const [showSwap, setShowSwap]     = useState(false);   // swap sheet
  const [swapChoice, setSwapChoice] = useState<{i:number;e:string;n:string}|null>(null);
  const [wornLogged, setWornLogged] = useState(false);   // wear-this button state
 
  // ── Feedback state ────────────────────────────────────────
  const [pendingFeedback, setPending]       = useState<any>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);
 
  // ── Plan outfit flow ──────────────────────────────────────
  const [showPlan, setShowPlan] = useState(false);
  const [planDate, setPlanDate] = useState("");
 
  // ── Helpers ───────────────────────────────────────────────
  const key      = (y: number, m: number, d: number) => `${y}-${m}-${d}`;
  const selKey   = () => key(selected.y, selected.m, selected.d);
  const getOutfit = (k = selKey()) => {
    const idx = planned[k];
    return idx !== undefined ? outfitLib[idx] : null;
  };
  const getItems = (k = selKey()) => getOutfit(k)?.items ?? null;
 
  // ── Calendar cells ────────────────────────────────────────
  const cells = useMemo(() => {
    const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev  = new Date(viewYear, viewMonth, 0).getDate();
    const arr: { d: number; current: boolean }[] = [];
    for (let i = firstDay - 1; i >= 0; i--) arr.push({ d: daysInPrev - i, current: false });
    for (let d = 1; d <= daysInMonth; d++)   arr.push({ d, current: true });
    const rem = arr.length % 7 === 0 ? 0 : 7 - (arr.length % 7);
    for (let d = 1; d <= rem; d++)           arr.push({ d, current: false });
    return arr;
  }, [viewYear, viewMonth]);
 
  const changeMonth = (dir: number) => {
    let m = viewMonth + dir, y = viewYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0)  { m = 11; y--; }
    setViewMonth(m); setViewYear(y);
  };
 
  const isToday = (d: number) =>
    d === TODAY.getDate() && viewMonth === TODAY.getMonth() && viewYear === TODAY.getFullYear();
  const isSel = (d: number) =>
    d === selected.d && viewMonth === selected.m && viewYear === selected.y;
 
  // ── Date string ───────────────────────────────────────────
  const selectedDate    = new Date(selected.y, selected.m, selected.d);
  const selectedDateStr = `${DAYS_SHORT[selectedDate.getDay()]}, ${MONTHS_SHORT[selected.m]} ${selected.d}`;
  const selectedOutfit  = getOutfit();
 
  // ── Actions ───────────────────────────────────────────────
  const removeOutfit = () => {
    setPlanned(p => { const n = { ...p }; delete n[selKey()]; return n; });
    setShowDetail(false);
  };
 
  // FIX: "Wear this" → turns green, logs outfit, closes popup,
  // then triggers feedback sheet. Navigates back to home via onNavigate.
  const wearOutfit = () => {
    if (wornLogged) return;
    setWornLogged(true);
    const outfit = getOutfit();
    const items  = getItems();
    const entry  = {
      outfitName: outfit?.name ?? "Today's Look",
      date:       selectedDateStr,
      occasion:   "Planned",
      items:      items ?? [],
      feedback:   [],
      wornAt:     new Date().toISOString(),
    };
    setTimeout(() => {
      setWornLogged(false);
      setShowDetail(false);
      setPending(entry);           // triggers feedback sheet
    }, 1800);
  };
 
  const confirmSwap = () => {
    if (!swapChoice) { setShowSwap(false); return; }
    const idx = planned[selKey()];
    if (idx === undefined) return;
    const updated = cloneOutfits(outfitLib);
    const newOutfit = { ...updated[idx], items: updated[idx].items.map(it => ({ ...it })) };
    newOutfit.items[activePiece] = { e: swapChoice.e, n: swapChoice.n };
    const newLib = [...updated, newOutfit];
    setOutfitLib(newLib);
    setPlanned(p => ({ ...p, [selKey()]: newLib.length - 1 }));
    setSwapChoice(null);
    setShowSwap(false);
  };
 
  // FIX: open detail with specific piece pre-selected and highlighted
  const openDetail = (piece: number = 0) => {
    setActivePiece(piece);
    setWornLogged(false);
    setShowSwap(false);
    setSwapChoice(null);
    setShowDetail(true);
  };
 
  return (
    <div style={{
      minHeight: "100vh", background: "#F8F6F1",
      fontFamily: "'Cormorant Garamond','Georgia',serif",
      display: "flex", flexDirection: "column",
      maxWidth: 420, margin: "0 auto",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
 
        .arr-btn { background:none; border:0.5px solid #E0DCD5; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:border-color .15s; flex-shrink:0; }
        .arr-btn:hover { border-color:#1A1A1A; }
 
        /* ── Calendar day cell ── */
        .day-cell { display:flex; flex-direction:column; align-items:center; cursor:pointer; border-radius:6px; padding:3px 2px; transition:background .15s; }
        .day-cell:hover { background:#F0EDE8; }
        .outfit-thumb { width:28px; height:36px; border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:14px; margin-top:2px; }
 
        /* ── Panel bottom buttons ── */
        .det-btn { flex:1; padding:10px; border-radius:2px; font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; transition:all .15s; border:0.5px solid #E0DCD5; background:transparent; color:#888; }
        .det-btn:hover { border-color:#1A1A1A; color:#1A1A1A; }
        .plan-btn { width:100%; padding:14px; background:#1A1A1A; color:#F8F6F1; border:none; border-radius:2px; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:500; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; margin-top:6px; transition:background .15s; }
        .plan-btn:hover { background:#2D2D2D; }
 
        /* ── Full-screen avatar popup ── */
        .detail-screen {
          position: fixed; top:0; left:0; right:0; bottom:0;
          width:100%; height:100%;
          z-index: 9999;
          transform: translateX(100%);
          transition: transform .35s cubic-bezier(.22,1,.36,1);
          /* hidden by default — only rendered when showDetail=true */
        }
        .detail-screen.open { transform: translateX(0); }
 
        .avatar-bg { position:absolute; inset:0; z-index:0; }
        .detail-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to bottom,
            rgba(0,0,0,0) 0%, rgba(0,0,0,0) 35%,
            rgba(20,16,12,.6) 60%, rgba(15,12,8,.93) 80%,
            rgba(10,8,5,.98) 100%);
          z-index:1;
        }
 
        .detail-topnav { position:absolute; top:0; left:0; right:0; padding:48px 20px 0; display:flex; align-items:center; justify-content:space-between; z-index:3; }
        .back-circle { width:36px; height:36px; border-radius:50%; background:rgba(248,246,241,.15); border:0.5px solid rgba(248,246,241,.25); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .15s; }
        .back-circle:hover { background:rgba(248,246,241,.25); }
        .avatar-circle { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#C8A87A,#8B6840); border:1.5px solid rgba(248,246,241,.4); display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:#fff; }
 
        .detail-bottom { position:absolute; bottom:0; left:0; right:0; z-index:3; padding:0 20px 32px; }
 
        /* ── Piece icons — active = highlighted white ── */
        .piece-icon { width:100%; height:52px; border-radius:8px; background:rgba(248,246,241,.12); border:1px solid rgba(248,246,241,.18); display:flex; align-items:center; justify-content:center; font-size:22px; cursor:pointer; transition:all .15s; backdrop-filter:blur(4px); }
        .piece-icon:hover { background:rgba(248,246,241,.22); }
        .piece-icon.active { background:rgba(248,246,241,.9); border-color:#F8F6F1; }
        .piece-lbl { font-family:'DM Sans',sans-serif; font-size:8px; color:rgba(248,246,241,.5); text-align:center; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:56px; }
 
        /* ── Action buttons ── */
        .act-btn { flex:1; padding:13px 10px; border-radius:2px; font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; transition:all .15s; }
        .act-ghost { background:rgba(248,246,241,.08); border:0.5px solid rgba(248,246,241,.22); color:rgba(248,246,241,.65); }
        .act-ghost:hover { background:rgba(248,246,241,.16); color:#fff; }
        .act-solid { background:#F8F6F1; border:none; color:#1A1A1A; }
        .act-solid:hover { background:#fff; }
        .act-solid.logged { background:#4A7A5A; color:#fff; }
 
        /* ── Swap sheet ── */
        .swap-sheet { position:absolute; bottom:0; left:0; right:0; background:#F8F6F1; border-radius:20px 20px 0 0; padding:20px 20px 40px; z-index:10; transform:translateY(100%); transition:transform .32s cubic-bezier(.22,1,.36,1); }
        .swap-sheet.open { transform:translateY(0); }
        .swap-handle { width:36px; height:3px; background:#D4CFC6; border-radius:2px; margin:0 auto 18px; }
        .swap-item { display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer; padding:10px 4px; border-radius:6px; border:0.5px solid #E0DCD5; transition:all .15s; }
        .swap-item:hover { border-color:#1A1A1A; }
        .swap-item.chosen { border-color:#1A1A1A; background:#1A1A1A; }
        .swap-item.chosen .swap-lbl { color:#F8F6F1; }
        .swap-lbl { font-family:'DM Sans',sans-serif; font-size:9px; color:#888; text-align:center; line-height:1.2; }
        .swap-confirm { width:100%; padding:14px; background:#1A1A1A; color:#F8F6F1; border:none; border-radius:2px; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:500; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; margin-top:14px; transition:background .15s; }
        .swap-confirm:hover { background:#2D2D2D; }
        .swap-cancel { width:100%; padding:10px; background:transparent; border:none; font-family:'DM Sans',sans-serif; font-size:11px; color:#AAA; cursor:pointer; margin-top:4px; }
 
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
        .fade-up { animation:fadeUp .3s ease both; }
      `}</style>
 
      {/* ══════════════════════════════════════════════
          CALENDAR SCREEN
      ══════════════════════════════════════════════ */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom:100 }}>
 
        {/* Month header */}
        <div style={{ padding:"48px 20px 12px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <span style={{ fontSize:22, fontWeight:400, color:"#1A1A1A" }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <div style={{ display:"flex", gap:8 }}>
              {([-1, 1] as const).map(dir => (
                <button key={dir} className="arr-btn" onClick={() => changeMonth(dir)}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d={dir === -1 ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
 
        {/* Day-of-week strip */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", padding:"0 20px", marginBottom:4 }}>
          {DOW.map((d, i) => (
            <div key={i} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:"#BBB", textAlign:"center", letterSpacing:".06em", textTransform:"uppercase", padding:"4px 0" }}>{d}</div>
          ))}
        </div>
 
        {/* Calendar grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, padding:"0 20px 12px" }}>
          {cells.map((cell, i) => {
            const cellKey = key(viewYear, viewMonth, cell.d);
            const idx     = cell.current ? planned[cellKey] : undefined;
            const outfit  = idx !== undefined ? outfitLib[idx] : null;
            return (
              <div
                key={i}
                className="day-cell"
                style={{ background: cell.current && isSel(cell.d) ? "#EDE9E3" : "transparent" }}
                onClick={() => {
                  if (!cell.current) return;
                  // Always update selection
                  setSelected({ y: viewYear, m: viewMonth, d: cell.d });
                  if (outfit) {
                    // FIX 1: Tap thumbnail → open popup immediately, piece 0 pre-selected
                    openDetail(0);
                  }
                  // FIX 2: Empty day → stay on calendar, show panel (no popup)
                }}
              >
                <div style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize:10, fontWeight:400,
                  color: !cell.current ? "#DDD" : isToday(cell.d) ? "#F8F6F1" : "#1A1A1A",
                  width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center",
                  borderRadius:"50%", flexShrink:0,
                  background: cell.current && isToday(cell.d) ? "#1A1A1A" : "transparent",
                }}>{cell.d}</div>
                {outfit
                  ? <div className="outfit-thumb" style={{ background: outfit.bg }}>{outfit.emoji}</div>
                  : <div style={{ height:38 }} />}
              </div>
            );
          })}
        </div>
 
        {/* ── Detail panel (always visible below grid) ── */}
        <div style={{ background:"#F8F6F1", borderTop:"0.5px solid #E8E4DC", padding:"14px 20px 20px" }} className="fade-up">
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:".16em", color:"#AAA", textTransform:"uppercase", marginBottom:6 }}>
            {selectedDateStr}
          </p>
 
          {selectedOutfit ? (
            <>
              <p style={{ fontSize:18, fontWeight:400, color:"#1A1A1A", marginBottom:12 }}>
                {selectedOutfit.name}
              </p>
 
              {/* FIX 3: Piece icons in panel — tap to open popup with that piece pre-selected & highlighted */}
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                {selectedOutfit.items.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => openDetail(i)}  // ← opens popup with piece i active
                    style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", flex:1 }}
                  >
                    <div style={{
                      width:"100%", height:52, background:"#F4F1EC", borderRadius:6,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:22, transition:"background .15s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#EDE9E3")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#F4F1EC")}
                    >{item.e}</div>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:"#AAA", textAlign:"center", lineHeight:1.2 }}>
                      {item.n}
                    </span>
                  </div>
                ))}
              </div>
 
              <button className="det-btn" style={{ width:"100%" }} onClick={removeOutfit}>
                Remove outfit
              </button>
            </>
          ) : (
            /* FIX 2: Empty day panel — stays on calendar, shows plan button */
            <>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#BBB", fontWeight:300, marginBottom:4 }}>
                No outfit planned yet
              </p>
              <button
                className="plan-btn"
                onClick={() => { setPlanDate(selectedDateStr); setShowPlan(true); }}
              >
                + Plan an outfit
              </button>
            </>
          )}
        </div>
      </div>
 
      {/* ══════════════════════════════════════════════
          FULL-SCREEN AVATAR POPUP
          Only rendered when showDetail === true
      ══════════════════════════════════════════════ */}
      {showDetail && (
        <div className="detail-screen open">
 
          {/* Avatar SVG background */}
          <div className="avatar-bg">
            <svg width="100%" height="100%" viewBox="0 0 420 840" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin slice">
              <defs>
                <linearGradient id="dBg"   x1="0" y1="0" x2="1" y2="1"><stop offset="0%"   stopColor="#C8A87A"/><stop offset="50%"  stopColor="#8B6840"/><stop offset="100%" stopColor="#5C3D1E"/></linearGradient>
                <linearGradient id="dSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%"   stopColor="#E8C49A"/><stop offset="100%" stopColor="#C89A6A"/></linearGradient>
                <linearGradient id="dSuit" x1="0" y1="0" x2="0" y2="1"><stop offset="0%"   stopColor="#C8A87A"/><stop offset="100%" stopColor="#8B6840"/></linearGradient>
                <linearGradient id="dHair" x1="0" y1="0" x2="0" y2="1"><stop offset="0%"   stopColor="#8B4513"/><stop offset="100%" stopColor="#5C2D0A"/></linearGradient>
              </defs>
              <rect width="420" height="840" fill="url(#dBg)"/>
              <ellipse cx="320" cy="100" rx="160" ry="200" fill="rgba(200,168,122,0.25)"/>
              <ellipse cx="80"  cy="680" rx="120" ry="160" fill="rgba(91,61,30,0.35)"/>
              <path d="M155 290 Q142 370 138 500 Q132 600 142 760 L278 760 Q288 600 282 500 Q278 370 265 290 Z" fill="url(#dSuit)"/>
              <path d="M210 290 L172 400 L210 385 Z" fill="#A08050"/>
              <path d="M210 290 L248 400 L210 385 Z" fill="#A08050"/>
              <rect x="142" y="422" width="136" height="16" rx="3" fill="#7A5830"/>
              <rect x="202" y="416" width="18"  height="28" rx="2" fill="#C8A860"/>
              <path d="M192 290 L197 408 L210 408 L223 408 L228 290 Z" fill="#E8DCC8"/>
              <path d="M142 438 Q138 550 136 760 L202 760 L210 550 L218 760 L284 760 Q282 550 278 438 Z" fill="#9A7848"/>
              <rect x="196" y="232" width="28" height="58" rx="5" fill="url(#dSkin)"/>
              <ellipse cx="210" cy="196" rx="48" ry="54" fill="url(#dSkin)"/>
              <path d="M162 170 Q158 118 172 92 Q188 64 210 62 Q232 64 248 92 Q262 118 258 170 Q244 128 210 122 Q176 128 162 170 Z" fill="url(#dHair)"/>
              <path d="M162 170 Q144 196 148 232 Q152 248 162 252 L170 234 Q165 210 170 184 Z" fill="url(#dHair)"/>
              <path d="M258 170 Q276 196 272 232 Q268 248 258 252 L250 234 Q255 210 250 184 Z" fill="url(#dHair)"/>
              <path d="M172 248 Q152 276 148 316 Q160 290 174 282 Z" fill="url(#dHair)"/>
              <path d="M248 248 Q268 276 272 316 Q260 290 246 282 Z" fill="url(#dHair)"/>
              <ellipse cx="194" cy="194" rx="7" ry="8"   fill="rgba(80,40,20,0.12)"/>
              <ellipse cx="226" cy="194" rx="7" ry="8"   fill="rgba(80,40,20,0.12)"/>
              <ellipse cx="194" cy="194" rx="4" ry="5"   fill="#3A2010"/>
              <ellipse cx="226" cy="194" rx="4" ry="5"   fill="#3A2010"/>
              <circle  cx="195" cy="193" r="1.5"         fill="rgba(255,255,255,0.55)"/>
              <circle  cx="227" cy="193" r="1.5"         fill="rgba(255,255,255,0.55)"/>
              <path d="M187 178 Q194 174 201 178" stroke="#5C3010" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M219 178 Q226 174 233 178" stroke="#5C3010" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M200 212 Q210 219 220 212" stroke="#B06060" strokeWidth="2"   fill="none" strokeLinecap="round"/>
              <ellipse cx="210" cy="207" rx="5" ry="2.5" fill="#C87070" opacity="0.6"/>
              <path d="M155 290 Q128 370 124 450 Q130 462 144 456 Q148 376 158 316 Z" fill="url(#dSuit)"/>
              <path d="M265 290 Q292 370 296 450 Q290 462 276 456 Q272 376 262 316 Z" fill="url(#dSuit)"/>
              <ellipse cx="134" cy="468" rx="12" ry="16" fill="url(#dSkin)"/>
              <ellipse cx="286" cy="468" rx="12" ry="16" fill="url(#dSkin)"/>
            </svg>
          </div>
 
          {/* Gradient overlay */}
          <div className="detail-overlay"/>
 
          {/* Top nav */}
          <div className="detail-topnav">
            <div className="back-circle" onClick={() => { setShowDetail(false); setShowSwap(false); setSwapChoice(null); }}>
              <svg width="14" height="14" fill="none" stroke="#F8F6F1" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="avatar-circle">A</div>
          </div>
 
          {/* Bottom content */}
          {selectedOutfit && (
            <div className="detail-bottom">
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:".18em", color:"rgba(248,246,241,0.5)", textTransform:"uppercase", marginBottom:5 }}>
                {selectedDateStr}
              </p>
              <p style={{ fontSize:30, fontWeight:300, color:"#F8F6F1", lineHeight:1.05, marginBottom:18, letterSpacing:"-0.01em" }}>
                {selectedOutfit.name}
              </p>
 
              {/* FIX 3: Piece selector — activePiece highlighted white */}
              <div style={{ display:"flex", gap:10, marginBottom:18 }}>
                {selectedOutfit.items.map((item, i) => (
                  <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                    <div
                      className={`piece-icon${activePiece === i ? " active" : ""}`}
                      onClick={() => setActivePiece(i)}
                    >
                      {item.e}
                    </div>
                    <div className="piece-lbl">{item.n}</div>
                  </div>
                ))}
              </div>
 
              <div style={{ height:"0.5px", background:"rgba(248,246,241,0.14)", marginBottom:14 }}/>
 
              {/* FIX 4: "Wear this" → green confirmation → closes popup → triggers feedback → routes correctly */}
              <div style={{ display:"flex", gap:8 }}>
                <button className="act-btn act-ghost" onClick={removeOutfit}>Remove</button>
                <button className="act-btn act-ghost" onClick={() => { setSwapChoice(null); setShowSwap(true); }}>Modify</button>
                <button
                  className={`act-btn act-solid${wornLogged ? " logged" : ""}`}
                  onClick={wearOutfit}
                  disabled={wornLogged}
                >
                  {wornLogged ? "✓ Logged!" : "Wear this"}
                </button>
              </div>
            </div>
          )}
 
          {/* Swap sheet */}
          <div className={`swap-sheet${showSwap ? " open" : ""}`}>
            <div className="swap-handle"/>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:".16em", color:"#AAA", textTransform:"uppercase", marginBottom:14 }}>
              Swap: {selectedOutfit?.items[activePiece]?.n}
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:4 }}>
              {SWAP_ALTS[activePiece % SWAP_ALTS.length].map((alt, i) => (
                <div
                  key={i}
                  className={`swap-item${swapChoice?.i === i ? " chosen" : ""}`}
                  onClick={() => setSwapChoice({ i, e: alt.e, n: alt.n })}
                >
                  <span style={{ fontSize:22 }}>{alt.e}</span>
                  <span className="swap-lbl">{alt.n}</span>
                </div>
              ))}
            </div>
            <button className="swap-confirm" onClick={confirmSwap}>Confirm swap</button>
            <button className="swap-cancel" onClick={() => { setShowSwap(false); setSwapChoice(null); }}>cancel</button>
          </div>
 
        </div>
      )}
 
      {/* ── Feedback sheet (after wearing) ── */}
      {pendingFeedback && (
        <FeedbackSheet
          entry={pendingFeedback}
          onSubmit={(entry: any, fb: string[]) => {
            setFeedbackHistory((prev: any[]) => [{ ...entry, feedback: fb }, ...prev]);
            setPending(null);
          }}
          onDismiss={() => setPending(null)}
        />
      )}
 
      {/* ── Plan outfit full-screen flow ── */}
      {showPlan && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, background:"#F8F6F1" }}>
          <PlanOutfit
            date={planDate}
            onBack={() => setShowPlan(false)}
            onComplete={(data: any) => {
              if (data) {
                const next = planCycle % outfitLib.length;
                setPlanned(p => ({ ...p, [selKey()]: next }));
                setPlanCycle(c => c + 1);
              }
              setShowPlan(false);
            }}
          />
        </div>
      )}
 
    </div>
  );
}
 
