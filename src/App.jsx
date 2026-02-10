import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from './db/database';
import { exportToTXT, exportToExcel } from './utils/export';
import { importFromTXT, importFromExcel } from './utils/import';

// Components
import Sidebar from './components/common/Sidebar';
import BottomNav from './components/common/BottomNav';
import Header from './components/common/Header';
import ImportExportModal from './components/common/ExportModal';
import Dashboard from './components/dashboard/Dashboard';
import Hutang from './components/hutang/Hutang';
import Piutang from './components/piutang/Piutang';
import Pemasukan from './components/pemasukan/Pemasukan';
import Pengeluaran from './components/pengeluaran/Pengeluaran';
import Maintenance from './components/maintenance/Maintenance';
import History from './components/history/History';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showExportModal, setShowExportModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch all data for export
  const hutang = useLiveQuery(() => db.hutang.toArray()) || [];
  const pemasukan = useLiveQuery(() => db.pemasukan.toArray()) || [];
  const pengeluaran = useLiveQuery(() => db.pengeluaran.toArray()) || [];
  const maintenance = useLiveQuery(() => db.maintenance.toArray()) || [];
  const pembayaranHutang = useLiveQuery(() => db.pembayaranHutang.toArray()) || [];
  const piutang = useLiveQuery(() => db.piutang.toArray()) || [];
  const pembayaranPiutang = useLiveQuery(() => db.pembayaranPiutang.toArray()) || [];

  const handleExportTXT = async () => {
    try {
      await exportToTXT({ hutang, pemasukan, pengeluaran, maintenance, pembayaranHutang, piutang, pembayaranPiutang });
      alert('Data berhasil diexport ke file TXT!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Gagal export data. Silakan coba lagi.');
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportToExcel({ hutang, pemasukan, pengeluaran, maintenance, pembayaranHutang, piutang, pembayaranPiutang });
      alert('Data berhasil diexport ke file Excel!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Gagal export data. Silakan coba lagi.');
    }
  };

  const handleImport = async (file, type) => {
    try {
      let result;
      if (type === 'excel') {
        result = await importFromExcel(file);
      } else if (type === 'txt') {
        result = await importFromTXT(file);
      }

      const total = Object.values(result).reduce((sum, val) => sum + val, 0);
      alert(`Berhasil import ${total} data!\n\n` +
        `Hutang: ${result.hutang}\n` +
        `Piutang: ${result.piutang}\n` +
        `Pemasukan: ${result.pemasukan}\n` +
        `Pengeluaran: ${result.pengeluaran}\n` +
        `Perbaikan: ${result.maintenance}`
      );
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'hutang':
        return <Hutang />;
      case 'piutang':
        return <Piutang />;
      case 'pemasukan':
        return <Pemasukan />;
      case 'pengeluaran':
        return <Pengeluaran />;
      case 'perbaikan':
        return <Maintenance />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Beranda',
      hutang: 'Hutang Saya',
      piutang: 'Piutang Saya',
      pemasukan: 'Manajemen Pemasukan',
      pengeluaran: 'Manajemen Pengeluaran',
      perbaikan: 'Catatan Perbaikan',
      history: 'History Aktivitas'
    };
    return titles[currentPage] || 'Beranda';
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for Desktop */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onExport={() => setShowExportModal(true)}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header for Mobile */}
        <Header
          title={getPageTitle()}
          onExport={() => setShowExportModal(true)}
        />

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 pb-20 sm:pb-24 md:pb-6 overflow-y-auto">
          {renderPage()}
        </main>

        {/* Bottom Navigation for Mobile */}
        <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>

      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExportTXT={handleExportTXT}
        onExportExcel={handleExportExcel}
        onImport={handleImport}
      />
    </div>
  );
}

export default App;
