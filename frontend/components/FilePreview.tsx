"use client";

import React from "react";
import {
  FileText,
  FileArchive,
  Image as ImageIcon,
  FileCode,
  Shield,
  File,
  X,
  CheckCircle2,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { GlassCard } from "./GlassCard";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  isEncryptedFormat?: boolean;
}

function renderFileIcon(ext: string): React.ReactNode {
  if (ext === "svault") return <Shield className="w-6 h-6" />;
  if (["zip", "tar", "gz", "7z", "rar"].includes(ext)) return <FileArchive className="w-6 h-6" />;
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return <ImageIcon className="w-6 h-6" />;
  if (["pdf", "doc", "docx", "txt", "md"].includes(ext)) return <FileText className="w-6 h-6" />;
  if (["py", "ts", "js", "html", "css", "json", "c", "cpp"].includes(ext)) return <FileCode className="w-6 h-6" />;
  return <File className="w-6 h-6" />;
}

export function FilePreview({ file, onRemove, isEncryptedFormat = false }: FilePreviewProps) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";

  return (
    <GlassCard className="p-4 flex items-center justify-between border-indigo-500/30 bg-indigo-500/[0.03]">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
          {renderFileIcon(ext)}
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {file.name}
            </p>
            <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 shrink-0">
              {ext || "bin"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{formatBytes(file.size)}</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onRemove}
        aria-label="Remove selected file"
        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all ml-2 shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </GlassCard>
  );
}
