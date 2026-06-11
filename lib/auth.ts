import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { SESSION_COOKIE } from "./session-constants";
import {
  SESSION_MAX_AGE_SEC,
  signSessionToken,
  verifySessionToken,
} from "./session-token";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(adminId: string) {
  const cookieStore = await cookies();
  const token = await signSessionToken(adminId);
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SEC,
    path: "/",
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const verified = await verifySessionToken(token);
  if (!verified) return null;

  const admin = await prisma.adminUser.findUnique({
    where: { id: verified.adminId },
  });
  return admin;
}

export async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}
