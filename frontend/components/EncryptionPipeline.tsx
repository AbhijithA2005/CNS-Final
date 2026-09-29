"use client";

import React from "react";
import { File, Grid3X3 as MatrixIcon, Shield, Lock, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { GlassCard } from "./GlassCard";

export interface PipelineProgressState {
  step: number; // 0: idle, 1: prep, 2: hill, 3: des, 4: complete
  message?: string;
}

interface EncryptionPipelineProps {
  progress?: PipelineProgressState;
  isProcessing?: boolean;
}

export function EncryptionPipeline({
  progress = { step: 0 },
  isProcessing = false,
}: EncryptionPipelineProps) {
  const steps = [
    { id: 1, name: "Plaintext", sub: "Input File", icon: File },
    { id: 2, name: "Hill Cipher", sub: "ℤ₂₅₆ Matrix (Layer 1)", icon: Lock },
    { id: 3, name: "DES Cipher", sub: "CBC Mode (Layer 2)", icon: Shield },
    { id: 4, name: "Encrypted", sub: ".svault Container", icon: Lock },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Animated Pipeline Nodes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = isProcessing && progress.step === s.id;
          const isCompleted = progress.step > s.id;

          return (
            <div key={s.id} className="relative">
              <div
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-500/20 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)] scale-[1.02]"
                    : isCompleted
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-white/[0.03] border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-xl border ${
                      isActive
                        ? "bg-indigo-500/30 border-indigo-400 text-white"
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
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">0{s.id}</span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-white tracking-wide">{s.name}</p>
                  <p className="text-[11px] text-slate-400 leading-tight">{s.sub}</p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-slate-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Checklist when active */}
      {isProcessing && (
        <GlassCard className="p-4 space-y-2 border-indigo-500/20 bg-indigo-500/[0.02]">
          <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
            Execution Stages
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              {progress.step >= 1 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className={progress.step === 1 ? "text-indigo-300 font-medium" : "text-slate-400"}>
                1. Parsing & PBKDF2 Key Derivation
              </span>
            </div>

            <div className="flex items-center gap-2">
              {progress.step >= 2 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className={progress.step === 2 ? "text-indigo-300 font-medium" : "text-slate-400"}>
                2. Applying Hill Cipher (mod 256)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {progress.step >= 3 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className={progress.step === 3 ? "text-indigo-300 font-medium" : "text-slate-400"}>
                3. Applying DES Block Cipher (CBC)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {progress.step >= 4 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className={progress.step === 4 ? "text-indigo-300 font-medium" : "text-slate-400"}>
                4. Computing HMAC-SHA256 & Container
              </span>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
