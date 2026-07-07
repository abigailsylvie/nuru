import { VerifiedSeal } from "./VerifiedSeal";
import Image from "next/image";


export function Footer() {
  return (
    <footer className="border-t border-line/70 bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/nuru-logo.png" alt="Nuru logo" width={22} height={22} />
              <span className="font-display text-base font-semibold text-ink">
                Nuru
              </span>
            </div>
            <p className="mt-3 max-w-[26ch] text-sm text-ink-soft">
              Verified student housing for relocation across Africa.
            </p>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-ink">
              Students
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>Browse listings</li>
              <li>How verification works</li>
              <li>Safety check-ins</li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-ink">
              Landlords
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>List your property</li>
              <li>Get verified</li>
              <li>Payout schedule</li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-ink">
              Cities
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>Dakar &middot; Yaoundé &middot; Casablanca</li>
              <li>Cape Town &middot; Nairobi</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line/70 pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; 2026 Nuru.</span>
          <span className="font-mono">Prototype build &middot; not for production use</span>
        </div>
      </div>
    </footer>
  );
}
