import { useState, useEffect } from "react";

// ─── Outfit suggestions (later: pull from Supabase + AI) ───────────────────
const DAILY_OUTFITS = [
  { name:"Morning Minimal",    occ:"Casual · Daily",    badge:"Today's Pick", note:"Effortless and weather-ready.",     items:[{e:"👔",n:"Button Shirt"},{e:"👖",n:"Wide-Leg Jeans"},{e:"👟",n:"White Sneakers"},{e:"🕶",n:"Aviators"}] },
  { name:"Polished Presence",  occ:"Work · Meetings",   badge:"Work Look",    note:"The blazer anchors everything.",    items:[{e:"🧥",n:"Tailored Blazer"},{e:"🧶",n:"Wool Turtleneck"},{e:"👖",n:"Slim Trousers"},{e:"👞",n:"Oxford Shoes"}] },
  { name:"Chic Errand",        occ:"Errands · Casual",  badge:"Easy Pick",    note:"Comfortable but never sloppy.",     items:[{e:"👕",n:"Linen Shirt"},{e:"🩳",n:"Wide Shorts"},{e:"👟",n:"Chunky Sneakers"},{e:"🎒",n:"Canvas Tote"}] },
  { name:"Evening Edge",       occ:"Dinner · Social",   badge:"Night Out",    note:"Dark tones, quiet confidence.",     items:[{e:"🧥",n:"Longline Coat"},{e:"🖤",n:"Turtleneck"},{e:"👖",n:"Straight Jeans"},{e:"👢",n:"Chelsea Boot"}] },
];

const RECENT_LOOKS = [
  { name:"Polished Edit",   date:"Yesterday",  bg:"#D8D0C4", e:"🧥" },
  { name:"Velvet Luxe",     date:"2 days ago", bg:"#B8B0A0", e:"👗" },
  { name:"Sunday Soft",     date:"3 days ago", bg:"#C8B870", e:"👒" },
  { name:"Downtown Cool",   date:"4 days ago", bg:"#8B9BB4", e:"👖" },
];

