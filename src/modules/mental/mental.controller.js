const mentalService = require("./mental.service");

const getRoot = (req, res) => {
  res.json({ message: "Mental module root" });
};

const simpanMood = async (req, res) => {
  try {
    const { userId, emoji, moodLabel, moodScale, tanggal } = req.body;

    if (!userId || !emoji || !moodLabel || moodScale == null) {
      return res.status(400).json({
        status: "fail",
        message: "userId, emoji, moodLabel, dan moodScale wajib diisi"
      });
    }

    const result = await mentalService.catatMood({
      userId,
      emoji,
      moodLabel,
      moodScale,
      tanggal
    });

    res.status(201).json({
      status: "success",
      message: "Mood tersimpan",
      data: { id: result.id }
    });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

const getMoodHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : 30;

    const data = await mentalService.ambilRiwayatMood({ userId, limit });
    res.json({ status: "success", data });
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};

const updateMood = async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji, moodLabel, moodScale, tanggal } = req.body;

    const result = await mentalService.updateMood({
      id,
      emoji,
      moodLabel,
      moodScale,
      tanggal
    });

    res.json({
      status: "success",
      message: "Mood diupdate",
      data: { id: result.id }
    });
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};

const deleteMood = async (req, res) => {
  try {
    const { id } = req.params;
    await mentalService.deleteMood({ id });
    res.json({ status: "success", message: "Mood dihapus" });
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};

const getWeeklyStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await mentalService.getWeeklyStats({ userId });
    res.json({ status: "success", data });
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};

const getMonthlyStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await mentalService.getMonthlyStats({ userId });
    res.json({ status: "success", data });
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};

const simpanJurnal = async (req, res) => {
  try {
    const { userId, triggerLabel, isiJurnal, foto, audio, tanggal } = req.body;

    if (!userId || !isiJurnal) {
      return res.status(400).json({
        status: "fail",
        message: "userId dan isiJurnal wajib diisi"
      });
    }

    const result = await mentalService.simpanJurnal({
      userId,
      triggerLabel,
      isiJurnal,
      foto,
      audio,
      tanggal
    });

    res.status(201).json({
      status: "success",
      message: "Jurnal tersimpan",
      data: { id: result.id }
    });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
};

const getJournals = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await mentalService.ambilListJurnal({ userId });
    res.json({ status: "success", data });
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};

const getJournalDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await mentalService.ambilDetailJurnal({ id });

    if (!data) {
      return res.status(404).json({
        status: "fail",
        message: "Jurnal tidak ditemukan"
      });
    }

    res.json({ status: "success", data });
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};

const updateJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const { triggerLabel, isiJurnal, foto, audio, tanggal } = req.body;

    const result = await mentalService.updateJournal({
      id,
      triggerLabel,
      isiJurnal,
      foto,
      audio, 
      tanggal
    });

    res.json({
      status: "success",
      message: "Jurnal diupdate",
      data: { id: result.id }
    });
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};

const deleteJournal = async (req, res) => {
  try {
    const { id } = req.params;
    await mentalService.deleteJournal({ id });
    res.json({ status: "success", message: "Jurnal dihapus" });
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};

module.exports = {
  getRoot,

  simpanMood,
  getMoodHistory,
  updateMood,
  deleteMood,

  getWeeklyStats,
  getMonthlyStats,

  simpanJurnal,
  getJournals,
  getJournalDetail,
  updateJournal,
  deleteJournal
};