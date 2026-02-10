import { Home, DollarSign, Coins, TrendingUp, TrendingDown, Wrench, Download, ChevronLeft, ChevronRight, History } from 'lucide-react';

const Sidebar = ({ currentPage, onNavigate, onExport, isCollapsed, onToggle }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Beranda' },
    { id: 'hutang', icon: DollarSign, label: 'Hutang Saya' },
    { id: 'piutang', icon: Coins, label: 'Piutang Saya' },
    { id: 'pemasukan', icon: TrendingUp, label: 'Pemasukan' },
    { id: 'pengeluaran', icon: TrendingDown, label: 'Pengeluaran' },
    { id: 'perbaikan', icon: Wrench, label: 'Perbaikan' },
    { id: 'history', icon: History, label: 'History' },
  ];

  return (
    <aside className={`hidden md:flex md:flex-col bg-dark-card border-r border-dark-border h-screen sticky top-0 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b border-dark-border flex items-center justify-between ${isCollapsed ? 'flex-col gap-2' : ''}`}>
        {isCollapsed ? (
          <div className="text-center">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 mb-2 mx-auto" />
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Buka sidebar"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-blue-500">KeuanganApp</h1>
                <p className="text-xs text-gray-400 mt-1">Manajemen Keuangan Pribadi</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Tutup sidebar"
            >
              <ChevronLeft size={20} />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Export Button */}
      <div className="p-4 border-t border-dark-border">
        <button
          onClick={onExport}
          className={`w-full flex items-center gap-3 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Export Data' : ''}
        >
          <Download size={20} />
          {!isCollapsed && <span>Export Data</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
