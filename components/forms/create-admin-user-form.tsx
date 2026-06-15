"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createAdminUser } from "@/lib/actions/admin-users";
import { ACTION_INITIAL_STATE } from "@/lib/actions/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateAdminUserForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    createAdminUser,
    ACTION_INITIAL_STATE
  );

  useEffect(() => {
    if (!state.success) return;

    formRef.current?.reset();
    router.refresh();
  }, [state.success, router]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      {state.message && (
        <p
          className={`rounded-xl px-3.5 py-2 text-sm font-medium ${state.success ? "border border-[#bdd2b7] bg-[#e6efe2] text-[#385f36]" : "border border-secondary/25 bg-secondary/10 text-secondary"}`}
        >
          {state.message}
        </p>
      )}
      <Input
        name="email"
        label="Usuário"
        type="text"
        required
        autoComplete="username"
        error={state.errors?.email?.[0]}
      />
      <Input
        name="password"
        label="Senha"
        type="password"
        required
        autoComplete="new-password"
        error={state.errors?.password?.[0]}
      />
      <Input
        name="confirmPassword"
        label="Confirmar senha"
        type="password"
        required
        autoComplete="new-password"
        error={state.errors?.confirmPassword?.[0]}
      />
      <Button type="submit" loading={pending}>
        Cadastrar administrador
      </Button>
    </form>
  );
}
