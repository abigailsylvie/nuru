import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VerifiedSeal } from "@/components/VerifiedSeal";
import { LoginForm } from "./LoginForm";
import Image from "next/image";

export const metadata = {
  title: "Log in  Nuru",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2">
            <Image src="/nuru-logo.png" alt="Nuru logo" width={22} height={22} />
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              Nuru
            </span>
          </div>
          <h1 className="mt-6 text-center font-display text-2xl font-semibold tracking-tight text-ink">
            Log in to your account
          </h1>
          <p className="mt-1.5 text-center text-sm text-ink-soft">
            Students and landlords use the same login.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-8 text-center text-sm text-ink-soft">
            New to Nuru?{" "}
            <Link href="/list-property" className="font-medium text-teal hover:text-teal-dim">
              List your property
            </Link>{" "}
            or{" "}
            <Link href="/listings" className="font-medium text-teal hover:text-teal-dim">
              browse housing
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
