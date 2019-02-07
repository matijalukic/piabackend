const express = require('express');
const LoginController = require('../controllers/LoginController.js');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const app = express();
const FairController = require('../controllers/FairController.js');
const fairs = require('../models/fairs.js');

var router = express.Router();

router.post('/login', LoginController.login);
router.get('/loggedin', LoginController.logged);
router.get('/isadmin', LoginController.isadmin);
router.get('/iscompany', LoginController.isCompany);
router.get('/isstudent', LoginController.isStudent);

router.get('/user/changepassword', LoginController.changePasswordValidation, LoginController.changePassword);


// export router 
module.exports = router;
