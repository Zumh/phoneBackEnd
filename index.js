const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const morgan = require('morgan')


// importing module by using this
const Person = require('./models/person')

/*
The purpose of this function is to handle requests to an unknown endpoint or a page that does not exist on the server.
If a request is made to an unknown endpoint, the function sends a HTTP response with a status code of `404` which means "not found" and a JSON object with an error message "unknown endpoint".
The `send` method sends the response to the client.
This function is typically used in a Node.js server to handle requests to undefined routes or endpoints.
In summary, this code defines a function that returns an error message when a client requests an undefined endpoint on a server.
 */
const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// 3.16: moved error handling of the application to a new error handler middleware.
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// creating morgan token here
morgan.token('data', (request) => {
  // we find the POST requst and stringify request.body to JSON string
  // JSON.stringify turn object to '{"name":"sample9","number":"519-580-7654"}'
  // if we can't find POST then we return empty string

  return request.method === 'POST' ? JSON.stringify(request.body) : ' '
})

// customize to fit with our token base 'data'
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))



app.get('/api/persons', (request, response) => {

  Person.find({}).then(persons => {
    response.json(persons)
  })

})


// 3.18 info handling for updates
app.get('/info', (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.send(
        `<br>Phonebook has info for ${people.length} people</br><br>${new Date()}</br>`
      )
    })
    .catch(error => next(error))
})


//3.18 displaying one person info at a time using :id
app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

})

// 3.17: update database if person name already exist
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const newPerson = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, newPerson,  { new: true, runValidators: true, context: 'query' })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))

})


// 3.15: delete phone data from database
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})





// new entry: save input data from text inbox to database
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savePerson => {
    response.json(savePerson)
  })
    .catch((errorMessage) => next(errorMessage))
})


app.use(unknownEndPoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
