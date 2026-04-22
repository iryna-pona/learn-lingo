"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFavoritesStore } from "@/store/favoritesStore";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { loadFavorites } = useFavoritesStore();

  useEffect(() => {
    if (user?.uid) {
      loadFavorites(user.uid);
    }
  }, [user, loadFavorites]);

  return <>{children}</>;
};                                