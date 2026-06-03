import { useState, useEffect } from "react";

/* ── photo data — replace emoji with real <img> when you have photos ── */
const photos = [
  {
    id: 1, emoji: "🌐",
    cat: "NETWORK", color: "#facc15",
    title: "Campus Network Design",
    sub: "12-Floor University Topology",
    desc: "Designed and simulated a complete 12-floor university campus network using Cisco Packet Tracer with VLANs, DHCP, and inter-VLAN routing on a Layer 3 core switch.",
    tags: ["Cisco", "VLAN", "DHCP", "Packet Tracer"],
    img: null, // replace with: import img from "../assets/gallery/campus.jpg"
    height: 180,
  },
  {
    id: 2, emoji: "💻",
    cat: "CODING", color: "#38bdf8",
    title: "LMS Dashboard",
    sub: "Laravel + Vue.js Project",
    desc: "Admin dashboard for the Learning Management System built with Laravel 11 and Vue.js. Covers full course, user, and payment management.",
    tags: ["Laravel", "Vue.js", "MySQL", "Bootstrap"],
    img: null,
    height: 220,
  },
  {
    id: 3, emoji: "📷",
    cat: "CCTV", color: "#f87171",
    title: "CCTV Installation",
    sub: "Edge Tech BD — Fashion Tex",
    desc: "Commercial CCTV surveillance installation with IP cameras, NVR setup, cable routing, and remote access configuration at Fashion Tex.",
    tags: ["CCTV", "IP Camera", "NVR", "Access Control"],
    img: null,
    height: 160,
  },
  {
    id: 4, emoji: "🏆",
    cat: "CERT", color: "#00ff88",
    title: "MTCNA Certificate",
    sub: "Mikrotik Certified Network Associate",
    desc: "Successfully completed MTCNA certification from CSL in 2026, covering RouterOS, PPPoE, DHCP, firewall, QoS, and BGP configurations.",
    tags: ["Mikrotik", "MTCNA", "RouterOS"],
    img: null,
    height: 200,
  },
  {
    id: 5, emoji: "⚡",
    cat: "CODING", color: "#a855f7",
    title: "Renewable Energy IoT",
    sub: "Smart Energy Dashboard",
    desc: "Real-time IoT monitoring dashboard for solar panels, wind turbines, and hydro turbines built with MERN stack and MQTT protocol.",
    tags: ["IoT", "React", "MQTT", "MongoDB"],
    img: null,
    height: 170,
  },
  {
    id: 6, emoji: "🔒",
    cat: "NETWORK", color: "#00e5ff",
    title: "Firewall Architecture",
    sub: "Cisco ASA — DMZ Design",
    desc: "Enterprise Cisco ASA firewall with 3-zone DMZ architecture, extended ACL rules, NAT/PAT configuration, and IDS/IPS monitoring module.",
    tags: ["ASA", "DMZ", "ACL", "NAT"],
    img: null,
    height: 190,
  },
  {
    id: 7, emoji: "🎓",
    cat: "CERT", color: "#facc15",
    title: "Full Stack Certificate",
    sub: "CodeTree It Ltd — 2024",
    desc: "Full Stack Web Developer certification from CodeTree covering HTML5, CSS3, Bootstrap 5, PHP, Laravel and MySQL database design.",
    tags: ["Laravel", "PHP", "Full Stack"],
    img: null,
    height: 150,
  },
  {
    id: 8, emoji: "🏠",
    cat: "CODING", color: "#c084fc",
    title: "Real Estate Platform",
    sub: "Laravel Property Management",
    desc: "Property listing and booking platform with agent roles, Google Maps integration, and admin dashboard built with Laravel 11.",
    tags: ["Laravel", "Google Maps", "MySQL"],
    img: null,
    height: 200,
  },
];

const CATS = ["ALL", "NETWORK", "CODING", "CCTV", "CERT"];

