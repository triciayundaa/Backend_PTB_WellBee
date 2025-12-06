const fisikService = require('./fisik.service');

// ===================
// SPORT
// ===================
const simpanOlahraga = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jenisOlahraga, durasiMenit, kaloriTerbakar } = req.body;

        const hasil = await fisikService.catatOlahraga({
            userId,
            jenisOlahraga,
            durasiMenit,
            kaloriTerbakar
        });

        res.status(201).json({ message: "Sport saved", data: hasil });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
};

const getRiwayatOlahraga = async (req, res) => {
    const userId = req.user.id;
    const data = await fisikService.getRiwayatOlahraga(userId);
    res.json(data);
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


// ===================
// SLEEP
// ===================
const simpanTidur = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jamTidur, jamBangun, durasiTidur, kualitasTidur } = req.body;

        const hasil = await fisikService.catatTidur({
            userId,
            jamTidur,
            jamBangun,
            durasiTidur,
            kualitasTidur
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

        const { jamTidur, jamBangun, durasiTidur, kualitasTidur } = req.body;

        const hasil = await fisikService.updateTidur({
            id: sleepId,
            userId,
            jamTidur,
            jamBangun,
            durasiTidur,
            kualitasTidur
        });

        res.status(200).json({ message: "Sleep updated", data: hasil });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    // SPORT
    simpanOlahraga,
    getRiwayatOlahraga,
    hapusOlahraga,
    updateOlahraga,

    // SLEEP
    simpanTidur,
    getRiwayatTidur,
    hapusTidur,
    updateTidur
};
