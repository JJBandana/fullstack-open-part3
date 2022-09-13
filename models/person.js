const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(res => {
        console.log('connected to MongoDB')
    })
    .catch( err => console.log('error connecting to MongoDB:', err.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    number: {
        type: Number,
        required: true,
        minlength: 8
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema)