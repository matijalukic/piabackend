const http = require('http');
const Sequelize = require('sequelize');
const cors = require('cors');
const adminRouter = require('./routes/admin.routes.js');
const companyRouter = require('./routes/company.routes.js');
const express = require('express');
const app = express();

// Controllers
const LoginController = require('./controllers/LoginController.js');


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

// admin routes
app.use('/admin/', adminRouter);
app.use('/company/', companyRouter);

app.post('/login', LoginController.login);
app.get('/loggedin', LoginController.logged);
app.get('/isadmin', LoginController.isadmin);

app.listen(port, () => console.log("The server is running."));
