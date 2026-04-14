import React, { useState, useRef } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Package, Upload, X, ImageIcon } from 'lucide-react';
import { Product } from '../types';
import { toast } from 'sonner';
import { CurrencyInput } from '@/components/CurrencyInput';

interface ProductManagementProps {
  products: Product[];
  onSave: (product: Product) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ProductManagement({ products, onSave, onDelete }: ProductManagementProps) {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [price, setPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setPrice(product.price);
    setImagePreview(product.image || null);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setPrice(0);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast.error('Ukuran gambar terlalu besar (maks 1MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const product: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: price,
      stock: Number(formData.get('stock')),
      unit: formData.get('unit') as string,
      image: imagePreview || undefined,
    };

    await onSave(product);
    setIsDialogOpen(false);
    setEditingProduct(null);
    setImagePreview(null);
    toast.success(editingProduct ? 'Produk diperbarui' : 'Produk ditambahkan');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kelola Produk</h2>
          <p className="text-slate-500">Atur stok dan harga beras di kios Anda.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl overflow-hidden">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              {/* Image Upload Area */}
              <div className="space-y-2">
                <Label>Foto Produk</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all group overflow-hidden"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-sm font-bold flex items-center gap-2">
                          <Upload className="w-4 h-4" /> Ganti Gambar
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-4 rounded-full bg-white shadow-sm mb-2 group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-emerald-500" />
                      </div>
                      <p className="text-sm font-medium text-slate-500">Klik untuk upload foto</p>
                      <p className="text-xs text-slate-400">Maksimal 1MB</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk</Label>
                <Input id="name" name="name" defaultValue={editingProduct?.name} required placeholder="Contoh: Beras Pandan Wangi" className="rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Input id="category" name="category" defaultValue={editingProduct?.category} required placeholder="Premium/Medium" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Satuan</Label>
                  <Input id="unit" name="unit" defaultValue={editingProduct?.unit || 'kg'} required placeholder="kg/karung" className="rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CurrencyInput 
                  label="Harga Jual"
                  value={price}
                  onChange={setPrice}
                  required
                  className="rounded-xl"
                />
                <div className="space-y-2">
                  <Label htmlFor="stock">Stok Awal</Label>
                  <Input id="stock" name="stock" type="number" defaultValue={editingProduct?.stock} required className="rounded-xl" />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-lg font-bold">
                  Simpan Produk
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari nama atau kategori..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-50 border-none focus-visible:ring-emerald-500 rounded-xl"
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-bold">Produk</TableHead>
              <TableHead className="font-bold">Kategori</TableHead>
              <TableHead className="font-bold">Harga</TableHead>
              <TableHead className="font-bold">Stok</TableHead>
              <TableHead className="text-right font-bold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((p) => (
              <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center overflow-hidden border border-slate-100">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>
                    <span className="font-semibold text-slate-900">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none rounded-lg px-3 py-1">
                    {p.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">Rp {p.price.toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={p.stock < 20 ? 'text-orange-600 font-bold' : 'text-slate-600'}>
                      {p.stock} {p.unit}
                    </span>
                    {p.stock < 20 && (
                      <Badge className="bg-orange-100 text-orange-600 border-none text-[10px] px-1.5 py-0">Low</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                      onClick={() => handleEdit(p)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      onClick={() => {
                        if (confirm('Hapus produk ini?')) {
                          onDelete(p.id);
                          toast.error('Produk dihapus');
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                  Produk tidak ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

