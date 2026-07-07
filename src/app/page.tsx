import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Wallet,
  PhoneCall,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/components/ListingCard";
import { VerifiedSeal } from "@/components/VerifiedSeal";
import { listings, formatPrice } from "@/lib/listings";

const trustPoints = [
  {
    icon: ShieldCheck,
    label: "Verified landlords",
    detail: "ID and property documents checked before any listing goes live.",
  },
  {
    icon: Wallet,
    label: "Protected payments",
    detail: "Funds are held until move-in is confirmed on both sides.",
  },
  {
    icon: PhoneCall,
    label: "Safety check-ins",
    detail: "Scheduled messages to students, with parent alerts if one is missed.",
  },
  {
    icon: GraduationCap,
    label: "University partnerships",
    detail: "Official recommendations from partner exchange offices.",
  },
];

const steps = [
  {
    number: "01",
    title: "Search your city and dates",
    detail:
      "Filter by city, budget, and move-in date across Dakar, Yaoundé, Casablanca, Cape Town, and Nairobi.",
  },
  {
    number: "02",
    title: "Review a verified match",
    detail:
      "Every listing shows landlord verification status, response time, and past stays before you contact anyone.",
  },
  {
    number: "03",
    title: "Move in with check-ins active",
    detail:
      "Payment is protected until confirmation, and scheduled check-ins start from day one.",
  },
];

const cities = [
  { name: "Dakar", country: "Senegal" },
  { name: "Yaoundé", country: "Cameroon" },
  { name: "Casablanca", country: "Morocco" },
  { name: "Cape Town", country: "South Africa" },
  { name: "Nairobi", country: "Kenya" },
  { name: "Accra", country: "Ghana" },
  { name: "Lagos", country: "Nigeria" },
  { name: "Kigali", country: "Rwanda" },
];

export default function Home() {
  const featured = listings.slice(0, 3);
  const sample = listings[0];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 md:pt-20">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-raised px-3 py-1 text-xs font-medium text-ink-soft">
                <VerifiedSeal size={12} className="text-teal" />
                Built with students across Africa
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink md:text-5xl">
                Housing you can verify before you relocate.
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
                Nuru replaces unverified Facebook listings and overpriced
                bookings with a checked, affordable way for students to find
                short-term housing for internships and exchanges across
                Africa.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-3 text-sm font-medium text-paper transition-all duration-200 hover:bg-teal-dim hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/20 active:translate-y-0"
                >
                  Find verified housing
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition-all duration-200 hover:border-ink/40 hover:-translate-y-0.5"
                >
                  See how it works
                </a>
              </div>
            </div>

            {/* Signature hero card: the product itself, not an illustration */}
            <div className="relative">
              <div className="mx-auto max-w-sm rounded-2xl border border-line bg-paper-raised p-5 shadow-xl shadow-ink/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-ink-soft">
                    {sample.city}, {sample.country}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-paper">
                    <VerifiedSeal size={12} className="text-gold" />
                    <span className="text-[11px] font-medium">Verified</span>
                  </div>
                </div>
                <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-line/30">
              <Image
                src={sample.image}
                alt={sample.title}
                fill
                className="object-cover"
              />
            </div>
                <h3 className="mt-4 font-display text-base font-semibold text-ink">
                  {sample.title}
                </h3>
                <p className="mt-1 text-xs text-ink-soft">
                  Hosted by {sample.landlord.name} &middot; verified{" "}
                  {sample.landlord.verifiedSince}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                  <span className="font-mono text-sm font-medium text-ink">
                    {formatPrice(sample.pricePerMonth, sample.currency)}
                    <span className="text-ink-soft"> /mo</span>
                  </span>
                  <span className="font-mono text-[11px] text-ink-soft">
                    ID #NR-{sample.id.slice(-4).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-line/70 bg-paper-raised/60">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map(({ icon: Icon, label, detail }) => (
              <div key={label}>
                <Icon size={20} className="text-teal" strokeWidth={1.75} />
                <h3 className="mt-3 font-display text-sm font-semibold text-ink">
                  {label}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <span className="font-mono text-sm text-gold-dim">
                  {step.number}
                </span>
                <h3 className="mt-3 font-display text-base font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured listings */}
        <section className="border-t border-line/70 bg-paper-raised/40">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                Featured verified housing
              </h2>
              <Link
                href="/listings"
                className="group hidden items-center gap-1.5 text-sm font-medium text-teal transition-colors hover:text-teal-dim sm:inline-flex"
              >
                View all listings
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>

        {/* Cities */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            Where students are moving
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cities.map((city) => (
              <div
                key={city.name}
                className="rounded-xl border border-line bg-paper-raised px-4 py-5"
              >
                <p className="font-display text-sm font-semibold text-ink">
                  {city.name}
                </p>
                <p className="mt-0.5 text-xs text-ink-soft">{city.country}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="border-t border-line/70 bg-ink">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-paper md:text-3xl">
                Relocating for an internship or exchange?
              </h2>
              <p className="mt-2 max-w-md text-sm text-paper/70">
                Start with a verified listing instead of an unverified group
                chat.
              </p>
            </div>
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-ink transition-all duration-200 hover:bg-gold-dim hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20 active:translate-y-0"
            >
              Browse listings
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
