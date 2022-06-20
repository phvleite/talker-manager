const express = require('express');
const rescue = require('express-rescue');

const router = express.Router();

const {
  generateToken,
  validateLoginEmail,
  validateLoginPassword } = require('./utils');

router.post('/',
  validateLoginEmail,
  validateLoginPassword,
  rescue((_req, res) => {
  const token = generateToken();

  res.status(200).json({ token });
}));

router.use((err, _req, res, _next) => {
  res.status(500).json({ error: `Erro: ${err.message}` });
});

module.exports = router;
