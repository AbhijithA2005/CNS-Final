"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Calculator,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { validateMatrixApi, type MatrixValidationResult } from "@/lib/api";

const DEMO_STAGES = ["Hill Cipher", "DES-CBC", "HMAC-SHA256"];
const HILL_DEMO_MATRIX = [[3, 5], [6, 17]];
const DES_NIST_ROUNDS = [
  ["1B02EFFC7072", "CC00CCFF", "F0AAF0AA", "234AA9BB", "EF4A6544"],
  ["79AED9DBC9E5", "F0AAF0AA", "EF4A6544", "3CAB87A3", "CC017709"],
  ["55FC8A42CF99", "EF4A6544", "CC017709", "4D166EB0", "A25C0BF4"],
  ["72ADD6DB351D", "CC017709", "A25C0BF4", "BB23774C", "77220045"],
  ["7CEC07EB53A8", "A25C0BF4", "77220045", "2813ADC3", "8A4FA637"],
  ["63A53E507B2F", "77220045", "8A4FA637", "9E45CD2C", "E967CD69"],
  ["EC84B7F618BC", "8A4FA637", "E967CD69", "8C051C27", "064ABA10"],
  ["F78A3AC13BFB", "E967CD69", "064ABA10", "3C0E86F9", "D5694B90"],
  ["E0DBEBEDE781", "064ABA10", "D5694B90", "22367C6A", "247CC67A"],
  ["B1F347BA464F", "D5694B90", "247CC67A", "62BC9C22", "B7D5D7B2"],
  ["215FD3DED386", "247CC67A", "B7D5D7B2", "E104FA02", "C5783C78"],
  ["7571F59467E9", "B7D5D7B2", "C5783C78", "C268CFEA", "75BD1858"],
  ["97C5D1FABA41", "C5783C78", "75BD1858", "DDBB2922", "18C3155A"],
  ["5F43B7F2E73A", "75BD1858", "18C3155A", "B7318E55", "C28C960D"],
  ["BF918D3D3F0A", "18C3155A", "C28C960D", "5B81276E", "43423234"],
  ["CB3D8B0E17F5", "C28C960D", "43423234", "C8C04F98", "0A4CD995"],
].map(([subkey, left, right, roundFunction, nextRight], index) => ({
  round: index + 1,
  subkey,
  left,
  right,
  roundFunction,
  nextLeft: right,
  nextRight,
}));

