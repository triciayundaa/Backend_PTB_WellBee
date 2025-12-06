const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// gabungan semua route
const routes = require('./routes');
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('WellBee API running');
});

const fisikRoutes = require('./modules/fisik/fisik.routes');
app.use('/api/fisik', fisikRoutes);

const createTables = require('./config/initTables');
createTables();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});