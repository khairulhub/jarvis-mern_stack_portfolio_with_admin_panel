import { useState, useEffect, useRef } from "react";
import { getExperiences, getAboutInfo, getPublicClients } from "../../utils/api";

// ─── Default fallback ───────────────────────────────────────────
const DEFAULT_ABOUT = {
  paragraph1:
    'I am a passionate <strong style="color:#00e5ff">Full Stack Developer</strong> and <strong style="color:#00e5ff">Network Engineer</strong> based in Dhaka, Bangladesh. I build modern, scalable web applications and design efficient network infrastructures.',
  paragraph2:
    "With expertise in MERN Stack, PHP/Laravel, .NET, and Cisco networking, I bring both frontend creativity and backend robustness to every project.",
  paragraph3:
    "My approach combines clean code practices with performance-driven architecture, ensuring every solution is both functional and maintainable.",
  infoCards: [
    { icon: "ti-user",          label: "Name",     value: "Md Khairul Islam",       order: 1 },
    { icon: "ti-map-pin",       label: "Location", value: "Gazipur, Bangladesh",    order: 2 },
    { icon: "ti-school",        label: "Degree",   value: "B.Sc. Computer Science", order: 3 },
    { icon: "ti-device-laptop", label: "Status",   value: "Available for Hire",     order: 4 },
  ],
  stats: [
    { num: "3+",   label: "YEARS EXP",  clickable: true,  clientStat: false, link: "",                               order: 1 },
    { num: "50+",  label: "PROJECTS",   clickable: false, clientStat: false, link: "https://github.com/Khairulhub", order: 2 },
    { num: "15+",  label: "CLIENTS",    clickable: false, clientStat: true,  link: "",                               order: 3 },
    { num: "100%", label: "DEDICATION", clickable: false, clientStat: false, link: "",                               order: 4 },
  ],
};

