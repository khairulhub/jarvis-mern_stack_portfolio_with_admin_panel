import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminBlogs, getAdminTeam } from "../../utils/api";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  HiOutlineDocumentText, HiOutlineUsers, HiOutlineEye,
  HiOutlinePencil, HiOutlinePlus, HiOutlineTrendingUp,
  HiOutlineGlobe,
} from "react-icons/hi";

// ─── Visitor hooks (api.js এর API instance use করে) ──────────
const useVisitorStats = () => {
  const [total, setTotal]     = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
    // const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
    const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
    const token    = localStorage.getItem("token");
    const headers  = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_BASE}/api/visitors/count`).then((r) => r.json()),
      fetch(`${API_BASE}/api/visitors/details?limit=5`, { headers }).then((r) => r.json()),
    ])
      .then(([countRes, detailRes]) => {
        if (countRes.success)  setTotal(countRes.total);
        if (detailRes.success) setVisitors(detailRes.visitors);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { total, visitors, loading };
};

// ─── Stat card (existing) ─────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-3xl font-bold text-white mt-0.5">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  </div>
);
const VisitorModal = ({ visitor: v, onClose }) => {
  if (!v) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-sm">{v.ip}</span>
            <span className="text-base">{DEVICE[v.device] || "❓"}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-xl leading-none"
          >✕</button>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ["🌍 Country",  v.countryCode ? `${v.country} (${v.countryCode})` : v.country || "—"],
            ["🏙️ City",     v.city || "—"],
            ["📡 Region",   v.region || "—"],
            ["🕐 Timezone", v.timezone || "—"],
            ["🌐 ISP",      v.isp || "—"],
            ["🏢 Org",      v.org || "—"],
            ["🖥️ Browser",  v.browser || "—"],
            ["💻 OS",       v.os || "—"],
            ["📍 Lat/Lon",  v.lat && v.lon ? `${v.lat}, ${v.lon}` : "—"],
            ["📅 Visited",  new Date(v.createdAt).toLocaleString()],
          ].map(([label, value]) => (
            <div key={label} className="bg-slate-800 rounded-xl px-3 py-2">
              <p className="text-slate-500 text-xs">{label}</p>
              <p className="text-white text-xs mt-0.5 truncate" title={value}>{value}</p>
            </div>
          ))}
        </div>

        {/* Map link */}
        {v.lat && v.lon && (
          <a
            href={`https://www.google.com/maps?q=${v.lat},${v.lon}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-xl transition-colors"
          >
            🗺️ View on Google Maps
          </a>
        )}
      </div>
    </div>
  );
};

// ─── Device icon ──────────────────────────────────────────────
const DEVICE = { mobile: "📱", tablet: "📟", desktop: "🖥️" };

// ═════════════════════════════════════════════════════════════
const Dashboard = () => {
  const [stats, setStats]         = useState({ blogs: 0, published: 0, drafts: 0, team: 0, views: 0 });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading]       = useState(true);

  const { total: visitorTotal, visitors, loading: vLoading } = useVisitorStats();
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogsRes, teamRes] = await Promise.all([
          getAdminBlogs({ limit: 5 }),
          getAdminTeam(),
        ]);
        const blogs     = blogsRes.data;
        const published = blogs.filter((b) => b.status === "published").length;
        const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
        setStats({
          blogs: blogsRes.pagination?.total || blogs.length,
          published,
          drafts: (blogsRes.pagination?.total || blogs.length) - published,
          team: teamRes.data.length,
          views: totalViews,
        });
        setRecentBlogs(blogs.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Welcome back! Here's what's happening.</p>
          </div>
          <Link
            to="/admin/blogs/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all"
          >
            <HiOutlinePlus className="w-4 h-4" /> New Blog
          </Link>
        </div>

        {/* ── Stats grid (5 cards — visitor card নতুন) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={HiOutlineDocumentText} label="Total Blogs"    value={stats.blogs}                  sub={`${stats.published} published`} color="bg-blue-600"   />
          <StatCard icon={HiOutlinePencil}       label="Drafts"         value={stats.drafts}                 sub="Pending publish"                color="bg-amber-500"  />
          <StatCard icon={HiOutlineUsers}        label="Team Members"   value={stats.team}                   sub="Active members"                 color="bg-violet-600" />
          <StatCard icon={HiOutlineEye}          label="Total Views"    value={stats.views.toLocaleString()} sub="Across all posts"               color="bg-emerald-600"/>
          {/* ↓ নতুন visitor card */}
          <StatCard
            icon={HiOutlineGlobe}
            label="Total Visitors"
            value={vLoading ? "···" : (visitorTotal ?? 0).toLocaleString()}
            sub="Unique IPs"
            color="bg-cyan-600"
          />
        </div>

        {/* ── Visitor Table (নতুন) ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <HiOutlineGlobe className="w-5 h-5 text-cyan-400" /> Recent Visitors
            </h2>
            <span className="text-xs text-slate-500">Latest 5 unique IPs</span>
          </div>

          {vLoading ? (
            <div className="px-6 py-10 flex justify-center">
              <div className="w-6 h-6 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : visitors.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-500">
              <HiOutlineGlobe className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No visitors yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {visitors.map((v, i) => (
                <div
                  key={v._id}
                  className="px-6 py-3 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                >
                  {/* IP + device */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-slate-500 text-xs w-5 text-right">{i + 1}</span>
                    {/* <span className="text-sm font-mono text-cyan-400">{v.ip}</span> */}
                    <span
  className="text-sm font-mono text-cyan-400 cursor-pointer hover:underline"
  onClick={() => setSelectedVisitor(v)}
>
  {v.ip}
</span>
                    <span className="text-base" title={v.device}>{DEVICE[v.device] || "❓"}</span>
                  </div>

                  {/* Country + city */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 flex-shrink-0">
                    {v.countryCode && (
                      <img
                        src={`https://flagcdn.com/16x12/${v.countryCode.toLowerCase()}.png`}
                        alt={v.countryCode}
                        className="rounded-sm"
                      />
                    )}
                    <span>{v.city || "—"}, {v.country || "—"}</span>
                  </div>

                  {/* Browser / OS */}
                  <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 flex-shrink-0">
                    <span>{v.browser}</span>
                    <span className="text-slate-700">·</span>
                    <span>{v.os}</span>
                  </div>

                  {/* Date */}
                  <span className="text-xs text-slate-600 flex-shrink-0">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Recent blogs (existing, unchanged) ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <HiOutlineTrendingUp className="w-5 h-5 text-blue-400" /> Recent Blogs
            </h2>
            <Link to="/admin/blogs" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View all →
            </Link>
          </div>
          {recentBlogs.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              <HiOutlineDocumentText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No blogs yet. <Link to="/admin/blogs/create" className="text-blue-400 hover:underline">Create your first post →</Link></p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {recentBlogs.map((blog) => (
                <div key={blog._id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{blog.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{blog.category} · {new Date(blog.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${blog.status === "published" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                      {blog.status}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <HiOutlineEye className="w-3.5 h-3.5" /> {blog.views}
                    </span>
                    <Link to={`/admin/blogs/edit/${blog._id}`}
                      className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-2.5 py-1 rounded-lg transition-all">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      <VisitorModal visitor={selectedVisitor} onClose={() => setSelectedVisitor(null)} />
    </AdminLayout>
  );
};

export default Dashboard;