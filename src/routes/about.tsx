import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, HeartHandshake, MessageCircle, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { site, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About OM Nutrition Panipat | Sameer Deshwal's Supplement Store" },
      {
        name: "description",
        content:
          "Meet Sameer Deshwal, the owner of OM Nutrition in Panipat. Sealed, genuine supplements, honest advice on what to take, and local delivery across the city.",
      },
      { property: "og:title", content: "About OM Nutrition — Panipat's supplement store" },
      {
        property: "og:description",
        content: "Sealed, genuine supplements and honest advice from Sameer Deshwal in Panipat.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Our story</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold text-primary md:text-5xl">
          A supplement shop that tells you what <em className="text-gradient-brand">not</em> to buy.
        </h1>
      </Reveal>

      <div className="mt-12 grid items-start gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <img
            src="/images/founder.jpg"
            alt={`${site.owner}, owner of OM Nutrition in Panipat, at his store counter`}
            width={1024}
            height={1024}
            loading="lazy"
            className="w-full rounded-3xl border border-border object-cover shadow-card"
          />
          <p className="mt-4 text-sm font-bold text-primary">
            {site.owner}
            <span className="block text-xs font-medium text-muted-foreground">
              Owner, OM Nutrition Panipat
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.08} className="space-y-5 text-muted-foreground">
          <p>
            OM Nutrition started as a small counter in {site.address.city} with one rule: only stock
            what we'd take ourselves. {site.owner} answers every question at the counter himself —
            what dose, when to take it, and often that you don't need the expensive thing at all.
          </p>
          <p>
            Most customers here found us on Instagram, where {site.owner} shows the products on camera
            himself. This website exists so you can see the full catalogue and prices up front, add
            what you want, and still finish the conversation on WhatsApp the way you already do.
          </p>
          <p>
            Every tub is sealed, sourced from authorised distributors, and you're welcome to check
            batch and expiry in front of us before paying. Nothing is charged in advance.
          </p>

          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            {[
              [ShieldCheck, "Sealed stock only", "Authorised distributors, checkable batches."],
              [HeartHandshake, "Honest guidance", "Goal first, product second."],
              [BadgeCheck, "Pay after you get it", "Cash or UPI on pickup or delivery."],
            ].map(([Icon, title, text]) => {
              const Ico = Icon as typeof ShieldCheck;
              return (
                <div
                  key={title as string}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card"
                >
                  <Ico className="size-5 text-brand" />
                  <p className="mt-3 text-sm font-bold text-primary">{title as string}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{text as string}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Button variant="brand" asChild>
              <Link to="/products" search={{}}>
                See the catalogue
              </Link>
            </Button>
            <Button variant="whatsapp" asChild>
              <a href={whatsappLink(`Hi ${site.owner}, I need some guidance on supplements.`)}>
                <MessageCircle /> Talk to {site.owner.split(" ")[0]}
              </a>
            </Button>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-16">
        <img
          src="/images/store.jpg"
          alt="OM Nutrition store shelves stacked with protein and supplement tubs in Panipat"
          width={1280}
          height={864}
          loading="lazy"
          className="w-full rounded-3xl border border-border object-cover shadow-card"
        />
      </Reveal>
    </div>
  );
}
