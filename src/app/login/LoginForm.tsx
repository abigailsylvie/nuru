"use client";

import { useActionState, useState } from "react";
import { login, signup, type AuthState } from "./actions";
import Link from "next/link";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginState, loginAction, loginPending] = useActionState<
    AuthState,
    FormData
  >(login, null);
  const [signupState, signupAction, signupPending] = useActionState<
    AuthState,
    FormData
  >(signup, null);

  const state = mode === "login" ? loginState : signupState;
  const pending = mode === "login" ? loginPending : signupPending;
  const action = mode === "login" ? loginAction : signupAction;

  return (
    <div>
      <div className="mb-6 flex rounded-full border border-line bg-paper p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full py-1.5 font-medium transition-colors ${
            mode === "login" ? "bg-ink text-paper" : "text-ink-soft"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-full py-1.5 font-medium transition-colors ${
            mode === "signup" ? "bg-ink text-paper" : "text-ink-soft"
          }`}
        >
          Sign up
        </button>
      </div>

      <form action={action} className="space-y-4">
        {mode === "signup" && (
          <>
            <div>
              <label
                htmlFor="fullName"
                className="text-xs font-medium uppercase tracking-wide text-ink-soft"
              >
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder="Aïssatou Diop"
                className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink transition-colors hover:border-ink/30"
              />
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                I am a
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-ink has-[:checked]:border-teal has-[:checked]:bg-teal/5">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    defaultChecked
                    className="accent-teal"
                  />
                  Student
                </label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-ink has-[:checked]:border-teal has-[:checked]:bg-teal/5">
                  <input
                    type="radio"
                    name="role"
                    value="landlord"
                    className="accent-teal"
                  />
                  Landlord
                </label>
              </div>
            </div>
          </>
        )}

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
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-wide text-ink-soft"
            >
              Password
            </label>
            {mode === "login" && (
             <Link
                href="/forgot-password"
                className="text-xs font-medium text-teal hover:text-teal-dim"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
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
          className="mt-2 w-full rounded-full bg-teal px-4 py-3 text-sm font-medium text-paper transition-all duration-200 hover:bg-teal-dim disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? "Please wait..."
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </button>
      </form>
    </div>
  );
}
