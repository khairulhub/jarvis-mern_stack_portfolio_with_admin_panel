import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — auto logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────
export const loginAdmin = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);
  return data;
};

export const firebaseLoginAPI = async (idToken) => {
  const { data } = await API.post("/auth/firebase", { idToken });
  return data;
};

export const registerAdmin = async (userData) => {
  const { data } = await API.post("/auth/register", userData);
  return data;
};

export const getMe = async () => {
  const { data } = await API.get("/auth/me");
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await API.put("/auth/profile", profileData);
  return data;
};







// ─── Blogs ───────────────────────────────────────────────────
export const getPublicBlogs = async (params = {}) => {
  const { data } = await API.get("/blogs", { params });
  return data;
};

export const getAdminBlogs = async (params = {}) => {
  const { data } = await API.get("/blogs/admin/all", { params });
  return data;
};

export const getBlogBySlug = async (slug) => {
  const { data } = await API.get(`/blogs/slug/${slug}`);
  return data;
};

export const getBlogById = async (id) => {
  const { data } = await API.get(`/blogs/id/${id}`);
  return data;
};

export const createBlog = async (blogData) => {
  const { data } = await API.post("/blogs", blogData);
  return data;
};

export const updateBlog = async (id, blogData) => {
  const { data } = await API.put(`/blogs/${id}`, blogData);
  return data;
};

export const deleteBlog = async (id) => {
  const { data } = await API.delete(`/blogs/${id}`);
  return data;
};





// ─── Team ────────────────────────────────────────────────────
export const getPublicTeam = async () => {
  const { data } = await API.get("/team");
  return data;
};

export const getAdminTeam = async () => {
  const { data } = await API.get("/team/admin/all");
  return data;
};

export const createTeamMember = async (memberData) => {
  const { data } = await API.post("/team", memberData);
  return data;
};

export const updateTeamMember = async (id, memberData) => {
  const { data } = await API.put(`/team/${id}`, memberData);
  return data;
};

export const deleteTeamMember = async (id) => {
  const { data } = await API.delete(`/team/${id}`);
  return data;
};

export const toggleTeamMember = async (id) => {
  const { data } = await API.patch(`/team/${id}/toggle`);
  return data;
};



// ─── Hero ─────────────────────────────────────────────────────
export const getHero = async () => {
  const { data } = await API.get("/hero");
  return data;
};

export const updateHero = async (heroData) => {
  const { data } = await API.put("/hero", heroData);
  return data;
};


 
// ─── Services ─────────────────────────────────────────────────
export const getPublicServices = async () => {
  const { data } = await API.get("/services");
  return data;
};
 
export const getAdminServices = async () => {
  const { data } = await API.get("/services/admin/all");
  return data;
};
 
export const createService = async (serviceData) => {
  const { data } = await API.post("/services", serviceData);
  return data;
};
 
export const updateService = async (id, serviceData) => {
  const { data } = await API.put(`/services/${id}`, serviceData);
  return data;
};
 
export const deleteService = async (id) => {
  const { data } = await API.delete(`/services/${id}`);
  return data;
};
 
export const toggleService = async (id) => {
  const { data } = await API.patch(`/services/${id}/toggle`);
  return data;
};



// ─── Experiences ──────────────────────────────────────────────
export const getExperiences = async () => {
  const { data } = await API.get("/experiences");
  return data;
};

export const getExperienceById = async (id) => {
  const { data } = await API.get(`/experiences/${id}`);
  return data;
};

export const createExperience = async (expData) => {
  const { data } = await API.post("/experiences", expData);
  return data;
};

export const updateExperience = async (id, expData) => {
  const { data } = await API.put(`/experiences/${id}`, expData);
  return data;
};

export const deleteExperience = async (id) => {
  const { data } = await API.delete(`/experiences/${id}`);
  return data;
};







// ─── Works ───────────────────────────────────────────────────
export const getPublicWorks = async () => {
  const { data } = await API.get("/works");
  return data;
};
 
export const getAdminWorks = async () => {
  const { data } = await API.get("/works/admin/all");
  return data;
};
 
export const createWork = async (workData) => {
  const { data } = await API.post("/works", workData);
  return data;
};
 
export const updateWork = async (id, workData) => {
  const { data } = await API.put(`/works/${id}`, workData);
  return data;
};
 
export const deleteWork = async (id) => {
  const { data } = await API.delete(`/works/${id}`);
  return data;
};
 
export const toggleWork = async (id) => {
  const { data } = await API.patch(`/works/${id}/toggle`);
  return data;
};




// ─── Codings ──────────────────────────────────────────────
export const getCodings = async () => {
  const { data } = await API.get("/codings");
  return data;
};

export const getAdminCodings = async () => {
  const { data } = await API.get("/codings/admin/all");
  return data;
};

export const getCodingById = async (id) => {
  const { data } = await API.get(`/codings/${id}`);
  return data;
};

export const createCoding = async (codingData) => {
  const { data } = await API.post("/codings", codingData);
  return data;
};

export const updateCoding = async (id, codingData) => {
  const { data } = await API.put(`/codings/${id}`, codingData);
  return data;
};

export const deleteCoding = async (id) => {
  const { data } = await API.delete(`/codings/${id}`);
  return data;
};

export const toggleCoding = async (id) => {
  const { data } = await API.patch(`/codings/${id}/toggle`);
  return data;
};




export default API;
