require('dotenv').config()
const mongoose = require('mongoose')
const express =  require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const { response } = require('express')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (req, res) => res.send('<h1>Working GREAT!<h1>'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => res.json(people))
})

/*
app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})
*/

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(p => {
        if(p){
            res.json(p)
        } else {
            res.status(404).end()
        }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    }).catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    
    const person = {
        name: body.name,
        number: body.number
    }
    
    Person.findByIdAndUpdate(req.params.id, person, {new:true})
    .then(updatedPerson => res.json(updatedPerson))
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    
    person.save()
        .then(savedContact => savedContact.toJSON())
        .then(savedAndFormatted => res.json(savedAndFormatted))
        .catch(err => next(err))
})

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if(error.name === 'CastError'){
        return res.status(400).send({error:'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

    const PORT = process.env.PORT
    app.listen(PORT, () => console.log('Server running on port', PORT))