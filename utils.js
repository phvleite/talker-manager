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

// const validateNamePrice = (req, res, next) => {
//   const { name, price } = req.body;
//   if (!name || name === '') return res.status(400).json({ message: 'Invalid data!' });
//   if (!price || price <= 0) return res.status(400).json({ message: 'Invalid data!' });

//   next();
// };

module.exports = {
  consoleReq,
  getDataFile,
  setDataFile,
  generateToken,
  authMiddleware,
};
