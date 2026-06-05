import { useState, useEffect } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* ── Default fallback data (shown when DB unreachable / empty) ── */
const DEFAULT_CATEGORIES = [
  { _id: "def_1", name: "NETWORK", slug: "network", color: "#facc15" },
  { _id: "def_2", name: "CODING",  slug: "coding",  color: "#38bdf8" },
  { _id: "def_3", name: "CERT",    slug: "cert",    color: "#00ff88" },
];

const DEFAULT_PHOTOS = [
  {
    _id: "dp1", title: "Campus Network Design", subtitle: "12-Floor University Topology",
    desc: "Designed a complete 12-floor university campus network with VLANs, DHCP, and inter-VLAN routing on a Layer 3 core switch.",
    tags: ["Cisco", "VLAN", "DHCP"], category: "NETWORK", emoji: "🌐", color: "#facc15", image: "", height: 180,
  },
];

/* ── Lightbox ─────────────────────────────────────────────────── */
function Lightbox({ photos, index, onClose, onNavigate }) {
  const p = photos[index];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onNavigate(-1);
      if (e.key === "ArrowRight") onNavigate(1);
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [index]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 900,
        background: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(92vw,700px)", maxHeight: "90vh",
          background: "#080e1a", border: `1px solid ${p.color}40`,
          borderRadius: 14, boxShadow: `0 0 50px ${p.color}15`,
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        {/* top strip */}
        <div style={{ height: 3, flexShrink: 0, background: `linear-gradient(90deg,transparent,${p.color},transparent)` }} />

        {/* header */}
        <div style={{
          flexShrink: 0, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12,
          padding: "13px 18px", background: "#04080f",
          borderBottom: "1px solid rgba(0,229,255,0.08)",
        }}>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, fontWeight: 700, color: p.color, letterSpacing: 2 }}>
              {p.title}
            </div>
            <div style={{ fontSize: 10, color: "#6a9bbf", fontFamily: "'Share Tech Mono',monospace", marginTop: 2 }}>
              {p.subtitle}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{
              padding: "2px 10px", borderRadius: 20, fontSize: 9,
              background: `${p.color}15`, border: `1px solid ${p.color}40`,
              color: p.color, fontFamily: "'Share Tech Mono',monospace",
            }}>
              {p.category}
            </span>
            <button onClick={onClose} style={{
              background: "none", border: "none", color: "#2a4a6a",
              cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 4,
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#2a4a6a")}
            >
              <i className="ti ti-x" />
            </button>
          </div>
        </div>

        {/* scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 18, minHeight: 0 }}>

          {/* image / emoji area */}
          <div style={{
            borderRadius: 10, overflow: "hidden",
            border: `1px solid ${p.color}25`, marginBottom: 16,
            minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center",
            background: `linear-gradient(135deg,${p.color}10,#04080f)`,
            fontSize: 90, position: "relative",
          }}>
            {p.image
              ? <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              : <span>{p.emoji}</span>
            }
          </div>

          {/* description */}
          <p style={{
            fontSize: 13, color: "#6a9bbf", lineHeight: 1.8, marginBottom: 14,
            padding: "10px 14px", background: "rgba(0,229,255,0.03)",
            border: "1px solid rgba(0,229,255,0.07)", borderRadius: 7,
          }}>
            {p.desc}
          </p>

          {/* tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {(p.tags || []).map((t) => (
              <span key={t} style={{
                padding: "3px 10px", borderRadius: 20, fontSize: 9,
                background: `${p.color}12`, border: `1px solid ${p.color}35`,
                color: p.color, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1,
              }}>{t}</span>
            ))}
          </div>

          {/* nav */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: 12, borderTop: "1px solid rgba(0,229,255,0.07)", gap: 10,
          }}>
            <button
              onClick={() => onNavigate(-1)} disabled={index === 0}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 6,
                border: "1px solid rgba(0,229,255,0.15)", background: "transparent",
                color: index === 0 ? "#1a2a3a" : "#6a9bbf",
                fontFamily: "'Share Tech Mono',monospace", fontSize: 10,
                cursor: index === 0 ? "not-allowed" : "pointer",
              }}
            >
              <i className="ti ti-arrow-left" style={{ fontSize: 11 }} /> PREV
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {photos.map((_, i) => (
                <div
                  key={i}
                  onClick={() => onNavigate(i - index)}
                  style={{
                    width: i === index ? 18 : 6, height: 6,
                    borderRadius: 3, cursor: "pointer",
                    background: i === index ? p.color : "rgba(0,229,255,0.12)",
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => onNavigate(1)} disabled={index === photos.length - 1}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 6,
                border: `1px solid ${index === photos.length - 1 ? "rgba(0,229,255,0.15)" : p.color + "50"}`,
                background: index === photos.length - 1 ? "transparent" : `${p.color}10`,
                color: index === photos.length - 1 ? "#1a2a3a" : p.color,
                fontFamily: "'Share Tech Mono',monospace", fontSize: 10,
                cursor: index === photos.length - 1 ? "not-allowed" : "pointer",
              }}
            >
              NEXT <i className="ti ti-arrow-right" style={{ fontSize: 11 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Gallery Section ─────────────────────────────────────── */
const Gallery = () => {
  const [categories,     setCategories]     = useState([]);
  const [photos,         setPhotos]         = useState([]);
  const [activeFilter,   setActiveFilter]   = useState("ALL");
  const [lightboxIndex,  setLightboxIndex]  = useState(null);
  const [loading,        setLoading]        = useState(true);

  // ── Fetch categories ─────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res  = await fetch(`${API_BASE}/photo-categories`);
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          setCategories(data.data);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch {
        setCategories(DEFAULT_CATEGORIES);
      }
    };
    fetchCategories();
  }, []);

  // ── Fetch photos ─────────────────────────────────────────────
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API_BASE}/photos`);
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          setPhotos(data.data);
        } else {
          setPhotos(DEFAULT_PHOTOS);
        }
      } catch {
        setPhotos(DEFAULT_PHOTOS);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  // ── Filter tabs: ALL + each category from DB ─────────────────
  const FILTER_TABS = ["ALL", ...categories.filter((c) => c.isActive !== false).map((c) => c.name)];

  const filtered = activeFilter === "ALL"
    ? photos.filter((p) => p.isActive !== false)
    : photos.filter((p) => p.isActive !== false && p.category === activeFilter);

  // ── 3-column masonry split ───────────────────────────────────
  const cols = [[], [], []];
  filtered.forEach((p, i) => cols[i % 3].push(p));

  const handleNavigate = (dir) => {
    setLightboxIndex((prev) => Math.max(0, Math.min(filtered.length - 1, prev + dir)));
  };

  // ── Get accent color for a category name ────────────────────
  const catColor = (catName) => {
    const found = categories.find((c) => c.name === catName);
    return found?.color || "#00e5ff";
  };

  return (
    <>
      {lightboxIndex !== null && (
        <Lightbox
          photos={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={handleNavigate}
        />
      )}

      <section
        id="gallery"
        className="relative z-[2]"
        style={{ background: "#04080f", padding: "80px 0 60px" }}
      >
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">

          {/* header */}
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 3, color: "#2a4a6a", marginBottom: 10 }}>
            // GALLERY.ARRAY
          </div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 26, fontWeight: 700, color: "#00e5ff", letterSpacing: 4, marginBottom: 8 }}>
            PHOTO GALLERY
          </div>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,#00e5ff,transparent)", marginBottom: 28 }} />

          {/* filter tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28, alignItems: "center" }}>
            {FILTER_TABS.map((cat) => {
              const color = cat === "ALL" ? "#00e5ff" : catColor(cat);
              const isActive = activeFilter === cat;
              return (
                <button key={cat} onClick={() => setActiveFilter(cat)}
                  style={{
                    padding: "5px 16px", borderRadius: 20,
                    border: isActive ? `1px solid ${color}` : "1px solid rgba(0,229,255,0.12)",
                    background: isActive ? `${color}18` : "transparent",
                    color: isActive ? color : "#2a4a6a",
                    fontFamily: "'Share Tech Mono',monospace", fontSize: 10,
                    letterSpacing: 2, cursor: "pointer", transition: "all .2s",
                  }}
                >
                  {cat}
                </button>
              );
            })}
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#2a4a6a", marginLeft: 4 }}>
              {filtered.length} PHOTO{filtered.length !== 1 ? "S" : ""}
            </span>
          </div>

          {/* loading */}
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "3px solid rgba(0,229,255,0.15)",
                borderTopColor: "#00e5ff", animation: "spin 0.8s linear infinite",
              }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : (
            /* masonry grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
              {[cols[0], cols[1], cols[2]].map((col, ci) => (
                <div key={ci} className="flex flex-col gap-3">
                  {col.map((p) => {
                    const globalIdx = filtered.indexOf(p);
                    const pColor = p.color || catColor(p.category) || "#00e5ff";
                    return (
                      <div
                        key={p._id}
                        onClick={() => setLightboxIndex(globalIdx)}
                        className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                        style={{ border: "1px solid rgba(0,229,255,0.08)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = `${pColor}60`;
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = `0 10px 30px ${pColor}12`;
                          e.currentTarget.querySelector(".card-overlay").style.opacity = "1";
                          e.currentTarget.querySelector(".zoom-btn").style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(0,229,255,0.08)";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.querySelector(".card-overlay").style.opacity = "0";
                          e.currentTarget.querySelector(".zoom-btn").style.opacity = "0";
                        }}
                      >
                        {/* image / emoji placeholder */}
                        <div style={{
                          height: p.height || 180, display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontSize: 44, background: "#0c1422",
                          position: "relative", overflow: "hidden",
                        }}>
                          <div style={{
                            position: "absolute", inset: 0,
                            background: `linear-gradient(135deg,${pColor}12,transparent)`,
                          }} />
                          {p.image
                            ? <img src={p.image} alt={p.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                            : <span style={{ position: "relative", zIndex: 1 }}>{p.emoji || "📷"}</span>
                          }
                        </div>

                        {/* hover overlay */}
                        <div
                          className="card-overlay"
                          style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(to top,rgba(4,8,15,.92) 0%,transparent 55%)",
                            opacity: 0, transition: "opacity 0.3s",
                            display: "flex", flexDirection: "column",
                            justifyContent: "flex-end", padding: "14px 12px",
                          }}
                        >
                          <div style={{ fontSize: 9, color: pColor, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: 4 }}>
                            {p.category}
                          </div>
                          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 11, fontWeight: 700, color: "#c8e8f8", letterSpacing: 1, lineHeight: 1.4 }}>
                            {p.title}
                          </div>
                        </div>

                        {/* zoom icon */}
                        <div
                          className="zoom-btn"
                          style={{
                            position: "absolute", top: 10, right: 10,
                            width: 28, height: 28, borderRadius: "50%",
                            background: "rgba(0,229,255,0.15)",
                            border: "1px solid rgba(0,229,255,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: 0, transition: "opacity 0.3s",
                            color: "#00e5ff", fontSize: 13,
                          }}
                        >
                          <i className="ti ti-zoom-in" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default Gallery;
