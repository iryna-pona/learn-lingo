import { NextRequest, NextResponse } from "next/server";
import { ref, get, set, remove } from "firebase/database";
import { db } from "../firebase/db";
import { Teacher } from "@/types/teacher";

type FavoriteRequest = {
  userId: string;
  teacherId: string;
};

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const includeTeachers = req.nextUrl.searchParams.get("includeTeachers");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId" },
      { status: 400 }
    );
  }

  const favSnap = await get(ref(db, `favorites/${userId}`));

  if (!favSnap.exists()) {
    return NextResponse.json({ data: [] });
  }

  const favIds = Object.keys(favSnap.val());

  if (!includeTeachers) {
    return NextResponse.json({ data: favIds });
  }

  const teachersSnap = await get(ref(db, "teachers"));

  if (!teachersSnap.exists()) {
    return NextResponse.json({ data: [] });
  }

  const teachersData = teachersSnap.val();

  const result: Teacher[] = Object.entries(teachersData)
    .filter(([id]) => favIds.includes(id))
    .map(([id, value]) => ({
      id,
      ...(value as Omit<Teacher, "id">),
    }));

  return NextResponse.json({ data: result });
}

export async function POST(req: NextRequest) {
  const body: FavoriteRequest = await req.json();

  const { userId, teacherId } = body;

  if (!userId || !teacherId) {
    return NextResponse.json(
      { error: "Missing params" },
      { status: 400 }
    );
  }

  await set(ref(db, `favorites/${userId}/${teacherId}`), true);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const body: FavoriteRequest = await req.json();

  const { userId, teacherId } = body;

  if (!userId || !teacherId) {
    return NextResponse.json(
      { error: "Missing params" },
      { status: 400 }
    );
  }

  await remove(ref(db, `favorites/${userId}/${teacherId}`));

  return NextResponse.json({ success: true });
}