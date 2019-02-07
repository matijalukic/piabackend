const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const users = require('../models/users.js');
const admins = require('../models/admins.js');
const companies = require('../models/companies.js');
const students = require('../models/students.js');
const persons = require('../models/persons.js');
const fairs = require('../models/fairs.js');
const permits = require('../models/permits.js');
const packages = require('../models/packages.js');
const locations = require('../models/locations.js');
const { check, body, validationResult } = require('express-validator/check');



const sequelize = new Sequelize('jobfair', 'root', '', {dialect: 'mysql'});
const Users = new users(sequelize, Sequelize);
const Admins = new admins(sequelize, Sequelize);
const Company = new companies(sequelize, Sequelize);
const Student = new students(sequelize, Sequelize);
const Person = new persons(sequelize, Sequelize);
const Fairs = new fairs(sequelize, Sequelize);
const Packages = new packages(sequelize, Sequelize);
const Permits = new permits(sequelize, Sequelize);
const Location = new locations(sequelize, Sequelize);


/**
 * for the given token returns the logged user
 */
module.exports.tokenToUser = async function(token){
	if(token){
		let splitedToken = token.split(' ');
		
		token = splitedToken[1];
		let decoded = await jwt.verify(token, config.secret);
		
		// find student
    	let foundedUser = await Users.findByPk(decoded.foundedUser.id);

		// return the student
		return foundedUser;
	}
	else 
		return false;
}



/**
 * Login post request
 * @param req Request 
 * @param res Response 
 */
module.exports.login = function(req, res){
    var username = req.query.username;
    var password = req.query.password;

    Users.findOne(
        {
            where: { username : username }
        }
    )
        .then((foundedUser) => {
            // User not founded
            if(!foundedUser){
                return res.status(402).json({'error' : 'User not founded!'});
            }

            if(foundedUser.password === password){


                return res.status(200).json(
                    { 
                        token: jwt.sign({foundedUser}, config.secret), 
                        user: foundedUser
                    });
            }

            // Password is not correct
            else{
                return res.status(402).json({'error' : 'Password didnt match!'});
            }


        });
};

// Input is token result is boolean if user exists
module.exports.logged = function(req, res){
    let token = req.query.token;
    let decodedUser;

    if(token){
        try{
            decodedUser = jwt.verify(token, config.secret);
        }
        catch(err){
            return res.status(403).json({ errorMessage: 'Token is not valid!'});
        }


        Users.findOne({
            where: { id: decodedUser.foundedUser.id }
        })
        .then((foundedUser) => {
            if(foundedUser){
                return res.status(200).json(foundedUser);
            }
            return res.status(403).json({loggedIn: false});
        });
    }
    else 
        res.status(403).json({errorMessage: 'Token is not provided!'});
}

/**
 * input is jwt token 
 * output is if the user is admin or not
 **/
 
module.exports.isadmin = function(req, res){
	let token = req.query.token;
	
	decodedUser = jwt.verify(token, config.secret);
		
	Admins.findOne({
		where: { id : decodedUser.foundedUser.id }
	})
	.then((foundedUser) => {
		if (foundedUser) {
			return res.status(200).json(foundedUser);
		}
		return res.status(500).json({errorMessage: 'Admin not founded'});
	});
}
 

/**
 * input is jwt token 
 * output is if the user is admin or not
 **/
 
module.exports.isCompany = function(req, res){
	let token = req.query.token;
	
	decodedUser = jwt.verify(token, config.secret);
		
	Company.findOne({
		where: { id : decodedUser.foundedUser.id }
	})
	.then((foundedCompany) => {
		if (foundedCompany) {
			return res.status(200).json(foundedCompany);
		}
		return res.status(500).json({errorMessage: 'Company not founded'});
    })
    .catch(() => {
        return res.status(500).json({errorMessage: 'Company not founded'});
    });
}


/**
 * input is jwt token 
 * output is if the user is admin or not
 **/
 
module.exports.isStudent = function(req, res){
	let token = req.query.token;
	
	decodedUser = jwt.verify(token, config.secret);
		
	Student.findOne({
		where: { id : decodedUser.foundedUser.id }
	})
	.then((foundedStudent) => {
		if (foundedStudent) {
			return res.status(200).json(foundedStudent);
		}
		return res.status(500).json({errorMessage: 'Student not founded'});
    })
    .catch(() => {
        return res.status(500).json({errorMessage: 'Student not founded'});
    });
}
 
 
/**
 * Get user by id from params
 */
