import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  Layers,
} from 'lucide-react';
import type { HillProcessResult } from '../lib/hillCipher';

interface HillStepVisualizerProps {
  result: HillProcessResult | null;
}

export const HillStepVisualizer: React.FC<HillStepVisualizerProps> = ({ result }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1800); // ms per step

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying || !result) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= result.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, result]);

  if (!result || !result.success || result.steps.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-400">
        <Layers className="w-10 h-10 mx-auto text-slate-600 mb-2" />
        <p className="text-sm">Run encryption or decryption above to see the step-by-step breakdown.</p>
      </div>
    );
  }

  const activeStepIndex = Math.min(currentStepIndex, result.steps.length - 1);
  const activeStep = result.steps[activeStepIndex];
  const appliedMatrix = result.appliedMatrix;
  const n = result.blockSize;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl">
      {/* Top Header & Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold text-white">
              {result.mode === 'encrypt' ? 'Encryption Math Breakdown' : 'Decryption Math Breakdown'}
            </span>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded font-semibold ${
                result.mode === 'encrypt'
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
              }`}
            >
              {result.mode === 'encrypt' ? 'C = (K · P) mod 26' : 'P = (K⁻¹ · C) mod 26'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Block {activeStepIndex + 1} of {result.steps.length} &bull; Transformed block:{' '}
            <span className="font-mono font-bold text-cyan-300 tracking-wider">
              &quot;{activeStep.blockText}&quot;
            </span>{' '}
            →{' '}
            <span className="font-mono font-bold text-emerald-400 tracking-wider">
              &quot;{activeStep.outputText}&quot;
            </span>
          </p>
        </div>

        {/* Playback Button Group */}
        <div className="flex items-center gap-2">
          {/* Step Prev */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(Math.max(0, activeStepIndex - 1));
            }}
            disabled={activeStepIndex === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors"
            title="Previous Block"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button
            type="button"
            onClick={() => {
              if (activeStepIndex >= result.steps.length - 1) {
                setCurrentStepIndex(0);
              }
              setIsPlaying(!isPlaying);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
              isPlaying
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Auto-Play
              </>
            )}
          </button>

          {/* Step Next */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(Math.min(result.steps.length - 1, activeStepIndex + 1));
            }}
            disabled={activeStepIndex >= result.steps.length - 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors"
            title="Next Block"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset to Block 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Toggle */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setPlaybackSpeed(1800)}
              className={`px-1.5 py-0.5 rounded ${
                playbackSpeed === 1800 ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              1x
            </button>
            <button
              type="button"
              onClick={() => setPlaybackSpeed(900)}
              className={`px-1.5 py-0.5 rounded ${
                playbackSpeed === 900 ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              2x
            </button>
          </div>
        </div>
      </div>

      {/* Block Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 my-4">
        {result.steps.map((st, idx) => {
          const isCurrent = idx === activeStepIndex;
          const isPassed = idx < activeStepIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`p-2 rounded-xl text-center font-mono transition-all border ${
                isCurrent
                  ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg ring-1 ring-indigo-400'
                  : isPassed
                  ? 'bg-slate-950/80 border-slate-700/80 text-slate-300 hover:border-slate-500'
                  : 'bg-slate-950/40 border-slate-800/40 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] text-slate-400">Block {idx + 1}</div>
              <div className="text-xs font-bold tracking-wider mt-0.5">
                <span className="text-cyan-400">{st.blockText}</span>
                <span className="text-slate-500 mx-1">→</span>
                <span className="text-emerald-400">{st.outputText}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Calculation Board */}
      <div className="p-5 sm:p-6 bg-slate-950/80 rounded-2xl border border-slate-800/90 mt-4 space-y-6">
        {/* Step Visual: Character to Number Mapping */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            1. Character-to-Numeric Vector Mapping (A=0, B=1, ..., Z=25)
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {activeStep.blockText.split('').map((char, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-2.5 bg-slate-900 rounded-xl border border-slate-700/80 min-w-16 shadow-inner"
              >
                <span className="text-base font-bold font-mono text-cyan-300">{char}</span>
                <span className="text-[10px] text-slate-500">Letter</span>
                <span className="w-full my-1 border-t border-slate-800" />
                <span className="text-sm font-bold font-mono text-amber-300">
                  {activeStep.inputVector[i]}
                </span>
                <span className="text-[10px] text-slate-500">Value</span>
              </div>
            ))}
            <div className="text-slate-500 font-mono text-xs px-2">
              ⟹ Vector <span className="text-amber-300 font-bold">V</span> = [
              {activeStep.inputVector.join(', ')}]<sup>T</sup>
            </div>
          </div>
        </div>

        {/* Step Visual: Matrix Multiplication */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            2. Matrix Multiplication & Modulo 26 Calculation
          </span>

          {/* Visual Matrix * Vector layout */}
          <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 text-sm font-mono">
            {/* Applied Matrix */}
            <div className="flex items-center">
              <span className="text-indigo-400 text-xl mr-1 font-serif">[</span>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                {appliedMatrix.map((row, r) =>
                  row.map((val, c) => (
                    <span
                      key={`${r}-${c}`}
                      className="w-10 h-8 flex items-center justify-center bg-slate-950 rounded border border-slate-800 text-indigo-300 font-bold"
                    >
                      {val}
                    </span>
                  ))
                )}
              </div>
              <span className="text-indigo-400 text-xl ml-1 font-serif">]</span>
            </div>

            <span className="text-slate-400 font-bold text-lg">×</span>

            {/* Vector */}
            <div className="flex items-center">
              <span className="text-amber-400 text-xl mr-1 font-serif">[</span>
              <div className="flex flex-col gap-1">
                {activeStep.inputVector.map((val, i) => (
                  <span
                    key={i}
                    className="w-10 h-8 flex items-center justify-center bg-slate-950 rounded border border-slate-800 text-amber-300 font-bold"
                  >
                    {val}
                  </span>
                ))}
              </div>
              <span className="text-amber-400 text-xl ml-1 font-serif">]</span>
            </div>

            <span className="text-slate-400 font-bold text-lg">=</span>

            {/* Resulting Vector */}
            <div className="flex items-center">
              <span className="text-emerald-400 text-xl mr-1 font-serif">[</span>
              <div className="flex flex-col gap-1">
                {activeStep.outputVector.map((val, i) => (
                  <span
                    key={i}
                    className="w-10 h-8 flex items-center justify-center bg-slate-950 rounded border border-slate-800 text-emerald-400 font-bold"
                  >
                    {val}
                  </span>
                ))}
              </div>
              <span className="text-emerald-400 text-xl ml-1 font-serif">]</span>
            </div>

            <span className="text-xs text-slate-500 font-sans ml-2">
              (mod 26)
            </span>
          </div>

          {/* Row-by-row arithmetic details */}
          <div className="mt-4 space-y-2.5">
            {activeStep.calculations.map((calc) => (
              <div
                key={calc.row}
                className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                    Row {calc.row + 1}
                  </span>
                  <span className="text-slate-300">{calc.expression}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">mod 26 =</span>
                  <span className="text-amber-400 font-bold px-2 py-0.5 bg-amber-950/40 rounded border border-amber-800/40">
                    {calc.modResult}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-emerald-400 font-bold text-base px-2.5 py-0.5 bg-emerald-950/60 rounded-lg border border-emerald-600/60">
                    &apos;{calc.resultingChar}&apos;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Visual: Ciphertext Block Assembly */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono text-slate-400">Resulting Block:</span>
            <span className="text-lg font-mono font-extrabold text-emerald-400 bg-slate-900 px-3 py-1 rounded-lg border border-emerald-500/30">
              {activeStep.outputText}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Cumulative {result.mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'}:
            </span>
            <span className="text-sm font-mono font-bold text-white bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 tracking-wider">
              {result.steps
                .slice(0, activeStepIndex + 1)
                .map((s) => s.outputText)
                .join('')}
              <span className="opacity-30">
                {result.steps
                  .slice(activeStepIndex + 1)
                  .map((s) => s.outputText)
                  .join('')}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
