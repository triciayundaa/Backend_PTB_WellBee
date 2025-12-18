// src/modules/mental/mental.controller.js
const mentalService = require('./mental.service');

const getRoot = (req, res) => {
  res.json({ message: 'Mental module root' });
};

const simpanMood = async (req, res) => {
  try {
    const { userId, emoji, moodLabel, moodScale } = req.body;

    if (!emoji || !moodLabel || moodScale == null) {
      return res.status(400).json({
        status: 'fail',
        message: 'Emoji, mood label, dan mood scale harus diisi'
      });
    }

    const hasil = await mentalService.catatMood({
      userId,
      emoji,
      moodLabel,
      moodScale
    });

    res.status(201).json({
      status: 'success',
      message: 'Data mood berhasil disimpan',
      data: hasil
    });
  } catch (error) {
    console.error('Error simpan mood:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan di server'
    });
  }
};

module.exports = {
  getRoot,
  simpanMood
};
