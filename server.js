const http = require('http');
const Sequelize = require('sequelize');
const cors = require('cors');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin.routes.js');
const companyRouter = require('./routes/company.routes.js');
const userRouter = require('./routes/user.routes.js');
const studentRouter = require('./routes/student.routes.js');
const CompanyController = require('./controllers/CompanyController.js');
const express = require('express');
const app = express();

// Controllers
const LoginController = require('./controllers/LoginController.js');
const StudentController = require('./controllers/StudentController.js');


const Op = Sequelize.Op;
const sequelize = new Sequelize('jobfair', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
    operatorsAliases: {
        $and: Op.and,
        $or: Op.or,
        $eq: Op.eq,
        $gt: Op.gt,
        $lt: Op.lt,
        $lte: Op.lte,
        $like: Op.like
    }
});


const hostname = '127.0.0.1';
const port = 3000;

app.use(cors()); // cross origin request

// guest 
/**
 * Get a company by id
 */
app.get('/latestfair', LoginController.latestFair);
app.get('/findfair/:id', LoginController.findFair);
app.get('/user', LoginController.getUser);
app.get('/find/company', CompanyController.findCompanyValidation, CompanyController.findCompany);
app.get('/find/job', StudentController.getJobValidation, StudentController.getJob);
app.get('/pdf/:pdfname', StudentController.getPDF);
app.get('/image/:image', StudentController.getImage);
app.get('/username', LoginController.findUsername); // check if the username is available
app.get('/emails', LoginController.countEmail); // check id the email is available
app.post('/register', bodyParser.json(), LoginController.register);


// admin routes
app.use('/admin/', adminRouter);
app.use('/company/', companyRouter);
app.use('/student/', studentRouter);
app.use(userRouter);





app.listen(port, () => console.log("The server is running."));
