// src/modules/edukasi/edukasi.model.js
const pool = require('../../config/db');

async function query(sql, params = []) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}

/* =====================================================================
 *  ARTIKEL PUBLIK (static + user uploaded)
 * ===================================================================== */
async function getPublicArticles() {
  return query(`
    SELECT 
      a.id,
      a.judul,
      a.isi,
      a.kategori,
      a.waktu_baca   AS waktuBaca,
      a.tag,
      a.gambar_url   AS gambarUrl,
      a.tanggal,
      NULL           AS authorName,   
      'static'       AS jenis,
      NULL           AS userId
    FROM edukasi_artikel a

    UNION ALL

    SELECT
      ua.id,
      ua.judul,
      ua.isi,
      ua.kategori,
      ua.waktu_baca      AS waktuBaca,
      ua.tag,
      ua.gambar_url      AS gambarUrl,
      ua.tanggal_upload  AS tanggal,
      u.username         AS authorName, 
      'user'             AS jenis,
      ua.userId          AS userId
    FROM user_artikel ua
    JOIN users u ON ua.userId = u.id
    WHERE ua.status = 'uploaded'

    ORDER BY tanggal DESC
  `);
}

/* =====================================================================
 *  ARTIKEL MILIK USER
 * ===================================================================== */
/* =====================================================================
 *  ARTIKEL MILIK USER
 *  kirim juga authorName (username di tabel users)
 * ===================================================================== */
async function getUserArticles(userId) {
  return query(
    `
      SELECT
        ua.id,
        ua.judul,
        ua.isi,
        ua.kategori,
        ua.waktu_baca      AS waktuBaca,
        ua.tag,
        ua.gambar_url      AS gambarUrl,
        ua.status,
        ua.tanggal_upload  AS tanggalUpload,
        u.username         AS authorName
      FROM user_artikel ua
      JOIN users u ON ua.userId = u.id
      WHERE ua.userId = ?
      ORDER BY ua.tanggal_upload DESC, ua.id DESC
    `,
    [userId]
  );
}

async function getUserArticleById(articleId, userId) {
  const rows = await query(
    `
      SELECT
        ua.id,
        ua.judul,
        ua.isi,
        ua.kategori,
        ua.waktu_baca      AS waktuBaca,
        ua.tag,
        ua.gambar_url      AS gambarUrl,
        ua.status,
        ua.tanggal_upload  AS tanggalUpload,
        u.username         AS authorName
      FROM user_artikel ua
      JOIN users u ON ua.userId = u.id
      WHERE ua.id = ? AND ua.userId = ?
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
        (userId, judul, isi, kategori, waktu_baca, tag, gambar_url, status, tanggal_upload)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [userId, title, content, category, readTime, tag, gambarUrl, status, tanggalUpload]
  );
  return result.insertId;
}

/**
 * Update artikel user secara dinamis (judul/isi/kategori/dll)
 * data datang dari service: { title, content, category, read_time, tag, gambar_url }
 */
async function updateUserArticle(userId, articleId, data) {
  const fields = [];
  const values = [];

  if (data.title !== undefined) {
    fields.push('judul = ?');
    values.push(data.title);
  }
  if (data.content !== undefined) {
    fields.push('isi = ?');
    values.push(data.content);
  }
  if (data.category !== undefined) {
    fields.push('kategori = ?');
    values.push(data.category);
  }
  if (data.read_time !== undefined) {
    fields.push('waktu_baca = ?');
    values.push(data.read_time);
  }
  if (data.tag !== undefined) {
    fields.push('tag = ?');
    values.push(data.tag);
  }
  if (data.gambar_url !== undefined) {
    fields.push('gambar_url = ?');
    values.push(data.gambar_url);
  }

  if (fields.length === 0) return null;

  const sql = `
    UPDATE user_artikel
    SET ${fields.join(', ')}
    WHERE id = ? AND userId = ?
  `;
  values.push(articleId, userId);

  const result = await query(sql, values);
  if (result.affectedRows === 0) return null;

  // ambil data terbaru + nama penulis
  const rows = await query(
    `
      SELECT
        ua.id,
        ua.judul,
        ua.isi,
        ua.kategori,
        ua.waktu_baca      AS waktuBaca,
        ua.tag,
        ua.gambar_url      AS gambarUrl,
        ua.status,
        ua.tanggal_upload  AS tanggalUpload,
        u.username         AS authorName
      FROM user_artikel ua
      JOIN users u ON ua.userId = u.id
      WHERE ua.id = ? AND ua.userId = ?
    `,
    [articleId, userId]
  );

  return rows[0] || null;
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

async function deleteUserArticle(userId, articleId) {
  return query(
    `
      DELETE FROM user_artikel
      WHERE id = ? AND userId = ?
    `,
    [articleId, userId]
  );
}

/* =====================================================================
 *  BOOKMARKS
 * ===================================================================== */
async function getBookmarks(userId) {
  return query(
    `
    SELECT
      b.id            AS bookmarkId,
      b.artikelId,
      b.jenis,
      b.sudah_dibaca,
      a.judul,
      a.isi,
      a.kategori,
      a.waktu_baca    AS waktuBaca,
      a.tag,
      a.gambar_url    AS gambarUrl,
      a.tanggal,
      NULL            AS userId,
      NULL            AS authorName
    FROM edukasi_bookmark b
    JOIN edukasi_artikel a ON b.artikelId = a.id
    WHERE b.userId = ? AND b.jenis = 'static'

    UNION ALL

    SELECT
      b.id            AS bookmarkId,
      b.artikelId,
      b.jenis,
      b.sudah_dibaca,
      ua.judul,
      ua.isi,
      ua.kategori,
      ua.waktu_baca    AS waktuBaca,
      ua.tag,
      ua.gambar_url    AS gambarUrl,
      ua.tanggal_upload AS tanggal,
      ua.userId,
      u.username        AS authorName
    FROM edukasi_bookmark b
    JOIN user_artikel ua ON b.artikelId = ua.id
    JOIN users u ON ua.userId = u.id
    WHERE b.userId = ? AND b.jenis = 'user'

    ORDER BY bookmarkId DESC
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

/* =====================================================================
 *  EXPORT
 * ===================================================================== */
module.exports = {
  getPublicArticles,
  getUserArticles,
  getUserArticleById,
  insertUserArticle,
  updateUserArticle,
  updateUserArticleStatus,
  deleteUserArticle,

  getBookmarks,
  findBookmark,
  insertBookmark,
  deleteBookmark,
  markBookmarkRead
};
