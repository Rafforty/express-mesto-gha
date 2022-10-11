const router = require('express').Router();

const {
  getUsers, getUserById, patchUser, patchAvatar, getUserInfo,
} = require('../controllers/users');

const { validationUser, validationUserId, validationAvatar } = require('../middlewares/validation');

router.get('/users/me', getUserInfo);
router.get('/users', getUsers);
router.get('/users/:userId', validationUserId, getUserById);
router.patch('/users/me', validationUser, patchUser);
router.patch('/users/me/avatar', validationAvatar, patchAvatar);

module.exports = router;
