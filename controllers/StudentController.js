const Sequelize = require('sequelize');
const Config = require('../config.json');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const IncomingForm = require('formidable').IncomingForm;
const connection = new Sequelize(Config.db, Config.username, Config.password, {dialect: Config.dialect});
const { check, body, validationResult } = require('express-validator/check');
const Op = Sequelize.Op;
const LoginController = require('../controllers/LoginController.js');
const companies = require('../models/companies.js');
const users = require('../models/users.js');
const fairs = require('../models/fairs.js');
const packages = require('../models/packages.js');
const permits = require('../models/permits.js');
const permitAdditionals = require('../models/permit_additionals.js');
const additionals = require('../models/additionals.js');
const jobs = require('../models/jobs.js');
const students = require('../models/students.js');
const applications = require('../models/applications.js');
const moment = require('moment');


const Company = new companies(connection, Sequelize);
const User = new users(connection, Sequelize);
const Permit = new permits(connection, Sequelize);
const Fair = new fairs(connection, Sequelize);
const Package = new packages(connection, Sequelize);
const PermitAdditional = new permitAdditionals(connection, Sequelize);
const Additional = new additionals(connection, Sequelize);
const Job = new jobs(connection, Sequelize);
const Student = new students(connection, Sequelize);
const Application = new applications(connection, Sequelize);

Company.hasMany(Job, {foreignKey: 'company_id'});
Job.belongsTo(Company, {foreignKey: 'company_id'});

Student.hasMany(Application, { foreignKey: 'student_id'});
Application.belongsTo(Job, {foreignKey: 'job_id'});

var parseToken = async function(token){
	if(token){
		let splitedToken = token.split(' ');
		
		token = splitedToken[1];
		let decoded = await jwt.verify(token, Config.secret);
		
		// find student
		let foundedStudent = await Student.findByPk(decoded.foundedUser.id);

		if(!foundedStudent)
			return false 

		// return the student
		return foundedStudent;
	}
	else 
		return false;
}

/**
 * Authorization
 */
module.exports.authorization = function(req, res, next){
	try{

		let userToken = req.header('Authorization');
		if(userToken){
			
			let splitedToken = userToken.split(' ');
		
			userToken = splitedToken[1];

			let decoded = jwt.verify(userToken, Config.secret);

			// find company
			Student.findByPk(decoded.foundedUser.id)
			.then((succ) => {
				next();
			},
			(err) => {
				console.log(err);
			});
			
		
		}
		else 
			throw "Missing token Authorization!";
	}
	catch(err){
		res.status(403).json( {errorMessage: err} )
	}
}

/**
 * Find companies by multiple criteria
 */
module.exports.findCompany = async(req, res) => {
	try{
		let whereConditions = {};

		// by name
		if(req.query.name) whereConditions.name = {
			[Op.like]: '%' + req.query.name + '%'
		};
		// by city
		if(req.query.city) whereConditions.city = {
			[Op.like]: req.query.city
		};

		// by employees min
		if(req.query.min_employees) 
			whereConditions.employees = {
				[Op.gte] : req.query.min_employees
			};
		if(req.query.max_employees) 
			whereConditions.employees = {
				[Op.lte] : req.query.max_employees
			};

		// by agency
		if(req.query.agency)
		whereConditions.agency = req.query.agency;

		let filteredCompanies = await Company.findAll({ 
			where: whereConditions,
			limit: 15,
			include: [Job],
		});

		res.json(filteredCompanies);
	}
	catch(e){
		res.status(403).json({errorMessage: e});
	}


}


/**
 * Find jobs by name of the position and by the type
 */
module.exports.findJob = async (req,res) => {
	try{
		let whereConditions = {};

		// start is before
		whereConditions.start = {
			[Op.lt] : moment().toDate()
		};

		// end is after
		whereConditions.end = {
			[Op.gt] : moment().toDate()
		};


		// by name
		if(req.query.name) whereConditions.name = {
			[Op.like]: '%' + req.query.name + '%'
		};
		// by type
		// parse the parameter
		let types = req.query.type;
		if(types){
			types = types.split(',');

			whereConditions.type = {
				[Op.in] : types
			}
		}


		let filteredJobs = await Job.findAll({ 
			where: whereConditions,
			limit: 15,
			include: [Company],
		});

		res.json(filteredJobs);
	}
	catch(e){
		res.status(403).json({errorMessage: e});
	}
}


/**
 * get job by id
 */
module.exports.getJobValidation = [
	check('id', 'The Job has not found!')
]

module.exports.getJob = async (req, res) => {
	try{
		let foundedJob = await Job.findOne({
			where: {id : req.query.id},
			include: [Company]
		});

		if(!foundedJob) throw "There is no job founded!";

		res.json(foundedJob);
	}
	catch(e){
		res.status(403).json({errorMessage: e});
	}
}

