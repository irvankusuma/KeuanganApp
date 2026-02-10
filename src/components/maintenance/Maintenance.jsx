import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/database';
import { formatDate, formatNumber, getCurrentDate, formatInputNumber, getPlainNumber, formatCurrency } from '../../utils/formatters';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

const Maintenance = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    tanggal: getCurrentDate(),
    km_saat_ini: '',
    km_berikutnya: '',
    biaya: '',
    catatan: ''
  });

  const maintenance = useLiveQuery(() => db.maintenance.reverse().toArray()) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      km_saat_ini: getPlainNumber(formData.km_saat_ini),
      km_berikutnya: getPlainNumber(formData.km_berikutnya),
      biaya: formData.biaya ? getPlainNumber(formData.biaya) : 0
    };

    if (editingId) {
      await db.maintenance.update(editingId, data);
    } else {
      await db.maintenance.add(data);
      
      // OTOMATIS: Tambah ke pengeluaran jika ada biaya
      if (data.biaya > 0) {
        await db.pengeluaran.add({
          kategori: 'Perbaikan Kendaraan',
          jumlah: data.biaya,
          tanggal: data.tanggal,
          catatan: `Perbaikan: ${data.nama}${data.catatan ? ' - ' + data.catatan : ''}`
        });
        alert('Perbaikan tersimpan!\n\nBiaya otomatis tercatat di Pengeluaran.');
      }
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setFormData({
      nama: item.nama,
      tanggal: item.tanggal,
      km_saat_ini: formatInputNumber(item.km_saat_ini.toString()),
      km_berikutnya: formatInputNumber(item.km_berikutnya.toString()),
      biaya: item.biaya ? formatInputNumber(item.biaya.toString()) : '',
      catatan: item.catatan || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus data maintenance ini?')) {
      await db.maintenance.delete(id);
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      tanggal: getCurrentDate(),
      km_saat_ini: '',
      km_berikutnya: '',
      biaya: '',
      catatan: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Calculate days until next maintenance (estimation)
  const getDaysUntilNext = (item) => {
    const kmRemaining = item.km_berikutnya - item.km_saat_ini;
    const avgKmPerDay = 50; // Estimasi 50km per hari
    return Math.ceil(kmRemaining / avgKmPerDay);
  };

  // Check if maintenance is due soon (within 500km or negative)
  const isMaintenanceDue = (item) => {
    return (item.km_berikutnya - item.km_saat_ini) <= 500;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Catatan Perbaikan</h2>
          <p className="text-sm text-gray-400 mt-1">{maintenance.length} catatan tersimpan</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Tambah</span>
        </button>
      </div>

      {/* Due Soon Alert */}
      {maintenance.some(item => isMaintenanceDue(item)) && (
        <div className="card bg-orange-600/20 border-orange-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-orange-400 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-orange-400 mb-1">Peringatan Perbaikan!</h3>
              <p className="text-sm text-gray-300">
                Beberapa item perlu segera di-perbaiki (tersisa ≤ 500 km)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {maintenance.length > 0 ? (
          maintenance.map((item) => {
            const kmRemaining = item.km_berikutnya - item.km_saat_ini;
            const isDue = isMaintenanceDue(item);
            const daysEstimate = getDaysUntilNext(item);
            
            return (
              <div
                key={item.id}
                className={`card hover:border-blue-500/50 transition-colors ${
                  isDue ? 'border-orange-500 bg-orange-500/5' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{item.nama}</h3>
                      {isDue && (
                        <span className="px-2 py-1 bg-orange-600 text-xs rounded-full">
                          Segera!
                        </span>
                      )}
                    </div>
                    {item.catatan && (
                      <p className="text-sm text-gray-400 mt-1">{item.catatan}</p>
                    )}
                  </div>
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

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-dark-border">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tanggal Ganti</p>
                    <p className="text-sm font-medium">{formatDate(item.tanggal)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">KM Saat Ini</p>
                    <p className="text-sm font-medium">{formatNumber(item.km_saat_ini)} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">KM Berikutnya</p>
                    <p className="text-sm font-medium text-blue-400">
                      {formatNumber(item.km_berikutnya)} km
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Sisa KM</p>
                    <p className={`text-sm font-medium ${
                      kmRemaining <= 500 ? 'text-orange-400' : 'text-green-400'
                    }`}>
                      {formatNumber(kmRemaining)} km
                    </p>
                  </div>
                </div>

                {/* Biaya */}
                {item.biaya && item.biaya > 0 && (
                  <div className="mt-3 pt-3 border-t border-dark-border">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">Biaya Perbaikan:</p>
                      <p className="text-lg font-bold text-red-400">{formatCurrency(item.biaya)}</p>
                    </div>
                  </div>
                )}

                {daysEstimate > 0 && (
                  <div className="mt-3 pt-3 border-t border-dark-border">
                    <p className="text-xs text-gray-400">
                      Estimasi: sekitar <span className="text-white font-medium">{daysEstimate} hari lagi</span> (asumsi 50 km/hari)
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-400">Belum ada data perbaikan</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Tambah Catatan Pertama
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
                {editingId ? 'Edit Perbaikan' : 'Tambah Perbaikan'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nama Item</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="input-field"
                  required
                  placeholder="Contoh: Oli Mesin, Ban Depan"
                />
              </div>

              <div>
                <label className="label">Tanggal Penggantian</label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Kilometer Saat Ini</label>
                <input
                  type="text"
                  value={formData.km_saat_ini}
                  onChange={(e) => setFormData({ ...formData, km_saat_ini: formatInputNumber(e.target.value) })}
                  className="input-field"
                  required
                  placeholder="0"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Contoh: 15.000
                </p>
              </div>

              <div>
                <label className="label">Kilometer Berikutnya (Rekomendasi)</label>
                <input
                  type="text"
                  value={formData.km_berikutnya}
                  onChange={(e) => setFormData({ ...formData, km_berikutnya: formatInputNumber(e.target.value) })}
                  className="input-field"
                  required
                  placeholder="0"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Contoh: 20.000
                </p>
              </div>

              <div>
                <label className="label">Biaya Perbaikan (Rp) - Opsional</label>
                <input
                  type="text"
                  value={formData.biaya}
                  onChange={(e) => setFormData({ ...formData, biaya: formatInputNumber(e.target.value) })}
                  className="input-field"
                  placeholder="0"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Contoh: 250.000 (otomatis tercatat di Pengeluaran)
                </p>
              </div>

              <div>
                <label className="label">Catatan (Opsional)</label>
                <textarea
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Merek, harga, atau catatan lainnya..."
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
    </div>
  );
};

export default Maintenance;
