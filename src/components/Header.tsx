import React from 'react';
import { Bell, Search, User, Settings } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Cari transaksi atau produk..." 
            className="pl-10 bg-slate-50 border-none focus-visible:ring-emerald-500 h-10 rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-emerald-600">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </Button>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2" />
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">Admin Kios</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-50">
            <User className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
