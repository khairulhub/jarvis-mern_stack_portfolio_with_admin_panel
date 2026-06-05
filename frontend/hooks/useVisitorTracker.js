// hooks/useVisitorTracker.js
// Portfolio load হলে automatically visitor track করবে
// এবং total count return করবে

import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const useVisitorTracker = () => {
  const [visitorCount, setVisitorCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        // 1. Track this visitor (same IP হলে backend ignore করবে)
        await fetch(`${API_BASE}/api/visitors/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        // 2. Total count আনো
        const res = await fetch(`${API_BASE}/api/visitors/count`);
        const data = await res.json();
        if (data.success) setVisitorCount(data.total);
      } catch (err) {
        console.error("Visitor tracking error:", err);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []); // শুধু একবার — mount হলে

  return { visitorCount, loading };
};

export default useVisitorTracker;
