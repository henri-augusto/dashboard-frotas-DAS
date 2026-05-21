"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function RefreshDashboardButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    router.refresh();
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      loading={loading}
      onClick={handleRefresh}
    >
      Atualizar página
    </Button>
  );
}
