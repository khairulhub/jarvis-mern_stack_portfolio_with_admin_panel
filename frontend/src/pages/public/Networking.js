import { useState, useEffect, useRef } from "react";
import { getNetworks } from "../../utils/api";

/* ═══════════════════════════════════════════════════════
   NETWORK TOPICS DATA
═══════════════════════════════════════════════════════ */
const NET_SKILLS = [
  { name: "Cisco Routing & Switching", pct: 90 },
  { name: "VLAN / Inter-VLAN Routing",  pct: 88 },
  { name: "Firewall / ACL",            pct: 82 },
  { name: "Mikrotik RouterOS",         pct: 85 },
  { name: "TCP/IP & OSI Model",        pct: 92 },
  { name: "Network Security",          pct: 78 },
];

const TOPICS_FALLBACK = [
  /* ── 1. ROUTER CONFIG ──────────────────────────────── */
  {
    id: 1,
    icon: "ti-router",
    emoji: "🔀",
    accentColor: "#00e5ff",
    accentBg: "rgba(0,229,255,0.08)",
    accentBorder: "rgba(0,229,255,0.25)",
    category: "CISCO",
    title: "ROUTER CONFIG",
    subtitle: "Basic to Advanced — VLAN, OSPF, Traffic Control",
    shortDesc: "Complete router configuration from hostname setup to advanced OSPF, VLAN routing, ACL, and traffic shaping in real-life ISP/enterprise deployments.",
    diagram: `
┌─────────────────────────────────────────────────────┐
│              ENTERPRISE ROUTER TOPOLOGY             │
│                                                     │
│  [Internet/ISP]──────[WAN Gi0/0]                   │
│                           │                         │
│                      [ROUTER R1]                    │
│                      192.168.0.1                    │
│                    ┌──────┴──────┐                  │
│               [LAN Gi0/1]  [LAN Gi0/2]              │
│               192.168.1.0  192.168.2.0              │
│                    │             │                  │
│             [SALES VLAN10] [IT VLAN20]              │
│              .1-.50           .1-.50                │
└─────────────────────────────────────────────────────┘`,
    steps: [
      {
        title: "1. Basic Setup",
        desc: "Set hostname, disable DNS lookup, configure enable secret and console passwords.",
        code: `Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# no ip domain-lookup
R1(config)# enable secret Cisco123
R1(config)# line console 0
R1(config-line)# password Cisco123
R1(config-line)# login
R1(config-line)# logging synchronous
R1(config-line)# exit
R1(config)# service password-encryption
R1(config)# banner motd #AUTHORIZED ACCESS ONLY#`,
      },
      {
        title: "2. Interface Configuration",
        desc: "Configure WAN and LAN interfaces with IP addresses.",
        code: `! WAN Interface (to ISP)
R1(config)# interface GigabitEthernet0/0
R1(config-if)# description WAN_TO_ISP
R1(config-if)# ip address 203.0.113.2 255.255.255.252
R1(config-if)# no shutdown

! LAN Interface
R1(config)# interface GigabitEthernet0/1
R1(config-if)# description LAN_SALES
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown

! Sub-interface for VLAN routing
R1(config)# interface GigabitEthernet0/1.10
R1(config-subif)# encapsulation dot1Q 10
R1(config-subif)# ip address 192.168.10.1 255.255.255.0

R1(config)# interface GigabitEthernet0/1.20
R1(config-subif)# encapsulation dot1Q 20
R1(config-subif)# ip address 192.168.20.1 255.255.255.0`,
      },
      {
        title: "3. OSPF Routing",
        desc: "Configure OSPF dynamic routing protocol for multi-area deployment.",
        code: `! Enable OSPF process
R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# network 192.168.2.0 0.0.0.255 area 0
R1(config-router)# network 203.0.113.0 0.0.0.3 area 0
R1(config-router)# passive-interface GigabitEthernet0/1
R1(config-router)# default-information originate

! Verification
R1# show ip ospf neighbor
R1# show ip route ospf
R1# show ip protocols`,
      },
      {
        title: "4. NAT / PAT (Internet Access)",
        desc: "Configure NAT overload (PAT) so LAN users can access internet.",
        code: `! Define inside/outside
R1(config)# interface Gi0/0
R1(config-if)# ip nat outside

R1(config)# interface Gi0/1
R1(config-if)# ip nat inside

! Create ACL for NAT
R1(config)# ip access-list standard LAN_NAT
R1(config-std-nacl)# permit 192.168.0.0 0.0.255.255

! Enable PAT
R1(config)# ip nat inside source list LAN_NAT
  interface GigabitEthernet0/0 overload

! Verify
R1# show ip nat translations
R1# show ip nat statistics`,
      },
      {
        title: "5. Traffic Control / QoS",
        desc: "Policy-based routing and traffic shaping for bandwidth management.",
        code: `! Create class-map for VoIP traffic
R1(config)# class-map match-all VOIP
R1(config-cmap)# match protocol rtp

! Create class-map for HTTP
R1(config)# class-map match-all HTTP_TRAFFIC
R1(config-cmap)# match protocol http

! Policy-map with priority queue
R1(config)# policy-map QOS_POLICY
R1(config-pmap)# class VOIP
R1(config-pmap-c)# priority 512
R1(config-pmap)# class HTTP_TRAFFIC
R1(config-pmap-c)# bandwidth 2048
R1(config-pmap)# class class-default
R1(config-pmap-c)# fair-queue

! Apply to interface
R1(config)# interface Gi0/0
R1(config-if)# service-policy output QOS_POLICY`,
      },
      {
        title: "6. Static Routes & Default Route",
        desc: "Add static and default routes for basic routing needs.",
        code: `! Default route to ISP
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1

! Static route to remote network
R1(config)# ip route 10.0.0.0 255.0.0.0 192.168.1.254

! Floating static (backup route)
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.5 5

! Verify
R1# show ip route
R1# ping 8.8.8.8 source 192.168.1.1`,
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════
   COPY BUTTON COMPONENT
═══════════════════════════════════════════════════════ */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 transition-all duration-200"
      style={{
        background: copied ? "rgba(0,255,136,0.1)" : "rgba(0,229,255,0.07)",
        border: copied ? "1px solid rgba(0,255,136,0.3)" : "1px solid rgba(0,229,255,0.15)",
        color: copied ? "#00ff88" : "#6a9bbf",
        borderRadius: 5,
        padding: "3px 10px",
        fontSize: 10,
        fontFamily: "'Share Tech Mono', monospace",
        cursor: "pointer",
        letterSpacing: 1,
      }}
    >
      <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} style={{ fontSize: 12 }} />
      {copied ? "COPIED!" : "COPY"}
    </button>
  );
}



function NetworkModal({ topic: t, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setActiveStep(0);
    setMobileMenuOpen(false);
    document.body.style.overflow = "hidden";
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [t, onClose]);

  const step = t.steps[activeStep];

  const goToStep = (i) => {
    setActiveStep(i);
    setMobileMenuOpen(false);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 900,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "12px",
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Modal box */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "min(80vw, 940px)",
          height: "min(90vh, 680px)",
          background: "#080e1a",
          border: `1px solid ${t.accentBorder}`,
          borderRadius: 14,
          boxShadow: `0 0 60px ${t.accentBg}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── top strip ── */}
        <div style={{
          height: 3, flexShrink: 0,
          background: `linear-gradient(90deg,transparent,${t.accentColor},transparent)`,
        }} />

        {/* ── HEADER ── */}
        <div style={{
          flexShrink: 0, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 10,
          padding: "12px 16px",
          background: "#04080f",
          borderBottom: "1px solid rgba(0,229,255,0.08)",
        }}>
          {/* left: icon + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden", flex: 1 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: t.accentBg, border: `1px solid ${t.accentBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>
              {t.emoji}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{
                fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(11px,2vw,14px)",
                fontWeight: 700, color: t.accentColor, letterSpacing: 2,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {t.title}
              </div>
              <div style={{
                fontSize: "clamp(9px,1.5vw,11px)", color: "#6a9bbf",
                fontFamily: "'Share Tech Mono',monospace", marginTop: 2,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {t.subtitle}
              </div>
            </div>
          </div>

          {/* right: category + mobile step picker + close */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{
              padding: "2px 8px", borderRadius: 20, fontSize: 9,
              background: t.accentBg, border: `1px solid ${t.accentBorder}`,
              color: t.accentColor, fontFamily: "'Share Tech Mono',monospace",
              whiteSpace: "nowrap",
            }}>
              {t.category}
            </span>

            {/* Mobile step picker button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "none",
                background: "rgba(0,229,255,0.06)",
                border: "1px solid rgba(0,229,255,0.2)",
                borderRadius: 6, padding: "5px 10px",
                color: "#00e5ff", cursor: "pointer", fontSize: 10,
                fontFamily: "'Share Tech Mono',monospace",
              }}
              className="mobile-step-btn"
            >
              <i className="ti ti-list" style={{ fontSize: 13 }} />
            </button>

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

        {/* ── Mobile step dropdown ── */}
        {mobileMenuOpen && (
          <div style={{
            flexShrink: 0,
            background: "#04080f",
            borderBottom: "1px solid rgba(0,229,255,0.08)",
            maxHeight: 200, overflowY: "auto",
          }}>
            {t.steps.map((s, i) => (
              <button key={i} onClick={() => goToStep(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "10px 16px",
                  background: activeStep === i ? "rgba(0,229,255,0.06)" : "transparent",
                  borderLeft: `3px solid ${activeStep === i ? t.accentColor : "transparent"}`,
                  border: "none", cursor: "pointer", textAlign: "left",
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace",
                  background: activeStep === i ? t.accentBg : "transparent",
                  border: `1px solid ${activeStep === i ? t.accentColor : "rgba(0,229,255,0.15)"}`,
                  color: activeStep === i ? t.accentColor : "#2a4a6a",
                }}>
                  {i + 1}
                </div>
                <span style={{
                  fontSize: 11, color: activeStep === i ? "#c8e8f8" : "#6a9bbf",
                  fontFamily: "'Share Tech Mono',monospace",
                }}>
                  {s.title}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── BODY: sidebar + detail ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

          {/* Desktop sidebar */}
          <div
            className="desktop-sidebar"
            style={{
              width: 195, flexShrink: 0,
              background: "#04080f",
              borderRight: "1px solid rgba(0,229,255,0.07)",
              overflowY: "auto", display: "flex", flexDirection: "column",
            }}
          >
            {t.steps.map((s, i) => (
              <button key={i} onClick={() => setActiveStep(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 14px", width: "100%",
                  background: activeStep === i ? "rgba(0,229,255,0.06)" : "transparent",
                  borderLeft: `3px solid ${activeStep === i ? t.accentColor : "transparent"}`,
                  border: "none",
                  cursor: "pointer", textAlign: "left", flexShrink: 0,
                }}
                onMouseEnter={(e) => { if (activeStep !== i) e.currentTarget.style.background = "rgba(0,229,255,0.03)"; }}
                onMouseLeave={(e) => { if (activeStep !== i) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace",
                  background: activeStep === i ? t.accentBg : "transparent",
                  border: `1px solid ${activeStep === i ? t.accentColor : "rgba(0,229,255,0.1)"}`,
                  color: activeStep === i ? t.accentColor : "#2a4a6a",
                  transition: "all 0.2s",
                }}>
                  {i + 1}
                </div>
                <span style={{
                  fontSize: 10.5, lineHeight: 1.4,
                  color: activeStep === i ? "#c8e8f8" : "#2a4a6a",
                  fontFamily: "'Share Tech Mono',monospace",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}>
                  {s.title.replace(/^\d+\.\s*/, "")}
                </span>
              </button>
            ))}
          </div>

          {/* ── DETAIL PANEL ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", minWidth: 0 }}>

            {/* step title + copy */}
            <div style={{
              display: "flex", alignItems: "flex-start",
              justifyContent: "space-between", gap: 8,
              marginBottom: 12, flexWrap: "wrap",
            }}>
              <div style={{
                fontFamily: "'Orbitron',sans-serif",
                fontSize: "clamp(11px,2vw,13px)",
                fontWeight: 700, color: t.accentColor, letterSpacing: 1.5,
              }}>
                {step.title}
              </div>
              <CopyButton text={step.code} />
            </div>

            {/* description box */}
            <p style={{
              fontSize: "clamp(11px,1.8vw,12.5px)", color: "#6a9bbf",
              lineHeight: 1.75, marginBottom: 14,
              padding: "10px 14px",
              background: "rgba(0,229,255,0.03)",
              border: "1px solid rgba(0,229,255,0.07)",
              borderRadius: 7,
            }}>
              {step.desc}
            </p>

            {/* topology diagram — step 0 only */}
            {activeStep === 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", marginBottom: 6,
                }}>
                  <span style={{
                    fontSize: 9, color: "#2a4a6a", letterSpacing: 3,
                    fontFamily: "'Share Tech Mono',monospace",
                  }}>
                    // TOPOLOGY DIAGRAM
                  </span>
                  <CopyButton text={t.diagram} />
                </div>
                <pre style={{
                  background: "#020408",
                  border: `1px solid ${t.accentBorder}`,
                  borderRadius: 8, padding: "12px 14px",
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: "clamp(9px,1.5vw,11px)",
                  color: t.accentColor,
                  lineHeight: 1.65, overflowX: "auto",
                  whiteSpace: "pre", maxHeight: 180,
                  overflowY: "auto", margin: 0,
                }}>
                  {t.diagram}
                </pre>
              </div>
            )}

            {/* code block */}
            <div style={{ marginBottom: 14 }}>
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 6,
              }}>
                <span style={{
                  fontSize: 9, color: "#2a4a6a", letterSpacing: 3,
                  fontFamily: "'Share Tech Mono',monospace",
                }}>
                  // CONFIGURATION
                </span>
                <CopyButton text={step.code} />
              </div>

              {/* terminal chrome */}
              <div style={{
                borderRadius: 8, overflow: "hidden",
                border: `1px solid ${t.accentBorder}`,
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 12px",
                  background: "#0c1422",
                  borderBottom: "1px solid rgba(0,229,255,0.08)",
                }}>
                  {["#f87171","#facc15","#4ade80"].map((c) => (
                    <div key={c} style={{
                      width: 9, height: 9, borderRadius: "50%",
                      background: c, opacity: 0.8, flexShrink: 0,
                    }} />
                  ))}
                  <span style={{
                    fontSize: 9, color: "#2a4a6a",
                    fontFamily: "'Share Tech Mono',monospace",
                    marginLeft: 6, letterSpacing: 1,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {t.category} — {step.title}
                  </span>
                </div>
                <pre style={{
                  background: "#020408",
                  padding: "14px 16px",
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: "clamp(10px,1.6vw,11.5px)",
                  color: "#00b8cc",
                  lineHeight: 1.8, overflowX: "auto",
                  whiteSpace: "pre-wrap", margin: 0,
                  maxHeight: 260, overflowY: "auto",
                }}>
                  {step.code}
                </pre>
              </div>
            </div>

            {/* prev / next navigation */}
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 12,
              borderTop: "1px solid rgba(0,229,255,0.07)",
              gap: 8,
            }}>
              <button
                onClick={() => setActiveStep((p) => Math.max(p - 1, 0))}
                disabled={activeStep === 0}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "transparent",
                  border: "1px solid rgba(0,229,255,0.15)",
                  color: activeStep === 0 ? "#1a2a3a" : "#6a9bbf",
                  borderRadius: 6, padding: "7px 16px",
                  fontSize: 10, fontFamily: "'Share Tech Mono',monospace",
                  cursor: activeStep === 0 ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                <i className="ti ti-arrow-left" style={{ fontSize: 11 }} /> PREV
              </button>

              {/* step dots */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {t.steps.map((_, i) => (
                  <div key={i} onClick={() => setActiveStep(i)}
                    style={{
                      width: i === activeStep ? 18 : 6,
                      height: 6, borderRadius: 3, cursor: "pointer",
                      background: i === activeStep ? t.accentColor : "rgba(0,229,255,0.12)",
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveStep((p) => Math.min(p + 1, t.steps.length - 1))}
                disabled={activeStep === t.steps.length - 1}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: activeStep === t.steps.length - 1 ? "transparent" : t.accentBg,
                  border: `1px solid ${activeStep === t.steps.length - 1 ? "rgba(0,229,255,0.15)" : t.accentBorder}`,
                  color: activeStep === t.steps.length - 1 ? "#1a2a3a" : t.accentColor,
                  borderRadius: 6, padding: "7px 16px",
                  fontSize: 10, fontFamily: "'Share Tech Mono',monospace",
                  cursor: activeStep === t.steps.length - 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                NEXT <i className="ti ti-arrow-right" style={{ fontSize: 11 }} />
              </button>
            </div>

          </div>
          {/* end detail */}
        </div>
        {/* end body */}

      </div>
      {/* end modal box */}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 600px) {
          .desktop-sidebar { display: none !important; }
          .mobile-step-btn { display: flex !important; align-items: center; }
        }
        @media (min-width: 601px) {
          .mobile-step-btn { display: none !important; }
          .desktop-sidebar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NETWORKING SECTION
═══════════════════════════════════════════════════════ */
 const Networking = () => {
  const [selected, setSelected]   = useState(null);
  const [topics, setTopics]       = useState([]);    // ← DB থেকে আসবে
  const [skills, setSkills]       = useState(NET_SKILLS); // fallback to hardcoded
  const [loading, setLoading]     = useState(true);
  const gridRef = useRef(null);

  // ─── Fetch from DB ───────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getNetworks();
        if (res.success && res.data.length > 0) {
          setTopics(res.data);
        } else {
          // fallback: show 1 default topic from hardcoded array
          setTopics(TOPICS_FALLBACK);
        }
      } catch {
        // DB connect না হলে hardcoded 1st topic দেখাবে
        setTopics(TOPICS_FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ─── Intersection observer for fade-in ───────────────────
  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("fade-visible");
      }),
      { threshold: 0.1 }
    );
    const cards = gridRef.current?.querySelectorAll(".net-card");
    cards?.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [loading, topics]);

  if (loading) {
    return (
      <section id="networking" style={{ background: "#04080f", padding: "80px 0", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#00e5ff", fontFamily: "'Share Tech Mono',monospace", fontSize: 13, letterSpacing: 3 }}>
          LOADING NETWORK DATA...
        </div>
      </section>
    );
  }

  return (
    <>
      {selected && <NetworkModal topic={selected} onClose={() => setSelected(null)} />}

      <section id="networking" className="relative z-[2]"
        style={{ background: "#04080f", padding: "80px 0 60px", minHeight: "100vh" }}>
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">

          {/* header */}
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 3, color: "#2a4a6a", marginBottom: 10 }}>
            // NETWORK.CONFIG
          </div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 26, fontWeight: 700, color: "#00e5ff", letterSpacing: 4, marginBottom: 8 }}>
            NETWORKING
          </div>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,#00e5ff,transparent)", marginBottom: 36 }} />

          {/* top: topic cards */}
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {topics.map((t, i) => (
              <div
                key={t._id || t.id}
                className="net-card fade-in rounded-xl cursor-pointer transition-all duration-300 flex flex-col overflow-hidden"
                style={{
                  background: "#0c1422",
                  border: "1px solid rgba(0,229,255,0.1)",
                  transitionDelay: `${i * 0.08}s`,
                }}
                onClick={() => setSelected(t)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = t.accentBorder;
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = `0 10px 30px ${t.accentBg}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,229,255,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* top strip */}
                <div style={{ height: 3, background: `linear-gradient(90deg,transparent,${t.accentColor},transparent)` }} />

                <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center text-2xl rounded-xl"
                      style={{ width: 50, height: 50, background: t.accentBg, border: `1px solid ${t.accentBorder}` }}>
                      {t.emoji}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px]"
                      style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, color: t.accentColor, fontFamily: "'Share Tech Mono',monospace" }}>
                      {t.category}
                    </span>
                  </div>

                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, fontWeight: 700, color: "#c8e8f8", letterSpacing: 2, marginBottom: 4 }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: 10, color: t.accentColor, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1, marginBottom: 10 }}>
                    {t.subtitle}
                  </div>
                  <p style={{ fontSize: 11, color: "#6a9bbf", lineHeight: 1.65, flex: 1, marginBottom: 14 }}>
                    {t.shortDesc}
                  </p>

                  <div style={{ height: 1, background: "rgba(0,229,255,0.06)", marginBottom: 10 }} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {t.steps.map((_, si) => (
                        <div key={si} style={{ width: 5, height: 5, borderRadius: "50%",
                          background: si === 0 ? t.accentColor : "rgba(0,229,255,0.12)" }} />
                      ))}
                      <span style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", marginLeft: 4 }}>
                        {t.steps.length} STEPS
                      </span>
                    </div>
                    <div className="flex items-center gap-1" style={{ fontSize: 9, color: t.accentColor, fontFamily: "'Share Tech Mono',monospace" }}>
                      <i className="ti ti-click" style={{ fontSize: 11 }} /> EXPLORE
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* bottom: skills bars */}
          <div className="rounded-xl p-6" style={{ background: "#0c1422", border: "1px solid rgba(0,229,255,0.08)" }}>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 3, color: "#2a4a6a", marginBottom: 16 }}>
              // NETWORK.SKILLS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skills.map((s) => (
                <div key={s.name} className="rounded-lg p-3"
                  style={{ background: "#080e1a", border: "1px solid rgba(0,229,255,0.06)" }}>
                  <div className="flex justify-between mb-2">
                    <span style={{ fontSize: 12, color: "#c8e8f8" }}>{s.name}</span>
                    <span style={{ fontSize: 11, color: "#00e5ff", fontFamily: "'Share Tech Mono',monospace" }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: "#04080f", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      width: `${s.pct}%`, height: "100%", borderRadius: 4,
                      background: "linear-gradient(90deg,#00e5ff,#00ff88)",
                      transition: "width 1.2s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Networking;