import { useEffect, useRef, useState } from "react";
import { getPublicServices } from "../../utils/api";

// Default fallback — DB connect না হলে এই 1টা দেখাবে
const DEFAULT_SERVICES = [
  {
    _id: "default_svc_1",
    icon: "ti-brand-react",
    title: "MERN STACK DEV",
    desc: "Full-stack web development using MongoDB, Express.js, React.js, and Node.js. Building scalable SPAs and REST APIs.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    color: "#38bdf8",
    colorBg: "rgba(56,189,248,0.08)",
    colorBorder: "rgba(56,189,248,0.25)",
  },
];

const Services = () => {
  const gridRef = useRef(null);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [loading, setLoading]   = useState(true);

  // ── Load from DB ──────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPublicServices();
        if (res.success && res.data.length > 0) {
          setServices(res.data);
        }
        // যদি DB empty বা error হয় → DEFAULT_SERVICES ই থাকবে (useState এর initial value)
      } catch {
        // silently fall back to default
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Intersection observer for fade-in ─────────────────────────
  useEffect(() => {
    if (loading) return;
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
  }, [loading, services]);

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

        {/* ── loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-xl"
                style={{
                  background: "#0c1422",
                  border: "1px solid rgba(0,229,255,0.1)",
                  padding: 24,
                  height: 220,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        )}

        {/* ── cards grid ── */}
        {!loading && (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {services.map((s, i) => (
              <div
                key={s._id || s.title}
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
                {/* top sweep line */}
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
                  {(s.tags || []).map((tag) => (
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
        )}
      </div>
    </section>
  );
};

export default Services;