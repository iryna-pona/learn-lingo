import { NextRequest, NextResponse } from "next/server";
import { ref, get } from "firebase/database";
import { db } from "../firebase/db";
import { Teacher } from "@/types/teacher";

type TeacherFromDB = Omit<Teacher, "id">

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const language = params.get("language") ?? "";
  const level = params.get("level") ?? "";
  const price = params.get("price") ?? "";

  const page = Number(params.get("page") ?? 1);
  const limit = Number(params.get("limit") ?? 4);

  const snapshot = await get(ref(db, "teachers"));

  if (!snapshot.exists()) {
    return NextResponse.json({ data: [], hasMore: false });
  }

  const data = snapshot.val();

  const allTeachers: Teacher[] = Object.entries(data).map(
    ([id, value]) => ({
      id,
      ...(value as TeacherFromDB),
    })
  );

  const filtered = allTeachers.filter((t) => {
    if (language && !t.languages.includes(language)) return false;

    if (level && !t.levels.some((l) => l.startsWith(level)))
      return false;

    if (price && t.price_per_hour !== Number(price)) return false;

    return true;
  });

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    data: paginated,
    hasMore: start + limit < filtered.length,
  });
}