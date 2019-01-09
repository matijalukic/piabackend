const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const users = require('../models/users.js');
const admins = require('../models/admins.js');
const config = require('../config.json');

const sequelize = new Sequelize('jobfair', 'root', '', {dialect: 'mysql'});
const Users = new users(sequelize, Sequelize);
const Admins = new admins(sequelize, Sequelize);


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
		return res.status(403).json({errorMessage: 'Admin not founded'});
	});
}
 