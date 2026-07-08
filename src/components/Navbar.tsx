import Image from "next/image";
import Link from "next/link";
import { VerifiedSeal } from "./VerifiedSeal";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { logout } from "@/app/login/actions";

export async function Navbar() {
  let userEmail: string | null = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  }

  return (
    <header className="border-b border-line/70 bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80 sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/nuru-logo.png" alt="Nuru logo" width={22} height={22} />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Nuru
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
        <Link href="/list-property" className="nav-link">
          List your property
        </Link>
        {userEmail && (
          <Link href="/my-bookings" className="nav-link">
            My Bookings
          </Link>
        )}
        </nav>
        <div className="flex items-center gap-3">
          {userEmail ? (
            <form action={logout} className="hidden items-center gap-3 sm:flex">
              <span className="text-xs text-ink-soft">{userEmail}</span>
              <button
                type="submit"
                className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
              >
                Log out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="hidden text-sm font-medium text-ink-soft hover:text-ink transition-colors sm:inline"
            >
              Log in
            </Link>
          )}
          <Link
            href="/listings"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-all duration-200 hover:bg-ink/90 hover:-translate-y-0.5 active:translate-y-0"
          >
            Browse listings
          </Link>
        </div>
      </div>
    </header>
  );
}
