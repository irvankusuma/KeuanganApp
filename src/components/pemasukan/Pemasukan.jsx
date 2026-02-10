import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/database';
import { formatCurrency, formatDate, getCurrentDate, formatInputNumber, getPlainNumber } from '../../utils/formatters';
import { Plus, Edit2, Trash2, X, Settings } from 'lucide-react';

const Pemasukan = () => {
  const [showForm, setShowForm] = useState(false);
  const [showTypeManager, setShowTypeManager] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    sumber: '',
    tipe: '',
    jumlah: '',
    tanggal: getCurrentDate(),
    catatan: ''
  });

  const pemasukan = useLiveQuery(() => db.pemasukan.reverse().toArray()) || [];
  const tipePemasukan = useLiveQuery(() => db.tipePemasukan.toArray()) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      jumlah: getPlainNumber(formData.jumlah)
    };

    if (editingId) {
      await db.pemasukan.update(editingId, data);
    } else {
      await db.pemasukan.add(data);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setFormData({
      sumber: item.sumber,
      tipe: item.tipe,
      jumlah: formatInputNumber(item.jumlah.toString()),
      tanggal: item.tanggal,
      catatan: item.catatan || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus pemasukan ini?')) {
      await db.pemasukan.delete(id);
    }
  };

  const resetForm = () => {
    setFormData({
      sumber: '',
      tipe: '',
      jumlah: '',
      tanggal: getCurrentDate(),
      catatan: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const totalPemasukan = pemasukan.reduce((sum, item) => sum + item.jumlah, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Pemasukan</h2>
          <p className="text-sm text-gray-400 mt-1">Total: {formatCurrency(totalPemasukan)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTypeManager(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Kelola Tipe</span>
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
        {pemasukan.length > 0 ? (
          pemasukan.map((item) => (
            <div key={item.id} className="card hover:border-green-500/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.sumber}</h3>
                  <p className="text-sm text-gray-400">{item.tipe}</p>
                  {item.catatan && (
                    <p className="text-sm text-gray-500 mt-2">{item.catatan}</p>
                  )}
                  <p className="text-sm text-gray-400 mt-2">{formatDate(item.tanggal)}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <p className="text-xl font-bold text-green-400">{formatCurrency(item.jumlah)}</p>
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
            <p className="text-gray-400">Belum ada data pemasukan</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Tambah Pemasukan Pertama
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
                {editingId ? 'Edit Pemasukan' : 'Tambah Pemasukan'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Sumber Pemasukan</label>
                <input
                  type="text"
                  value={formData.sumber}
                  onChange={(e) => setFormData({ ...formData, sumber: e.target.value })}
                  className="input-field"
                  required
                  placeholder="Contoh: Gaji Bulanan"
                />
              </div>

              <div>
                <label className="label">Tipe Pemasukan</label>
                <select
                  value={formData.tipe}
                  onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                  className="select-field"
                  required
                >
                  <option value="">Pilih Tipe</option>
                  {tipePemasukan.map((tipe) => (
                    <option key={tipe.id} value={tipe.nama}>
                      {tipe.nama}
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
                  Contoh: 5.000.000
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
                  placeholder="Catatan tambahan..."
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

      {/* Type Manager Modal */}
      {showTypeManager && (
        <TypeManager onClose={() => setShowTypeManager(false)} />
      )}
    </div>
  );
};

// Type Manager Component
const TypeManager = ({ onClose }) => {
  const [newType, setNewType] = useState('');
  const tipePemasukan = useLiveQuery(() => db.tipePemasukan.toArray()) || [];

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newType.trim()) {
      await db.tipePemasukan.add({ nama: newType.trim() });
      setNewType('');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus tipe ini?')) {
      await db.tipePemasukan.delete(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Kelola Tipe Pemasukan</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="input-field flex-1"
            placeholder="Nama tipe baru..."
          />
          <button type="submit" className="btn-primary">
            <Plus size={18} />
          </button>
        </form>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {tipePemasukan.map((tipe) => (
            <div key={tipe.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
              <span>{tipe.nama}</span>
              <button
                onClick={() => handleDelete(tipe.id)}
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

export default Pemasukan;
