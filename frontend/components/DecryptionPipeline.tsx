"use client";

import React from "react";
import { File, Shield, RefreshCw, CheckCircle2, Circle, ArrowRight, ShieldCheck } from "lucide-react";
import { GlassCard } from "./GlassCard";

export interface DecryptionProgressState {
  step: number; // 0: idle, 1: hmac, 2: des, 3: hill, 4: complete
  message?: string;
}

interface DecryptionPipelineProps {
  progress?: DecryptionProgressState;
  isProcessing?: boolean;
}

export function DecryptionPipeline({
  progress = { step: 0 },
  isProcessing = false,
}: DecryptionPipelineProps) {
  const steps = [
    { id: 1, name: "Encrypted", sub: ".svault Container", icon: Shield },
    { id: 2, name: "Verify HMAC", sub: "Integrity Check", icon: ShieldCheck },
    { id: 3, name: "DES Decrypt", sub: "CBC Unpadding", icon: Shield },
    { id: 4, name: "Hill Decrypt", sub: "K⁻¹ mod 256", icon: RefreshCw },
    { id: 5, name: "Recovered", sub: "Original File", icon: File },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Visual Pipeline Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = isProcessing && progress.step === s.id;
          const isCompleted = progress.step > s.id;

          return (
            <div key={s.id} className="relative">
              <div
                className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? "bg-purple-500/20 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.02]"
                    : isCompleted
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-white/[0.03] border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-xl border ${
                      isActive
                        ? "bg-purple-500/30 border-purple-400 text-white"
                        : isCompleted
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                        : "bg-white/5 border-white/10 text-slate-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isActive ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">0{s.id}</span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-white tracking-wide">{s.name}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{s.sub}</p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-slate-600">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Checklist */}
      {isProcessing && (
        <GlassCard className="p-4 space-y-2 border-purple-500/20 bg-purple-500/[0.02]">
          <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
            Decryption Execution
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              {progress.step >= 1 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className={progress.step === 1 ? "text-purple-300 font-medium" : "text-slate-400"}>
                1. Parsing Container & Salt Extraction
              </span>
            </div>

            <div className="flex items-center gap-2">
              {progress.step >= 2 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className={progress.step === 2 ? "text-purple-300 font-medium" : "text-slate-400"}>
                2. Authenticating HMAC-SHA256 Tag
              </span>
            </div>

            <div className="flex items-center gap-2">
              {progress.step >= 3 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className={progress.step === 3 ? "text-purple-300 font-medium" : "text-slate-400"}>
                3. Reversing DES-CBC & PKCS#7 Unpadding
              </span>
            </div>

            <div className="flex items-center gap-2">
              {progress.step >= 4 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className={progress.step >= 4 ? "text-purple-300 font-medium" : "text-slate-400"}>
                4. Computing K⁻¹ mod 256 & Recovering Plaintext
              </span>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
