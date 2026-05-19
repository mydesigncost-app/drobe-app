const ITEMS = [
  { id:1,  cat:"tops",        brand:"Totême",          name:"Collared Button Shirt",     bg:"#D8D0C4", emoji:"👔" },
  { id:2,  cat:"bottoms",     brand:"Rag & Bone",      name:"Fit 2 Slim-Fit Jeans",      bg:"#8B9BB4", emoji:"👖" },
  { id:3,  cat:"outerwear",   brand:"Agolde",          name:"Blaze Oversized Coat",      bg:"#B8B0A0", emoji:"🧥" },
  { id:4,  cat:"shoes",       brand:"Saint Laurent",   name:"Full-Grain Leather Boot",   bg:"#3D2B1F", emoji:"👢" },
  { id:5,  cat:"accessories", brand:"Bottega Veneta",  name:"Logo Metal Aviator Sungl.", bg:"#2A2520", emoji:"🕶" },
  { id:6,  cat:"tops",        brand:"Loro Piana",      name:"Virgin Wool Turtleneck",    bg:"#1A1A1A", emoji:"🧶" },
  { id:7,  cat:"bottoms",     brand:"Celine",          name:"Jazz Wide-Leg Pants",       bg:"#2C2C2C", emoji:"👗" },
  { id:8,  cat:"shoes",       brand:"Nippon Made",     name:"Mexico 66 Deluxe",          bg:"#F0EBE0", emoji:"👟" },
  { id:9,  cat:"outerwear",   brand:"Paul Smith",      name:"Cotton-Blend Twill Blazer", bg:"#4A5568", emoji:"🧥" },
  { id:10, cat:"tops",        brand:"Polo Ralph Lauren",name:"Button-Down Collar Shirt", bg:"#B8C8D8", emoji:"👕" },
  { id:11, cat:"accessories", brand:"Garret Leight",   name:"Hampton X Round Sungl.",    bg:"#C8B870", emoji:"🕶" },
  { id:12, cat:"bottoms",     brand:"Aime Leon Dore",  name:"Logo-Embroidered Fleece",   bg:"#2D5016", emoji:"🩳" },
];

const CATS = ["All","Tops","Bottoms","Outerwear","Shoes","Accessories"];

import { useState } from "react";

