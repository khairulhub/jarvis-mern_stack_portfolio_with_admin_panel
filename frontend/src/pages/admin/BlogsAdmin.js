import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAdminBlogs, deleteBlog } from "../../utils/api";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
  HiOutlineEye, HiOutlineSearch, HiOutlineDocumentText,
} from "react-icons/hi";

const BlogsAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchBlogs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAdminBlogs({ page, limit: 10, search, status: statusFilter });
      setBlogs(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchBlogs(1); }, [fetchBlogs]);

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      toast.success("Blog deleted");
      setDeleteId(null);
      fetchBlogs(pagination.page);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Blogs</h1>
            <p className="text-slate-400 text-sm mt-1">{pagination.total} total posts</p>
          </div>
          <Link to="/admin/blogs/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20">
            <HiOutlinePlus className="w-4 h-4" /> New Blog
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <HiOutlineDocumentText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No blogs found</p>
              <Link to="/admin/blogs/create" className="text-blue-400 text-sm hover:underline mt-1 inline-block">Create your first blog →</Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                      <th className="text-left px-6 py-3">Title</th>
                      <th className="text-left px-6 py-3 hidden md:table-cell">Category</th>
                      <th className="text-left px-6 py-3 hidden sm:table-cell">Status</th>
                      <th className="text-left px-6 py-3 hidden lg:table-cell">Views</th>
                      <th className="text-left px-6 py-3 hidden lg:table-cell">Date</th>
                      <th className="text-right px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {blogs.map((blog) => (
                      <tr key={blog._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-white line-clamp-1 max-w-xs">{blog.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{blog.excerpt}</p>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-xs text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg">{blog.category}</span>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${blog.status === "published" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                            {blog.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell text-sm text-slate-400">{blog.views}</td>
                        <td className="px-6 py-4 hidden lg:table-cell text-sm text-slate-400">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/blog/${blog.slug}`} target="_blank"
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
                              <HiOutlineEye className="w-4 h-4" />
                            </Link>
                            <Link to={`/admin/blogs/edit/${blog._id}`}
                              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                              <HiOutlinePencil className="w-4 h-4" />
                            </Link>
                            <button onClick={() => setDeleteId(blog._id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                              <HiOutlineTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
                  <p className="text-xs text-slate-500">Page {pagination.page} of {pagination.pages}</p>
                  <div className="flex gap-2">
                    <button disabled={pagination.page <= 1} onClick={() => fetchBlogs(pagination.page - 1)}
                      className="px-3 py-1.5 text-xs border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      ← Prev
                    </button>
                    <button disabled={pagination.page >= pagination.pages} onClick={() => fetchBlogs(pagination.page + 1)}
                      className="px-3 py-1.5 text-xs border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Blog?</h3>
            <p className="text-slate-400 text-sm mb-6">This action is permanent and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 border border-slate-700 rounded-xl text-sm text-slate-300 hover:bg-slate-800 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-sm text-white font-medium transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default BlogsAdmin;
