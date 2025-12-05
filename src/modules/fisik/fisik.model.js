// src/modules/fisik/fisik.model.js
const db = require('../../config/db'); // Import koneksi dari db.js

const FisikModel = {
    // Fungsi untuk insert data ke tabel MySQL
    create: async (data) => {
        const { userId, jenisOlahraga, durasiMenit, kaloriTerbakar } = data;
        
        // Query SQL Manual
        const query = `
            INSERT INTO fisik_olahraga (userId, jenisOlahraga, durasiMenit, kaloriTerbakar) 
            VALUES (?, ?, ?, ?)
        `;

        // Jalankan query dengan parameter (tanda tanya diganti data)
        const [result] = await db.execute(query, [userId, jenisOlahraga, durasiMenit, kaloriTerbakar]);
        
        return result;
    }
};

module.exports = FisikModel;