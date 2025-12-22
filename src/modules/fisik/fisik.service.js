const FisikModel = require('./fisik.model');

const catatOlahraga = async (data) => {
    const result = await FisikModel.createSport(data);
    return { id: result.insertId, ...data };
};

const getRiwayatOlahraga = (userId) => FisikModel.getSportByUser(userId);

const hapusOlahraga = async (id, userId) => {
    return FisikModel.deleteSport(id, userId);
};

const updateOlahraga = async (id, data) => {
    return await FisikModel.updateSport(id, data);
};

const fisikModel = require("./fisik.model");
const dayjs = require("dayjs");
require("dayjs/locale/id");

const getWeeklySport = async (userId) => {
    const curr = new Date(); 
    
    const day = curr.getDay(); 
    
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(curr.setDate(diff));
    
    const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    const start = formatDate(monday);
    const end = formatDate(sunday);

    console.log("========================================");
    console.log("DEBUG WEEKLY CHART");
    console.log(`User ID: ${userId}`);
    console.log(`Range  : ${start} s/d ${end}`);
    console.log("========================================");

    const rows = await FisikModel.getSportByRange(userId, start, end);
    
    console.log("Data Row dari DB:", rows);

    const labels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const values = Array(7).fill(0);

    rows.forEach(r => {
        const idx = Number(r.wd);
        if (idx >= 0 && idx <= 6) {
            values[idx] = Number(r.total);
        }
    });

    return { 
        labels, 
        values, 
        rangeText: `${start} - ${end}` 
    };
};

const catatTidur = async (data) => {
    const result = await FisikModel.createSleep(data);
    return { id: result.insertId, ...data };
};

const getRiwayatTidur = (userId) => FisikModel.getSleepByUser(userId);

const hapusTidur = async (id, userId) => {
    return FisikModel.deleteSleep(id, userId);
};

const updateTidur = async (data) => {
    const result = await FisikModel.updateSleep(data);
    return { id: data.id, ...data };
};

const getWeeklySleep = async (userId) => {
    const curr = new Date();
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(curr.setDate(diff));
    const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    };

    const start = formatDate(monday);
    const end = formatDate(sunday);

    console.log(`💤 WEEKLY SLEEP: ${start} - ${end}`);

    const rows = await FisikModel.getSleepByRange(userId, start, end);

    const labels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const values = Array(7).fill(0.0); 

    rows.forEach(r => {
        const idx = Number(r.wd);
        if (idx >= 0 && idx <= 6) {
            values[idx] = parseFloat(Number(r.avg_durasi).toFixed(1));
        }
    });

    return { 
        labels, 
        values, 
        rangeText: `${start} - ${end}` 
    };
};

const catatWeight = async (data) => {
  const result = await FisikModel.createWeight(data);
  return { id: result.insertId, ...data };
};

const getRiwayatWeight = (userId) => FisikModel.getWeightByUser(userId);
const hapusWeight = (id, userId) => FisikModel.deleteWeight(id, userId);
const updateWeight = (id, data) => FisikModel.updateWeight(id, data);

module.exports = {
    catatOlahraga,
    getRiwayatOlahraga,
    hapusOlahraga,
    updateOlahraga,
    getWeeklySport,

    catatTidur,
    getRiwayatTidur,
    hapusTidur,
    updateTidur,
    getWeeklySleep,

    catatWeight,
    getRiwayatWeight,
    hapusWeight,
    updateWeight
};
