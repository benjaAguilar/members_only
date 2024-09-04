const { Router } = require('express');
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const router = Router();

router.get('/', indexController.getIndex);

router.get('/sign-up', indexController.getSignUp);

router.get('/log-in', indexController.getLogIn);

router.post('/sign-user', userController.postSingUser);

module.exports = router;