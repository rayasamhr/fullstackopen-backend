//Make environment variables globally available
require('dotenv').config()

const Person = require('./models/person')
const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 3004

const app = express()

//Enables cross origin resource sharing requests
app.use(cors())

app.use(express.static('build'))

//Parses incoming request with JSON payloads and translates
//it to JSON object (so you can use methods like request.body)
app.use(express.json())

//Prints details of incoming HTTP requests to console
const morgan = require('morgan')
const { request, response } = require('express')
morgan.token('contents', (request, result) => JSON.stringify(request.body))
app.use(morgan(':method :url :status - :response-time ms :contents'))

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(personList => {
            console.log("Fetching all persons...")
            response.json(personList)
        })
        .catch(err => next(err))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.phone || !body.name) {
        console.log('Number is', body.phone)
        console.log('Name is', body.name)
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        name: body.name,
        phone: body.phone,
    })
    person.save()
        .then(savedPerson => {
            console.log("Uploading new person, name:", savedPerson.name)
            response.json(savedPerson)
        })
        .catch(err => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(personRes => {
            if (personRes) {
                response.json(personRes)
            } else {
                response.status(404).end();
            }
        }).catch(err => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndUpdate(request.params.id, request.body, { new: true })
        .then(updatedNote => response.json(updatedNote))
        .catch(err => next(err));
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.deleteOne({
        "_id": id
    }).then(res => response.status(204).end())
        .catch(err => next(err))
})


app.get('/info', (request, response) => {
    Person.countDocuments({})
        .then(res => {
            response.send(`
                <div>
                    <p>
                        Phonebook has info for ${res} people
                    </p>
                    <p>
                        ${new Date().toUTCString()}
                    </p>
                </div>
            `)
        });
})

//Handles all other endpoints that have not been defined
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown Endpoint' })
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted ID' });
    }
}

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})