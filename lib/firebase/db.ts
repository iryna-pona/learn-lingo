import { database } from "./firebase";
import { ref, get } from "firebase/database";
import { Teacher } from "@/types/teacher";

export const getTeachers = async (): Promise<(Teacher & { id: string })[]> => {
  const teachersRef = ref(database, "teachers");
  const snapshot = await get(teachersRef);

  if (!snapshot.exists()) return [];

  const dataObj = snapshot.val() as Record<string, Teacher>;

  const teachersArray = Object.entries(dataObj).map(([id, teacher]) => ({
    id,
    ...teacher,
  }));

  return teachersArray;
};