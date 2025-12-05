const fisikService = require('./fisik.service');

const simpanOlahraga = async (req, res) => {
    try {
        // 1. Terima data dari Android
        const { userId, jenisOlahraga, durasiMenit, kaloriTerbakar } = req.body;

        // 2. Cek apakah data lengkap (Validasi sederhana)
        if (!jenisOlahraga || !durasiMenit) {
            return res.status(400).json({
                status: 'fail',
                message: 'Jenis olahraga dan durasi harus diisi!'
            });
        }

        // 3. Panggil Service
        const hasil = await fisikService.catatOlahraga({
            userId,
            jenisOlahraga,
            durasiMenit,
            kaloriTerbakar
        });

        // 4. Kirim balasan sukses ke Android
        res.status(201).json({
            status: 'success',
            message: 'Data olahraga berhasil disimpan',
            data: hasil
        });

    } catch (error) {
        console.error("Error simpan olahraga:", error);
        res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan di server'
        });
    }
};

module.exports = {
    simpanOlahraga
};