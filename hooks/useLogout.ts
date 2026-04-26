"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/firebase/auth";
import { useFavoritesStore } from "@/store/favoritesStore";

export const useLogout = () => {
  const router = useRouter();
  const { clearFavorites } = useFavoritesStore();

  const logout = async () => {
    try {
      await logoutUser();
      clearFavorites();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { logout };
};