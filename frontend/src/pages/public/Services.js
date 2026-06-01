import { useEffect, useRef } from "react";

const services = [
  {
    icon: "ti-brand-react",
    title: "MERN STACK DEV",
    desc: "Full-stack web development using MongoDB, Express.js, React.js, and Node.js. Building scalable SPAs and REST APIs.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    color: "#38bdf8",
    colorBg: "rgba(56,189,248,0.08)",
    colorBorder: "rgba(56,189,248,0.25)",
  },
  {
    icon: "ti-brand-php",
    title: "PHP / LARAVEL",
    desc: "Robust backend development with PHP and Laravel framework. REST APIs, authentication, database design, and more.",
    tags: ["Laravel", "MySQL", "Eloquent", "Blade"],
    color: "#c084fc",
    colorBg: "rgba(168,85,247,0.08)",
    colorBorder: "rgba(168,85,247,0.25)",
  },
  {
    icon: "ti-brand-windows",
    title: ".NET DEVELOPMENT",
    desc: "Enterprise applications with C# and .NET. Web APIs, MVC applications, Entity Framework, and Azure integration.",
    tags: ["C#", "ASP.NET", "EF Core", "Azure"],
    color: "#ffa040",
    colorBg: "rgba(255,140,0,0.08)",
    colorBorder: "rgba(255,140,0,0.25)",
  },
  {
    icon: "ti-network",
    title: "NETWORK DESIGN",
    desc: "Enterprise network design and configuration. Router/Switch setup, VLAN segmentation, and network topology planning.",
    tags: ["Cisco", "VLAN", "Routing", "Topology"],
    color: "#facc15",
    colorBg: "rgba(250,204,21,0.08)",
    colorBorder: "rgba(250,204,21,0.25)",
  },
  {
    icon: "ti-shield-lock",
    title: "NETWORK SECURITY",
    desc: "Firewall configuration, ACL management, VPN setup, and security hardening for enterprise network environments.",
    tags: ["Firewall", "ACL", "VPN", "IDS/IPS"],
    color: "#f87171",
    colorBg: "rgba(239,68,68,0.08)",
    colorBorder: "rgba(239,68,68,0.25)",
  },
  {
    icon: "ti-device-desktop-analytics",
    title: "UI/UX DESIGN",
    desc: "Modern, responsive UI design with attention to user experience. Figma prototyping to production-ready interfaces.",
    tags: ["Figma", "Tailwind", "SCSS", "Responsive"],
    color: "#00e5ff",
    colorBg: "rgba(0,229,255,0.08)",
    colorBorder: "rgba(0,229,255,0.25)",
  },
];

 const Services=() => {
  const gridRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("fade-visible");
        }),
      { threshold: 0.1 }
    );
    const cards = gridRef.current?.querySelectorAll(".srv-card");
    cards?.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="services"
      className="relative z-[2]"
      style={{ padding: "80px 0 60px", background: "#04080f" }}
    >
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8">

        {/* ── section header ── */}
        <div
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10,
            letterSpacing: 3,
            color: "#2a4a6a",
            marginBottom: 10,
          }}
        >
          // SERVICES.ARRAY
        </div>

        <div
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: "#00e5ff",
            letterSpacing: 4,
            marginBottom: 8,
          }}
        >
          SERVICES
        </div>

        <div
          style={{
            width: 60,
            height: 2,
            background: "linear-gradient(90deg,#00e5ff,transparent)",
            marginBottom: 40,
          }}
        />

        {/* ── cards grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {services.map((s, i) => (
            <div
              key={s.title}
              className="srv-card fade-in relative rounded-xl overflow-hidden transition-all duration-300 group"
              style={{
                background: "#0c1422",
                border: "1px solid rgba(0,229,255,0.1)",
                padding: 24,
                transitionDelay: `${i * 0.08}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = s.colorBorder;
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = `0 8px 30px ${s.colorBg}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,229,255,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* top sweep line — animates on hover via CSS */}
              <div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: 2,
                  background: `linear-gradient(90deg,transparent,${s.color},transparent)`,
                  transform: "translateX(-100%)",
                  transition: "transform 0.45s ease",
                }}
                ref={(el) => {
                  if (!el) return;
                  const parent = el.closest(".srv-card");
                  parent.addEventListener("mouseenter", () => (el.style.transform = "translateX(100%)"));
                  parent.addEventListener("mouseleave", () => (el.style.transform = "translateX(-100%)"));
                }}
              />

              {/* icon */}
              <div
                className="flex items-center justify-center mb-4"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: s.colorBg,
                  border: `1px solid ${s.colorBorder}`,
                  color: s.color,
                  fontSize: 26,
                  transition: "transform 0.3s",
                }}
                ref={(el) => {
                  if (!el) return;
                  const parent = el.closest(".srv-card");
                  parent.addEventListener("mouseenter", () => (el.style.transform = "scale(1.1) rotate(5deg)"));
                  parent.addEventListener("mouseleave", () => (el.style.transform = "scale(1) rotate(0deg)"));
                }}
              >
                <i className={`ti ${s.icon}`} />
              </div>

              {/* title */}
              <div
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#c8e8f8",
                  letterSpacing: 2,
                  marginBottom: 10,
                }}
              >
                {s.title}
              </div>

              {/* desc */}
              <p
                style={{
                  fontSize: 12,
                  color: "#6a9bbf",
                  lineHeight: 1.75,
                  marginBottom: 16,
                  flexGrow: 1,
                }}
              >
                {s.desc}
              </p>

              {/* divider */}
              <div
                style={{
                  height: 1,
                  background: "rgba(0,229,255,0.07)",
                  marginBottom: 14,
                }}
              />

              {/* tags */}
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full"
                    style={{
                      fontSize: 9,
                      color: s.color,
                      background: s.colorBg,
                      border: `1px solid ${s.colorBorder}`,
                      fontFamily: "'Share Tech Mono', monospace",
                      letterSpacing: 1,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* bottom-right index label */}
              <div
                className="absolute bottom-3 right-4"
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 10,
                  color: "rgba(0,229,255,0.08)",
                  fontWeight: 700,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;