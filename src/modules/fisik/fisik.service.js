const FisikModel = require('./fisik.model');

// Fungsi khusus untuk menyimpan data olahraga
const catatOlahraga = async (data) => {
    // 1. Simpan ke database via Model
    const result = await FisikModel.create(data);
    
    // 2. Gabungkan ID baru (dari MySQL) dengan data aslinya
    // result.insertId adalah ID unik yang baru saja dibuat oleh database
    return {
        id: result.insertId, 
        ...data 
    };
};

module.exports = {
    catatOlahraga
};