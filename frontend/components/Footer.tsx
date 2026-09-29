import Link from "next/link";
import { ShieldAlert, Lock, Info } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-black/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Educational Advisory Callout */}
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/[0.07] border border-amber-500/20 text-xs text-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="space-y-0.5">
            <span className="font-semibold text-amber-300">Academic & Educational Project Notice:</span>
            <p className="text-amber-200/80 leading-relaxed">
              DES (Data Encryption Standard) is cryptographically obsolete for modern production systems due to its 56-bit effective key length, which is vulnerable to brute-force attacks. SecureVault demonstrates historical layered cryptography (Hill Cipher + DES) combined with modern PBKDF2 key derivation and HMAC-SHA256 authenticated encryption.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white tracking-tight text-base">SecureVault</span>
              <span className="text-xs text-slate-500 border border-white/10 px-2 py-0.5 rounded-full">
                B.Tech Mini-Project
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              A high-assurance file sharing system demonstrating two-stage hybrid cryptography: linear modular matrix transformation (Hill Cipher in ℤ₂₅₆) compounded with block-level DES-CBC and Encrypt-then-MAC authentication.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/encrypt" className="hover:text-white transition-colors">Encrypt File</Link></li>
              <li><Link href="/decrypt" className="hover:text-white transition-colors">Decrypt File</Link></li>
              <li><Link href="/history" className="hover:text-white transition-colors">Audit History</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Cryptography</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Hill Cipher (ℤ₂₅₆)</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">DES in CBC Mode</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">PBKDF2 Key Derivation</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">HMAC-SHA256 Integrity</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SecureVault — Educational Cryptography System.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">End-to-End Reversible Modulo Arithmetic</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">100% Byte-for-Byte Fidelity</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
