import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/database';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { DollarSign, Coins, TrendingUp, TrendingDown, Wrench, Calendar } from 'lucide-react';
import { useState } from 'react';

const History = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  // Fetch all data
  const hutang = useLiveQuery(() => db.hutang.toArray()) || [];
  const piutang = useLiveQuery(() => db.piutang.toArray()) || [];
  const pemasukan = useLiveQuery(() => db.pemasukan.toArray()) || [];
  const pengeluaran = useLiveQuery(() => db.pengeluaran.toArray()) || [];
  const maintenance = useLiveQuery(() => db.maintenance.toArray()) || [];
  const pembayaranHutang = useLiveQuery(() => db.pembayaranHutang.toArray()) || [];
  const pembayaranPiutang = useLiveQuery(() => db.pembayaranPiutang.toArray()) || [];

  // Combine all into timeline
  const getAllHistory = () => {
    const history = [];

    hutang.forEach(item => {
      history.push({
        type: 'hutang',
        action: 'Tambah Hutang',
        name: item.nama,
        amount: item.jumlah,
        date: item.tanggal,
        icon: DollarSign,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10'
      });
    });

    piutang.forEach(item => {
      history.push({
        type: 'piutang',
        action: 'Tambah Piutang',
        name: item.namaOrang,
        amount: item.jumlah,
        date: item.tanggal,
        icon: Coins,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10'
      });
    });

    pemasukan.forEach(item => {
      history.push({
        type: 'pemasukan',
        action: 'Pemasukan',
        name: item.sumber,
        amount: item.jumlah,
        date: item.tanggal,
        icon: TrendingUp,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10'
      });
    });

    pengeluaran.forEach(item => {
      history.push({
        type: 'pengeluaran',
        action: 'Pengeluaran',
        name: item.kategori,
        amount: item.jumlah,
        date: item.tanggal,
        icon: TrendingDown,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10'
      });
    });

    maintenance.forEach(item => {
      history.push({
        type: 'perbaikan',
        action: 'Perbaikan',
        name: item.nama,
        amount: item.biaya || 0,
        date: item.tanggal,
        icon: Wrench,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
      });
    });

    pembayaranHutang.forEach(payment => {
      const hutangItem = hutang.find(h => h.id === payment.hutangId);
      history.push({
        type: 'pembayaran_hutang',
        action: 'Bayar Hutang',
        name: hutangItem ? hutangItem.nama : 'Unknown',
        amount: payment.jumlah,
        date: payment.tanggal,
        icon: DollarSign,
        color: 'text-red-400',
        bgColor: 'bg-red-400/10'
      });
    });

    pembayaranPiutang.forEach(payment => {
      const piutangItem = piutang.find(p => p.id === payment.piutangId);
      history.push({
        type: 'pembayaran_piutang',
        action: 'Terima Piutang',
        name: piutangItem ? piutangItem.namaOrang : 'Unknown',
        amount: payment.jumlah,
        date: payment.tanggal,
        icon: Coins,
        color: 'text-green-400',
        bgColor: 'bg-green-400/10'
      });
    });

    // Sort by date (newest first)
    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const allHistory = getAllHistory();

  // Filter history
  const filteredHistory = allHistory.filter(item => {
    // Filter by type
    if (filterType !== 'all' && item.type !== filterType) {
      return false;
    }

    // Filter by date
    if (filterDate && item.date !== filterDate) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">History</h2>
        <p className="text-sm text-gray-400 mt-1">{filteredHistory.length} aktivitas</p>
      </div>

      {/* Filters */}
      <div className="card">
        <h3 className="font-semibold mb-3">Filter</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Tipe</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">Semua</option>
              <option value="hutang">Hutang</option>
              <option value="piutang">Piutang</option>
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
              <option value="perbaikan">Perbaikan</option>
              <option value="pembayaran_hutang">Bayar Hutang</option>
              <option value="pembayaran_piutang">Terima Piutang</option>
            </select>
          </div>

          <div>
            <label className="label">Tanggal</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {(filterType !== 'all' || filterDate) && (
          <button
            onClick={() => {
              setFilterType('all');
              setFilterDate('');
            }}
            className="mt-3 text-sm text-blue-400 hover:text-blue-300"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className={`card ${item.bgColor} border border-opacity-20`}>
                <div className="flex items-start gap-4">
                  <div className={`${item.bgColor} p-3 rounded-lg`}>
                    <Icon className={item.color} size={24} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="font-semibold">{item.action}</h4>
                        <p className="text-sm text-gray-400">{item.name}</p>
                      </div>
                      {item.amount > 0 && (
                        <p className={`font-bold ${item.color}`}>
                          {formatCurrency(item.amount)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <Calendar size={12} />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">Tidak ada history ditemukan</p>
            {(filterType !== 'all' || filterDate) && (
              <button
                onClick={() => {
                  setFilterType('all');
                  setFilterDate('');
                }}
                className="btn-primary mt-4 inline-flex items-center gap-2"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
