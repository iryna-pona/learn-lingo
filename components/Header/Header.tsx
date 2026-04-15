"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AuthModal } from "@/components/Modals/AuthModal";
import styles from "./Header.module.css";

export const Header = () => {
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);
  const pathname = usePathname();

  const openLogin = () => setAuthMode("login");
  const openRegister = () => setAuthMode("register");
  const closeModal = () => setAuthMode(null);

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <Link href="/" className={styles.logo}>
          <div className={styles.flagIcon}>
            <Image
              src="/logo/botUkraine.svg"
              alt=""
              fill
              className={styles.yellow}
            />
            <Image
              src="/logo/topUkraine.svg"
              alt=""
              fill
              className={styles.blue}
            />
          </div>
          <span>LearnLingo</span>
        </Link>
        <nav className={styles.nav}>
          <Link
            href="/"
            className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
          >
            Home
          </Link>
          <Link
            href="/teachers"
            className={`${styles.link} ${pathname === "/teachers" ? styles.active : ""}`}
          >
            Teachers
          </Link>
        </nav>  
      </div>
      <div className={styles.actions}>
        <button onClick={openLogin} className={styles.loginBtn}>
          <div className={styles.loginIcon}>
            <Image
              src="/login/arrow.svg"
              alt=""
              width={12}
              height={11}
            />
            <Image
              src="/login/bracket.svg"
              alt=""
              width={7}
              height={17}
            />
          </div>
          <span>Log in</span>
        </button>
        <button onClick={openRegister} className={styles.regBtn}>Registration</button>
      </div>

      {authMode && <AuthModal mode={authMode} onClose={closeModal} isOpen={!!authMode} />}
    </header>
  );
};