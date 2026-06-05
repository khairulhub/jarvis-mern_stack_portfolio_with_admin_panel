import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { getFooterBrand } from "../../utils/api";

const navLinks = [
  { label: "HOME",        href: "/",            sectionId: null         },
  { label: "ABOUT",       href: "/#about",       sectionId: "about"      },
  { label: "SERVICES",    href: "/#services",    sectionId: "services"   },
  { label: "WORKS",       href: "/#works",       sectionId: "works"      },
  { label: "CODING",      href: "/#coding",      sectionId: "coding"     },
  { label: "NETWORKING",  href: "/#networking",  sectionId: "networking" },
  { label: "BLOG",        href: "/blog",         sectionId: null         },
  { label: "TEAM",        href: "/team",         sectionId: null         },
  { label: "CONTACT",     href: "/#contact",     sectionId: "contact"    },
];

const SECTIONS = ["about","services","works","coding","networking","gallery","contact"];

const DEFAULT_BRAND = {
  logoText:  "K",
  brandName: "KHAIRULHUB",
  imageUrl:  "",
  showImage: false,
  imageOnly: false,
};

/* ── Visitor counter ── */
const useVisitors = () => {
  const [visitors, setVisitors] = useState(null);
  useEffect(() => {
    // const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
    const run = async () => {
      try {
        // 1. Track করো (same IP হলে backend ignore করবে)
        await fetch(`${API}/api/visitors/track`, { method: "POST" });

        // 2. Total count আনো
        const res = await fetch(`${API}/api/visitors/count`);
        const data = await res.json();
        if (!data.success) throw new Error("no data");

        // 3. Count-up animation
        const target = data.total;
        let n = 0;
        const id = setInterval(() => {
          n += Math.ceil((target - n) / 8);
          if (n >= target) { n = target; clearInterval(id); }
          setVisitors(n);
        }, 40);
      } catch {
        // Fallback: offline হলে localStorage থেকে দেখাও
        // const c = parseInt(localStorage.getItem("khairulhub_visits") || "0");
        // setVisitors(c);
          setVisitors(null);
      }
    };

    run();
  }, []);
  return visitors;
};

