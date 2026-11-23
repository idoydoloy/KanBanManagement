import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/mock-session";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({
    success: true,
    message: "Logout berhasil.",
    data: null,
  });
}
