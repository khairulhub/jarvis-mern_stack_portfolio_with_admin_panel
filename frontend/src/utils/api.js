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


// ─── AboutInfo ────────────────────────────────────────────────
export const getAboutInfo = async () => {
  const { data } = await API.get("/aboutinfo");
  return data;
};

export const updateAboutInfo = async (infoData) => {
  const { data } = await API.put("/aboutinfo", infoData);
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


// ─── Clients ──────────────────────────────────────────────
export const getPublicClients = async () => {
  const { data } = await API.get("/clients");
  return data;
};
 
export const getAdminClients = async () => {
  const { data } = await API.get("/clients/admin/all");
  return data;
};
 
export const createClient = async (clientData) => {
  const { data } = await API.post("/clients", clientData);
  return data;
};
 
export const updateClient = async (id, clientData) => {
  const { data } = await API.put(`/clients/${id}`, clientData);
  return data;
};
 
export const deleteClient = async (id) => {
  const { data } = await API.delete(`/clients/${id}`);
  return data;
};
 
export const toggleClient = async (id) => {
  const { data } = await API.patch(`/clients/${id}/toggle`);
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


// network -------------------------

export const getNetworks = async () => {
  const { data } = await API.get("/networks");
  return data;
};

export const getAdminNetworks = async () => {
  const { data } = await API.get("/networks/admin/all");
  return data;
};

export const getNetworkById = async (id) => {
  const { data } = await API.get(`/networks/${id}`);
  return data;
};

export const createNetwork = async (networkData) => {
  const { data } = await API.post("/networks", networkData);
  return data;
};

export const updateNetwork = async (id, networkData) => {
  const { data } = await API.put(`/networks/${id}`, networkData);
  return data;
};

export const deleteNetwork = async (id) => {
  const { data } = await API.delete(`/networks/${id}`);
  return data;
};

export const toggleNetwork = async (id) => {
  const { data } = await API.patch(`/networks/${id}/toggle`);
  return data;
};





// ─── Photo Categories ──────────────────────────────────────────
export const getPublicPhotoCategories = async () => {
  const { data } = await API.get("/photo-categories");
  return data;
};

export const getAdminPhotoCategories = async () => {
  const { data } = await API.get("/photo-categories/admin/all");
  return data;
};

export const createPhotoCategory = async (catData) => {
  const { data } = await API.post("/photo-categories", catData);
  return data;
};

export const updatePhotoCategory = async (id, catData) => {
  const { data } = await API.put(`/photo-categories/${id}`, catData);
  return data;
};

export const deletePhotoCategory = async (id) => {
  const { data } = await API.delete(`/photo-categories/${id}`);
  return data;
};

export const togglePhotoCategory = async (id) => {
  const { data } = await API.patch(`/photo-categories/${id}/toggle`);
  return data;
};


// ─── Photos ────────────────────────────────────────────────────
export const getPublicPhotos = async (category = "") => {
  const params = category && category !== "ALL" ? { category } : {};
  const { data } = await API.get("/photos", { params });
  return data;
};

export const getAdminPhotos = async () => {
  const { data } = await API.get("/photos/admin/all");
  return data;
};

export const createPhoto = async (photoData) => {
  const { data } = await API.post("/photos", photoData);
  return data;
};

export const updatePhoto = async (id, photoData) => {
  const { data } = await API.put(`/photos/${id}`, photoData);
  return data;
};

export const deletePhoto = async (id) => {
  const { data } = await API.delete(`/photos/${id}`);
  return data;
};

export const togglePhoto = async (id) => {
  const { data } = await API.patch(`/photos/${id}/toggle`);
  return data;
};


// ─── ContactInfo ──────────────────────────────────────────────
export const getContactInfo = async () => {
  const { data } = await API.get("/contactinfo");
  return data;
};

export const updateContactInfo = async (infoData) => {
  const { data } = await API.put("/contactinfo", infoData);
  return data;
};


export const getFooterBrand = async () => {
  const { data } = await API.get("/footer-brand");
  return data;
};

export const updateFooterBrand = async (brandData) => {
  const { data } = await API.put("/footer-brand", brandData);
  return data;
};


export default API;
