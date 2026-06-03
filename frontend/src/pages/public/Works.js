import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ── Default fallback (shown while loading OR if DB fails) ────────
const DEFAULT_PROJECTS = [
  {
    _id: "default_1",
    icon: "🏪", iconBg: "linear-gradient(135deg,#facc1520,#fbbf2420)",
    accentColor: "#facc15", accentBg: "rgba(250,204,21,0.08)", accentBorder: "rgba(250,204,21,0.25)",
    category: "NETWORKING", title: "Shop Management System", subtitle: "Based on Networking & CCTV",
    shortDesc: "A complete shop network with 40 PCs, IP cameras, printers, and access points — all segmented via VLAN for security.",
    longDesc: "Designed and simulated a shop environment with 40 computers, 6 IP cameras, 2 printers, and 2 wireless access points using Cisco Packet Tracer. The network uses VLAN segmentation to isolate CCTV traffic from the main office network, improving both security and performance.",
    features: ["40 PCs + 6 IP Cameras + 2 Printers","VLAN Segmentation (Camera vs Office)","DHCP per VLAN","Layer 3 Inter-VLAN Routing","2 Wireless Access Points","Admin-only CCTV access control"],
    tags: ["Cisco","VLAN","CCTV","DHCP","Packet Tracer"],
    url: null, github: null, isActive: true, order: 0, image: "",
  },
];

const ALL_CATEGORIES = ["ALL","MERN","LARAVEL","NETWORKING","IoT","SECURITY","OTHER"];

