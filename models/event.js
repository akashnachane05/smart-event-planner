const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: String, // We'll store as YYYY-MM-DD string for easier API matching
    required: true
  },
  eventType: {
    type: String,
    enum: ['Cricket', 'Wedding', 'Hiking', 'Corporate', 'Other'],
    required: true
  },
  suitability: {
    type: String,
    enum: ['Good', 'Okay', 'Poor'],
    default: 'Okay'
  },
  weather: {
    temperature: Number,
    precipitation: Number,
    windSpeed: Number,
    description: String
  }
});

module.exports = mongoose.model('Event', EventSchema);