export default function Dashboard({ onNavigate }) {
  const [outfitIdx, setOutfitIdx] = useState(0);
  const [worn, setWorn] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // ── Fetch real weather (OpenWeatherMap free tier) ────────────────────────
  // Replace YOUR_API_KEY with a free key from openweathermap.org
  // Default city: Frisco, TX — change to user's city from their profile
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = "YOUR_OPENWEATHER_API_KEY"; // ← replace this
        const city = "Frisco,TX,US";
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
        );
        const data = await res.json();
        if (data.cod === 200) {
          setWeather({
            temp: Math.round(data.main.temp),
            high: Math.round(data.main.temp_max),
            low:  Math.round(data.main.temp_min),
            desc: data.weather[0].description,
            icon: getWeatherEmoji(data.weather[0].id),
            city: data.name,
            tip:  getWeatherTip(data.main.temp, data.weather[0].id),
          });
        } else {
          setWeather(getFallbackWeather());
        }
      } catch {
        setWeather(getFallbackWeather());
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const getWeatherEmoji = (id) => {
    if (id >= 200 && id < 300) return "⛈";
    if (id >= 300 && id < 400) return "🌦";
    if (id >= 500 && id < 600) return "🌧";
    if (id >= 600 && id < 700) return "❄️";
    if (id >= 700 && id < 800) return "🌫";
    if (id === 800) return "☀️";
    if (id > 800) return "⛅";
    return "🌤";
  };

  const getWeatherTip = (temp, id) => {
    if (id >= 500 && id < 600) return "Rainy day ahead — your Classic trench coat pairs perfectly with wide-leg trousers.";
    if (id >= 200 && id < 300) return "Storms rolling in — your longline coat and wool turtleneck are a Classic power move.";
    if (temp < 40) return "Freezing out — your cashmere turtleneck and tailored wool coat are your Classic armor today.";
    if (temp < 50) return "Cold and crisp — layer your Polo button-down under your Agolde coat for a clean Classic look.";
    if (temp < 60) return "Cool breeze today — your Paul Smith blazer over a Loro Piana turtleneck is peak Classic style.";
    if (temp < 72) return "Mild and breezy — your linen shirt with Celine wide-leg trousers is effortlessly Classic.";
    if (temp < 82) return "Warm and sunny — your Polo linen shirt and Rag & Bone jeans are a Classic warm-weather win.";
    return "It's hot — your lightest linen pieces and Bottega aviators are the Classic summer move.";
  };

  const getFallbackWeather = () => ({
    temp: 71, high: 78, low: 62,
    desc: "Sunny & clear", icon: "☀️",
    city: "Frisco, TX",
    tip: "Mild and breezy — your linen shirt with Celine wide-leg trousers is effortlessly Classic.",
  });

  const cycleOutfit = () => {
    setOutfitIdx(i => (i + 1) % DAILY_OUTFITS.length);
    setWorn(false);
  };

  const outfit = DAILY_OUTFITS[outfitIdx];

  return (
    <div style={{ minHeight:"100vh", background:"#F8F6F1", fontFamily:"'Cormorant Garamond','Georgia',serif", display:"flex", flexDirection:"column", maxWidth:420, margin:"0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }

        .icon-btn { background:none; border:none; cursor:pointer; color:#1A1A1A; padding:2px; display:flex; }

        .weather-wrap { position:relative; border-radius:16px; overflow:hidden; margin-bottom:20px; }
        .weather-bg { position:absolute; inset:0; background:linear-gradient(135deg,#2C2416 0%,#3D2F1A 40%,#4A3828 70%,#1E1810 100%); }
        .weather-glow1 { position:absolute; width:140px; height:140px; border-radius:50%; background:radial-gradient(circle,rgba(200,170,110,0.45) 0%,transparent 70%); top:-30px; right:-10px; }
        .weather-glow2 { position:absolute; width:100px; height:100px; border-radius:50%; background:radial-gradient(circle,rgba(180,140,80,0.3) 0%,transparent 70%); bottom:-10px; left:20px; }
        .weather-glow3 { position:absolute; width:70px; height:70px; border-radius:50%; background:radial-gradient(circle,rgba(240,210,160,0.2) 0%,transparent 70%); top:50%; right:40%; transform:translateY(-50%); }
        .weather-glass { position:relative; z-index:2; background:rgba(248,246,241,0.1); border:1px solid rgba(248,246,241,0.18); border-radius:16px; padding:16px 18px; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); }
        .weather-badge { display:inline-flex; background:rgba(248,246,241,0.12); border:0.5px solid rgba(248,246,241,0.22); border-radius:100px; padding:3px 10px; font-family:'DM Sans',sans-serif; font-size:9px; color:rgba(248,246,241,0.65); letter-spacing:0.08em; text-transform:uppercase; margin-top:8px; }
        .weather-shimmer { background: linear-gradient(90deg, #2A2A2A 25%, #3A3A3A 50%, #2A2A2A 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:8px; height:96px; margin-bottom:20px; }
        @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }

        .outfit-hero { background:#fff; border:0.5px solid #E8E4DC; border-radius:8px; overflow:hidden; margin-bottom:20px; }
        .outfit-items-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:#F0EDE8; }
        .outfit-item { background:#F8F6F1; aspect-ratio:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; padding:8px 4px; }
        .outfit-emoji { font-size:22px; }
        .outfit-item-name { font-family:'DM Sans',sans-serif; font-size:9px; color:#AAA; text-align:center; line-height:1.2; font-weight:300; }

        .stat-strip { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:20px; }
        .stat-box { background:#fff; border:0.5px solid #E8E4DC; border-radius:6px; padding:12px 10px; text-align:center; }

        .recent-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .look-card { border-radius:6px; overflow:hidden; cursor:pointer; transition:transform 0.15s; }
        .look-card:hover { transform:scale(0.97); }
        .look-thumb { aspect-ratio:3/4; display:flex; align-items:center; justify-content:center; font-size:32px; }

        .refresh-btn { background:none; border:1px solid #E0DCD5; border-radius:100px; padding:4px 12px; font-family:'DM Sans',sans-serif; font-size:10px; color:#AAA; cursor:pointer; transition:all 0.15s; }
        .refresh-btn:hover { border-color:#1A1A1A; color:#1A1A1A; }
        .wear-btn { background:#1A1A1A; color:#F8F6F1; border:none; border-radius:2px; padding:8px 16px; font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; cursor:pointer; transition:background 0.15s; flex-shrink:0; }
        .wear-btn:hover { background:#2D2D2D; }
        .wear-btn.worn { background:#555; }`}</style>

      <div style={{ flex:1, overflowY:"auto", padding:"48px 20px 100px" }}>

        {/* GREETING */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22 }}>
          <div style={{ flex:1, marginRight:16 }}>
            <h1 style={{ fontSize:26, fontWeight:300, color:"#1A1A1A", lineHeight:1.1, marginBottom:8 }}>
              {greeting}, <em style={{ fontStyle:"italic" }}>Alex.</em>
            </h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#B8A898", fontWeight:300, lineHeight:1.6, fontStyle:"italic" }}>
              "This look is tailored just for you — no one else will look as good as you today."
            </p>
          </div>
          <div style={{ display:"flex", gap:14, marginTop:4 }}>
            {[
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/></svg>,
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round"/></svg>,
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/></svg>
            ].map((icon, i) => <button key={i} className="icon-btn">{icon}</button>)}
          </div>
        </div>

        {/* WEATHER */}
        {weatherLoading ? (
          <div className="weather-shimmer" />
        ) : (
          <div className="weather-wrap">
            <div className="weather-bg" />
            <div className="weather-glow1" />
            <div className="weather-glow2" />
            <div className="weather-glow3" />
            <div className="weather-glass">
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:42, fontWeight:300, color:"#fff", lineHeight:1, letterSpacing:"-0.02em" }}>{weather.temp}°</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"rgba(255,255,255,0.6)", fontWeight:300, marginTop:4, letterSpacing:"0.04em", textTransform:"capitalize" }}>{weather.desc}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"rgba(255,255,255,0.35)", letterSpacing:"0.1em", textTransform:"uppercase", marginTop:6 }}>{weather.city}</div>
                </div>
                <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
                  <div style={{ fontSize:40, lineHeight:1 }}>{weather.icon}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"rgba(255,255,255,0.4)", marginTop:4 }}>H:{weather.high}° · L:{weather.low}°</div>
                  <div className="weather-badge">Today</div>
                </div>
              </div>
              <div style={{ height:"0.5px", background:"rgba(255,255,255,0.12)", margin:"12px 0" }} />
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"rgba(255,255,255,0.55)", fontWeight:300, lineHeight:1.5 }}>
                ✦ {weather.tip}
              </div>
            </div>
          </div>
        )}

        {/* TODAY'S OUTFIT */}
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:12 }}>
          <span style={{ fontSize:18, fontWeight:400, color:"#1A1A1A" }}>Today's Look</span>
          <button className="refresh-btn" onClick={cycleOutfit}>Refresh ↻</button>
        </div>

        <div className="outfit-hero">
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px 10px", borderBottom:"0.5px solid #F0EDE8" }}>
            <div>
              <div style={{ fontSize:17, fontWeight:400, color:"#1A1A1A", marginBottom:2 }}>{outfit.name}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"#AAA", fontWeight:300, letterSpacing:"0.06em", textTransform:"uppercase" }}>{outfit.occ}</div>
            </div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:"#F8F6F1", background:"#1A1A1A", padding:"4px 10px", borderRadius:100, letterSpacing:"0.06em", textTransform:"uppercase", flexShrink:0 }}>{outfit.badge}</div>
          </div>
          <div className="outfit-items-grid">
            {outfit.items.map((item, i) => (
              <div key={i} className="outfit-item">
                <div className="outfit-emoji">{item.e}</div>
                <div className="outfit-item-name">{item.n}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#888", fontStyle:"italic", fontWeight:300 }}>"{outfit.note}"</p>
            <button className={`wear-btn${worn ? " worn" : ""}`} onClick={() => setWorn(true)}>
              {worn ? "✓ Logged" : "Wearing this"}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="stat-strip">
          {[["42","Items owned"],["8","Outfits saved"],["3×","Avg. wear"]].map(([num,lbl]) => (
            <div key={lbl} className="stat-box">
              <div style={{ fontSize:22, fontWeight:300, color:"#1A1A1A", lineHeight:1 }}>{num}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:"#AAA", fontWeight:300, marginTop:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* RECENT LOOKS */}
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:12 }}>
          <span style={{ fontSize:18, fontWeight:400, color:"#1A1A1A" }}>Recent Looks</span>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#AAA", cursor:"pointer" }}>See all</span>
        </div>
        <div className="recent-grid">
          {RECENT_LOOKS.slice(0,2).map((look, i) => (
            <div key={i} className="look-card">
              <div className="look-thumb" style={{ background:look.bg }}>{look.e}</div>
              <div style={{ paddingTop:6 }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:400, color:"#1A1A1A" }}>{look.name}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"#AAA", fontWeight:300, marginTop:1 }}>{look.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        {[
          { l:"Home",     active:true  },
          { l:"Closet",   active:false },
          { l:"Style AI", active:false },
          { l:"Profile",  active:false },
        ].map(n => (
          <div key={n.l} className={`nav-item${n.active ? " active" : ""}`}>
            <span className="nav-label">{n.l}</span>
            {n.active && <div style={{ width:4, height:4, borderRadius:"50%", background:"#1A1A1A" }}/>}
          </div>
        ))}
      </div>
    </div>
  );
}