export default function DigitalCloset({ onNavigate }) {
  const [activeCat, setActiveCat] = useState("All");
  const [items, setItems] = useState(ITEMS);
  const [showModal, setShowModal] = useState(false);

  const filtered = activeCat === "All"
    ? items
    : items.filter(i => i.cat.toLowerCase() === activeCat.toLowerCase());

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      cat: "tops",
      brand: "New Item",
      name: "My clothing item",
      bg: "#E8E4DC",
      emoji: "👕",
    };
    setItems(prev => [newItem, ...prev]);
    setShowModal(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#F8F6F1", fontFamily:"'Cormorant Garamond','Georgia',serif", display:"flex", flexDirection:"column", maxWidth:420, margin:"0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cat-scroll { display:flex; gap:8px; overflow-x:auto; padding-bottom:12px; }
        .cat-scroll::-webkit-scrollbar { display:none; }
        .cat-tab { font-family:'DM Sans',sans-serif; font-size:12px; font-weight:400; color:#888; border:1px solid #E0DCD5; border-radius:100px; padding:7px 16px; white-space:nowrap; cursor:pointer; background:transparent; transition:all 0.15s; flex-shrink:0; letter-spacing:0.04em; }
        .cat-tab:hover { border-color:#1A1A1A; color:#1A1A1A; }
        .cat-tab.active { background:#1A1A1A; color:#F8F6F1; border-color:#1A1A1A; }

        .item-card { border-radius:4px; overflow:hidden; cursor:pointer; transition:transform 0.15s; }
        .item-card:hover { transform:scale(0.97); }
        .item-placeholder { width:100%; aspect-ratio:3/4; display:flex; align-items:center; justify-content:center; font-size:42px; }
        .item-brand { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:500; color:#1A1A1A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:8px; }
        .item-name { font-family:'DM Sans',sans-serif; font-size:10px; color:#AAA; font-weight:300; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:2px; }

        .fab { position:fixed; bottom:80px; right:calc(50% - 210px + 20px); width:52px; height:52px; background:#1A1A1A; border-radius:50%; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(0,0,0,0.22); transition:transform 0.15s; z-index:10; }
        .fab:hover { transform:scale(1.06); }
        .modal { background:#F8F6F1; border-radius:20px 20px 0 0; width:100%; max-width:420px; margin:0 auto; padding:24px 24px 48px; animation:slideUp 0.3s cubic-bezier(0.22,1,0.36,1); }
        @keyframes slideUp { from{transform:translateY(100%);} to{transform:translateY(0);} }
        .upload-zone { border:1px dashed #D4CFC6; border-radius:4px; padding:40px; display:flex; flex-direction:column; align-items:center; gap:8px; cursor:pointer; margin-bottom:16px; transition:border-color 0.15s; }
        .upload-zone:hover { border-color:#1A1A1A; }
        .modal-btn { width:100%; padding:15px; background:#1A1A1A; color:#F8F6F1; border:none; border-radius:2px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; cursor:pointer; }
      `}</style>

      {/* HEADER */}
      <div style={{ padding:"48px 20px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <span style={{ fontSize:24, fontWeight:400, color:"#1A1A1A", letterSpacing:"0.01em" }}>My Closet</span>
          <div style={{ display:"flex", gap:16 }}>
            {[
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/></svg>,
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round"/></svg>,
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l4-4 4 4M7 5v14M21 15l-4 4-4-4M17 19V5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ].map((icon, i) => (
              <button key={i} style={{ background:"none", border:"none", cursor:"pointer", color:"#1A1A1A", padding:4, display:"flex" }}>{icon}</button>
            ))}
          </div>
        </div>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#AAA", fontWeight:300, letterSpacing:"0.06em", marginBottom:14 }}>
          {activeCat} · {filtered.length} items
        </p>
        <div className="cat-scroll">
          {CATS.map(cat => (
            <button key={cat} className={`cat-tab${activeCat === cat ? " active" : ""}`} onClick={() => setActiveCat(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div style={{ flex:1, overflowY:"auto", padding:"4px 20px 140px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {filtered.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-placeholder" style={{ background:item.bg }}>{item.emoji}</div>
              <div className="item-brand">{item.brand}</div>
              <div className="item-name">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => setShowModal(true)}>
        <svg width="22" height="22" fill="none" stroke="#F8F6F1" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
        </svg>
      </button>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        {[
          { label:"Home", active:false },
          { label:"Closet", active:true },
          { label:"Style AI", active:false },
          { label:"Profile", active:false },
        ].map(nav => (
          <div key={nav.label} className={`nav-item${nav.active ? " active" : ""}`}>
            <span className="nav-label">{nav.label}</span>
            {nav.active && <div style={{ width:4, height:4, borderRadius:"50%", background:"#1A1A1A" }}/>}
          </div>
        ))}
      </div>

      {/* ADD ITEM MODAL */}
      {showModal && (
        <div className="modal-backdrop" onClick={(e) => e.target.classList.contains("modal-backdrop") && setShowModal(false)}>
          <div className="modal">
            <div style={{ width:36, height:3, background:"#D4CFC6", borderRadius:2, margin:"0 auto 20px" }}/>
            <h3 style={{ fontSize:24, fontWeight:300, color:"#1A1A1A", marginBottom:20 }}>Add to closet</h3>
            <div className="upload-zone" onClick={addItem}>
              <div style={{ fontSize:32, opacity:0.35 }}>↑</div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#AAA", textAlign:"center" }}>
                Take a photo or upload<br/>from your camera roll
              </p>
            </div>
            <button className="modal-btn" onClick={addItem}>Choose Photo</button>
            <button onClick={() => setShowModal(false)} style={{ width:"100%", padding:"12px", background:"transparent", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#AAA", letterSpacing:"0.04em", marginTop:4 }}>
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
