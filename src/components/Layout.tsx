import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar currentView={currentView} onViewChange={onViewChange} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
