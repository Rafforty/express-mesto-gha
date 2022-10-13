const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError404 = require('../errors/NotFoundError404');
const BadRequestError400 = require('../errors/BadRequestError400');
const ConflictError409 = require('../errors/ConflictError409');
const UnauthorizedError401 = require('../errors/UnauthorizedError401');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError404('Пользователь с указанным _id не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400(`Проверьте введенные данные. Ошибка - ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => {
      res.status(201).send({
        data: {
          name, about, avatar, email,
        },
      }).end();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError400(`Проверьте введенные данные. Ошибка - ${err.message}`));
      } else if (err.code === 11000) {
        next(new ConflictError409('Пользователь с таким Email уже зарегистрирован. Попробуйте другой Email.'));
      } else {
        next(err);
      }
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError404('Пользователь с указанным _id не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError400(`Проверьте введенные данные. Ошибка - ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError404('Пользователь с указанным _id не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError400(`Проверьте введенные данные. Ошибка - ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError404('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'dev-secret');
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UnauthorizedError401('Неправильная почта или пароль.'));
      } else {
        next(err);
      }
    });
};
