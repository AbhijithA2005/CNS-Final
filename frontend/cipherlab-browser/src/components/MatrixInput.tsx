import React from 'react';
import { Sparkles, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import {
  validateMatrixKey,
  generateRandomInvertibleMatrix,
  matrixInverseMod26,
} from '../lib/matrix';
import { CryptoTooltip } from './CryptoTooltip';

interface MatrixInputProps {
  matrix: (number | '')[][];
  size: 2 | 3;
  onChangeSize: (size: 2 | 3) => void;
  onChangeMatrix: (matrix: (number | '')[][]) => void;
}

export const MatrixInput: React.FC<MatrixInputProps> = ({
  matrix,
  size,
  onChangeSize,
  onChangeMatrix,
}) => {
  const hasEmptyCell = matrix.some((row) => row.some((value) => value === ''));
  const numericMatrix = matrix.map((row) => row.map((value) => (value === '' ? 0 : value)));
  const validation = validateMatrixKey(numericMatrix);
  const inverseInfo = validation.valid ? matrixInverseMod26(numericMatrix) : null;

  const handleCellChange = (r: number, c: number, valueStr: string) => {
    const val = parseInt(valueStr, 10);
    const newMatrix = matrix.map((row) => [...row]);
    newMatrix[r][c] = valueStr === '' || isNaN(val) ? '' : val;
    onChangeMatrix(newMatrix);
  };

  const handleGenerateRandom = () => {
    const randomMatrix = generateRandomInvertibleMatrix(size);
    onChangeMatrix(randomMatrix);
  };

  const loadPreset = (presetMatrix: number[][], presetSize: 2 | 3) => {
    onChangeSize(presetSize);
    onChangeMatrix(presetMatrix);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Header with dimension toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-200">Key Matrix</span>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
            K ∈ ℤ₂₆<sup>{size}×{size}</sup>
          </span>
          <CryptoTooltip term="modular_inverse" />
        </div>

        <div className="flex items-center gap-2">
          {/* Dimension toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (size !== 2) {
                  onChangeSize(2);
                  onChangeMatrix([
                    [3, 3],
                    [2, 5],
                  ]);
                }
              }}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                size === 2
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2 × 2
            </button>
            <button
              type="button"
              onClick={() => {
                if (size !== 3) {
                  onChangeSize(3);
                  onChangeMatrix([
                    [6, 24, 1],
                    [13, 16, 10],
                    [20, 17, 15],
                  ]);
                }
              }}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                size === 3
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3 × 3
            </button>
          </div>

          {/* Random valid key generator */}
          <button
            type="button"
            onClick={handleGenerateRandom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all shadow-sm group"
            title="Generate a guaranteed invertible matrix mod 26"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>Random Valid Key</span>
          </button>
        </div>
      </div>

      {/* Grid Inputs & Invertibility Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
        {/* Matrix Brackets & Numeric Cells */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
          <div className="flex items-center">
            {/* Left Bracket */}
            <div className="w-2.5 self-stretch border-l-2 border-t-2 border-b-2 border-indigo-400 rounded-l-md mr-2" />

            {/* Matrix Inputs Grid */}
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
              }}
            >
              {matrix.map((row, r) =>
                row.map((val, c) => (
                  <div key={`${r}-${c}`} className="relative">
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                      className="w-12 h-11 sm:w-14 sm:h-12 text-center font-mono font-bold text-sm sm:text-base rounded-lg bg-slate-900 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all shadow-inner"
                      aria-label={`Matrix element K[${r},${c}]`}
                    />
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono text-slate-500 pointer-events-none">
                      {r},{c}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Right Bracket */}
            <div className="w-2.5 self-stretch border-r-2 border-t-2 border-b-2 border-indigo-400 rounded-r-md ml-2" />
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
            <span className="text-slate-400">Presets:</span>
            {size === 2 ? (
              <>
                <button
                  type="button"
                  onClick={() => loadPreset([[3, 3], [2, 5]], 2)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                >
                  det=9 (Classic)
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset([[9, 4], [5, 7]], 2)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                >
                  det=43 (det mod 26=17)
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() =>
                    loadPreset(
                      [
                        [6, 24, 1],
                        [13, 16, 10],
                        [20, 17, 15],
                      ],
                      3
                    )
                  }
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                >
                  Standard 3×3
                </button>
                <button
                  type="button"
                  onClick={() =>
                    loadPreset(
                      [
                        [2, 3, 1],
                        [3, 7, 2],
                        [1, 2, 2],
                      ],
                      3
                    )
                  }
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                >
                  det=5 mod 26
                </button>
              </>
            )}
          </div>
        </div>

        {/* Validation and Mathematical Diagnostics */}
        <div className="lg:col-span-6 space-y-3">
          {/* Status Banner */}
          {hasEmptyCell ? (
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400">
              <div className="font-semibold text-sm text-slate-300">Enter a complete key matrix</div>
              <p className="text-xs mt-1 leading-relaxed">
                Fill every matrix cell, or choose a preset or random valid key to continue.
              </p>
            </div>
          ) : validation.valid ? (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm flex items-center gap-2">
                  <span>Key Matrix is Invertible Mod 26</span>
                  <span className="text-[10px] bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-200 border border-emerald-700 font-mono">
                    Valid for Encryption & Decryption
                  </span>
                </div>
                <p className="text-xs text-emerald-400/90 mt-1 leading-relaxed">
                  gcd(det(K) mod 26, 26) = 1. A unique modular inverse exists, so ciphertext can be reliably decrypted.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm flex items-center gap-2">
                  <span>Non-Invertible Key Matrix Error</span>
                  <span className="text-[10px] bg-rose-900/60 px-1.5 py-0.5 rounded text-rose-200 border border-rose-700 font-mono">
                    Singular over ℤ₂₆
                  </span>
                </div>
                <p className="text-xs text-rose-300 mt-1 font-mono">
                  {validation.error}
                </p>
                {validation.reason && (
                  <p className="text-xs text-rose-400/90 mt-1 leading-relaxed">
                    {validation.reason}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleGenerateRandom}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200 underline font-medium"
                >
                  <RefreshCw className="w-3 h-3" /> Fix automatically with a random valid key
                </button>
              </div>
            </div>
          )}

          {/* Mathematical Diagnostics Cards */}
          {!hasEmptyCell && <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">det(K)</span>
              <span className="text-sm font-mono font-bold text-slate-100">{validation.det}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">det mod 26</span>
              <span className="text-sm font-mono font-bold text-cyan-400">{validation.detMod26}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">gcd(det, 26)</span>
              <span
                className={`text-sm font-mono font-bold ${
                  validation.gcdVal === 1 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {validation.gcdVal}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">det⁻¹ mod 26</span>
              <span className="text-sm font-mono font-bold text-indigo-400">
                {validation.detInv !== null ? validation.detInv : 'None'}
              </span>
            </div>
          </div>}

          {/* Inverse Matrix preview when valid */}
          {inverseInfo && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <span className="font-mono text-slate-300">Inverse Key Matrix K⁻¹ mod 26:</span>
                <span className="font-mono text-[10px] text-indigo-400">
                  Used automatically for decryption
                </span>
              </div>
              <div className="flex items-center justify-center gap-1 font-mono font-bold text-cyan-300 bg-slate-900/80 py-1.5 px-3 rounded-lg border border-slate-800">
                {inverseInfo.inverse.map((row, r) => (
                  <span key={r} className="px-1.5">
                    [{row.join(', ')}]
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
