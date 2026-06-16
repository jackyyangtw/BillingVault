"use client";

import { LoaderCircle, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type LoginFormActionsProps = {
  pending: boolean;
  demoPending: boolean;
  demoFormAction?: (formData: FormData) => void;
};

export default function LoginFormActions({
  pending,
  demoPending,
  demoFormAction,
}: LoginFormActionsProps) {
  if (demoFormAction) {
    return (
      <Button
        type="submit"
        size="lg"
        className="w-full bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400"
        disabled={pending || demoPending}
        formAction={demoFormAction}
      >
        {demoPending ? (
          <LoaderCircle data-icon="inline-start" className="animate-spin" />
        ) : (
          <Sparkles data-icon="inline-start" />
        )}
        一鍵登入 Demo
      </Button>
    );
  }

  return (
    <Button type="submit" size="lg" disabled={pending || demoPending}>
      {pending ? (
        <LoaderCircle data-icon="inline-start" className="animate-spin" />
      ) : (
        <LogIn data-icon="inline-start" />
      )}
      登入
    </Button>
  );
}
