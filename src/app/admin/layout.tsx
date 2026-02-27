
"use client";

import React, { useEffect } from 'react';
import { useAuth, AuthProvider } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { HackerBackground } from '@/components/HackerBackground';
import { 
  Users, 
  LayoutDashboard, 
  Key, 
  History, 
  Settings, 
  LogOut,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/admin' },
    { label: 'Usuários', icon: <Users size={20} />, href: '/admin/users' },
    { label: 'Licenças', icon: <Key size={20} />, href: '/admin/licenses' },
    { label: 'Logs', icon: <History size={20} />, href: '/admin/logs' },
    { label: 'Configurações', icon: <Settings size={20} />, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen flex text-white relative">
      <HackerBackground />
      
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-6 right-6 z-[60] p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-black/40 backdrop-blur-3xl border-r border-white/5 transition-transform duration-500 lg:translate-x-0 lg:static",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black italic shadow-lg shadow-primary/30">
              K
            </div>
            <div>
              <h2 className="text-sm font-black italic tracking-tighter uppercase neon-text-purple">Admin Panel</h2>
              <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest">Kizaru Control</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-sm",
                  pathname === item.href 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                <ShieldCheck size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{user.username}</p>
                <p className="text-[9px] text-muted-foreground uppercase font-black">Super Admin</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-red-400 font-bold text-sm hover:bg-red-400/10 transition-all"
            >
              <LogOut size={20} />
              Sair do Sistema
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10 p-6 lg:p-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
