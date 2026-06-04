import {React, useEffect} from "react";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public pages
import Home from "./pages/public/Home";
import BlogList from "./pages/public/BlogList";
import BlogDetail from "./pages/public/BlogDetail";
import Team from "./pages/public/Team";
import NotFound from "./pages/public/NotFound";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import BlogsAdmin from "./pages/admin/BlogsAdmin";
import BlogForm from "./pages/admin/BlogForm";
import TeamAdmin from "./pages/admin/TeamAdmin";
import Settings from "./pages/admin/Settings";
import HeroAdmin from "./pages/admin/HeroAdmin";
import WorksAdmin from "./pages/admin/WorksAdmin";
import ExperienceAdmin from "./pages/admin/ExperienceAdmin";
import ServiceAdmin from "./pages/admin/ServiceAdmin";
import CodingAdmin from "./pages/admin/CodingAdmin";
import NetworkAdmin from "./pages/admin/NetworkAdmin";


function App() {
  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const dot = document.getElementById("cursorDot");
    const onMove = (e) => {
      cursor.style.left = e.clientX - 8 + "px";
      cursor.style.top = e.clientY - 8 + "px";
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <AuthProvider>
      <div className="cursor" id="cursor" />
      <div className="cursor-dot" id="cursorDot" />
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#22c55e", secondary: "#1e293b" } },
            error:   { iconTheme: { primary: "#ef4444", secondary: "#1e293b" } },
          }}
        />
        <Routes>
          {/* ── Public ─────────────────────────────────── */}
          <Route path="/"           element={<Home />} />
          <Route path="/blog"       element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/team"       element={<Team />} />

          {/* ── Auth ───────────────────────────────────── */}
          <Route path="/admin/login"    element={<Login />} />
          <Route path="/admin/register" element={<Register />} />

          {/* ── Protected Admin ────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard"       element={<Dashboard />} />
<Route path="/admin/hero" element={<HeroAdmin />} />
            <Route path="/admin/experiences"     element={<ExperienceAdmin />} />
            <Route path="/admin/services" element={<ServiceAdmin />} />
            <Route path="/admin/works" element={<WorksAdmin />} />
            <Route path="/admin/codings"         element={<CodingAdmin />} />
            <Route path="/admin/networks" element={<NetworkAdmin />} />

            <Route path="/admin/blogs"           element={<BlogsAdmin />} />
            <Route path="/admin/blogs/create"    element={<BlogForm />} />
            <Route path="/admin/blogs/edit/:id"  element={<BlogForm />} />
            <Route path="/admin/team"            element={<TeamAdmin />} />
            <Route path="/admin/settings"        element={<Settings />} />
            
          </Route>

          {/* ── Fallbacks ──────────────────────────────── */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*"      element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
