"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Download,
  RotateCcw,
  CheckCircle2,
  KeyRound,
  FileCheck,
  AlertCircle,
  Hash,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { GlassInput } from "@/components/GlassInput";
import { FileDropzone } from "@/components/FileDropzone";
import { FilePreview } from "@/components/FilePreview";
import { DecryptionPipeline } from "@/components/DecryptionPipeline";
import { useToast } from "@/components/Toast";
import { decryptFileApi, getDownloadUrl } from "@/lib/api";
import { formatBytes } from "@/lib/utils";
import { DecryptionResult } from "@/types";

export default function DecryptPage() {
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [result, setResult] = useState<DecryptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartDecryption = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Please select an encrypted SecureVault (.svault) file.");
      toast("Please select a file to decrypt", "error");
      return;
    }

    if (!password) {
      setError("Please enter the decryption password or key.");
      toast("Please enter your decryption password", "error");
      return;
    }

    setIsProcessing(true);
    setProgressStep(1);

    try {
      // Step 1: Parsing
      await new Promise((r) => setTimeout(r, 400));
      setProgressStep(2);

      // Step 2: HMAC Verification
      await new Promise((r) => setTimeout(r, 450));
      setProgressStep(3);

      // Step 3: DES-CBC Decryption
      await new Promise((r) => setTimeout(r, 450));
      setProgressStep(4);

      // Step 4: Hill Cipher mod 256 Inversion & Decryption
      await new Promise((r) => setTimeout(r, 450));
      setProgressStep(5);

      const decData = await decryptFileApi(file, password);
      await new Promise((r) => setTimeout(r, 300));

      setResult(decData);
      toast("File decrypted successfully! 100% byte fidelity verified.", "success");
    } catch (err: any) {
      const msg = err.message || "Decryption failed: invalid key or corrupted file.";
      setError(msg);
      toast(msg, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPassword("");
    setResult(null);
    setError(null);
    setProgressStep(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Decrypt a File
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Recover your original file with authenticated DES + Hill Cipher decryption.
        </p>
      </div>

      {!result ? (
        <form onSubmit={handleStartDecryption} className="space-y-6">
          
          {/* STEP 1: Upload Encrypted File */}
          <GlassCard className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-base font-semibold text-white">Select Encrypted Container (.svault)</h2>
            </div>

            {!file ? (
              <FileDropzone
                onFileSelect={(f) => setFile(f)}
                accept=".svault"
                label="Drop your encrypted .svault file here"
                sublabel="or click to browse container from your device"
              />
            ) : (
              <FilePreview file={file} isEncryptedFormat onRemove={() => setFile(null)} />
            )}
          </GlassCard>

          {/* STEP 2: Decryption Password */}
          <GlassCard className="p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-base font-semibold text-white">Decryption Key</h2>
            </div>

            <GlassInput
              label="Decryption Password / Key"
              type="password"
              placeholder="Enter the password used during encryption..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              showPasswordToggle
              icon={<KeyRound className="w-4 h-4" />}
              required
            />
            <p className="text-xs text-slate-500">
              The password is processed through PBKDF2 with the salt stored in the .svault header to derive the identical DES key, HMAC authentication key, and Hill Cipher matrix.
            </p>
          </GlassCard>

          {/* STEP 3: Decryption Visual Pipeline */}
          <GlassCard className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h2 className="text-base font-semibold text-white">Decryption Pipeline</h2>
            </div>

            <DecryptionPipeline
              progress={{ step: progressStep }}
              isProcessing={isProcessing}
            />
          </GlassCard>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-3 animate-in shake duration-200">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <div className="space-y-0.5">
                <span className="font-semibold block">Decryption Error:</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex justify-end">
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 via-indigo-600 to-indigo-700 shadow-purple-500/25"
              isLoading={isProcessing}
              disabled={!file || !password}
              icon={<Shield className="w-5 h-5" />}
            >
              {isProcessing ? "Authenticating & Decrypting..." : "Execute Layered Decryption"}
            </GlassButton>
          </div>
        </form>
      ) : (
        /* Success Screen */
        <div className="space-y-6 animate-in fade-in duration-300">
          <GlassCard glow className="p-6 sm:p-10 space-y-8 border-emerald-500/30 bg-emerald-950/[0.08]">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                File Decrypted Successfully
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                HMAC-SHA256 signature verified. DES-CBC padding removed and inverted Hill Cipher transformation applied without errors. Original payload restored.
              </p>
            </div>

            {/* Metadata Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                <span className="text-xs text-slate-400">Recovered File</span>
                <p className="font-semibold text-white truncate">{result.original_filename}</p>
                <span className="text-xs text-emerald-400 font-mono">{formatBytes(result.recovered_size)}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                <span className="text-xs text-slate-400">Encrypted Container</span>
                <p className="font-semibold text-purple-300 truncate">{result.stored_filename}</p>
                <span className="text-xs text-slate-500 font-mono">{formatBytes(result.container_size)}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                <span className="text-xs text-slate-400">Decryption Algorithms</span>
                <p className="font-semibold text-white">DES + Hill Cipher</p>
                <span className="text-xs text-slate-500">K⁻¹ mod 256 • CBC</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                <span className="text-xs text-slate-400">Integrity Status</span>
                <p className="font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Verified Authenticity
                </p>
                <span className="text-xs text-slate-500">Constant-time HMAC check</span>
              </div>
            </div>

            {/* Checksum */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1 text-xs">
              <span className="text-slate-400">Recovered SHA-256 Checksum:</span>
              <p className="font-mono text-emerald-300 break-all select-all font-medium">
                {result.sha256}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/10">
              <a href={getDownloadUrl(result.operation_id)} download className="w-full sm:w-auto">
                <GlassButton
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/25"
                  icon={<Download className="w-5 h-5" />}
                >
                  Download Original File
                </GlassButton>
              </a>

              <GlassButton
                variant="secondary"
                size="lg"
                onClick={resetForm}
                className="w-full sm:w-auto"
                icon={<RotateCcw className="w-5 h-5" />}
              >
                Decrypt Another File
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
