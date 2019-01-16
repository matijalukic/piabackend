const Sequelize = require('sequelize');
const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');


const Config = require('../config.json');
const fairs = require('../models/fairs.js');
const packages  = require('../models/packages.js')
const additionals  = require('../models/additionals.js');
const items  = require('../models/items.js');
const locations  = require('../models/locations.js');


const sequelize = new Sequelize(Config.db, Config.username, Config.password, {dialect: Config.dialect});

const Fair = new fairs(sequelize, Sequelize);
const Additional = new additionals(sequelize, Sequelize);
const Item = new items(sequelize, Sequelize);
const Package = new packages(sequelize, Sequelize);
const Locat = new locations(sequelize, Sequelize);

/**
 * Validation rules for inserting new fair
 */
module.exports.newfairValidation = [
	check('name', 'Name of the fair doesnt exist').exists(),
	check('start', 'Start date is not valid').exists().isISO8601(),
	check('end', 'End date is not valid').exists().isISO8601(),
	check('place', 'Place is not valid').exists(),
	check('about', 'About value is not valid').exists(),
	// check('startCV', 'Start CV date is invalid').isISO8601().isEmpty(),
	// check('endCV', 'End CV date is invalid').isISO8601().isEmpty(),
	// check('startParticipate', 'Start Participate date is invalid').isISO8601().isEmpty(),
	// check('endParticipate', 'End Participate CV date is invalid').isISO8601().isEmpty(),
];


module.exports.newFairFilter = [

];

/**
 * New Fair has been created on post request
 */
module.exports.newfair = async function(req, res){
	const errors = validationResult(req);


	if (!errors.isEmpty()) {
	  return res.status(422).json({ errors: errors.array() });
	}

	// sanitize values 
	if(req.body.startCV === "")
		req.body.startCV = null;

	if(req.body.endCV === "")
		req.body.endCV = null;

		
	if(req.body.startParticipate === "")
		req.body.startParticipate = null;

	
	if(req.body.endParticipate === "")
		req.body.endParticipate = null;

	try{
		let startDate = new Date(req.body.start);
		let endDate = new Date(req.body.end);
		// date check
		if(startDate >= endDate)
			throw "Ending time is before start time!";

		// return error if the latest fair has not ended
		let latestFair = await Fair.findOne({
			where: { end: { $gt: new Date().toISOString() } }
		});
		
		if(latestFair){
			throw "The latest fair is still going!";
		}

		else{ // Create fair if there is no fairs that are still going
			let newFair = await Fair.create(req.body);

			if(newFair)
				res.status(200).json(
					{
						newInsertedFair: newFair,  
						successMessage: 'The Fair has been created!'
					});
			else 
				res.status(403).json({errorMessage: 'The Fairs has not been inserted'});
		}
	
	}
	catch(err){
		res.status(403).json({ errorMessage: err});
	}	
}

/**
 * Getting image from the folder
 */
module.exports.getImage = (req, res, next) => {
	let imageName = req.query.name;
	console.log('Searching for image: ' + imageName);
	try{
		var options = {
			root: __dirname + '/../images/',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		  };

		  if(!fs.existsSync('./images/' + imageName))
		  	throw "Image not founded";

		res.status(200).sendFile(imageName, options, (err) => {
			if(err)
				next(err);
			else 
				console.log('It\'s with the file!'); 
			// if(err)
			// 	next(err)
			// 	else 
			// throw err;
		});
	}
	catch(err){
		res.status(404).json({
			errorMessage: 'There is no image under that name!' + err
		})
	}
}

/**
 * Validation rules for inserting new packages
 */
module.exports.newpackagesValidation = [
	check('fair_id').exists()
];

