import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  auth, googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "../config/firebase";
import { loginAdmin, firebaseLoginAPI, getMe } from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount — restore session from localStorage JWT
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await getMe();
          setUser(res.user);
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  // ── Helper: save JWT + user from backend response ──────────
  const saveSession = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // ── 1. Email/Password login → MongoDB + JWT ────────────────
  const login = useCallback(async (email, password) => {
    const res = await loginAdmin({ email, password });
    saveSession(res.token, res.user);
    return res;
  }, []);

  // ── 2. Firebase Email/Password login ──────────────────────
  // Signs in with Firebase, gets idToken, sends to backend → JWT
  const loginWithFirebaseEmail = useCallback(async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await credential.user.getIdToken();
    const res = await firebaseLoginAPI(idToken);
    saveSession(res.token, res.user);
    return res;
  }, []);

  // ── 3. Firebase Email/Password register ───────────────────
  const registerWithFirebaseEmail = useCallback(async (email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await credential.user.getIdToken();
    const res = await firebaseLoginAPI(idToken);
    saveSession(res.token, res.user);
    return res;
  }, []);

  // ── 4. Google OAuth login ─────────────────────────────────
  // Opens Google popup, gets idToken, sends to backend → JWT
  const loginWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    const res = await firebaseLoginAPI(idToken);
    saveSession(res.token, res.user);
    return res;
  }, []);

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try { await firebaseSignOut(auth); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{
      user, loading, isAuthenticated, isAdmin,
      login,
      loginWithFirebaseEmail,
      registerWithFirebaseEmail,
      loginWithGoogle,
      logout,
      setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
