import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, MapPin, Menu, MessageSquare, Search, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useEffect, useState } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { site, whatsappLink } from "@/lib/site";
import { cartCount, useCart } from "@/store/cart";

const navLinks = [
  { to: "/products", label: "SHOP" },
  { to: "/products", search: { category: "whey-protein" }, label: "CATEGORIES" },
  { to: "/about", label: "ABOUT US" },
  { to: "/reviews", label: "OFFERS" },
  { to: "/contact", label: "CONTACT" },
] as const;

export function Header() {
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 2; // Default 2 as shown in screenshot

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-black py-2.5 px-4 text-center">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 sm:text-sm">
          <Truck className="size-4 text-amber-400" />
          <span>SAME-DAY DELIVERY IN PANIPAT</span>
          <span className="text-white/40">|</span>
          <span>NO ADVANCE PAYMENT</span>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVBAR */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="grid size-12 place-items-center bg-black text-xl font-black text-white rounded-sm tracking-tighter">
              OM
            </span>
            <div className="flex flex-col justify-center">
              <span className="font-sans text-xl font-black tracking-tight text-black leading-none group-hover:text-amber-500 transition-colors">
                OM NUTRITION
              </span>
              <span className="text-[11px] font-extrabold tracking-[0.25em] text-gray-500 mt-1 leading-none">
                PANIPAT
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => {
              const isActive = currentPath === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  search={item.search}
                  className={`relative text-xs font-black tracking-wider transition-colors py-2 ${
                    isActive ? "text-black" : "text-gray-700 hover:text-black"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            {/* Chat button */}
            <a
              href={whatsappLink("Hi OM Nutrition, I have a query.")}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex flex-col items-center justify-center text-gray-700 hover:text-black transition-colors"
            >
              <MessageSquare className="size-5" />
              <span className="text-[10px] font-black tracking-wider uppercase mt-0.5">CHAT</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative flex flex-col items-center justify-center text-gray-700 hover:text-black transition-colors px-2 py-1"
              aria-label={`Cart, ${count} items`}
            >
              <div className="relative">
                <ShoppingCart className="size-6 text-black" />
                <span className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-amber-400 text-[11px] font-black text-black ring-2 ring-white">
                  {count}
                </span>
              </div>
              <span className="text-[10px] font-black tracking-wider uppercase mt-0.5">CART</span>
            </button>

            {/* Mobile Menu Trigger */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-black md:hidden" aria-label="Open Menu">
                  <Menu className="size-7" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-6 bg-white">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <span className="grid size-10 place-items-center bg-black text-lg font-black text-white rounded">
                    OM
                  </span>
                  <div>
                    <p className="font-black text-black leading-none">OM NUTRITION</p>
                    <p className="text-[10px] font-bold tracking-widest text-gray-500">PANIPAT</p>
                  </div>
                </div>
                <nav className="mt-6 flex flex-col gap-4">
                  {navLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      search={item.search}
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-black tracking-wider text-black py-2 border-b border-gray-100"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* 3. SUB-HEADER BAR (Location + Search Bar + 100% Authentic Badge) */}
      <div className="border-b border-gray-200 bg-gray-50 py-3 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 md:flex-nowrap">
          {/* Location Pill */}
          <div className="flex h-11 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-extrabold text-gray-800 shadow-sm shrink-0">
            <MapPin className="size-4 text-gray-700" />
            <span className="tracking-wide">PANIPAT, HARYANA</span>
            <ChevronDown className="size-4 text-gray-500 ml-1" />
          </div>

          {/* Search Input Box */}
          <div className="flex h-11 flex-1 items-center rounded-md border border-gray-300 bg-white shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-black">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search supplements, brands..."
              className="h-full flex-1 px-4 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="grid h-full aspect-square place-items-center bg-black text-white hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <Search className="size-4" />
            </button>
          </div>

          {/* 100% Authentic Badge */}
          <div className="hidden sm:flex h-11 items-center gap-2.5 rounded-md bg-black px-4 py-2 text-xs font-black tracking-wider text-white shadow-sm shrink-0">
            <ShieldCheck className="size-4 text-white" />
            <span>100% AUTHENTIC</span>
          </div>
        </div>
      </div>
    </header>
  );
}

