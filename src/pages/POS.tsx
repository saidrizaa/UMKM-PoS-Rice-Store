import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  CreditCard, 
  Wallet, 
  Banknote,
  User,
  Package
} from 'lucide-react';
import { Product, CartItem, Transaction } from '../types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { CurrencyInput } from '@/components/CurrencyInput';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Receipt } from '@/components/Receipt';

interface POSProps {
  products: Product[];
  onCheckout: (transaction: Transaction) => Promise<void>;
}

export function POS({ products, onCheckout }: POSProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Transaction['paymentMethod']>('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [lastCashReceived, setLastCashReceived] = useState(0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) && p.stock > 0
  );

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error('Stok tidak mencukupi');
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        const product = products.find(p => p.id === id);
        if (newQty > (product?.stock || 0)) {
          toast.error('Stok tidak mencukupi');
          return item;
        }
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    const transaction: Transaction = {
      id: `TX-${Date.now()}`,
      timestamp: Date.now(),
      items: [...cart],
      total,
      paymentMethod,
      customerName: customerName || undefined
    };

    setLastTransaction(transaction);
    setLastCashReceived(cashReceived);
    
    await onCheckout(transaction);
    setCart([]);
    setCustomerName('');
    setCashReceived(0);
    setShowReceipt(true);
    toast.success('Transaksi Berhasil!');
  };

  const resetCart = () => {
    setCart([]);
    setCashReceived(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-160px)]">
      {/* Product Selection */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            placeholder="Cari produk beras..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 bg-white border-none shadow-sm rounded-2xl text-lg focus-visible:ring-emerald-500"
          />
        </div>

        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pr-4">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden rounded-2xl"
                onClick={() => addToCart(product)}
              >
                <div className="aspect-square bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <Package className="w-10 h-10 text-emerald-600 opacity-20 group-hover:opacity-40 transition-opacity" />
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">{product.category}</p>
                  <h3 className="font-bold text-slate-900 line-clamp-1 mb-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">Rp {product.price.toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Stok: {product.stock}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Cart / Checkout */}
      <Card className="lg:col-span-4 border-none shadow-lg rounded-3xl flex flex-col overflow-hidden bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              Keranjang Belanja
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={resetCart} className="text-slate-400 hover:text-red-500">
              Reset
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">Rp {item.price.toLocaleString('id-ID')} / {item.unit}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-md hover:bg-white"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-md hover:bg-white"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-300 hover:text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-20">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-medium">Keranjang masih kosong</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 bg-slate-50/50 space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Nama Pelanggan (Opsional)" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="pl-10 bg-white border-slate-200 rounded-xl"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cash', label: 'Tunai', icon: Banknote },
                  { id: 'qris', label: 'QRIS', icon: Wallet },
                  { id: 'transfer', label: 'Transfer', icon: CreditCard },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 transition-all",
                      paymentMethod === method.id 
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                        : "border-transparent bg-white text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <method.icon className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-slate-200" />
            
            <div className="space-y-3">
              <div className="flex justify-between text-slate-500">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="text-sm font-bold">Rp {total.toLocaleString('id-ID')}</span>
              </div>
              
              {paymentMethod === 'cash' && (
                <CurrencyInput 
                  label="Uang Diterima"
                  value={cashReceived}
                  onChange={setCashReceived}
                  className="rounded-xl bg-white"
                />
              )}

              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-emerald-600">Rp {total.toLocaleString('id-ID')}</span>
              </div>

              {paymentMethod === 'cash' && cashReceived > 0 && (
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-sm font-bold text-emerald-700">Kembalian</span>
                  <span className="text-lg font-black text-emerald-700">
                    Rp {(cashReceived - total).toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>

            <Button 
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-lg font-bold rounded-2xl shadow-lg shadow-emerald-100"
              disabled={cart.length === 0 || (paymentMethod === 'cash' && cashReceived < total && total > 0)}
              onClick={handleCheckout}
            >
              {paymentMethod === 'cash' && cashReceived < total && total > 0 ? 'Uang Kurang' : 'Bayar Sekarang'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-[400px] bg-slate-50 border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-center text-slate-900">Transaksi Berhasil</DialogTitle>
            <DialogDescription className="text-center text-slate-500">
              Silakan cetak struk untuk pelanggan
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            {lastTransaction && (
              <Receipt 
                transaction={lastTransaction} 
                cashReceived={lastCashReceived} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
