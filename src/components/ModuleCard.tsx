"use client";

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onToggle: (checked: boolean) => void;
  isLoading?: boolean;
}

export function ModuleCard({ title, description, icon, isActive, onToggle, isLoading }: ModuleCardProps) {
  return (
    <div className={cn(
      "relative group p-6 rounded-3xl transition-all duration-500 glass-card",
      isActive ? "neon-glow-active bg-primary/10 border-primary/40" : "hover:border-primary/20"
    )}>
      {/* Efeito Glow Interno ao Ativar */}
      {isActive && (
        <div className="absolute inset-0 bg-primary/5 rounded-3xl animate-pulse-soft pointer-events-none" />
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-3 rounded-2xl transition-colors duration-500",
          isActive ? "bg-primary text-primary-foreground" : "bg-white/5 text-primary/70"
        )}>
          {icon}
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest",
            isActive ? "text-primary neon-text-purple" : "text-muted-foreground/60"
          )}>
            {isActive ? "Ativo" : "Desativado"}
          </span>
          <Switch 
            checked={isActive} 
            onCheckedChange={onToggle}
            disabled={isLoading}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className={cn(
          "font-bold text-lg transition-colors duration-500",
          isActive ? "text-white" : "text-white/80"
        )}>
          {title}
        </h3>
        <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
          {description}
        </p>
      </div>
      
      {/* Overlay de Loading ou Transição */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-3xl flex items-center justify-center z-10">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}