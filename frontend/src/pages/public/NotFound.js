import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-3xl" />
      </div>
      <div className="relative text-center">
        <p className="text-8xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-4">
          404
        </p>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20">
            Go Home
          </Link>
          <Link to="/blog"
            className="px-6 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition-all">
            Browse Blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
