import { useState, useEffect, useRef } from "react";
import { getCodings } from "../../utils/api";

/* ══════════════════════════════════════════════════════════
   SYNTAX HIGHLIGHT  (lightweight, no external lib)
══════════════════════════════════════════════════════════ */
const KEYWORDS_JS  = /\b(const|let|var|function|return|async|await|import|export|default|from|if|else|try|catch|new|class|extends|this|null|true|false|undefined|require|module)\b/g;
const KEYWORDS_PHP = /\b(public|private|protected|function|return|class|new|use|namespace|if|else|foreach|echo|true|false|null|static|extends|implements|abstract)\b/g;
const STRINGS      = /(["`'])(?:(?!\1)[^\\]|\\.)*\1/g;
const COMMENTS     = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/#?|#[^\n]*)/g;
const NUMBERS      = /\b(\d+)\b/g;

function highlight(code, lang) {
  let h = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const wrap = (cls, s) => `<span style="color:${cls}">${s}</span>`;

  h = h.replace(COMMENTS, (m) => wrap("#546e7a", m));
  h = h.replace(STRINGS,  (m) => wrap("#a5d6a7", m));
  if (lang === "js" || lang === "ts")
    h = h.replace(KEYWORDS_JS, (m) => wrap("#80cbc4", m));
  if (lang === "php")
    h = h.replace(KEYWORDS_PHP, (m) => wrap("#80cbc4", m));
  h = h.replace(NUMBERS, (m) => wrap("#ffcc80", m));

  return h;
}

/* ══════════════════════════════════════════════════════════
   COPY BUTTON
══════════════════════════════════════════════════════════ */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={copy}
      title="Copy code"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 12px",
        borderRadius: 6,
        background: copied ? "rgba(0,255,136,0.12)" : "rgba(0,229,255,0.08)",
        border: `1px solid ${copied ? "rgba(0,255,136,0.3)" : "rgba(0,229,255,0.2)"}`,
        color: copied ? "#00ff88" : "#00e5ff",
        fontSize: 11,
        cursor: "pointer",
        fontFamily: "'Share Tech Mono', monospace",
        letterSpacing: 1,
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} style={{ fontSize: 13 }} />
      {copied ? "COPIED!" : "COPY"}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   MODAL
   card shape from DB: { icon, title, color, colorBg,
   colorBorder, shortDesc, tags[], codes[{tag,label,lang,snippet}] }
══════════════════════════════════════════════════════════ */
function CodeModal({ card, onClose }) {
  const [activeTag, setActiveTag] = useState(card.tags[0]);

  /* lock scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Find the code entry for the active tag
  const tagData = card.codes?.find((c) => c.tag === activeTag) || {
    label: activeTag,
    lang: "js",
    snippet: "// No code snippet available for this tag.",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "12px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "min(860px, 96vw)",
          maxHeight: "94vh",
          background: "#080e1a",
          border: `1px solid ${card.colorBorder}`,
          borderRadius: 14,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: `0 0 60px ${card.colorBg}`,
        }}
      >
        {/* ── modal header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid rgba(0,229,255,0.1)",
          background: "#04080f",
          flexShrink: 0,
          flexWrap: "wrap",
          gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: card.colorBg, border: `1px solid ${card.colorBorder}`,
              color: card.color, fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className={`ti ${card.icon}`} />
            </div>
            <div>
              <div style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 13, fontWeight: 700,
                color: card.color, letterSpacing: 2,
              }}>
                {card.title}
              </div>
              <div style={{
                fontSize: 11, color: "#6a9bbf",
                fontFamily: "'Share Tech Mono', monospace",
              }}>
                {tagData.label}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none",
              color: "#2a4a6a", cursor: "pointer", fontSize: 22, lineHeight: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00e5ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#2a4a6a")}
          >
            <i className="ti ti-x" />
          </button>
        </div>

        {/* ── tag strip ── */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 6,
          padding: "12px 16px",
          borderBottom: "1px solid rgba(0,229,255,0.08)",
          background: "#04080f",
          flexShrink: 0,
        }}>
          {card.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                padding: "5px 13px",
                borderRadius: 999,
                background: activeTag === tag ? card.colorBg : "transparent",
                border: `1px solid ${activeTag === tag ? card.colorBorder : "rgba(0,229,255,0.12)"}`,
                color: activeTag === tag ? card.color : "#6a9bbf",
                fontSize: 11,
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: 1,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* ── code area ── */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
          {/* code header bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 16px",
            background: "#0a1520",
            borderBottom: "1px solid rgba(0,229,255,0.06)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#ff5f57","#febc2e","#28c840"].map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
              <span style={{
                marginLeft: 8,
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 10, color: "#2a4a6a", letterSpacing: 2,
              }}>
                {tagData.lang?.toUpperCase() || "JS"}
              </span>
            </div>
            <CopyButton text={tagData.snippet} />
          </div>

          {/* code block */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "auto", padding: "16px 20px" }}>
            <pre
              style={{
                fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                fontSize: 13,
                lineHeight: 1.75,
                color: "#c8e8f8",
                margin: 0,
                whiteSpace: "pre",
                minWidth: "max-content",
              }}
              dangerouslySetInnerHTML={{
                __html: highlight(tagData.snippet || "", tagData.lang || "js"),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SKELETON CARD — loading placeholder
══════════════════════════════════════════════════════════ */
function SkeletonCard() {
  return (
    <div style={{
      background: "#0c1422",
      border: "1px solid rgba(0,229,255,0.1)",
      borderRadius: 12,
      padding: 20,
      animationName: "pulse",
      animationDuration: "1.5s",
      animationIterationCount: "infinite",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(0,229,255,0.06)" }} />
        <div>
          <div style={{ width: 120, height: 10, borderRadius: 4, background: "rgba(0,229,255,0.06)", marginBottom: 6 }} />
          <div style={{ width: 60, height: 8, borderRadius: 4, background: "rgba(0,229,255,0.04)" }} />
        </div>
      </div>
      <div style={{ width: "100%", height: 8, borderRadius: 4, background: "rgba(0,229,255,0.04)", marginBottom: 6 }} />
      <div style={{ width: "80%", height: 8, borderRadius: 4, background: "rgba(0,229,255,0.04)", marginBottom: 14 }} />
      <div style={{ display: "flex", gap: 5 }}>
        {[60, 50, 70, 55].map((w, i) => (
          <div key={i} style={{ width: w, height: 18, borderRadius: 999, background: "rgba(0,229,255,0.04)" }} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CODING SECTION — DB connected, shows latest 6
══════════════════════════════════════════════════════════ */
const Coding = () => {
  const [cards,    setCards]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [openCard, setOpenCard] = useState(null);
  const fadeRef = useRef(null);

  /* ── fetch from API ── */
  useEffect(() => {
    (async () => {
      try {
        const data = await getCodings();
        // data.data is the array; slice to max 6
        setCards((data.data || []).slice(0, 6));
      } catch (err) {
        console.error("Coding fetch error:", err);
        setCards([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── intersection observer for fade-in ── */
  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("fade-visible");
        }),
      { threshold: 0.08 }
    );
    const els = fadeRef.current?.querySelectorAll(".fade-in");
    els?.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  return (
    <>
      {openCard && (
        <CodeModal card={openCard} onClose={() => setOpenCard(null)} />
      )}

      <section
        id="coding"
        style={{ background: "#080e1a", padding: "80px 0 60px" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>

          {/* section header */}
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10, letterSpacing: 3,
            color: "#2a4a6a", marginBottom: 10,
          }}>
            // CODE_REFERENCE.JS
          </div>
          <div style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 26, fontWeight: 700,
            color: "#00e5ff", letterSpacing: 4, marginBottom: 8,
          }}>
            CODING REFERENCE
          </div>
          <div style={{
            width: 60, height: 2,
            background: "linear-gradient(90deg,#00e5ff,transparent)",
            marginBottom: 10,
          }} />
          <p style={{
            fontSize: 13, color: "#6a9bbf",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: 1, marginBottom: 40,
          }}>
            // Click any card to explore setup guides &amp; copy-ready code snippets
          </p>

          {/* grid */}
          <div
            ref={fadeRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
              gap: 18,
            }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : cards.length === 0
              ? (
                <div style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#2a4a6a",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 13,
                  letterSpacing: 2,
                }}>
                  // NO_CODING_CARDS_FOUND
                </div>
              )
              : cards.map((card, i) => (
                <div
                  key={card._id || card.id}
                  className="fade-in"
                  onClick={() => setOpenCard(card)}
                  style={{
                    background: "#0c1422",
                    border: `1px solid ${card.colorBorder}`,
                    borderRadius: 12,
                    padding: 20,
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                    animationDelay: `${i * 0.07}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 8px 32px ${card.colorBg}`;
                    e.currentTarget.style.borderColor = card.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = card.colorBorder;
                  }}
                >
                  {/* top accent line */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, ${card.color}, transparent)`,
                  }} />

                  {/* icon + title row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10,
                      background: card.colorBg, border: `1px solid ${card.colorBorder}`,
                      color: card.color, fontSize: 20,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <i className={`ti ${card.icon}`} />
                    </div>
                    <div>
                      <div style={{
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: 12, fontWeight: 700,
                        color: card.color, letterSpacing: 2,
                      }}>
                        {card.title}
                      </div>
                      <div style={{
                        fontSize: 9, color: "#2a4a6a",
                        fontFamily: "'Share Tech Mono', monospace",
                        letterSpacing: 1, marginTop: 2,
                      }}>
                        {card.tags?.length || 0} TOPICS
                      </div>
                    </div>
                  </div>

                  {/* description */}
                  <p style={{
                    fontSize: 12, color: "#6a9bbf",
                    lineHeight: 1.7, marginBottom: 14,
                  }}>
                    {card.shortDesc}
                  </p>

                  {/* tag pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                    {card.tags?.map((t) => (
                      <span key={t} style={{
                        padding: "2px 9px", borderRadius: 999,
                        background: card.colorBg,
                        border: `1px solid ${card.colorBorder}`,
                        color: card.color,
                        fontSize: 9,
                        fontFamily: "'Share Tech Mono', monospace",
                        letterSpacing: 0.5,
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* footer */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: 12,
                    borderTop: "1px solid rgba(0,229,255,0.06)",
                  }}>
                    <span style={{
                      fontSize: 10, color: "#2a4a6a",
                      fontFamily: "'Share Tech Mono', monospace",
                      letterSpacing: 1,
                    }}>
                      // CLICK TO EXPLORE
                    </span>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: 10, color: card.color,
                      fontFamily: "'Share Tech Mono', monospace",
                    }}>
                      <span>VIEW CODE</span>
                      <i className="ti ti-arrow-right" style={{ fontSize: 13 }} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Coding;
