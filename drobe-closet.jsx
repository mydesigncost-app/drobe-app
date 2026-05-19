      {/* GRID */}
      <div style={{ flex:1, overflowY:"auto", padding:"4px 20px 140px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {filtered.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-placeholder" style={{ background:item.bg }}>
                {item.emoji}
              </div>

              <div className="item-brand">
                {item.brand}
              </div>

              <div className="item-name">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        className="fab"
        onClick={() => setShowModal(true)}
      >
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="#F8F6F1"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 5v14M5 12h14"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* ADD ITEM MODAL */}
      {showModal && (
        <div
          className="modal-backdrop"
          onClick={(e) =>
            e.target.classList.contains("modal-backdrop") &&
            setShowModal(false)
          }
        >
          <div className="modal">
            <div
              style={{
                width:36,
                height:3,
                background:"#D4CFC6",
                borderRadius:2,
                margin:"0 auto 20px"
              }}
            />

            <h3
              style={{
                fontSize:24,
                fontWeight:300,
                color:"#1A1A1A",
                marginBottom:20
              }}
            >
              Add to closet
            </h3>

            <div
              className="upload-zone"
              onClick={addItem}
            >
              <div style={{ fontSize:32, opacity:0.35 }}>
                ↑
              </div>

              <p
                style={{
                  fontFamily:"'DM Sans',sans-serif",
                  fontSize:12,
                  color:"#AAA",
                  textAlign:"center"
                }}
              >
                Take a photo or upload
                <br />
                from your camera roll
              </p>
            </div>

            <button
              className="modal-btn"
              onClick={addItem}
            >
              Choose Photo
            </button>

            <button
              onClick={() => setShowModal(false)}
              style={{
                width:"100%",
                padding:"12px",
                background:"transparent",
                border:"none",
                cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",
                fontSize:12,
                color:"#AAA",
                letterSpacing:"0.04em",
                marginTop:4
              }}
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
