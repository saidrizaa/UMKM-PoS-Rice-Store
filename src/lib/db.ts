import { openDB, IDBPDatabase } from 'idb';
import { Product, Transaction } from '../types';

const DB_NAME = 'mandiri_rice_mill_db';
const DB_VERSION = 1;

export async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('transactions')) {
        db.createObjectStore('transactions', { keyPath: 'id' });
      }
    },
  });
}

export async function getProducts(): Promise<Product[]> {
  const db = await initDB();
  return db.getAll('products');
}

export async function saveProduct(product: Product): Promise<void> {
  const db = await initDB();
  await db.put('products', product);
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('products', id);
}

export async function getTransactions(): Promise<Transaction[]> {
  const db = await initDB();
  const txs = await db.getAll('transactions');
  return txs.sort((a, b) => b.timestamp - a.timestamp);
}

export async function saveTransaction(transaction: Transaction): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(['products', 'transactions'], 'readwrite');
  
  // Update stocks
  for (const item of transaction.items) {
    const product = await tx.objectStore('products').get(item.id);
    if (product) {
      product.stock -= item.quantity;
      await tx.objectStore('products').put(product);
    }
  }
  
  await tx.objectStore('transactions').add(transaction);
  await tx.done;
}

export const SAMPLE_PRODUCTS: Product[] = [
  { id: '1', name: 'Beras Pandan Wangi', category: 'Premium', price: 15000, stock: 100, unit: 'kg' },
  { id: '2', name: 'Beras Setra Ramos', category: 'Medium', price: 13000, stock: 250, unit: 'kg' },
  { id: '3', name: 'Beras Merah Organik', category: 'Sehat', price: 22000, stock: 50, unit: 'kg' },
  { id: '4', name: 'Beras Ketan Putih', category: 'Ketan', price: 18000, stock: 80, unit: 'kg' },
  { id: '5', name: 'Beras IR64', category: 'Ekonomis', price: 11000, stock: 500, unit: 'kg' },
];

export async function seedDB() {
  const products = await getProducts();
  if (products.length === 0) {
    for (const p of SAMPLE_PRODUCTS) {
      await saveProduct(p);
    }
  }
}
