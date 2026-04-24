"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, registerSchema } from "./validationSchemas";
import { loginUser, registerUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./AuthModal.module.css";

type AuthMode = "login" | "register";

interface Props {
  mode: AuthMode;
  onClose: () => void;
  isOpen: boolean;
  onSwitchMode?: () => void;
  redirectTo?: string;
}

interface FormData {
  name?: string;
  email: string;
  password: string;
}

export const AuthModal = ({
  mode,
  onClose,
  isOpen,
  onSwitchMode,
  redirectTo,
}: Props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(mode === "login" ? loginSchema : registerSchema),
    mode: "onBlur",
  });

  // ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // reset при закритті
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === "login") {
        await loginUser(data.email!, data.password!);
      } else {
        await registerUser(data.email!, data.password!);
      }

      reset();

      // 🔥 редірект після успіху
      router.push(redirectTo || "/teachers");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };
console.log(onSwitchMode);
  return (
    <div
      className={`${styles.backdrop} ${isOpen ? styles.show : ""}`}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>

        <h2 className={styles.title}>
          {mode === "login" ? "Log In" : "Registration"}
        </h2>

        <p className={styles.text}>
          {mode === "login"
            ? "Welcome back! Please enter your credentials."
            : "Create your account below."}
        </p>

        <form
          key={mode}
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          autoComplete="off"
        >
          {mode === "register" && (
            <div>
              <input
                type="text"
                placeholder="Name"
                className={`${styles.input} ${
                  errors.name ? styles.inputError : ""
                }`}
                {...register("name")}
              />
              {errors.name && (
                <p className={styles.error}>
                  {errors.name.message}
                </p>
              )}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email*"
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className={styles.error}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password*"
              className={`${styles.input} ${
                errors.password ? styles.inputError : ""
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className={styles.error}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button type="submit" className={styles.submitBtn}>
            {mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        {/* 🔥 ПЕРЕМИКАННЯ */}
        <p className={styles.switchText}>
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={onSwitchMode}
                className={styles.switchBtn}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchMode}
                className={styles.switchBtn}
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};