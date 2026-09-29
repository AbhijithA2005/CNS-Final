import React from "react";
import { GlassCard } from "./GlassCard";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  color?: "indigo" | "emerald" | "purple" | "cyan";
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  color = "indigo",
}: StatCardProps) {
  const colorMap = {
    indigo: "from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/20",
    emerald: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20",
    purple: "from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20",
    cyan: "from-sky-500/20 to-sky-600/5 text-sky-400 border-sky-500/20",
  };

  return (
    <GlassCard hoverEffect className="p-6 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{value}</p>
          {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
        </div>
        <div
          className={`p-3.5 rounded-2xl bg-gradient-to-br ${colorMap[color]} border shadow-sm group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-indigo-500/40 transition-all duration-300" />
    </GlassCard>
  );
}