module.exports.newpackages = async function(req, res){
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
	  return res.status(422).json({ errors: errors.array() });
	}


	try{
		let currentFair;

		await Fair.findOne({
			where: { id: req.query.fair_id }
		})
		.then(
			(response) => {
				if(response){
					currentFair = response;
				}	
				else throw "There is no Fair under that id";
			}
		);

		
		// fair is set 
		let packages = req.body.Packages;
		let additionals = req.body.Additional;

		// for each package
		for(let currentPackage of packages){
			let maxCompanies = currentPackage.MaxCompanies;
			
			if(currentPackage.MaxCompanies == '-')
				maxCompanies = -1;

			// Insert package
			await Package.create(
				{
					title: currentPackage.Title,
					video_promotion: currentPackage.VideoPromotion,
					no_lessons: currentPackage.NoLessons,
					no_presentation: currentPackage.NoPresentation,
					no_workchops: currentPackage.NoWorkchops,
					price: currentPackage.Price,
					max_companies: maxCompanies,
					fair_id: req.query.fair_id
				}
			).then(
				(createdPackage) => {
					// create items of the package
					let itemsOfPackage = currentPackage.Content;

					for(let currentItem of itemsOfPackage){
						Item.create(
							{
								package_id: createdPackage.id, 
								title: currentItem
							}
						);
					}

				}
			).catch(function(err){
				throw err;
			});

		}


		// for each additional item 
		for(let currentAdditional of additionals){
			await Additional.create({
				title: currentAdditional.Title,
				price: currentAdditional.Price,
				fair_id: req.query.fair_id
			})
			.catch(err => {
				throw err;
			});
		}

		

		res.json({ successMessage: 'The packages has been imported!'});


	}
	catch(err){
		console.log('Importing packages errror:' + err);
		return res.status(403).json({ errorMessage: err });
	}
}


/**
 * Import fairs JSON 
 */
module.exports.importFairs = async function(req, res){
	let importedFairs = req.body.Fairs;
	let importedLocations = req.body.Locations;

	try{
		// import fairs 
		for(let importingFair of importedFairs){

			await Fair.create({
				name: importingFair.Fair,
				start: Date.parse( importingFair.StartDate + ' ' + importingFair.StartTime),
				end: Date.parse(importingFair.EndDate + ' ' + importingFair.EndTime),
				place: importingFair.Place,
				about: importingFair.About
			})
			.then(
				(insertedFair) => {
					if(insertedFair){
						// find locations for this fair 
						let locationsOfFair = importedLocations.find(f => f.Place == insertedFair.place);
						
						// for each place of location of fair
						for(let importingLocation of locationsOfFair.Location){
							// insert location
							Locat.create({
								name: importingLocation.Name,
								fair_id: insertedFair.id
							})
							.then(
								(success) => 
								{
									console.log('Place imported')
								}, 
								(error) => {
									console.log('Place not imported');
									throw error;
								}
							);
						}
						
					}

				},
				(error) => {
					throw error;
				}
			)
			.catch((err) => { 
				console.log('Promise rejected:' + err);
			});
		}
		
		

		return res.json({ success: 'The fairs has been imported!'});

	}
	catch(err){
		return res.status(422).json({ errorMessage: err });
	}

}

/**
 * 	Upload Image of fair
 * 	@return { imageName: $path }
 */
module.exports.uploadImage = function(req, res){
	let returnedFile;
	let form = new IncomingForm();
	let everythingOk = true;

	// when the file is received
	form.on('file', (field, file) => {
		let allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

		// if the type of the file is not allowed
		if(allowedTypes.indexOf(file.type) == -1){
			console.log('Type is not allowed: ' + file.type + '!');
			
			// remove file from the temp
			fs.unlinkSync(file.path);
			everythingOk = false;
		}
		// file is allowed type
		else {
			// move from TMP folder to this folder
			fs.renameSync(file.path, './images/' + file.name, (err) => {
				res.status(403).json({errorMessage: 'File didnt upload!'});
				console.log(err);
			})

			returnedFile = file.name;
			console.log('File uploaded' + returnedFile);
		}
	
	});

	form.on('error', function(err) {
		res.status(403).json({errorMessage: `Didn't received the files: ${err}` });
	});

	form.on('end', () => {
		if(everythingOk)
			res.status(200).json({imageName: returnedFile, successMessage: 'Uspesno ste dodali fajl!'});
		else 
			res.status(403).json({errorMessage: 'Nedozvoljena ekstenzija!'});

	});

	form.parse(req);
} 
