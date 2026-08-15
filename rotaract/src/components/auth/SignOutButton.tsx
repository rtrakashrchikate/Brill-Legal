"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { clearSessionCache } from "@/lib/auth/useSession";

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      variant="glass"
      size="sm"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/auth/logout", { method: "POST" });
        clearSessionCache();
        router.replace("/");
        router.refresh();
      }}
    >
      {busy ? "Signing out…" : "Sign out"}
    </Button>
  );
}
