const FisikModel = require('./fisik.model');

const catatOlahraga = async (data) => {
    const result = await FisikModel.create(data);
    return {
        id: result.insertId,
        ...data
    };
};

const getRiwayatOlahraga = async (userId) => {
    return FisikModel.getByUser(userId);
};

module.exports = {
    catatOlahraga,
    getRiwayatOlahraga   // ← WAJIB ditambahkan!!
};
