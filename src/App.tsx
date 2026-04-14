/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProductManagement } from './pages/ProductManagement';
import { POS } from './pages/POS';
import { History } from './pages/History';
import { View, Product, Transaction } from './types';
import { getProducts, getTransactions, saveProduct, deleteProduct, saveTransaction, seedDB } from './lib/db';
import { Toaster } from 'sonner';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        await seedDB();
        const [p, t] = await Promise.all([getProducts(), getTransactions()]);
        setProducts(p);
        setTransactions(t);
      } catch (error) {
        console.error('Failed to initialize DB:', error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const handleSaveProduct = async (product: Product) => {
    await saveProduct(product);
    const p = await getProducts();
    setProducts(p);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    const p = await getProducts();
    setProducts(p);
  };

  const handleCheckout = async (transaction: Transaction) => {
    await saveTransaction(transaction);
    const [p, t] = await Promise.all([getProducts(), getTransactions()]);
    setProducts(p);
    setTransactions(t);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Memuat Data Kios...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {currentView === 'dashboard' && (
          <Dashboard transactions={transactions} products={products} />
        )}
        {currentView === 'products' && (
          <ProductManagement 
            products={products} 
            onSave={handleSaveProduct} 
            onDelete={handleDeleteProduct} 
          />
        )}
        {currentView === 'pos' && (
          <POS products={products} onCheckout={handleCheckout} />
        )}
        {currentView === 'history' && (
          <History transactions={transactions} />
        )}
      </Layout>
      <Toaster position="top-center" richColors />
    </>
  );
}

