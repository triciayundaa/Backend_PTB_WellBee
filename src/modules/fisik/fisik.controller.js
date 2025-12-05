const fisikService = require('./fisik.service');

const simpanOlahraga = async (req, res) => {
    try {
        // Ambil userId dari token JWT (req.user.id), bukan dari req.body
        const userId = req.user.id;
        const { jenisOlahraga, durasiMenit, kaloriTerbakar } = req.body;

        if (!jenisOlahraga || !durasiMenit) {
            return res.status(400).json({
                status: 'fail',
                message: 'Jenis olahraga dan durasi harus diisi!'
            });
        }

        const hasil = await fisikService.catatOlahraga({
            userId,
            jenisOlahraga,
            durasiMenit,
            kaloriTerbakar
        });

        res.status(201).json({
            status: 'success',
            message: 'Data olahraga berhasil disimpan',
            data: hasil
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan di server'
        });
    }
};

const getRiwayatOlahraga = async (req, res) => {
    try {
        // Ambil userId dari token JWT untuk keamanan
        const userId = req.user.id;   
        console.log("== REQUEST RIWAYAT USER ==", userId); // DEBUG

        const data = await fisikService.getRiwayatOlahraga(userId);

        console.log("== DATA DIAMBIL ==", data); // DEBUG

        res.json(data);
    } catch (err) {
        console.error("== ERROR GET RIWAYAT ==", err);
        res.status(500).json({ message: "Gagal mengambil riwayat" });
    }
};


module.exports = {
    simpanOlahraga,
    getRiwayatOlahraga
};
