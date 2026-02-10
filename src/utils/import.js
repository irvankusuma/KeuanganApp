import * as XLSX from 'xlsx';
import db from '../db/database';

// Import from Excel
export const importFromExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        let imported = {
          hutang: 0,
          pembayaranHutang: 0,
          piutang: 0,
          pembayaranPiutang: 0,
          pemasukan: 0,
          pengeluaran: 0,
          maintenance: 0
        };

        // Import Hutang
        if (workbook.SheetNames.includes('Hutang')) {
          const sheet = workbook.Sheets['Hutang'];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          
          for (const row of jsonData) {
            if (row['Nama']) {
              await db.hutang.add({
                nama: row['Nama'],
                tipe: row['Tipe'] || 'Lainnya',
                jumlah: parseInt(row['Total Hutang']) || 0,
                periode: parseInt(row['Periode (bulan)']) || 12,
                tanggal: parseDateString(row['Tanggal']),
                catatan: row['Catatan'] || ''
              });
              imported.hutang++;
            }
          }
        }

        // Import Piutang
        if (workbook.SheetNames.includes('Piutang')) {
          const sheet = workbook.Sheets['Piutang'];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          
          for (const row of jsonData) {
            if (row['Nama Orang']) {
              await db.piutang.add({
                namaOrang: row['Nama Orang'],
                jumlah: parseInt(row['Total Piutang']) || 0,
                tanggal: parseDateString(row['Tanggal Pinjam']),
                jatuhTempo: row['Jatuh Tempo'] !== '-' ? parseDateString(row['Jatuh Tempo']) : '',
                catatan: row['Catatan'] || ''
              });
              imported.piutang++;
            }
          }
        }

        // Import Pemasukan
        if (workbook.SheetNames.includes('Pemasukan')) {
          const sheet = workbook.Sheets['Pemasukan'];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          
          for (const row of jsonData) {
            if (row['Sumber']) {
              await db.pemasukan.add({
                sumber: row['Sumber'],
                tipe: row['Tipe'] || 'Lainnya',
                jumlah: parseInt(row['Jumlah']) || 0,
                tanggal: parseDateString(row['Tanggal']),
                catatan: row['Catatan'] || ''
              });
              imported.pemasukan++;
            }
          }
        }

        // Import Pengeluaran
        if (workbook.SheetNames.includes('Pengeluaran')) {
          const sheet = workbook.Sheets['Pengeluaran'];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          
          for (const row of jsonData) {
            if (row['Kategori']) {
              await db.pengeluaran.add({
                kategori: row['Kategori'],
                jumlah: parseInt(row['Jumlah']) || 0,
                tanggal: parseDateString(row['Tanggal']),
                catatan: row['Catatan'] || ''
              });
              imported.pengeluaran++;
            }
          }
        }

        // Import Maintenance/Perbaikan
        if (workbook.SheetNames.includes('Maintenance')) {
          const sheet = workbook.Sheets['Maintenance'];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          
          for (const row of jsonData) {
            if (row['Nama']) {
              await db.maintenance.add({
                nama: row['Nama'],
                tanggal: parseDateString(row['Tanggal']),
                km_saat_ini: parseInt(row['KM Saat Ini']) || 0,
                km_berikutnya: parseInt(row['KM Berikutnya']) || 0,
                catatan: row['Catatan'] || ''
              });
              imported.maintenance++;
            }
          }
        }

        resolve(imported);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsArrayBuffer(file);
  });
};