module.exports.jobApplyValidation = [
	check('student_id', 'Student is not selected!').exists(),
	check('job_id', 'Job is not selected').exists(),
];


module.exports.jobApply = async (req, res) => {
	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw errors.array().map((val) => val.msg).join('\n');
		}

		let errorMessage = null;
		let fileName = null; // file name of the uploaded file


		fileName = 'student_' + req.query.student_id + '_job_' + req.query.job_id + '.pdf';
		fs.writeFileSync('./pdfs/' + fileName, req.body);


		Job.findOne({ where: { id: req.query.job_id}})
		.then((applicationsJob) =>{
			// insert apply for job
			Application.create({
				type: applicationsJob.type,
				job_id: applicationsJob.id,
				student_id: req.query.student_id,
				cover_letter: req.query.cover_letter,
				pdf: fileName,
			})
			.then((insertingApplication) => {
				res.json({successMessage: 'You have successfully inserted application.'});
			})
			.catch(err => {
				res.status(403).json({ errorMessage: 'The  application is not inserted' });
			});

		})
		.catch(e => {
			res.status(403).json({errorMessage: 'The job has not been founded!'});
		});

			
	}
	catch(e){
		res.status(403).json({ errorMessage: e });
	}


}


/**
 * Founding application with student_id and job_id
 */
module.exports.findApplicationValidation = [
	check('student_id', 'The student doesnt exists!').exists(),
	check('job_id', 'The job has not been founded!').exists()
]


module.exports.findApplication = async (req, res) => {
	try{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw errors.array().map((val) => val.msg).join('\n');
		}


		let findApplication = await Application.findOne({
			where: {
				student_id: req.query.student_id,
				job_id: req.query.job_id
			}
		});

		res.json(findApplication);
	}
	catch(e){
		res.status(403).json({errorMessage: e});
	}
}

/**
 * Get the pdf of the app
 */
module.exports.getPDF = async (req, res) => {
	
	try{
		let pdfName = req.params.pdfname;
		
		console.log('reading CV: ' + pdfName);


		var options = {
			root: __dirname + '/../' + 'pdfs',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		  };
		
		// let returningFile = fs.readFileSync('./pdfs/'. pdfName);
		// if(!returningFile) throw "There is no file!";
		let path = pdfName;
		console.log(options.root + ' ' + path);
		res.sendFile(path, options, function(err){
			console.log(err);
		});
	}
	catch(e){
		res.status(404).json({errorMessage: e});
	}
}

/**
 * Get image from images folder
 */
module.exports.getImage = async (req, res) => {
	
	try{
		let imageName = req.params.image;
		
		console.log('reading CV: ' + imageName);


		var options = {
			root: __dirname + '/../' + 'images',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		  };
		
		
		  let path = imageName;
		
		
		res.sendFile(path, options, function(err){
			console.log(err);
		});
	}
	catch(e){
		res.status(404).json({errorMessage: e});
	}
}




module.exports.myapplications = async (req, res) => {
	try{

		let foundedStudent = await parseToken(req.headers.authorization);

		if(!foundedStudent) throw "There is no student founded!";


		let applicationsWithJobs = 
			await Application.findAll({
				where: {
					student_id: foundedStudent.id
				},
				include: [Job],
			});

		return res.json(applicationsWithJobs);
	}
	catch(e){
		res.status(403).json({ errorMessage: e});
	}

}


module.exports.rateApplicationValidation = [
	check('id', 'The id of the application doesnt exist!').exists(),
	check('rate', 'The rate doesnt exist').isNumeric().exists(),
];


module.exports.rateApplication = async (req,res) => {
	try{	
		let foundedUser = await LoginController.tokenToUser(req.headers.authorization);
		let foundedApplication = await Application.findByPk(req.query.id);

		let rate = req.query.rate;

		if(rate < 1 || rate > 5) throw "Rate must be between 1 and 5";
		if(!foundedApplication) throw "There is no application!";
		if(foundedUser.id != foundedApplication.student_id)
			throw "It is not yours application to rate it!";

		if(foundedApplication.accepted == null)
			throw "You must be accepted to rate this application!";


		let nowTime = moment();
		let hiredAt = moment(foundedApplication.accepted);
		let diffInDays = nowTime.diff(hiredAt, 'days');
		console.log('Diff in days ' + diffInDays);

		if(diffInDays < 30)
			throw "It needs to pass 30 days before you rate it!";

		if(foundedApplication.rate)
			throw "This application has already been rated!";


		foundedApplication.rate = rate;
		foundedApplication.save();

		res.json({
			successMessage: 'You have rated your application!',
			application: foundedApplication
		})

	}
	catch(e){
		console.log(e);
		res.status(403).json({errorMessage: e});
	}


}