/* ══════════════════════════════════════════════════════════
   EXPERIENCE MODAL  (unchanged from original)
══════════════════════════════════════════════════════════ */
function ExperienceModal({ experiences, onClose, initialId }) {
  const [active, setActive]       = useState(initialId ?? experiences[0]?._id);
  const [mobileTab, setMobileTab] = useState("detail");
  const exp = experiences.find((e) => e._id === active) || experiences[0];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSelectExp = (id) => { setActive(id); setMobileTab("detail"); };
  if (!exp) return null;

  return (
    <div
      className="fixed inset-0 z-[900] flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full flex flex-col"
        style={{
          maxWidth: 780, height: "92dvh", maxHeight: "90vh",
          background: "#080e1a", border: "1px solid rgba(0,229,255,0.2)",
          borderRadius: "12px 12px 0 0", overflow: "hidden",
        }}
        ref={(el) => {
          if (el && window.innerWidth >= 640) {
            el.style.borderRadius = "12px";
            el.style.height = "auto";
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0"
          style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,229,255,0.1)", background: "#04080f" }}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <i className="ti ti-briefcase" style={{ fontSize: 16, color: "#00e5ff", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, color: "#00e5ff", letterSpacing: 3, whiteSpace: "nowrap" }}>
              EXPERIENCE
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded-full"
              style={{ fontSize: 9, background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", color: "#00b8cc", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
              {experiences.length} ROLES
            </span>
            {mobileTab === "detail" && (
              <button className="sm:hidden flex items-center gap-1 ml-2"
                style={{ background: "none", border: "none", color: "#6a9bbf", cursor: "pointer", fontSize: 11, fontFamily: "'Share Tech Mono', monospace", padding: 0 }}
                onClick={() => setMobileTab("list")}>
                <i className="ti ti-chevron-left" style={{ fontSize: 14 }} /> ALL
              </button>
            )}
          </div>
          <button onClick={onClose}
            style={{ background: "none", border: "none", color: "#2a4a6a", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4, flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00e5ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#2a4a6a")}>
            <i className="ti ti-x" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          {/* Sidebar */}
          <div
            className={`overflow-y-auto flex-shrink-0 ${mobileTab === "list" ? "flex" : "hidden"} sm:flex flex-col`}
            style={{ width: "100%", maxWidth: "100%" }}
            ref={(el) => {
              if (el && window.innerWidth >= 640) {
                el.style.width = "200px"; el.style.display = "flex";
                el.style.borderRight = "1px solid rgba(0,229,255,0.08)";
                el.style.background = "#04080f";
              }
            }}>
            <div className="flex-col w-full sm:hidden" style={{ background: "#04080f" }}>
              <div style={{ padding: "10px 16px", fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 3, borderBottom: "1px solid rgba(0,229,255,0.06)" }}>
                SELECT ROLE
              </div>
            </div>
            {experiences.map((e) => (
              <button key={e._id} onClick={() => handleSelectExp(e._id)}
                className="flex items-center gap-3 transition-all duration-200 w-full"
                style={{
                  padding: "14px 16px",
                  background: active === e._id ? "rgba(0,229,255,0.06)" : "transparent",
                  borderLeft: active === e._id ? `3px solid ${e.color}` : "3px solid transparent",
                  borderTop: "none", borderRight: "none",
                  borderBottom: "1px solid rgba(0,229,255,0.05)",
                  cursor: "pointer", textAlign: "left",
                }}>
                <div className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 36, height: 36, borderRadius: 8, background: e.colorBg, border: `1px solid ${e.colorBorder}`, color: e.color, fontSize: 16 }}>
                  <i className={`ti ${e.icon}`} />
                </div>
                <div className="text-left overflow-hidden flex-1 min-w-0">
                  <div style={{ fontSize: 12, color: active === e._id ? "#c8e8f8" : "#6a9bbf", fontFamily: "'Exo 2', sans-serif", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {e.company}
                  </div>
                  <div style={{ fontSize: 10, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginTop: 2 }}>
                    {e.duration}
                  </div>
                </div>
                <i className="ti ti-chevron-right sm:hidden flex-shrink-0" style={{ fontSize: 14, color: "#2a4a6a" }} />
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className={`flex-1 overflow-y-auto ${mobileTab === "detail" ? "block" : "hidden"} sm:block`} style={{ padding: "16px" }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex items-center justify-center flex-shrink-0"
                style={{ width: 42, height: 42, borderRadius: 10, background: exp.colorBg, border: `1px solid ${exp.colorBorder}`, color: exp.color, fontSize: 20 }}>
                <i className={`ti ${exp.icon}`} />
              </div>
              <div className="min-w-0">
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: exp.color, letterSpacing: 2, wordBreak: "break-word" }}>
                  {exp.company}
                </div>
                <div style={{ fontSize: 11, color: "#c8e8f8", fontFamily: "'Exo 2', sans-serif", marginTop: 2 }}>
                  {exp.designation}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {[
                { icon: "ti-calendar",  text: exp.period   },
                { icon: "ti-clock",     text: exp.duration },
                { icon: "ti-map-pin",   text: exp.location },
                { icon: "ti-briefcase", text: exp.type     },
              ].map((m) => (
                <div key={m.text} className="flex items-center gap-1 px-2 py-1 rounded-full"
                  style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.12)", fontSize: 9, color: "#6a9bbf", fontFamily: "'Share Tech Mono', monospace", whiteSpace: "nowrap" }}>
                  <i className={`ti ${m.icon}`} style={{ fontSize: 10, flexShrink: 0 }} /> {m.text}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#6a9bbf", lineHeight: 1.8, marginBottom: 16, padding: "10px 12px", background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.08)", borderRadius: 8 }}>
              {exp.description}
            </div>
            {exp.skills?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, color: "#2a4a6a", letterSpacing: 3, fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>// TECH STACK</div>
                <div className="flex flex-wrap gap-1.5">
                  {exp.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full"
                      style={{ fontSize: 9, background: exp.colorBg, border: `1px solid ${exp.colorBorder}`, color: exp.color, fontFamily: "'Share Tech Mono', monospace" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {exp.projects?.length > 0 && (
              <div>
                <div style={{ fontSize: 9, color: "#2a4a6a", letterSpacing: 3, fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>// PROJECTS DELIVERED</div>
                <div className="flex flex-col gap-2">
                  {exp.projects.map((p) => (
                    <div key={p} className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                      style={{ background: "#0c1422", border: "1px solid rgba(0,229,255,0.08)", fontSize: 12, color: "#c8e8f8", fontFamily: "'Exo 2', sans-serif" }}>
                      <i className="ti ti-folder-filled" style={{ fontSize: 13, color: exp.color, flexShrink: 0 }} />
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CLIENT MODAL — same visual style as ExperienceModal
══════════════════════════════════════════════════════════ */
function ClientModal({ clients, loading, onClose, initialClientId }) {
  const [active, setActive]       = useState(initialClientId ?? (clients[0]?._id || clients[0]?.id || "default_client_1"));
  const [mobileTab, setMobileTab] = useState("detail");

  const client = clients.find((c) => (c._id || c.id) === active) || clients[0];
  const hasClients = clients.length > 0;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSelect = (id) => { setActive(id); setMobileTab("detail"); };

  useEffect(() => {
    // when clients load or initialClientId changes, ensure active points to a valid client
    if (initialClientId) {
      const found = clients.find((c) => (c._id || c.id) === initialClientId);
      if (found) setActive(initialClientId);
    } else if (!clients.find((c) => (c._id || c.id) === active) && clients[0]) {
      setActive(clients[0]._id || clients[0].id);
    }
  }, [clients, initialClientId]);

  const clientId = client?._id || client?.id;

  return (
    <div
      className="fixed inset-0 z-[900] flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full flex flex-col"
        style={{
          maxWidth: 780, height: "92dvh", maxHeight: "90vh",
          background: "#080e1a",
          border: `1px solid ${client.colorBorder || "rgba(0,229,255,0.2)"}`,
          borderRadius: "12px 12px 0 0", overflow: "hidden",
        }}
        ref={(el) => {
          if (el && window.innerWidth >= 640) {
            el.style.borderRadius = "12px";
            el.style.height = "auto";
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent strip */}
        <div style={{ height: 3, flexShrink: 0, background: `linear-gradient(90deg,transparent,${client.color || "#00e5ff"},transparent)` }} />

        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0"
          style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,229,255,0.1)", background: "#04080f" }}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <i className="ti ti-users" style={{ fontSize: 16, color: "#00e5ff", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, color: "#00e5ff", letterSpacing: 3, whiteSpace: "nowrap" }}>
              CLIENTS
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded-full"
              style={{ fontSize: 9, background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", color: "#00b8cc", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
              {clients.length} CLIENTS
            </span>
            {mobileTab === "detail" && (
              <button className="sm:hidden flex items-center gap-1 ml-2"
                style={{ background: "none", border: "none", color: "#6a9bbf", cursor: "pointer", fontSize: 11, fontFamily: "'Share Tech Mono', monospace", padding: 0 }}
                onClick={() => setMobileTab("list")}>
                <i className="ti ti-chevron-left" style={{ fontSize: 14 }} /> ALL
              </button>
            )}
          </div>
          <button onClick={onClose}
            style={{ background: "none", border: "none", color: "#2a4a6a", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4, flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00e5ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#2a4a6a")}>
            <i className="ti ti-x" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>

          {/* Sidebar — client list */}
          <div
            className={`overflow-y-auto flex-shrink-0 ${mobileTab === "list" ? "flex" : "hidden"} sm:flex flex-col`}
            style={{ width: "100%", maxWidth: "100%" }}
            ref={(el) => {
              if (el && window.innerWidth >= 640) {
                el.style.width = "210px"; el.style.display = "flex";
                el.style.borderRight = "1px solid rgba(0,229,255,0.08)";
                el.style.background = "#04080f";
              }
            }}>
            <div className="sm:hidden" style={{ background: "#04080f" }}>
              <div style={{ padding: "10px 16px", fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 3, borderBottom: "1px solid rgba(0,229,255,0.06)" }}>
                SELECT CLIENT
              </div>
            </div>
            {clients.map((c) => {
              const cId = c._id || c.id;
              return (
                <button key={cId} onClick={() => handleSelect(cId)}
                  className="flex items-center gap-3 transition-all duration-200 w-full"
                  style={{
                    padding: "13px 16px",
                    background: active === cId ? "rgba(0,229,255,0.06)" : "transparent",
                    borderLeft: active === cId ? `3px solid ${c.color || "#00e5ff"}` : "3px solid transparent",
                    borderTop: "none", borderRight: "none",
                    borderBottom: "1px solid rgba(0,229,255,0.05)",
                    cursor: "pointer", textAlign: "left",
                  }}>
                  {/* Logo or icon */}
                  <div className="flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ width: 36, height: 36, borderRadius: 8, background: c.colorBg || "rgba(0,229,255,0.08)", border: `1px solid ${c.colorBorder || "rgba(0,229,255,0.25)"}` }}>
                    {c.logo
                      ? <img src={c.logo} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                      : <i className={`ti ${c.icon || "ti-building"}`} style={{ fontSize: 18, color: c.color || "#00e5ff" }} />
                    }
                  </div>
                  <div className="text-left overflow-hidden flex-1 min-w-0">
                    <div style={{ fontSize: 12, color: active === cId ? "#c8e8f8" : "#6a9bbf", fontFamily: "'Exo 2', sans-serif", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.name}
                    </div>
                    {c.location && (
                      <div style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, marginTop: 2 }}>
                        {c.location}
                      </div>
                    )}
                  </div>
                  <i className="ti ti-chevron-right sm:hidden flex-shrink-0" style={{ fontSize: 14, color: "#2a4a6a" }} />
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className={`flex-1 overflow-y-auto ${mobileTab === "detail" ? "block" : "hidden"} sm:block`} style={{ padding: "20px" }}>
            {loading ? (
              <div className="flex h-full min-h-[260px] items-center justify-center text-center">
                <div>
                  <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <div style={{ fontSize: 12, color: "#6a9bbf", fontFamily: "'Share Tech Mono', monospace" }}>
                    Loading clients...
                  </div>
                </div>
              </div>
            ) : hasClients && client ? (
              <>
                {/* Logo / icon hero */}
                <div className="flex items-center justify-center mb-5"
                  style={{
                    width: 80, height: 80, borderRadius: 16,
                    background: client.colorBg || "rgba(0,229,255,0.08)",
                    border: `1px solid ${client.colorBorder || "rgba(0,229,255,0.25)"}`,
                    overflow: "hidden",
                  }}>
                  {client.logo
                    ? <img src={client.logo} alt={client.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <i className={`ti ${client.icon || "ti-building"}`} style={{ fontSize: 36, color: client.color || "#00e5ff" }} />
                  }
                </div>

                {/* Name */}
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 15, fontWeight: 700, color: client.color || "#00e5ff", letterSpacing: 2, marginBottom: 4, wordBreak: "break-word" }}>
                  {client.name}
                </div>

                {/* Location chip */}
                {client.location && (
                  <div className="flex items-center gap-1.5 mb-5"
                    style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 999, background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.12)", fontSize: 10, color: "#6a9bbf", fontFamily: "'Share Tech Mono', monospace" }}>
                    <i className="ti ti-map-pin" style={{ fontSize: 11 }} />
                    {client.location}
                  </div>
                )}

                {/* Divider */}
                <div style={{ height: 1, background: "linear-gradient(90deg,rgba(0,229,255,0.15),transparent)", marginBottom: 16 }} />

                {/* Details */}
                {client.details && (
                  <>
                    <div style={{ fontSize: 9, color: "#2a4a6a", letterSpacing: 3, fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>
                      // PROJECT DETAILS
                    </div>
                    <div style={{ fontSize: 13, color: "#6a9bbf", lineHeight: 1.8, padding: "12px 14px", background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.08)", borderRadius: 8 }}>
                      {client.details}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex h-full min-h-[260px] items-center justify-center text-center">
                <div>
                  <i className="ti ti-users" style={{ fontSize: 30, color: "#2a4a6a" }} />
                  <div className="mt-3" style={{ fontSize: 13, color: "#c8e8f8", fontFamily: "'Exo 2', sans-serif" }}>
                    No client data available
                  </div>
                  <div className="mt-1" style={{ fontSize: 11, color: "#6a9bbf", fontFamily: "'Share Tech Mono', monospace" }}>
                    Add active clients in the admin panel.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN ABOUT COMPONENT
══════════════════════════════════════════════════════════ */
const About = () => {
  const [expModalOpen,    setExpModalOpen]    = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [clientModalTargetId, setClientModalTargetId] = useState(null);
  const [selectedExpId,   setSelectedExpId]   = useState(null);

  const [experiences, setExperiences] = useState([]);
  const [clients,     setClients]     = useState([]);
  const [aboutData,   setAboutData]   = useState(DEFAULT_ABOUT);

  const [loadingExp,     setLoadingExp]     = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);

  const fadeRef = useRef(null);

  // ── Fetch about info ──────────────────────────────────────────
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await getAboutInfo();
        if (res.success && res.data) {
          const d = res.data;
          setAboutData({
            paragraph1: d.paragraph1 || DEFAULT_ABOUT.paragraph1,
            paragraph2: d.paragraph2 || DEFAULT_ABOUT.paragraph2,
            paragraph3: d.paragraph3 || DEFAULT_ABOUT.paragraph3,
            infoCards: Array.isArray(d.infoCards) && d.infoCards.length > 0
              ? [...d.infoCards].sort((a, b) => (a.order || 0) - (b.order || 0))
              : DEFAULT_ABOUT.infoCards,
            stats: Array.isArray(d.stats) && d.stats.length > 0
              ? [...d.stats].sort((a, b) => (a.order || 0) - (b.order || 0))
              : DEFAULT_ABOUT.stats,
          });
        }
      } catch (err) {
        console.warn("AboutInfo fetch failed — using defaults:", err.message);
      }
    };
    fetchAbout();
  }, []);

  // ── Fetch experiences ────────────────────────────────────────
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await getExperiences();
        if (res.success && res.data) {
          setExperiences(res.data);
          if (res.data.length > 0) setSelectedExpId(res.data[0]._id);
        }
      } catch (err) {
        console.warn("Experiences fetch failed:", err.message);
      } finally { setLoadingExp(false); }
    };
    fetch_();
  }, []);

  // ── Fetch clients ────────────────────────────────────────────
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await getPublicClients();
        if (res.success && res.data) setClients(res.data);
      } catch (err) {
        console.warn("Clients fetch failed:", err.message);
      } finally { setLoadingClients(false); }
    };
    fetch_();
  }, []);

  // ── Intersection observer ────────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("fade-visible"); }),
      { threshold: 0.1 }
    );
    if (fadeRef.current) obs.observe(fadeRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Stat card click handler ──────────────────────────────────
  const handleStatClick = (stat) => {
    console.log("Clicked Stat:", stat);
    // clientStat = true → open client modal
    if (stat.clientStat) {
      setClientModalTargetId(stat.targetId || null);
      setClientModalOpen(true);
      return;
    }
    // clickable = true → open experience modal
    if (stat.clickable && experiences.length > 0) {
      setSelectedExpId(stat.targetId || experiences[0]._id);
      setExpModalOpen(true);
      return;
    }
    // has link → open URL
    if (stat.link) {
      window.open(stat.link, "_blank", "noopener,noreferrer");
    }
  };

  // Is a stat interactive?
  const isInteractive = (s) => s.clickable || s.clientStat || !!s.link;

  return (
    <>
      {/* Experience Modal */}
      {expModalOpen && experiences.length > 0 && (
        <ExperienceModal
          experiences={experiences}
          initialId={selectedExpId}
          onClose={() => setExpModalOpen(false)}
        />
      )}

      {/* Client Modal */}
      {clientModalOpen && (
        <ClientModal
          clients={clients}
          loading={loadingClients}
            initialClientId={clientModalTargetId}
            onClose={() => { setClientModalOpen(false); setClientModalTargetId(null); }}
        />
      )}

      <section id="about" className="relative z-[2]"
        style={{ background: "#080e1a", minHeight: "100vh", padding: "60px 0 50px" }}>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">

          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#2a4a6a", marginBottom: 10 }}>
            // PROFILE.JSON
          </div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 700, color: "#00e5ff", letterSpacing: 4, marginBottom: 8 }}>
            ABOUT ME
          </div>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,#00e5ff,transparent)", marginBottom: 32 }} />

          <div ref={fadeRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start fade-in">

            {/* ── Left ── */}
            <div>
              <div style={{ fontSize: 13, color: "#6a9bbf", lineHeight: 1.9 }}>
                <p style={{ marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: aboutData.paragraph1 }} />
                <p style={{ marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: aboutData.paragraph2 }} />
                <p dangerouslySetInnerHTML={{ __html: aboutData.paragraph3 }} />
              </div>

              {/* Info mini-cards */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2.5 my-5">
                {aboutData.infoCards.map((item) => (
                  <div key={item._id || item.label}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                    style={{ background: "#0c1422", border: "1px solid rgba(0,229,255,0.08)" }}>
                    <i className={`ti ${item.icon}`} style={{ fontSize: 14, color: "#00b8cc", flexShrink: 0 }} />
                    <div className="min-w-0">
                      <div style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
                        {item.label.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 11, color: "#c8e8f8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 flex-wrap">
                <a href="#contact" className="transition-all duration-200 no-underline inline-block"
                  style={{ padding: "10px 24px", background: "rgba(0,60,110,0.8)", border: "1px solid #00e5ff", color: "#00e5ff", fontFamily: "'Orbitron', sans-serif", fontSize: 11, letterSpacing: 2, borderRadius: 4 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,80,140,0.9)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,229,255,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,60,110,0.8)"; e.currentTarget.style.boxShadow = "none"; }}>
                  HIRE ME
                </a>
                <a href="#works" className="transition-all duration-200 no-underline inline-block"
                  style={{ padding: "10px 24px", background: "transparent", border: "1px solid rgba(0,229,255,0.3)", color: "#6a9bbf", fontFamily: "'Exo 2', sans-serif", fontSize: 12, borderRadius: 4 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00e5ff"; e.currentTarget.style.color = "#00e5ff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)"; e.currentTarget.style.color = "#6a9bbf"; }}>
                  MY WORK
                </a>
              </div>
            </div>

            {/* ── Right: stat cards ── */}
            <div className="grid grid-cols-2 gap-3">
              {aboutData.stats.map((s) => {
                const interactive = isInteractive(s);

                // Badge shown on CLIENTS card
                const isClientStat = s.clientStat;
                const isExpStat    = s.clickable;

                return (
                  <div
                    key={s.label}
                    onClick={() => handleStatClick(s)}
                    className="relative rounded-lg transition-all duration-200"
                    style={{
                      background: "#0c1422",
                      border: `1px solid ${interactive ? "rgba(0,229,255,0.25)" : "rgba(0,229,255,0.1)"}`,
                      padding: "16px",
                      cursor: interactive ? "pointer" : "default",
                    }}
                    onMouseEnter={(e) => {
                      if (interactive) {
                        e.currentTarget.style.borderColor = "#00e5ff";
                        e.currentTarget.style.boxShadow = "0 0 20px rgba(0,229,255,0.1)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (interactive) {
                        e.currentTarget.style.borderColor = "rgba(0,229,255,0.25)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    {/* Experience badge */}
                    {isExpStat && (
                      <div className="absolute top-2 right-2 flex items-center gap-1"
                        style={{ fontSize: 8, color: "#00b8cc", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
                        <i className="ti ti-click" style={{ fontSize: 10 }} />
                        {loadingExp ? "..." : `${experiences.length} ROLES`}
                      </div>
                    )}

                    {/* Clients badge */}
                    {isClientStat && (
                      <div className="absolute top-2 right-2 flex items-center gap-1"
                        style={{ fontSize: 8, color: "#00b8cc", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
                        <i className="ti ti-click" style={{ fontSize: 10 }} />
                        {loadingClients ? "..." : `${clients.length} LISTED`}
                      </div>
                    )}

                    {/* Link icon for external URL */}
                    {!isExpStat && !isClientStat && s.link && (
                      <div className="absolute top-2 right-2" style={{ fontSize: 10, color: "#2a4a6a" }}>
                        <i className="ti ti-external-link" />
                      </div>
                    )}

                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 700, color: "#00e5ff", lineHeight: 1 }}>
                      {s.num}
                    </div>
                    <div style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2, marginTop: 6 }}>
                      {s.label}
                    </div>
                    {interactive && (
                      <div style={{ marginTop: 8, height: 1, background: "linear-gradient(90deg,#00e5ff,transparent)" }} />
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default About;