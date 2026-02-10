import { Download, Upload } from 'lucide-react';
import { useState } from 'react';

const Header = ({ title, onExport }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="md:hidden bg-dark-card border-b border-dark-border p-4 flex items-center justify-between sticky top-0 z-40">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
      
      {/* Mobile Export/Import Button */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
        >
          <Download size={16} />
          <span>Data</span>
        </button>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            
            <div className="absolute right-0 top-12 bg-dark-card border border-dark-border rounded-lg shadow-lg py-2 w-48 z-20">
              <button
                onClick={() => {
                  onExport();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 hover:bg-gray-700 text-left flex items-center gap-3"
              >
                <Download size={18} className="text-green-400" />
                <div>
                  <div className="font-medium">Kelola Data</div>
                  <div className="text-xs text-gray-400">Export/Import</div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
