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

    catatTidur,
    getRiwayatTidur,
    hapusTidur,
    updateTidur,

    // WEIGHT  ⬅⬅⬅ TAMBAHKAN INI
    catatWeight,
    getRiwayatWeight,
    hapusWeight,
    updateWeight
};
