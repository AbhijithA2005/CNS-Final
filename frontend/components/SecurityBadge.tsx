import React from "react";
import { CheckCircle2, ShieldCheck, Key, RefreshCw, Trash2 } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface SecurityBadgeProps {
  compact?: boolean;
}

export function SecurityBadge({ compact = false }: SecurityBadgeProps) {
  const items = [
    {
      title: "PBKDF2 Key Derivation",
      desc: "100,000 SHA-256 iterations & 16-byte random salt",
      icon: Key,
    },
    {
      title: "HMAC-SHA256 Encrypt-then-MAC",
      desc: "Tamper detection & constant-time container authentication",
      icon: ShieldCheck,
    },
    {
      title: "Modular ℤ₂₅₆ Inversion",
      desc: "Strictly guaranteed odd determinant coprime to 256",
      icon: RefreshCw,
    },
    {
      title: "Zero Plaintext Persistence",
      desc: "No passwords or plain keys stored on disk or database",
      icon: Trash2,
    },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 text-xs">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{item.title}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">Security Posture & Compliance</h3>
        </div>
        <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
          Hardened
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-slate-200">{item.title}</p>
                <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
