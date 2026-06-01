import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminBlogs, getAdminTeam } from "../../utils/api";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  HiOutlineDocumentText, HiOutlineUsers, HiOutlineEye,
  HiOutlinePencil, HiOutlinePlus, HiOutlineTrendingUp,
} from "react-icons/hi";

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

const Dashboard = () => {
  const [stats, setStats] = useState({ blogs: 0, published: 0, drafts: 0, team: 0, views: 0 });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogsRes, teamRes] = await Promise.all([getAdminBlogs({ limit: 5 }), getAdminTeam()]);
        const blogs = blogsRes.data;
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Welcome back! Here's what's happening.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/blogs/create"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all">
              <HiOutlinePlus className="w-4 h-4" /> New Blog
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={HiOutlineDocumentText} label="Total Blogs" value={stats.blogs} sub={`${stats.published} published`} color="bg-blue-600" />
          <StatCard icon={HiOutlinePencil} label="Drafts" value={stats.drafts} sub="Pending publish" color="bg-amber-500" />
          <StatCard icon={HiOutlineUsers} label="Team Members" value={stats.team} sub="Active members" color="bg-violet-600" />
          <StatCard icon={HiOutlineEye} label="Total Views" value={stats.views.toLocaleString()} sub="Across all posts" color="bg-emerald-600" />
        </div>

        {/* Recent blogs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <HiOutlineTrendingUp className="w-5 h-5 text-blue-400" /> Recent Blogs
            </h2>
            <Link to="/admin/blogs" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all →</Link>
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
    </AdminLayout>
  );
};

export default Dashboard;
