exports.getRoot = (req, res) => {
  res.json({ message: 'Mental module root' });
};

exports.createMood = (req, res) => {
  res.status(201).json({ message: 'mood saved', data: req.body });
};
