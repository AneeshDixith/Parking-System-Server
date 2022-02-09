const express = require('express');
const router = express.Router();
const pool = require('../DB/db');


router.post('/newOwner', async(req, res) => {
    try {
        const newOwner = {
            name: req.body.name,
            locality: req.body.locality,
            phone_no: req.body.phone_no
        }
        await pool.query(
            "INSERT INTO CAR_OWNER (OWNER_NAME, LOCALITY, PHONE_NO) VALUES ($1, $2, $3)", [newOwner.name, newOwner.locality, newOwner.phone_no]
        );

        const nameofuser = newOwner.name;
        const phone_no_of_user = newOwner.phone_no;

        const temp = await pool.query(
            "SELECT OWNER_ID FROM CAR_OWNER WHERE OWNER_NAME = $1 AND PHONE_NO = $2", [nameofuser, phone_no_of_user]
        );

        res.send({message:temp.rows[0].owner_id});


    } catch (err) {
        res.json({ message: err })
    }
});

module.exports = router;