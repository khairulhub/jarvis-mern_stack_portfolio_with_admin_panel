import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBlogBySlug } from "../../utils/api";
import Navbar from "../../components/layout/Navbar";
import { HiOutlineArrowLeft, HiOutlineEye, HiOutlineClock } from "react-icons/hi";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getBlogBySlug(slug);
        setBlog(res.data);
      } catch {
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug, navigate]);

  const readTime = blog ? Math.max(1, Math.ceil(blog.content.split(" ").length / 200)) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
            <HiOutlineArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full">{blog.category}</span>
            <span className="text-xs text-slate-500 flex items-center gap-1.5"><HiOutlineClock className="w-3.5 h-3.5" /> {readTime} min read</span>
            <span className="text-xs text-slate-500 flex items-center gap-1.5"><HiOutlineEye className="w-3.5 h-3.5" /> {blog.views} views</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight mb-4">{blog.title}</h1>
          <p className="text-slate-400 text-lg mb-6 leading-relaxed">{blog.excerpt}</p>

          {/* Author + date */}
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
              {blog.author?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{blog.author?.name || "Admin"}</p>
              <p className="text-xs text-slate-500">{new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>

          {/* Cover */}
          {blog.coverImage && (
            <img src={blog.coverImage} alt={blog.title} className="w-full h-72 sm:h-96 object-cover rounded-2xl mb-10 border border-slate-800" />
          )}

          {/* Content */}
          <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed">
            {blog.content.split("\n").map((para, i) =>
              para.trim() ? <p key={i} className="mb-4">{para}</p> : <br key={i} />
            )}
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500 mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full border border-slate-700">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