/* ─── PROJECT MODAL ────────────────────────────────────────────── */
function ProjectModal({ project: p, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const hasImage = p.image && p.image.trim() !== "";

  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: "min(85%, 880px)", maxHeight: "90vh",
          background: "#080e1a", border: `1px solid ${p.accentBorder}`,
          borderRadius: 14, boxShadow: `0 0 60px ${p.accentBg}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* top colour strip */}
        <div style={{ height: 3, background: `linear-gradient(90deg,transparent,${p.accentColor},transparent)`, flexShrink: 0 }} />

        {/* header */}
        <div className="flex items-center justify-between flex-shrink-0"
          style={{ padding: "14px 18px", borderBottom: "1px solid rgba(0,229,255,0.08)", background: "#04080f" }}>
          <div className="flex items-center gap-3">
            {/* icon OR thumbnail */}
            <div className="flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden"
              style={{ width: 48, height: 48, background: p.iconBg, border: `1px solid ${p.accentBorder}` }}>
              {hasImage
                ? <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 24 }}>{p.icon || "📁"}</span>
              }
            </div>
            <div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 700, color: p.accentColor, letterSpacing: 2 }}>{p.title}</div>
              <div style={{ fontSize: 11, color: "#6a9bbf", fontFamily: "'Share Tech Mono',monospace", marginTop: 2 }}>{p.subtitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px]"
              style={{ background: p.accentBg, border: `1px solid ${p.accentBorder}`, color: p.accentColor, fontFamily: "'Share Tech Mono',monospace" }}>
              {p.category}
            </span>
            <button onClick={onClose}
              style={{ background: "none", border: "none", color: "#2a4a6a", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00e5ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#2a4a6a")}>
              <i className="ti ti-x" />
            </button>
          </div>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto" style={{ padding: 20 }}>
          {/* full image if present */}
          {hasImage && (
            <div style={{ marginBottom: 18, borderRadius: 10, overflow: "hidden", border: `1px solid ${p.accentBorder}` }}>
              <img src={p.image} alt={p.title} style={{ width: "100%", maxHeight: 240, objectFit: "cover", display: "block" }} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* left */}
            <div>
              <div style={{ fontSize: 13, color: "#c8e8f8", lineHeight: 1.8, marginBottom: 18,
                padding: "12px 14px", background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.08)", borderRadius: 8 }}>
                {p.shortDesc}
              </div>
              <div style={{ fontSize: 10, color: "#2a4a6a", letterSpacing: 3, fontFamily: "'Share Tech Mono',monospace", marginBottom: 8 }}>// DESCRIPTION</div>
              <p style={{ fontSize: 12, color: "#6a9bbf", lineHeight: 1.85, marginBottom: 20 }}>{p.longDesc}</p>

              <div style={{ fontSize: 10, color: "#2a4a6a", letterSpacing: 3, fontFamily: "'Share Tech Mono',monospace", marginBottom: 8 }}>// TECH STACK</div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {(p.tags || []).map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full text-[10px]"
                    style={{ background: p.accentBg, border: `1px solid ${p.accentBorder}`, color: p.accentColor, fontFamily: "'Share Tech Mono',monospace" }}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2.5 mt-2">
                {p.url && (
                  <a href={p.url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 no-underline transition-all duration-200"
                    style={{ padding: "8px 18px", background: p.accentBg, border: `1px solid ${p.accentBorder}`,
                      color: p.accentColor, borderRadius: 6, fontSize: 11, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1 }}>
                    <i className="ti ti-external-link" style={{ fontSize: 13 }} /> LIVE DEMO
                  </a>
                )}
                {p.github && (
                  <a href={p.github} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 no-underline transition-all duration-200"
                    style={{ padding: "8px 18px", background: "rgba(0,229,255,0.05)",
                      border: "1px solid rgba(0,229,255,0.15)", color: "#6a9bbf",
                      borderRadius: 6, fontSize: 11, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1 }}>
                    <i className="ti ti-brand-github" style={{ fontSize: 13 }} /> GITHUB
                  </a>
                )}
                {!p.url && !p.github && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.08)",
                      fontSize: 10, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace" }}>
                    <i className="ti ti-lock" style={{ fontSize: 12 }} /> PRIVATE / LOCAL PROJECT
                  </div>
                )}
              </div>
            </div>

            {/* right — features */}
            <div>
              <div style={{ fontSize: 10, color: "#2a4a6a", letterSpacing: 3, fontFamily: "'Share Tech Mono',monospace", marginBottom: 10 }}>// KEY FEATURES</div>
              <div className="flex flex-col gap-2">
                {(p.features || []).map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg"
                    style={{ background: "#0c1422", border: `1px solid ${p.accentBorder}` }}>
                    <span style={{ color: p.accentColor, fontSize: 12, marginTop: 1, flexShrink: 0 }}>▸</span>
                    <span style={{ fontSize: 12, color: "#c8e8f8", lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, textAlign: "right", fontFamily: "'Orbitron',sans-serif",
                fontSize: 48, fontWeight: 900, color: "rgba(0,229,255,0.04)", lineHeight: 1, userSelect: "none" }}>
                {String(p.order || 0).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── WORKS SECTION ────────────────────────────────────────────── */
const Works = () => {
  const [projects,     setProjects]     = useState(DEFAULT_PROJECTS);
  const [loading,      setLoading]      = useState(true);
  const [dbLoaded,     setDbLoaded]     = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selected,     setSelected]     = useState(null);
  const gridRef = useRef(null);

  // Fetch from DB — show default_1 while loading, replace with DB data on success
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/works`);
        if (data.success && data.data.length > 0) {
          setProjects(data.data);
          setDbLoaded(true);
        }
        // if DB returns empty or source=default, DEFAULT_PROJECTS stays
      } catch {
        // network error — DEFAULT_PROJECTS stays
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, []);

  // Derive available categories from current data
  const availableCategories = ["ALL", ...new Set(projects.map((p) => p.category))];

  const filtered = activeFilter === "ALL"
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  // Staggered fade-in on filter change
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".work-card-item");
    cards?.forEach((c, i) => {
      c.style.opacity = 0;
      c.style.transform = "translateY(16px)";
      setTimeout(() => {
        c.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        c.style.opacity = 1;
        c.style.transform = "translateY(0)";
      }, i * 70);
    });
  }, [activeFilter, projects]);

  return (
    <>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}

      <section id="works" className="relative z-[2]" style={{ padding: "80px 0 60px", background: "#080e1a" }}>
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">

          {/* header */}
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 3, color: "#2a4a6a", marginBottom: 10 }}>
            // PROJECTS.LIST
          </div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 26, fontWeight: 700, color: "#00e5ff", letterSpacing: 4, marginBottom: 8 }}>
            MY WORKS
          </div>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,#00e5ff,transparent)", marginBottom: 28 }} />

          {/* status bar */}
          {loading && (
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#2a4a6a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#facc15", animation: "pulse 1.5s infinite" }} />
              CONNECTING TO DATABASE...
            </div>
          )}
          {!loading && dbLoaded && (
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#00ff88", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88" }} />
              DATABASE CONNECTED — {projects.length} PROJECTS LOADED
            </div>
          )}
          {!loading && !dbLoaded && (
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#f87171", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171" }} />
              SHOWING DEFAULT DATA — DATABASE OFFLINE
            </div>
          )}

          {/* filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {availableCategories.map((cat) => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className="transition-all duration-200"
                style={{
                  padding: "5px 14px", borderRadius: 20,
                  border: activeFilter === cat ? "1px solid #00e5ff" : "1px solid rgba(0,229,255,0.12)",
                  background: activeFilter === cat ? "rgba(0,229,255,0.1)" : "transparent",
                  color: activeFilter === cat ? "#00e5ff" : "#2a4a6a",
                  fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 2, cursor: "pointer",
                }}>
                {cat}
              </button>
            ))}
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#2a4a6a", alignSelf: "center", marginLeft: 4 }}>
              {filtered.length} PROJECT{filtered.length !== 1 ? "S" : ""}
            </span>
          </div>

          {/* cards grid */}
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => {
              const hasImage = p.image && p.image.trim() !== "";
              return (
                <div key={p._id}
                  className="work-card-item relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col"
                  style={{ background: "#0c1422", border: "1px solid rgba(0,229,255,0.1)" }}
                  onClick={() => setSelected(p)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = p.accentBorder;
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = `0 8px 30px ${p.accentBg}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0,229,255,0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}>

                  {/* card image/icon area */}
                  <div className="relative flex items-center justify-center"
                    style={{ height: 130, background: hasImage ? "#000" : p.iconBg, borderBottom: "1px solid rgba(0,229,255,0.08)" }}>
                    {hasImage ? (
                      <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
                    ) : (
                      <span style={{ fontSize: 52 }}>{p.icon || "📁"}</span>
                    )}
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(135deg,rgba(0,229,255,0.03),transparent,rgba(168,85,247,0.03))" }} />
                    {/* category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-full text-[9px]"
                        style={{ background: p.accentBg, border: `1px solid ${p.accentBorder}`, color: p.accentColor, fontFamily: "'Share Tech Mono',monospace" }}>
                        {p.category}
                      </span>
                    </div>
                    {/* image badge */}
                    {hasImage && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px]"
                          style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)", color: "#aaa", fontFamily: "'Share Tech Mono',monospace" }}>
                          IMG
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-3 flex items-center gap-1"
                      style={{ fontSize: 9, color: "rgba(0,229,255,0.3)", fontFamily: "'Share Tech Mono',monospace" }}>
                      <i className="ti ti-click" style={{ fontSize: 11 }} /> CLICK TO VIEW
                    </div>
                  </div>

                  {/* card body */}
                  <div className="flex flex-col flex-1 p-4">
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, fontWeight: 700, color: "#c8e8f8", letterSpacing: 1, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ fontSize: 10, color: p.accentColor, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1, marginBottom: 8 }}>{p.subtitle}</div>
                    <p style={{ fontSize: 11, color: "#6a9bbf", lineHeight: 1.65, marginBottom: 12, flexGrow: 1 }}>{p.shortDesc}</p>
                    <div style={{ height: 1, background: "rgba(0,229,255,0.06)", marginBottom: 10 }} />
                    <div className="flex flex-wrap gap-1">
                      {(p.tags || []).slice(0, 4).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full text-[9px]"
                          style={{ border: "1px solid rgba(0,229,255,0.1)", color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace" }}>
                          {t}
                        </span>
                      ))}
                      {(p.tags || []).length > 4 && (
                        <span className="px-2 py-0.5 rounded-full text-[9px]"
                          style={{ border: `1px solid ${p.accentBorder}`, color: p.accentColor, fontFamily: "'Share Tech Mono',monospace" }}>
                          +{p.tags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Works;



// import { useState, useEffect, useRef } from "react";

// /* ─────────────────────────────────────────────────────────────
//    PROJECT DATA
// ───────────────────────────────────────────────────────────── */
// const projects = [
//   {
//     id: 1,
//     icon: "🏪",
//     iconBg: "linear-gradient(135deg,#facc1520,#fbbf2420)",
//     accentColor: "#facc15",
//     accentBg: "rgba(250,204,21,0.08)",
//     accentBorder: "rgba(250,204,21,0.25)",
//     category: "NETWORKING",
//     title: "Shop Management System",
//     subtitle: "Based on Networking & CCTV",
//     shortDesc:
//       "A complete shop network with 40 PCs, IP cameras, printers, and access points — all segmented via VLAN for security.",
//     longDesc:
//       "Designed and simulated a shop environment with 40 computers, 6 IP cameras, 2 printers, and 2 wireless access points using Cisco Packet Tracer. The network uses VLAN segmentation to isolate CCTV traffic from the main office network, improving both security and performance. DHCP is configured per VLAN, and inter-VLAN routing is handled by a Layer 3 switch. The camera VLAN is isolated and accessible only by the admin station.",
//     features: [
//       "40 PCs + 6 IP Cameras + 2 Printers",
//       "VLAN Segmentation (Camera vs Office)",
//       "DHCP per VLAN",
//       "Layer 3 Inter-VLAN Routing",
//       "2 Wireless Access Points",
//       "Admin-only CCTV access control",
//     ],
//     tags: ["Cisco", "VLAN", "CCTV", "DHCP", "Packet Tracer"],
//     url: null,
//     github: null,
//   },
//   {
//     id: 2,
//     icon: "🏠",
//     iconBg: "linear-gradient(135deg,#c084fc20,#a855f720)",
//     accentColor: "#c084fc",
//     accentBg: "rgba(168,85,247,0.08)",
//     accentBorder: "rgba(168,85,247,0.25)",
//     category: "LARAVEL",
//     title: "Real Estate Platform",
//     subtitle: "Laravel Property Management",
//     shortDesc:
//       "Full-featured real estate platform for property listing, search filtering, agent management, and booking inquiries.",
//     longDesc:
//       "A comprehensive real estate web application built with Laravel 11 and MySQL. Users can browse and filter properties by type, location, and price range. Registered agents can list and manage their properties. Admin dashboard handles user roles, featured listings, and inquiry management. The frontend is built with Blade templates and Bootstrap 5, with an integrated Google Maps API for location display.",
//     features: [
//       "Property listing with image gallery",
//       "Advanced search & filter (type, price, area)",
//       "Agent & buyer roles with dashboard",
//       "Booking inquiry & messaging system",
//       "Google Maps integration",
//       "Admin panel — listings, users, inquiries",
//     ],
//     tags: ["Laravel", "MySQL", "Bootstrap", "PHP", "Google Maps"],
//     url: null,
//     github: null,
//   },
//   {
//     id: 3,
//     icon: "⚡",
//     iconBg: "linear-gradient(135deg,#00ff8820,#00e5ff20)",
//     accentColor: "#00ff88",
//     accentBg: "rgba(0,255,136,0.08)",
//     accentBorder: "rgba(0,255,136,0.25)",
//     category: "IoT",
//     title: "Smart Renewable Energy",
//     subtitle: "IoT Solar, Wind & Turbine Monitor",
//     shortDesc:
//       "Real-time IoT dashboard monitoring solar panels, wind turbines, and energy output with live charts and alerts.",
//     longDesc:
//       "An IoT-based smart energy monitoring system that tracks solar panel output, wind turbine RPM, and hydro turbine wattage in real time. Sensor data is transmitted via MQTT protocol to a Node.js backend and displayed on a React dashboard with live graphs. The system includes threshold-based alerts (email/SMS), historical data logging to MongoDB, and an energy efficiency report generator. Designed for small to medium renewable installations.",
//     features: [
//       "Real-time solar, wind & turbine monitoring",
//       "MQTT sensor data transmission",
//       "Live charts with recharts/Chart.js",
//       "Threshold alerts (email & SMS)",
//       "Historical data logging (MongoDB)",
//       "Energy efficiency report generator",
//     ],
//     tags: ["IoT", "React", "Node.js", "MQTT", "MongoDB", "Arduino"],
//     url: null,
//     github: "https://github.com/khairulhub/renewableEnergy",
//   },
//   {
//     id: 4,
//     icon: "🎓",
//     iconBg: "linear-gradient(135deg,#38bdf820,#0ea5e920)",
//     accentColor: "#38bdf8",
//     accentBg: "rgba(56,189,248,0.08)",
//     accentBorder: "rgba(56,189,248,0.25)",
//     category: "LARAVEL",
//     title: "Learning Management System",
//     subtitle: "Course Selling Platform",
//     shortDesc:
//       "LMS where instructors post courses, students purchase and learn, and admins manage the full platform.",
//     longDesc:
//       "A full-featured Learning Management System built with Laravel 11 and Vue.js. Instructors can create multi-section video courses with attachments and quizzes. Students can browse, preview, and purchase courses via SSL Commerz payment gateway. After purchase, students access their dashboard with progress tracking, certificates, and discussion forums. The admin panel handles course approval, user management, revenue reports, and coupon codes.",
//     features: [
//       "Instructor course creation with video upload",
//       "Student purchase via SSL Commerz",
//       "Progress tracking & certificates",
//       "Quiz & assignment system",
//       "Discussion forums per course",
//       "Admin panel — approvals, revenue, coupons",
//     ],
//     tags: ["Laravel", "Vue.js", "MySQL", "SSL Commerz", "PHP"],
//     url: null,
//     github: null,
//   },
//   {
//     id: 5,
//     icon: "🛒",
//     iconBg: "linear-gradient(135deg,#ffa04020,#fb923c20)",
//     accentColor: "#ffa040",
//     accentBg: "rgba(255,140,0,0.08)",
//     accentBorder: "rgba(255,140,0,0.25)",
//     category: "MERN",
//     title: "Ecommerce Website",
//     subtitle: "Full-Stack MERN Shop",
//     shortDesc:
//       "Modern e-commerce platform with product management, cart, payment gateway, and admin dashboard.",
//     longDesc:
//       "A production-ready ecommerce platform built with the MERN stack. Features include product catalog with categories and filters, shopping cart with local persistence, wishlist, user authentication with JWT, and Stripe/SSL Commerz payment integration. The admin dashboard provides inventory management, order tracking, sales analytics, and coupon management. Built with Redux Toolkit for state management and Tailwind CSS for styling.",
//     features: [
//       "Product catalog with category & filter",
//       "Cart, wishlist & checkout flow",
//       "JWT authentication (user & admin)",
//       "Stripe & SSL Commerz payment",
//       "Order tracking & history",
//       "Admin — inventory, orders, analytics",
//     ],
//     tags: ["React", "Node.js", "MongoDB", "Express", "Stripe", "Redux"],
//     url: null,
//     github: null,
//   },
//   {
//     id: 6,
//     icon: "🌐",
//     iconBg: "linear-gradient(135deg,#facc1520,#fbbf2420)",
//     accentColor: "#facc15",
//     accentBg: "rgba(250,204,21,0.08)",
//     accentBorder: "rgba(250,204,21,0.25)",
//     category: "NETWORKING",
//     title: "Campus Network Design",
//     subtitle: "12-Floor University Network",
//     shortDesc:
//       "Secure multi-floor campus network with VLANs, DHCP, inter-VLAN routing, and wireless infrastructure.",
//     longDesc:
//       "Designed and simulated a secure university campus network spanning 12 floors (labs 1201–1212) using Cisco Packet Tracer. Each lab is assigned a dedicated VLAN with its own DHCP pool. Inter-VLAN routing is handled by a central Layer 3 switch. Redundant uplinks are configured with Spanning Tree Protocol (STP). Wireless access points are placed on each floor for staff and student coverage. ACL rules restrict inter-department access for security.",
//     features: [
//       "12 floors × dedicated VLAN per lab",
//       "DHCP server per VLAN",
//       "Layer 3 inter-VLAN routing",
//       "STP redundancy on uplinks",
//       "Wireless APs on every floor",
//       "ACL-based access restrictions",
//     ],
//     tags: ["Cisco", "VLAN", "DHCP", "OSPF", "STP", "Packet Tracer"],
//     url: null,
//     github: null,
//   },
//   {
//     id: 7,
//     icon: "🔒",
//     iconBg: "linear-gradient(135deg,#f8717120,#ef444420)",
//     accentColor: "#f87171",
//     accentBg: "rgba(239,68,68,0.08)",
//     accentBorder: "rgba(239,68,68,0.25)",
//     category: "SECURITY",
//     title: "Firewall System",
//     subtitle: "Enterprise DMZ & ACL Design",
//     shortDesc:
//       "Enterprise firewall with DMZ architecture, ACL rules, NAT configuration, and intrusion detection setup.",
//     longDesc:
//       "Designed a comprehensive enterprise firewall system using Cisco ASA. The architecture includes a DMZ zone for public-facing servers (web, mail, DNS), an internal LAN zone, and the outside internet zone. NAT/PAT is configured for address translation. Extended ACLs define granular traffic policies. The IDS/IPS module monitors inbound traffic for known attack signatures. Zone-based policies ensure the DMZ cannot initiate connections to the LAN. All configurations are documented and testable in Cisco Packet Tracer.",
//     features: [
//       "Cisco ASA 3-zone architecture (LAN/DMZ/WAN)",
//       "NAT/PAT for address translation",
//       "Extended ACL traffic policies",
//       "IDS/IPS signature monitoring",
//       "DMZ → LAN traffic blocked by default",
//       "VPN tunnel for remote admin access",
//     ],
//     tags: ["Cisco ASA", "ACL", "NAT", "DMZ", "IDS/IPS", "VPN"],
//     url: null,
//     github: null,
//   },
// ];

// /* ─────────────────────────────────────────────────────────────
//    CATEGORY FILTER TABS
// ───────────────────────────────────────────────────────────── */
// const categories = ["ALL", "MERN", "LARAVEL", "NETWORKING", "IoT", "SECURITY"];

// /* ─────────────────────────────────────────────────────────────
//    PROJECT MODAL
// ───────────────────────────────────────────────────────────── */
// function ProjectModal({ project: p, onClose }) {
//   // close on Escape
//   useEffect(() => {
//     const handler = (e) => { if (e.key === "Escape") onClose(); };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [onClose]);

//   return (
//     <div
//       className="fixed inset-0 z-[900] flex items-center justify-center p-4"
//       style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}
//       onClick={onClose}
//     >
//       <div
//         className="relative flex flex-col overflow-hidden"
//         style={{
//           width: "min(80%, 860px)",
//           maxHeight: "90vh",
//           background: "#080e1a",
//           border: `1px solid ${p.accentBorder}`,
//           borderRadius: 14,
//           boxShadow: `0 0 60px ${p.accentBg}`,
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* top color strip */}
//         <div style={{ height: 3, background: `linear-gradient(90deg,transparent,${p.accentColor},transparent)` }} />

//         {/* ── modal header ── */}
//         <div
//           className="flex items-center justify-between flex-shrink-0"
//           style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,229,255,0.08)", background: "#04080f" }}
//         >
//           <div className="flex items-center gap-3">
//             {/* icon */}
//             <div
//               className="flex items-center justify-center flex-shrink-0 text-2xl rounded-xl"
//               style={{ width: 48, height: 48, background: p.iconBg, border: `1px solid ${p.accentBorder}` }}
//             >
//               {p.icon}
//             </div>
//             <div>
//               <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 15, fontWeight: 700, color: p.accentColor, letterSpacing: 2 }}>
//                 {p.title}
//               </div>
//               <div style={{ fontSize: 11, color: "#6a9bbf", fontFamily: "'Share Tech Mono',monospace", marginTop: 2 }}>
//                 {p.subtitle}
//               </div>
//             </div>
//           </div>
//           {/* category + close */}
//           <div className="flex items-center gap-3">
//             <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px]"
//               style={{ background: p.accentBg, border: `1px solid ${p.accentBorder}`, color: p.accentColor, fontFamily: "'Share Tech Mono',monospace" }}>
//               {p.category}
//             </span>
//             <button onClick={onClose}
//               style={{ background: "none", border: "none", color: "#2a4a6a", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 0 }}
//               onMouseEnter={(e) => (e.currentTarget.style.color = "#00e5ff")}
//               onMouseLeave={(e) => (e.currentTarget.style.color = "#2a4a6a")}
//             >
//               <i className="ti ti-x" />
//             </button>
//           </div>
//         </div>

//         {/* ── scrollable body ── */}
//         <div className="flex-1 overflow-y-auto" style={{ padding: 20 }}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//             {/* left col */}
//             <div>
//               {/* short desc */}
//               <div style={{ fontSize: 13, color: "#c8e8f8", lineHeight: 1.8, marginBottom: 18,
//                 padding: "12px 14px", background: "rgba(0,229,255,0.03)",
//                 border: "1px solid rgba(0,229,255,0.08)", borderRadius: 8 }}>
//                 {p.shortDesc}
//               </div>

//               {/* long desc */}
//               <div style={{ fontSize: 10, color: "#2a4a6a", letterSpacing: 3, fontFamily: "'Share Tech Mono',monospace", marginBottom: 8 }}>
//                 // DESCRIPTION
//               </div>
//               <p style={{ fontSize: 12, color: "#6a9bbf", lineHeight: 1.85, marginBottom: 20 }}>
//                 {p.longDesc}
//               </p>

//               {/* tags */}
//               <div style={{ fontSize: 10, color: "#2a4a6a", letterSpacing: 3, fontFamily: "'Share Tech Mono',monospace", marginBottom: 8 }}>
//                 // TECH STACK
//               </div>
//               <div className="flex flex-wrap gap-1.5 mb-5">
//                 {p.tags.map((t) => (
//                   <span key={t} className="px-2.5 py-0.5 rounded-full text-[10px]"
//                     style={{ background: p.accentBg, border: `1px solid ${p.accentBorder}`, color: p.accentColor, fontFamily: "'Share Tech Mono',monospace" }}>
//                     {t}
//                   </span>
//                 ))}
//               </div>

//               {/* action buttons */}
//               <div className="flex flex-wrap gap-2.5 mt-2">
//                 {p.url && (
//                   <a href={p.url} target="_blank" rel="noreferrer"
//                     className="flex items-center gap-2 no-underline transition-all duration-200"
//                     style={{ padding: "8px 18px", background: p.accentBg, border: `1px solid ${p.accentBorder}`,
//                       color: p.accentColor, borderRadius: 6, fontSize: 11, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1 }}
//                     onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 16px ${p.accentBg}`)}
//                     onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
//                   >
//                     <i className="ti ti-external-link" style={{ fontSize: 13 }} /> LIVE DEMO
//                   </a>
//                 )}
//                 {p.github && (
//                   <a href={p.github} target="_blank" rel="noreferrer"
//                     className="flex items-center gap-2 no-underline transition-all duration-200"
//                     style={{ padding: "8px 18px", background: "rgba(0,229,255,0.05)",
//                       border: "1px solid rgba(0,229,255,0.15)", color: "#6a9bbf",
//                       borderRadius: 6, fontSize: 11, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1 }}
//                     onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00e5ff"; e.currentTarget.style.color = "#00e5ff"; }}
//                     onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.15)"; e.currentTarget.style.color = "#6a9bbf"; }}
//                   >
//                     <i className="ti ti-brand-github" style={{ fontSize: 13 }} /> GITHUB
//                   </a>
//                 )}
//                 {!p.url && !p.github && (
//                   <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
//                     style={{ background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.08)",
//                       fontSize: 10, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace" }}>
//                     <i className="ti ti-lock" style={{ fontSize: 12 }} /> PRIVATE / LOCAL PROJECT
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* right col — features */}
//             <div>
//               <div style={{ fontSize: 10, color: "#2a4a6a", letterSpacing: 3, fontFamily: "'Share Tech Mono',monospace", marginBottom: 10 }}>
//                 // KEY FEATURES
//               </div>
//               <div className="flex flex-col gap-2">
//                 {p.features.map((f, i) => (
//                   <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg"
//                     style={{ background: "#0c1422", border: `1px solid ${p.accentBorder}` }}>
//                     <span style={{ color: p.accentColor, fontSize: 12, marginTop: 1, flexShrink: 0 }}>▸</span>
//                     <span style={{ fontSize: 12, color: "#c8e8f8", lineHeight: 1.6 }}>{f}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* project number watermark */}
//               <div style={{ marginTop: 24, textAlign: "right", fontFamily: "'Orbitron',sans-serif",
//                 fontSize: 48, fontWeight: 900, color: "rgba(0,229,255,0.04)", lineHeight: 1, userSelect: "none" }}>
//                 {String(p.id).padStart(2, "0")}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    WORKS SECTION
// ───────────────────────────────────────────────────────────── */
//  const Works=() =>{
//   const [activeFilter, setActiveFilter] = useState("ALL");
//   const [selected, setSelected]         = useState(null);
//   const gridRef = useRef(null);

