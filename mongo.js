// import mongoose library
const mongoose = require('mongoose');

// check if only password then show all the data 
if (process.argv.length < 3){
	console.log('give password as arugment');
	process.exit(1);
} 

// node mongo.js password name number
// node mongo.js password
// we can extract password here
const password = process.argv[2]

// get the uri 

const url = `mongodb+srv://fullstack2023:${password}@cluster0.8vki2oh.mongodb.net/phonebookApp?retryWrites=true&w=majority`;
//
// make it less strict with Query for simplicity sake
mongoose.set('strictQuery', false);
mongoose.connect(url);

// setting schema
const personSchema = new mongoose.Schema({
		name: String,
		number: String,
});


// create the person schema 
// Person == persons from MongoDBAtlas 
const Person = mongoose.model('Person', personSchema);

if (process.argv.length > 3) {

	const inputName = process.argv[3];
	const inputNumber = process.argv[4];
	
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

