import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

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

// All section IDs in page order (must match Home.js render order)
const SECTIONS = ["about","services","works","coding","networking","gallery","contact"];

/* ── Visitor counter (real backend, localStorage fallback) ── */
const useVisitors = () => {
  const [visitors, setVisitors] = useState(null);

  useEffect(() => {
    const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

    fetch(`${API}/api/visitors/track`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        const target = data.totalVisitors;
        if (!target) throw new Error("no data");
        let n = 0;
        const id = setInterval(() => {
          n += Math.ceil((target - n) / 8);
          if (n >= target) { n = target; clearInterval(id); }
          setVisitors(n);
        }, 40);
      })
      .catch(() => {
        // Fallback: localStorage
        let c = parseInt(localStorage.getItem("khairulhub_visits") || "1247");
        c++;
        localStorage.setItem("khairulhub_visits", String(c));
        setVisitors(c);
      });
  }, []); // run once on mount

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

/* ── Scroll-spy: returns the id of the section whose top is
      closest to (and above) 30% down the viewport ── */
const useScrollSpy = (isHomePage) => {
  const [active, setActive] = useState(null);

  const compute = useCallback(() => {
    const threshold = window.innerHeight * 0.35; // 35% from top
    let best = null;
    let bestDist = Infinity;

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      // Section is "active" once its top has passed the threshold line
      if (top <= threshold) {
        const dist = threshold - top; // how far past the line
        if (dist < bestDist) { bestDist = dist; best = id; }
      }
    });

    setActive(best);
  }, []);

  useEffect(() => {
    if (!isHomePage) { setActive(null); return; }

    compute(); // run immediately in case page loaded mid-scroll
    window.addEventListener("scroll", compute, { passive: true });
    return () => window.removeEventListener("scroll", compute);
  }, [isHomePage, compute]);

  return active;
};

/* ── Smooth-scroll to a section, works from any page ── */
const scrollTo = (sectionId) => {
  const el = document.getElementById(sectionId);
  if (el) {
    const navH = 64;
    const top = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

/* ════════════════════════════════════════════════════════ */
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const visitors  = useVisitors();
  const datetime  = useClock();
  const activeSection = useScrollSpy(isHome);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // On first load with a hash, scroll to target
  useEffect(() => {
    if (!isHome) return;
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => scrollTo(hash), 500);
    }
  }, [isHome]);

  /* Determine if a nav link should be highlighted */
  const isActive = (link) => {
    if (link.sectionId) {
      // HOME should deactivate once any section scrolls in
      return isHome && activeSection === link.sectionId;
    }
    if (link.href === "/" && !link.sectionId) {
      // HOME active only when on "/" AND no section is scrolled yet
      return isHome && activeSection === null;
    }
    return pathname === link.href;
  };

  /* Handle click */
  const handleClick = (e, link) => {
    setOpen(false);
    if (!link.sectionId) return; // normal <a> navigation

    e.preventDefault();
    if (!isHome) {
      // Go home, then scroll after load
      window.location.href = link.href;
      return;
    }
    scrollTo(link.sectionId);
    window.history.replaceState(null, "", link.href);
  };

  /* ── styles ── */
  const linkStyle = (active) => ({
    padding: "5px 10px",
    fontSize: 11,
    letterSpacing: "1.5px",
    fontFamily: "'Share Tech Mono', monospace",
    color: active ? "#00e5ff" : "#2a4a6a",
    borderBottom: `2px solid ${active ? "#00e5ff" : "transparent"}`,
    textDecoration: "none",
    cursor: "pointer",
    transition: "color .2s, border-color .2s",
    display: "inline-block",
  });

  const mobileLinkStyle = (active) => ({
    display: "block",
    padding: "10px 12px",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11,
    letterSpacing: "1.5px",
    color: active ? "#00e5ff" : "#2a4a6a",
    borderLeft: `2px solid ${active ? "#00e5ff" : "transparent"}`,
    textDecoration: "none",
    transition: "color .2s, border-color .2s",
  });

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
          style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 900, color: "#00e5ff", letterSpacing: 3, textDecoration: "none" }}
          onClick={(e) => { e.preventDefault(); window.location.href = "/"; }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            border: "2px solid #00e5ff", color: "#00e5ff",
            fontSize: 13, fontWeight: 900,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "spin 8s linear infinite", flexShrink: 0,
          }}>K</div>
          KHAIRULHUB
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

          {/* Visitors */}
          <div className="text-center">
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: "#00e5ff", minWidth: 48 }}>
              {visitors != null ? visitors.toLocaleString() : "···"}
            </div>
            <div style={{ fontSize: 8, color: "#2a4a6a", letterSpacing: 2, fontFamily: "'Share Tech Mono', monospace" }}>
              VISITORS
            </div>
          </div>

          <div style={{ width: 1, height: 26, background: "rgba(0,229,255,0.12)" }} />

          {/* Online badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
            style={{ border: "1px solid rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.05)" }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88", animation: "pulse 1.5s ease-in-out infinite" }} />
            <span style={{ fontSize: 10, color: "#00ff88", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>ONLINE</span>
          </div>

          <div style={{ width: 1, height: 26, background: "rgba(0,229,255,0.12)" }} />

          {/* Clock */}
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
          {/* Mobile HUD */}
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




// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

// const navLinks = [
//   { to: "/",           label: "HOME"       },
//   { to: "/about",      label: "ABOUT"      },
//   { to: "/services",   label: "SERVICES"   },
//   { to: "/works",      label: "WORKS"      },
//   { to: "/coding",     label: "CODING"     },
//   { to: "/networking", label: "NETWORKING" },
//   { to: "/blog",       label: "BLOG"       },
//   { to: "/team",       label: "TEAM"       },
//   { to: "/contact",    label: "CONTACT"    },
// ];

// const useNavHUD = () => {
//   const [datetime, setDatetime] = useState({ date: "", time: "" });
//   const [visitors, setVisitors] = useState(0);

//   useEffect(() => {
//     const tick = () => {
//       const now = new Date();
//       setDatetime({
//         date: now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
//         time: now.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
//       });
//     };
//     tick();
//     const id = setInterval(tick, 1000);
//     return () => clearInterval(id);
//   }, []);

//   useEffect(() => {
//     let count = parseInt(localStorage.getItem("khairulhub_visits") || "1247");
//     count++;
//     localStorage.setItem("khairulhub_visits", count);
//     let display = 0;
//     const id = setInterval(() => {
//       display += Math.ceil((count - display) / 10);
//       if (display >= count) { display = count; clearInterval(id); }
//       setVisitors(display);
//     }, 50);
//     return () => clearInterval(id);
//   }, []);

//   return { datetime, visitors };
// };

// const Navbar = () => {
//   const [open, setOpen] = useState(false);
//   const { pathname } = useLocation();
//   const { datetime, visitors } = useNavHUD();

//   useEffect(() => setOpen(false), [pathname]);

//   return (
//     <nav
//       className="fixed top-0 left-0 right-0 z-50"
//       style={{
//         background: "rgba(4,8,15,0.95)",
//         backdropFilter: "blur(20px)",
//         borderBottom: "1px solid rgba(0,229,255,0.3)",
//         height: 64,
//       }}
//     >
//       {/* Scan line */}
//       <div style={{
//         position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
//         background: "linear-gradient(90deg,transparent,#00e5ff,transparent)",
//         animation: "navScan 4s ease-in-out infinite", opacity: 0.3,
//       }} />

//       <div className="flex items-center h-full px-5 gap-4">

//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline"
//           style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 900, color: "#00e5ff", letterSpacing: 3 }}
//         >
//           <div className="flex items-center justify-center flex-shrink-0"
//             style={{
//               width: 34, height: 34, borderRadius: "50%",
//               border: "2px solid #00e5ff", color: "#00e5ff",
//               fontSize: 13, fontWeight: 900,
//               animation: "spin 8s linear infinite",
//             }}
//           >K</div>
//           KHAIRULHUB
//         </Link>

