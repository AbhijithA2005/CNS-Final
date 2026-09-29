"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { OperationRecord } from "@/types";
import { formatBytes, formatDate } from "@/lib/utils";
import { GlassButton } from "./GlassButton";
import { Modal } from "./Modal";
import { getDownloadUrl } from "@/lib/api";

interface HistoryTableProps {
  items: OperationRecord[];
  isLoading?: boolean;
}

export function HistoryTable({ items, isLoading = false }: HistoryTableProps) {
  const [selectedOp, setSelectedOp] = useState<OperationRecord | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center rounded-3xl bg-white/[0.02] border border-white/[0.06] p-8">
        <Clock className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <p className="text-base font-medium text-slate-300">No cryptographic operations found</p>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Files encrypted or decrypted will appear here in the audit log.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-4 px-6">Operation</th>
              <th className="py-4 px-6">File Name</th>
              <th className="py-4 px-6">Algorithms</th>
              <th className="py-4 px-6">Output Size</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-sm text-slate-300">
            {items.map((item) => {
              const isEncrypt = item.operation.toUpperCase() === "ENCRYPT";
              const isSuccess = item.status.toUpperCase() === "SUCCESS";

              return (
                <tr
                  key={item.id}
                  onClick={() => setSelectedOp(item)}
                  className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isEncrypt
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      }`}
                    >
                      {isEncrypt ? <Lock className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                      {item.operation}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-medium text-white max-w-[200px] truncate">
                    {item.original_filename}
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-400">
                    {item.algorithm}
                  </td>

                  <td className="py-4 px-6 font-mono text-xs">
                    {formatBytes(item.output_size)}
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        isSuccess ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isSuccess ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      {item.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-400">
                    {formatDate(item.created_at)}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedOp(item)}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isSuccess && (
                        <a
                          href={getDownloadUrl(item.id)}
                          download
                          className="p-2 rounded-xl text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                          title={isEncrypt ? "Download encrypted .svault container" : "Download recovered original file"}
                          aria-label={isEncrypt ? "Download encrypted .svault container" : "Download recovered original file"}
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {items.map((item) => {
          const isEncrypt = item.operation.toUpperCase() === "ENCRYPT";
          const isSuccess = item.status.toUpperCase() === "SUCCESS";

          return (
            <div
              key={item.id}
              onClick={() => setSelectedOp(item)}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3 cursor-pointer hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isEncrypt
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  }`}
                >
                  {item.operation}
                </span>

                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium ${
                    isSuccess ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {item.status}
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-white truncate">{item.original_filename}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                  <span>{formatBytes(item.output_size)}</span>
                  <span>{formatDate(item.created_at)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-xs">
                <span className="text-slate-500">{item.algorithm}</span>
                <span className="text-indigo-400 flex items-center gap-1 font-medium">
                  Details <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operation Details Modal (Section 22) */}
      <Modal
        isOpen={!!selectedOp}
        onClose={() => setSelectedOp(null)}
        title={selectedOp?.operation === "ENCRYPT" ? "Encryption Details" : "Decryption Details"}
      >
        {selectedOp && (
          <div className="space-y-6 text-sm">
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {selectedOp.operation === "ENCRYPT" ? "Encrypted file" : "Recovered file"}
                </p>
                <p className="mt-1 truncate font-semibold text-white">{selectedOp.original_filename}</p>
                <p className="mt-1 text-xs text-slate-400">{selectedOp.algorithm}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                selectedOp.status === "SUCCESS"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-rose-500/10 text-rose-400"
              }`}>
                {selectedOp.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <div>
                <p className="text-xs text-slate-400">Operation ID</p>
                <p className="font-mono text-xs text-indigo-300 break-all select-all">{selectedOp.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Timestamp</p>
                <p className="text-xs font-medium text-white">{formatDate(selectedOp.created_at)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-slate-400">Original Filename</span>
                <span className="font-medium text-white truncate max-w-[280px]">{selectedOp.original_filename}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-slate-400">Operation Type</span>
                <span className="font-semibold text-indigo-400">{selectedOp.operation}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-slate-400">Cryptographic Algorithms</span>
                <span className="font-medium text-white">{selectedOp.algorithm}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-slate-400">
                  {selectedOp.operation === "ENCRYPT" ? "Original File Size" : "Encrypted Container Size"}
                </span>
                <span className="font-mono text-white">{formatBytes(selectedOp.original_size)}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-slate-400">
                  {selectedOp.operation === "ENCRYPT" ? "Encrypted Container Size" : "Recovered File Size"}
                </span>
                <span className="font-mono text-white">{formatBytes(selectedOp.output_size)}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-slate-400">Status</span>
                <span className={selectedOp.status === "SUCCESS" ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                  {selectedOp.status}
                </span>
              </div>

              {selectedOp.sha256 && (
                <div className="py-2 border-b border-white/[0.06]">
                  <p className="text-xs text-slate-400 mb-1">SHA-256 Checksum</p>
                  <p className="font-mono text-xs text-slate-200 break-all bg-black/40 p-2.5 rounded-xl border border-white/10 select-all">
                    {selectedOp.sha256}
                  </p>
                </div>
              )}

              {selectedOp.error_message && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                  <span className="font-semibold">Failure Notice: </span>
                  {selectedOp.error_message}
                </div>
              )}
            </div>

            {selectedOp.status === "SUCCESS" && (
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                {selectedOp.operation === "ENCRYPT" && (
                  <p className="text-xs text-slate-400 sm:mr-auto">
                    Encrypted .svault files are not opened directly. Use Decrypt with the same password.
                  </p>
                )}
                <a
                  href={getDownloadUrl(selectedOp.id)}
                  download
                  className="w-full sm:w-auto"
                >
                  <GlassButton variant="primary" icon={<Download className="w-4 h-4" />}>
                    {selectedOp.operation === "ENCRYPT" ? "Download Encrypted File (.svault)" : "Download Original File"}
                  </GlassButton>
                </a>
                {selectedOp.operation === "ENCRYPT" && (
                  <Link href="/decrypt" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Decrypt in SecureVault
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}

