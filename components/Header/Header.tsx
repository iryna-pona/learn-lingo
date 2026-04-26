"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/Modal/Modal";
import { AuthForm } from "@/components/Forms/AuthForm";
import styles from "./Header.module.css";

export const Header = () => {
  const { user } = useAuth();
  const { logout } = useLogout();

  const pathname = usePathname();

  const { type, open, isOpen, close, switchAuth } = useModal();
  const isAuthModal = type === "login" || type === "register";

  return (
    <>
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
            <button onClick={logout} className={styles.regBtn}>
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => open("login")}
                className={styles.loginBtn}
              >
                <div className={styles.loginIcon}>
                  <Image src="/login/arrow.svg" alt="" width={12} height={11} />
                  <Image src="/login/bracket.svg" alt="" width={7} height={17} />
                </div>
                <span>Log in</span>
              </button>

              <button
                onClick={() => open("register")}
                className={styles.regBtn}
              >
                Registration
              </button>
            </>
          )}
        </div>
      </header>

      <Modal
        isOpen={isOpen}
        onClose={close}
      >
        {isAuthModal && (
          <AuthForm
            mode={type}
            onSwitchMode={switchAuth}
            onClose={close}
          />
        )}
      </Modal>
    </>
  );
};