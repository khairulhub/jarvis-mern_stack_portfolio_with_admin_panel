import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════
   CODING DATA — 6 cards, each with tags + per-tag code
══════════════════════════════════════════════════════════ */
const CODING_CARDS = [
  {
    id: 1,
    icon: "ti-brand-react",
    title: "MERN Stack Setup",
    color: "#00e5ff",
    colorBg: "rgba(0,229,255,0.08)",
    colorBorder: "rgba(0,229,255,0.25)",
    shortDesc: "Full-stack MongoDB, Express, React & Node.js starter template.",
    tags: ["MongoDB", "Express", "React", "Node.js", "Mongoose", "dotenv", "CORS"],
    code: {
      MongoDB: {
        label: "MongoDB — Setup & Connection",
        lang: "js",
        snippet: `// 1. Install
// npm install mongoose

// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// .env
// MONGO_URI=mongodb://localhost:27017/myapp
// Or Atlas: MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/myapp`,
      },
      Express: {
        label: "Express — Server Bootstrap",
        lang: "js",
        snippet: `// npm install express cors dotenv

// server.js
const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const connectDB = require('./db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => res.send('API Running ✅'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server on port \${PORT}\`));`,
      },
      React: {
        label: "React — Vite Project Init",
        lang: "bash",
        snippet: `# Create React app with Vite
npm create vite@latest client -- --template react
cd client
npm install

# Install common deps
npm install axios react-router-dom react-hot-toast

# Folder structure
client/
├── src/
│   ├── api/         # axios instances
│   ├── components/  # shared UI
│   ├── pages/       # route pages
│   ├── hooks/       # custom hooks
│   ├── context/     # global state
│   └── App.jsx

# src/api/axios.js
import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api' });
export default API;`,
      },
      "Node.js": {
        label: "Node.js — Full Project Structure",
        lang: "bash",
        snippet: `# Init backend
mkdir server && cd server
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken

# Dev dependency
npm install -D nodemon

# package.json scripts
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}

# Folder structure
server/
├── config/      # db.js
├── controllers/ # logic
├── middleware/  # auth, error
├── models/      # mongoose schemas
├── routes/      # express routers
└── server.js`,
      },
      Mongoose: {
        label: "Mongoose — Model Example",
        lang: "js",
        snippet: `// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar:   { type: String, default: '' },
  },
  { timestamps: true }
);

// Hash password before save
const bcrypt = require('bcryptjs');
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);`,
      },
      dotenv: {
        label: "dotenv — Environment Variables",
        lang: "bash",
        snippet: `# .env  (never commit this file!)
PORT=5000
MONGO_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173

# .gitignore
node_modules/
.env
dist/

# Load in server.js (top of file)
# require('dotenv').config();

# Access anywhere
# process.env.PORT
# process.env.MONGO_URI
# process.env.JWT_SECRET`,
      },
      CORS: {
        label: "CORS — Configuration",
        lang: "js",
        snippet: `// npm install cors

// Option 1: Allow all (development)
app.use(cors());

// Option 2: Restrict to frontend origin (production)
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// For preflight
app.options('*', cors(corsOptions));`,
      },
    },
  },

  {
    id: 2,
    icon: "ti-brand-php",
    title: "Laravel Project",
    color: "#a855f7",
    colorBg: "rgba(168,85,247,0.08)",
    colorBorder: "rgba(168,85,247,0.25)",
    shortDesc: "Laravel starter — routing, auth, Eloquent models & migrations.",
    tags: ["Install", "Routing", "Eloquent", "Migration", "Sanctum", "Middleware", "Blade"],
    code: {
      Install: {
        label: "Laravel — Install & Setup",
        lang: "bash",
        snippet: `# Requirements: PHP >= 8.1, Composer

# Create project
composer create-project laravel/laravel my-app
cd my-app

# Serve locally
php artisan serve   # http://127.0.0.1:8000

# .env setup
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=my_app
DB_USERNAME=root
DB_PASSWORD=

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate`,
      },
      Routing: {
        label: "Laravel — Routing",
        lang: "php",
        snippet: `<?php
// routes/web.php   — for Blade views
Route::get('/', fn() => view('welcome'));
Route::get('/about', [PageController::class, 'about']);

// routes/api.php   — for REST API
Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user',  [UserController::class, 'me']);
        Route::apiResource('posts', PostController::class);
    });
});`,
      },
      Eloquent: {
        label: "Eloquent — Model & Relationships",
        lang: "php",
        snippet: `<?php
// app/Models/Post.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model {
    use HasFactory;

    protected $fillable = ['title', 'body', 'user_id', 'published'];

    protected $casts = ['published' => 'boolean'];

    // Relationships
    public function user()   { return $this->belongsTo(User::class); }
    public function tags()   { return $this->belongsToMany(Tag::class); }
    public function comments() { return $this->hasMany(Comment::class); }
}

// Usage in controller
$posts = Post::with('user', 'tags')
             ->where('published', true)
             ->latest()
             ->paginate(10);`,
      },
      Migration: {
        label: "Migration — Create Table",
        lang: "php",
        snippet: `<?php
// php artisan make:migration create_posts_table

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('body');
            $table->boolean('published')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('posts');
    }
};

// Run: php artisan migrate
// Rollback: php artisan migrate:rollback`,
      },
      Sanctum: {
        label: "Sanctum — API Auth",
        lang: "bash",
        snippet: `# Install
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"
php artisan migrate

# app/Models/User.php — add trait
# use Laravel\\Sanctum\\HasApiTokens;
# class User extends Authenticatable {
#     use HasApiTokens, HasFactory, Notifiable;

// AuthController.php
public function login(Request $request) {
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required',
    ]);
    if (!Auth::attempt($request->only('email','password'))) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    $token = $request->user()->createToken('api-token')->plainTextToken;
    return response()->json(['token' => $token]);
}

// Protected route usage — send header:
// Authorization: Bearer <token>`,
      },
      Middleware: {
        label: "Middleware — Custom Auth Check",
        lang: "php",
        snippet: `<?php
// php artisan make:middleware IsAdmin

namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;

class IsAdmin {
    public function handle(Request $request, Closure $next) {
        if ($request->user()?->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return $next($request);
    }
}

// Register in bootstrap/app.php (Laravel 11)
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias(['admin' => IsAdmin::class]);
})

// Use in route
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index']);
});`,
      },
      Blade: {
        label: "Blade — Template Syntax",
        lang: "html",
        snippet: `{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>@yield('title', 'MyApp')</title>
  @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
  @include('partials.nav')
  <main>@yield('content')</main>
</body>
</html>

{{-- resources/views/posts/index.blade.php --}}
@extends('layouts.app')
@section('title', 'Posts')
@section('content')
  @forelse($posts as $post)
    <article>
      <h2>{{ $post->title }}</h2>
      @if($post->published) <span>Live</span> @endif
    </article>
  @empty
    <p>No posts found.</p>
  @endforelse
  {{ $posts->links() }}
@endsection`,
      },
    },
  },

  {
    id: 3,
    icon: "ti-api",
    title: "API Integration",
    color: "#00ff88",
    colorBg: "rgba(0,255,136,0.08)",
    colorBorder: "rgba(0,255,136,0.25)",
    shortDesc: "REST & third-party API integration with Axios, fetch & error handling.",
    tags: ["Axios Setup", "Interceptors", "REST CRUD", "Error Handling", "React Query", "Env Config"],
    code: {
      "Axios Setup": {
        label: "Axios — Base Instance",
        lang: "js",
        snippet: `// npm install axios

// src/api/axiosInstance.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

export default API;`,
      },
      Interceptors: {
        label: "Axios — Response Interceptors",
        lang: "js",
        snippet: `// Refresh token / global error handler
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Auto-refresh on 401
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post('/api/auth/refresh', {
          refreshToken: localStorage.getItem('refreshToken'),
        });
        localStorage.setItem('token', data.token);
        original.headers.Authorization = \`Bearer \${data.token}\`;
        return API(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);`,
      },
      "REST CRUD": {
        label: "REST — CRUD Calls",
        lang: "js",
        snippet: `// src/api/posts.js
import API from './axiosInstance';

export const getPosts   = ()         => API.get('/posts');
export const getPost    = (id)       => API.get(\`/posts/\${id}\`);
export const createPost = (data)     => API.post('/posts', data);
export const updatePost = (id, data) => API.put(\`/posts/\${id}\`, data);
export const deletePost = (id)       => API.delete(\`/posts/\${id}\`);

// Usage in React component
import { getPosts } from '../api/posts';

const [posts, setPosts] = useState([]);
useEffect(() => {
  getPosts()
    .then(res => setPosts(res.data))
    .catch(err => console.error(err));
}, []);`,
      },
      "Error Handling": {
        label: "Error — Centralized Handler",
        lang: "js",
        snippet: `// src/utils/handleError.js
export function handleError(err) {
  if (err.response) {
    // Server responded with non-2xx
    const { status, data } = err.response;
    if (status === 400) return data.message || 'Bad request';
    if (status === 401) return 'Unauthorized — please login';
    if (status === 403) return 'Forbidden';
    if (status === 404) return 'Not found';
    if (status === 422) {
      // Laravel validation errors
      const errs = Object.values(data.errors || {}).flat();
      return errs.join(', ');
    }
    if (status >= 500) return 'Server error — try again later';
  }
  if (err.request) return 'No response from server';
  return err.message || 'Something went wrong';
}

// In component
import toast from 'react-hot-toast';
try {
  await createPost(formData);
  toast.success('Post created!');
} catch (err) {
  toast.error(handleError(err));
}`,
      },
      "React Query": {
        label: "React Query — Data Fetching",
        lang: "js",
        snippet: `// npm install @tanstack/react-query

// main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>

// In component
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, deletePost } from '../api/posts';

const { data, isLoading, isError } = useQuery({
  queryKey: ['posts'],
  queryFn: () => getPosts().then(r => r.data),
});

const qc = useQueryClient();
const deleteMutation = useMutation({
  mutationFn: deletePost,
  onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
});`,
      },
      "Env Config": {
        label: "Env — Vite / CRA Config",
        lang: "bash",
        snippet: `# Vite project — .env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_KEY=xxx

# Access in code
import.meta.env.VITE_API_URL

# CRA project — .env
REACT_APP_API_URL=http://localhost:5000/api

# Access in code
process.env.REACT_APP_API_URL

# .env.example (commit this, not .env)
VITE_API_URL=
VITE_FIREBASE_KEY=

# .gitignore
.env
.env.local
.env.production`,
      },
    },
  },

  {
    id: 4,
    icon: "ti-brand-firebase",
    title: "Firebase Integration",
    color: "#ff8c00",
    colorBg: "rgba(255,140,0,0.08)",
    colorBorder: "rgba(255,140,0,0.25)",
    shortDesc: "Firebase Auth, Firestore, Storage & Realtime DB in React.",
    tags: ["Init", "Auth", "Firestore", "Storage", "Realtime DB", "Security Rules"],
    code: {
      Init: {
        label: "Firebase — Init & Config",
        lang: "js",
        snippet: `// npm install firebase

// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth }        from 'firebase/auth';
import { getFirestore }   from 'firebase/firestore';
import { getStorage }     from 'firebase/storage';
import { getDatabase }    from 'firebase/database';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FB_API_KEY,
  authDomain:        import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MSG_ID,
  appId:             import.meta.env.VITE_FB_APP_ID,
  databaseURL:       import.meta.env.VITE_FB_DB_URL,
};

const app      = initializeApp(firebaseConfig);
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export const rtdb    = getDatabase(app);`,
      },
      Auth: {
        label: "Firebase Auth — Email & Google",
        lang: "js",
        snippet: `import { auth } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

// Register
export const register = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// Login
export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Google Sign-in
const provider = new GoogleAuthProvider();
export const googleLogin = () => signInWithPopup(auth, provider);

// Logout
export const logout = () => signOut(auth);

// Listen to auth state changes (React context)
onAuthStateChanged(auth, (user) => {
  if (user) console.log('Logged in:', user.uid);
  else       console.log('Logged out');
});`,
      },
      Firestore: {
        label: "Firestore — CRUD Operations",
        lang: "js",
        snippet: `import { db } from '../firebase/config';
import {
  collection, doc, addDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, onSnapshot,
} from 'firebase/firestore';

const postsRef = collection(db, 'posts');

// Create
const newPost = await addDoc(postsRef, {
  title: 'Hello', body: '...', uid: auth.currentUser.uid,
  createdAt: serverTimestamp(),
});

// Read one
const snap = await getDoc(doc(db, 'posts', postId));
const post = { id: snap.id, ...snap.data() };

// Read all (with filter)
const q = query(postsRef, where('uid','==', uid), orderBy('createdAt','desc'));
const snaps = await getDocs(q);
const posts = snaps.docs.map(d => ({ id: d.id, ...d.data() }));

// Update
await updateDoc(doc(db, 'posts', postId), { title: 'Updated' });

// Delete
await deleteDoc(doc(db, 'posts', postId));

// Real-time listener
onSnapshot(q, (snap) => setPosts(snap.docs.map(d => ({ id:d.id,...d.data() }))));`,
      },
      Storage: {
        label: "Firebase Storage — File Upload",
        lang: "js",
        snippet: `import { storage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

// Upload with progress
export function uploadFile(file, path, onProgress) {
  const fileRef = ref(storage, \`\${path}/\${Date.now()}_\${file.name}\`);
  const task    = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// Delete
export const deleteFile = (url) =>
  deleteObject(ref(storage, url));`,
      },
      "Realtime DB": {
        label: "Realtime DB — Live Data",
        lang: "js",
        snippet: `import { rtdb } from '../firebase/config';
import { ref, set, push, onValue, update, remove } from 'firebase/database';

// Write
await set(ref(rtdb, 'users/' + uid), { name, email, online: true });

// Push (auto-key for lists)
const newRef = await push(ref(rtdb, 'messages'), {
  text: 'Hello!', uid, timestamp: Date.now(),
});

// Real-time listener
const msgsRef = ref(rtdb, 'messages');
onValue(msgsRef, (snap) => {
  const data = snap.val();
  const msgs = data ? Object.entries(data).map(([k,v]) => ({ id:k,...v })) : [];
  setMessages(msgs);
});

// Update
await update(ref(rtdb, \`users/\${uid}\`), { online: false });

// Delete
await remove(ref(rtdb, \`messages/\${msgId}\`));`,
      },
      "Security Rules": {
        label: "Firestore Security Rules",
        lang: "js",
        snippet: `// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuth()           { return request.auth != null; }
    function isOwner(uid)       { return isAuth() && request.auth.uid == uid; }
    function isAdmin()          { return isAuth() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'; }

    // Users collection
    match /users/{uid} {
      allow read:   if isAuth();
      allow create: if isOwner(uid);
      allow update: if isOwner(uid) || isAdmin();
      allow delete: if isAdmin();
    }

    // Posts collection
    match /posts/{postId} {
      allow read:   if true;          // public
      allow create: if isAuth();
      allow update, delete: if isOwner(resource.data.uid) || isAdmin();
    }
  }
}`,
      },
    },
  },

  {
    id: 5,
    icon: "ti-lock",
    title: "JWT Auth System",
    color: "#facc15",
    colorBg: "rgba(250,204,21,0.08)",
    colorBorder: "rgba(250,204,21,0.25)",
    shortDesc: "Full JWT auth — sign, verify, refresh tokens & protected routes.",
    tags: ["Generate Token", "Middleware", "Refresh Token", "React Context", "Protected Route", "Cookie Auth"],
    code: {
      "Generate Token": {
        label: "JWT — Generate & Verify",
        lang: "js",
        snippet: `// npm install jsonwebtoken bcryptjs

// utils/jwt.js
const jwt = require('jsonwebtoken');

const ACCESS_SECRET  = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

exports.generateAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });

exports.generateRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

exports.verifyAccessToken = (token) =>
  jwt.verify(token, ACCESS_SECRET);

exports.verifyRefreshToken = (token) =>
  jwt.verify(token, REFRESH_SECRET);

// controllers/auth.js — Login
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const payload      = { id: user._id, role: user.role };
  const accessToken  = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.json({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email } });
};`,
      },
      Middleware: {
        label: "JWT — Auth Middleware",
        lang: "js",
        snippet: `// middleware/auth.js
const { verifyAccessToken } = require('../utils/jwt');

const protect = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token      = authHeader?.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ message: 'Token expired' });
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Role-based middleware
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Forbidden' });
  next();
};

module.exports = { protect, requireRole };

// Usage in routes
router.get('/admin', protect, requireRole('admin'), adminController.index);`,
      },
      "Refresh Token": {
        label: "JWT — Refresh Token Flow",
        lang: "js",
        snippet: `// Store refreshToken in httpOnly cookie for security

// On login — set cookie
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
});

// Refresh endpoint
const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded   = verifyRefreshToken(token);
    const newAccess = generateAccessToken({ id: decoded.id, role: decoded.role });
    res.json({ accessToken: newAccess });
  } catch {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};`,
      },
      "React Context": {
        label: "Auth Context — React",
        lang: "js",
        snippet: `// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/me')
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);`,
      },
      "Protected Route": {
        label: "Protected Route — React Router",
        lang: "js",
        snippet: `// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (role && user.role !== role)
    return <Navigate to="/unauthorized" replace />;

  return children;
}

// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

<BrowserRouter>
  <Routes>
    <Route path="/"       element={<Home />} />
    <Route path="/login"  element={<Login />} />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/admin" element={
      <ProtectedRoute role="admin">
        <AdminPanel />
      </ProtectedRoute>
    } />
  </Routes>
</BrowserRouter>`,
      },
      "Cookie Auth": {
        label: "Cookie Auth — Express Setup",
        lang: "js",
        snippet: `// npm install cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Also allow credentials in CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Frontend — send credentials with every request
// axiosInstance.js
const API = axios.create({
  baseURL:     import.meta.env.VITE_API_URL,
  withCredentials: true,  // ← sends cookies
});

// Auto-refresh interceptor
API.interceptors.response.use(null, async (err) => {
  if (err.response?.status === 401) {
    await API.post('/auth/refresh');   // cookie auto-sent
    return API(err.config);
  }
  return Promise.reject(err);
});`,
      },
    },
  },

  {
    id: 6,
    icon: "ti-brand-docker",
    title: "Docker / AWS Setup",
    color: "#ff3355",
    colorBg: "rgba(255,51,85,0.08)",
    colorBorder: "rgba(255,51,85,0.25)",
    shortDesc: "Containerise with Docker Compose & deploy to AWS EC2 / Nginx.",
    tags: ["Dockerfile", "Docker Compose", "Nginx", "EC2 Deploy", "GitHub Actions", "SSL Certbot"],
    code: {
      Dockerfile: {
        label: "Dockerfile — Node.js & React",
        lang: "dockerfile",
        snippet: `# ── Backend Dockerfile (server/Dockerfile) ──
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]

# ── Frontend Dockerfile (client/Dockerfile) ──
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=\$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
      },
      "Docker Compose": {
        label: "Docker Compose — Full Stack",
        lang: "yaml",
        snippet: `# docker-compose.yml
version: '3.9'

services:
  mongo:
    image: mongo:7
    restart: always
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: secret

  server:
    build: ./server
    restart: always
    ports:
      - "5000:5000"
    env_file: ./server/.env
    depends_on:
      - mongo
    environment:
      MONGO_URI: mongodb://root:secret@mongo:27017/myapp?authSource=admin

  client:
    build:
      context: ./client
      args:
        VITE_API_URL: http://localhost:5000/api
    restart: always
    ports:
      - "80:80"
    depends_on:
      - server

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - client

volumes:
  mongo_data:`,
      },
      Nginx: {
        label: "Nginx — Reverse Proxy Config",
        lang: "nginx",
        snippet: `# nginx/nginx.conf
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # React frontend
    location / {
        root  /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Node.js API proxy
    location /api/ {
        proxy_pass         http://server:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`,
      },
      "EC2 Deploy": {
        label: "AWS EC2 — Deploy Steps",
        lang: "bash",
        snippet: `# 1. Launch EC2 (Ubuntu 22.04 t2.micro)
#    Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# 3. Install Docker
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker

# 4. Install Docker Compose
sudo apt install -y docker-compose-plugin
docker compose version

# 5. Clone & run
git clone https://github.com/youruser/yourrepo.git
cd yourrepo
cp server/.env.example server/.env  # fill in values
docker compose up -d --build

# 6. Check status
docker compose ps
docker compose logs -f server

# 7. Point domain (Route 53 or any DNS)
#    A record → your-ec2-ip`,
      },
      "GitHub Actions": {
        label: "CI/CD — GitHub Actions",
        lang: "yaml",
        snippet: `# .github/workflows/deploy.yml
name: Deploy to EC2

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host:     \${{ secrets.EC2_HOST }}
          username: ubuntu
          key:      \${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/yourrepo
            git pull origin main
            docker compose down
            docker compose up -d --build
            docker image prune -f

# Add to GitHub → Settings → Secrets:
# EC2_HOST   = your-ec2-ip
# EC2_SSH_KEY = contents of your .pem file`,
      },
      "SSL Certbot": {
        label: "SSL — Let's Encrypt / Certbot",
        lang: "bash",
        snippet: `# On EC2 instance
# Stop nginx container first if running on 80
docker compose stop nginx

# Install Certbot
sudo apt install -y certbot

# Get certificate (standalone mode)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certs saved to:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem

# Mount into nginx container (docker-compose.yml):
# volumes:
#   - /etc/letsencrypt:/etc/letsencrypt:ro

# Restart
docker compose up -d nginx

# Auto-renew via cron
sudo crontab -e
# Add: 0 3 * * * certbot renew --quiet && docker compose restart nginx`,
      },
    },
  },
];

/* ══════════════════════════════════════════════════════════
   SYNTAX HIGHLIGHT  (lightweight, no external lib)
══════════════════════════════════════════════════════════ */
const KEYWORDS_JS  = /\b(const|let|var|function|return|async|await|import|export|default|from|if|else|try|catch|new|class|extends|this|null|true|false|undefined|require|module)\b/g;
const KEYWORDS_PHP = /\b(public|private|protected|function|return|class|new|use|namespace|if|else|foreach|echo|true|false|null|static|extends|implements|abstract)\b/g;
const KEYWORDS_SH  = /^(\$|#.*)/gm;
const STRINGS      = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
const COMMENTS     = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/#?|#[^\n]*)/g;
const NUMBERS      = /\b(\d+)\b/g;

function highlight(code, lang) {
  let h = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const wrap = (cls, s) => `<span style="color:${cls}">${s}</span>`;

  h = h.replace(COMMENTS, (m) => wrap("#546e7a", m));
  h = h.replace(STRINGS,  (m) => wrap("#a5d6a7", m));
  if (lang === "js" || lang === "ts")
    h = h.replace(KEYWORDS_JS, (m) => wrap("#80cbc4", m));
  if (lang === "php")
    h = h.replace(KEYWORDS_PHP, (m) => wrap("#80cbc4", m));
  h = h.replace(NUMBERS, (m) => wrap("#ffcc80", m));

  return h;
}

/* ══════════════════════════════════════════════════════════
   COPY BUTTON
══════════════════════════════════════════════════════════ */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={copy}
      title="Copy code"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 12px",
        borderRadius: 6,
        background: copied ? "rgba(0,255,136,0.12)" : "rgba(0,229,255,0.08)",
        border: `1px solid ${copied ? "rgba(0,255,136,0.3)" : "rgba(0,229,255,0.2)"}`,
        color: copied ? "#00ff88" : "#00e5ff",
        fontSize: 11,
        cursor: "pointer",
        fontFamily: "'Share Tech Mono', monospace",
        letterSpacing: 1,
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} style={{ fontSize: 13 }} />
      {copied ? "COPIED!" : "COPY"}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════════ */
function CodeModal({ card, onClose }) {
  const [activeTag, setActiveTag] = useState(card.tags[0]);

  /* lock scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const tagData = card.code[activeTag];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "12px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "min(860px, 96vw)",
          maxHeight: "94vh",
          background: "#080e1a",
          border: `1px solid ${card.colorBorder}`,
          borderRadius: 14,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: `0 0 60px ${card.colorBg}`,
        }}
      >
        {/* ── modal header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid rgba(0,229,255,0.1)",
          background: "#04080f",
          flexShrink: 0,
          flexWrap: "wrap",
          gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: card.colorBg, border: `1px solid ${card.colorBorder}`,
              color: card.color, fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className={`ti ${card.icon}`} />
            </div>
            <div>
              <div style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 13, fontWeight: 700,
                color: card.color, letterSpacing: 2,
              }}>
                {card.title}
              </div>
              <div style={{
                fontSize: 11, color: "#6a9bbf",
                fontFamily: "'Share Tech Mono', monospace",
              }}>
                {tagData.label}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none",
              color: "#2a4a6a", cursor: "pointer", fontSize: 22, lineHeight: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00e5ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#2a4a6a")}
          >
            <i className="ti ti-x" />
          </button>
        </div>

        {/* ── tag strip ── */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 6,
          padding: "12px 16px",
          borderBottom: "1px solid rgba(0,229,255,0.08)",
          background: "#04080f",
          flexShrink: 0,
        }}>
          {card.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                padding: "5px 13px",
                borderRadius: 999,
                background: activeTag === tag ? card.colorBg : "transparent",
                border: `1px solid ${activeTag === tag ? card.colorBorder : "rgba(0,229,255,0.12)"}`,
                color: activeTag === tag ? card.color : "#6a9bbf",
                fontSize: 11,
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: 1,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* ── code area ── */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
          {/* code header bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 16px",
            background: "#0a1520",
            borderBottom: "1px solid rgba(0,229,255,0.06)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#ff5f57","#febc2e","#28c840"].map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
              <span style={{
                marginLeft: 8,
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 10, color: "#2a4a6a", letterSpacing: 2,
              }}>
                {tagData.lang.toUpperCase()}
              </span>
            </div>
            <CopyButton text={tagData.snippet} />
          </div>

          {/* code block */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "auto", padding: "16px 20px" }}>
            <pre
              style={{
                fontFamily: "'Share Tech Mono', 'Courier New', monospace",
                fontSize: 13,
                lineHeight: 1.75,
                color: "#c8e8f8",
                margin: 0,
                whiteSpace: "pre",
                minWidth: "max-content",
              }}
              dangerouslySetInnerHTML={{
                __html: highlight(tagData.snippet, tagData.lang),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CODING SECTION
══════════════════════════════════════════════════════════ */
 const Coding =() => {
  const [openCard, setOpenCard] = useState(null);
  const fadeRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("fade-visible");
        }),
      { threshold: 0.08 }
    );
    const els = fadeRef.current?.querySelectorAll(".fade-in");
    els?.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {openCard && (
        <CodeModal card={openCard} onClose={() => setOpenCard(null)} />
      )}

      <section
        id="coding"
        style={{ background: "#080e1a", padding: "80px 0 60px" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>

          {/* section header */}
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10, letterSpacing: 3,
            color: "#2a4a6a", marginBottom: 10,
          }}>
            // CODE_REFERENCE.JS
          </div>
          <div style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 26, fontWeight: 700,
            color: "#00e5ff", letterSpacing: 4, marginBottom: 8,
          }}>
            CODING REFERENCE
          </div>
          <div style={{
            width: 60, height: 2,
            background: "linear-gradient(90deg,#00e5ff,transparent)",
            marginBottom: 10,
          }} />
          <p style={{
            fontSize: 13, color: "#6a9bbf",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: 1, marginBottom: 40,
          }}>
            // Click any card to explore setup guides &amp; copy-ready code snippets
          </p>

          {/* grid */}
          <div
            ref={fadeRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
              gap: 18,
            }}
          >
            {CODING_CARDS.map((card, i) => (
              <div
                key={card.id}
                className="fade-in"
                onClick={() => setOpenCard(card)}
                style={{
                  background: "#0c1422",
                  border: `1px solid ${card.colorBorder}`,
                  borderRadius: 12,
                  padding: 20,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                  animationDelay: `${i * 0.07}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 8px 32px ${card.colorBg}`;
                  e.currentTarget.style.borderColor = card.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = card.colorBorder;
                }}
              >
                {/* top accent line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${card.color}, transparent)`,
                }} />

                {/* icon + title row */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: card.colorBg, border: `1px solid ${card.colorBorder}`,
                    color: card.color, fontSize: 20,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <i className={`ti ${card.icon}`} />
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: 12, fontWeight: 700,
                      color: card.color, letterSpacing: 2,
                    }}>
                      {card.title}
                    </div>
                    <div style={{
                      fontSize: 9, color: "#2a4a6a",
                      fontFamily: "'Share Tech Mono', monospace",
                      letterSpacing: 1, marginTop: 2,
                    }}>
                      {card.tags.length} TOPICS
                    </div>
                  </div>
                </div>

                {/* description */}
                <p style={{
                  fontSize: 12, color: "#6a9bbf",
                  lineHeight: 1.7, marginBottom: 14,
                }}>
                  {card.shortDesc}
                </p>

                {/* tag pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                  {card.tags.map((t) => (
                    <span key={t} style={{
                      padding: "2px 9px", borderRadius: 999,
                      background: card.colorBg,
                      border: `1px solid ${card.colorBorder}`,
                      color: card.color,
                      fontSize: 9,
                      fontFamily: "'Share Tech Mono', monospace",
                      letterSpacing: 0.5,
                    }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* footer */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  paddingTop: 12,
                  borderTop: "1px solid rgba(0,229,255,0.06)",
                }}>
                  <span style={{
                    fontSize: 10, color: "#2a4a6a",
                    fontFamily: "'Share Tech Mono', monospace",
                    letterSpacing: 1,
                  }}>
                    // CLICK TO EXPLORE
                  </span>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4,
                    fontSize: 10, color: card.color,
                    fontFamily: "'Share Tech Mono', monospace",
                  }}>
                    <span>VIEW CODE</span>
                    <i className="ti ti-arrow-right" style={{ fontSize: 13 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Coding;
