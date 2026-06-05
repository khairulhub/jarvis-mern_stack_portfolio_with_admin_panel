// components/admin/VisitorTable.jsx
// Admin dashboard-এ বসাও — সব visitor IP ও details দেখাবে

import { useEffect, useState, useCallback } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DEVICE_ICON = { mobile: "📱", tablet: "📟", desktop: "🖥️" };

const VisitorTable = () => {
  const [data, setData] = useState({ visitors: [], total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDetails = useCallback(async (pg = 1) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token"); // তোমার existing auth token
      const res = await fetch(
        `${API_BASE}/api/visitors/details?page=${pg}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setData(json);
    } catch (err) {
      setError(err.message || "Failed to load visitors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDetails(page);
  }, [page, fetchDetails]);

  return (
    <div className="visitor-table-wrapper">
      <div className="visitor-table-header">
        <h2>🌐 Visitors</h2>
        <span className="badge">Total: {data.total}</span>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-scroll">
          <table className="visitor-table">
            <thead>
              <tr>
                <th>#</th>
                <th>IP</th>
                <th>Device</th>
                <th>Browser</th>
                <th>OS</th>
                <th>Country</th>
                <th>City</th>
                <th>ISP</th>
                <th>First Visit</th>
              </tr>
            </thead>
            <tbody>
              {data.visitors.map((v, i) => (
                <tr key={v._id}>
                  <td>{(page - 1) * 20 + i + 1}</td>
                  <td className="ip-cell">{v.ip}</td>
                  <td>{DEVICE_ICON[v.device] || "?"} {v.device}</td>
                  <td>{v.browser}</td>
                  <td>{v.os}</td>
                  <td>
                    {v.countryCode && (
                      <img
                        src={`https://flagcdn.com/20x15/${v.countryCode.toLowerCase()}.png`}
                        alt={v.countryCode}
                        style={{ marginRight: 4, verticalAlign: "middle" }}
                      />
                    )}
                    {v.country}
                  </td>
                  <td>{v.city}</td>
                  <td>{v.isp}</td>
                  <td>{new Date(v.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span>
            {page} / {data.totalPages}
          </span>
          <button
            disabled={page === data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default VisitorTable;