module.exports.getUser = async (req, res) => {
    try{
        let foundedUser = await Users.findByPk(req.query.id);

        if(!foundedUser) throw "User is not founded!";

        res.json(foundedUser);
    }
    catch(e){
        res.status(403).json({ errorMessage: e});
    }
}


/**
 * returns number of usersnames with parameter
 */
module.exports.findUsername = async (req, res) => {

    let foundUser = await Users.count({
        where:  { username: req.query.username }
    });

    res.json(foundUser);
}

module.exports.countEmail = async (req, res) => {

    let countedEmails = await Users.count({
        where:  { email: req.query.email }
    });

    res.json(countedEmails);
}


/**
 * Sending the users
 */
module.exports.register = async (req, res) => {
    try{
        console.log(req.body);
        let creatingUser = await Users.create(req.body.user);

        if(!creatingUser) throw "We havent created a user!";

        if(req.body.company && !req.body.person){
            let creatingCompany = req.body.company;

            creatingCompany.id = creatingUser.id;
            let newCompany = await Company.create(creatingCompany);
        
            if(!newCompany){ 
                creatingUser.destroy();
                throw "We havent able to make a company!";
            }
        }
        // creating student
        else if(req.body.person && req.body.student && !req.body.company){
            let creatingPerson = req.body.person;
            let creatingStudent = req.body.student;
        
            // set ids 
            creatingPerson.id = creatingStudent.id = creatingUser.id;
            
            // persist the person and user
            let newPerson = await Person.create(creatingPerson);
            if(!newPerson){
                creatingUser.destroy();
                throw "We havent been able to make a person!";
            } 

            let newStudent = await Student.create(creatingStudent);
            if(!newStudent){
                creatingUser.destroy();
                throw "We havent been able to make a student!";        
            }
        }
        // you havent picked anything
        else {
            // clean the user
            creatingUser.destroy();
            throw "You have not fullfiled whole form!";
        }
        
        res.json({ successMessage: 'You have successfull registered! Please login!'});
    }
    catch(e){
        console.log(e);
        res.status(403).json({ errorMessage: e });
    }

}

/**
 * Change password
 */
module.exports.changePasswordValidation = [
    check('new_password', 'New password is not set or is not long enough!').exists().isLength({min: 5}),
    check('old_password', 'Old password is not set').exists()
];

module.exports.changePassword = async (req, res) => {
    try{
        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw errors.array().map((val) => val.msg).join('\n');
        }
        
        let userChanging = await module.exports.tokenToUser(req.headers.authorization);
        
        if(!userChanging) throw "Token is not valid!";

        // check if old password is invalid
        if(userChanging.password != req.query.old_password) throw "Old password is invalid!";
        
             
        // find user
        userChanging.password = req.query.new_password;
        userChanging.save();

        res.json({ successMessage: 'You have changed password!'});
    }
    catch(e){
        console.log(e);
        res.status(403).json({ errorMessage: e} );
    }


}


Fairs.belongsToMany(Company, {through: 'permits', foreignKey: 'fair_id', otherKey: 'company_id'});
Fairs.hasMany(Permits, { foreignKey: 'fair_id'});
Fairs.hasMany(Packages, { foreignKey: 'fair_id'});
Fairs.hasMany(Location, { foreignKey: 'fair_id'});
/**
 * Latest fair with his companies
 */
module.exports.latestFair = async ( req, res ) => {
    try{
        // get latest fair
        let lastFair = await Fairs.findOne({
            order: [['start', 'DESC'] ] ,
            include: [{ model: Permits, where: {allowed: true}}, Packages, Company, Location]
        });

        res.json(lastFair);
    }
    catch(e){
        res.status(403).json({ errorMessage: e});
    }
}

/**
 * Find Fair with specific id
 */
module.exports.findFair = async ( req, res ) => {
    try{
        // get latest fair
        let lastFair = await Fairs.findOne({
            where: { id: req.params.id}, 
            order: [['start', 'DESC'] ] ,
            include: [Permits, Packages, Company, Location]
        });

        res.json(lastFair);
    }
    catch(e){
        res.status(403).json({ errorMessage: e});
    }
}
