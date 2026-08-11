import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronDown, MapPin, Menu, MessageSquare, Search, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { site, whatsappLink } from "@/lib/site";
import { cartCount, useCart } from "@/store/cart";

const navLinks = [
  { to: "/products", label: "SHOP" },
  { to: "/products", search: { category: "whey-protein" }, label: "CATEGORIES" },
  { to: "/upi", label: "UPI PAY" },
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 2;

  // Handle outside click to close search suggestions
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchFocused(false);
    navigate({
      to: "/products",
      search: { search: searchQuery.trim() },
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-black py-2 px-3 text-center overflow-hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-400">
          <Truck className="size-3.5 text-amber-400 shrink-0" />
          <span className="truncate">SAME-DAY DELIVERY IN PANIPAT</span>
          <span className="text-amber-400/40">·</span>
          <span className="text-white truncate">NO ADVANCE PAYMENT</span>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVBAR */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="grid size-10 sm:size-12 place-items-center bg-black text-lg sm:text-xl font-black text-white rounded-xs tracking-tighter shrink-0">
              OM
            </span>
            <div className="flex flex-col justify-center">
              <span className="font-sans text-base sm:text-xl font-black tracking-tight text-black leading-none group-hover:text-amber-500 transition-colors">
                OM NUTRITION
              </span>
              <span className="text-[9px] sm:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-gray-500 mt-0.5 sm:mt-1 leading-none">
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
          <div className="flex items-center gap-3 sm:gap-4">
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
              className="relative flex flex-col items-center justify-center text-gray-700 hover:text-black transition-colors px-1.5 py-1"
              aria-label={`Cart, ${count} items`}
            >
              <div className="relative">
                <ShoppingCart className="size-5 sm:size-6 text-black" />
                <span className="absolute -top-1.5 -right-2 grid size-4 sm:size-5 place-items-center rounded-full bg-amber-400 text-[10px] sm:text-[11px] font-black text-black ring-2 ring-white">
                  {count}
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase mt-0.5">CART</span>
            </button>

            {/* Mobile Menu Trigger */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-1.5 text-black md:hidden" aria-label="Open Menu">
                  <Menu className="size-6 sm:size-7" />
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
                      className="text-sm font-black tracking-wider text-black py-2 border-b border-gray-100 flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* 3. SUB-HEADER BAR (Location + Search Bar + 100% Authentic Badge) */}
      <div className="border-b border-gray-200 bg-gray-50 py-2.5 px-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-2 sm:gap-3">
          {/* Location Pill */}
          <div className="flex h-9 sm:h-11 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 sm:px-3 text-[11px] sm:text-xs font-extrabold text-gray-800 shadow-2xs shrink-0">
            <MapPin className="size-3.5 sm:size-4 text-gray-700" />
            <span className="tracking-wide">PANIPAT</span>
            <ChevronDown className="size-3 sm:size-4 text-gray-500" />
          </div>

          {/* Search Input Form Container with Smart Dropdown */}
          <div ref={searchBoxRef} className="relative flex-1">
            <form
              onSubmit={handleSearchSubmit}
              className="flex h-9 sm:h-11 w-full items-center rounded-md border border-gray-300 bg-white shadow-2xs overflow-hidden focus-within:ring-2 focus-within:ring-black"
            >
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search supplements, brands (e.g. protin, creatin)..."
                className="h-full flex-1 px-3 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="grid h-full aspect-square place-items-center bg-black text-white hover:bg-gray-800 transition-colors shrink-0"
                aria-label="Search"
              >
                <Search className="size-3.5 sm:size-4" />
              </button>
            </form>

            {/* Quick Live Search Suggestions Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 rounded-xl border border-gray-200 bg-white p-2 shadow-xl z-50 animate-in fade-in-50 duration-150">
                <p className="px-2 py-1 text-[10px] font-black uppercase text-gray-400">Smart Search Suggestions</p>
                <div className="divide-y divide-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchFocused(false);
                      navigate({ to: "/products", search: { search: searchQuery.trim() } });
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-extrabold text-black hover:bg-amber-50 rounded flex items-center justify-between"
                  >
                    <span>Search for "<strong className="text-amber-600">{searchQuery.trim()}</strong>"</span>
                    <Search className="size-3 text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 100% Authentic Badge */}
          <div className="hidden md:flex h-11 items-center gap-2.5 rounded-md bg-black px-4 py-2 text-xs font-black tracking-wider text-white shadow-2xs shrink-0">
            <ShieldCheck className="size-4 text-white" />
            <span>100% AUTHENTIC</span>
          </div>
        </div>
      </div>
    </header>
  );
}


