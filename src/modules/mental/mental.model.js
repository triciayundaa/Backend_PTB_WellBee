const db = require("../../config/db");

// =========================
// MOOD (tabel: mental_mood)
// kolom tersedia: userId, emoji, moodLabel, moodScale, tanggal
// =========================
const MentalModel = {
  createMood: async ({ userId, emoji, moodLabel, moodScale, tanggal }) => {
    const query = `
      INSERT INTO mental_mood (userId, emoji, moodLabel, moodScale, tanggal)
      VALUES (?, ?, ?, ?, COALESCE(?, CURRENT_DATE))
    `;
    const [result] = await db.execute(query, [userId, emoji, moodLabel, moodScale, tanggal || null]);
    return result;
  },

  getMoodHistory: async (userId, limit = 30) => {
    const query = `
      SELECT id, userId, emoji, moodLabel, moodScale, tanggal, createdAt
      FROM mental_mood
      WHERE userId = ?
      ORDER BY tanggal DESC, id DESC
      LIMIT ?
    `;
    const [rows] = await db.execute(query, [userId, Number(limit)]);
    return rows;
  },

  updateMood: async ({ id, emoji, moodLabel, moodScale, tanggal }) => {
    const fields = [];
    const values = [];

    if (emoji != null) { fields.push("emoji = ?"); values.push(emoji); }
    if (moodLabel != null) { fields.push("moodLabel = ?"); values.push(moodLabel); }
    if (moodScale != null) { fields.push("moodScale = ?"); values.push(moodScale); }
    if (tanggal != null) { fields.push("tanggal = ?"); values.push(tanggal); }

    if (fields.length === 0) {
      return { affectedRows: 0 };
    }

    const query = `UPDATE mental_mood SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await db.execute(query, values);
    return result;
  },

  deleteMood: async (id) => {
    const [result] = await db.execute(`DELETE FROM mental_mood WHERE id = ?`, [id]);
    return result;
  },

  // Statistik mingguan: 7 hari terakhir (avg moodScale per hari)
  getWeeklyStats: async (userId) => {
    const query = `
      SELECT tanggal, AVG(moodScale) AS avgMood
      FROM mental_mood
      WHERE userId = ? AND tanggal >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY tanggal
      ORDER BY tanggal ASC
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  },

  // Statistik bulanan: 30 hari terakhir (avg moodScale per hari)
  getMonthlyStats: async (userId) => {
    const query = `
      SELECT tanggal, AVG(moodScale) AS avgMood
      FROM mental_mood
      WHERE userId = ? AND tanggal >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
      GROUP BY tanggal
      ORDER BY tanggal ASC
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  },

  // =========================
  // JURNAL (tabel: mental_jurnal)
  // kolom: userId, triggerLabel, isiJurnal, foto, tanggal
  // =========================
  createJournal: async ({ userId, triggerLabel, isiJurnal, foto, tanggal }) => {
    const query = `
      INSERT INTO mental_jurnal (userId, triggerLabel, isiJurnal, foto, tanggal)
      VALUES (?, ?, ?, ?, COALESCE(?, CURRENT_DATE))
    `;
    const [result] = await db.execute(query, [
      userId,
      triggerLabel || null,
      isiJurnal,
      foto || null,
      tanggal || null
    ]);
    return result;
  },

  getJournals: async (userId) => {
    const query = `
      SELECT id, userId, triggerLabel, isiJurnal, foto, tanggal, createdAt
      FROM mental_jurnal
      WHERE userId = ?
      ORDER BY tanggal DESC, id DESC
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  },

  getJournalById: async (id) => {
    const query = `
      SELECT id, userId, triggerLabel, isiJurnal, foto, tanggal, createdAt
      FROM mental_jurnal
      WHERE id = ?
      LIMIT 1
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  },

  updateJournal: async ({ id, triggerLabel, isiJurnal, foto, tanggal }) => {
    const fields = [];
    const values = [];

    if (triggerLabel != null) { fields.push("triggerLabel = ?"); values.push(triggerLabel); }
    if (isiJurnal != null) { fields.push("isiJurnal = ?"); values.push(isiJurnal); }
    if (foto != null) { fields.push("foto = ?"); values.push(foto); }
    if (tanggal != null) { fields.push("tanggal = ?"); values.push(tanggal); }

    if (fields.length === 0) return { affectedRows: 0 };

    const query = `UPDATE mental_jurnal SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await db.execute(query, values);
    return result;
  },

  deleteJournal: async (id) => {
    const [result] = await db.execute(`DELETE FROM mental_jurnal WHERE id = ?`, [id]);
    return result;
  }
};

module.exports = MentalModel;
