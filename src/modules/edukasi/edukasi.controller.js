exports.getRoot = (req, res) => {
  res.json({ message: 'Edukasi module root' });
};

exports.listArticles = (req, res) => {
  res.json({ articles: [] });
};
