"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Lock,
  Shield,
  Layers,
  FileCheck,
  HardDrive,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Zap,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { StatCard } from "@/components/StatCard";
import { SecurityBadge } from "@/components/SecurityBadge";
import { HistoryTable } from "@/components/HistoryTable";
import { fetchStats, fetchHistory } from "@/lib/api";
import { formatBytes } from "@/lib/utils";
import { DashboardStats, OperationRecord } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    files_processed: 0,
    encrypted_count: 0,
    decrypted_count: 0,
    total_storage_bytes: 0,
  });
  const [recentOperations, setRecentOperations] = useState<OperationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, historyData] = await Promise.all([
          fetchStats().catch(() => ({
            files_processed: 0,
            encrypted_count: 0,
            decrypted_count: 0,
            total_storage_bytes: 0,
          })),
          fetchHistory({ limit: 5 }).catch(() => ({ items: [], total: 0, page: 1, limit: 5, total_pages: 1 })),
        ]);
        setStats(statsData);
        setRecentOperations(historyData.items);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16">
      
      {/* Hero Section */}
      <section className="relative text-center max-w-3xl mx-auto space-y-6 pt-6 sm:pt-10">
        
        {/* Security Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            System Protected
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-indigo-300 font-medium">Hill Cipher + DES</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
          Secure your files. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-400 bg-clip-text text-transparent">
            Layer by layer.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Encrypt and decrypt files using a two-stage Hill Cipher + DES cryptographic pipeline.
          Engineered with PBKDF2 key derivation and HMAC-SHA256 authenticated integrity.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/encrypt" className="w-full sm:w-auto">
            <GlassButton
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              icon={<Lock className="w-5 h-5" />}
            >
              Encrypt File
            </GlassButton>
          </Link>

          <Link href="/decrypt" className="w-full sm:w-auto">
            <GlassButton
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              icon={<Shield className="w-5 h-5" />}
            >
              Decrypt File
            </GlassButton>
          </Link>
        </div>

      </section>

      {/* Statistics Cards (Section 10) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Operational Metrics
          </h2>
          <span className="text-xs text-slate-500">Local SQLite Storage</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Files Processed"
            value={stats.files_processed}
            subtext="Total cipher operations"
            icon={Layers}
            color="indigo"
          />
          <StatCard
            label="Encrypted"
            value={stats.encrypted_count}
            subtext="Packaged as .svault"
            icon={Lock}
            color="purple"
          />
          <StatCard
            label="Decrypted"
            value={stats.decrypted_count}
            subtext="100% byte fidelity"
            icon={FileCheck}
            color="emerald"
          />
          <StatCard
            label="Storage Used"
            value={formatBytes(stats.total_storage_bytes)}
            subtext="Encrypted & recovered files"
            icon={HardDrive}
            color="cyan"
          />
        </div>
      </section>

      {/* Layered Pipeline Architecture Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Two-Stage Cryptographic Engine</h2>
            <p className="text-xs text-slate-400">Deterministic linear transformation combined with Feistel block permutation</p>
          </div>
          <Link href="/about" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
            Learn Math <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="p-5 space-y-3 border-indigo-500/20 bg-indigo-500/[0.02]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 font-mono">STAGE 01</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Linear Polygraphic
              </span>
            </div>
            <h3 className="text-base font-semibold text-white">Hill Cipher Modulo 256</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transforms byte pairs via matrix multiplication in ring ℤ₂₅₆: <code className="text-indigo-300 font-mono">C = (P · Kᵀ) mod 256</code>.
              Guaranteed invertible with an odd determinant coprime to 256.
            </p>
          </GlassCard>

          <GlassCard className="p-5 space-y-3 border-purple-500/20 bg-purple-500/[0.02]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 font-mono">STAGE 02</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Block Cipher
              </span>
            </div>
            <h3 className="text-base font-semibold text-white">DES in CBC Mode</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Feistel block cipher operating on 64-bit blocks with random 8-byte IV and PKCS#7 padding.
              Provides non-linear substitution and diffusion across blocks.
            </p>
          </GlassCard>

          <GlassCard className="p-5 space-y-3 border-sky-500/20 bg-sky-500/[0.02]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 font-mono">STAGE 03</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                Integrity Shield
              </span>
            </div>
            <h3 className="text-base font-semibold text-white">HMAC-SHA256 Authenticator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Encrypt-then-MAC authentication tag computed across metadata and ciphertext. Detects any bit-level tampering or invalid passwords immediately.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Security Posture Panel */}
      <section>
        <SecurityBadge />
      </section>

      {/* Recent Activity Section (Section 10) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
            <p className="text-xs text-slate-400">Latest cryptographic file operations</p>
          </div>
          <Link
            href="/history"
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            View Full Audit Log <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <HistoryTable items={recentOperations} isLoading={isLoading} />
      </section>

    </div>
  );
}
