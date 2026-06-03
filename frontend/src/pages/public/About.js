import { useState, useEffect, useRef } from "react";


const experiences = [
  {
    id: 1,
    company: "Edge Tech BD",
    designation: "Jr. Executive Admin",
    period: "Oct 2025 – Mar 2026",
    duration: "6 months",
    type: "Full Time",
    icon: "ti-building",
    color: "#facc15",
    colorBg: "rgba(250,204,21,0.08)",
    colorBorder: "rgba(250,204,21,0.25)",
    location: "Dhaka, Bangladesh",
    skills: ["CCTV Surveillance", "Access Control", "Intercom System", "IT Support"],
    projects: ["Mingle", "CDC Eastern Housing", "Fashion Tex"],
    description:
      "Handled CCTV surveillance systems, access control setup, and intercom infrastructure for multiple commercial and industrial clients across Dhaka.",
  },
  {
    id: 2,
    company: "Code Tree It Ltd",
    designation: "Jr. Full Stack Web Developer",
    period: "Sep 2024 – Apr 2025",
    duration: "8 months",
    type: "Full Time",
    icon: "ti-code",
    color: "#00e5ff",
    colorBg: "rgba(0,229,255,0.08)",
    colorBorder: "rgba(0,229,255,0.25)",
    location: "Dhaka, Bangladesh",
    skills: ["HTML5", "CSS3", "Bootstrap 5", "PHP", "Laravel"],
    projects: ["LMS Software Solution"],
    description:
      "Developed a full-featured Learning Management System (LMS) using Laravel. Responsible for frontend UI, backend API, database design, and deployment.",
  },
  {
    id: 3,
    company: "4Axiz It Ltd",
    designation: "Jr. Full Stack Web Developer",
    period: "May 2023 – Oct 2023",
    duration: "6 months",
    type: "Full Time",
    icon: "ti-terminal-2",
    color: "#a855f7",
    colorBg: "rgba(168,85,247,0.08)",
    colorBorder: "rgba(168,85,247,0.25)",
    location: "Dhaka, Bangladesh",
    skills: ["HTML5", "CSS3", "Bootstrap 5", "PHP", "Laravel"],
    projects: ["HRM Software Solution"],
    description:
      "Built Human Resource Management (HRM) software from scratch. Covered employee records, payroll, attendance tracking, and admin dashboard modules.",
  },
];

const stats = [
  { num: "3+",   label: "YEARS EXP",  clickable: true  },
  { num: "50+",  label: "PROJECTS",   clickable: false },
  { num: "15+",  label: "CLIENTS",    clickable: false },
  { num: "100%", label: "DEDICATION", clickable: false },
];

