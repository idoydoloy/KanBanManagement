import { cookies } from "next/headers";
import mockDb from "@/data/mock-db.json";
import { User } from "@/types/auth";

const SESSION_COOKIE_NAME = "kanban_session";

export async function getCurrentUserFromCookie(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return null;

  const user = mockDb.users.find((u) => u.id === sessionCookie.value);
  if (!user) return null;

  const { password, ...safeUser } = user;
  return safeUser as User;
}

export async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
