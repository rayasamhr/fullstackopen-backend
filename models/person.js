const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const URL = process.env.MONGODB_URI;

console.log('connecting to', URL);
mongoose.connect(URL,
  {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
  })
  .then((_res) => console.log('Connected to MongoDB'))
  .catch((err) => console.log('ERROR CONNECTING TO MONGODB:', err));

// Sets requirements for the Person model object
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
    required: true,
  },
});
personSchema.plugin(uniqueValidator);

// Defines the toJSON method for the Person model object
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
