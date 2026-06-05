// components/VisitorCounter.jsx
// Portfolio-এ যেকোনো জায়গায় বসাও — শুধু total visitors দেখাবে

import useVisitorTracker from "../hooks/useVisitorTracker";

const VisitorCounter = ({ className = "" }) => {
  const { visitorCount, loading } = useVisitorTracker();

  return (
    <div className={`visitor-counter ${className}`}>
      <span className="visitor-icon">👁️</span>
      {loading ? (
        <span className="visitor-count">...</span>
      ) : (
        <span className="visitor-count">
          {visitorCount?.toLocaleString() ?? "—"}
        </span>
      )}
      <span className="visitor-label">visitors</span>
    </div>
  );
};

export default VisitorCounter;

/*
── Usage example ──────────────────────────────────────────────────
  import VisitorCounter from "../components/VisitorCounter";

  // Hero section বা Footer-এ:
  <VisitorCounter className="my-4" />

── Optional CSS ───────────────────────────────────────────────────
  .visitor-counter {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    color: #888;
  }
  .visitor-count {
    font-weight: 700;
    color: #fff;
  }
*/
