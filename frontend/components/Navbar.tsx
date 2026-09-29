"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Lock, FileText, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { name: "Dashboard", href: "/" },
  { name: "Encrypt", href: "/encrypt" },
  { name: "Decrypt", href: "/decrypt" },
  { name: "History", href: "/history" },
  { name: "Algorithm Lab", href: "/algorithm-lab" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-black/40 border-b border-white/[0.08] transition-colors duration-300">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-sky-500/20 border border-white/20 flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:scale-105 group-hover:border-white/30 transition-all duration-300">
            {/* Layered Security Composite Icon: Shield + Lock + File */}
            <Shield className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-sky-300 transform -translate-y-0.5" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center">
              <FileText className="w-2.5 h-2.5 text-purple-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                SecureVault
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-normal">
              Hill Cipher + DES Pipeline
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] p-1.5 rounded-2xl backdrop-blur-xl">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-white bg-white/10 shadow-sm border border-white/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Theme */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isActive
                    ? "bg-white/10 text-white border border-white/15"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
