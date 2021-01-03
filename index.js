//Make environment variables globally available
require('dotenv').config()

const Person = require('./models/person')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const PORT = process.env.PORT || 3004

const morgan = require('morgan')
morgan.token('contents', (request, result) => JSON.stringify(request.body))
app.use(morgan(':method :url :status - :response-time ms :contents'))

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(personList => {
            console.log("Fetching all persons...")
            response.json(personList)
        })
        .catch(err => console.log("ERROR GETTING ALL PERSONS", err))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.phone || !body.name) {
        console.log('Number is', body.phone)
        console.log('Name is', body.name)
        return response.status(400).json({
            error: 'content missing'
        })
    }

    // if (persons.some(person => person.name === body.name)) {
    //     return response.status(400).json({
    //         error: `${body.name} already exists in the phonebook`
    //     })
    // }

    const person = new Person({
        name: body.name,
        phone: body.phone,
    })
    person.save()
        .then(savedPerson => {
            console.log("Uploading new person, name:", savedPerson.name)
            response.json(savedPerson)
        })
        .catch(err => console.log('ERROR POSTING:', err))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(personRes => {
            console.log("Found", personRes)
            response.json(personRes)
        }).catch(err => {
            console.log(err);
            response.status(500).end()
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.deleteOne({
        "_id": id
    }).then(res => response.status(204).end())
        .catch(err => console.log(err))
})


app.get('/info', (request, response) => {
    response.send(`
    <p>
        Phonebook has info for ${persons.length} people
    </p>
    <p>
        ${new Date().toUTCString()}
    </p>`)
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})