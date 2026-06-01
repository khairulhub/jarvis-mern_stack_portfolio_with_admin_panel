import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getPublicBlogs } from "../../utils/api";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { HiOutlineSearch, HiOutlineEye } from "react-icons/hi";

const CATEGORIES = ["", "Technology", "Business", "Design", "Marketing", "Other"];

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchBlogs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getPublicBlogs({ page, limit: 9, search, category });
      setBlogs(res.data);
      setPagination(res.pagination);
    } catch { } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => { fetchBlogs(1); }, [fetchBlogs]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />
      <div className="pt-28 pb-16 px-6 max-w-6xl mx-auto flex-1 w-full">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">Blog</h1>
          <p className="text-slate-400">{pagination.total} articles across technology, design, and more</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c || "all"} onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${category === c ? "bg-blue-600 text-white" : "bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"}`}>
                {c || "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg font-medium">No posts found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link key={blog._id} to={`/blog/${blog.slug}`}
                className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:-translate-y-1 transition-all duration-300">
                {blog.coverImage ? (
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-900/40 to-violet-900/40 flex items-center justify-center">
                    <span className="text-4xl text-slate-700 font-bold">{blog.title.charAt(0)}</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-2.5 py-1 rounded-lg">{blog.category}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <HiOutlineEye className="w-3.5 h-3.5" /> {blog.views}
                    </span>
                  </div>
                  <h2 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">{blog.title}</h2>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">{blog.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{blog.author?.name}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button disabled={pagination.page <= 1} onClick={() => fetchBlogs(pagination.page - 1)}
              className="px-5 py-2 border border-slate-700 rounded-xl text-sm text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              ← Previous
            </button>
            <span className="text-sm text-slate-500">Page {pagination.page} of {pagination.pages}</span>
            <button disabled={pagination.page >= pagination.pages} onClick={() => fetchBlogs(pagination.page + 1)}
              className="px-5 py-2 border border-slate-700 rounded-xl text-sm text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Next →
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BlogList;
