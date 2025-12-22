const express = require("express");
const router = express.Router();
const controller = require("./mental.controller");

router.get("/", controller.getRoot);

router.get("/mood/stats/weekly/:userId", controller.getWeeklyStats);
router.get("/mood/stats/monthly/:userId", controller.getMonthlyStats);

router.post("/mood", controller.simpanMood);
router.get("/mood/:userId", controller.getMoodHistory);
router.put("/mood/:id", controller.updateMood);
router.delete("/mood/:id", controller.deleteMood);

router.post("/jurnal", controller.simpanJurnal);
router.get("/jurnal/:userId", controller.getJournals);
router.get("/jurnal/detail/:id", controller.getJournalDetail);
router.put("/jurnal/:id", controller.updateJournal);
router.delete("/jurnal/:id", controller.deleteJournal);

 module.exports = router;
