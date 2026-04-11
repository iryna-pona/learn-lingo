import { database } from "./firebase";
import { ref, get, query, orderByKey, limitToFirst, startAfter } from "firebase/database";
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