const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const PORT = process.env.PORT || 3004
let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        phone: "0810-0000-1111"
    },
    {
        id: 2,
        name: "Giovanni",
        phone: "9999-9999-9999"
    },
    {
        id: 3,
        name: "Romanoff",
        phone: "6666666666"
    },
    {
        id: 5,
        name: "Liberte",
        phone: "83238767"
    }
]

const morgan = require('morgan')
morgan.token('contents', (request, result) => JSON.stringify(request.body))
app.use(morgan(':method :url :status - :response-time ms :contents'))

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

const generateId = () => {
    return getRandomIntInclusive(0, 12000);
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
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

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: `${body.name} already exists in the phonebook`
        })
    }

    const person = {
        name: body.name,
        phone: body.phone,
        id: generateId(),
    }
    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
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