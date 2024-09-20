const express = require("express");
const router = express.Router()
const mongoose = require("mongoose");
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken") // (Unique ID)

const {data} = require('../data.js');

const {protect} = require('../middleware/authMiddleware');

const {registerUser , allUsers , authUser} = require('../controllers/userController.js');





router.route('/').post(registerUser).get(protect , allUsers);
router.route('/login').post(authUser);
// router.post('/login' , authUser);























module.exports = router;















// router.get('/api/data' , (req , res) => {
//     res.send(data);
// })



// router.get('/data/:id' ,(req , res) => {
//     const id = req.params.id;

//     // console.log(req);
//     const result = data.find( item => item.id == id );
//     res.send(result);
// })
