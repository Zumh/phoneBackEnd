const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const morgan = require('morgan');


// importing module by using this 
const Person = require('./models/person');

const errorHandler = (error, request, response, next) => {
	console.error(error.message, "helloworo");
	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id"});

	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message});
	}

	next(error);
};

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

// creating morgan token here 
morgan.token("data", (request) => {
	// we find the POST requst and stringify request.body to JSON string
	// JSON.stringify turn object to '{"name":"sample9","number":"519-580-7654"}'
	// if we can't find POST then we return empty string
	
	return request.method === "POST" ? JSON.stringify(request.body) : " ";
});

// customize to fit with our token base 'data' 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));


// this is for default format
//app.use(morgan('tiny'));

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]


	



/*
// 3.1 Node application that returns a hardcode list of phonebook entries from the address
app.get('/api/persons', (request, response) => {
	response.json(persons);
});
*/

app.get('/api/persons', (request, response) => {
	
	Person.find({}).then(persons => {
		response.json(persons);
	})
	
});

// 3.2 request was recieved and how many entries are in the phone book
/*app.get('/info', (request, response) => {
	// request was recieved 
	// how many entires 
	response.send(
	`<br>Phonebook has info ${persons.length} people</br><br>${new Date()}</br>`);
});*/
// 3.18 info handling for updates 
app.get('/info', (request, response, next) => {
	Person.find({})
	.then((people) => {
		response.send(
			`<br>Phonebook has info for ${people.length} people</br><br>${new Date()}</br>`
		);
	})
	.catch(error => next(error));
});

//3.3 functionality for displaying the information for single phonebook entry.
//if not found then send status code 
/*app.get('/api/persons/:id', (request, response) => {
	// get the id number from the url or params string and convert it to integer
	const id = Number(request.params.id);

	// find the person 
	const person = persons.find(person => person.id == id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}

});
*/
//3.18 displaying one person info at a time using :id
app.get('/api/persons/:id', (request, response, next) => {

	Person.findById(request.params.id)
	.then(person => {
		if (person) {
			response.json(person);
		} else {
			response.status(404).end();
		}
	})
	.catch(error => next(error));

});

// 3.17: update database if person name already exist 
app.put("/api/persons/:id", (request, response, next) => {
	const body = request.body;
	const newPerson = {
		name: body.name,
		number: body.number,  
	} 

	Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
	.then(updatePerson => {
		response.json(updatePerson)
	})
	.catch(error => next(error));

});

// 3.4 functionality that make it possible to delete a single phonebook entry by HTTP DELETE
/*app.delete('/api/people/:id', (request, response) => {
	// find the person and delete 
	const id = Number(request.params.id);

	// simply regenerate a new list of persons here 
	// let the garbage collector taker of deleting object 
	persons = persons.filter(person => person.id != id);

	response.status(204).end();
});
*/
// 3.15: delete phone data from database 
app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
	.then(result => {
		response.status(204).end()
	})
	.catch(error => next(error));
});



// 3.5 functionality for adding new phonebook entries to http://localhost:3001/api/persons.
/*
app.post('/api/people', (request, response) => {
	const body = request.body;
	let message = "";
	// if body is missing content then return rerror message 
	if (!body.name){
		message = "name is missing";
	} else if (!body.number){
		message = "number is missing";
	} else if ( persons.find(person => person.name == body.name)){
		message = "name already exists";
	} 
	if (message){
		
		return response.status(400).json({
			error: message
		});

	} else {
		// prepare person info
		const person = {...body, id: generatedId()};
		persons = persons.concat(person);
		response.json(body);		
	}

});
*/

// new entry: save input data from text inbox to database 
app.post('/api/persons', (request, response) => {
	const body = request.body;
	const person = new Person({
			name: body.name,
			number: body.number,
	});

	person.save().then(savePerson => {
		response.json(savePerson);
	})
	.catch((errorMessage) => next(errorMessage));
});

// generated id number for persons
/*
const generatedId = () => {
	const maxId = (persons.length > 0 ? Math.max(...persons.map(person => person.id)): 0) + 1;

	
	const minId = persons.length > 0 ? Math.min(...persons.map(person => person.id)): 0;
	var randomId = 0;
	do {
		randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
	} while (persons.map(person => person.id).includes(randomId));
	return randomId;

}
*/

/*
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
*/

app.use(errorHandler);

const PORT = process.env.PORT; 
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});
