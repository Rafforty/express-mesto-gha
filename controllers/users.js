const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      res.status(500).send({ message: `Ошибка по умолчанию. Подробнее: ${err.message}` });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные при создании. Подробнее: ${err.message}` });
      } else {
        res.status(500).send({ message: `Ошибка по умолчанию. Подробнее: ${err.message}` });
      }
    });
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные при создании. Подробнее: ${err.message}` });
      } else {
        res.status(500).send({ message: `Ошибка по умолчанию. Подробнее: ${err.message}` });
      }
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные при обновлении профиля. Подробнее: ${err.message}` });
      } else {
        res.status(500).send({ message: `Ошибка по умолчанию. Подробнее: ${err.message}` });
      }
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные при обновлении аватара. Подробнее: ${err.message}` });
      } else {
        res.status(500).send({ message: `Ошибка по умолчанию. Подробнее: ${err.message}` });
      }
    });
};
