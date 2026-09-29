import React, { useState, useMemo } from 'react';
import {
  Zap,
  BarChart3,
  Sliders,
} from 'lucide-react';
import { analyzeAvalanche } from '../lib/des';
import { CryptoTooltip } from './CryptoTooltip';

interface DesAvalancheLabProps {
  inputHex: string;
  keyHex: string;
}

export const DesAvalancheLab: React.FC<DesAvalancheLabProps> = ({ inputHex, keyHex }) => {
  const [target, setTarget] = useState<'plaintext' | 'key'>('plaintext');
  const [bitIndex, setBitIndex] = useState<number>(0);
  const [selectedRoundDiffIndex, setSelectedRoundDiffIndex] = useState<number>(17); // 17 = final ciphertext

  const avalanche = useMemo(() => {
    // Make sure we have 16 hex chars
    const cleanIn = inputHex.padEnd(16, '0').slice(0, 16);
    const cleanKey = keyHex.padEnd(16, '0').slice(0, 16);
    return analyzeAvalanche(cleanIn, cleanKey, bitIndex, target);
  }, [inputHex, keyHex, bitIndex, target]);

  const activeRoundDiff = avalanche.roundDiffs[selectedRoundDiffIndex] || avalanche.roundDiffs[17];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Avalanche Effect Laboratory
            </h3>
            <CryptoTooltip term="avalanche" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Observe how flipping just <strong>1 bit</strong> triggers non-linear diffusion, altering ~50% of the ciphertext bits across 16 rounds.
          </p>
        </div>

        {/* Target Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setTarget('plaintext')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              target === 'plaintext'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Flip Plaintext Bit
          </button>
          <button
            type="button"
            onClick={() => setTarget('key')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              target === 'key'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Flip Key Bit
          </button>
        </div>
      </div>

      {/* Bit Selection Control */}
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Selected Bit to Invert: Bit #{bitIndex} (0 to 63)
          </span>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-slate-500">Presets:</span>
            {[0, 7, 15, 31, 48, 63].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBitIndex(b)}
                className={`px-2 py-0.5 rounded ${
                  bitIndex === b
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                #{b}
              </button>
            ))}
          </div>
        </div>

        {/* 64-bit Interactive Clickable Matrix */}
        <div className="pt-2">
          <div className="text-[10px] text-slate-500 mb-1.5 font-mono flex justify-between">
            <span>Bit 0 (MSB)</span>
            <span>Click any cell to toggle the flipped bit position</span>
            <span>Bit 63 (LSB)</span>
          </div>
          <div className="grid grid-cols-16 sm:grid-cols-32 gap-1 p-2 bg-slate-900 rounded-lg border border-slate-800">
            {Array.from({ length: 64 }).map((_, i) => {
              const isSelected = i === bitIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setBitIndex(i)}
                  title={`Bit ${i}`}
                  className={`h-6 rounded text-[9px] font-mono flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-extrabold ring-2 ring-amber-300 scale-110 z-10'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {i}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hex Diff Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Original {target}:</span>
            <span className="text-slate-200 font-bold text-sm tracking-wider">
              {target === 'plaintext' ? avalanche.originalInputHex : avalanche.keyHex}
            </span>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-amber-400 text-[10px] block">Mutated {target} (1 bit inverted):</span>
            <span className="text-amber-300 font-bold text-sm tracking-wider">
              {target === 'plaintext' ? avalanche.mutatedInputHex : avalanche.mutatedInputHex}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Initial Bit Diff</span>
          <span className="text-xl font-bold font-mono text-amber-400">1 / 64</span>
          <span className="text-[10px] text-slate-500 block">1.56%</span>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Final Bits Flipped</span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            {avalanche.finalOutputDistance} / 64
          </span>
          <span className="text-[10px] text-slate-500 block">
            {avalanche.finalDifferencePercentage.toFixed(1)}%
          </span>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Strict Avalanche Target</span>
          <span className="text-xl font-bold font-mono text-cyan-400">32 / 64</span>
          <span className="text-[10px] text-slate-500 block">50.0% (Ideal)</span>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Diffusion Quality</span>
          <span
            className={`text-xl font-bold font-mono ${
              avalanche.finalDifferencePercentage >= 40 && avalanche.finalDifferencePercentage <= 60
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}
          >
            {avalanche.finalDifferencePercentage >= 40 && avalanche.finalDifferencePercentage <= 60
              ? 'Optimal'
              : 'Strong'}
          </span>
          <span className="text-[10px] text-slate-500 block">Shannon Diffusion</span>
        </div>
      </div>

      {/* Round-by-Round Accumulation Bar Chart */}
      <div className="p-4 sm:p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm font-bold text-slate-200">
              Round-by-Round Bit Difference Accumulation (Hamming Distance)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Click any bar to inspect its 64-bit diff
          </span>
        </div>

        {/* Visual Bar Chart */}
        <div className="space-y-1.5 pt-2">
          {avalanche.roundDiffs.map((rd, idx) => {
            const isSelected = idx === selectedRoundDiffIndex;
            const pct = rd.differencePercentage;
            // 50% line is 32 bits
            return (
              <div
                key={idx}
                onClick={() => setSelectedRoundDiffIndex(idx)}
                className={`flex items-center gap-3 p-1.5 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border border-indigo-500/50 shadow-inner'
                    : 'hover:bg-slate-900/50'
                }`}
              >
                {/* Round Label */}
                <span className="w-24 sm:w-28 text-[11px] font-mono text-slate-400 shrink-0 text-right">
                  {rd.roundLabel}
                </span>

                {/* Progress bar container */}
                <div className="flex-1 h-5 bg-slate-900 rounded-md relative overflow-hidden border border-slate-800">
                  {/* Ideal 50% Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-cyan-400/50 z-10"
                    style={{ left: '50%' }}
                    title="Ideal 50% Avalanche Target"
                  />

                  {/* Filled Bar */}
                  <div
                    className={`h-full transition-all duration-300 rounded ${
                      idx === 0
                        ? 'bg-amber-500'
                        : isSelected
                        ? 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                        : 'bg-indigo-600/70'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
                  />
                </div>

                {/* Number of bits changed */}
                <div className="w-20 text-right font-mono text-xs shrink-0">
                  <span
                    className={`font-bold ${
                      isSelected ? 'text-cyan-300' : 'text-slate-300'
                    }`}
                  >
                    {rd.hammingDistance}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-1">
                    ({pct.toFixed(0)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Bit Diff Inspection */}
      <div className="p-4 sm:p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 font-mono">
            Side-by-Side 64-Bit Inspection at [{activeRoundDiff.roundLabel}]
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 shadow-sm shadow-rose-500/50" />
              <span className="text-rose-300 font-mono">Flipped ({activeRoundDiff.hammingDistance} bits)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-700" />
              <span className="text-slate-400 font-mono">Unchanged</span>
            </span>
          </div>
        </div>

        {/* 64-bit Bit Grid */}
        <div className="grid grid-cols-16 sm:grid-cols-32 gap-1 p-3 bg-slate-900 rounded-xl border border-slate-800">
          {activeRoundDiff.diffMask.map((isFlipped, bit) => (
            <div
              key={bit}
              title={`Bit ${bit}: Original=${activeRoundDiff.block1Bin[bit]}, Mutated=${activeRoundDiff.block2Bin[bit]}`}
              className={`h-7 rounded flex flex-col items-center justify-center font-mono text-[9px] transition-all ${
                isFlipped
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500 font-extrabold shadow-sm shadow-rose-500/30'
                  : 'bg-slate-950 text-slate-500 border border-slate-800/80'
              }`}
            >
              <span>{activeRoundDiff.block1Bin[bit]}</span>
              <span className="text-[7px] text-slate-600">{bit}</span>
            </div>
          ))}
        </div>

        {/* Hex representations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono">
          <div className="p-2 bg-slate-900 rounded-lg text-slate-300">
            <span className="text-[10px] text-slate-500 block">Original Block:</span>
            <span className="font-bold">{activeRoundDiff.block1Hex}</span>
          </div>
          <div className="p-2 bg-slate-900 rounded-lg text-slate-300">
            <span className="text-[10px] text-amber-500 block">Mutated Block:</span>
            <span className="font-bold text-amber-300">{activeRoundDiff.block2Hex}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
