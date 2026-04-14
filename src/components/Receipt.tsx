import React from 'react';
import { Transaction } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Separator } from './ui/separator';
import { Printer } from 'lucide-react';
import { Button } from './ui/button';

interface ReceiptProps {
  transaction: Transaction;
  cashReceived?: number;
  onPrint?: () => void;
}

export function Receipt({ transaction, cashReceived, onPrint }: ReceiptProps) {
  const change = cashReceived ? cashReceived - transaction.total : 0;

  return (
    <div className="bg-white p-6 max-w-[350px] mx-auto font-mono text-sm shadow-sm border border-slate-100 rounded-lg print-content">
      <div className="text-center space-y-1 mb-6">
        <h2 className="font-black text-lg uppercase tracking-tighter">Mandiri Rice Mill</h2>
        <p className="text-[10px] text-slate-500">Jl. Raya Penggilingan No. 123</p>
        <p className="text-[10px] text-slate-500">Telp: 0812-3456-7890</p>
      </div>

      <div className="space-y-1 mb-4 text-[10px] text-slate-600">
        <div className="flex justify-between">
          <span>No: {transaction.id}</span>
          <span>{format(transaction.timestamp, 'dd/MM/yy HH:mm')}</span>
        </div>
        <div className="flex justify-between">
          <span>Kasir: Admin Kios</span>
          <span>Pelanggan: {transaction.customerName || '-'}</span>
        </div>
      </div>

      <Separator className="border-dashed my-4" />

      <div className="space-y-3 mb-6">
        {transaction.items.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between font-bold">
              <span className="flex-1">{item.name}</span>
              <span>{(item.price * item.quantity).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>{item.quantity} {item.unit} x {item.price.toLocaleString('id-ID')}</span>
            </div>
          </div>
        ))}
      </div>

      <Separator className="border-dashed my-4" />

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-bold">Rp {transaction.total.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span>Metode</span>
          <span className="uppercase">{transaction.paymentMethod}</span>
        </div>
        
        {transaction.paymentMethod === 'cash' && cashReceived && (
          <>
            <div className="flex justify-between">
              <span>Bayar</span>
              <span>Rp {cashReceived.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-dashed pt-2 mt-2">
              <span>Kembali</span>
              <span>Rp {change.toLocaleString('id-ID')}</span>
            </div>
          </>
        )}
      </div>

      <div className="text-center mt-8 space-y-2">
        <p className="text-[10px] font-bold">TERIMA KASIH</p>
        <p className="text-[8px] text-slate-400 italic">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
      </div>

      <div className="mt-8 flex gap-2 no-print">
        <Button 
          onClick={() => window.print()} 
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 text-xs"
        >
          <Printer className="w-4 h-4 mr-2" />
          Cetak Struk
        </Button>
      </div>
    </div>
  );
}
