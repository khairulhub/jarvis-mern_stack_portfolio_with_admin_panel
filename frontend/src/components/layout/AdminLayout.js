import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HiOutlineHome, HiOutlineDocumentText, HiOutlineUsers,
  HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineCog, HiOutlinePhotograph,
  HiOutlineCode, HiOutlineBriefcase, HiOutlineCollection,HiOutlineGlobe,HiOutlineTag,HiOutlineMail,HiOutlineTemplate,
} from "react-icons/hi";

const navItems = [
  { path: "/admin/dashboard", icon: HiOutlineHome, label: "Dashboard" },
   { path: "/admin/hero",      icon: HiOutlinePhotograph,   label: "Hero Section" }, //new
{ path: "/admin/experiences", icon: HiOutlineBriefcase,    label: "Experiences"  }, //new
  { path: "/admin/services", icon: HiOutlineCollection, label: "Services" }, //new
  { path: "/admin/codings",     icon: HiOutlineCode,         label: "Coding Ref"   }, //new
   { path: "/admin/networks",    icon: HiOutlineGlobe,        label: "Networking"  },  // ← NEW
  { path: "/admin/blogs", icon: HiOutlineDocumentText, label: "Blogs" },
  { path: "/admin/team", icon: HiOutlineUsers, label: "Team" },
 
 { path: "/admin/works", icon: HiOutlineCode, label: "Works" }, //new
 { path: "/admin/gallery-categories", icon: HiOutlineTag,        label: "Photo Categories" },
 { path: "/admin/gallery",            icon: HiOutlinePhotograph, label: "Gallery"          },
  { path: "/admin/contact-info", icon: HiOutlineMail,        label: "Contact Info" },
  { path: "/admin/footer-brand",  icon: HiOutlineTemplate,   label: "Footer & Navbar Brand" },
 
  { path: "/admin/settings", icon: HiOutlineCog, label: "Settings" },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-30 w-64 bg-slate-900 border-r border-slate-800
        transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="text-white font-bold text-lg">MERN Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 lg:hidden hover:text-white">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link key={path} to={path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${pathname.startsWith(path)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              onClick={() => setSidebarOpen(false)}>
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-slate-800 mt-auto">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <HiOutlineLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:overflow-auto">
        {/* Top bar */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 gap-4 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white lg:hidden">
            <HiOutlineMenu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <Link to="/" target="_blank"
            className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-all">
            View Site ↗
          </Link>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
