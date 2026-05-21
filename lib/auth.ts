import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const SESSION_COOKIE = "das_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "das-viaturas-dev-secret";
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(adminId: string) {
  const cookieStore = await cookies();
  const token = Buffer.from(`${adminId}:${getSessionSecret()}`).toString("base64url");
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
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
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [adminId, secret] = decoded.split(":");
    if (!adminId || secret !== getSessionSecret()) return null;

    const admin = await prisma.adminUser.findUnique({ where: { id: adminId } });
    return admin;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}
