import { database } from "./firebase";
import { ref, set, remove, get, query, orderByKey, limitToFirst, startAfter } from "firebase/database";
import { Teacher } from "@/types/teacher";

export const getTeachers = async (
  limitCount: number,
  lastKey?: string
): Promise<{ data: (Teacher & { id: string })[]; lastKey: string | null }> => {

  const teachersRef = ref(database, "teachers");

  let q;

  if (lastKey) {
    q = query(
      teachersRef,
      orderByKey(),
      startAfter(lastKey),
      limitToFirst(limitCount)
    );
  } else {
    q = query(
      teachersRef,
      orderByKey(),
      limitToFirst(limitCount)
    );
  }

  const snapshot = await get(q);

  if (!snapshot.exists()) {
    return { data: [], lastKey: null };
  }

  const dataObj = snapshot.val() as Record<string, Teacher>;

  const data = Object.entries(dataObj).map(([id, teacher]) => ({
    ...teacher,
    id,
  }));

  const keys = Object.keys(dataObj);
  const lastKeyResult = keys.length > 0 ? keys[keys.length - 1] : null;

  return {
    data,
    lastKey: lastKeyResult,
  };
};

export const getTeacherById = async (
  id: string
): Promise<Teacher | null> => {
  const snapshot = await get(ref(database, `teachers/${id}`));

  if (!snapshot.exists()) return null;

  return {
    id,
    ...snapshot.val(),
  };
};

export const getTeachersByIds = async (
  ids: string[]
): Promise<(Teacher & { id: string })[]> => {
  if (!ids.length) return [];

  const snapshot = await get(ref(database, "teachers"));

  if (!snapshot.exists()) return [];

  const data = snapshot.val() as Record<string, Teacher>;

  return ids
    .map((id) => {
      if (!data[id]) return null;

      return {
        ...data[id],
        id,
      };
    })
    .filter(Boolean) as (Teacher & { id: string })[];
};

export const addFavorite = async (userId: string, teacherId: string) => {
  await set(ref(database, `users/${userId}/favorites/${teacherId}`), true);
};

export const removeFavorite = async (userId: string, teacherId: string) => {
  await remove(ref(database, `users/${userId}/favorites/${teacherId}`));
};

export const getFavorites = async (userId: string): Promise<string[]> => {
  const snapshot = await get(ref(database, `users/${userId}/favorites`));

  if (!snapshot.exists()) return [];

  return Object.keys(snapshot.val());
};