import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/database';
import { formatCurrency, formatDate, getCurrentDate, formatInputNumber, getPlainNumber } from '../../utils/formatters';
import { Plus, Edit2, Trash2, X, DollarSign, History, UserPlus, Clock } from 'lucide-react';

const Piutang = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPiutang, setSelectedPiutang] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    namaOrang: '',
    jumlah: '',
    tanggal: getCurrentDate(),
    jatuhTempo: '',
    catatan: ''
  });
  const [paymentData, setPaymentData] = useState({
    jumlah: '',
    tanggal: getCurrentDate(),
    catatan: ''
  });

  const piutang = useLiveQuery(() => db.piutang.reverse().toArray()) || [];
  const allPembayaran = useLiveQuery(() => db.pembayaranPiutang.toArray()) || [];

  // Calculate total paid for each piutang
  const getTotalPaid = (piutangId) => {
    return allPembayaran
      .filter(p => p.piutangId === piutangId)
      .reduce((sum, p) => sum + p.jumlah, 0);
  };

  // Get payment history for specific piutang
  const getPaymentHistory = (piutangId) => {
    return allPembayaran
      .filter(p => p.piutangId === piutangId)
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  };

  // Check if overdue
  const isOverdue = (jatuhTempo, sisaPiutang) => {
    if (!jatuhTempo || sisaPiutang === 0) return false;
    return new Date(jatuhTempo) < new Date() && sisaPiutang > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      jumlah: getPlainNumber(formData.jumlah)
    };

    if (editingId) {
      await db.piutang.update(editingId, data);
    } else {
      await db.piutang.add(data);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setFormData({
      namaOrang: item.namaOrang,
      jumlah: formatInputNumber(item.jumlah.toString()),
      tanggal: item.tanggal,
      jatuhTempo: item.jatuhTempo || '',
      catatan: item.catatan || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus piutang ini? Semua data pembayaran akan ikut terhapus.')) {
      await db.piutang.delete(id);
      const payments = await db.pembayaranPiutang.where('piutangId').equals(id).toArray();
      await Promise.all(payments.map(p => db.pembayaranPiutang.delete(p.id)));
    }
  };

  const handleShowPayment = (piutang) => {
    setSelectedPiutang(piutang);
    setPaymentData({
      jumlah: '',
      tanggal: getCurrentDate(),
      catatan: ''
    });
    setShowPaymentModal(true);
  };

  const handleShowHistory = (piutang) => {
    setSelectedPiutang(piutang);
    setShowHistoryModal(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    const jumlahBayar = getPlainNumber(paymentData.jumlah);
    const totalPaid = getTotalPaid(selectedPiutang.id);
    const sisaPiutang = selectedPiutang.jumlah - totalPaid;

    if (jumlahBayar > sisaPiutang) {
      alert(`Jumlah pembayaran (${formatCurrency(jumlahBayar)}) melebihi sisa piutang (${formatCurrency(sisaPiutang)})`);
      return;
    }

    // 1. Add pembayaran piutang
    await db.pembayaranPiutang.add({
      piutangId: selectedPiutang.id,
      jumlah: jumlahBayar,
      tanggal: paymentData.tanggal,
      catatan: paymentData.catatan
    });

    // 2. OTOMATIS: Tambah ke pemasukan
    await db.pemasukan.add({
      sumber: selectedPiutang.namaOrang,
      tipe: 'Pembayaran Piutang',
      jumlah: jumlahBayar,
      tanggal: paymentData.tanggal,
      catatan: `Terima piutang dari ${selectedPiutang.namaOrang}${paymentData.catatan ? ' - ' + paymentData.catatan : ''}`
    });

    if (jumlahBayar === sisaPiutang) {
      alert('Piutang sudah lunas! 🎉\n\nPembayaran otomatis tercatat di Pemasukan.');
    } else {
      alert('Pembayaran diterima!\n\nOtomatis tercatat di Pemasukan.');
    }

    setShowPaymentModal(false);
    setSelectedPiutang(null);
  };

  const handleDeletePayment = async (paymentId) => {
    if (confirm('Yakin ingin menghapus pembayaran ini?')) {
      await db.pembayaranPiutang.delete(paymentId);
    }
  };

  const resetForm = () => {
    setFormData({
      namaOrang: '',
      jumlah: '',
      tanggal: getCurrentDate(),
      jatuhTempo: '',
      catatan: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const totalPiutang = piutang.reduce((sum, item) => sum + item.jumlah, 0);
  const totalDiterima = allPembayaran.reduce((sum, item) => sum + item.jumlah, 0);
  const sisaPiutang = totalPiutang - totalDiterima;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Piutang (Orang Hutang ke Saya)</h2>
          <div className="flex flex-wrap gap-3 mt-2 text-sm">
            <div>
              <span className="text-gray-400">Total:</span>
              <span className="ml-2 font-semibold text-green-400">{formatCurrency(totalPiutang)}</span>
            </div>
            <div>
              <span className="text-gray-400">Diterima:</span>
              <span className="ml-2 font-semibold text-blue-400">{formatCurrency(totalDiterima)}</span>
            </div>
            <div>
              <span className="text-gray-400">Sisa:</span>
              <span className="ml-2 font-semibold text-orange-400">{formatCurrency(sisaPiutang)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <UserPlus size={18} />
          <span>Tambah Piutang</span>
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {piutang.length > 0 ? (
          piutang.map((item) => {
            const totalPaid = getTotalPaid(item.id);
            const sisa = item.jumlah - totalPaid;
            const progressPercent = (totalPaid / item.jumlah) * 100;
            const isLunas = sisa === 0;
            const overdue = isOverdue(item.jatuhTempo, sisa);

            return (
              <div key={item.id} className={`card hover:border-green-500/50 transition-colors ${
                isLunas ? 'border-green-500 bg-green-500/5' : 
                overdue ? 'border-red-500 bg-red-500/5' : ''
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-semibold truncate">{item.namaOrang}</h3>
                      {isLunas && (
                        <span className="px-2 py-0.5 bg-green-600 text-xs rounded-full whitespace-nowrap">
                          LUNAS
                        </span>
                      )}
                      {overdue && (
                        <span className="px-2 py-0.5 bg-red-600 text-xs rounded-full whitespace-nowrap">
                          JATUH TEMPO
                        </span>
                      )}
                    </div>
                    {item.catatan && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.catatan}</p>
                    )}
                  </div>
                  <div className="flex gap-1 sm:gap-2 ml-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 sm:p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 sm:p-2 hover:bg-red-600 rounded-lg transition-colors"
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

                <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t border-dark-border">
                  <div>
                    <p className="text-xs text-gray-400">Total Piutang</p>
                    <p className="text-base sm:text-lg font-bold text-green-400">{formatCurrency(item.jumlah)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Sisa Piutang</p>
                    <p className={`text-base sm:text-lg font-bold ${isLunas ? 'text-green-400' : 'text-orange-400'}`}>
                      {formatCurrency(sisa)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Tanggal: {formatDate(item.tanggal)}</span>
                  </div>
                  {item.jatuhTempo && (
                    <div className={`flex items-center gap-1 ${overdue ? 'text-red-400' : ''}`}>
                      <Clock size={14} />
                      <span>Jatuh Tempo: {formatDate(item.jatuhTempo)}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-dark-border">
                  {!isLunas && (
                    <button
                      onClick={() => handleShowPayment(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
                    >
                      <DollarSign size={16} />
                      <span>Terima</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleShowHistory(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                  >
                    <History size={16} />
                    <span>Histori</span>
                    <span className="hidden sm:inline">({getPaymentHistory(item.id).length})</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card text-center py-12">
            <UserPlus className="mx-auto mb-3 text-gray-400" size={48} />
            <p className="text-gray-400 mb-2">Belum ada data piutang</p>
            <p className="text-sm text-gray-500 mb-4">Catat orang yang hutang ke Anda</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Tambah Piutang Pertama
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-lg max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold">
                {editingId ? 'Edit Piutang' : 'Tambah Piutang'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nama Orang</label>
                <input
                  type="text"
                  value={formData.namaOrang}
                  onChange={(e) => setFormData({ ...formData, namaOrang: e.target.value })}
                  className="input-field"
                  required
                  placeholder="Contoh: Ahmad, Budi, dll"
                />
              </div>

              <div>
                <label className="label">Jumlah Piutang (Rp)</label>
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
                <label className="label">Tanggal Pinjam</label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Jatuh Tempo (Opsional)</label>
                <input
                  type="date"
                  value={formData.jatuhTempo}
                  onChange={(e) => setFormData({ ...formData, jatuhTempo: e.target.value })}
                  className="input-field"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Kapan harus dibayar? (Opsional)
                </p>
              </div>

              <div>
                <label className="label">Catatan (Opsional)</label>
                <textarea
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Catatan tambahan, kesepakatan, dll..."
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

      {/* Payment Modal */}
      {showPaymentModal && selectedPiutang && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-lg max-w-md w-full p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold">Terima Pembayaran</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 p-3 bg-dark-bg rounded-lg">
              <p className="text-sm text-gray-400">Dari:</p>
              <p className="font-semibold">{selectedPiutang.namaOrang}</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-400">Total Piutang</p>
                  <p className="font-bold text-green-400 text-sm sm:text-base">{formatCurrency(selectedPiutang.jumlah)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Sisa Piutang</p>
                  <p className="font-bold text-orange-400 text-sm sm:text-base">
                    {formatCurrency(selectedPiutang.jumlah - getTotalPaid(selectedPiutang.id))}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="label">Jumlah Diterima (Rp)</label>
                <input
                  type="text"
                  value={paymentData.jumlah}
                  onChange={(e) => setPaymentData({ ...paymentData, jumlah: formatInputNumber(e.target.value) })}
                  className="input-field"
                  required
                  placeholder="0"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Maksimal: {formatCurrency(selectedPiutang.jumlah - getTotalPaid(selectedPiutang.id))}
                </p>
              </div>

              <div>
                <label className="label">Tanggal Terima</label>
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
                  Terima
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedPiutang && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-lg max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold">Histori Pembayaran</h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 p-3 sm:p-4 bg-dark-bg rounded-lg">
              <p className="font-semibold text-base sm:text-lg mb-2">{selectedPiutang.namaOrang}</p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Total Piutang</p>
                  <p className="font-bold text-green-400">{formatCurrency(selectedPiutang.jumlah)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Total Diterima</p>
                  <p className="font-bold text-blue-400">
                    {formatCurrency(getTotalPaid(selectedPiutang.id))}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Sisa Piutang</p>
                  <p className="font-bold text-orange-400">
                    {formatCurrency(selectedPiutang.jumlah - getTotalPaid(selectedPiutang.id))}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {getPaymentHistory(selectedPiutang.id).length > 0 ? (
                getPaymentHistory(selectedPiutang.id).map((payment) => (
                  <div key={payment.id} className="p-3 sm:p-4 bg-dark-bg rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-green-400 text-sm sm:text-base">
                          {formatCurrency(payment.jumlah)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">
                          {formatDate(payment.tanggal)}
                        </p>
                        {payment.catatan && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{payment.catatan}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeletePayment(payment.id)}
                        className="p-1.5 sm:p-2 hover:bg-red-600 rounded-lg transition-colors ml-2"
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

export default Piutang;
