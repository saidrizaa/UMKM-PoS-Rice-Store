import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  History, 
  Store,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Kelola Produk', icon: Package },
  { id: 'pos', label: 'Kasir / PoS', icon: ShoppingCart },
  { id: 'history', label: 'Riwayat Transaksi', icon: History },
] as const;

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-bottom border-slate-100">
        <div className="bg-emerald-600 p-2 rounded-lg">
          <Store className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 leading-tight">Mandiri Rice</h1>
          <p className="text-xs text-slate-500">Penggilingan Mandiri</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Status Sistem</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-slate-600 font-medium">Online (Local DB)</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
