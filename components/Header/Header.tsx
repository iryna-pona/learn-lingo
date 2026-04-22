"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/firebase/auth";
import styles from "./Header.module.css";

export const Header = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

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

          {user && (
            <Link
              href="/favorites"
              className={`${styles.link} ${pathname === "/favorites" ? styles.active : ""}`}
            >
              Favorites
            </Link>
          )}
        </nav>  
      </div>
      <div className={styles.actions}>
        {user ? (
          <button onClick={handleLogout} className={styles.regBtn}>
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className={styles.loginBtn}
            >
              <div className={styles.loginIcon}>
                <Image src="/login/arrow.svg" alt="" width={12} height={11} />
                <Image src="/login/bracket.svg" alt="" width={7} height={17} />
              </div>
              <span>Log in</span>
            </button>

            <button
              onClick={() => router.push("/login?mode=register")}
              className={styles.regBtn}
            >
              Registration
            </button>
          </>
        )}
      </div>
    </header>
  );
};