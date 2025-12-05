const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const createTables = require('./config/initTables');
createTables();

// router utama
const routes = require('./routes');
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('WellBee API running');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
