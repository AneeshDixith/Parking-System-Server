const express = require('express');
const router = express.Router();
const pool = require('../DB/db');

router.post('/Park', async(req, res) => {
    try {
        const get_flr = await pool.query(
            "SELECT * FROM FLOORS WHERE AVAIL_SLTS > 0 ORDER BY FLOOR_NO"
        );

        const get_slot = await pool.query(
            "SELECT (26 - AVAIL_SLTS) AS SLOT FROM FLOORS WHERE FLOOR_NO = $1", [get_flr.rows[0].floor_no]
        );

        const time = new Date();
        const currTime = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();

        const ParkCar = {
            rc_no: req.body.rc_no,
            floor_no: get_flr.rows[0].floor_no,
            slot: get_slot.rows[0].slot,
            hours: null,
            Time_in: currTime,
            Time_out: null,
            Parking_chrg: 0
        }
        const ticket_no = await pool.query(
            "INSERT INTO PARK (RC_NO, FLOOR_NO, SLOT, HOURS, TIME_IN, TIME_OUT, PARKING_CHRG) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [ParkCar.rc_no, ParkCar.floor_no, ParkCar.slot, ParkCar.hours, ParkCar.Time_in, ParkCar.Time_out, ParkCar.Parking_chrg]
        );
        await pool.query(
            "CALL decrement_slots($1)", [ParkCar.floor_no]
        );

        res.send("Please park your car in " + ParkCar.floor_no + "st floor slot number " + ParkCar.slot + ". Your ticket number is : " + ticket_no.rows[0].ticket_no +".");
    } catch (err) {
        res.json({ message: err });
    }

});


router.post('/exitPark', async(req, res) => {
    try {
        const tid = {
            ticket_id: req.body.ticket_id
        }

        const otime = new Date();
        const timeO = otime.getHours() + ':' + otime.getMinutes() + ':' + otime.getSeconds();

        await pool.query(
            "UPDATE PARK SET TIME_OUT = $1 WHERE TICKET_NO = $2", [timeO, tid.ticket_id]
        );

        const getting_hours = await pool.query(
            "SELECT HOURS FROM PARK WHERE TICKET_NO = $1", [tid.ticket_id]
        );

        var hh = ""
        for (let i = 0; i < 2; i++) {
            hh = hh + "" + getting_hours.rows[0].hours[i];
        }
        hh = parseInt(hh);
        const cost = (hh + 1) * 15;

        await pool.query(
            "UPDATE PARK SET PARKING_CHRG = $1 WHERE TICKET_NO = $2", [cost, tid.ticket_id]
        );

        res.send({message:cost});
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;