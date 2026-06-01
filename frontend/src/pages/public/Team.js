import React, { useState, useEffect } from "react";
import { getPublicTeam } from "../../utils/api";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { FiLinkedin, FiGithub, FiTwitter, FiMail } from "react-icons/fi";

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getPublicTeam();
        setMembers(res.data);
      } catch { } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const departments = ["All", ...new Set(members.map((m) => m.department))];
  const filtered = filter === "All" ? members : members.filter((m) => m.department === filter);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />
      <div className="pt-28 pb-16 px-6 max-w-6xl mx-auto flex-1 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Meet the Team</h1>
          <p className="text-slate-400 max-w-xl mx-auto">The talented people behind the work — building great things together.</p>
        </div>

        {/* Department filters */}
        {departments.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {departments.map((dep) => (
              <button key={dep} onClick={() => setFilter(dep)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${filter === dep ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600"}`}>
                {dep}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg font-medium">No team members yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((member) => (
              <div key={member._id}
                className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 text-center">
                {/* Avatar */}
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name}
                    className="w-20 h-20 rounded-xl object-cover mx-auto mb-4 group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {member.name.charAt(0)}
                  </div>
                )}

                <h3 className="font-semibold text-white text-base">{member.name}</h3>
                <p className="text-blue-400 text-sm mt-0.5">{member.role}</p>
                <span className="inline-block mt-2 text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg">{member.department}</span>

                {member.bio && (
                  <p className="text-slate-500 text-xs mt-3 leading-relaxed line-clamp-3">{member.bio}</p>
                )}

                {/* Social links */}
                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-slate-800">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-slate-500 hover:text-white transition-colors">
                      <FiMail className="w-4 h-4" />
                    </a>
                  )}
                  {member.social?.linkedin && (
                    <a href={member.social.linkedin} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors">
                      <FiLinkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.social?.github && (
                    <a href={member.social.github} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
                      <FiGithub className="w-4 h-4" />
                    </a>
                  )}
                  {member.social?.twitter && (
                    <a href={member.social.twitter} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-sky-400 transition-colors">
                      <FiTwitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Team;