//   const filtered = activeFilter === "ALL"
//     ? projects
//     : projects.filter((p) => p.category === activeFilter);

//   /* staggered fade-in on filter change */
//   useEffect(() => {
//     const cards = gridRef.current?.querySelectorAll(".work-card-item");
//     cards?.forEach((c, i) => {
//       c.style.opacity = 0;
//       c.style.transform = "translateY(16px)";
//       setTimeout(() => {
//         c.style.transition = "opacity 0.4s ease, transform 0.4s ease";
//         c.style.opacity = 1;
//         c.style.transform = "translateY(0)";
//       }, i * 70);
//     });
//   }, [activeFilter]);

//   return (
//     <>
//       {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}

//       <section
//         id="works"
//         className="relative z-[2]"
//         style={{ padding: "80px 0 60px", background: "#080e1a" }}
//       >
//         <div className="max-w-[1100px] mx-auto px-5 sm:px-8">

//           {/* ── header ── */}
//           <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 3, color: "#2a4a6a", marginBottom: 10 }}>
//             // PROJECTS.LIST
//           </div>
//           <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 26, fontWeight: 700, color: "#00e5ff", letterSpacing: 4, marginBottom: 8 }}>
//             MY WORKS
//           </div>
//           <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,#00e5ff,transparent)", marginBottom: 28 }} />