//         {/* Desktop links */}
//         <div className="hidden lg:flex flex-1 justify-center gap-0.5">
//           {navLinks.map(({ to, label }) => (
//             <Link key={to} to={to}
//               className="no-underline transition-all duration-200"
//               style={{
//                 padding: "5px 10px",
//                 fontSize: 11, letterSpacing: "1.5px",
//                 fontFamily: "'Share Tech Mono', monospace",
//                 color: pathname === to ? "#00e5ff" : "#2a4a6a",
//                 borderBottom: `2px solid ${pathname === to ? "#00e5ff" : "transparent"}`,
//               }}
//             >{label}</Link>
//           ))}
//         </div>

//         {/* HUD */}
//         <div className="hidden lg:flex items-center gap-3.5 flex-shrink-0">
//           <div className="text-center">
//             <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: "#00e5ff" }}>
//               {visitors.toLocaleString()}
//             </div>
//             <div style={{ fontSize: 8, color: "#2a4a6a", letterSpacing: 2, fontFamily: "'Share Tech Mono', monospace" }}>
//               VISITORS
//             </div>
//           </div>

//           <div style={{ width: 1, height: 26, background: "rgba(0,229,255,0.12)" }} />

//           <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
//             style={{ border: "1px solid rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.05)" }}
//           >
//             <div style={{
//               width: 6, height: 6, borderRadius: "50%",
//               background: "#00ff88", boxShadow: "0 0 8px #00ff88",
//               animation: "pulse 1.5s ease-in-out infinite",
//             }} />
//             <span style={{ fontSize: 10, color: "#00ff88", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
//               ONLINE
//             </span>
//           </div>

//           <div style={{ width: 1, height: 26, background: "rgba(0,229,255,0.12)" }} />

//           <div style={{
//             fontFamily: "'Share Tech Mono', monospace", fontSize: 9,
//             color: "#6a9bbf", textAlign: "right", lineHeight: 1.6,
//           }}>
//             <div>{datetime.date}</div>
//             <div>{datetime.time}</div>
//           </div>
//         </div>

//         {/* Mobile toggle */}
//         <button onClick={() => setOpen(!open)}
//           className="lg:hidden ml-auto"
//           style={{ background: "none", border: "none", color: "#6a9bbf", cursor: "pointer" }}
//         >
//           {open ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
//         </button>
//       </div>

//       {/* Mobile menu */}
//       {open && (
//         <div style={{ background: "#04080f", borderBottom: "1px solid rgba(0,229,255,0.2)" }}
//           className="lg:hidden px-5 pb-4"
//         >
//           {navLinks.map(({ to, label }) => (
//             <Link key={to} to={to}
//               className="block no-underline transition-all"
//               style={{
//                 padding: "10px 12px",
//                 fontFamily: "'Share Tech Mono', monospace",
//                 fontSize: 11, letterSpacing: "1.5px",
//                 color: pathname === to ? "#00e5ff" : "#2a4a6a",
//                 borderLeft: `2px solid ${pathname === to ? "#00e5ff" : "transparent"}`,
//               }}
//             >{label}</Link>
//           ))}

//           {/* Mobile HUD */}
//           <div className="flex items-center gap-4 px-3 pt-3 mt-2"
//             style={{ borderTop: "1px solid rgba(0,229,255,0.1)" }}
//           >
//             <div>
//               <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: "#00e5ff" }}>
//                 {visitors.toLocaleString()}
//               </div>
//               <div style={{ fontSize: 8, color: "#2a4a6a", letterSpacing: 2, fontFamily: "'Share Tech Mono', monospace" }}>
//                 VISITORS
//               </div>
//             </div>
//             <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
//               style={{ border: "1px solid rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.05)" }}
//             >
//               <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", animation: "pulse 1.5s ease-in-out infinite" }} />
//               <span style={{ fontSize: 10, color: "#00ff88", fontFamily: "'Share Tech Mono', monospace" }}>ONLINE</span>
//             </div>
//             <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#6a9bbf", lineHeight: 1.6 }}>
//               <div>{datetime.date}</div>
//               <div>{datetime.time}</div>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;