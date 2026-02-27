"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent';
  glow?: boolean;
}

export function GlowButton({ 
  children, 
  className, 
  variant = 'primary', 
  glow = true, 
  ...props 
}: GlowButtonProps) {
  return (
    <button
      className={cn(
        "relative group py-4 px-6 rounded-xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50",
        variant === 'primary' 
          ? "bg-primary text-primary-foreground" 
          : "bg-background border border-primary text-primary",
        glow && "shadow-[0_0_15px_rgba(196,76,255,0.3)] hover:shadow-[0_0_25px_rgba(196,76,255,0.5)]",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
