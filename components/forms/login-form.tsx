"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/lib/actions/auth";
import type { ActionState } from "@/lib/actions/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: ActionState = { success: false, message: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.message && !state.success && (
        <p className="rounded-xl border border-secondary/25 bg-secondary/10 px-3.5 py-2 text-sm font-medium text-secondary">
          {state.message}
        </p>
      )}
      <Input
        name="email"
        label="E-mail"
        type="email"
        required
        autoComplete="email"
        error={state.errors?.email?.[0]}
      />
      <Input
        name="password"
        label="Senha"
        type="password"
        required
        autoComplete="current-password"
        error={state.errors?.password?.[0]}
      />
      <Button type="submit" fullWidth loading={pending}>
        Entrar
      </Button>
    </form>
  );
}
