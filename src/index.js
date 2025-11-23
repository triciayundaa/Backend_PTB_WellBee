const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('WellBee API running');
});

// semua endpoint auth diawali /auth
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
