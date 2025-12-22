require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const createTables = require('./config/initTables');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const routes = require('./routes');
app.use('/api', routes);


const uploadRoutes = require('./modules/upload/upload.routes');
app.use('/api/upload', uploadRoutes.router); 


app.get('/', (req, res) => {
  res.send('WellBee API running 🐝');
});

createTables()
  .then(() => {
    console.log(" Database tables initialized");
  })
  .catch((err) => {
    console.error(" Init tables error:", err);
  });

module.exports = app;