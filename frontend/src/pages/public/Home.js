// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getPublicBlogs, getPublicTeam } from "../../utils/api";
// import Navbar from "../../components/layout/Navbar";
// import Footer from "../../components/layout/Footer";
// import HeroLayout from "../../components/layout/HeroLayout";
// import LoadingSpinner from "../../components/common/LoadingSpinner";
// import { HiOutlineArrowRight, HiOutlineDocumentText, HiOutlineUsers, HiOutlineCode, HiOutlineEye } from "react-icons/hi";
// import About from "./About";
// import Services from "./Services";
// import Works from "./Works";
// import Coding from "./Coding";
// import Networking from "./Networking";
// import Contact from "./Contact";
// import Gallery from "./Gallery";

// const Home = () => {
//   const [blogs, setBlogs]   = useState([]);
//   const [team,  setTeam]    = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showHero, setShowHero] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [blogsRes, teamRes] = await Promise.all([
//           getPublicBlogs({ limit: 3 }),
//           getPublicTeam(),
//         ]);
//         setBlogs(blogsRes.data);
//         setTeam(teamRes.data.slice(0, 4));
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-950 text-white flex flex-col">
//       <Navbar />

//       {showHero ? (
//         /* ── Hero Layout (profile + chips) ── */
//         <HeroLayout />
//       ) : (
//         /* ── Hero Section ── */
//         <section className="relative pt-36 pb-24 px-6 overflow-hidden">
//           <div className="absolute inset-0 pointer-events-none">
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-3xl" />
//             <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-violet-600/8 blur-3xl" />
//           </div>
//           <div className="relative max-w-4xl mx-auto text-center">
//             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6">
//               <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
//               MERN Stack Starter Template
//             </div>
//             <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
//               Build your next
//               <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
//                 full-stack app
//               </span>
//             </h1>
//             <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
//               Production-ready MERN stack template with React Router, JWT Auth, Firebase,
//               MongoDB, Tailwind CSS, and a complete admin dashboard.
//             </p>
//             <div className="flex flex-wrap items-center justify-center gap-4">
//               <Link to="/blog"
//                 className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25">
//                 Explore Blog <HiOutlineArrowRight className="w-4 h-4" />
//               </Link>
//               <Link to="/team"
//                 className="flex items-center gap-2 px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-all">
//                 Meet the Team
//               </Link>
//             </div>
//           </div>
//         </section>
//       )}


// {/* ----------------about----------------- */}
//       <About />

// {/* ----------------services----------------- */}
//       <Services />

// {/* ----------------works----------------- */}
//       <Works />


//       <Coding />

//       <Networking />


//       {/* ── Latest Blogs ──────────────────────────────────── */}
//       <section className="py-16 px-6 border-t border-slate-800">
//         <div className="max-w-5xl mx-auto">
//           <div className="flex items-center justify-between mb-8">
//             <h2 className="text-2xl font-bold text-white">Latest Posts</h2>
//             <Link to="/blog" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
//               View all <HiOutlineArrowRight className="w-3.5 h-3.5" />
//             </Link>
//           </div>

//           {loading ? (
//             <div className="flex justify-center py-12"><LoadingSpinner /></div>
//           ) : blogs.length === 0 ? (
//             <div className="text-center py-16 text-slate-600">
//               <HiOutlineDocumentText className="w-12 h-12 mx-auto mb-3 opacity-30" />
//               <p>No posts published yet.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {blogs.map((blog) => (
//                 <Link key={blog._id} to={`/blog/${blog.slug}`}
//                   className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:-translate-y-1 transition-all duration-300">
//                   {blog.coverImage ? (
//                     <img src={blog.coverImage} alt={blog.title}
//                       className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
//                   ) : (
//                     <div className="w-full h-44 bg-gradient-to-br from-blue-900/30 to-violet-900/30 flex items-center justify-center">
//                       <span className="text-5xl text-slate-700 font-bold">{blog.title.charAt(0)}</span>
//                     </div>
//                   )}
//                   <div className="p-5">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-xs text-blue-400 font-medium">{blog.category}</span>
//                       <span className="text-xs text-slate-500 flex items-center gap-1">
//                         <HiOutlineEye className="w-3.5 h-3.5" />{blog.views}
//                       </span>
//                     </div>
//                     <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">
//                       {blog.title}
//                     </h3>
//                     <p className="text-sm text-slate-400 line-clamp-2">{blog.excerpt}</p>
//                     <p className="text-xs text-slate-600 mt-3">
//                       {new Date(blog.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>



//       <Gallery />



