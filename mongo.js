let Person = {}
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const getURL = pwd => `mongodb+srv://fullstack:${pwd}@cluster0.fvr2y.mongodb.net/phonebook?retryWrites=true&w=majority`
const connectToDatabase = url => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    const personSchema = new mongoose.Schema({
        name: {
            type: String,
            minlength: 3,
            required: true,
            unique: true,
        },
        phone: {
            type: Number,
            minlength: 8,
            required: true
        },
    });
    personSchema.plugin(uniqueValidator);
    Person = mongoose.model('Person', personSchema);
}

const getAllPersons = () => {
    Person.find({}).then(res => {
        console.log("Phonebook:");
        res.forEach(person => console.log(`${person.name} ${person.phone}`));
        mongoose.connection.close();
    })
}

const addPerson = (name, phone) => {
    const person = new Person({
        name,
        phone
    })
    person.save().then(res => {
        console.log(`${res.name} with number ${res.phone} has been added to the database`);
        mongoose.connection.close()
    })
}

if (process.argv.length < 3) {
    console.log("Please enter your password as an argument: node mongo.js <password>")
} else if (process.argv.length === 3) {
    console.log("Printing all database entries")
    const pwd = process.argv[2];
    connectToDatabase(getURL(pwd));
    getAllPersons();
} else if (process.argv.length === 5) {
    const pwd = process.argv[2];
    const name = process.argv[3];
    const phone = Number(process.argv[4]);
    connectToDatabase(getURL(pwd));
    addPerson(name, phone);
} else {
    console.log("Invalid input.")
}

