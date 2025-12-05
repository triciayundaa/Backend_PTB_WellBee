// src/modules/edukasi/edukasi.model.js
const pool = require('../../config/db');

async function query(sql, params = []) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(sql, params);
    return result;
  } finally {
    connection.release();
  }
}

/** ARTIKEL PUBLIK (static + user uploaded) */
async function getPublicArticles() {
  return query(`
    SELECT 
      id,
      judul,
      isi,
      kategori,
      waktu_baca AS waktuBaca,
      tag,
      gambar_url AS gambarUrl,   
      tanggal,
      'static' AS jenis,
      NULL AS userId
    FROM edukasi_artikel

    UNION ALL

    SELECT
      id,
      judul,
      isi,
      kategori,
      waktu_baca AS waktuBaca,
      tag,
      gambar_url AS gambarUrl,   
      tanggal_upload AS tanggal,
      'user' AS jenis,
      userId
    FROM user_artikel
    WHERE status = 'uploaded'
    ORDER BY tanggal DESC
  `);
}

/** ARTIKEL MILIK USER */
async function getUserArticles(userId) {
  return query(
    `
      SELECT
        id,
        judul,
        isi,
        kategori,
        waktu_baca AS waktuBaca,
        tag,
        gambar_url AS gambarUrl,    
        status,
        tanggal_upload AS tanggalUpload,
        createdAt,
        updatedAt
      FROM user_artikel
      WHERE userId = ?
      ORDER BY createdAt DESC
    `,
    [userId]
  );
}

async function getUserArticleById(articleId, userId) {
  const rows = await query(
    `
      SELECT
        id,
        judul,
        isi,
        kategori,
        waktu_baca AS waktuBaca,
        tag,
        gambar_url AS gambarUrl,      -- 🔹 ikutkan gambar
        status,
        tanggal_upload AS tanggalUpload,
        createdAt,
        updatedAt
      FROM user_artikel
      WHERE id = ? AND userId = ?
    `,
    [articleId, userId]
  );
  return rows[0] || null;
}

async function insertUserArticle({
  userId,
  title,
  content,
  category,
  readTime,
  tag,
  status,
  tanggalUpload,
  gambarUrl = null
}) {
  const result = await query(
    `
      INSERT INTO user_artikel
        (userId, judul, isi, kategori, waktu_baca, tag, status, tanggal_upload, gambar_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [userId, title, content, category, readTime, tag, status, tanggalUpload, gambarUrl]
  );
  return result.insertId;
}

async function updateUserArticle({
  articleId,
  userId,
  title,
  content,
  category,
  readTime,
  tag,
  gambarUrl = null
}) {
  return query(
    `
      UPDATE user_artikel
      SET judul = ?, isi = ?, kategori = ?, waktu_baca = ?, tag = ?, gambar_url = ?
      WHERE id = ? AND userId = ?
    `,
    [title, content, category, readTime, tag, gambarUrl, articleId, userId]
  );
}

async function updateUserArticleStatus({ articleId, userId, status, tanggalUpload }) {
  return query(
    `
      UPDATE user_artikel
      SET status = ?, tanggal_upload = ?
      WHERE id = ? AND userId = ?
    `,
    [status, tanggalUpload, articleId, userId]
  );
}

/** BOOKMARKS */
async function getBookmarks(userId) {
  return query(
    `
    SELECT
      b.id AS bookmarkId,
      b.artikelId,
      b.jenis,
      b.sudah_dibaca,
      b.createdAt,
      a.judul,
      a.isi,
      a.kategori,
      a.waktu_baca AS waktuBaca,
      a.tag,
      a.gambar_url AS gambarUrl,   -- 🔹 gambar untuk artikel static
      a.tanggal,
      NULL AS userId
    FROM edukasi_bookmark b
    JOIN edukasi_artikel a ON b.artikelId = a.id
    WHERE b.userId = ? AND b.jenis = 'static'

    UNION ALL

    SELECT
      b.id AS bookmarkId,
      b.artikelId,
      b.jenis,
      b.sudah_dibaca,
      b.createdAt,
      u.judul,
      u.isi,
      u.kategori,
      u.waktu_baca AS waktuBaca,
      u.tag,
      u.gambar_url AS gambarUrl,   -- 🔹 gambar untuk artikel user
      u.tanggal_upload AS tanggal,
      u.userId
    FROM edukasi_bookmark b
    JOIN user_artikel u ON b.artikelId = u.id
    WHERE b.userId = ? AND b.jenis = 'user'
    ORDER BY createdAt DESC
    `,
    [userId, userId]
  );
}

async function findBookmark(userId, artikelId, jenis) {
  const rows = await query(
    `
      SELECT id
      FROM edukasi_bookmark
      WHERE userId = ? AND artikelId = ? AND jenis = ?
    `,
    [userId, artikelId, jenis]
  );
  return rows[0] || null;
}

async function insertBookmark(userId, artikelId, jenis) {
  return query(
    `
      INSERT INTO edukasi_bookmark (userId, artikelId, jenis)
      VALUES (?, ?, ?)
    `,
    [userId, artikelId, jenis]
  );
}

async function deleteBookmark(userId, bookmarkId) {
  return query(
    `
      DELETE FROM edukasi_bookmark
      WHERE id = ? AND userId = ?
    `,
    [bookmarkId, userId]
  );
}

async function markBookmarkRead(userId, bookmarkId) {
  return query(
    `
      UPDATE edukasi_bookmark
      SET sudah_dibaca = 1
      WHERE id = ? AND userId = ?
    `, 
    [bookmarkId, userId]
  );
}

module.exports = {
  getPublicArticles,
  getUserArticles,
  getUserArticleById,
  insertUserArticle,
  updateUserArticle,
  updateUserArticleStatus,
  getBookmarks,
  findBookmark,
  insertBookmark,
  deleteBookmark,
  markBookmarkRead
};
