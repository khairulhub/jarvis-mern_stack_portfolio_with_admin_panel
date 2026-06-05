import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getContactInfo, getFooterBrand } from "../../utils/api";

const navLinks = [
  { href: "/",           label: "HOME"  ,   sectionId: null   },
  { href: "/#about",      label: "ABOUT"  , sectionId: "about"    },
  { href: "/#services",   label: "SERVICES" ,sectionId: "services"   },
  { href: "/#works",      label: "WORKS" , sectionId: "works"      },
  { href: "/#coding",     label: "CODING" , sectionId: "coding"     },
  { href: "/#networking", label: "NETWORKING" , sectionId: "networking" },
  { href: "/#contact",    label: "CONTACT" , sectionId: "contact"    },
];

const DEFAULT_BRAND = {
  logoText:      "K",
  brandName:     "KHAIRULHUB",
  taglineText:   "Full Stack Developer & Network Engineer based in Dhaka, Bangladesh. Building robust apps & networks.",
  copyrightText: "© 2025 KhairulHub. All rights reserved.",
  imageUrl:      "",
  showImage:     false,
  imageOnly:     false,
};

const Footer = () => {
  const location = useLocation();
  const [info,  setInfo]  = useState(null);
  const [brand, setBrand] = useState(DEFAULT_BRAND);

  useEffect(() => {
    getContactInfo()
      .then((res) => setInfo(res.data))
      .catch(() => {});

    getFooterBrand()
      .then((res) => { if (res.success && res.data) setBrand(res.data); })
      .catch(() => {});
  }, []);

  const scrollToSection = (id) => {
  const el = document.getElementById(id);

  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 64;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }
};

const handleNavClick = (e, link) => {
  if (!link.sectionId) return;

  e.preventDefault();

  if (location.pathname !== "/") {
    window.location.href = link.href;
    return;
  }

  scrollToSection(link.sectionId);
};


  const socials = info
    ? [
        { icon: "ti-brand-github",   href: info.githubUrl,          label: info.github   },
        { icon: "ti-brand-linkedin", href: info.linkedinUrl,        label: info.linkedin  },
        { icon: "ti-mail",           href: `mailto:${info.email}`,  label: info.email     },
        { icon: "ti-map-pin",        href: "#",                     label: info.location  },
      ]
    : [
        { icon: "ti-brand-github",   href: "https://github.com/khairulhub",      label: "github.com/khairulhub"     },
        { icon: "ti-brand-linkedin", href: "https://linkedin.com/in/khairulhub", label: "linkedin.com/in/khairulhub" },
        { icon: "ti-mail",           href: "mailto:iubat21103033@gmail.com",      label: "iubat21103033@gmail.com"   },
        { icon: "ti-map-pin",        href: "#",                                   label: "Dhaka, Bangladesh"         },
      ];

  /* ── Logo rendering logic ── */
  const renderLogo = () => {
    // imageOnly = true → পুরো logo section এর বদলে শুধু image
    if (brand.imageOnly && brand.imageUrl) {
      return (
        <img
          src={brand.imageUrl}
          alt={brand.brandName || "Logo"}
          style={{ maxHeight: 44, maxWidth: 160, objectFit: "contain" }}
        />
      );
    }

    // showImage = true && imageUrl আছে → circle এর বদলে image, তারপর brandName
    const logoIcon = brand.showImage && brand.imageUrl ? (
      <img
        src={brand.imageUrl}
        alt={brand.logoText || "Logo"}
        style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #00e5ff", flexShrink: 0 }}
      />
    ) : (
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "2px solid #00e5ff", color: "#00e5ff",
          fontSize: 13, fontWeight: 900,
          fontFamily: "'Orbitron', sans-serif",
          animation: "spin 8s linear infinite",
        }}
      >
        {brand.logoText || "K"}
      </div>
    );

    return (
      <div className="flex items-center gap-2.5">
        {logoIcon}
        <span
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 16, fontWeight: 900,
            color: "#00e5ff", letterSpacing: 3,
          }}
        >
          {brand.brandName || "KHAIRULHUB"}
        </span>
      </div>
    );
  };

  return (
    <footer
      className="relative z-[2]"
      style={{ background: "#080e1a", borderTop: "1px solid rgba(0,229,255,0.1)" }}
    >
      {/* top glow line */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg,transparent,rgba(0,229,255,0.35),transparent)",
        }}
      />

      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-12">
        {/* ── 3-col grid → stacks on mobile ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* col 1 — brand */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            {/* logo */}
            {renderLogo()}

            {/* tagline */}
            <p
              className="text-center sm:text-left"
              style={{
                fontSize: 12, color: "#2a4a6a",
                fontFamily: "'Share Tech Mono', monospace",
                lineHeight: 1.8, maxWidth: 230,
              }}
            >
              {brand.taglineText}
            </p>

            {/* online badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{ border: "1px solid rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.05)" }}
            >
              <div
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#00ff88", boxShadow: "0 0 8px #00ff88",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: 9, color: "#00ff88",
                  fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1,
                }}
              >
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>

          {/* col 2 — nav links */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div
              style={{
                fontSize: 10, color: "#2a4a6a", letterSpacing: 3,
                fontFamily: "'Share Tech Mono', monospace", marginBottom: 8,
              }}
            >
              // NAVIGATE
            </div>
            {navLinks.map((link) => (
  <a
    key={link.href}
    href={link.href}
    onClick={(e) => handleNavClick(e, link)}
    className="no-underline transition-colors duration-200"
    style={{
      fontSize: 11,
      color: "#6a9bbf",
      fontFamily: "'Share Tech Mono', monospace",
      letterSpacing: 2,
      cursor: "pointer",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.color = "#00e5ff")}
    onMouseLeave={(e) => (e.currentTarget.style.color = "#6a9bbf")}
  >
    {link.label}
  </a>
))}
          </div>

          {/* col 3 — contact */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div
              style={{
                fontSize: 10, color: "#2a4a6a", letterSpacing: 3,
                fontFamily: "'Share Tech Mono', monospace", marginBottom: 8,
              }}
            >
              // CONNECT
            </div>
            {socials.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href && href.startsWith("http") ? "_blank" : undefined}
                rel={href && href.startsWith("http") ? "noreferrer" : undefined}
                className="flex items-center gap-2 no-underline transition-colors duration-200"
                style={{ fontSize: 11, color: "#6a9bbf", fontFamily: "'Share Tech Mono', monospace" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00e5ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6a9bbf")}
              >
                <i className={`ti ${icon}`} style={{ fontSize: 14, flexShrink: 0 }} />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: "rgba(0,229,255,0.07)", margin: "36px 0 24px" }} />

        {/* bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            style={{
              fontSize: 10, color: "#2a4a6a",
              fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1,
            }}
          >
            {brand.copyrightText}
          </p>

          <a
            href="#home"
            className="flex items-center gap-1.5 no-underline transition-colors duration-200"
            style={{ fontSize: 10, color: "#2a4a6a", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00e5ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#2a4a6a")}
          >
            <i className="ti ti-arrow-up-circle" style={{ fontSize: 15 }} />
            BACK TO TOP
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
