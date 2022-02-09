const express = require('express');
const router = express.Router();
const pool = require('../DB/db');

router.get('/getParked', async(req, res) => {
    const getParked = await pool.query(
        "SELECT * FROM Curr_cars_parked"
    );
    res.json(getParked.rows);
});

router.get('/getOwners', async(req, res) => {
    const getOwners = await pool.query(
        "SELECT * from car_owner"
    );
    res.json(getOwners.rows);
});

router.get('/getCars', async(req, res) => {
    const getCars = await pool.query(
        "SELECT * FROM CARS ORDER BY OWNER_ID"
    );
    res.json(getCars.rows)
});

module.exports = router;