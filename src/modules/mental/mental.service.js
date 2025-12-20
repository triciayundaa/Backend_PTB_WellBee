const MentalModel = require("./mental.model");

const clampInt = (v, min, max) => {
  const n = Number(v);
  if (Number.isNaN(n)) return null;
  return Math.min(max, Math.max(min, Math.trunc(n)));
};

const mentalService = {
  // =========================
  // MOOD
  // =========================
  catatMood: async ({ userId, emoji, moodLabel, moodScale, tanggal, triggerLabel, note, foto }) => {
    if (!userId) throw new Error("userId wajib diisi");
    if (!emoji || !moodLabel || moodScale == null) throw new Error("emoji, moodLabel, moodScale wajib diisi");

    const scale = clampInt(moodScale, 1, 10);
    if (scale == null) throw new Error("moodScale harus angka 1-10");

    const result = await MentalModel.createMood({
      userId,
      emoji,
      moodLabel,
      moodScale: scale,
      tanggal,
      triggerLabel,
      note,
      foto
    });

    return { id: result.insertId };
  },

  ambilRiwayatMood: async ({ userId, limit }) => {
    if (!userId) throw new Error("userId wajib diisi");
    const lim = limit ? clampInt(limit, 1, 365) : 30;
    return await MentalModel.getMoodHistory(userId, lim);
  },

  updateMood: async ({ id, emoji, moodLabel, moodScale, tanggal, triggerLabel, note, foto }) => {
    if (!id) throw new Error("id wajib diisi");

    let scale = null;
    if (moodScale != null) {
      scale = clampInt(moodScale, 1, 10);
      if (scale == null) throw new Error("moodScale harus angka 1-10");
    }

    const result = await MentalModel.updateMood({
      id,
      emoji,
      moodLabel,
      moodScale: scale,
      tanggal,
      triggerLabel,
      note,
      foto
    });

    if (result.affectedRows === 0) throw new Error("Mood tidak ditemukan");
    return { id: Number(id) };
  },

  deleteMood: async ({ id }) => {
    if (!id) throw new Error("id wajib diisi");
    const result = await MentalModel.deleteMood(id);
    if (result.affectedRows === 0) throw new Error("Mood tidak ditemukan");
    return true;
  },

  getWeeklyStats: async ({ userId }) => {
    if (!userId) throw new Error("userId wajib diisi");
    return await MentalModel.getWeeklyStats(userId);
  },

  getMonthlyStats: async ({ userId }) => {
    if (!userId) throw new Error("userId wajib diisi");
    return await MentalModel.getMonthlyStats(userId);
  },

  // =========================
  // JURNAL
  // =========================
  simpanJurnal: async ({ userId, triggerLabel, isiJurnal, foto, tanggal }) => {
    if (!userId) throw new Error("userId wajib diisi");
    if (!isiJurnal) throw new Error("isiJurnal wajib diisi");

    const result = await MentalModel.createJournal({
      userId,
      triggerLabel,
      isiJurnal,
      foto,
      tanggal
    });

    return { id: result.insertId };
  },

  ambilListJurnal: async ({ userId }) => {
    if (!userId) throw new Error("userId wajib diisi");
    return await MentalModel.getJournals(userId);
  },

  ambilDetailJurnal: async ({ id }) => {
    if (!id) throw new Error("id wajib diisi");
    return await MentalModel.getJournalById(id);
  },

  updateJournal: async ({ id, triggerLabel, isiJurnal, foto, tanggal }) => {
    if (!id) throw new Error("id wajib diisi");
    const result = await MentalModel.updateJournal({
      id,
      triggerLabel,
      isiJurnal,
      foto,
      tanggal
    });
    if (result.affectedRows === 0) throw new Error("Jurnal tidak ditemukan");
    return { id: Number(id) };
  },

  deleteJournal: async ({ id }) => {
    if (!id) throw new Error("id wajib diisi");
    const result = await MentalModel.deleteJournal(id);
    if (result.affectedRows === 0) throw new Error("Jurnal tidak ditemukan");
    return true;
  }
};

module.exports = mentalService;