//       {/* ── Team Preview ──────────────────────────────────── */}
//       {!loading && team.length > 0 && (
//         <section className="py-16 px-6 border-t border-slate-800">
//           <div className="max-w-5xl mx-auto">
//             <div className="flex items-center justify-between mb-8">
//               <h2 className="text-2xl font-bold text-white">Our Team</h2>
//               <Link to="/team" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
//                 View all <HiOutlineArrowRight className="w-3.5 h-3.5" />
//               </Link>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {team.map((m) => (
//                 <div key={m._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center hover:border-slate-700 transition-all">
//                   {m.avatar ? (
//                     <img src={m.avatar} alt={m.name} className="w-16 h-16 rounded-xl object-cover mx-auto mb-3" />
//                   ) : (
//                     <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
//                       {m.name.charAt(0)}
//                     </div>
//                   )}
//                   <p className="font-semibold text-white text-sm">{m.name}</p>
//                   <p className="text-xs text-slate-400 mt-0.5">{m.role}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ── CTA ───────────────────────────────────────────── */}
//       {/* <section className="py-20 px-6 border-t border-slate-800">
//         <div className="max-w-2xl mx-auto text-center">
//           <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
//           <p className="text-slate-400 mb-8">Sign in to the admin panel and start managing your content.</p>
//           <Link to="/admin/login"
//             className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25">
//             Go to Admin Panel <HiOutlineArrowRight className="w-4 h-4" />
//           </Link>
//         </div>
//       </section> */}



//       <Contact />

//       <Footer />
//     </div>
//   );
// };

// export default Home;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicBlogs, getPublicTeam } from "../../utils/api";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroLayout from "../../components/layout/HeroLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { HiOutlineArrowRight, HiOutlineDocumentText, HiOutlineEye } from "react-icons/hi";
import About from "./About";
import Services from "./Services";
import Works from "./Works";
import Coding from "./Coding";
import Networking from "./Networking";
import Contact from "./Contact";
import Gallery from "./Gallery";

const Home = () => {
  const [blogs,   setBlogs]   = useState([]);
  const [team,    setTeam]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Run both requests in parallel
        const [blogsRes, teamRes] = await Promise.all([
          getPublicBlogs({ limit: 3 }),
          getPublicTeam(),
        ]);

        /*
         * Backend returns:  { success, data: [...], pagination? }
         * axios unwraps to: that same object
         * So .data gives us the array directly.
         */
        const blogsArray = Array.isArray(blogsRes?.data) ? blogsRes.data : [];
        const teamArray  = Array.isArray(teamRes?.data)  ? teamRes.data  : [];

        setBlogs(blogsArray);
        setTeam(teamArray.slice(0, 4));
      } catch (err) {
        console.error("Home fetch error:", err?.response?.data || err.message);
        setError(err?.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      {/* ── Hero ── */}
      <HeroLayout />

      {/* ── Sections ── */}
      <About />
      <Services />
      <Works />
      <Coding />
      <Networking />

      {/* ── Latest Blogs ── */}
      <section id="blog-preview" className="py-16 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Latest Posts</h2>
            <Link to="/blog" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View all <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><LoadingSpinner /></div>
          ) : error ? (
            <div className="text-center py-16 text-red-400">
              <p>{error}</p>
              <p className="text-xs text-slate-500 mt-2">Check your backend is running and REACT_APP_API_URL is set.</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 text-slate-600">
              <HiOutlineDocumentText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No published posts yet.</p>
              <p className="text-xs text-slate-600 mt-1">Make sure blog status is set to <strong>published</strong> in the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link key={blog._id} to={`/blog/${blog.slug}`}
                  className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 no-underline">
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-44 bg-gradient-to-br from-blue-900/30 to-violet-900/30 flex items-center justify-center">
                      <span className="text-5xl text-slate-700 font-bold">{blog.title?.charAt(0)}</span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-blue-400 font-medium">{blog.category}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <HiOutlineEye className="w-3.5 h-3.5" />{blog.views ?? 0}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{blog.excerpt}</p>
                    <p className="text-xs text-slate-600 mt-3">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Gallery />

      {/* ── Team Preview ── */}
      <section id="team-preview" className="py-16 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Our Team</h2>
            <Link to="/team" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View all <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><LoadingSpinner /></div>
          ) : team.length === 0 ? (
            <div className="text-center py-16 text-slate-600">
              <p>No team members yet.</p>
              <p className="text-xs text-slate-600 mt-1">Add team members from the admin panel and set them as <strong>active</strong>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {team.map((m) => (
                <div key={m._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center hover:border-slate-700 transition-all">
                  {m.avatar ? (
                    <img src={m.avatar} alt={m.name} className="w-16 h-16 rounded-xl object-cover mx-auto mb-3" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      {m.name?.charAt(0)}
                    </div>
                  )}
                  <p className="font-semibold text-white text-sm">{m.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{m.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