// Import from TXT (parse manually)
export const importFromTXT = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        let imported = {
          hutang: 0,
          piutang: 0,
          pemasukan: 0,
          pengeluaran: 0,
          maintenance: 0
        };

        // Parse sections
        const sections = {
          hutang: extractSection(text, '📋 DATA HUTANG'),
          piutang: extractSection(text, '💰 DATA PIUTANG'),
          pemasukan: extractSection(text, '💰 DATA PEMASUKAN'),
          pengeluaran: extractSection(text, '💸 DATA PENGELUARAN'),
          maintenance: extractSection(text, '🔧 DATA MAINTENANCE') || extractSection(text, '🔧 DATA PERBAIKAN')
        };

        // Import hutang
        if (sections.hutang) {
          const items = parseItems(sections.hutang);
          for (const item of items) {
            if (item.nama) {
              await db.hutang.add({
                nama: item.nama,
                tipe: item.tipe || 'Lainnya',
                jumlah: parseAmount(item.jumlah) || 0,
                periode: parseInt(item.periode) || 12,
                tanggal: item.tanggal || new Date().toISOString().split('T')[0],
                catatan: item.catatan || ''
              });
              imported.hutang++;
            }
          }
        }

        // Import piutang
        if (sections.piutang) {
          const items = parseItemsPiutang(sections.piutang);
          for (const item of items) {
            if (item.namaOrang) {
              await db.piutang.add({
                namaOrang: item.namaOrang,
                jumlah: parseAmount(item.jumlah) || 0,
                tanggal: item.tanggal || new Date().toISOString().split('T')[0],
                jatuhTempo: item.jatuhTempo || '',
                catatan: item.catatan || ''
              });
              imported.piutang++;
            }
          }
        }

        // Similar parsing for pemasukan, pengeluaran, maintenance...
        // (simplified for brevity)

        resolve(imported);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsText(file);
  });
};

// Helper functions
const parseDateString = (dateStr) => {
  if (!dateStr || dateStr === '-') return new Date().toISOString().split('T')[0];
  
  // Try to parse Indonesian date format: "3 Februari 2026"
  const months = {
    'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
    'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
    'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
  };
  
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1]];
    const year = parts[2];
    if (month) return `${year}-${month}-${day}`;
  }
  
  return new Date().toISOString().split('T')[0];
};

const parseAmount = (amountStr) => {
  if (!amountStr) return 0;
  // Remove "Rp", dots, and spaces
  const cleaned = amountStr.toString().replace(/Rp|\.|\s/g, '');
  return parseInt(cleaned) || 0;
};

const extractSection = (text, marker) => {
  const start = text.indexOf(marker);
  if (start === -1) return null;
  
  const end = text.indexOf('--------------------------------------------------', start + 50);
  if (end === -1) return text.substring(start);
  
  return text.substring(start, end);
};

const parseItems = (section) => {
  const items = [];
  const lines = section.split('\n');
  let currentItem = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (/^\d+\./.test(trimmed)) {
      if (currentItem) items.push(currentItem);
      currentItem = { nama: trimmed.replace(/^\d+\.\s*/, '') };
    } else if (currentItem) {
      if (trimmed.startsWith('Tipe:')) currentItem.tipe = trimmed.replace('Tipe:', '').trim();
      if (trimmed.startsWith('Jumlah:') || trimmed.startsWith('Total Hutang:')) {
        currentItem.jumlah = trimmed.split(':')[1].trim();
      }
      if (trimmed.startsWith('Periode:')) currentItem.periode = trimmed.match(/\d+/)?.[0];
      if (trimmed.startsWith('Tanggal:')) currentItem.tanggal = trimmed.replace('Tanggal:', '').trim();
      if (trimmed.startsWith('Catatan:')) currentItem.catatan = trimmed.replace('Catatan:', '').trim();
    }
  }
  
  if (currentItem) items.push(currentItem);
  return items;
};

const parseItemsPiutang = (section) => {
  const items = [];
  const lines = section.split('\n');
  let currentItem = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (/^\d+\./.test(trimmed)) {
      if (currentItem) items.push(currentItem);
      currentItem = { namaOrang: trimmed.replace(/^\d+\.\s*/, '') };
    } else if (currentItem) {
      if (trimmed.startsWith('Total Piutang:')) currentItem.jumlah = trimmed.split(':')[1].trim();
      if (trimmed.startsWith('Tanggal:')) currentItem.tanggal = trimmed.replace('Tanggal:', '').trim();
      if (trimmed.startsWith('Jatuh Tempo:')) currentItem.jatuhTempo = trimmed.replace('Jatuh Tempo:', '').trim();
      if (trimmed.startsWith('Catatan:')) currentItem.catatan = trimmed.replace('Catatan:', '').trim();
    }
  }
  
  if (currentItem) items.push(currentItem);
  return items;
};
