/**
 * Single source of truth for OM Nutrition contact details.
 * IMPORTANT: one canonical phone/WhatsApp number everywhere (header, footer,
 * checkout redirect, LocalBusiness schema) — inconsistent numbers hurt local SEO.
 */
export const site = {
  name: "OM Nutrition",
  legalName: "OM Nutrition, Panipat",
  owner: "Sameer Deshwal",
  tagline: "Genuine supplements in Panipat",
  description:
    "Genuine whey protein, mass gainers, pre-workout and wellness supplements in Panipat. Order on the site, confirm on WhatsApp, pick up or get it delivered locally.",
  whatsappNumber: "919813026045",
  phoneDisplay: "+91 98130 26045",
  phoneHref: "tel:+919813026045",
  instagram: "https://www.instagram.com/omnutrition_panipat/",
  address: {
    street: "Main Market, Model Town",
    city: "Panipat",
    state: "Haryana",
    pincode: "132103",
    country: "IN",
  },
  geo: { lat: 29.3909, lng: 76.9635 },
  hours: "Mon–Sun, 9:00 AM – 9:00 PM",
  mapEmbed:
    "https://www.google.com/maps?q=Panipat%2C%20Haryana%20132103&output=embed",
} as const;

export const currency = (value: number) =>
  `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
