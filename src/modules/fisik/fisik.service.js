const FisikModel = require('./fisik.model');

// SPORT
const catatOlahraga = async (data) => {
    const result = await FisikModel.createSport(data);
    return { id: result.insertId, ...data };
};

const getRiwayatOlahraga = (userId) => FisikModel.getSportByUser(userId);

const hapusOlahraga = async (id, userId) => {
    return FisikModel.deleteSport(id, userId);
};

const updateOlahraga = async (id, data) => {
    return await FisikModel.updateSport(id, data);
};

const fisikModel = require("./fisik.model");
const dayjs = require("dayjs");
require("dayjs/locale/id");

const getWeeklySport = async (userId) => {
    // 1. Ambil tanggal hari ini
    const curr = new Date(); 
    
    // 2. Hitung mundur ke hari Senin terdekat
    // getDay(): 0 = Minggu, 1 = Senin, ... 6 = Sabtu
    const day = curr.getDay(); 
    
    // Jika hari ini Minggu (0), kita mundur 6 hari agar dapat Senin minggu ini
    // Jika hari ini Senin (1), mundur 0 hari.
    // Rumus: curr.getDate() - day + (day === 0 ? -6 : 1)
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    
    // Buat objek Date untuk Senin
    const monday = new Date(curr.setDate(diff));
    
    // Buat objek Date untuk Minggu (Senin + 6 hari)
    // Kita clone dulu 'monday' agar tidak mengubah referensi aslinya
    const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));

    // 3. Fungsi Helper untuk format YYYY-MM-DD (Manual string agar aman dari Timezone)
    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    const start = formatDate(monday);
    const end = formatDate(sunday);

    // 🔍 LOG DEBUG: Cek Terminal VS Code Anda setelah refresh aplikasi
    console.log("========================================");
    console.log("🔍 DEBUG WEEKLY CHART");
    console.log(`👤 User ID: ${userId}`);
    console.log(`📅 Range  : ${start} s/d ${end}`);
    console.log("========================================");

    // 4. Panggil Model
    const rows = await FisikModel.getSportByRange(userId, start, end);
    
    console.log("📊 Data Row dari DB:", rows);

    // 5. Mapping Data
    const labels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const values = Array(7).fill(0);

    rows.forEach(r => {
        // MySQL WEEKDAY(): 0=Senin, 1=Selasa ... 6=Minggu
        const idx = Number(r.wd);
        if (idx >= 0 && idx <= 6) {
            values[idx] = Number(r.total);
        }
    });

    return { 
        labels, 
        values, 
        rangeText: `${start} - ${end}` // Tampilkan format sederhana
    };
};

// SLEEP
const catatTidur = async (data) => {
    const result = await FisikModel.createSleep(data);
    return { id: result.insertId, ...data };
};

const getRiwayatTidur = (userId) => FisikModel.getSleepByUser(userId);

const hapusTidur = async (id, userId) => {
    return FisikModel.deleteSleep(id, userId);
};

const updateTidur = async (data) => {
    const result = await FisikModel.updateSleep(data);
    return { id: data.id, ...data };
};

const getWeeklySleep = async (userId) => {
    const curr = new Date();
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(curr.setDate(diff));
    const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    };

    const start = formatDate(monday);
    const end = formatDate(sunday);

    console.log(`💤 WEEKLY SLEEP: ${start} - ${end}`);

    // Panggil Model Sleep
    const rows = await FisikModel.getSleepByRange(userId, start, end);

    const labels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const values = Array(7).fill(0.0); // Default 0.0

    rows.forEach(r => {
        const idx = Number(r.wd);
        if (idx >= 0 && idx <= 6) {
            // Ambil rata-rata durasi tidur, bulatkan 1 desimal
            values[idx] = parseFloat(Number(r.avg_durasi).toFixed(1));
        }
    });

    return { 
        labels, 
        values, 
        rangeText: `${start} - ${end}` 
    };
};

// WEIGHT
const catatWeight = async (data) => {
  const result = await FisikModel.createWeight(data);
  return { id: result.insertId, ...data };
};

const getRiwayatWeight = (userId) => FisikModel.getWeightByUser(userId);
const hapusWeight = (id, userId) => FisikModel.deleteWeight(id, userId);
const updateWeight = (id, data) => FisikModel.updateWeight(id, data);

module.exports = {
    catatOlahraga,
    getRiwayatOlahraga,
    hapusOlahraga,
    updateOlahraga,
    getWeeklySport,

    catatTidur,
    getRiwayatTidur,
    hapusTidur,
    updateTidur,
    getWeeklySleep,

    // WEIGHT  ⬅⬅⬅ TAMBAHKAN INI
    catatWeight,
    getRiwayatWeight,
    hapusWeight,
    updateWeight
};
