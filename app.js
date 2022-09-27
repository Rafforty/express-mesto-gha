const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '633201bb624477b43b25f0fd',
  };

  next();
});

app.use('/', userRoutes);
app.use('/', cardRoutes);
app.use('/', (req, res) => {
  res.send
})

app.listen(PORT);
