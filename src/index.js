const express = require("express");
const cors = require("cors");
require("dotenv").config();

const createTables = require("./config/initTables");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const routes = require("./routes");
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("WellBee API running");
});

(async () => {
  try {
    await createTables();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("BOOT ERROR:", err);
    process.exit(1);
  }
})();
