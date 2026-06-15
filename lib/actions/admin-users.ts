"use server";

import { Prisma } from "@prisma/client";
import { hashPassword, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAdminUserSchema } from "@/lib/validations/auth";
import type { ActionState } from "./types";

export async function getAllAdminUsers() {
  await requireAdmin();

  return prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, createdAt: true },
  });
}

export async function createAdminUser(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = createAdminUserSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do formulário.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const existing = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return {
      success: false,
      message: "Este e-mail já está cadastrado.",
      errors: { email: ["Este e-mail já está cadastrado."] },
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  try {
    await prisma.adminUser.create({
      data: {
        email: parsed.data.email,
        passwordHash,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "Este e-mail já está cadastrado.",
        errors: { email: ["Este e-mail já está cadastrado."] },
      };
    }

    throw error;
  }

  return {
    success: true,
    message: "Administrador cadastrado com sucesso.",
  };
}
