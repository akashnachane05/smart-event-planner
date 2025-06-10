const express = require('express');
const router = express.Router();
const { getCacheStatus } = require('../utils/cache');

router.get('/status', (req, res) => {
  const status = getCacheStatus();
  res.json({ cacheCount: status.length, entries: status });
});

module.exports = router;