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
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
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
    <div className="min-h-[calc(100vh-10rem)] flex flex-col justify-center gap-7 lg:gap-8">
      <section className="grid gap-7 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-center">
        <div className="space-y-5 py-2">
          <h1 className="text-3xl sm:text-4xl 2xl:text-5xl font-extrabold leading-tight text-white">
            Secure your files.<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-400 bg-clip-text text-transparent">
              Keep the originals.
            </span>
          </h1>
          <p className="max-w-xl text-sm sm:text-base leading-relaxed text-slate-400">
            Encrypt a file into a .svault container, then restore it whenever you need it.
          </p>
          <div className="flex flex-col items-center justify-start gap-4 pt-2 sm:flex-row">
          <Link
            href="/encrypt"
            className="glass-button-primary inline-flex min-h-[54px] w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-2xl border border-white/20 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 px-5 py-3.5 text-base font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 sm:w-48"
          >
            <Lock className="h-5 w-5" />
            Encrypt File
          </Link>

          <Link
            href="/decrypt"
            className="dashboard-secondary-action inline-flex min-h-[54px] w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3.5 text-base font-medium text-slate-100 shadow-sm transition hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:w-48"
          >
            <Shield className="h-5 w-5" />
            Decrypt File
          </Link>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Operational Metrics
            </h2>
            <span className="text-xs text-slate-500">Local activity</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-bold tracking-tight text-white">Encryption Pipeline</h2>
            <Link href="/about#pipeline-demo" className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300">
              Demo <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-3">
            <GlassCard className="flex items-center gap-4 p-4 border-indigo-500/20 bg-indigo-500/[0.03]">
              <span className="font-mono text-xs font-bold text-indigo-400">01</span>
              <div>
                <h3 className="text-sm font-semibold text-white">Hill Cipher · mod 256</h3>
                <p className="text-xs text-slate-400">Transforms byte pairs with an invertible matrix.</p>
              </div>
            </GlassCard>
            <GlassCard className="flex items-center gap-4 p-4 border-purple-500/20 bg-purple-500/[0.03]">
              <span className="font-mono text-xs font-bold text-purple-400">02</span>
              <div>
                <h3 className="text-sm font-semibold text-white">DES · CBC mode</h3>
                <p className="text-xs text-slate-400">Encrypts padded blocks with a random IV.</p>
              </div>
            </GlassCard>
            <GlassCard className="flex items-center gap-4 p-4 border-sky-500/20 bg-sky-500/[0.03]">
              <span className="font-mono text-xs font-bold text-sky-400">03</span>
              <div>
                <h3 className="text-sm font-semibold text-white">HMAC-SHA256</h3>
                <p className="text-xs text-slate-400">Authenticates the encrypted container.</p>
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold tracking-tight text-white">Recent Activity</h2>
              <p className="text-xs text-slate-400">Latest file operations</p>
            </div>
            <Link href="/history" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300">
              Full history <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <HistoryTable items={recentOperations} isLoading={isLoading} />
        </div>
      </section>
    </div>
  );
}
