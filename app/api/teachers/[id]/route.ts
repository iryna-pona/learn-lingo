import { NextRequest, NextResponse } from "next/server";
import { ref, get } from "firebase/database";
import { db } from "../../firebase/db";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _req: NextRequest,
  { params }: Params
) {
  const { id } = await params;

  const snapshot = await get(ref(db, `teachers/${id}`));

  if (!snapshot.exists()) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id,
    ...snapshot.val(),
  });
}