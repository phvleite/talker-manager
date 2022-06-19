const express = require('express');
const bodyParser = require('body-parser');
const { consoleReq } = require('./utils');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.use(consoleReq);

const routerTalker = require('./routerTalker');
const routerLogin = require('./routerLogin');

app.use('/talker', routerTalker);
app.use('/login', routerLogin);

app.listen(PORT, () => {
  console.log('Online');
});
