// src/modules/fisik/fisik.model.js
const db = require('../../config/db'); // Import koneksi dari db.js

const FisikModel = {
    create: async (data) => {
        const { userId, jenisOlahraga, durasiMenit, kaloriTerbakar } = data;

        const query = `
            INSERT INTO fisik_olahraga (userId, jenisOlahraga, durasiMenit, kaloriTerbakar) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [userId, jenisOlahraga, durasiMenit, kaloriTerbakar]);
        return result;
    },

    getByUser: async (userId) => {
    const query = `SELECT * FROM fisik_olahraga WHERE userId = ? ORDER BY tanggal DESC`;
    const [rows] = await db.execute(query, [userId]);
    return rows;
}
};

module.exports = FisikModel;