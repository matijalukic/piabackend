const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const app = express();
const StudentController = require('../controllers/StudentController.js');

var router = express.Router();

// company authorization 
router.use(StudentController.authorization);

// find companies
router.get('/findcompany', StudentController.findCompany);
// find job
router.get('/findjob', StudentController.findJob);

// apply for job
router.post('/job/apply', bodyParser.raw({type:'application/pdf'}), StudentController.jobApplyValidation, StudentController.jobApply);

// find application with student_id and job_id
router.get('/findapplication', StudentController.findApplicationValidation, StudentController.findApplication);

// all applications of the logged student
router.get('/myapplications', StudentController.myapplications);

// rate the application
router.get('/application/rate', StudentController.rateApplicationValidation, StudentController.rateApplication);

// export router 
module.exports = router;
