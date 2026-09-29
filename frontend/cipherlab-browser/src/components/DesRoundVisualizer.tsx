import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Cpu,
} from 'lucide-react';
import type { DesExecutionResult } from '../lib/des';
import { CryptoTooltip } from './CryptoTooltip';

interface DesRoundVisualizerProps {
  execution: DesExecutionResult;
}

export const DesRoundVisualizer: React.FC<DesRoundVisualizerProps> = ({ execution }) => {
  const [expandedRound, setExpandedRound] = useState<number | null>(1); // round 1 open by default
  const [activeTab, setActiveTab] = useState<'rounds' | 'flow'>('rounds');

  if (!execution.success || execution.rounds.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              16-Round Feistel Network Architecture
            </h3>
            <CryptoTooltip term="feistel" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mode:{' '}
            <span className="font-mono uppercase font-bold text-indigo-400">
              {execution.mode}
            </span>{' '}
            &bull; Showing 32-bit halves (L &amp; R), 48-bit subkeys K₁, ..., K₁₆, and the F-function.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('rounds')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              activeTab === 'rounds'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Round-by-Round List
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              activeTab === 'flow'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Initial &amp; Final Permutations
          </button>
        </div>
      </div>

      {activeTab === 'flow' ? (
        /* Overview of IP and IP-1 */
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-2 font-mono">
              Initial Permutation (IP) — 64-bit Shuffle
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400">Input Block (64-bit Hex):</span>
                <div className="p-2 bg-slate-900 rounded-lg text-slate-200 mt-1 select-all font-bold">
                  {execution.inputHex}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Permuted Output IP(M):</span>
                <div className="p-2 bg-slate-900 rounded-lg text-cyan-300 mt-1 select-all font-bold">
                  {execution.ipOutHex}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Splits into initial 32-bit registers:</span>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
                  L₀ = {execution.l0Hex}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50">
                  R₀ = {execution.r0Hex}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2 font-mono">
              Inverse Initial Permutation (IP⁻¹) — Final Output
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400">Pre-output (R₁₆ || L₁₆ Halves Swapped):</span>
                <div className="p-2 bg-slate-900 rounded-lg text-slate-200 mt-1 select-all font-bold">
                  {execution.preOutputHex}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Final Ciphertext Block (IP⁻¹):</span>
                <div className="p-2 bg-slate-900 rounded-lg text-emerald-300 mt-1 select-all font-bold">
                  {execution.outputHex}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Note: Horst Feistel designed the 32-bit swap after Round 16 so that encryption and decryption logic remain strictly identical!
            </div>
          </div>
        </div>
      ) : (
        /* 16 Round Accordion List */
        <div className="mt-5 space-y-2.5">
          {execution.rounds.map((rd) => {
            const isExpanded = expandedRound === rd.round;
            return (
              <div
                key={rd.round}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'bg-slate-950 border-indigo-500/50 shadow-lg'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Round Bar Button */}
                <button
                  type="button"
                  onClick={() => setExpandedRound(isExpanded ? null : rd.round)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        isExpanded
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {rd.round}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-200">
                        Round {rd.round}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-2 font-mono">
                        Subkey K{rd.subkeyRoundIndex}: <span className="text-amber-400">{rd.subkeyHex}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Halves Preview */}
                    <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
                      <span className="text-slate-400">L:</span>
                      <span className="text-indigo-300 font-bold">{rd.lOutHex}</span>
                      <span className="text-slate-400 ml-2">R:</span>
                      <span className="text-purple-300 font-bold">{rd.rOutHex}</span>
                    </div>

                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </button>

                {/* Expanded Deep Dive on Feistel function */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-4">
                    {/* Feistel Halves Transition Diagram */}
                    <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
                      <div className="text-[11px] font-mono uppercase text-slate-400 mb-2">
                        Feistel Step: L_{rd.round} = R_{rd.round - 1}, &nbsp; R_{rd.round} = L_{rd.round - 1} ⊕ F(R_{rd.round - 1}, K_{rd.subkeyRoundIndex})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                        <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/70">
                          <span className="text-slate-400 block text-[10px]">Input Left Half (L_{rd.round - 1})</span>
                          <span className="text-indigo-300 font-bold text-sm">{rd.lInHex}</span>
                        </div>
                        <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/70">
                          <span className="text-slate-400 block text-[10px]">Input Right Half (R_{rd.round - 1})</span>
                          <span className="text-purple-300 font-bold text-sm">{rd.rInHex}</span>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Inside the F-Function */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
                          Inside the Round Function F(R, K)
                        </span>
                        <CryptoTooltip term="sbox" />
                        <CryptoTooltip term="pbox" />
                      </div>

                      {/* 1. Expansion Table E */}
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs font-mono">
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                          <span>1. Expansion E (32 bits → 48 bits):</span>
                          <span className="text-[10px] text-slate-500">Duplicated edge bits</span>
                        </div>
                        <div className="text-cyan-300 font-mono break-all text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                          {rd.fTrace.expandedRBin}
                        </div>
                      </div>

                      {/* 2. XOR with Subkey */}
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs font-mono">
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                          <span>2. E(R) ⊕ Subkey K_{rd.subkeyRoundIndex} (48 bits):</span>
                          <span className="text-amber-400 font-bold">Key: {rd.subkeyHex}</span>
                        </div>
                        <div className="text-amber-300 font-mono break-all text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                          {rd.fTrace.xorKeyBin}
                        </div>
                      </div>

                      {/* 3. 8 S-Boxes Grid */}
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                          <span>3. Substitution via 8 S-Boxes (6 bits in → 4 bits out):</span>
                          <span className="text-[10px] text-indigo-400 font-sans">
                            Outer bits choose row (0–3), inner bits choose col (0–15)
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                          {rd.fTrace.sBoxInputs.map((in6, sIdx) => {
                            const rc = rd.fTrace.sBoxRowCols[sIdx];
                            const out4 = rd.fTrace.sBoxOutputs[sIdx];
                            return (
                              <div
                                key={sIdx}
                                className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-center font-mono"
                              >
                                <div className="text-[10px] font-bold text-indigo-400">
                                  S{sIdx + 1}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  In: <span className="text-cyan-300">{in6}</span>
                                </div>
                                <div className="text-[9px] text-slate-500">
                                  r:{rc.row}, c:{rc.col}
                                </div>
                                <div className="mt-1 pt-1 border-t border-slate-800 text-xs font-bold text-emerald-400">
                                  {out4} ({rc.val})
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 4. Permutation P-Box & Output */}
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs font-mono">
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                          <span>4. Permutation P-Box (32 bits → 32 bits):</span>
                          <span className="text-emerald-400 font-bold">
                            F(R, K) = {rd.fTrace.pBoxOutHex}
                          </span>
                        </div>
                        <div className="text-emerald-300 font-mono break-all text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                          {rd.fTrace.pBoxOutBin}
                        </div>
                      </div>

                      {/* 5. Round Output Results */}
                      <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                        <div>
                          <span className="text-slate-400 block text-[10px]">
                            L_{rd.round} = R_{rd.round - 1}:
                          </span>
                          <span className="text-indigo-300 font-bold text-sm">
                            {rd.lOutHex}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">
                            R_{rd.round} = L_{rd.round - 1} ⊕ F:
                          </span>
                          <span className="text-purple-300 font-bold text-sm">
                            {rd.rOutHex}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Combined 64-bit:</span>
                          <span className="text-cyan-300 font-bold text-sm">
                            {rd.combinedRoundHex}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
