"use client";

import { useState } from "react";
import { AuthModal } from "@/components/Modals/AuthModal";
import styles from "./Header.module.css";

export const Header = () => {
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);

  const openLogin = () => setAuthMode("login");
  const openRegister = () => setAuthMode("register");
  const closeModal = () => setAuthMode(null);

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>Learn Lingo</h1>
      <nav className={styles.nav}>
        <button onClick={openLogin} className={styles.navBtn}>Login</button>
        <button onClick={openRegister} className={styles.navBtn}>Register</button>
      </nav>

      {authMode && <AuthModal mode={authMode} onClose={closeModal} />}
    </header>
  );
};