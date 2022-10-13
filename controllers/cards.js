const Card = require('../models/card');

const BadRequestError400 = require('../errors/BadRequestError400');
const NotFoundError404 = require('../errors/NotFoundError404');
const ForbiddenError403 = require('../errors/ForbiddenError403');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError400(`Проверьте введенные данные. Ошибка - ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError404('Карточка с указанным _id не найдена'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return card.remove()
          .then(() => res.send({ data: card }));
      }
      return next(new ForbiddenError403('Невозможно удалить чужую карточку.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400(`Проверьте введенные данные. Ошибка - ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError404('Карточка с указанным _id не найдена');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400(`Проверьте введенные данные. Ошибка - ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError404('Карточка с указанным _id не найдена');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400(`Проверьте введенные данные. Ошибка - ${err.message}`));
      } else {
        next(err);
      }
    });
};
