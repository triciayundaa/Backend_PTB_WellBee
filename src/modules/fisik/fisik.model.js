const db = require('../../config/db');

const FisikModel = {
    // ===================
    // SPORT
    // ===================
    createSport: async ({ userId, jenisOlahraga, durasiMenit, kaloriTerbakar, foto, tanggal }) => {
        const query = `
            INSERT INTO fisik_olahraga (userId, jenisOlahraga, durasiMenit, kaloriTerbakar, foto, tanggal)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [userId, jenisOlahraga, durasiMenit, kaloriTerbakar,foto, tanggal]);
        return result;
    },

    getSportByUser: async (userId) => {
        const [rows] = await db.execute(
            `SELECT * FROM fisik_olahraga WHERE userId = ? ORDER BY tanggal DESC`,
            [userId]
        );
        return rows;
    },
    deleteSport: async (id, userId) => {
    const [result] = await db.execute(
        `DELETE FROM fisik_olahraga WHERE id = ? AND userId = ?`,
        [id, userId]
    );
    return result;
},

updateSport: async (id, { jenisOlahraga, durasiMenit, kaloriTerbakar }) => {
    const query = `
        UPDATE fisik_olahraga
        SET jenisOlahraga = ?, durasiMenit = ?, kaloriTerbakar = ?
        WHERE id = ?
    `;
    const [result] = await db.execute(query, [
        jenisOlahraga,
        durasiMenit,
        kaloriTerbakar,
        id
    ]);
    return result;
},

    // ===================
    // SLEEP
    // ===================
    createSleep: async ({ userId, jamTidur, jamBangun, durasiTidur, kualitasTidur, tanggal }) => {
    const query = `
        INSERT INTO fisik_sleep (
            userId,
            jamTidur,
            jamBangun,
            durasiTidur,
            kualitasTidur,
            tanggal
        ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
        userId,
        jamTidur,
        jamBangun,
        durasiTidur,
        kualitasTidur,
        tanggal
    ]);

    return result;
},
    deleteSleep: async (id, userId) => {
    const [result] = await db.execute(
        `DELETE FROM fisik_sleep WHERE id = ? AND userId = ?`,
        [id, userId]
    );
    return result;
},
    updateSleep: async ({ id, userId, jamTidur, jamBangun, durasiTidur, kualitasTidur, tanggal }) => {
    const query = `
        UPDATE fisik_sleep
        SET jamTidur = ?, jamBangun = ?, durasiTidur = ?, kualitasTidur = ?, tanggal=?
        WHERE id = ? AND userId = ?
    `;

    const [result] = await db.execute(query, [
        jamTidur, jamBangun, durasiTidur, kualitasTidur, tanggal, id, userId
    ]);

    return result;
},

    getSleepByUser: async (userId) => {
    const [rows] = await db.execute(
        `SELECT * FROM fisik_sleep WHERE userId = ? ORDER BY tanggal DESC`,
        [userId]
    );
    return rows;
}, 

// ===================
// WEIGHT
// ===================
createWeight: async ({ userId, beratBadan, tinggiBadan, bmi, kategori, tanggal }) => {
  const query = `
    INSERT INTO fisik_weight
    (userId, beratBadan, tinggiBadan, bmi, kategori, tanggal)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.execute(query, [
    userId, beratBadan, tinggiBadan, bmi, kategori, tanggal
  ]);
  return result;
},

getWeightByUser: async (userId) => {
  const [rows] = await db.execute(
    `SELECT * FROM fisik_weight WHERE userId = ? ORDER BY tanggal DESC`,
    [userId]
  );
  return rows;
},

deleteWeight: async (id, userId) => {
  const [result] = await db.execute(
    `DELETE FROM fisik_weight WHERE id = ? AND userId = ?`,
    [id, userId]
  );
  return result;
},

updateWeight: async (id, data) => {
  const query = `
    UPDATE fisik_weight
    SET beratBadan=?, tinggiBadan=?, bmi=?, kategori=?, tanggal=?
    WHERE id=?
  `;
  const [result] = await db.execute(query, [
    data.beratBadan,
    data.tinggiBadan,
    data.bmi,
    data.kategori,
    data.tanggal,
    id
  ]);
  return result;
},
};
module.exports = FisikModel;
