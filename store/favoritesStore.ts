import { create } from "zustand";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/lib/api/favorites";

type Store = {
  favorites: string[];
  loadFavorites: (userId: string) => Promise<void>;
  toggleFavorite: (userId: string, teacherId: string) => Promise<void>;
};

export const useFavoritesStore = create<Store>((set, get) => ({
  favorites: [],

  loadFavorites: async (userId) => {
    const ids = await getFavorites(userId);
    set({ favorites: ids });
  },

  toggleFavorite: async (userId, teacherId) => {
    const { favorites } = get();

    const isFav = favorites.includes(teacherId);

    if (isFav) {
      await removeFavorite(userId, teacherId);
      set({
        favorites: favorites.filter((id) => id !== teacherId),
      });
    } else {
      await addFavorite(userId, teacherId);
      set({
        favorites: [...favorites, teacherId],
      });
    }
  },
}));