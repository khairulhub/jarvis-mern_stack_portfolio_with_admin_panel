import React, { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import {
  HiOutlineMail, HiOutlineLockClosed,
  HiOutlineEye, HiOutlineEyeOff,
} from "react-icons/hi";

const Login = () => {
  const { isAuthenticated, login, loginWithFirebaseEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("mongodb"); // "mongodb" | "firebase"
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── MongoDB login ──────────────────────────────────────────
  const handleMongoLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Please fill all fields");
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ── Firebase email/password login ─────────────────────────
  const handleFirebaseLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Please fill all fields");
    setLoading(true);
    try {
      await loginWithFirebaseEmail(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/admin/dashboard");
    } catch (err) {
      const msg = err.code === "auth/user-not-found" ? "No account found with this email"
        : err.code === "auth/wrong-password" ? "Incorrect password"
        : err.code === "auth/invalid-email" ? "Invalid email address"
        : err.code === "auth/too-many-requests" ? "Too many attempts. Try again later"
        : err.response?.data?.message || "Firebase login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Google login ───────────────────────────────────────────
  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google!");
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        toast.error("Popup closed. Please try again.");
      } else {
        toast.error(err.response?.data?.message || "Google sign-in failed");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = tab === "mongodb" ? handleMongoLogin : handleFirebaseLogin;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-blue-500/25">
              M
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to manage your content</p>
          </div>

          {/* Google button */}
          <button onClick={handleGoogle} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-700 rounded-xl text-sm font-medium text-white hover:bg-slate-800 transition-all mb-5 disabled:opacity-50">
            <FcGoogle className="w-5 h-5" />
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-500 bg-slate-900 px-3">
              or sign in with email
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-slate-800 rounded-xl p-1 mb-5">
            <button onClick={() => setTab("mongodb")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all
                ${tab === "mongodb" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>
              Standard Login
            </button>
            <button onClick={() => setTab("firebase")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all
                ${tab === "firebase" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>
              Firebase Login
            </button>
          </div>

          {/* Info badge */}
          <div className={`text-xs px-3 py-2 rounded-lg mb-4 border
            ${tab === "mongodb"
              ? "bg-blue-500/10 border-blue-500/20 text-blue-300"
              : "bg-orange-500/10 border-orange-500/20 text-orange-300"}`}>
            {tab === "mongodb"
              ? "🔐 Uses your MongoDB account created via /api/auth/register"
              : "🔥 Uses Firebase Authentication — account auto-created on first login"}
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="admin@example.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showPass ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/25 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (tab === "mongodb" ? "Sign In" : "Sign In with Firebase")}
            </button>
          </form>
        </div>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500 mt-5">
            No account yet?{" "}
            <Link to="/admin/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          MERN Starter Template © {new Date().getFullYear()}
        </p>
      </div>
    
  );
};

export default Login;
