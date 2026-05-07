import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import api from "@/lib/api";
import type { User, Permission } from "@/types";

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const { data } = await api.get<{ success: boolean; data: User }>("/auth/me");
          setUser(data.data);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await api.post("/auth/sync", {
      name: cred.user.displayName ?? "Usuário",
      email: cred.user.email,
      phone: cred.user.phoneNumber ?? undefined,
    });
    const { data } = await api.get<{ success: boolean; data: User }>("/auth/me");
    setUser(data.data);
  }

  async function logout() {
    await api.post("/auth/logout").catch(() => {});
    await signOut(auth);
    setUser(null);
  }

  function hasPermission(permission: Permission): boolean {
    if (!user) return false;
    if (user.role === "owner") return true;
    return user.permissions.includes(permission);
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
