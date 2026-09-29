"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  hoverEffect = false,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-3xl p-6 transition-all duration-300",
        "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.09]",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
        hoverEffect && "hover:bg-white/[0.07] hover:border-white/[0.18] hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.45)] hover:-translate-y-0.5",
        glow && "before:absolute before:-inset-px before:rounded-3xl before:bg-gradient-to-r before:from-indigo-500/20 before:via-purple-500/20 before:to-sky-500/20 before:blur-lg before:-z-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
