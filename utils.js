const fs = require('fs/promises');
const crypto = require('crypto');

const getDataFile = (dataFile) => fs.readFile(`./${dataFile}.json`, 'utf-8')
    .then((fileContent) => JSON.parse(fileContent));

const setDataFile = (dataFile, newDataFile) => fs
  .writeFile(`./${dataFile}.json`, JSON.stringify(newDataFile));

const consoleReq = (req, _res, next) => {
  console.log('req.method:', req.method);
  console.log('req.path:', req.path);
  console.log('req.params:', req.params);
  console.log('req.query:', req.query);
  console.log('req.headers:', req.headers);
  console.log('req.body:', req.body);
  next();
};

const generateToken = () => crypto.randomBytes(8).toString('hex');

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if ([email, password].includes(undefined)) {
    return res.status(400).json({ message: 'Os campos "email" e "senha" são obrigatórios!' });
  }

  next();
};

const validateLoginEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });

  const regexEmail = new RegExp('[a-z0-9]+@[a-z]+\\.[a-z]{2,3}');

  if (!regexEmail.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }

  next();
};

const validateLoginPassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });

  if (password.length < 6) { 
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  next();
};

const validateTalkerName = (req, res, next) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });

  if (name.length < 3) { 
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const validateTalkerAge = (req, res, next) => {
  const { age } = req.body;

  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });

  if (Number(age) < 18) { 
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
};

const validateTalkerTalk = (req, res, next) => {
  const { talk } = req.body;

  if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });

  next();
};

const validateTalkerTalkWatchedAt = (req, res, next) => {
  const { watchedAt } = req.body.talk;

  if (!watchedAt) return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });

  const regexDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

  if (!regexDate.test(watchedAt)) { 
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
};

const validateTalkerTalkRate = (req, res, next) => {
  const { rate } = req.body.talk;

  if (!rate && rate !== 0) return res.status(400).json({ message: 'O campo "rate" é obrigatório' });

  if (Number(rate) < 1 || Number(rate) > 5) { 
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  next();
};

module.exports = {
  consoleReq,
  getDataFile,
  setDataFile,
  generateToken,
  authMiddleware,
  validateLogin,
  validateLoginEmail,
  validateLoginPassword,
  validateTalkerAge,
  validateTalkerName,
  validateTalkerTalk,
  validateTalkerTalkWatchedAt,
  validateTalkerTalkRate,
};
