import { Home, DollarSign, TrendingDown, TrendingUp, Coins, Wrench, History } from 'lucide-react';

const BottomNav = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Beranda' },
    { id: 'hutang', icon: DollarSign, label: 'Hutang' },
    { id: 'piutang', icon: Coins, label: 'Piutang' },
    { id: 'pemasukan', icon: TrendingUp, label: 'Masuk' },
    { id: 'pengeluaran', icon: TrendingDown, label: 'Keluar' },
    { id: 'perbaikan', icon: Wrench, label: 'Perbaiki' },
    { id: 'history', icon: History, label: 'History' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border z-50 md:hidden safe-bottom">
      <div className="grid grid-cols-7 h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center transition-colors ${
                isActive
                  ? 'text-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon size={16} />
              <span className="text-[9px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
