import * as XLSX from 'xlsx';
import { formatCurrency, formatDate } from './formatters';

// Export all data to TXT
export const exportToTXT = async (data) => {
  const { hutang, pemasukan, pengeluaran, maintenance, pembayaranHutang, piutang, pembayaranPiutang } = data;
  
  let txtContent = '='.repeat(50) + '\n';
  txtContent += 'EXPORT DATA KEUANGAN & MAINTENANCE\n';
  txtContent += `Tanggal Export: ${formatDate(new Date())}\n`;
  txtContent += '='.repeat(50) + '\n\n';

  // Hutang
  txtContent += '📋 DATA HUTANG\n';
  txtContent += '-'.repeat(50) + '\n';
  if (hutang.length > 0) {
    hutang.forEach((item, index) => {
      const payments = pembayaranHutang.filter(p => p.hutangId === item.id);
      const totalPaid = payments.reduce((sum, p) => sum + p.jumlah, 0);
      const remaining = item.jumlah - totalPaid;

      txtContent += `${index + 1}. ${item.nama}\n`;
      txtContent += `   Tipe: ${item.tipe}\n`;
      txtContent += `   Total Hutang: ${formatCurrency(item.jumlah)}\n`;
      txtContent += `   Total Dibayar: ${formatCurrency(totalPaid)}\n`;
      txtContent += `   Sisa Hutang: ${formatCurrency(remaining)}\n`;
      txtContent += `   Periode: ${item.periode} bulan\n`;
      txtContent += `   Tanggal: ${formatDate(item.tanggal)}\n`;
      if (item.catatan) txtContent += `   Catatan: ${item.catatan}\n`;
      
      if (payments.length > 0) {
        txtContent += `   Pembayaran (${payments.length}x):\n`;
        payments.forEach((payment, pIndex) => {
          txtContent += `     ${pIndex + 1}. ${formatCurrency(payment.jumlah)} - ${formatDate(payment.tanggal)}\n`;
          if (payment.catatan) txtContent += `        ${payment.catatan}\n`;
        });
      }
      txtContent += '\n';
    });
  } else {
    txtContent += 'Tidak ada data\n\n';
  }

  // Piutang
  txtContent += '💰 DATA PIUTANG (Orang Hutang ke Saya)\n';
  txtContent += '-'.repeat(50) + '\n';
  if (piutang && piutang.length > 0) {
    piutang.forEach((item, index) => {
      const payments = pembayaranPiutang.filter(p => p.piutangId === item.id);
      const totalPaid = payments.reduce((sum, p) => sum + p.jumlah, 0);
      const remaining = item.jumlah - totalPaid;

      txtContent += `${index + 1}. ${item.namaOrang}\n`;
      txtContent += `   Total Piutang: ${formatCurrency(item.jumlah)}\n`;
      txtContent += `   Total Diterima: ${formatCurrency(totalPaid)}\n`;
      txtContent += `   Sisa Piutang: ${formatCurrency(remaining)}\n`;
      txtContent += `   Tanggal: ${formatDate(item.tanggal)}\n`;
      if (item.jatuhTempo) txtContent += `   Jatuh Tempo: ${formatDate(item.jatuhTempo)}\n`;
      if (item.catatan) txtContent += `   Catatan: ${item.catatan}\n`;
      
      if (payments.length > 0) {
        txtContent += `   Pembayaran Diterima (${payments.length}x):\n`;
        payments.forEach((payment, pIndex) => {
          txtContent += `     ${pIndex + 1}. ${formatCurrency(payment.jumlah)} - ${formatDate(payment.tanggal)}\n`;
          if (payment.catatan) txtContent += `        ${payment.catatan}\n`;
        });
      }
      txtContent += '\n';
    });
  } else {
    txtContent += 'Tidak ada data\n\n';
  }

  // Pemasukan
  txtContent += '💰 DATA PEMASUKAN\n';
  txtContent += '-'.repeat(50) + '\n';
  if (pemasukan.length > 0) {
    pemasukan.forEach((item, index) => {
      txtContent += `${index + 1}. ${item.sumber}\n`;
      txtContent += `   Tipe: ${item.tipe}\n`;
      txtContent += `   Jumlah: ${formatCurrency(item.jumlah)}\n`;
      txtContent += `   Tanggal: ${formatDate(item.tanggal)}\n`;
      if (item.catatan) txtContent += `   Catatan: ${item.catatan}\n`;
      txtContent += '\n';
    });
  } else {
    txtContent += 'Tidak ada data\n\n';
  }

  // Pengeluaran
  txtContent += '💸 DATA PENGELUARAN\n';
  txtContent += '-'.repeat(50) + '\n';
  if (pengeluaran.length > 0) {
    pengeluaran.forEach((item, index) => {
      txtContent += `${index + 1}. ${item.kategori}\n`;
      txtContent += `   Jumlah: ${formatCurrency(item.jumlah)}\n`;
      txtContent += `   Tanggal: ${formatDate(item.tanggal)}\n`;
      if (item.catatan) txtContent += `   Catatan: ${item.catatan}\n`;
      txtContent += '\n';
    });
  } else {
    txtContent += 'Tidak ada data\n\n';
  }

  // Maintenance
  txtContent += '🔧 DATA MAINTENANCE\n';
  txtContent += '-'.repeat(50) + '\n';
  if (maintenance.length > 0) {
    maintenance.forEach((item, index) => {
      txtContent += `${index + 1}. ${item.nama}\n`;
      txtContent += `   Tanggal: ${formatDate(item.tanggal)}\n`;
      txtContent += `   KM Saat Ini: ${item.km_saat_ini} km\n`;
      txtContent += `   KM Berikutnya: ${item.km_berikutnya} km\n`;
      if (item.catatan) txtContent += `   Catatan: ${item.catatan}\n`;
      txtContent += '\n';
    });
  } else {
    txtContent += 'Tidak ada data\n\n';
  }

  // Download with format: KeuanganApp.DD-MM-YYYY_HH-MM-SS.txt
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const filename = `KeuanganApp.${day}-${month}-${year}_${hours}-${minutes}-${seconds}.txt`;

  const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export all data to Excel
export const exportToExcel = async (data) => {
  const { hutang, pemasukan, pengeluaran, maintenance, pembayaranHutang, piutang, pembayaranPiutang } = data;

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet: Hutang
  const hutangData = hutang.map(item => {
    const payments = pembayaranHutang.filter(p => p.hutangId === item.id);
    const totalPaid = payments.reduce((sum, p) => sum + p.jumlah, 0);
    const remaining = item.jumlah - totalPaid;

    return {
      'Nama': item.nama,
      'Tipe': item.tipe,
      'Total Hutang': item.jumlah,
      'Total Dibayar': totalPaid,
      'Sisa Hutang': remaining,
      'Status': remaining === 0 ? 'LUNAS' : 'BELUM LUNAS',
      'Periode (bulan)': item.periode,
      'Tanggal': formatDate(item.tanggal),
      'Catatan': item.catatan || '-'
    };
  });
  const wsHutang = XLSX.utils.json_to_sheet(hutangData);
  XLSX.utils.book_append_sheet(wb, wsHutang, 'Hutang');

  // Sheet: Pembayaran Hutang
  const pembayaranData = pembayaranHutang.map(payment => {
    const hutangItem = hutang.find(h => h.id === payment.hutangId);
    return {
      'Nama Hutang': hutangItem ? hutangItem.nama : 'Unknown',
      'Jumlah Bayar': payment.jumlah,
      'Tanggal Bayar': formatDate(payment.tanggal),
      'Catatan': payment.catatan || '-'
    };
  });
  const wsPembayaran = XLSX.utils.json_to_sheet(pembayaranData);
  XLSX.utils.book_append_sheet(wb, wsPembayaran, 'Pembayaran Hutang');

  // Sheet: Piutang
  const piutangData = (piutang || []).map(item => {
    const payments = (pembayaranPiutang || []).filter(p => p.piutangId === item.id);
    const totalPaid = payments.reduce((sum, p) => sum + p.jumlah, 0);
    const remaining = item.jumlah - totalPaid;

    return {
      'Nama Orang': item.namaOrang,
      'Total Piutang': item.jumlah,
      'Total Diterima': totalPaid,
      'Sisa Piutang': remaining,
      'Status': remaining === 0 ? 'LUNAS' : 'BELUM LUNAS',
      'Tanggal Pinjam': formatDate(item.tanggal),
      'Jatuh Tempo': item.jatuhTempo ? formatDate(item.jatuhTempo) : '-',
      'Catatan': item.catatan || '-'
    };
  });
  const wsPiutang = XLSX.utils.json_to_sheet(piutangData);
  XLSX.utils.book_append_sheet(wb, wsPiutang, 'Piutang');

  // Sheet: Pembayaran Piutang
  const pembayaranPiutangData = (pembayaranPiutang || []).map(payment => {
    const piutangItem = (piutang || []).find(p => p.id === payment.piutangId);
    return {
      'Nama Orang': piutangItem ? piutangItem.namaOrang : 'Unknown',
      'Jumlah Diterima': payment.jumlah,
      'Tanggal Terima': formatDate(payment.tanggal),
      'Catatan': payment.catatan || '-'
    };
  });
  const wsPembayaranPiutang = XLSX.utils.json_to_sheet(pembayaranPiutangData);
  XLSX.utils.book_append_sheet(wb, wsPembayaranPiutang, 'Pembayaran Piutang');

  // Sheet: Pemasukan
  const pemasukanData = pemasukan.map(item => ({
    'Sumber': item.sumber,
    'Tipe': item.tipe,
    'Jumlah': item.jumlah,
    'Tanggal': formatDate(item.tanggal),
    'Catatan': item.catatan || '-'
  }));
  const wsPemasukan = XLSX.utils.json_to_sheet(pemasukanData);
  XLSX.utils.book_append_sheet(wb, wsPemasukan, 'Pemasukan');

  // Sheet: Pengeluaran
  const pengeluaranData = pengeluaran.map(item => ({
    'Kategori': item.kategori,
    'Jumlah': item.jumlah,
    'Tanggal': formatDate(item.tanggal),
    'Catatan': item.catatan || '-'
  }));
  const wsPengeluaran = XLSX.utils.json_to_sheet(pengeluaranData);
  XLSX.utils.book_append_sheet(wb, wsPengeluaran, 'Pengeluaran');

  // Sheet: Maintenance
  const maintenanceData = maintenance.map(item => ({
    'Nama': item.nama,
    'Tanggal': formatDate(item.tanggal),
    'KM Saat Ini': item.km_saat_ini,
    'KM Berikutnya': item.km_berikutnya,
    'Catatan': item.catatan || '-'
  }));
  const wsMaintenance = XLSX.utils.json_to_sheet(maintenanceData);
  XLSX.utils.book_append_sheet(wb, wsMaintenance, 'Maintenance');

  // Download with format: KeuanganApp.DD-MM-YYYY_HH-MM-SS.xlsx
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const filename = `KeuanganApp.${day}-${month}-${year}_${hours}-${minutes}-${seconds}.xlsx`;

  XLSX.writeFile(wb, filename);
};
