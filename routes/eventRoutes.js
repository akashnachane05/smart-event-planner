const express = require('express');
const router = express.Router();
const { getSuitability } = require('../controllers/eventController');
const { getAlternativeDates } = require('../controllers/eventController');
const {checkWeatherForEvent}= require('../controllers/eventController');
const {
  createEvent,
  getAllEvents,
  updateEvent
} = require('../controllers/eventController');

router.post('/', createEvent);         // POST /events
router.get('/', getAllEvents);         // GET /events
router.put('/:id', updateEvent);       // PUT /events/:id
router.get('/:id/suitability', getSuitability); // GET /events/:id/suitability
router.get('/:id/alternatives', getAlternativeDates); // GET /events/:id/alternatives
router.post('/:id/weather-check',checkWeatherForEvent);

module.exports = router;
