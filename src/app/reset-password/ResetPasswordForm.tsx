"use client";

import { useActionState } from "react";
import { updatePassword, type ResetPasswordState } from "./actions";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState<ResetPasswordState, FormData>(
    updatePassword,
    null,
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label
          htmlFor="password"
          className="text-xs font-medium uppercase tracking-wide text-ink-soft"
        >
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="••••••••"
          className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink transition-colors hover:border-ink/30"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-xs font-medium uppercase tracking-wide text-ink-soft"
        >
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="••••••••"
          className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink transition-colors hover:border-ink/30"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-xs text-clay">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-teal px-4 py-3 text-sm font-medium text-paper transition-all duration-200 hover:bg-teal-dim disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : "Set new password"}
      </button>
    </form>
  );
}