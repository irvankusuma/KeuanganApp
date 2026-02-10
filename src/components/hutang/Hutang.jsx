import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/database';
import { formatCurrency, formatDate, getCurrentDate, formatInputNumber, getPlainNumber } from '../../utils/formatters';
import { Plus, Edit2, Trash2, X, Settings, DollarSign, History } from 'lucide-react';

const Hutang = () => {
  const [showForm, setShowForm] = useState(false);
  const [showTypeManager, setShowTypeManager] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHutang, setSelectedHutang] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    tipe: '',
    jumlah: '',
    periode: '',
    tanggal: getCurrentDate(),
    catatan: ''
  });
  const [paymentData, setPaymentData] = useState({
    jumlah: '',
    tanggal: getCurrentDate(),
    catatan: ''
  });

  const hutang = useLiveQuery(() => db.hutang.reverse().toArray()) || [];
  const tipeHutang = useLiveQuery(() => db.tipeHutang.toArray()) || [];
  const allPembayaran = useLiveQuery(() => db.pembayaranHutang.toArray()) || [];

  // Calculate total paid for each hutang
  const getTotalPaid = (hutangId) => {
    return allPembayaran
      .filter(p => p.hutangId === hutangId)
      .reduce((sum, p) => sum + p.jumlah, 0);
  };

  // Get payment history for specific hutang
  const getPaymentHistory = (hutangId) => {
    return allPembayaran
      .filter(p => p.hutangId === hutangId)
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      jumlah: getPlainNumber(formData.jumlah),
      periode: parseInt(formData.periode),
      tanggal: formData.tanggal,
      catatan: formData.catatan
    };

    if (editingId) {
      await db.hutang.update(editingId, data);
    } else {
      await db.hutang.add(data);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setFormData({
      nama: item.nama,
      tipe: item.tipe,
      jumlah: formatInputNumber(item.jumlah.toString()),
      periode: item.periode.toString(),
      tanggal: item.tanggal,
      catatan: item.catatan || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus hutang ini? Semua data pembayaran akan ikut terhapus.')) {
      // Delete hutang
      await db.hutang.delete(id);
      // Delete all related payments
      const payments = await db.pembayaranHutang.where('hutangId').equals(id).toArray();
      await Promise.all(payments.map(p => db.pembayaranHutang.delete(p.id)));
    }
  };

  const handleShowPayment = (hutang) => {
    setSelectedHutang(hutang);
    setPaymentData({
      jumlah: '',
      tanggal: getCurrentDate(),
      catatan: ''
    });
    setShowPaymentModal(true);
  };

  const handleShowHistory = (hutang) => {
    setSelectedHutang(hutang);
    setShowHistoryModal(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    const jumlahBayar = getPlainNumber(paymentData.jumlah);
    const totalPaid = getTotalPaid(selectedHutang.id);
    const sisaHutang = selectedHutang.jumlah - totalPaid;

    if (jumlahBayar > sisaHutang) {
      alert(`Jumlah pembayaran (${formatCurrency(jumlahBayar)}) melebihi sisa hutang (${formatCurrency(sisaHutang)})`);
      return;
    }

    // 1. Add pembayaran hutang
    await db.pembayaranHutang.add({
      hutangId: selectedHutang.id,
      jumlah: jumlahBayar,
      tanggal: paymentData.tanggal,
      catatan: paymentData.catatan
    });

    // 2. OTOMATIS: Tambah ke pengeluaran
    await db.pengeluaran.add({
      kategori: 'Pembayaran Hutang',
      jumlah: jumlahBayar,
      tanggal: paymentData.tanggal,
      catatan: `Bayar hutang: ${selectedHutang.nama}${paymentData.catatan ? ' - ' + paymentData.catatan : ''}`
    });

    // Check if fully paid
    if (jumlahBayar === sisaHutang) {
      alert('Hutang sudah lunas! 🎉\n\nPembayaran otomatis tercatat di Pengeluaran.');
    } else {
      alert('Pembayaran berhasil!\n\nOtomatis tercatat di Pengeluaran.');
    }

    setShowPaymentModal(false);
    setSelectedHutang(null);
  };

  const handleDeletePayment = async (paymentId) => {
    if (confirm('Yakin ingin menghapus pembayaran ini?')) {
      await db.pembayaranHutang.delete(paymentId);
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      tipe: '',
      jumlah: '',
      periode: '',
      tanggal: getCurrentDate(),
      catatan: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const totalHutang = hutang.reduce((sum, item) => sum + item.jumlah, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Hutang</h2>
          <p className="text-sm text-gray-400 mt-1">Total: {formatCurrency(totalHutang)}</p>
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
            <span>Tambah Hutang</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {hutang.length > 0 ? (
          hutang.map((item) => {
            const totalPaid = getTotalPaid(item.id);
            const sisaHutang = item.jumlah - totalPaid;
            const progressPercent = (totalPaid / item.jumlah) * 100;
            const isLunas = sisaHutang === 0;

            return (
              <div key={item.id} className={`card hover:border-blue-500/50 transition-colors ${isLunas ? 'border-green-500 bg-green-500/5' : ''}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{item.nama}</h3>
                      {isLunas && (
                        <span className="px-2 py-1 bg-green-600 text-xs rounded-full">
                          LUNAS
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{item.tipe}</p>
                    {item.catatan && (
                      <p className="text-sm text-gray-500 mt-2">{item.catatan}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-600 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Dibayar: {formatCurrency(totalPaid)}</span>
                    <span>{progressPercent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isLunas ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3 pt-3 border-t border-dark-border">
                  <div>
                    <p className="text-xs text-gray-400">Total Hutang</p>
                    <p className="text-lg font-bold text-red-400">{formatCurrency(item.jumlah)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Sisa Hutang</p>
                    <p className={`text-lg font-bold ${isLunas ? 'text-green-400' : 'text-orange-400'}`}>
                      {formatCurrency(sisaHutang)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                  <div>
                    <span>Periode:</span>
                    <span className="ml-2 font-medium text-gray-300">{item.periode} bulan</span>
                  </div>
                  <div>
                    <span>Tanggal:</span>
                    <span className="ml-2 font-medium text-gray-300">{formatDate(item.tanggal)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-dark-border">
                  {!isLunas && (
                    <button
                      onClick={() => handleShowPayment(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <DollarSign size={16} />
                      <span>Bayar</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleShowHistory(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <History size={16} />
                    <span>Histori ({getPaymentHistory(item.id).length})</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-400">Belum ada data hutang</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Tambah Hutang Pertama
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
                {editingId ? 'Edit Hutang' : 'Tambah Hutang'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nama Hutang</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="input-field"
                  required
                  placeholder="Contoh: Cicilan Motor"
                />
              </div>

              <div>
                <label className="label">Tipe Hutang</label>
                <select
                  value={formData.tipe}
                  onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                  className="select-field"
                  required
                >
                  <option value="">Pilih Tipe</option>
                  {tipeHutang.map((tipe) => (
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
                  Contoh: 15.000.000
                </p>
              </div>

              <div>
                <label className="label">Periode (bulan)</label>
                <input
                  type="number"
                  value={formData.periode}
                  onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                  className="input-field"
                  required
                  min="1"
                  placeholder="12"
                />
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

      {/* Payment Modal */}
      {showPaymentModal && selectedHutang && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Bayar Hutang</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 p-3 bg-dark-bg rounded-lg">
              <p className="text-sm text-gray-400">Hutang:</p>
              <p className="font-semibold">{selectedHutang.nama}</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-400">Total Hutang</p>
                  <p className="font-bold text-red-400">{formatCurrency(selectedHutang.jumlah)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Sisa Hutang</p>
                  <p className="font-bold text-orange-400">
                    {formatCurrency(selectedHutang.jumlah - getTotalPaid(selectedHutang.id))}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="label">Jumlah Bayar (Rp)</label>
                <input
                  type="text"
                  value={paymentData.jumlah}
                  onChange={(e) => setPaymentData({ ...paymentData, jumlah: formatInputNumber(e.target.value) })}
                  className="input-field"
                  required
                  placeholder="0"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Maksimal: {formatCurrency(selectedHutang.jumlah - getTotalPaid(selectedHutang.id))}
                </p>
              </div>

              <div>
                <label className="label">Tanggal Bayar</label>
                <input
                  type="date"
                  value={paymentData.tanggal}
                  onChange={(e) => setPaymentData({ ...paymentData, tanggal: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Catatan (Opsional)</label>
                <textarea
                  value={paymentData.catatan}
                  onChange={(e) => setPaymentData({ ...paymentData, catatan: e.target.value })}
                  className="input-field"
                  rows="2"
                  placeholder="Catatan pembayaran..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="btn-secondary flex-1"
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Bayar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedHutang && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Histori Pembayaran</h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 p-4 bg-dark-bg rounded-lg">
              <p className="font-semibold text-lg mb-2">{selectedHutang.nama}</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Total Hutang</p>
                  <p className="font-bold text-red-400">{formatCurrency(selectedHutang.jumlah)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Dibayar</p>
                  <p className="font-bold text-green-400">
                    {formatCurrency(getTotalPaid(selectedHutang.id))}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Sisa Hutang</p>
                  <p className="font-bold text-orange-400">
                    {formatCurrency(selectedHutang.jumlah - getTotalPaid(selectedHutang.id))}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {getPaymentHistory(selectedHutang.id).length > 0 ? (
                getPaymentHistory(selectedHutang.id).map((payment) => (
                  <div key={payment.id} className="p-4 bg-dark-bg rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-green-400">
                          {formatCurrency(payment.jumlah)}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {formatDate(payment.tanggal)}
                        </p>
                        {payment.catatan && (
                          <p className="text-sm text-gray-500 mt-1">{payment.catatan}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeletePayment(payment.id)}
                        className="p-2 hover:bg-red-600 rounded-lg transition-colors"
                        title="Hapus pembayaran"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Belum ada pembayaran
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Type Manager Component
const TypeManager = ({ onClose }) => {
  const [newType, setNewType] = useState('');
  const tipeHutang = useLiveQuery(() => db.tipeHutang.toArray()) || [];

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newType.trim()) {
      await db.tipeHutang.add({ nama: newType.trim() });
      setNewType('');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus tipe ini?')) {
      await db.tipeHutang.delete(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Kelola Tipe Hutang</h3>
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
          {tipeHutang.map((tipe) => (
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

export default Hutang;