export default function AboutSecurityPage() {
  // Interactive Hill Matrix Invertibility Playground state
  const [a, setA] = useState("3");
  const [b, setB] = useState("5");
  const [c, setC] = useState("6");
  const [d, setD] = useState("17");
  const [calcResult, setCalcResult] = useState<MatrixValidationResult | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [demoStage, setDemoStage] = useState(0);
  const [hillDemoText, setHillDemoText] = useState("Hi");
  const [selectedHillBlock, setSelectedHillBlock] = useState(0);
  const [selectedDesRound, setSelectedDesRound] = useState(0);

  const hillBytes = Array.from(new TextEncoder().encode(hillDemoText).slice(0, 32));
  if (hillBytes.length === 0) hillBytes.push(0);
  if (hillBytes.length % 2 !== 0) hillBytes.push(0);
  const hillBlocks = Array.from({ length: hillBytes.length / 2 }, (_, index) => {
    const bytes = hillBytes.slice(index * 2, index * 2 + 2);
    const [first, second] = bytes;
    return {
      input: bytes,
      output: [
        (first * HILL_DEMO_MATRIX[0][0] + second * HILL_DEMO_MATRIX[0][1]) % 256,
        (first * HILL_DEMO_MATRIX[1][0] + second * HILL_DEMO_MATRIX[1][1]) % 256,
      ],
    };
  });
  const activeHillBlock = hillBlocks[Math.min(selectedHillBlock, hillBlocks.length - 1)];
  const activeDesRound = DES_NIST_ROUNDS[selectedDesRound];

  const handleTestMatrix = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalcLoading(true);
    try {
      const mat = [
        [parseInt(a, 10), parseInt(b, 10)],
        [parseInt(c, 10), parseInt(d, 10)],
      ];
      const res = await validateMatrixApi(mat);
      setCalcResult(res);
    } catch (err: unknown) {
      setCalcResult({
        is_valid: false,
        determinant: 0,
        is_coprime_256: false,
        det_modular_inverse: null,
        inverse_matrix: null,
        explanation: err instanceof Error ? err.message : "Failed to evaluate matrix.",
      });
    } finally {
      setCalcLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Hill Matrix Tool
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Check whether a 2×2 matrix is invertible modulo 256.
        </p>
      </div>

      {/* Interactive Hill Cipher Matrix Invertibility Calculator */}
      <GlassCard id="hill-matrix" className="p-6 sm:p-8 space-y-6 border-indigo-500/30 bg-indigo-500/[0.02]">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">
              Interactive Hill Matrix Invertibility Playground
            </h2>
          </div>
          <span className="text-xs text-slate-400">Ring ℤ₂₅₆ (Modulo 256)</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Try any 2×2 integer matrix to verify if it satisfies the Hill Cipher condition for binary file encryption:
          <code className="text-indigo-300 font-mono ml-1">gcd(det(K) mod 256, 256) == 1</code> (meaning det must be <strong>odd</strong>).
        </p>

        <form onSubmit={handleTestMatrix} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono block text-center">Row 1, Col 1 (a)</label>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full p-2.5 text-center text-sm font-mono rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono block text-center">Row 1, Col 2 (b)</label>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="w-full p-2.5 text-center text-sm font-mono rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono block text-center">Row 2, Col 1 (c)</label>
              <input
                type="number"
                value={c}
                onChange={(e) => setC(e.target.value)}
                className="w-full p-2.5 text-center text-sm font-mono rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono block text-center">Row 2, Col 2 (d)</label>
              <input
                type="number"
                value={d}
                onChange={(e) => setD(e.target.value)}
                className="w-full p-2.5 text-center text-sm font-mono rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <GlassButton
              type="submit"
              variant="secondary"
              size="sm"
              isLoading={calcLoading}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Evaluate Matrix Modulo 256
            </GlassButton>
          </div>
        </form>

        {calcResult && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 animate-in fade-in duration-200 ${
              calcResult.is_valid
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                : "bg-rose-950/40 border-rose-500/30 text-rose-200"
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              {calcResult.is_valid ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Valid Invertible Matrix!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span>Matrix Cannot Be Inverted!</span>
                </>
              )}
            </div>
            <p className="leading-relaxed">{calcResult.explanation}</p>
            {calcResult.inverse_matrix && (
              <div className="pt-2 border-t border-emerald-500/20 font-mono text-xs">
                <span>Computed Inverse Matrix (K⁻¹ mod 256): </span>
                <span className="text-white font-bold">
                  {JSON.stringify(calcResult.inverse_matrix)}
                </span>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      <GlassCard id="pipeline-demo" className="space-y-5 p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Pipeline Walkthrough</h2>
            <p className="mt-1 text-xs text-slate-400">Step through one sample from input to integrity check.</p>
          </div>
          <div role="tablist" aria-label="Pipeline stages" className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-black/10 p-1">
            {DEMO_STAGES.map((stage, index) => (
              <button
                key={stage}
                type="button"
                role="tab"
                aria-selected={demoStage === index}
                onClick={() => setDemoStage(index)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  demoStage === index
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <div role="tabpanel" aria-live="polite" className="min-h-36 rounded-2xl border border-white/[0.08] bg-black/10 p-4 sm:p-5">
          {demoStage === 0 && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <label className="block min-w-0 flex-1 text-xs font-medium text-slate-300">
                  Sample text (UTF-8, up to 32 bytes)
                  <input
                    value={hillDemoText}
                    maxLength={32}
                    onChange={(event) => setHillDemoText(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-sm text-white outline-none focus:border-indigo-400"
                  />
                </label>
                <p className="text-xs text-slate-400 sm:max-w-xs">
                  Matrix K: [[3, 5], [6, 17]] · Each byte pair is transformed modulo 256.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-8">
                {hillBlocks.map((block, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-pressed={Math.min(selectedHillBlock, hillBlocks.length - 1) === index}
                    onClick={() => setSelectedHillBlock(index)}
                    className={`rounded-lg border px-2 py-2 text-left font-mono text-[10px] transition-colors ${
                      Math.min(selectedHillBlock, hillBlocks.length - 1) === index
                        ? "border-indigo-400 bg-indigo-500/15 text-indigo-200"
                        : "border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="block text-[9px] text-slate-500">PAIR {index + 1}</span>
                    {block.input.map((byte) => byte.toString(16).padStart(2, "0")).join(" ")}
                    <span className="mx-1 text-slate-500">→</span>
                    {block.output.map((byte) => byte.toString(16).padStart(2, "0")).join(" ")}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-slate-400">Input byte pair</p>
                  <p className="mt-1 font-mono text-sm text-white">
                    [{activeHillBlock.input.join(", ")}] · 0x{activeHillBlock.input.map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase()}
                  </p>
                </div>
                <span className="text-center text-indigo-300" aria-hidden="true">→</span>
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.06] p-4">
                  <p className="text-xs text-slate-400">Hill output pair</p>
                  <p className="mt-1 font-mono text-sm text-indigo-300">
                    [{activeHillBlock.output.join(", ")}] · 0x{activeHillBlock.output.map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {activeHillBlock.output.map((output, row) => (
                  <p key={row} className="rounded-lg bg-white/[0.03] p-3 font-mono text-xs text-slate-300">
                    Row {row + 1}: ({activeHillBlock.input[0]} × {HILL_DEMO_MATRIX[row][0]}) + ({activeHillBlock.input[1]} × {HILL_DEMO_MATRIX[row][1]}) = {activeHillBlock.input[0] * HILL_DEMO_MATRIX[row][0] + activeHillBlock.input[1] * HILL_DEMO_MATRIX[row][1]} mod 256 = <span className="text-indigo-300">{output}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {demoStage === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-white">DES 16-round trace · NIST reference block</p>
                <p className="font-mono text-[10px] text-slate-400">P 0123456789ABCDEF · K 133457799BBCDFF1</p>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {DES_NIST_ROUNDS.map((round, index) => (
                  <button
                    key={round.round}
                    type="button"
                    aria-label={`Select DES round ${round.round}`}
                    aria-pressed={selectedDesRound === index}
                    onClick={() => setSelectedDesRound(index)}
                    className={`rounded-lg border px-2 py-2 font-mono text-xs transition-colors ${
                      selectedDesRound === index
                        ? "border-purple-400 bg-purple-500/15 text-purple-200"
                        : "border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.06]"
                    }`}
                  >
                    R{round.round}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Round subkey", activeDesRound.subkey],
                  ["L input", activeDesRound.left],
                  ["R input", activeDesRound.right],
                  ["F(R, K)", activeDesRound.roundFunction],
                  ["L output = R input", activeDesRound.nextLeft],
                  ["R output = L ⊕ F", activeDesRound.nextRight],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0 rounded-xl border border-purple-500/15 bg-purple-500/[0.04] p-3">
                    <p className="text-[10px] text-slate-400">{label}</p>
                    <p className="mt-1 break-all font-mono text-xs font-semibold text-purple-200">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-3 text-xs">
                <span className="text-slate-400">Known ciphertext after 16 rounds</span>
                <span className="font-mono font-semibold text-emerald-300">85E813540F0AB405</span>
              </div>
              <p className="text-[10px] text-slate-500">This is a fixed standard vector for inspecting DES rounds, not the ciphertext of the uploaded file.</p>
            </div>
          )}

          {demoStage === 2 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-white">The container is authenticated before any decryption happens.</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-300">Header + ciphertext</div>
                <span className="text-center text-sky-300" aria-hidden="true">→</span>
                <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.06] p-3 text-xs text-sky-200">HMAC-SHA256 tag</div>
                <span className="text-center text-sky-300" aria-hidden="true">→</span>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3 text-xs text-emerald-200">Verify, then decrypt</div>
              </div>
              <p className="text-xs text-slate-400">For a live file demo: Encrypt → download the .svault container → Decrypt with the same password → confirm the operation in History.</p>
            </div>
          )}
        </div>
      </GlassCard>

    </div>
  );
}
