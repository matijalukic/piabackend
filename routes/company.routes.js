const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const app = express();
const CompanyController = require('../controllers/CompanyController.js');

var router = express.Router();

// company authorization 
router.use(CompanyController.authorization);


router.get('/fairs', CompanyController.fairs);


/**
 * Adding new permit as a Company
 */
router.post('/newpermit', bodyParser.json(), CompanyController.newPermitValidation, CompanyController.newpermit);
router.get('/findpermit', CompanyController.findPermitValidation, CompanyController.findPermits);
router.get('/permit', CompanyController.findOnePermitValidation, CompanyController.findPermit);


// job routes
router.post('/newjob', bodyParser.json(), CompanyController.newJobValidation, CompanyController.newJob);
router.get('/myjobs', CompanyController.myJobsValidation, CompanyController.myJobs);
router.get('/job/remove', CompanyController.removeJobValidation, CompanyController.removeJob);
router.get('/job/view', CompanyController.viewJobValidation , CompanyController.viewJob);
router.get('/job/application/accept', CompanyController.acceptApplicationValidation, CompanyController.acceptApplication);


router.get('/cancel/participation', CompanyController.cancelPermit);


// export router 
module.exports = router;
