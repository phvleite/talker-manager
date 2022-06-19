const express = require('express');
const rescue = require('express-rescue');

const router = express.Router();
const {
  // authMiddleware,
  getDataFile,
} = require('./utils');

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

// router.get('/search', rescue(async (req, res) => {
//   const { name, maxPrice, minPrice } = req.query;
//   const drinks = await getDataFile(dbDrinks);
//   const filteredDrinks = drinks
//     .filter((r) => r.name.toLowerCase()
//     .includes(name.toLowerCase()) && r.price <= Number(maxPrice) && r.price >= Number(minPrice));
  
//   if (filteredDrinks.length === 0) return res.status(404).json({ message: 'Drink not found!'});
  
//   res.status(200).json(filteredDrinks);
// }));

// router.post('/', validateNamePrice, rescue(async (req, res) => {
//   const { id, name, price } = req.body;
//   const { username } = req.user;
//   const drinks = await getDataFile(dbDrinks);

//   if (drinks.some((drink) => drink.id === id)) {
//     return res.status(409).json({ message: 'id already exist' });
//   }

//   drinks.push({ id, name, price, barman: username });

//   await setDataFile(dbDrinks, drinks);

//   res.status(201).json({ message: 'Drink created sucessfully!' });
// }));

// router.put('/:id', validateNamePrice, rescue(async (req, res) => {
//   const { id } = req.params;
//   const { name, price } = req.body;
//   const drinks = await getDataFile(dbDrinks);
//   const drinkIndex = drinks.findIndex((r) => r.id === Number(id));
  
//   if (drinkIndex === -1) return res.status(404).json({ message: 'Drink not found!' });
  
//   drinks[drinkIndex] = { ...drinks[drinkIndex], name, price };
  
//   await setDataFile(dbDrinks, drinks);

//   res.status(204).end();
// }));

// router.delete('/:id', rescue(async (req, res) => {
//   const { id } = req.params;
//   const drinks = await getDataFile(dbDrinks);
//   const drinkIndex = drinks.findIndex((r) => r.id === Number(id));
  
//   if (drinkIndex === -1) return res.status(404).json({ message: 'Drink not found!' });
  
//   drinks.splice(drinkIndex, 1);
  
//   await setDataFile(dbDrinks, drinks);

//   res.status(204).end();
// }));

router.use((err, _req, res, _next) => {
  res.status(500).json({ error: `Erro: ${err.message}` });
});

module.exports = router;
