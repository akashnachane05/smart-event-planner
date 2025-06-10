const axios = require('axios');
const dotenv = require('dotenv');
const { getCache, setCache } = require('../utils/cache');

dotenv.config();

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;


// Converts Kelvin to Celsius
const kelvinToCelsius = (k) => Math.round(k - 273.15);

/**
 * Validate the location using Google Geocoding API
 * Returns true if the location is a valid city
 */
// const validateLocation = async (location) => {
//   if (!location || location.trim().length === 0) {
//     throw new Error('Location is required.');
//   }

//   try {
//     const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
//       params: {
//         address: location,
//         key: GEOCODING_API_KEY,
//       },
//     });

//     const data = response.data;

//     if (data.status === 'OK' && data.results.length > 0) {
//       const result = data.results[0];

//       const isCity =
//         result.types.includes('locality') ||
//         result.address_components.some(c => c.types.includes('locality'));

//       if (isCity) {
//         return true;
//       } else {
//         throw new Error('Location found, but it is not a valid city.');
//       }
//     } else {
//       throw new Error('City not found.');
//     }

//   } catch (err) {
//     throw new Error(`Location validation failed: ${err.message}`);
//   }
// };
const validateLocation = async (location) => {
  if (!location || location.trim().length === 0) {
    throw new Error('Location is required.');
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: location,
        key: process.env.GOOGLE_GEOCODING_KEY,
      },
    });

    const data = response.data;

    if (data.status !== 'OK' || !data.results.length) {
      throw new Error('City not found.');
    }

    const result = data.results[0];

    // Check if the result has 'locality' or equivalent administrative types
    const isCity = result.types.includes('locality') ||
      result.address_components.some(component =>
        component.types.includes('locality') ||
        component.types.includes('administrative_area_level_1') ||
        component.types.includes('administrative_area_level_2')
      );

    if (!isCity) {
      throw new Error('Location found, but it is not a recognized city.');
    }

    return true;

  } catch (err) {
    throw new Error(`Location validation failed: ${err.message}`);
  }
};

/**
 * Get weather forecast for a valid location and date
 */
const getWeatherForecast = async (location, date) => {
  const cacheKey = `${location}_${date}`;
  const cached = getCache(cacheKey);
  if (cached) {
    console.log(`Using cached weather for ${location} on ${date}`);
    return cached;
  }

  await validateLocation(location);

  const response = await axios.get(WEATHER_URL, {
    params: {
      q: location,
      appid: WEATHER_API_KEY,
    },
  });

  const data = response.data;
  setCache(cacheKey, data);
  return data;
};

module.exports = {
  getWeatherForecast,
  kelvinToCelsius,
};
