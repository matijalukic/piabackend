const http = require('http');
const Sequelize = require('sequelize');
const cors = require('cors');
const adminRouter = require('./routes/admin.routes.js');
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


// const Fairs = require('./models/fairs.js');
// const Admins = require('./models/admins.js');
// const Companies = require('./models/companies.js');
// const Locations = require('./models/locations.js');
// const Persons = require('./models/persons.js');
// const Students = require('./models/students.js');
// const Users = require('./models/users.js');

// const User = new Users(sequelize, Sequelize);
// const Company = new Companies(sequelize, Sequelize);
// const Person = new Persons(sequelize, Sequelize);
// const Admin = new Admins(sequelize, Sequelize);
// const Student = new Students(sequelize, Sequelize);
// const Fair = new Fairs(sequelize, Sequelize);
// const Location = new Locations(sequelize, Sequelize);

// User.sync();
// Company.sync();
// Person.sync();
// Admin.sync();
// Student.sync();
// Fair.sync();
// Location.sync();

const hostname = '127.0.0.1';
const port = 3000;

app.use(cors()); // cross origin request

// admin routes
app.use('/admin/', adminRouter);

app.post('/login', LoginController.login);
app.get('/loggedin', LoginController.logged);
app.get('/isadmin', LoginController.isadmin);

app.listen(port, () => console.log("The server is running."));
