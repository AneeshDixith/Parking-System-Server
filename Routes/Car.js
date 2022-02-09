const express = require('express');
const router = express.Router();
const pool = require('../DB/db');

router.post('/addCar', async(req, res) => {
    try {
        const addCar = {
            rc_no: req.body.rc_no,
            owner_id: req.body.owner_id,
            model: req.body.model
        }

        await pool.query(
            "INSERT INTO CARS VALUES ($1, $2, $3)", [addCar.rc_no, addCar.owner_id, addCar.model]
        );
        
        res.json({message:"Car Added Successfully!!!"});
    } catch (err) {
        res.json({ message: err });
    }
});


router.post('/removeCar', async(req, res) => {
    try {
        const reg_no = req.body.reg_no
        await pool.query(
            "DELETE FROM CARS WHERE RC_NO = $1", [reg_no]
        );
        res.json({message:"Car successfully removed!!"});
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;