//           {/* ── filter tabs ── */}
//           <div className="flex flex-wrap gap-2 mb-8">
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setActiveFilter(cat)}
//                 className="transition-all duration-200"
//                 style={{
//                   padding: "5px 14px",
//                   borderRadius: 20,
//                   border: activeFilter === cat ? "1px solid #00e5ff" : "1px solid rgba(0,229,255,0.12)",
//                   background: activeFilter === cat ? "rgba(0,229,255,0.1)" : "transparent",
//                   color: activeFilter === cat ? "#00e5ff" : "#2a4a6a",
//                   fontFamily: "'Share Tech Mono',monospace",
//                   fontSize: 10,
//                   letterSpacing: 2,
//                   cursor: "pointer",
//                 }}
//               >
//                 {cat}
//               </button>
//             ))}
//             <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#2a4a6a", alignSelf: "center", marginLeft: 4 }}>
//               {filtered.length} PROJECT{filtered.length !== 1 ? "S" : ""}
//             </span>
//           </div>

//           {/* ── cards grid ── */}
//           <div
//             ref={gridRef}
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
//           >
//             {filtered.map((p) => (
//               <div
//                 key={p.id}
//                 className="work-card-item relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col"
//                 style={{
//                   background: "#0c1422",
//                   border: "1px solid rgba(0,229,255,0.1)",
//                 }}
//                 onClick={() => setSelected(p)}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.borderColor = p.accentBorder;
//                   e.currentTarget.style.transform = "translateY(-5px)";
//                   e.currentTarget.style.boxShadow = `0 8px 30px ${p.accentBg}`;
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.borderColor = "rgba(0,229,255,0.1)";
//                   e.currentTarget.style.transform = "translateY(0)";
//                   e.currentTarget.style.boxShadow = "none";
//                 }}
//               >
//                 {/* ── card image/icon area ── */}
//                 <div
//                   className="relative flex items-center justify-center"
//                   style={{
//                     height: 130,
//                     background: p.iconBg,
//                     borderBottom: `1px solid rgba(0,229,255,0.08)`,
//                     fontSize: 52,
//                   }}
//                 >
//                   {p.icon}
//                   {/* overlay */}
//                   <div className="absolute inset-0"
//                     style={{ background: "linear-gradient(135deg,rgba(0,229,255,0.03),transparent,rgba(168,85,247,0.03))" }} />
//                   {/* category badge */}
//                   <div className="absolute top-3 left-3">
//                     <span className="px-2 py-0.5 rounded-full text-[9px]"
//                       style={{ background: p.accentBg, border: `1px solid ${p.accentBorder}`, color: p.accentColor, fontFamily: "'Share Tech Mono',monospace" }}>
//                       {p.category}
//                     </span>
//                   </div>
//                   {/* click hint */}
//                   <div className="absolute bottom-2 right-3 flex items-center gap-1"
//                     style={{ fontSize: 9, color: "rgba(0,229,255,0.3)", fontFamily: "'Share Tech Mono',monospace" }}>
//                     <i className="ti ti-click" style={{ fontSize: 11 }} /> CLICK TO VIEW
//                   </div>
//                 </div>

