const db = require('../../config/db');

const FisikModel = {
    // ===================
    // SPORT
    // ===================
    createSport: async ({ userId, jenisOlahraga, durasiMenit, kaloriTerbakar }) => {
        const query = `
            INSERT INTO fisik_olahraga (userId, jenisOlahraga, durasiMenit, kaloriTerbakar)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [userId, jenisOlahraga, durasiMenit, kaloriTerbakar]);
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
    createSleep: async ({ userId, jamTidur, jamBangun, durasiTidur, kualitasTidur }) => {
    const query = `
        INSERT INTO fisik_sleep (
            userId,
            jamTidur,
            jamBangun,
            durasiTidur,
            kualitasTidur
        ) VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
        userId,
        jamTidur,
        jamBangun,
        durasiTidur,
        kualitasTidur
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
    updateSleep: async ({ id, userId, jamTidur, jamBangun, durasiTidur, kualitasTidur }) => {
    const query = `
        UPDATE fisik_sleep
        SET jamTidur = ?, jamBangun = ?, durasiTidur = ?, kualitasTidur = ?
        WHERE id = ? AND userId = ?
    `;

    const [result] = await db.execute(query, [
        jamTidur, jamBangun, durasiTidur, kualitasTidur, id, userId
    ]);

    return result;
},

    getSleepByUser: async (userId) => {
    const [rows] = await db.execute(
        `SELECT * FROM fisik_sleep WHERE userId = ? ORDER BY createdAt DESC`,
        [userId]
    );
    return rows;
}
};
module.exports = FisikModel;
