"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, registerSchema } from "@/validation/authSchemas";
import { loginUser, registerUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./AuthForm.module.css";

type AuthMode = "login" | "register";

interface Props {
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode?: () => void;
  redirectTo?: string;
}

interface FormData {
  name?: string;
  email: string;
  password: string;
}

export const AuthForm = ({
  mode,
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

  useEffect(() => {
    reset();
  }, [mode, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === "login") {
        await loginUser(data.email!, data.password!);
      } else {
        await registerUser(data.email!, data.password!);
      }

      reset();
      router.push(redirectTo || "/teachers");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
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
    </>
  );
};