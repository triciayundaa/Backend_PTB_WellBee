const admin = require("firebase-admin");

// Kita arahkan ke file kunci yang tadi kamu taruh di folder src
// Tanda ".." artinya keluar dari folder config, lalu cari serviceAccountKey.json
const serviceAccount = require("../serviceAccountKey.json"); 

// Cek dulu: Kalau belum ada aplikasi firebase yang jalan, baru kita jalankan
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = admin;