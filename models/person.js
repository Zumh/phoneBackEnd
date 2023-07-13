// import mongoose library
const mongoose = require('mongoose');

// check if only password then show all the data 
/*
if (process.argv.length < 3){
	console.log('give password as arugment');
	process.exit(1);
} 
*/

// node mongo.js password name number
// node mongo.js password
// we can extract password here
//const password = process.argv[2]

// get the uri 


// make it less strict with Query for simplicity sake
mongoose.set('strictQuery', false);
// getting the url from environment
const url = process.env.MONGODB_URI;

mongoose.connect(url)
.then(result=> {
	console.log('connected to MongoDB');
})
.catch((error) => {
	console.log('error connecting to MongoDB:', error.message);
});
// phone number validtor 
const phoneValidator = {
	validator: (number) => {
		const match = number.match(/^(\d{2,3})-(\d+)$/);
		if (!match) return false;
		console.log(match[1]);
		return match[1].length + match[2].length >= 8;
	},
	message: props => `${props.value} is not a valid phone number!`
}

// setting schema
const personSchema = new mongoose.Schema({
		name: {
			type: String,
			minLength: 3,
			required: true
		},
		number: {
			type: String,
			validate: phoneValidator,
			required: true,
		},
		
});

// eliminate the id and version number for personschema
personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
	
		delete returnedObject._id;
		delete returnedObject.__v; 
	} 
});

// create the person schema 
// Person == persons from MongoDBAtlas 
/*
const Person = mongoose.model('Person', personSchema);

if (process.argv.length > 2) {

	const inputName = process.argv[2];
	const inputNumber = process.argv[3];
	
	// we have to set up the data
	const newPerson = new Person({
		name: inputName,
		number: inputNumber
	});
	// save the data and close connection 
	newPerson.save().then(result => {
		console.log(`added ${inputName} ${inputNumber} to phonebook`);

		
		mongoose.connection.close();
	});

} else {
	console.log('phonebook:');
	// extract all the info from database
	Person.find({}).then(persons => {
		persons.forEach( person => {
			console.log(`${person.name} ${person.number}`);
		});
		mongoose.connection.close();
	});
}

*/

module.exports = mongoose.model('persons', personSchema);
