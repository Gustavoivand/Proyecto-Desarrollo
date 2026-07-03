const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
