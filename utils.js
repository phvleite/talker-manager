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
  if (!authorization || authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido!' });
  }
  next();
};

const regexEmail = new RegExp('[a-z0-9]+@[a-z]+\\.[a-z]{2,3}');

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

module.exports = {
  consoleReq,
  getDataFile,
  setDataFile,
  generateToken,
  authMiddleware,
  validateLogin,
  validateLoginEmail,
  validateLoginPassword,
};
