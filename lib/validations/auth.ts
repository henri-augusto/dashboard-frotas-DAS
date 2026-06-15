import { z } from "zod";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Usuário deve ter no mínimo 3 caracteres")
  .max(50, "Usuário muito longo")
  .regex(
    /^[a-zA-Z0-9._-]+$/,
    "Use apenas letras, números, ponto, hífen ou underscore"
  );

export const loginSchema = z.object({
  email: usernameSchema,
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const createAdminUserSchema = z
  .object({
    email: usernameSchema,
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