function ExperienceModal({ onClose, initialId }) {
  const [active, setActive] = useState(initialId ?? experiences[0].id);
  const [mobileTab, setMobileTab] = useState("detail"); // "list" | "detail"
  const exp = experiences.find((e) => e.id === active) || experiences[0];

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSelectExp = (id) => {
    setActive(id);
    setMobileTab("detail");
  };

  return (
    <div
      className="fixed inset-0 z-[900] flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full flex flex-col"
        style={{
          maxWidth: 780,
          /* Mobile: slide up from bottom, full height minus top gap */
          height: "92dvh",
          /* Desktop: capped height */
          maxHeight: "90vh",
          background: "#080e1a",
          border: "1px solid rgba(0,229,255,0.2)",
          borderRadius: "12px 12px 0 0",
          overflow: "hidden",
        }}
        /* override border-radius on sm+ */
        ref={(el) => {
          if (el) {
            if (window.innerWidth >= 640) {
              el.style.borderRadius = "12px";
              el.style.height = "auto";
            }
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid rgba(0,229,255,0.1)",
            background: "#04080f",
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <i className="ti ti-briefcase" style={{ fontSize: 16, color: "#00e5ff", flexShrink: 0 }} />
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: "#00e5ff",
                letterSpacing: 3,
                whiteSpace: "nowrap",
              }}
            >
              EXPERIENCE
            </span>
            <span
              className="hidden sm:inline px-2 py-0.5 rounded-full"
              style={{
                fontSize: 9,
                background: "rgba(0,229,255,0.08)",
                border: "1px solid rgba(0,229,255,0.2)",
                color: "#00b8cc",
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: 1,
              }}
            >
              {experiences.length} ROLES
            </span>

            {/* Mobile: back button when showing detail */}
            {mobileTab === "detail" && (
              <button
                className="sm:hidden flex items-center gap-1 ml-2"
                style={{
                  background: "none",
                  border: "none",
                  color: "#6a9bbf",
                  cursor: "pointer",
                  fontSize: 11,
                  fontFamily: "'Share Tech Mono', monospace",
                  padding: 0,
                }}
                onClick={() => setMobileTab("list")}
              >
                <i className="ti ti-chevron-left" style={{ fontSize: 14 }} />
                ALL
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#2a4a6a",
              cursor: "pointer",
              fontSize: 20,
              lineHeight: 1,
              padding: 4,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00e5ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#2a4a6a")}
          >
            <i className="ti ti-x" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>

          {/* ── DESKTOP Sidebar / MOBILE list view ── */}
          <div
            className={`overflow-y-auto flex-shrink-0 ${mobileTab === "list" ? "flex" : "hidden"} sm:flex flex-col`}
            style={{
              width: "100%",
              maxWidth: "100%",
              /* Desktop: fixed sidebar width */
            }}
            ref={(el) => {
              if (el && window.innerWidth >= 640) {
                el.style.width = "200px";
                el.style.display = "flex";
                el.style.borderRight = "1px solid rgba(0,229,255,0.08)";
                el.style.background = "#04080f";
              }
            }}
          >
            <div
              className="flex-col w-full sm:hidden"
              style={{ background: "#04080f" }}
            >
              {/* Mobile list header */}
              <div
                style={{
                  padding: "10px 16px",
                  fontSize: 9,
                  color: "#2a4a6a",
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: 3,
                  borderBottom: "1px solid rgba(0,229,255,0.06)",
                }}
              >
                SELECT ROLE
              </div>
            </div>

            {experiences.map((e) => (
              <button
                key={e.id}
                onClick={() => handleSelectExp(e.id)}
                className="flex items-center gap-3 transition-all duration-200 w-full"
                style={{
                  padding: "14px 16px",
                  background: active === e.id ? "rgba(0,229,255,0.06)" : "transparent",
                  borderLeft: active === e.id ? `3px solid ${e.color}` : "3px solid transparent",
                  borderTop: "none",
                  borderRight: "none",
                  borderBottom: "1px solid rgba(0,229,255,0.05)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: e.colorBg,
                    border: `1px solid ${e.colorBorder}`,
                    color: e.color,
                    fontSize: 16,
                  }}
                >
                  <i className={`ti ${e.icon}`} />
                </div>
                <div className="text-left overflow-hidden flex-1 min-w-0">
                  <div
                    style={{
                      fontSize: 12,
                      color: active === e.id ? "#c8e8f8" : "#6a9bbf",
                      fontFamily: "'Exo 2', sans-serif",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {e.company}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#2a4a6a",
                      fontFamily: "'Share Tech Mono', monospace",
                      letterSpacing: 1,
                      marginTop: 2,
                    }}
                  >
                    {e.duration}
                  </div>
                </div>
                <i
                  className="ti ti-chevron-right sm:hidden flex-shrink-0"
                  style={{ fontSize: 14, color: "#2a4a6a" }}
                />
              </button>
            ))}
          </div>

          {/* ── Detail Panel ── */}
          <div
            className={`flex-1 overflow-y-auto ${mobileTab === "detail" ? "block" : "hidden"} sm:block`}
            style={{ padding: "16px" }}
          >
            {/* company + designation */}
            <div className="flex items-start gap-3 mb-4">
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: exp.colorBg,
                  border: `1px solid ${exp.colorBorder}`,
                  color: exp.color,
                  fontSize: 20,
                }}
              >
                <i className={`ti ${exp.icon}`} />
              </div>
              <div className="min-w-0">
                <div
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: exp.color,
                    letterSpacing: 2,
                    wordBreak: "break-word",
                  }}
                >
                  {exp.company}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#c8e8f8",
                    fontFamily: "'Exo 2', sans-serif",
                    marginTop: 2,
                  }}
                >
                  {exp.designation}
                </div>
              </div>
            </div>

            {/* meta chips — wrap on mobile */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {[
                { icon: "ti-calendar",  text: exp.period   },
                { icon: "ti-clock",     text: exp.duration },
                { icon: "ti-map-pin",   text: exp.location },
                { icon: "ti-briefcase", text: exp.type     },
              ].map((m) => (
                <div
                  key={m.text}
                  className="flex items-center gap-1 px-2 py-1 rounded-full"
                  style={{
                    background: "rgba(0,229,255,0.05)",
                    border: "1px solid rgba(0,229,255,0.12)",
                    fontSize: 9,
                    color: "#6a9bbf",
                    fontFamily: "'Share Tech Mono', monospace",
                    whiteSpace: "nowrap",
                  }}
                >
                  <i className={`ti ${m.icon}`} style={{ fontSize: 10, flexShrink: 0 }} />
                  {m.text}
                </div>
              ))}
            </div>

            {/* description */}
            <div
              style={{
                fontSize: 12,
                color: "#6a9bbf",
                lineHeight: 1.8,
                marginBottom: 16,
                padding: "10px 12px",
                background: "rgba(0,229,255,0.03)",
                border: "1px solid rgba(0,229,255,0.08)",
                borderRadius: 8,
              }}
            >
              {exp.description}
            </div>

            {/* skills */}
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 9,
                  color: "#2a4a6a",
                  letterSpacing: 3,
                  fontFamily: "'Share Tech Mono', monospace",
                  marginBottom: 8,
                }}
              >
                // TECH STACK
              </div>
              <div className="flex flex-wrap gap-1.5">
                {exp.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full"
                    style={{
                      fontSize: 9,
                      background: exp.colorBg,
                      border: `1px solid ${exp.colorBorder}`,
                      color: exp.color,
                      fontFamily: "'Share Tech Mono', monospace",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* projects */}
            <div>
              <div
                style={{
                  fontSize: 9,
                  color: "#2a4a6a",
                  letterSpacing: 3,
                  fontFamily: "'Share Tech Mono', monospace",
                  marginBottom: 8,
                }}
              >
                // PROJECTS DELIVERED
              </div>
              <div className="flex flex-col gap-2">
                {exp.projects.map((p) => (
                  <div
                    key={p}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                    style={{
                      background: "#0c1422",
                      border: "1px solid rgba(0,229,255,0.08)",
                      fontSize: 12,
                      color: "#c8e8f8",
                      fontFamily: "'Exo 2', sans-serif",
                    }}
                  >
                    <i
                      className="ti ti-folder-filled"
                      style={{ fontSize: 13, color: exp.color, flexShrink: 0 }}
                    />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const About = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExpId, setSelectedExpId] = useState(experiences[0].id);
  const fadeRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("fade-visible");
        }),
      { threshold: 0.1 }
    );
    if (fadeRef.current) obs.observe(fadeRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
    
      {modalOpen && (
        <ExperienceModal
          initialId={selectedExpId}
          onClose={() => setModalOpen(false)}
        />
      )}

      <section
        id="about"
        className="relative z-[2]"
        style={{ background: "#080e1a", minHeight: "100vh", padding: "60px 0 50px" }}
      >
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">

          <div
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 10,
              letterSpacing: 3,
              color: "#2a4a6a",
              marginBottom: 10,
            }}
          >
            // PROFILE.JSON
          </div>
          <div
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(20px, 5vw, 26px)",
              fontWeight: 700,
              color: "#00e5ff",
              letterSpacing: 4,
              marginBottom: 8,
            }}
          >
            ABOUT ME
          </div>
          <div
            style={{
              width: 60,
              height: 2,
              background: "linear-gradient(90deg,#00e5ff,transparent)",
              marginBottom: 32,
            }}
          />

          <div
            ref={fadeRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start fade-in"
          >
            {/* ── Left: text + info + buttons ── */}
            <div>
              <div style={{ fontSize: 13, color: "#6a9bbf", lineHeight: 1.9 }}>
                <p style={{ marginBottom: 12 }}>
                  I am a passionate{" "}
                  <strong style={{ color: "#00e5ff" }}>Full Stack Developer</strong> and{" "}
                  <strong style={{ color: "#00e5ff" }}>Network Engineer</strong> based in
                  Dhaka, Bangladesh. I build modern, scalable web applications and design
                  efficient network infrastructures.
                </p>
                <p style={{ marginBottom: 12 }}>
                  With expertise in MERN Stack, PHP/Laravel, .NET, and Cisco networking,
                  I bring both frontend creativity and backend robustness to every project.
                  I also work with router and switch configurations, VLANs, firewall
                  management, and network security.
                </p>
                <p>
                  My approach combines clean code practices with performance-driven
                  architecture, ensuring every solution is both functional and
                  maintainable. I'm always eager to learn new technologies and tackle
                  challenging problems.
                </p>
              </div>

              {/* Info grid — 1 col on xs, 2 on sm+ */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2.5 my-5">
                {[
                  { icon: "ti-user",         label: "Name",     value: "Md Khairul Islam"       },
                  { icon: "ti-map-pin",       label: "Location", value: "Gazipur, Bangladesh"    },
                  { icon: "ti-school",        label: "Degree",   value: "B.Sc. Computer Science" },
                  { icon: "ti-device-laptop", label: "Status",   value: "Available for Hire"     },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                    style={{
                      background: "#0c1422",
                      border: "1px solid rgba(0,229,255,0.08)",
                    }}
                  >
                    <i
                      className={`ti ${item.icon}`}
                      style={{ fontSize: 14, color: "#00b8cc", flexShrink: 0 }}
                    />
                    <div className="min-w-0">
                      <div
                        style={{
                          fontSize: 9,
                          color: "#2a4a6a",
                          fontFamily: "'Share Tech Mono', monospace",
                          letterSpacing: 1,
                        }}
                      >
                        {item.label.toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#c8e8f8",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 flex-wrap">
                <a
                  href="#contact"
                  className="transition-all duration-200 no-underline inline-block"
                  style={{
                    padding: "10px 24px",
                    background: "rgba(0,60,110,0.8)",
                    border: "1px solid #00e5ff",
                    color: "#00e5ff",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 11,
                    letterSpacing: 2,
                    borderRadius: 4,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0,80,140,0.9)";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(0,229,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0,60,110,0.8)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  HIRE ME
                </a>
                <a
                  href="#works"
                  className="transition-all duration-200 no-underline inline-block"
                  style={{
                    padding: "10px 24px",
                    background: "transparent",
                    border: "1px solid rgba(0,229,255,0.3)",
                    color: "#6a9bbf",
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: 12,
                    borderRadius: 4,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#00e5ff";
                    e.currentTarget.style.color = "#00e5ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)";
                    e.currentTarget.style.color = "#6a9bbf";
                  }}
                >
                  MY WORK
                </a>
              </div>
            </div>

            {/* ── Right: stat cards ── */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  onClick={() =>
                    s.clickable &&
                    (setSelectedExpId(experiences[0].id), setModalOpen(true))
                  }
                  className="relative rounded-lg transition-all duration-200"
                  style={{
                    background: "#0c1422",
                    border: `1px solid ${
                      s.clickable
                        ? "rgba(0,229,255,0.25)"
                        : "rgba(0,229,255,0.1)"
                    }`,
                    padding: "16px",
                    cursor: s.clickable ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => {
                    if (s.clickable) {
                      e.currentTarget.style.borderColor = "#00e5ff";
                      e.currentTarget.style.boxShadow =
                        "0 0 20px rgba(0,229,255,0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (s.clickable) {
                      e.currentTarget.style.borderColor =
                        "rgba(0,229,255,0.25)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {s.clickable && (
                    <div
                      className="absolute top-2 right-2 flex items-center gap-1"
                      style={{
                        fontSize: 8,
                        color: "#00b8cc",
                        fontFamily: "'Share Tech Mono', monospace",
                        letterSpacing: 1,
                      }}
                    >
                      <i className="ti ti-click" style={{ fontSize: 10 }} />
                      VIEW
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: "clamp(22px, 5vw, 28px)",
                      fontWeight: 700,
                      color: "#00e5ff",
                      lineHeight: 1,
                    }}
                  >
                    {s.num}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#2a4a6a",
                      fontFamily: "'Share Tech Mono', monospace",
                      letterSpacing: 2,
                      marginTop: 6,
                    }}
                  >
                    {s.label}
                  </div>
                  {s.clickable && (
                    <div
                      style={{
                        marginTop: 8,
                        height: 1,
                        background: "linear-gradient(90deg,#00e5ff,transparent)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
