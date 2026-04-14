import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Transaction, Product } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface DashboardProps {
  transactions: Transaction[];
  products: Product[];
}

export function Dashboard({ transactions, products }: DashboardProps) {
  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const totalOrders = transactions.length;
  const lowStockProducts = products.filter(p => p.stock < 20).length;
  
  const stats = [
    { 
      label: 'Total Pendapatan', 
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, 
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      trend: '+12.5%',
      trendUp: true
    },
    { 
      label: 'Total Pesanan', 
      value: totalOrders.toString(), 
      icon: ShoppingCart, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      trend: '+5.2%',
      trendUp: true
    },
    { 
      label: 'Stok Menipis', 
      value: lowStockProducts.toString(), 
      icon: Package, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50',
      trend: '-2',
      trendUp: false
    },
    { 
      label: 'Pelanggan Baru', 
      value: '42', 
      icon: Users, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      trend: '+18%',
      trendUp: true
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Ringkasan Bisnis</h2>
        <p className="text-slate-500">Selamat datang kembali, berikut performa kios Anda hari ini.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-3 rounded-2xl transition-transform group-hover:scale-110`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.trend}
                  {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                      TX
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{tx.customerName || 'Pelanggan Umum'}</p>
                      <p className="text-xs text-slate-500">{format(tx.timestamp, 'dd MMM yyyy, HH:mm', { locale: id })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">Rp {tx.total.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">{tx.paymentMethod}</p>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-8 text-slate-400">Belum ada transaksi</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Stok Menipis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {products.filter(p => p.stock < 20).slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <p className="text-sm font-medium text-slate-700">{p.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                      {p.stock} {p.unit}
                    </span>
                  </div>
                </div>
              ))}
              {products.filter(p => p.stock < 20).length === 0 && (
                <div className="text-center py-8 text-slate-400">Semua stok aman</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
