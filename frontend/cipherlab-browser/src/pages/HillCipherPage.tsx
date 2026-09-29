import React, { useState } from 'react';
import {
  Grid3X3,
  Lock,
  Unlock,
  Copy,
  Check,
  ArrowRightLeft,
} from 'lucide-react';
import { MatrixInput } from '../components/MatrixInput';
import { HillStepVisualizer } from '../components/HillStepVisualizer';
import { encryptHill, decryptHill } from '../lib/hillCipher';
import type { HillProcessResult } from '../lib/hillCipher';
import { CryptoTooltip } from '../components/CryptoTooltip';

export const HillCipherPage: React.FC = () => {
  const [matrixSize, setMatrixSize] = useState<2 | 3>(2);
  const [matrix, setMatrix] = useState<(number | '')[][]>([
    ['', ''],
    ['', ''],
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [result, setResult] = useState<HillProcessResult | null>(null);


  const handleEncrypt = () => {
    const numericMatrix = matrix.map((row) => row.map((value) => (value === '' ? 0 : value)));
    const res = encryptHill(inputText, numericMatrix);
    setResult(res);
  };

  const handleDecrypt = () => {
    const numericMatrix = matrix.map((row) => row.map((value) => (value === '' ? 0 : value)));
    const res = decryptHill(inputText, numericMatrix);
    setResult(res);
  };

  const handleCopyResult = () => {
    if (!result?.resultText) return;
    navigator.clipboard.writeText(result.resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransferToInput = () => {
    if (result?.resultText) {
      setInputText(result.resultText);
    }
  };

  const loadWorkedExample = (exampleType: '2x2_help' | '2x2_secret' | '3x3_pay') => {
    if (exampleType === '2x2_help') {
      setMatrixSize(2);
      const m = [
        [3, 3],
        [2, 5],
      ];
      setMatrix(m);
      setInputText('HELP');
      setResult(null);
    } else if (exampleType === '2x2_secret') {
      setMatrixSize(2);
      const m = [
        [9, 4],
        [5, 7],
      ];
      setMatrix(m);
      setInputText('DEFENDTHEEAST');
      setResult(null);
    } else if (exampleType === '3x3_pay') {
      setMatrixSize(3);
      const m = [
        [6, 24, 1],
        [13, 16, 10],
        [20, 17, 15],
      ];
      setMatrix(m);
      setInputText('ACT');
      setResult(null);
    }
  };

  return (
    <div className="space-y-7 py-2 sm:space-y-8 sm:py-4">
      {/* Page Title & Context Header */}
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Grid3X3 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Hill Cipher Interactive Studio
            </h1>
            <CryptoTooltip term="polygraphic" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Polygraphic substitution cipher based on linear algebra and modular matrix arithmetic over ℤ₂₆.
          </p>
        </div>

        {/* Preloaded Worked Examples Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden text-xs font-mono text-slate-400 sm:inline">Worked Examples:</span>
          <button
            type="button"
            onClick={() => loadWorkedExample('2x2_help')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700"
          >
            2×2 &quot;HELP&quot;
          </button>
          <button
            type="button"
            onClick={() => loadWorkedExample('2x2_secret')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-indigo-300 border border-slate-700"
          >
            2×2 &quot;DEFEND&quot;
          </button>
          <button
            type="button"
            onClick={() => loadWorkedExample('3x3_pay')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-purple-300 border border-slate-700"
          >
            3×3 &quot;ACT&quot;
          </button>
        </div>
      </div>

      {/* Grid: Matrix Configuration & Text Input */}
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12 xl:gap-6">
        {/* Left Column: Key Matrix Input */}
        <div className="space-y-4 xl:col-span-7">
          <MatrixInput
            matrix={matrix}
            size={matrixSize}
            onChangeSize={(sz) => {
              setMatrixSize(sz);
              setResult(null);
            }}
            onChangeMatrix={(m) => {
              setMatrix(m);
              setResult(null);
            }}
          />
        </div>

        {/* Right Column: Text Input & Action Controls */}
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl xl:col-span-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-semibold text-slate-200">Text Input</span>
            <span className="text-xs text-slate-500 font-mono">Alphabet A-Z</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-mono block">
              Enter Plaintext or Ciphertext:
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setResult(null);
              }}
              placeholder="e.g. HELP, ATTACK AT DAWN..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white font-mono uppercase tracking-wider text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Non-letters stripped automatically</span>
              <span>Length: {inputText.replace(/[^a-zA-Z]/g, '').length} chars</span>
            </div>
          </div>

          {/* Action Buttons: Encrypt & Decrypt */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleEncrypt}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              <span>Encrypt</span>
            </button>

            <button
              type="button"
              onClick={handleDecrypt}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98]"
            >
              <Unlock className="w-4 h-4" />
              <span>Decrypt</span>
            </button>
          </div>

          {/* Quick Result Preview Card */}
          {result?.success && (
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">
                  {result.mode === 'encrypt' ? 'Ciphertext Output' : 'Plaintext Output'}:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTransferToInput}
                    className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
                    title="Transfer output back to input for reverse testing"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyResult}
                    className="p-1 text-slate-400 hover:text-emerald-300 transition-colors"
                    title="Copy result"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="font-mono font-extrabold text-lg text-emerald-400 tracking-widest break-all select-all">
                {result.resultText}
              </div>

              {result.padCount > 0 && (
                <div className="text-[11px] text-amber-400 font-mono pt-1 border-t border-slate-900">
                  Notice: Padded with {result.padCount} &apos;X&apos; character(s) to form full {result.blockSize}-letter blocks.
                </div>
              )}
            </div>
          )}

          {result && !result.success && result.errorMessage && (
            <div className="p-3 bg-rose-950/60 rounded-xl border border-rose-600/60 text-rose-300 text-xs font-mono">
              Error: {result.errorMessage}
            </div>
          )}
        </div>
      </div>

      {/* Step-by-Step Animated Mathematical Breakdown */}
      <div className="pt-2">
        <HillStepVisualizer result={result} />
      </div>

    </div>
  );
};
