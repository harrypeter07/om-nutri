import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, MessageSquare, Phone } from "lucide-react";

import { site, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center bg-white text-lg font-black text-black rounded-sm">
              OM
            </span>
            <div>
              <p className="font-sans text-lg font-black tracking-tight text-white leading-none">
                OM NUTRITION
              </p>
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-gray-400 mt-0.5 leading-none">
                PANIPAT
              </p>
            </div>
          </div>

          <p className="mt-4 max-w-sm text-xs font-semibold text-gray-400 leading-relaxed">
            Genuine, sealed supplements guided by {site.owner} in Panipat. Order online, confirm on WhatsApp, pay on delivery.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={whatsappLink("Hi OM Nutrition, I have a question.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-xs font-black uppercase text-white hover:bg-emerald-700 transition-colors"
            >
              <MessageSquare className="size-3.5" /> WhatsApp
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-gray-800 bg-gray-950 px-4 py-2 text-xs font-black uppercase text-white hover:bg-gray-900 transition-colors"
            >
              <Instagram className="size-3.5 text-amber-400" /> Instagram
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-wider text-amber-400">
            QUICK LINKS
          </p>
          <ul className="mt-4 space-y-2.5 text-xs font-bold text-gray-300">
            <li>
              <Link to="/products" className="hover:text-amber-400 transition-colors">All Supplements</Link>
            </li>
            <li>
              <Link to="/reviews" className="hover:text-amber-400 transition-colors">Customer Reviews</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-amber-400 transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-amber-400 transition-colors">Contact & Directions</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-wider text-amber-400">
            VISIT STORE
          </p>
          <ul className="mt-4 space-y-3 text-xs font-bold text-gray-300">
            <li className="flex gap-2">
              <MapPin className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {site.address.street}, {site.address.city}, {site.address.state}{" "}
                {site.address.pincode}
              </span>
            </li>
            <li className="flex gap-2">
              <Phone className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <a href={site.phoneHref} className="hover:text-amber-400">{site.phoneDisplay}</a>
            </li>
            <li className="text-gray-400 font-semibold">{site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-900 py-4 text-center text-[11px] font-bold text-gray-500">
        © {new Date().getFullYear()} OM NUTRITION PANIPAT. ALL RIGHTS RESERVED. NO ADVANCE PAYMENT.
      </div>
    </footer>
  );
}

