import { api } from "./api";
import { Teacher } from "@/types/teacher";

export const getFavorites = async (userId: string): Promise<string[]> => {
  const res = await api.get("/favorites", {
    params: { userId },
  });

  return res.data.data;
};

export const addFavorite = async (
  userId: string,
  teacherId: string
) => {
  await api.post("/favorites", {
    userId,
    teacherId,
  });
};

export const removeFavorite = async (
  userId: string,
  teacherId: string
) => {
  await api.delete("/favorites", {
    data: { userId, teacherId },
  });
};

export const getFavoriteTeachers = async (
  userId: string
): Promise<Teacher[]> => {
  const res = await api.get("/favorites/teachers", {
    params: { userId },
  });

  return res.data.data;
};