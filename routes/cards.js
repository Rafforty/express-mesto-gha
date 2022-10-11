const router = require('express').Router();

const {
  getCards, postCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const { validationCard, validationCardId } = require('../middlewares/validation');

router.get('/cards', getCards);
router.post('/cards', validationCard, postCard);
router.delete('/cards/:cardId', validationCardId, deleteCard);
router.put('/cards/:cardId/likes', validationCardId, likeCard);
router.delete('/cards/:cardId/likes', validationCardId, dislikeCard);

module.exports = router;
