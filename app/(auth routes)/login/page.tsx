"use client";

import { useState } from "react";
import { AuthModal } from "@/components/Modals/AuthModal";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">(
    searchParams.get("mode") === "register" ? "register" : "login"
  );
  const redirect = searchParams.get("redirect");

  // якщо вже залогінений → назад
  useEffect(() => {
    if (user) {
      router.push("/teachers");
    }
  }, [user, router]);

  return (
    <AuthModal
      mode={mode}
      isOpen={true}
      onClose={() => router.push("/")}
      onSwitchMode={() =>
        setMode(mode === "login" ? "register" : "login")
      }
      redirectTo={redirect ?? undefined}
    />
  );
}