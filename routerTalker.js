const express = require('express');
const rescue = require('express-rescue');

const router = express.Router();
const {
  authMiddleware,
  getDataFile,
  setDataFile,
  validateTalkerName,
  validateTalkerAge,
  validateTalkerTalkWatchedAt,
  validateTalkerTalkRate, 
  validateTalkerTalk } = require('./utils');

const dbTalker = 'talker';

// router.use(authMiddleware);

router.get('/', rescue(async (_req, res) => {
  const talkers = await getDataFile(dbTalker);

  res.status(200).json(talkers);
}));

router.get('/:id', rescue(async (req, res) => {
  const { id } = req.params;
  const talkers = await getDataFile(dbTalker);
  const talker = talkers.find((r) => r.id === Number(id));
  
  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  
  res.status(200).json(talker);
}));

router.post('/',
  authMiddleware,
  validateTalkerName,
  validateTalkerAge,
  validateTalkerTalk,
  validateTalkerTalkWatchedAt,
  validateTalkerTalkRate,
  rescue(async (req, res) => {
  const { name, age, talk } = req.body;

  const talkers = await getDataFile(dbTalker);
  
  const id = Number(talkers[talkers.length - 1].id) + 1;

  talkers.push({ id, name, age, talk });

  await setDataFile(dbTalker, talkers);

  res.status(201).json({ id, name, age, talk });
}));

router.put('/:id',
  authMiddleware,
  validateTalkerName,
  validateTalkerAge,
  validateTalkerTalk,
  validateTalkerTalkWatchedAt,
  validateTalkerTalkRate,
  rescue(async (req, res) => {
  const { name, age, talk } = req.body;
  let { id } = req.params;
  id = Number.parseInt(id, 10);

  const talkers = await getDataFile(dbTalker);

  const talkerIndex = talkers.findIndex((tal) => tal.id === id);
  
  if (talkerIndex === -1) return res.status(400).json({ message: 'Registro não encontrado' });
  
  talkers[talkerIndex] = { ...talkers[talkerIndex], name, age, talk };

  await setDataFile(dbTalker, talkers);

  res.status(200).json({ id, name, age, talk });
}));

// router.get('/search', rescue(async (req, res) => {
//   const { name, maxPrice, minPrice } = req.query;
//   const drinks = await getDataFile(dbDrinks);
//   const filteredDrinks = drinks
//     .filter((r) => r.name.toLowerCase()
//     .includes(name.toLowerCase()) && r.price <= Number(maxPrice) && r.price >= Number(minPrice));
  
//   if (filteredDrinks.length === 0) return res.status(404).json({ message: 'Drink not found!'});
  
//   res.status(200).json(filteredDrinks);
// }));

router.delete('/:id', authMiddleware, rescue(async (req, res) => {
  const { id } = req.params;
  const talkers = await getDataFile(dbTalker);
  const talkerIndex = talkers.findIndex((tal) => tal.id === Number(id));
  
  if (talkerIndex === -1) return res.status(404).json({ message: 'Registro não encontrado!' });
  
  talkers.splice(talkerIndex, 1);
  
  await setDataFile(dbTalker, talkers);

  res.status(204).end();
}));

router.use((err, _req, res, _next) => {
  res.status(500).json({ error: `Erro: ${err.message}` });
});

module.exports = router;
