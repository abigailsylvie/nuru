import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShieldCheck } from "lucide-react";
import { ListPropertyForm } from "./ListPropertyForm";

export const metadata = {
  title: "List your property  Nuru",
};

export default function ListPropertyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            List your property
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">
            Tell us about your place. Every listing is checked before it goes
            live to students.
          </p>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-line bg-paper-raised p-4">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-teal" />
            <p className="text-xs leading-relaxed text-ink-soft">
              After you submit, our team verifies your ID and property
              documents. Verified listings get priority placement and a
              visible verified badge.
            </p>
          </div>

          <ListPropertyForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
