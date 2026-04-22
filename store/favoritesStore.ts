import { create } from "zustand";
import { addFavorite, removeFavorite, getFavorites } from "@/lib/firebase/db";
import { Teacher } from "@/types/teacher";

interface FavoritesState {
  favorites: string[];
  isLoading: boolean;

  teachersCache: Record<string, Teacher>;

  loadFavorites: (userId: string) => Promise<void>;
  toggleFavorite: (userId: string, teacherId: string) => Promise<void>;
  setTeachersCache: (teachers: (Teacher & { id: string })[]) => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  teachersCache: {},

  setTeachersCache: (teachers) => {
    const cache: Record<string, Teacher> = {};

    teachers.forEach((t) => {
      cache[t.id] = t;
    });

    set({ teachersCache: cache });
  },

  loadFavorites: async (userId) => {
    set({ isLoading: true });

    const data = await getFavorites(userId);

    set({
      favorites: data,
      isLoading: false,
    });
  },

  toggleFavorite: async (userId, teacherId) => {
    const { favorites } = get();

    const isExist = favorites.includes(teacherId);

    if (isExist) {
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