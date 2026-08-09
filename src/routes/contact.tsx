import { createFileRoute } from "@tanstack/react-router";
import { Clock, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { site, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact OM Nutrition Panipat | Store Address, Phone & WhatsApp" },
      {
        name: "description",
        content: `Visit OM Nutrition at ${site.address.street}, ${site.address.city}. Call or WhatsApp ${site.phoneDisplay}. Open ${site.hours}.`,
      },
      { property: "og:title", content: "Contact OM Nutrition — Panipat" },
      {
        property: "og:description",
        content: `Store address, opening hours and WhatsApp for OM Nutrition, ${site.address.city}.`,
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Contact</p>
        <h1 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
          Come to the store, or just message us
        </h1>
      </Reveal>

      <div className="mt-10 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="space-y-4">
          {[
            {
              icon: MapPin,
              title: "Store address",
              body: `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.pincode}`,
            },
            { icon: Phone, title: "Phone", body: site.phoneDisplay, href: site.phoneHref },
            { icon: Clock, title: "Opening hours", body: site.hours },
            { icon: Instagram, title: "Instagram", body: "@omnutrition_panipat", href: site.instagram },
          ].map(({ icon: Icon, title, body, href }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-brand">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-primary">{title}</p>
                {href ? (
                  <a href={href} className="text-sm text-brand">
                    {body}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{body}</p>
                )}
              </div>
            </div>
          ))}

          <Button variant="whatsapp" size="lg" className="w-full" asChild>
            <a href={whatsappLink("Hi OM Nutrition, I'd like to ask about a product.")}>
              <MessageCircle /> Message us on WhatsApp
            </a>
          </Button>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-3xl border border-border shadow-card">
            <iframe
              title="OM Nutrition store location in Panipat on Google Maps"
              src={site.mapEmbed}
              className="h-[460px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
