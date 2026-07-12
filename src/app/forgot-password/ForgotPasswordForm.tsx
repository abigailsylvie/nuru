"use client";

import { useActionState } from "react";
import { requestPasswordReset, type ForgotPasswordState } from "./actions";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<ForgotPasswordState, FormData>(
    requestPasswordReset,
    null,
  );

  if (state?.success) {
    return (
      <div className="mt-8 rounded-xl border border-teal/30 bg-teal/5 p-6 text-center">
        <p className="font-display text-base font-semibold text-teal-dim">
          Check your email
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          If an account exists for that email, we&apos;ve sent a link to reset your password.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label
          htmlFor="email"
          className="text-xs font-medium uppercase tracking-wide text-ink-soft"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
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
        {pending ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}