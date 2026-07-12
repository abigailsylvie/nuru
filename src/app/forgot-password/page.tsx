import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VerifiedSeal } from "@/components/VerifiedSeal";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata = {
  title: "Reset your password — Nuru",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2">
            <VerifiedSeal size={22} className="text-teal" />
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              Nuru
            </span>
          </div>
          <h1 className="mt-6 text-center font-display text-2xl font-semibold tracking-tight text-ink">
            Reset your password
          </h1>
          <p className="mt-1.5 text-center text-sm text-ink-soft">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          <ForgotPasswordForm />

          <p className="mt-8 text-center text-sm text-ink-soft">
            Remembered it?{" "}
            <Link href="/login" className="font-medium text-teal hover:text-teal-dim">
              Back to log in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}