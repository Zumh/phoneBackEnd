// import mongoose library
const mongoose = require('mongoose')



// make it less strict with Query for simplicity sake
mongoose.set('strictQuery', false)
// getting the url from environment
const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


// phone number validtor
const phoneValidator = [
  {
    validator: (number) => {
      return /^(\d{2,3})-(\d+)$/.test(number)
    },
    message: props => `${props.value} is not a valid phone number format!`
  },
  {
    validator: (number) => {
      const match = number.match(/^(\d{2,3})-(\d+)$/)

      if ((match[1].length + match[2].length) < 8) {
        return false
      }
    },
    message: props => `${props.value} does not meet the minimum length requirement!`
  }
]


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

})

// eliminate the id and version number for personschema
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
  }
})



module.exports = mongoose.model('persons', personSchema)
