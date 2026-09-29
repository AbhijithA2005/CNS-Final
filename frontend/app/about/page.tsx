"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  HelpCircle,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  Lock,
  Layers,
  Sparkles,
  Calculator,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { validateMatrixApi } from "@/lib/api";

export default function AboutSecurityPage() {
  // Interactive Hill Matrix Invertibility Playground state
  const [a, setA] = useState("3");
  const [b, setB] = useState("5");
  const [c, setC] = useState("6");
  const [d, setD] = useState("17");
  const [calcResult, setCalcResult] = useState<any>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  const handleTestMatrix = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalcLoading(true);
    try {
      const mat = [
        [parseInt(a, 10), parseInt(b, 10)],
        [parseInt(c, 10), parseInt(d, 10)],
      ];
      const res = await validateMatrixApi(mat);
      setCalcResult(res);
    } catch (err: any) {
      setCalcResult({
        is_valid: false,
        explanation: err.message || "Failed to evaluate matrix.",
      });
    } finally {
      setCalcLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Academic Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Cryptography & Security Architecture
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Comprehensive explanation of the mathematical and cryptographic principles governing SecureVault.
        </p>
      </div>

      {/* Critical Educational Advisory */}
      <GlassCard className="p-6 border-amber-500/30 bg-amber-500/[0.05] space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>Why DES is Not Recommended for Modern Production Systems</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
          The <strong>Data Encryption Standard (DES)</strong> was designed in 1977 with a 64-bit key, of which only <strong>56 bits</strong> are effective (8 bits are parity). A 56-bit key yields 2⁵⁶ ≈ 7.2 × 10¹⁶ possible combinations. In 1998, the Electronic Frontier Foundation (EFF) built the <em>DES Cracker</em> for under $250,000, recovering DES keys in under 56 hours. Today, modern distributed GPU clusters can brute-force the entire 56-bit keyspace in just a few hours.
        </p>
        <p className="text-xs text-amber-300/80 font-medium">
          SecureVault utilizes DES strictly for academic study and B.Tech demonstration of layered Feistel ciphers. For modern production security, AES-256 (Advanced Encryption Standard) or ChaCha20-Poly1305 should always be selected.
        </p>
      </GlassCard>

      {/* Interactive Hill Cipher Matrix Invertibility Calculator */}
      <GlassCard className="p-6 sm:p-8 space-y-6 border-indigo-500/30 bg-indigo-500/[0.02]">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">
              Interactive Hill Matrix Invertibility Playground
            </h2>
          </div>
          <span className="text-xs text-slate-400">Ring ℤ₂₅₆ (Modulo 256)</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Try any 2×2 integer matrix to verify if it satisfies the Hill Cipher condition for binary file encryption:
          <code className="text-indigo-300 font-mono ml-1">gcd(det(K) mod 256, 256) == 1</code> (meaning det must be <strong>odd</strong>).
        </p>

        <form onSubmit={handleTestMatrix} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono block text-center">Row 1, Col 1 (a)</label>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full p-2.5 text-center text-sm font-mono rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono block text-center">Row 1, Col 2 (b)</label>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="w-full p-2.5 text-center text-sm font-mono rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono block text-center">Row 2, Col 1 (c)</label>
              <input
                type="number"
                value={c}
                onChange={(e) => setC(e.target.value)}
                className="w-full p-2.5 text-center text-sm font-mono rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono block text-center">Row 2, Col 2 (d)</label>
              <input
                type="number"
                value={d}
                onChange={(e) => setD(e.target.value)}
                className="w-full p-2.5 text-center text-sm font-mono rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <GlassButton
              type="submit"
              variant="secondary"
              size="sm"
              isLoading={calcLoading}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Evaluate Matrix Modulo 256
            </GlassButton>
          </div>
        </form>

        {calcResult && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 animate-in fade-in duration-200 ${
              calcResult.is_valid
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                : "bg-rose-950/40 border-rose-500/30 text-rose-200"
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              {calcResult.is_valid ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Valid Invertible Matrix!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span>Matrix Cannot Be Inverted!</span>
                </>
              )}
            </div>
            <p className="leading-relaxed">{calcResult.explanation}</p>
            {calcResult.inverse_matrix && (
              <div className="pt-2 border-t border-emerald-500/20 font-mono text-xs">
                <span>Computed Inverse Matrix (K⁻¹ mod 256): </span>
                <span className="text-white font-bold">
                  {JSON.stringify(calcResult.inverse_matrix)}
                </span>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      {/* Structured Viva Questions & Explanations */}
      <div className="space-y-6">
        
        {/* Q1: Hill Cipher */}
        <GlassCard className="p-6 space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            1. What is the Hill Cipher and how does it work on arbitrary files?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The Hill Cipher is a polygraphic substitution cipher invented by Lester S. Hill in 1929. In classical textbooks, it operates modulo 26 on uppercase letters A–Z. In SecureVault, to support <strong>any arbitrary binary file</strong> (PDFs, ZIPs, photos, compiled code), the algebra is expanded to the ring <strong>ℤ₂₅₆</strong>, representing all 256 possible 8-bit byte values.
          </p>
          <div className="p-3 rounded-xl bg-black/40 font-mono text-xs text-indigo-300">
            Encryption: C = (P · Kᵀ) mod 256 <br />
            Decryption: P = (C · (K⁻¹)ᵀ) mod 256
          </div>
        </GlassCard>

        {/* Q2: DES Cipher */}
        <GlassCard className="p-6 space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            2. What is DES and what is its internal architecture?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The Data Encryption Standard (DES) is a symmetric block cipher that operates on 64-bit blocks of data using a 56-bit effective key. It employs a 16-round <strong>Feistel network</strong> combining initial permutation (IP), round keys generated by key scheduling, expansion permutation (E), non-linear substitution boxes (S-boxes), and inverse initial permutation (IP⁻¹).
          </p>
        </GlassCard>

        {/* Q3: Why Combine Hill Cipher + DES? */}
        <GlassCard className="p-6 space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            3. Why combine Hill Cipher and DES into a layered pipeline?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Combining two distinct cryptographic paradigms creates defense-in-depth:
          </p>
          <ul className="text-xs sm:text-sm text-slate-300 list-disc list-inside space-y-1">
            <li><strong>Hill Cipher</strong> introduces rapid linear algebraic diffusion and destroys byte-frequency distributions across block pairs.</li>
            <li><strong>DES in CBC mode</strong> introduces non-linear confusion via S-boxes and multi-block chaining.</li>
            <li>An attacker attempting known-plaintext or linear cryptanalysis on one layer must simultaneously invert the other.</li>
          </ul>
        </GlassCard>

        {/* Q4: CBC Mode */}
        <GlassCard className="p-6 space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            4. What is CBC (Cipher Block Chaining) Mode and why is it preferred over ECB?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In Electronic Codebook (ECB) mode, identical plaintext blocks always produce identical ciphertext blocks, leaking structural patterns. In <strong>CBC mode</strong>, each plaintext block is XORed with the preceding ciphertext block prior to encryption. The very first block is XORed with an 8-byte pseudo-random <strong>Initialization Vector (IV)</strong>. This guarantees that two identical files will generate completely dissimilar ciphertexts.
          </p>
        </GlassCard>

        {/* Q5: PBKDF2 */}
        <GlassCard className="p-6 space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            5. What is PBKDF2 and how are keys derived?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            PBKDF2 (Password-Based Key Derivation Function 2, NIST SP 800-132) applies a pseudorandom function (HMAC-SHA256) repeatedly to a user password along with a 16-byte random salt. SecureVault performs <strong>100,000 rounds</strong> of computation. This prevents rainbow-table precomputation and makes dictionary attacks prohibitively expensive.
          </p>
        </GlassCard>

        {/* Q6: HMAC-SHA256 */}
        <GlassCard className="p-6 space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            6. What is HMAC and how does it prevent bit-flipping and padding oracle attacks?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            DES-CBC provides confidentiality, but does not inherently guarantee integrity. An adversary could alter ciphertext bytes or exploit padding oracle errors. SecureVault employs the <strong>Encrypt-then-MAC (EtM)</strong> paradigm: after encryption, an HMAC-SHA256 signature is calculated over all container metadata and ciphertext. Upon decryption, the HMAC tag is verified in <strong>constant time</strong> before touching any decryption logic.
          </p>
        </GlassCard>

      </div>

    </div>
  );
}
