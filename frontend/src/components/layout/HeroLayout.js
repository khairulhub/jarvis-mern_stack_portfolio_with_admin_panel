import { useEffect, useRef, useState } from "react";
import CmdsPanel from "./CmdsPanel";
import { getHero } from "../../utils/api";
import profileImgFallback from "../../uploads/images/formal-removebg-preview.png";

const DEFAULT_HERO = {
  tagline: "FULL STACK DEVELOPER & NETWORK ENGINEER",
  name: "KHAIRUL",
  subtitle: "// SYSTEM ONLINE",
  description: "Passionate developer and network engineer from Bangladesh. Building scalable web applications and designing robust network infrastructures. Specialized in MERN Stack, PHP/Laravel, .NET, and Cisco networking.",
  location: "DHAKA, BANGLADESH",
  statusText: "AVAILABLE FOR HIRE",
  cvLink: "https://drive.google.com/file/d/1y-GYsyhzvh29zxoSy5vYb9pvL5ugRiYO/view?usp=sharing",
  profileImage: "",
  chips: ["MERN STACK", "PHP / LARAVEL", ".NET", "CISCO", "CCNA", "Mikrotik"],
};

const HeroLayout = () => {
  const leftRef  = useRef(null);
  const rightRef = useRef(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await getHero();
        if (res.success && res.data) {
          setHero({ ...DEFAULT_HERO, ...res.data });
        }
      } catch (err) {
        console.warn("Could not fetch hero, using defaults:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("fade-visible"); }),
      { threshold: 0.1 }
    );
    if (leftRef.current)  obs.observe(leftRef.current);
    if (rightRef.current) obs.observe(rightRef.current);
    return () => obs.disconnect();
  }, [loading]);

  const profileSrc = hero.profileImage ? hero.profileImage : profileImgFallback;
  const chips = Array.isArray(hero.chips) ? hero.chips : [];

  return (
    <>
      {/* ── CMDS TOGGLE BUTTON ── */}
      <button
        onClick={() => setPanelOpen(true)}
        title="Recent Commands"
        className="fixed z-[600] flex flex-col items-center gap-1 transition-all duration-200"
        style={{ right: 20, top: "50%", transform: "translateY(-50%)", background: "#0c1422", border: "1px solid rgba(0,229,255,0.3)", borderRadius: 8, padding: "10px 8px", color: "#00e5ff", cursor: "pointer" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,229,255,0.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#0c1422")}
      >
        <i className="ti ti-terminal-2" style={{ fontSize: 18 }} />
        <span style={{ fontSize: 9, fontFamily: "'Share Tech Mono', monospace", color: "#2a4a6a", letterSpacing: 1, writingMode: "vertical-lr" }}>CMDS</span>
      </button>

      <CmdsPanel open={panelOpen} onClose={() => setPanelOpen(false)} />

      <section id="home" className="relative z-[2] flex items-center justify-center overflow-hidden" style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 60 }}>
        <div className="w-full max-w-[1100px] mx-auto px-5 sm:px-8 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">

          {/* LEFT TEXT */}
          <div ref={leftRef} className="fade-in flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#00b8cc" }}>
              <span style={{ width: 28, height: 1, background: "#00b8cc", display: "inline-block", flexShrink: 0 }} />
              <span>{hero.tagline}</span>
            </div>

            <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(36px, 9vw, 52px)", fontWeight: 900, lineHeight: 1.1, color: "#00e5ff", marginBottom: 8, animation: "glowText 3s ease-in-out infinite alternate" }}>
              {hero.name}
            </h1>

            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(13px, 3.5vw, 18px)", fontWeight: 500, color: "#6a9bbf", letterSpacing: 3, marginBottom: 20 }}>
              {hero.subtitle}
            </div>

            <p className="mx-auto lg:mx-0" style={{ fontSize: 14, color: "#6a9bbf", lineHeight: 1.8, maxWidth: 420, marginBottom: 28 }}>
              {hero.description}
            </p>

            <div className="flex gap-3 flex-wrap justify-center lg:justify-start mb-6">
              <a href="#works" className="transition-all duration-200 no-underline inline-block"
                style={{ padding: "10px 28px", background: "rgba(0,60,110,0.8)", border: "1px solid #00e5ff", color: "#00e5ff", fontFamily: "'Orbitron', sans-serif", fontSize: 11, letterSpacing: 2, borderRadius: 4 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,80,140,0.9)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,229,255,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,60,110,0.8)"; e.currentTarget.style.boxShadow = "none"; }}>
                VIEW WORKS
              </a>
              <a href="#contact" className="transition-all duration-200 no-underline inline-block"
                style={{ padding: "10px 28px", background: "transparent", border: "1px solid rgba(0,229,255,0.3)", color: "#6a9bbf", fontFamily: "'Exo 2', sans-serif", fontSize: 12, borderRadius: 4 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00e5ff"; e.currentTarget.style.color = "#00e5ff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)"; e.currentTarget.style.color = "#6a9bbf"; }}>
                CONTACT ME
              </a>
              {hero.cvLink && (
                <a href={hero.cvLink} target="_blank" rel="noreferrer" className="transition-all duration-200 no-underline inline-block"
                  style={{ padding: "10px 28px", background: "rgba(0,60,110,0.8)", border: "1px solid #00e5ff", color: "#00e5ff", fontFamily: "'Orbitron', sans-serif", fontSize: 11, letterSpacing: 2, borderRadius: 4 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,80,140,0.9)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,229,255,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,60,110,0.8)"; e.currentTarget.style.boxShadow = "none"; }}>
                  Download CV
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
              {chips.map((chip) => (
                <span key={chip} className="px-2.5 py-0.5 rounded-full text-[10px]"
                  style={{ border: "1px solid rgba(0,229,255,0.3)", color: "#00b8cc", fontFamily: "'Share Tech Mono', monospace" }}>
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT PHOTO */}
          <div ref={rightRef} className="fade-in flex flex-col items-center flex-shrink-0" style={{ transitionDelay: "0.2s" }}>
            <div className="relative" style={{ width: "clamp(200px, 45vw, 300px)", height: "clamp(255px, 57vw, 380px)" }}>
              <div className="absolute inset-0 rounded-xl" style={{ border: "1px solid rgba(0,229,255,0.3)", background: "linear-gradient(135deg,rgba(0,229,255,0.05),transparent)" }} />
              <img src={profileSrc} alt={hero.name} className="w-full h-full object-cover object-top rounded-xl" style={{ filter: "contrast(1.1) brightness(1.05)" }} />
              <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(to bottom,transparent 60%,rgba(0,229,255,0.1) 100%)" }} />
              {[
                { top: -4, left: -4, borderWidth: "2px 0 0 2px" },
                { top: -4, right: -4, borderWidth: "2px 2px 0 0" },
                { bottom: -4, left: -4, borderWidth: "0 0 2px 2px" },
                { bottom: -4, right: -4, borderWidth: "0 2px 2px 0" },
              ].map((s, i) => (
                <div key={i} className="absolute" style={{ width: 16, height: 16, borderColor: "#00e5ff", borderStyle: "solid", ...s }} />
              ))}
              <div className="absolute left-0 right-0 opacity-40" style={{ height: 2, background: "linear-gradient(90deg,transparent,#00e5ff,transparent)", animation: "photoScan 3s ease-in-out infinite", top: 0 }} />
            </div>
            <div className="mt-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-2" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#2a4a6a" }}>
                <span style={{ color: "#00ff88" }}>●</span> STATUS: {hero.statusText}
              </div>
              <div className="flex items-center gap-2" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#2a4a6a" }}>
                <span style={{ color: "#00e5ff" }}>▶</span> LOCATION: {hero.location}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default HeroLayout;