//                 {/* ── card body ── */}
//                 <div className="flex flex-col flex-1 p-4">
//                   <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, fontWeight: 700, color: "#c8e8f8", letterSpacing: 1, marginBottom: 4 }}>
//                     {p.title}
//                   </div>
//                   <div style={{ fontSize: 10, color: p.accentColor, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1, marginBottom: 8 }}>
//                     {p.subtitle}
//                   </div>
//                   <p style={{ fontSize: 11, color: "#6a9bbf", lineHeight: 1.65, marginBottom: 12, flexGrow: 1 }}>
//                     {p.shortDesc}
//                   </p>
//                   {/* divider */}
//                   <div style={{ height: 1, background: "rgba(0,229,255,0.06)", marginBottom: 10 }} />
//                   {/* tags */}
//                   <div className="flex flex-wrap gap-1">
//                     {p.tags.slice(0, 4).map((t) => (
//                       <span key={t} className="px-2 py-0.5 rounded-full text-[9px]"
//                         style={{ border: "1px solid rgba(0,229,255,0.1)", color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace" }}>
//                         {t}
//                       </span>
//                     ))}
//                     {p.tags.length > 4 && (
//                       <span className="px-2 py-0.5 rounded-full text-[9px]"
//                         style={{ border: `1px solid ${p.accentBorder}`, color: p.accentColor, fontFamily: "'Share Tech Mono',monospace" }}>
//                         +{p.tags.length - 4}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
// export default Works;