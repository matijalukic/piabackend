const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const app = express();
const LoginController = require('../controllers/LoginController.js');
const FairController = require('../controllers/FairController.js');
const fairs = require('../models/fairs.js');

var router = express.Router();


// admin authorization
router.use(function(req, res, next){
    let userToken = req.header('Authorization');
    let splitedToken = userToken.split(' ');
    userToken = splitedToken[1];
    
    jwt.verify(userToken, config.secret, (errorMessage, decodedData) => {
        console.log('passed');
        next();
    })

    res.status(403);
});


router.get('/fairs', FairController.fairs);


// export router 
module.exports = router;
