const { Router } = require('express');
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const { tryCatch } = require('../utils/tryCatch');
const router = Router();

router.get('/', tryCatch(indexController.getIndex));

router.get('/sign-up', tryCatch(indexController.getSignUp));

router.get('/log-in', tryCatch(indexController.getLogIn));

router.post('/sign-up', userController.postSingUser);

router.post('/log-in', tryCatch(userController.postLogUser));

router.get('/log-out', tryCatch(userController.getLogOutUser));

module.exports = router;