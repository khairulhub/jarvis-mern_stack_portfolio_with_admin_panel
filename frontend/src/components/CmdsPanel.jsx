const commands = [
  {
    title: "Router Configure",
    tag: "NETWORK",
    tagStyle: {
      background: "rgba(250,204,21,0.08)",
      color: "#facc15",
      border: "1px solid rgba(250,204,21,0.25)",
    },
    code: `Router> enable\nRouter# configure terminal\nRouter(config)# hostname R1\nRouter(config)# int fa0/0\nRouter(config-if)# ip address 192.168.1.1 255.255.255.0\nRouter(config-if)# no shutdown`,
  },
  {
    title: "React Component",
    tag: "MERN",
    tagStyle: {
      background: "rgba(0,229,255,0.08)",
      color: "#38bdf8",
      border: "1px solid rgba(56,189,248,0.25)",
    },
    code: `import React, { useState } from 'react';\n\nconst LoginForm = () => {\n  const [email, setEmail] = useState('');\n  return (\n    <form className="login-form">\n      <input type="email"\n        value={email}\n        onChange={e => setEmail(e.target.value)}\n      />\n    </form>\n  );\n};`,
  },
  {
    title: "Laravel API Route",
    tag: "LARAVEL",
    tagStyle: {
      background: "rgba(168,85,247,0.08)",
      color: "#c084fc",
      border: "1px solid rgba(168,85,247,0.25)",
    },
    code: `Route::middleware('auth:sanctum')\n  ->prefix('api/v1')\n  ->group(function () {\n    Route::apiResource('users', UserController::class);\n    Route::post('/login', [AuthController::class, 'login']);\n});`,
  },
  {
    title: "VLAN Switch Config",
    tag: "NETWORK",
    tagStyle: {
      background: "rgba(250,204,21,0.08)",
      color: "#facc15",
      border: "1px solid rgba(250,204,21,0.25)",
    },
    code: `Switch> enable\nSwitch# vlan database\nSwitch(vlan)# vlan 10 name SALES\nSwitch(vlan)# vlan 20 name IT\nSwitch# conf t\nSwitch(config)# int fa0/1\nSwitch(config-if)# switchport mode access\nSwitch(config-if)# switchport access vlan 10`,
  },
];

export default function CmdsPanel({ open, onClose }) {
  return (
    <>
      {/* dark backdrop — mobile only */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[490] lg:hidden transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.55)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* sidebar panel */}
      <div
        className="fixed top-16 bottom-0 right-0 z-[500] flex flex-col transition-transform duration-300"
        style={{
          width: "min(280px, 88vw)",
          background: "rgba(4,8,15,0.97)",
          borderLeft: "1px solid rgba(0,229,255,0.12)",
          backdropFilter: "blur(20px)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* header */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid rgba(0,229,255,0.1)",
          }}
        >
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 10,
              letterSpacing: 3,
              color: "#2a4a6a",
            }}
          >
            RECENT COMMANDS
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#2a4a6a",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00e5ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#2a4a6a")}
          >
            <i className="ti ti-x" />
          </button>
        </div>

        {/* scrollable list */}
        <div
          className="flex-1 overflow-y-auto flex flex-col gap-2"
          style={{ padding: 10 }}
        >
          {commands.map((cmd, i) => (
            <div
              key={i}
              className="rounded-lg transition-all duration-200 cursor-pointer"
              style={{
                background: "#0c1422",
                border: "1px solid rgba(0,229,255,0.08)",
                padding: 10,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(0,229,255,0.28)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(0,229,255,0.08)")
              }
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#c8e8f8",
                  marginBottom: 6,
                  fontFamily: "'Exo 2', sans-serif",
                }}
              >
                {cmd.title}
              </div>

              <div
                style={{
                  background: "#020408",
                  border: "1px solid rgba(0,229,255,0.06)",
                  borderRadius: 4,
                  padding: "8px 10px",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 10,
                  color: "#00b8cc",
                  whiteSpace: "pre-wrap",
                  maxHeight: 80,
                  overflowY: "auto",
                  lineHeight: 1.6,
                }}
              >
                {cmd.code}
              </div>

              <span
                style={{
                  display: "inline-block",
                  marginTop: 6,
                  padding: "1px 8px",
                  borderRadius: 10,
                  fontSize: 9,
                  fontFamily: "'Share Tech Mono', monospace",
                  ...cmd.tagStyle,
                }}
              >
                {cmd.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}