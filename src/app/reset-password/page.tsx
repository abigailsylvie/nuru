import { VerifiedSeal } from "@/components/VerifiedSeal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata = {
  title: "Set new password — Nuru",
};

export default function ResetPasswordPage() {
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
            Set a new password
          </h1>
          <p className="mt-1.5 text-center text-sm text-ink-soft">
            Choose a new password for your account.
          </p>

          <ResetPasswordForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}