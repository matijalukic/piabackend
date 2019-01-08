const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const app = express();
const LoginController = require('../controllers/LoginController.js');
const FairController = require('../controllers/FairController.js');
const fairs = require('../models/fairs.js');

var router = express.Router();




// export router 
module.exports = router;
