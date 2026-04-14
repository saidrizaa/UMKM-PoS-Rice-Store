import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calendar, FileText, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transaction } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface HistoryProps {
  transactions: Transaction[];
}

export function History({ transactions }: HistoryProps) {
  const [search, setSearch] = useState('');

  const filteredTransactions = transactions.filter(tx => 
    tx.id.toLowerCase().includes(search.toLowerCase()) ||
    (tx.customerName?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Riwayat Transaksi</h2>
          <p className="text-slate-500">Daftar semua penjualan yang telah dilakukan.</p>
        </div>
        
        <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
          <Download className="w-4 h-4 mr-2" />
          Ekspor Laporan
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari ID Transaksi atau Pelanggan..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-50 border-none focus-visible:ring-emerald-500 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-slate-500 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            Semua Waktu
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-bold">ID Transaksi</TableHead>
              <TableHead className="font-bold">Waktu</TableHead>
              <TableHead className="font-bold">Pelanggan</TableHead>
              <TableHead className="font-bold">Items</TableHead>
              <TableHead className="font-bold">Metode</TableHead>
              <TableHead className="text-right font-bold">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-mono text-xs font-bold text-slate-500">
                  {tx.id}
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {format(tx.timestamp, 'dd MMM yyyy, HH:mm', { locale: id })}
                </TableCell>
                <TableCell className="font-semibold text-slate-900">
                  {tx.customerName || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {tx.items.slice(0, 2).map((item, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] font-medium bg-slate-50 border-slate-200">
                        {item.name} x{item.quantity}
                      </Badge>
                    ))}
                    {tx.items.length > 2 && (
                      <Badge variant="outline" className="text-[10px] font-medium bg-slate-50 border-slate-200">
                        +{tx.items.length - 2} lainnya
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn(
                    "border-none rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                    tx.paymentMethod === 'cash' ? "bg-emerald-100 text-emerald-700" :
                    tx.paymentMethod === 'qris' ? "bg-blue-100 text-blue-700" :
                    "bg-purple-100 text-purple-700"
                  )}>
                    {tx.paymentMethod}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold text-slate-900">
                  Rp {tx.total.toLocaleString('id-ID')}
                </TableCell>
              </TableRow>
            ))}
            {filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  Belum ada riwayat transaksi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
