"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createAdminSession,
  destroyAdminSession,
  verifyPassword,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import type { ActionState } from "./types";

export async function loginAdmin(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Credenciais inválidas.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email },
  });

  if (!admin) {
    return { success: false, message: "E-mail ou senha incorretos." };
  }

  const valid = await verifyPassword(parsed.data.password, admin.passwordHash);
  if (!valid) {
    return { success: false, message: "E-mail ou senha incorretos." };
  }

  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function logoutAdmin() {
  await destroyAdminSession();
  redirect("/admin/login");
}
