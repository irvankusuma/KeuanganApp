import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/database';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { DollarSign, TrendingUp, TrendingDown, Wrench, Clock, Coins } from 'lucide-react';

const Dashboard = () => {
  // Fetch all data
  const hutang = useLiveQuery(() => db.hutang.toArray()) || [];
  const pemasukan = useLiveQuery(() => db.pemasukan.toArray()) || [];
  const pengeluaran = useLiveQuery(() => db.pengeluaran.toArray()) || [];
  const maintenance = useLiveQuery(() => db.maintenance.toArray()) || [];
  const pembayaranHutang = useLiveQuery(() => db.pembayaranHutang.toArray()) || [];
  const piutang = useLiveQuery(() => db.piutang.toArray()) || [];
  const pembayaranPiutang = useLiveQuery(() => db.pembayaranPiutang.toArray()) || [];

  // Calculate totals
  const totalHutang = hutang.reduce((sum, item) => sum + item.jumlah, 0);
  const totalPembayaranHutang = pembayaranHutang.reduce((sum, item) => sum + item.jumlah, 0);
  const sisaHutang = totalHutang - totalPembayaranHutang;
  
  const totalPiutang = piutang.reduce((sum, item) => sum + item.jumlah, 0);
  const totalPembayaranPiutang = pembayaranPiutang.reduce((sum, item) => sum + item.jumlah, 0);
  const sisaPiutang = totalPiutang - totalPembayaranPiutang;
  
  const totalPemasukan = pemasukan.reduce((sum, item) => sum + item.jumlah, 0);
  const totalPengeluaran = pengeluaran.reduce((sum, item) => sum + item.jumlah, 0);

  // Get recent items (last 3)
  const recentHutang = [...hutang].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 3);
  const recentPemasukan = [...pemasukan].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 3);
  const recentPengeluaran = [...pengeluaran].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 3);
  const recentMaintenance = [...maintenance].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 3);

  const summaryCards = [
    {
      title: 'Sisa Hutang',
      value: formatCurrency(sisaHutang),
      count: `${hutang.length} hutang (${formatCurrency(totalPembayaranHutang)} dibayar)`,
      icon: DollarSign,
      color: sisaHutang > 0 ? 'text-red-500' : 'text-green-500',
      bgColor: sisaHutang > 0 ? 'bg-red-500/10' : 'bg-green-500/10'
    },
    {
      title: 'Sisa Piutang',
      value: formatCurrency(sisaPiutang),
      count: `${piutang.length} piutang (${formatCurrency(totalPembayaranPiutang)} diterima)`,
      icon: Coins,
      color: sisaPiutang > 0 ? 'text-green-500' : 'text-gray-500',
      bgColor: sisaPiutang > 0 ? 'bg-green-500/10' : 'bg-gray-500/10'
    },
    {
      title: 'Total Pemasukan',
      value: formatCurrency(totalPemasukan),
      count: `${pemasukan.length} transaksi`,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Total Pengeluaran',
      value: formatCurrency(totalPengeluaran),
      count: `${pengeluaran.length} transaksi`,
      icon: TrendingDown,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      title: 'Perbaikan',
      value: `${maintenance.length}`,
      count: 'catatan perbaikan',
      icon: Wrench,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Saldo Bersih - PALING ATAS */}
      <div className="card bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">💎 Saldo Bersih</h3>
          <div className="text-xs bg-blue-700 px-3 py-1 rounded-full">
            Real-time
          </div>
        </div>
        <p className="text-4xl font-bold mb-3">
          {formatCurrency(totalPemasukan + sisaPiutang - totalPengeluaran - sisaHutang)}
        </p>
        <div className="text-sm text-blue-200 space-y-1">
          <p className="flex items-center justify-between">
            <span>Pemasukan + Piutang Belum Diterima</span>
            <span className="font-semibold">{formatCurrency(totalPemasukan + sisaPiutang)}</span>
          </p>
          <p className="flex items-center justify-between">
            <span>Pengeluaran + Hutang Belum Dibayar</span>
            <span className="font-semibold">{formatCurrency(totalPengeluaran + sisaHutang)}</span>
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold mb-1">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.count}</p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={card.color} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Hutang */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="text-red-500" size={20} />
            <h3 className="font-semibold">Hutang Terbaru</h3>
          </div>
          {recentHutang.length > 0 ? (
            <div className="space-y-3">
              {recentHutang.map((item) => (
                <div key={item.id} className="flex justify-between items-start p-3 bg-dark-bg rounded-lg">
                  <div>
                    <p className="font-medium">{item.nama}</p>
                    <p className="text-xs text-gray-400">{item.tipe}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {formatDate(item.tanggal)}
                    </p>
                  </div>
                  <p className="font-semibold text-red-400">{formatCurrency(item.jumlah)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Belum ada data hutang</p>
          )}
        </div>

        {/* Recent Pemasukan */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-green-500" size={20} />
            <h3 className="font-semibold">Pemasukan Terbaru</h3>
          </div>
          {recentPemasukan.length > 0 ? (
            <div className="space-y-3">
              {recentPemasukan.map((item) => (
                <div key={item.id} className="flex justify-between items-start p-3 bg-dark-bg rounded-lg">
                  <div>
                    <p className="font-medium">{item.sumber}</p>
                    <p className="text-xs text-gray-400">{item.tipe}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {formatDate(item.tanggal)}
                    </p>
                  </div>
                  <p className="font-semibold text-green-400">{formatCurrency(item.jumlah)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Belum ada data pemasukan</p>
          )}
        </div>

        {/* Recent Pengeluaran */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="text-orange-500" size={20} />
            <h3 className="font-semibold">Pengeluaran Terbaru</h3>
          </div>
          {recentPengeluaran.length > 0 ? (
            <div className="space-y-3">
              {recentPengeluaran.map((item) => (
                <div key={item.id} className="flex justify-between items-start p-3 bg-dark-bg rounded-lg">
                  <div>
                    <p className="font-medium">{item.kategori}</p>
                    {item.catatan && <p className="text-xs text-gray-400">{item.catatan}</p>}
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {formatDate(item.tanggal)}
                    </p>
                  </div>
                  <p className="font-semibold text-orange-400">{formatCurrency(item.jumlah)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Belum ada data pengeluaran</p>
          )}
        </div>

        {/* Recent Maintenance */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="text-blue-500" size={20} />
            <h3 className="font-semibold">Perbaikan Terbaru</h3>
          </div>
          {recentMaintenance.length > 0 ? (
            <div className="space-y-3">
              {recentMaintenance.map((item) => (
                <div key={item.id} className="p-3 bg-dark-bg rounded-lg">
                  <p className="font-medium">{item.nama}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    KM: {item.km_saat_ini} → {item.km_berikutnya}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Clock size={12} />
                    {formatDate(item.tanggal)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Belum ada data perbaikan</p>
          )}
        </div>
      </div>

      {/* Extra spacing for mobile bottom nav */}
      <div className="h-4 md:hidden"></div>
    </div>
  );
};

export default Dashboard;
