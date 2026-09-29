import React, { useState } from 'react';
import {
  Binary,
  Lock,
  Unlock,
  Copy,
  Check,
  ArrowRightLeft,
  FileCode,
  Shield,
  Zap,
} from 'lucide-react';
import {
  executeDes,
  hexToBin,
  asciiToHex,
  hexToAscii,
} from '../lib/des';
import type { DesExecutionResult } from '../lib/des';
import { DesRoundVisualizer } from '../components/DesRoundVisualizer';
import { DesAvalancheLab } from '../components/DesAvalancheLab';
import { CryptoTooltip } from '../components/CryptoTooltip';

export const DesPage: React.FC = () => {
  // Input formats: 'hex' or 'ascii'
  const [inputFormat, setInputFormat] = useState<'hex' | 'ascii'>('hex');
  const [keyFormat, setKeyFormat] = useState<'hex' | 'ascii'>('hex');

  // Hex representations (always authoritative)
  const [blockHex, setBlockHex] = useState<string>('');
  const [keyHex, setKeyHex] = useState<string>('');

  // Text representation mirrors
  const [blockAscii, setBlockAscii] = useState<string>('');
  const [keyAscii, setKeyAscii] = useState<string>('');

  const [copied, setCopied] = useState<boolean>(false);

  const [execution, setExecution] = useState<DesExecutionResult | null>(null);

  // Active view tab: 'feistel' or 'avalanche'
  const [activeLabTab, setActiveLabTab] = useState<'feistel' | 'avalanche'>('feistel');

  const handleBlockHexChange = (val: string) => {
    const cleaned = val.replace(/[^0-9a-fA-F]/g, '').slice(0, 16).toUpperCase();
    setBlockHex(cleaned);
    setBlockAscii(hexToAscii(cleaned));
    setExecution(null);
  };

  const handleBlockAsciiChange = (val: string) => {
    const sliced = val.slice(0, 8);
    setBlockAscii(sliced);
    const hex = asciiToHex(sliced).padEnd(16, '0').slice(0, 16);
    setBlockHex(hex);
    setExecution(null);
  };

  const handleKeyHexChange = (val: string) => {
    const cleaned = val.replace(/[^0-9a-fA-F]/g, '').slice(0, 16).toUpperCase();
    setKeyHex(cleaned);
    setKeyAscii(hexToAscii(cleaned));
    setExecution(null);
  };

  const handleKeyAsciiChange = (val: string) => {
    const sliced = val.slice(0, 8);
    setKeyAscii(sliced);
    const hex = asciiToHex(sliced).padEnd(16, '0').slice(0, 16);
    setKeyHex(hex);
    setExecution(null);
  };

  const handleEncrypt = () => {
    const paddedBlock = blockHex.padEnd(16, '0').slice(0, 16);
    const paddedKey = keyHex.padEnd(16, '0').slice(0, 16);
    const res = executeDes(paddedBlock, paddedKey, 'encrypt');
    setExecution(res);
  };

  const handleDecrypt = () => {
    const paddedBlock = blockHex.padEnd(16, '0').slice(0, 16);
    const paddedKey = keyHex.padEnd(16, '0').slice(0, 16);
    const res = executeDes(paddedBlock, paddedKey, 'decrypt');
    setExecution(res);
  };

  const handleTransferToInput = () => {
    if (execution?.outputHex) {
      setBlockHex(execution.outputHex);
      setBlockAscii(hexToAscii(execution.outputHex));
    }
  };

  const handleCopyOutput = () => {
    if (!execution?.outputHex) return;
    navigator.clipboard.writeText(execution.outputHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadNistTestVector = () => {
    const pt = '0123456789ABCDEF';
    const k = '133457799BBCDFF1';
    setInputFormat('hex');
    setKeyFormat('hex');
    setBlockHex(pt);
    setKeyHex(k);
    setBlockAscii(hexToAscii(pt));
    setKeyAscii(hexToAscii(k));
    setExecution(null);
  };

  const loadAsciiExample = () => {
    const ptAscii = 'COMPUTER';
    const kAscii = 'SECURITY';
    setInputFormat('ascii');
    setKeyFormat('ascii');
    const ptHex = asciiToHex(ptAscii);
    const kHex = asciiToHex(kAscii);
    setBlockHex(ptHex);
    setKeyHex(kHex);
    setBlockAscii(ptAscii);
    setKeyAscii(kAscii);
    setExecution(null);
  };

  return (
    <div className="space-y-7 py-2 sm:space-y-8 sm:py-4">
      {/* Title & Presets Header */}
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Binary className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              DES (Data Encryption Standard) Laboratory
            </h1>
            <CryptoTooltip term="feistel" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete FIPS 46-3 64-bit Feistel network with 16 rounds, 8 standard S-boxes, and avalanche effect exploration.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden text-xs font-mono text-slate-400 sm:inline">Test Vectors:</span>
          <button
            type="button"
            onClick={loadNistTestVector}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 flex items-center gap-1.5"
            title="Official NIST SP 800-20 Standard Test Vector"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            NIST Standard KAT
          </button>
          <button
            type="button"
            onClick={loadAsciiExample}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-amber-300 border border-slate-700 flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            ASCII &quot;COMPUTER&quot;
          </button>
        </div>
      </div>

      {/* Inputs Configuration Panel */}
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12 xl:gap-6">
        {/* Plaintext / Block Input */}
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl xl:col-span-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-semibold text-slate-200">
              64-Bit Data Block (Plaintext / Ciphertext)
            </span>
            {/* Format toggle */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setInputFormat('hex')}
                className={`px-2 py-0.5 rounded ${
                  inputFormat === 'hex' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                16 Hex
              </button>
              <button
                type="button"
                onClick={() => setInputFormat('ascii')}
                className={`px-2 py-0.5 rounded ${
                  inputFormat === 'ascii' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                8 ASCII
              </button>
            </div>
          </div>

          {inputFormat === 'hex' ? (
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-mono block">
                Hexadecimal (16 hex characters = 64 bits):
              </label>
              <input
                type="text"
                value={blockHex}
                maxLength={16}
                onChange={(e) => handleBlockHexChange(e.target.value)}
                placeholder="Enter 16 hex characters"
                className="w-full p-2 sm:p-3 rounded-xl bg-slate-950 border border-slate-700/80 text-cyan-300 font-mono font-bold text-sm sm:text-base tracking-[0.12em] sm:tracking-widest uppercase focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>ASCII mirror: &quot;{blockAscii}&quot;</span>
                <span>{blockHex.length} / 16 hex chars</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-mono block">
                ASCII Characters (exactly 8 characters = 64 bits):
              </label>
              <input
                type="text"
                value={blockAscii}
                maxLength={8}
                onChange={(e) => handleBlockAsciiChange(e.target.value)}
                placeholder="Enter 8 ASCII characters"
                className="w-full p-2 sm:p-3 rounded-xl bg-slate-950 border border-slate-700/80 text-cyan-300 font-mono font-bold text-sm sm:text-base tracking-[0.12em] sm:tracking-widest focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Hex mirror: {blockHex}</span>
                <span>{blockAscii.length} / 8 chars</span>
              </div>
            </div>
          )}

          {blockHex && (
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1">
              <span className="text-slate-500 block">64-bit Binary Representation:</span>
              <div className="text-slate-300 break-all select-all font-mono leading-relaxed">
                {hexToBin(blockHex).padStart(64, '0')}
              </div>
            </div>
          )}
        </div>

        {/* Key Input */}
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl xl:col-span-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-200">
                64-Bit Secret Key (56 Effective Bits)
              </span>
              <CryptoTooltip term="parity_bits" />
            </div>

            {/* Format toggle */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setKeyFormat('hex')}
                className={`px-2 py-0.5 rounded ${
                  keyFormat === 'hex' ? 'bg-amber-600 text-white' : 'text-slate-400'
                }`}
              >
                16 Hex
              </button>
              <button
                type="button"
                onClick={() => setKeyFormat('ascii')}
                className={`px-2 py-0.5 rounded ${
                  keyFormat === 'ascii' ? 'bg-amber-600 text-white' : 'text-slate-400'
                }`}
              >
                8 ASCII
              </button>
            </div>
          </div>

          {keyFormat === 'hex' ? (
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-mono block">
                Hexadecimal Key (16 hex chars):
              </label>
              <input
                type="text"
                value={keyHex}
                maxLength={16}
                onChange={(e) => handleKeyHexChange(e.target.value)}
                placeholder="Enter 16 hex characters"
                className="w-full p-2 sm:p-3 rounded-xl bg-slate-950 border border-slate-700/80 text-amber-300 font-mono font-bold text-sm sm:text-base tracking-[0.12em] sm:tracking-widest uppercase focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>ASCII mirror: &quot;{keyAscii}&quot;</span>
                <span>{keyHex.length} / 16 hex chars</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-mono block">
                ASCII Key (8 characters):
              </label>
              <input
                type="text"
                value={keyAscii}
                maxLength={8}
                onChange={(e) => handleKeyAsciiChange(e.target.value)}
                placeholder="Enter 8 ASCII characters"
                className="w-full p-2 sm:p-3 rounded-xl bg-slate-950 border border-slate-700/80 text-amber-300 font-mono font-bold text-sm sm:text-base tracking-[0.12em] sm:tracking-widest focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Hex mirror: {keyHex}</span>
                <span>{keyAscii.length} / 8 chars</span>
              </div>
            </div>
          )}

          {/* Parity Bit Notice */}
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400">
            Note: Every 8th bit is discarded during PC-1, leaving 56 bits for the 16 round subkeys (48 bits each).
          </div>
        </div>
      </div>

      {/* Action Buttons & Result Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl xl:flex-row xl:items-center xl:justify-between">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleEncrypt}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition-all shadow-lg shadow-cyan-600/30 active:scale-[0.98]"
          >
            <Lock className="w-4 h-4" />
            <span>Encrypt (16 Rounds)</span>
          </button>

          <button
            type="button"
            onClick={handleDecrypt}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98]"
          >
            <Unlock className="w-4 h-4" />
            <span>Decrypt (Reverse Subkeys)</span>
          </button>
        </div>

        {/* Output Readout */}
        {execution?.success && (
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs sm:gap-3 sm:px-4">
            <span className="text-slate-400">
              {execution.mode === 'encrypt' ? 'Ciphertext (IP⁻¹):' : 'Plaintext (IP⁻¹):'}
            </span>
            <span className="max-w-full break-all text-base font-extrabold tracking-wider text-emerald-400">
              {execution.outputHex}
            </span>
            {execution.outputAscii && (
              <span className="text-slate-400 text-xs">
                (&quot;{execution.outputAscii}&quot;)
              </span>
            )}
            <div className="ml-0 flex items-center gap-1 sm:ml-2">
              <button
                type="button"
                onClick={handleTransferToInput}
                className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
                title="Transfer output back to input for reverse decryption"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleCopyOutput}
                className="p-1 text-slate-400 hover:text-emerald-300 transition-colors"
                title="Copy output hex"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main View Tabs: Feistel Rounds vs Avalanche Lab */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-x-2 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveLabTab('feistel')}
              className={`relative flex items-center gap-2 px-2 pb-3 text-left text-xs font-semibold transition-all sm:px-4 sm:text-sm ${
              activeLabTab === 'feistel'
                ? 'text-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Binary className="w-4 h-4" />
            <span>16-Round Feistel Structure Visualizer</span>
            {activeLabTab === 'feistel' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveLabTab('avalanche')}
              className={`relative flex items-center gap-2 px-2 pb-3 text-left text-xs font-semibold transition-all sm:px-4 sm:text-sm ${
              activeLabTab === 'avalanche'
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Avalanche Effect Laboratory (Bit-by-Bit Diffusion)</span>
            {activeLabTab === 'avalanche' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        </div>

        {execution?.success ? (
          activeLabTab === 'feistel' ? (
            <DesRoundVisualizer execution={execution} />
          ) : (
            <DesAvalancheLab inputHex={blockHex} keyHex={keyHex} />
          )
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-sm text-slate-400">
            Enter a complete 64-bit block and key, then run encryption or decryption to inspect the DES trace.
          </div>
        )}
      </div>
    </div>
  );
};
