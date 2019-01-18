const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const app = express();
const CompanyController = require('../controllers/CompanyController.js');

var router = express.Router();


/**
 * Get a company by id
 */
router.get('/find', CompanyController.findCompanyValidation, CompanyController.findCompany);

/**
 * Adding new permit as a Company
 */
router.post('/newpermit', bodyParser.urlencoded({ extended: true }), CompanyController.newPermitValidation, CompanyController.newpermit);


// export router 
module.exports = router;
