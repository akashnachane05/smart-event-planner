const Event = require('../models/event');
const { getWeatherForecast, kelvinToCelsius } = require('../services/weatherService');
const { scoreWeather } = require('../utils/weatherScoring');

// Create Event
exports.createEvent = async (req, res) => { // add check for already exi
// Check if event already exists
  const existingEvent = await Event.find({ name: req.body.name, date: req.body.date });
  if (existingEvent.length > 0) {
    return res.status(400).json({ message: 'Event already exists for this date' });
  }
  try {
    const { name, location, date, eventType } = req.body;
    const newEvent = new Event({ name, location, date, eventType });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
};


// POST /events/:id/weather-check


exports.checkWeatherForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const date =event.date;
    console.log("Event Date (formatted):", date);

    let forecast;
    try {
      forecast = await getWeatherForecast(event.location,event.date);
    } catch (error) {
      if (error.message === 'city not found') {
        return res.status(400).json({ message: 'Invalid location. City not found in weather API.' });
      }
      return res.status(500).json({ message: error.message });
    }

    //Protect against missing list
    if (!forecast || !forecast.list) {
      return res.status(500).json({ message: 'No forecast data returned from weather API' });
    }

    const matched = forecast.list.find(item => item.dt_txt.startsWith(date));
    if (!matched) {
      return res.status(404).json({
        message: 'Weather forecast not available for this date. Use a date within the next 5 days.'
      });
    }

    const weather = {
      temperature: kelvinToCelsius(matched.main.temp),
      precipitation: matched.pop * 100,
      windSpeed: matched.wind.speed,
      description: matched.weather[0].description
    };
    event.weather = weather;
    await event.save();
    res.status(200).json({ message: 'Weather data added', weather });

  } catch (err) {
    console.error('Unexpected error:', err.message);
    return res.status(500).json({ message: 'Unexpected server error', error: err.message });
  }
};






// GET /events/:id/suitability
exports.getSuitability = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { score, suitability, category } = scoreWeather(event.weather, event.eventType);
    event.suitability = suitability;
    await event.save();

    res.status(200).json({ score, suitability,eventType: event.eventType, category });
  } catch (error) {
    res.status(500).json({ message: 'Failed to score event', error });
  }
};

exports.getAlternativeDates = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const forecast = await getWeatherForecast(event.location);
    const results = [];

    forecast.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      const existing = results.find(r => r.date === date);
      if (!existing) {
        const weather = {
          temperature: kelvinToCelsius(item.main.temp),
          precipitation: item.pop * 100,
          windSpeed: item.wind.speed,
          description: item.weather[0].description
        };

        const { score, suitability } = scoreWeather(weather, event.eventType);
        results.push({ date, score, suitability, weather });
      }
    });

    const sorted = results.sort((a, b) => b.score - a.score);
    const betterDates = sorted.filter(day => day.suitability === 'Good' && day.date !== event.date);

    if (betterDates.length === 0) {
      return res.status(200).json({ message: 'No better alternatives found for the week.' });
    }

    res.status(200).json({ alternatives: betterDates.slice(0, 3) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get alternatives', error });
  }
};

