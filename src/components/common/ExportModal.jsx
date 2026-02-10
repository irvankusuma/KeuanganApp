import { X, FileText, FileSpreadsheet, Upload, Download } from 'lucide-react';
import { useState } from 'react';

const ImportExportModal = ({ isOpen, onClose, onExportTXT, onExportExcel, onImport }) => {
  const [activeTab, setActiveTab] = useState('export'); // 'export' or 'import'
  const [importing, setImporting] = useState(false);

  if (!isOpen) return null;

  const handleFileImport = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      await onImport(file, type);
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      alert('Gagal import data: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Kelola Data</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'export'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Download size={16} className="inline mr-2" />
            Export
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'import'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Upload size={16} className="inline mr-2" />
            Import
          </button>
        </div>

        {/* Export Tab */}
        {activeTab === 'export' && (
          <>
            <p className="text-gray-400 text-sm mb-6">
              Pilih format file untuk mengekspor semua data Anda
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  onExportTXT();
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <FileText size={24} />
                <div className="text-left">
                  <div className="font-medium">Export ke TXT</div>
                  <div className="text-xs text-gray-400">File teks sederhana</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onExportExcel();
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-4 bg-green-700 hover:bg-green-600 rounded-lg transition-colors"
              >
                <FileSpreadsheet size={24} />
                <div className="text-left">
                  <div className="font-medium">Export ke Excel</div>
                  <div className="text-xs text-gray-400">Spreadsheet (.xlsx)</div>
                </div>
              </button>
            </div>
          </>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <>
            <div className="bg-orange-600/20 border border-orange-500 rounded-lg p-3 mb-6">
              <p className="text-xs text-orange-300">
                <strong>⚠️ Perhatian:</strong> Import akan menambahkan data baru. Data yang sudah ada tidak akan dihapus.
              </p>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              Pilih file backup untuk mengimport data
            </p>

            <div className="space-y-3">
              <label className="w-full flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
                <FileText size={24} />
                <div className="text-left flex-1">
                  <div className="font-medium">Import dari TXT</div>
                  <div className="text-xs text-gray-400">File hasil export TXT</div>
                </div>
                <input
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleFileImport(e, 'txt')}
                  className="hidden"
                  disabled={importing}
                />
              </label>

              <label className="w-full flex items-center gap-3 p-4 bg-green-700 hover:bg-green-600 rounded-lg transition-colors cursor-pointer">
                <FileSpreadsheet size={24} />
                <div className="text-left flex-1">
                  <div className="font-medium">Import dari Excel</div>
                  <div className="text-xs text-gray-400">File hasil export Excel (.xlsx)</div>
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => handleFileImport(e, 'excel')}
                  className="hidden"
                  disabled={importing}
                />
              </label>
            </div>

            {importing && (
              <div className="mt-4 text-center text-blue-400">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mb-2"></div>
                <p className="text-sm">Mengimport data...</p>
              </div>
            )}
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default ImportExportModal;
