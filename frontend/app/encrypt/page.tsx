"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Lock,
  Download,
  RotateCcw,
  CheckCircle2,
  KeyRound,
  Shield,
  Layers,
  FileCheck,
  Hash,
  AlertCircle,
  Eye,
  Sliders,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { GlassInput } from "@/components/GlassInput";
import { FileDropzone } from "@/components/FileDropzone";
import { FilePreview } from "@/components/FilePreview";
import { EncryptionPipeline } from "@/components/EncryptionPipeline";
import { useToast } from "@/components/Toast";
import { encryptFileApi, checkPasswordStrength, getDownloadUrl } from "@/lib/api";
import { formatBytes, truncateHash } from "@/lib/utils";
import { EncryptionResult } from "@/types";

export default function EncryptPage() {
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    level: string;
    suggestions: string[];
  }>({ score: 0, level: "Weak", suggestions: [] });

  // Optional custom Hill Cipher matrix (advanced viva feature)
  const [showAdvancedMatrix, setShowAdvancedMatrix] = useState(false);
  const [k00, setK00] = useState("3");
  const [k01, setK01] = useState("5");
  const [k10, setK10] = useState("6");
  const [k11, setK11] = useState("17");

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [result, setResult] = useState<EncryptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle password input and evaluate strength
  const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setError(null);
    if (!val) {
      setPasswordStrength({ score: 0, level: "Weak", suggestions: [] });
      return;
    }
    try {
      const res = await checkPasswordStrength(val);
      setPasswordStrength(res);
    } catch {
      // Local fallback
      const score = val.length >= 10 ? 3 : val.length >= 6 ? 2 : 1;
      setPasswordStrength({
        score,
        level: score === 3 ? "Strong" : score === 2 ? "Moderate" : "Weak",
        suggestions: [],
      });
    }
  };

  const handleStartEncryption = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Please select a file to encrypt.");
      toast("Please select a file to encrypt", "error");
      return;
    }

    if (!password) {
      setError("Please provide an encryption key or password.");
      toast("Please enter an encryption password", "error");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      toast("Passwords do not match", "error");
      return;
    }

    let customMatrix: number[][] | undefined = undefined;
    if (showAdvancedMatrix) {
      const mat = [
        [parseInt(k00, 10), parseInt(k01, 10)],
        [parseInt(k10, 10), parseInt(k11, 10)],
      ];
      if (mat.some((row) => row.some((v) => isNaN(v)))) {
        setError("Invalid custom matrix numbers. Please provide integer coefficients.");
        return;
      }
      customMatrix = mat;
    }

    setIsProcessing(true);
    setProgressStep(1);

    try {
      // Step 1: Key Derivation
      await new Promise((r) => setTimeout(r, 450));
      setProgressStep(2);

      // Step 2: Hill Cipher
      await new Promise((r) => setTimeout(r, 550));
      setProgressStep(3);

      // Step 3: DES-CBC
      await new Promise((r) => setTimeout(r, 550));
      setProgressStep(4);

      // Call API
      const encData = await encryptFileApi(file, password, customMatrix);
      await new Promise((r) => setTimeout(r, 400));

      setResult(encData);
      toast("File encrypted successfully!", "success");
    } catch (err: any) {
      setError(err.message || "Failed to encrypt file. Please try again.");
      toast(err.message || "Encryption failed", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPassword("");
    setConfirmPassword("");
    setPasswordStrength({ score: 0, level: "Weak", suggestions: [] });
    setResult(null);
    setError(null);
    setProgressStep(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Encrypt a File
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Protect your file with layered Hill Cipher + DES cryptography.
        </p>
      </div>

      {!result ? (
        <form onSubmit={handleStartEncryption} className="space-y-6">
          
          {/* STEP 1: Upload File */}
          <GlassCard className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-base font-semibold text-white">Select File to Encrypt</h2>
            </div>

            {!file ? (
              <FileDropzone onFileSelect={(f) => setFile(f)} />
            ) : (
              <FilePreview file={file} onRemove={() => setFile(null)} />
            )}
          </GlassCard>

          {/* STEP 2: Encryption Key & Password Confirmation */}
          <GlassCard className="p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-base font-semibold text-white">Encryption Credentials</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassInput
                label="Master Encryption Key / Password"
                type="password"
                placeholder="Enter strong password..."
                value={password}
                onChange={handlePasswordChange}
                showPasswordToggle
                strengthScore={passwordStrength.score}
                strengthLevel={password ? passwordStrength.level : undefined}
                icon={<KeyRound className="w-4 h-4" />}
                required
              />

              <GlassInput
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password..."
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(null);
                }}
                showPasswordToggle
                icon={<Lock className="w-4 h-4" />}
                error={
                  confirmPassword && password !== confirmPassword
                    ? "Passwords do not match"
                    : undefined
                }
                required
              />
            </div>

            {/* Advanced Hill Cipher Matrix Option (Viva Feature) */}
            <div className="pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setShowAdvancedMatrix(!showAdvancedMatrix)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showAdvancedMatrix ? "Hide Custom Hill Matrix" : "Advanced: Configure Custom Hill Matrix (Optional)"}</span>
              </button>

              {showAdvancedMatrix && (
                <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">Custom 2x2 Matrix Modulo 256</span>
                    <span className="text-slate-400">det(K) must be odd</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                    <input
                      type="number"
                      value={k00}
                      onChange={(e) => setK00(e.target.value)}
                      className="p-2 text-center text-sm font-mono rounded-xl bg-white/5 border border-white/10 text-white"
                      placeholder="k00"
                    />
                    <input
                      type="number"
                      value={k01}
                      onChange={(e) => setK01(e.target.value)}
                      className="p-2 text-center text-sm font-mono rounded-xl bg-white/5 border border-white/10 text-white"
                      placeholder="k01"
                    />
                    <input
                      type="number"
                      value={k10}
                      onChange={(e) => setK10(e.target.value)}
                      className="p-2 text-center text-sm font-mono rounded-xl bg-white/5 border border-white/10 text-white"
                      placeholder="k10"
                    />
                    <input
                      type="number"
                      value={k11}
                      onChange={(e) => setK11(e.target.value)}
                      className="p-2 text-center text-sm font-mono rounded-xl bg-white/5 border border-white/10 text-white"
                      placeholder="k11"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 text-center">
                    Default derived deterministically via PBKDF2 if not customized.
                  </p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* STEP 3 & 4: Cryptographic Pipeline & Progress */}
          <GlassCard className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h2 className="text-base font-semibold text-white">Cryptographic Pipeline</h2>
            </div>

            <EncryptionPipeline
              progress={{ step: progressStep }}
              isProcessing={isProcessing}
            />
          </GlassCard>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex justify-end">
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              isLoading={isProcessing}
              disabled={!file || !password || password !== confirmPassword}
              icon={<Lock className="w-5 h-5" />}
            >
              {isProcessing ? "Encrypting File..." : "Execute Layered Encryption"}
            </GlassButton>
          </div>
        </form>
      ) : (
        /* STEP 5: Success Screen */
        <div className="space-y-6 animate-in fade-in duration-300">
          <GlassCard glow className="p-6 sm:p-10 space-y-8 border-emerald-500/30 bg-emerald-950/[0.08]">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                File Encrypted Successfully
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                Your file has been transformed with Hill Cipher matrix substitution and DES-CBC block encryption. An HMAC-SHA256 authentication tag has been sealed into the <code className="text-indigo-300 font-mono">.svault</code> container.
              </p>
            </div>

            {/* Metadata Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                <span className="text-xs text-slate-400">Original File</span>
                <p className="font-semibold text-white truncate">{result.original_filename}</p>
                <span className="text-xs text-slate-500">{formatBytes(result.original_size)}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                <span className="text-xs text-slate-400">Encrypted Container</span>
                <p className="font-semibold text-indigo-300 truncate">{result.stored_filename}</p>
                <span className="text-xs text-indigo-400 font-mono">{formatBytes(result.encrypted_size)}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                <span className="text-xs text-slate-400">Algorithms</span>
                <p className="font-semibold text-white">Hill Cipher + DES</p>
                <span className="text-xs text-slate-500">CBC Mode • PKCS#7</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                <span className="text-xs text-slate-400">Integrity Protection</span>
                <p className="font-semibold text-emerald-400">HMAC-SHA256</p>
                <span className="text-xs text-slate-500">Encrypt-then-MAC</span>
              </div>
            </div>

            {/* Hill Cipher Viva Metadata Box */}
            {result.hill_metadata && (
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Hill Cipher Parameters (ℤ₂₅₆)
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">Invertible Modulo 256</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block mb-1">Key Matrix (K):</span>
                    <span className="text-indigo-300 font-bold">
                      {JSON.stringify(result.hill_metadata.matrix)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Determinant det(K):</span>
                    <span className="text-amber-300">
                      {result.hill_metadata.determinant} (odd, gcd=1)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Inverse Matrix (K⁻¹ mod 256):</span>
                    <span className="text-purple-300">
                      {JSON.stringify(result.hill_metadata.inverse_matrix)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SHA-256 Hash Verification Audit */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Original File SHA-256 Checksum:</span>
                <span className="font-mono text-slate-300 select-all">{result.original_sha256}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Encrypted .svault SHA-256 Checksum:</span>
                <span className="font-mono text-indigo-300 select-all">{result.encrypted_sha256}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/10">
              <a href={getDownloadUrl(result.operation_id)} download className="w-full sm:w-auto">
                <GlassButton
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  icon={<Download className="w-5 h-5" />}
                >
                  Download Encrypted File (.svault)
                </GlassButton>
              </a>

              <GlassButton
                variant="secondary"
                size="lg"
                onClick={resetForm}
                className="w-full sm:w-auto"
                icon={<RotateCcw className="w-5 h-5" />}
              >
                Encrypt Another File
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
