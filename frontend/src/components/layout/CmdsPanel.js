import React from "react";

const CmdsPanel = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        top: 80,
        zIndex: 1000,
        width: 260,
        background: "#0c1422",
        border: "1px solid rgba(0,229,255,0.15)",
        borderRadius: 8,
        padding: 12,
        color: "#00e5ff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <strong>Commands</strong>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#6a9bbf", cursor: "pointer" }}>
          Close
        </button>
      </div>
      <div style={{ color: "#6a9bbf" }}>No recent commands</div>
    </div>
  );
};

export default CmdsPanel;
