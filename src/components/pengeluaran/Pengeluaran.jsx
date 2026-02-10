import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/database';
import { formatCurrency, formatDate, getCurrentDate, formatInputNumber, getPlainNumber } from '../../utils/formatters';
import { Plus, Edit2, Trash2, X, Settings } from 'lucide-react';

const Pengeluaran = () => {
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    kategori: '',
    jumlah: '',
    tanggal: getCurrentDate(),
    catatan: ''
  });

  const pengeluaran = useLiveQuery(() => db.pengeluaran.reverse().toArray()) || [];
  const kategoriPengeluaran = useLiveQuery(() => db.kategoriPengeluaran.toArray()) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      jumlah: getPlainNumber(formData.jumlah)
    };

    if (editingId) {
      await db.pengeluaran.update(editingId, data);
    } else {
      await db.pengeluaran.add(data);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setFormData({
      kategori: item.kategori,
      jumlah: formatInputNumber(item.jumlah.toString()),
      tanggal: item.tanggal,
      catatan: item.catatan || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus pengeluaran ini?')) {
      await db.pengeluaran.delete(id);
    }
  };

  const resetForm = () => {
    setFormData({
      kategori: '',
      jumlah: '',
      tanggal: getCurrentDate(),
      catatan: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const totalPengeluaran = pengeluaran.reduce((sum, item) => sum + item.jumlah, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Pengeluaran</h2>
          <p className="text-sm text-gray-400 mt-1">Total: {formatCurrency(totalPengeluaran)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryManager(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Kelola Kategori</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {pengeluaran.length > 0 ? (
          pengeluaran.map((item) => (
            <div key={item.id} className="card hover:border-orange-500/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.kategori}</h3>
                  {item.catatan && (
                    <p className="text-sm text-gray-400 mt-1">{item.catatan}</p>
                  )}
                  <p className="text-sm text-gray-400 mt-2">{formatDate(item.tanggal)}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <p className="text-xl font-bold text-orange-400">{formatCurrency(item.jumlah)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-400">Belum ada data pengeluaran</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Tambah Pengeluaran Pertama
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingId ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Kategori</label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="select-field"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriPengeluaran.map((kategori) => (
                    <option key={kategori.id} value={kategori.nama}>
                      {kategori.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Jumlah (Rp)</label>
                <input
                  type="text"
                  value={formData.jumlah}
                  onChange={(e) => setFormData({ ...formData, jumlah: formatInputNumber(e.target.value) })}
                  className="input-field"
                  required
                  placeholder="0"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Contoh: 150.000
                </p>
              </div>

              <div>
                <label className="label">Tanggal</label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Catatan (Opsional)</label>
                <textarea
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Untuk apa uang ini dibelanjakan..."
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={resetForm} className="btn-secondary flex-1">
                  Batal
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingId ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <CategoryManager onClose={() => setShowCategoryManager(false)} />
      )}
    </div>
  );
};

// Category Manager Component
const CategoryManager = ({ onClose }) => {
  const [newCategory, setNewCategory] = useState('');
  const kategoriPengeluaran = useLiveQuery(() => db.kategoriPengeluaran.toArray()) || [];

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      await db.kategoriPengeluaran.add({ nama: newCategory.trim() });
      setNewCategory('');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus kategori ini?')) {
      await db.kategoriPengeluaran.delete(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Kelola Kategori Pengeluaran</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="input-field flex-1"
            placeholder="Nama kategori baru..."
          />
          <button type="submit" className="btn-primary">
            <Plus size={18} />
          </button>
        </form>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {kategoriPengeluaran.map((kategori) => (
            <div key={kategori.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
              <span>{kategori.nama}</span>
              <button
                onClick={() => handleDelete(kategori.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pengeluaran;
