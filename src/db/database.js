import Dexie from 'dexie';

export const db = new Dexie('KeuanganApp');

// Define database schema
db.version(1).stores({
  hutang: '++id, nama, tipe, jumlah, periode, tanggal, catatan',
  pembayaranHutang: '++id, hutangId, jumlah, tanggal, catatan',
  piutang: '++id, namaOrang, jumlah, tanggal, jatuhTempo, catatan',
  pembayaranPiutang: '++id, piutangId, jumlah, tanggal, catatan',
  pemasukan: '++id, sumber, tipe, jumlah, tanggal, catatan',
  pengeluaran: '++id, kategori, jumlah, tanggal, catatan',
  maintenance: '++id, nama, tanggal, km_saat_ini, km_berikutnya, catatan',
  tipeHutang: '++id, nama',
  tipePemasukan: '++id, nama',
  kategoriPengeluaran: '++id, nama'
});

// Version 2: Add biaya field to maintenance
db.version(2).stores({
  maintenance: '++id, nama, tanggal, km_saat_ini, km_berikutnya, biaya, catatan'
}).upgrade(tx => {
  // Migrate existing data to add biaya field (default 0)
  return tx.table('maintenance').toCollection().modify(item => {
    if (!item.biaya) {
      item.biaya = 0;
    }
  });
});

// Default categories/types
db.on('populate', async () => {
  // Default tipe hutang
  await db.tipeHutang.bulkAdd([
    { nama: 'Pribadi' },
    { nama: 'Kredit' },
    { nama: 'Pinjaman Bank' },
    { nama: 'Cicilan' }
  ]);

  // Default tipe pemasukan
  await db.tipePemasukan.bulkAdd([
    { nama: 'Gaji' },
    { nama: 'Bonus' },
    { nama: 'Freelance' },
    { nama: 'Investasi' },
    { nama: 'Pembayaran Piutang' }, // For auto-relation
    { nama: 'Lainnya' }
  ]);

  // Default kategori pengeluaran
  await db.kategoriPengeluaran.bulkAdd([
    { nama: 'Makanan & Minuman' },
    { nama: 'Transportasi' },
    { nama: 'Belanja' },
    { nama: 'Hiburan' },
    { nama: 'Tagihan' },
    { nama: 'Kesehatan' },
    { nama: 'Pendidikan' },
    { nama: 'Pembayaran Hutang' }, // For auto-relation
    { nama: 'Perbaikan Kendaraan' }, // For auto-relation
    { nama: 'Lainnya' }
  ]);
});

export default db;
