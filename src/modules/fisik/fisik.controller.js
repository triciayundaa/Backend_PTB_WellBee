const fisikService = require('./fisik.service');

// === TAMBAHAN IMPORTS (WAJIB ADA) ===
const db = require('../../config/db');       // Buat ambil Token dari Database
const admin = require('../../config/firebase'); // Buat kirim Notifikasi
// ====================================

// === FUNGSI UPDATE TOKEN (VERSI DEBUG) ===
const updateFcmToken = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fcm_token } = req.body;

        // 🔍 CCTV 1: Cek apakah data sampai ke sini?
        console.log("=================================");
        console.log("🔥 REQUEST MASUK: UPDATE TOKEN 🔥");
        console.log("👤 User ID:", userId);
        console.log("🎫 Token dari HP:", fcm_token); 

        if (!fcm_token) {
            console.log("❌ BAHAYA: Token Kosong/Undefined!");
            return res.status(400).json({ message: "Token tidak boleh kosong" });
        }

        // 🔍 CCTV 2: Eksekusi Database
        // Kita pakai db.execute atau db.query tanpa [rows] dulu biar aman
        // Pastikan await ada biar dia nunggu sampai selesai
        await db.query(
            'UPDATE users SET fcm_token = ? WHERE id = ?', 
            [fcm_token, userId]
        );

        console.log("✅ Database Berhasil Diupdate!");
        console.log("=================================");

        res.json({ message: "Token HP berhasil diupdate!" });
    } catch (e) {
        console.log("❌ ERROR PARAH:", e);
        res.status(500).json({ message: "Server error" });
    }
};

// ===================
// SPORT
// ===================
const simpanOlahraga = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jenisOlahraga, durasiMenit, kaloriTerbakar, foto, tanggal } = req.body;

        // 1. SIMPAN DATA OLAHRAGA (LOGIKA LAMA)
        const hasil = await fisikService.catatOlahraga({
            userId,
            jenisOlahraga,
            durasiMenit,
            kaloriTerbakar,
            foto,
            tanggal
        });

        // ============================================================
        // 2. LOGIKA NOTIFIKASI + NAVIGASI (BARU)
        // ============================================================
        try {
            // PERBAIKAN: HAPUS .promise()
            // Cukup db.query atau db.execute (tergantung db.js kamu)
            // Kita coba hapus .promise() dulu:
            const [users] = await db.query(
                'SELECT fcm_token FROM users WHERE id = ?', 
                [userId]
            );

            // B. Cek Token
            if (users.length > 0 && users[0].fcm_token) {
                const tokenHP = users[0].fcm_token;

                // C. Kirim Notif dengan "DATA NAVIGASI"
                await admin.messaging().send({
                    token: tokenHP,
                    notification: {
                        title: "Kerja Bagus! 🔥",
                        body: `Mantap! Kamu sudah olahraga ${jenisOlahraga} selama ${durasiMenit} menit.`
                    },
                    data: {
                        target_screen: "physical_health", // Kode rahasia
                        click_action: "FLUTTER_NOTIFICATION_CLICK" 
                    }
                });
                console.log("✅ Notifikasi Olahraga Terkirim ke:", tokenHP);
            }
        } catch (notifError) {
            console.log("⚠️ Gagal kirim notif:", notifError.message);
        }
        // ============================================================

        res.status(201).json({ message: "Sport saved", data: hasil });
    } catch (e) {
        console.error(e); // Tambahkan log error biar gampang debugging
        res.status(500).json({ message: "Server error" });
    }
};

// ... (KODINGAN KE BAWAHNYA BIARKAN SAMA SEPERTI YANG LAMA: getRiwayatOlahraga, Sleep, Weight, dll) ...

const getRiwayatOlahraga = async (req, res) => {
    const userId = req.user.id;

    const rows = await fisikService.getRiwayatOlahraga(userId);

    const formatted = rows.map(row => ({
        id: row.id,
        userId: row.userId,
        jenisOlahraga: row.jenisOlahraga,
        durasiMenit: row.durasiMenit,
        kaloriTerbakar: row.kaloriTerbakar,
        tanggal: row.tanggal,      // ← FIX MUNCUL TANGGAL
        foto: row.foto
    }));

    res.json(formatted);
};

const hapusOlahraga = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        await fisikService.hapusOlahraga(id, userId);

        res.json({ message: "Sport deleted", id });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateOlahraga = async (req, res) => {
    try {
        const id = req.params.id;
        const { jenisOlahraga, durasiMenit, kaloriTerbakar } = req.body;

        const hasil = await fisikService.updateOlahraga(id, {
            jenisOlahraga,
            durasiMenit,
            kaloriTerbakar
        });

        res.json({ message: "Sport updated", data: hasil });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
};

const getWeeklySport = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await fisikService.getWeeklySport(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===================
// SLEEP
// ===================
const simpanTidur = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jamTidur, jamBangun, durasiTidur, kualitasTidur, tanggal } = req.body;

        const hasil = await fisikService.catatTidur({
            userId,
            jamTidur,
            jamBangun,
            durasiTidur,
            kualitasTidur,
            tanggal
        });

        res.status(201).json({ message: "Sleep saved", data: hasil });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
};

const getRiwayatTidur = async (req, res) => {
    const userId = req.user.id;
    const data = await fisikService.getRiwayatTidur(userId);
    res.json(data);
};

const hapusTidur = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const hasil = await fisikService.hapusTidur(id, userId);

        res.json({ message: "Sleep deleted", id });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateTidur = async (req, res) => {
    try {
        const userId = req.user.id;
        const sleepId = req.params.id;

        const { jamTidur, jamBangun, durasiTidur, kualitasTidur, tanggal } = req.body;

        const hasil = await fisikService.updateTidur({
            id: sleepId,
            userId,
            jamTidur,
            jamBangun,
            durasiTidur,
            kualitasTidur,
            tanggal
        });

        res.status(200).json({ message: "Sleep updated", data: hasil });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
};

const getWeeklySleep = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await fisikService.getWeeklySleep(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===================
// WEIGHT
// ===================
const simpanWeight = async (req, res) => {
  try {
    const userId = req.user.id;
    const { beratBadan, tinggiBadan, bmi, kategori, tanggal } = req.body;

    const hasil = await fisikService.catatWeight({
      userId, beratBadan, tinggiBadan, bmi, kategori, tanggal
    });

    res.status(201).json({ message: "Weight saved", data: hasil });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

const getRiwayatWeight = async (req, res) => {
  const userId = req.user.id;
  const data = await fisikService.getRiwayatWeight(userId);
  res.json(data);
};

const hapusWeight = async (req, res) => {
  await fisikService.hapusWeight(req.params.id, req.user.id);
  res.json({ message: "Weight deleted" });
};

const updateWeight = async (req, res) => {
  const hasil = await fisikService.updateWeight(req.params.id, req.body);
  res.json({ message: "Weight updated", data: hasil });
};

module.exports = {
    // SPORT
    simpanOlahraga,
    getRiwayatOlahraga,
    hapusOlahraga,
    updateOlahraga,
    getWeeklySport,
    updateFcmToken,

    // SLEEP
    simpanTidur,
    getRiwayatTidur,
    hapusTidur,
    updateTidur,
    getWeeklySleep,

    // WEIGHT
    simpanWeight,
    getRiwayatWeight,
    hapusWeight,
    updateWeight
};
