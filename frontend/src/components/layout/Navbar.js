// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

// const navLinks = [
//   { to: "/", label: "Home" },
//   { to: "/blog", label: "Blog" },
//   { to: "/team", label: "Team" },
// ];

// // ── Added: HUD right-side items ──────────────────────────────────────────────
// const useNavHUD = () => {
//   const [datetime, setDatetime] = useState({ date: "", time: "" });
//   const [visitors, setVisitors] = useState(0);

//   // Live clock
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

//   // Visitor counter with animated count-up
//   useEffect(() => {
//     let count = parseInt(localStorage.getItem("mernstack_visits") || "1247");
//     count++;
//     localStorage.setItem("mernstack_visits", count);
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
//   const [scrolled, setScrolled] = useState(false);
//   const { pathname } = useLocation();

//   // ── Added ──
//   const { datetime, visitors } = useNavHUD();

//   useEffect(() => {
//     const handler = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handler);
//     return () => window.removeEventListener("scroll", handler);
//   }, []);

//   useEffect(() => setOpen(false), [pathname]);

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-lg" : "bg-transparent"}`}>
//       <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
//         <Link to="/" className="flex items-center gap-2 font-bold text-white text-lg">
//           <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">M</div>
//           MERN<span className="text-blue-400">Stack</span>
//         </Link>

//         {/* Desktop links */}
//         <div className="hidden md:flex items-center gap-1">
//           {navLinks.map(({ to, label }) => (
//             <Link key={to} to={to}
//               className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
//                 ${pathname === to ? "text-white bg-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
//               {label}
//             </Link>
//           ))}
//           <Link to="/admin/login"
//             className="ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20">
//             Admin →
//           </Link>
//         </div>

//         {/* Mobile toggle */}
//         <button onClick={() => setOpen(!open)} className="md:hidden text-slate-400 hover:text-white">
//           {open ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
//         </button>
//       </div>

//       {/* Mobile menu */}
//       {open && (
//         <div className="md:hidden bg-slate-950 border-b border-slate-800 px-6 pb-4 space-y-1">
//           {navLinks.map(({ to, label }) => (
//             <Link key={to} to={to}
//               className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
//               {label}
//             </Link>
//           ))}
//           <Link to="/admin/login" className="block px-4 py-3 text-blue-400 text-sm font-medium hover:text-blue-300 transition-all">
//             Admin Panel →
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const navLinks = [
  { to: "/",           label: "HOME"       },
  { to: "/about",      label: "ABOUT"      },
  { to: "/services",   label: "SERVICES"   },
  { to: "/works",      label: "WORKS"      },
  { to: "/coding",     label: "CODING"     },
  { to: "/networking", label: "NETWORKING" },
  { to: "/blog",       label: "BLOG"       },
  { to: "/team",       label: "TEAM"       },
  { to: "/contact",    label: "CONTACT"    },
];

const useNavHUD = () => {
  const [datetime, setDatetime] = useState({ date: "", time: "" });
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setDatetime({
        date: now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        time: now.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let count = parseInt(localStorage.getItem("khairulhub_visits") || "1247");
    count++;
    localStorage.setItem("khairulhub_visits", count);
    let display = 0;
    const id = setInterval(() => {
      display += Math.ceil((count - display) / 10);
      if (display >= count) { display = count; clearInterval(id); }
      setVisitors(display);
    }, 50);
    return () => clearInterval(id);
  }, []);

  return { datetime, visitors };
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { datetime, visitors } = useNavHUD();

  useEffect(() => setOpen(false), [pathname]);

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

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline"
          style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 900, color: "#00e5ff", letterSpacing: 3 }}
        >
          <div className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 34, height: 34, borderRadius: "50%",
              border: "2px solid #00e5ff", color: "#00e5ff",
              fontSize: 13, fontWeight: 900,
              animation: "spin 8s linear infinite",
            }}
          >K</div>
          KHAIRULHUB
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex flex-1 justify-center gap-0.5">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className="no-underline transition-all duration-200"
              style={{
                padding: "5px 10px",
                fontSize: 11, letterSpacing: "1.5px",
                fontFamily: "'Share Tech Mono', monospace",
                color: pathname === to ? "#00e5ff" : "#2a4a6a",
                borderBottom: `2px solid ${pathname === to ? "#00e5ff" : "transparent"}`,
              }}
            >{label}</Link>
          ))}
        </div>

        {/* HUD */}
        <div className="hidden lg:flex items-center gap-3.5 flex-shrink-0">
          <div className="text-center">
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: "#00e5ff" }}>
              {visitors.toLocaleString()}
            </div>
            <div style={{ fontSize: 8, color: "#2a4a6a", letterSpacing: 2, fontFamily: "'Share Tech Mono', monospace" }}>
              VISITORS
            </div>
          </div>

          <div style={{ width: 1, height: 26, background: "rgba(0,229,255,0.12)" }} />

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
            style={{ border: "1px solid rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.05)" }}
          >
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#00ff88", boxShadow: "0 0 8px #00ff88",
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
            <span style={{ fontSize: 10, color: "#00ff88", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
              ONLINE
            </span>
          </div>

          <div style={{ width: 1, height: 26, background: "rgba(0,229,255,0.12)" }} />

          <div style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: 9,
            color: "#6a9bbf", textAlign: "right", lineHeight: 1.6,
          }}>
            <div>{datetime.date}</div>
            <div>{datetime.time}</div>
          </div>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)}
          className="lg:hidden ml-auto"
          style={{ background: "none", border: "none", color: "#6a9bbf", cursor: "pointer" }}
        >
          {open ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "#04080f", borderBottom: "1px solid rgba(0,229,255,0.2)" }}
          className="lg:hidden px-5 pb-4"
        >
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className="block no-underline transition-all"
              style={{
                padding: "10px 12px",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11, letterSpacing: "1.5px",
                color: pathname === to ? "#00e5ff" : "#2a4a6a",
                borderLeft: `2px solid ${pathname === to ? "#00e5ff" : "transparent"}`,
              }}
            >{label}</Link>
          ))}

          {/* Mobile HUD */}
          <div className="flex items-center gap-4 px-3 pt-3 mt-2"
            style={{ borderTop: "1px solid rgba(0,229,255,0.1)" }}
          >
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: "#00e5ff" }}>
                {visitors.toLocaleString()}
              </div>
              <div style={{ fontSize: 8, color: "#2a4a6a", letterSpacing: 2, fontFamily: "'Share Tech Mono', monospace" }}>
                VISITORS
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
              style={{ border: "1px solid rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.05)" }}
            >
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