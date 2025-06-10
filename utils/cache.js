// utils/cache.js

const cache = new Map(); // location_date -> { data, timestamp }

const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours in ms

// Get data from cache if not expired
const getCache = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key); // expire
    return null;
  }

  return cached.data;
};

// Set data in cache
const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// For status check
const getCacheStatus = () => {
  const now = Date.now();
  const result = [];

  for (const [key, value] of cache.entries()) {
    result.push({
      key,
      ageMinutes: Math.round((now - value.timestamp) / 60000)
    });
  }

  return result;
};

module.exports = {
  getCache,
  setCache,
  getCacheStatus
};
