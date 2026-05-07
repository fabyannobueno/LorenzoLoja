import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { syncCustomer } from "@/lib/publicApi";

interface CustomerAuthContextValue {
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  openAuthModal: (tab?: "login" | "register") => void;
  authModalOpen: boolean;
  authModalTab: "login" | "register";
  setAuthModalOpen: (v: boolean) => void;
  setAuthModalTab: (v: "login" | "register") => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

async function pushCustomerToApi(user: User, provider = "email") {
  try {
    const idToken = await user.getIdToken();
    await syncCustomer({
      idToken,
      firebase_uid: user.uid,
      name: user.displayName ?? user.email?.split("@")[0] ?? "Cliente",
      email: user.email!,
      phone: user.phoneNumber ?? null,
      photo_url: user.photoURL ?? null,
      provider,
    });
  } catch (err) {
    console.warn("[auth] syncCustomer falhou (não crítico):", err);
  }
}

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signUp(name: string, email: string, password: string) {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName: name });
    const updated = { ...newUser, displayName: name } as User;
    setUser(updated);
    await pushCustomerToApi(updated, "email");
  }

  async function signIn(email: string, password: string) {
    const { user: loggedIn } = await signInWithEmailAndPassword(auth, email, password);
    await pushCustomerToApi(loggedIn, "email");
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const { user: loggedIn } = await signInWithPopup(auth, provider);
    await pushCustomerToApi(loggedIn, "google");
  }

  async function logout() {
    await signOut(auth);
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  function openAuthModal(tab: "login" | "register" = "login") {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  }

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        logout,
        resetPassword,
        openAuthModal,
        authModalOpen,
        authModalTab,
        setAuthModalOpen,
        setAuthModalTab,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
}