/* ── Live clock ── */
const useClock = () => {
  const [dt, setDt] = useState({ date: "", time: "" });
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setDt({
        date: n.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        time: n.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return dt;
};

/* ── Scroll-spy ── */
const useScrollSpy = (isHomePage) => {
  const [active, setActive] = useState(null);
  const compute = useCallback(() => {
    const threshold = window.innerHeight * 0.35;
    let best = null;
    let bestDist = Infinity;
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top <= threshold) {
        const dist = threshold - top;
        if (dist < bestDist) { bestDist = dist; best = id; }
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    if (!isHomePage) { setActive(null); return; }
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    return () => window.removeEventListener("scroll", compute);
  }, [isHomePage, compute]);

  return active;
};

const scrollTo = (sectionId) => {
  const el = document.getElementById(sectionId);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

/* ════════════════════════════════════════════════════════ */
const Navbar = () => {
  const [open,  setOpen]  = useState(false);
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const visitors     = useVisitors();
  const datetime     = useClock();
  const activeSection = useScrollSpy(isHome);

  // Fetch brand from DB
  useEffect(() => {
    getFooterBrand()
      .then((res) => { if (res.success && res.data) setBrand(res.data); })
      .catch(() => {});
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!isHome) return;
    const hash = window.location.hash.replace("#", "");
    if (hash) setTimeout(() => scrollTo(hash), 500);
  }, [isHome]);

  const isActive = (link) => {
    if (link.sectionId) return isHome && activeSection === link.sectionId;
    if (link.href === "/" && !link.sectionId) return isHome && activeSection === null;
    return pathname === link.href;
  };

  const handleClick = (e, link) => {
    setOpen(false);
    if (!link.sectionId) return;
    e.preventDefault();
    if (!isHome) { window.location.href = link.href; return; }
    scrollTo(link.sectionId);
    window.history.replaceState(null, "", link.href);
  };

  const linkStyle = (active) => ({
    padding: "5px 10px",
    fontSize: 11, letterSpacing: "1.5px",
    fontFamily: "'Share Tech Mono', monospace",
    color: active ? "#00e5ff" : "#2a4a6a",
    borderBottom: `2px solid ${active ? "#00e5ff" : "transparent"}`,
    textDecoration: "none", cursor: "pointer",
    transition: "color .2s, border-color .2s", display: "inline-block",
  });

  const mobileLinkStyle = (active) => ({
    display: "block", padding: "10px 12px",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, letterSpacing: "1.5px",
    color: active ? "#00e5ff" : "#2a4a6a",
    borderLeft: `2px solid ${active ? "#00e5ff" : "transparent"}`,
    textDecoration: "none", transition: "color .2s, border-color .2s",
  });

  /* ── Logo rendering (same logic as Footer) ── */
  const renderNavLogo = () => {
    // imageOnly → শুধু image, কোনো text নেই
    if (brand.imageOnly && brand.imageUrl) {
      return (
        <img
          src={brand.imageUrl}
          alt={brand.brandName || "Logo"}
          style={{ maxHeight: 38, maxWidth: 130, objectFit: "contain" }}
        />
      );
    }

    // showImage → circle এর জায়গায় image + brandName text
    const logoIcon = brand.showImage && brand.imageUrl ? (
      <img
        src={brand.imageUrl}
        alt={brand.logoText || "Logo"}
        style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid #00e5ff", flexShrink: 0 }}
      />
    ) : (
      <div style={{
        width: 34, height: 34, borderRadius: "50%",
        border: "2px solid #00e5ff", color: "#00e5ff",
        fontSize: 13, fontWeight: 900,
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "spin 8s linear infinite", flexShrink: 0,
      }}>
        {brand.logoText || "K"}
      </div>
    );

    return (
      <>
        {logoIcon}
        {brand.brandName || "KHAIRULHUB"}
      </>
    );
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(4,8,15,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,229,255,0.3)",
        height: 64,
      }}
    >
      {/* Scan line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg,transparent,#00e5ff,transparent)",
        animation: "navScan 4s ease-in-out infinite", opacity: 0.3,
      }} />

      <div className="flex items-center h-full px-5 gap-4">

        {/* ── Logo ── */}
        <a href="/"
          className="flex items-center gap-2.5 flex-shrink-0"
          style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: 16,
            fontWeight: 900, color: "#00e5ff", letterSpacing: 3, textDecoration: "none",
          }}
          onClick={(e) => { e.preventDefault(); window.location.href = "/"; }}
        >
          {renderNavLogo()}
        </a>

        {/* ── Desktop links ── */}
        <div className="hidden lg:flex flex-1 justify-center gap-0.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={linkStyle(isActive(link))}
              onClick={(e) => handleClick(e, link)}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ── HUD ── */}
        <div className="hidden lg:flex items-center gap-3.5 flex-shrink-0">
          <div className="text-center">
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: "#00e5ff", minWidth: 48 }}>
              {visitors != null ? visitors.toLocaleString() : "···"}
            </div>
            <div style={{ fontSize: 8, color: "#2a4a6a", letterSpacing: 2, fontFamily: "'Share Tech Mono', monospace" }}>
              VISITORS
            </div>
          </div>
          <div style={{ width: 1, height: 26, background: "rgba(0,229,255,0.12)" }} />
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
            style={{ border: "1px solid rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.05)" }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88", animation: "pulse 1.5s ease-in-out infinite" }} />
            <span style={{ fontSize: 10, color: "#00ff88", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>ONLINE</span>
          </div>
          <div style={{ width: 1, height: 26, background: "rgba(0,229,255,0.12)" }} />
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#6a9bbf", textAlign: "right", lineHeight: 1.6 }}>
            <div>{datetime.date}</div>
            <div>{datetime.time}</div>
          </div>
        </div>

        {/* ── Mobile toggle ── */}
        <button onClick={() => setOpen(!open)} className="lg:hidden ml-auto"
          style={{ background: "none", border: "none", color: "#6a9bbf", cursor: "pointer" }}
        >
          {open ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div style={{ background: "#04080f", borderBottom: "1px solid rgba(0,229,255,0.2)" }} className="lg:hidden px-5 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={mobileLinkStyle(isActive(link))}
              onClick={(e) => handleClick(e, link)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-4 px-3 pt-3 mt-2" style={{ borderTop: "1px solid rgba(0,229,255,0.1)" }}>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: "#00e5ff" }}>
                {visitors != null ? visitors.toLocaleString() : "···"}
              </div>
              <div style={{ fontSize: 8, color: "#2a4a6a", letterSpacing: 2, fontFamily: "'Share Tech Mono', monospace" }}>VISITORS</div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full" style={{ border: "1px solid rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.05)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", animation: "pulse 1.5s ease-in-out infinite" }} />
              <span style={{ fontSize: 10, color: "#00ff88", fontFamily: "'Share Tech Mono', monospace" }}>ONLINE</span>
            </div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#6a9bbf", lineHeight: 1.6 }}>
              <div>{datetime.date}</div>
              <div>{datetime.time}</div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;