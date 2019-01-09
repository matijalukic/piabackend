const Sequelize = require('sequelize');
const { check, validationResult } = require('express-validator/check');
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
];

/**
 * New Fair has been created on post request
 */
module.exports.newfair = async function(req, res){
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
	  return res.status(422).json({ errors: errors.array() });
	}

	try{
		let startDate = new Date(req.query.start);
		let endDate = new Date(req.query.end);
		// date check
		if(startDate >= endDate)
			throw "Ending time is before start time!";

		// return error if the latest fair has not ended
		await Fair.findOne({
			where: { end: { $gt: new Date().toISOString() } }
		}).then((latestFair) => {
			if(latestFair){
				throw "The latest fair is still going!";
			}

			else // Create fair if there is no fairs that are still going
					
					Fair.create({
						name: req.query.name,
						start: req.query.start,
						end: req.query.end,
						place: req.query.place,
						about: req.query.about,
					});
					res.status(200).json({ successMessage: 'The Fair has been created!'});
			
				
				
		
		});
	
	}
	catch(err){
		res.status(402).json({ errorMessage: err});
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
			})
			.catch(err => {
				throw err;
			});
		}

		

		res.json({ success: 'The packages has been imported!'});


	}
	catch(err){
		return res.status(422).json({ errorMessage: err });
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