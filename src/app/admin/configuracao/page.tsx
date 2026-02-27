
"use client";

import React, { useState } from 'react';
import { Settings, ShieldAlert, Bell, Globe, Save, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function AdminSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Kernel Atualizado",
        description: "As configurações globais do sistema foram aplicadas com sucesso."
      });
    }, 1500);
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase neon-text-purple mb-2">Configuração Global</h1>
          <p className="text-muted-foreground font-medium">Controle de kernel, avisos e estado do servidor.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-3 px-8 py-4 bg-primary rounded-2xl font-black uppercase text-xs tracking-widest italic shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Salvar Alterações
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
            <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-3 mb-8">
              <Globe className="text-primary" size={20} />
              Estado do Servidor
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <p className="font-bold text-sm">Modo Manutenção</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black">Bloqueia acesso de todos os usuários</p>
                </div>
                <Switch checked={maintenance} onCheckedChange={setMaintenance} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <p className="font-bold text-sm">Registro de Novos Membros</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black">Permite ou nega novos cadastros</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
            <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-3 mb-8">
              <ShieldAlert className="text-red-400" size={20} />
              Segurança do Kernel
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <p className="font-bold text-sm">Detecção de Virtual Machine</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black">Expulsa usuários em VMs</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] border-primary/20 bg-primary/5">
          <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-3 mb-8">
            <Bell className="text-primary" size={20} />
            Aviso do Painel
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary/60 tracking-widest ml-1">Título do Alerta</label>
              <input 
                type="text" 
                placeholder="Ex: NOVA ATUALIZAÇÃO DISPONÍVEL"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-bold focus:border-primary transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary/60 tracking-widest ml-1">Mensagem do Sistema</label>
              <textarea 
                placeholder="Digite a mensagem que todos os usuários verão..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-medium focus:border-primary transition-all outline-none min-h-[150px]"
              />
            </div>

            <button className="w-full py-4 bg-primary/20 border border-primary/30 rounded-2xl text-[10px] font-black uppercase tracking-widest italic text-primary hover:bg-primary hover:text-white transition-all">
              Disparar Mensagem Global
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
