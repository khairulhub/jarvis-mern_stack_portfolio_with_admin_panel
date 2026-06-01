# 🚀 MERN Stack Starter Template

A production-ready full-stack starter with **MongoDB · Express · React · Node.js**, featuring JWT auth, Firebase, Tailwind CSS, and a complete Admin Dashboard.

---

## 📦 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, React Router DOM v6, Tailwind CSS v3, Axios |
| **Backend** | Node.js, Express.js, Mongoose (MongoDB) |
| **Auth** | JWT (JSON Web Tokens) + Firebase (Google OAuth) |
| **Storage** | Firebase Storage (image uploads) |
| **Styling** | Tailwind CSS, react-icons |
| **Notifications** | react-hot-toast |

---

## 🗂 Project Structure

```
mern-starter/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # authController, blogController, teamController
│   ├── middleware/     # JWT protect, adminOnly
│   ├── models/         # User, Blog, Team schemas
│   ├── routes/         # authRoutes, blogRoutes, teamRoutes
│   ├── server.js       # Express entry point
│   └── .env.example
│
└── frontend/
    └── src/
        ├── components/
        │   ├── common/     # ProtectedRoute
        │   └── layout/     # Navbar, AdminLayout
        ├── context/        # AuthContext (JWT + Firebase)
        ├── pages/
        │   ├── admin/      # Dashboard, BlogsAdmin, BlogForm, TeamAdmin, Settings
        │   ├── auth/       # Login
        │   └── public/     # Home, BlogList, BlogDetail, Team
        ├── utils/          # api.js (Axios instance + all API calls)
        ├── config/         # firebase.js
        └── App.js          # All routes
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd mern-starter
npm install        # root (concurrently)
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment Variables

**Backend** — copy `backend/.env.example` → `backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern_starter
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

**Frontend** — copy `frontend/.env.example` → `frontend/.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

### 3. Setup Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project → Add Web App
3. Enable **Authentication** → Google provider
4. Enable **Storage** (for image uploads)
5. Copy config values to your `.env`

### 4. Run Development Servers

```bash
# From root — runs both simultaneously
npm run dev

# Or individually
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:3000
```

### 5. Create First Admin

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"admin123"}'
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |
| PUT | `/api/auth/profile` | Protected |

### Blogs
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/blogs` | Public (published only) |
| GET | `/api/blogs/slug/:slug` | Public |
| GET | `/api/blogs/admin/all` | Admin |
| GET | `/api/blogs/id/:id` | Admin |
| POST | `/api/blogs` | Admin |
| PUT | `/api/blogs/:id` | Admin |
| DELETE | `/api/blogs/:id` | Admin |

### Team
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/team` | Public (active only) |
| GET | `/api/team/:id` | Public |
| GET | `/api/team/admin/all` | Admin |
| POST | `/api/team` | Admin |
| PUT | `/api/team/:id` | Admin |
| DELETE | `/api/team/:id` | Admin |
| PATCH | `/api/team/:id/toggle` | Admin |

---

## 🖥 Admin Dashboard Pages

| Page | Route | Features |
|---|---|---|
| Login | `/admin/login` | Email/Password + Google OAuth |
| Dashboard | `/admin/dashboard` | Stats, recent blogs |
| Blogs | `/admin/blogs` | List, search, filter, paginate |
| Blog Form | `/admin/blogs/create` | Create/Edit with draft & publish |
| Team | `/admin/team` | Card grid, modal CRUD |
| Settings | `/admin/settings` | Profile update |

---

## 🌐 Public Pages

| Page | Route |
|---|---|
| Home | `/` |
| Blog List | `/blog` |
| Blog Detail | `/blog/:slug` |
| Team | `/team` |

---

## 🔐 Auth Flow

```
User submits email/password
    ↓
POST /api/auth/login
    ↓
Backend validates → generates JWT
    ↓
Frontend stores token in localStorage
    ↓
Axios interceptor attaches Bearer token to every request
    ↓
Backend middleware verifies token → grants access
    ↓
On 401 → auto-logout + redirect to /admin/login
```

---

## 📌 Adding New Features

1. **New Model** → `backend/models/NewModel.js`
2. **Controller** → `backend/controllers/newController.js`
3. **Routes** → `backend/routes/newRoutes.js` → register in `server.js`
4. **API calls** → add to `frontend/src/utils/api.js`
5. **Admin page** → `frontend/src/pages/admin/NewPage.js`
6. **Add nav item** → `frontend/src/components/layout/AdminLayout.js`
7. **Add route** → `frontend/src/App.js`
