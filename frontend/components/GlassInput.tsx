"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  strengthScore?: number; // 0 to 4
  strengthLevel?: string;
}

export function GlassInput({
  label,
  error,
  icon,
  type = "text",
  showPasswordToggle = false,
  strengthScore,
  strengthLevel,
  className,
  ...props
}: GlassInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

  const strengthColors = [
    "bg-slate-600",
    "bg-rose-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-300">
          <span>{label}</span>
          {strengthLevel && (
            <span
              className={cn(
                "text-[11px] font-semibold transition-colors",
                strengthScore === 4 && "text-emerald-400",
                strengthScore === 3 && "text-blue-400",
                strengthScore === 2 && "text-amber-400",
                (strengthScore === 1 || strengthScore === 0) && "text-rose-400"
              )}
            >
              {strengthLevel}
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            {icon}
          </div>
        )}

        <input
          type={inputType}
          className={cn(
            "w-full rounded-2xl py-3 text-sm text-white placeholder-slate-500",
            "bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl",
            "focus:outline-none focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10",
            "transition-all duration-200",
            icon ? "pl-11" : "pl-4",
            showPasswordToggle ? "pr-11" : "pr-4",
            error && "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/10",
            className
          )}
          {...props}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {strengthScore !== undefined && (
        <div className="space-y-1 pt-1">
          <div className="grid grid-cols-4 gap-1.5 h-1.5">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-full transition-all duration-300",
                  idx < (strengthScore || 0)
                    ? strengthColors[strengthScore || 0]
                    : "bg-white/[0.06]"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-400 font-medium pl-1">{error}</p>}
    </div>
  );
}