/* ── lightbox ── */
function Lightbox({ photos, index, onClose, onNavigate }) {
  const p = photos[index];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft")   onNavigate(-1);
      if (e.key === "ArrowRight")  onNavigate(1);
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
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(92vw,700px)",
          maxHeight: "90vh",
          background: "#080e1a",
          border: `1px solid ${p.color}40`,
          borderRadius: 14,
          boxShadow: `0 0 50px ${p.color}15`,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
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
              {p.sub}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{
              padding: "2px 10px", borderRadius: 20, fontSize: 9,
              background: `${p.color}15`, border: `1px solid ${p.color}40`,
              color: p.color, fontFamily: "'Share Tech Mono',monospace",
            }}>
              {p.cat}
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
            border: `1px solid ${p.color}25`,
            marginBottom: 16,
            minHeight: 220,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `linear-gradient(135deg,${p.color}10,#04080f)`,
            fontSize: 90,
            position: "relative",
          }}>
            {p.img
              ? <img src={p.img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              : <span>{p.emoji}</span>
            }
          </div>

          {/* description */}
          <p style={{
            fontSize: 13, color: "#6a9bbf", lineHeight: 1.8,
            marginBottom: 14, padding: "10px 14px",
            background: "rgba(0,229,255,0.03)",
            border: "1px solid rgba(0,229,255,0.07)", borderRadius: 7,
          }}>
            {p.desc}
          </p>

          {/* tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {p.tags.map((t) => (
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
                border: "1px solid rgba(0,229,255,0.15)",
                background: "transparent",
                color: index === 0 ? "#1a2a3a" : "#6a9bbf",
                fontFamily: "'Share Tech Mono',monospace", fontSize: 10,
                cursor: index === 0 ? "not-allowed" : "pointer",
              }}
            >
              <i className="ti ti-arrow-left" style={{ fontSize: 11 }} /> PREV
            </button>

            {/* dot indicators */}
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

/* ── main section ── */
const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = activeFilter === "ALL" ? photos : photos.filter((p) => p.cat === activeFilter);

  /* split into 3 columns for masonry */
  const cols = [[], [], []];
  filtered.forEach((p, i) => cols[i % 3].push(p));

  const handleNavigate = (dir) => {
    setLightboxIndex((prev) => Math.max(0, Math.min(filtered.length - 1, prev + dir)));
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
            {CATS.map((cat) => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                style={{
                  padding: "5px 16px", borderRadius: 20,
                  border: activeFilter === cat ? "1px solid #00e5ff" : "1px solid rgba(0,229,255,0.12)",
                  background: activeFilter === cat ? "rgba(0,229,255,0.1)" : "transparent",
                  color: activeFilter === cat ? "#00e5ff" : "#2a4a6a",
                  fontFamily: "'Share Tech Mono',monospace", fontSize: 10,
                  letterSpacing: 2, cursor: "pointer", transition: "all .2s",
                }}
              >
                {cat}
              </button>
            ))}
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#2a4a6a", marginLeft: 4 }}>
              {filtered.length} PHOTO{filtered.length !== 1 ? "S" : ""}
            </span>
          </div>

          {/* masonry grid — 3 col → 2 col → 1 col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
            {[cols[0], cols[1], cols[2]].map((col, ci) => (
              <div key={ci} className="flex flex-col gap-3">
                {col.map((p) => {
                  const globalIdx = filtered.indexOf(p);
                  return (
                    <div
                      key={p.id}
                      onClick={() => setLightboxIndex(globalIdx)}
                      className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                      style={{ border: "1px solid rgba(0,229,255,0.08)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${p.color}60`;
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = `0 10px 30px ${p.color}12`;
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
                        height: p.height, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 44, background: "#0c1422",
                        position: "relative", overflow: "hidden",
                      }}>
                        <div style={{
                          position: "absolute", inset: 0,
                          background: `linear-gradient(135deg,${p.color}12,transparent)`,
                        }} />
                        {p.img
                          ? <img src={p.img} alt={p.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ position: "relative", zIndex: 1 }}>{p.emoji}</span>
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
                        <div style={{ fontSize: 9, color: p.color, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, marginBottom: 4 }}>
                          {p.cat}
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

        </div>
      </section>
    </>
  );
}

export default Gallery;