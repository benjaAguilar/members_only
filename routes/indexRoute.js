const { Router } = require('express');
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');
const { tryCatch } = require('../utils/tryCatch');
const router = Router();

router.get('/', tryCatch(indexController.getIndex));

//sing up
router.get('/sign-up', tryCatch(indexController.getSignUp));

router.post('/sign-up', userController.postSingUser);

//log-in 
router.get('/log-in', tryCatch(indexController.getLogIn));

router.post('/log-in', tryCatch(userController.postLogUser));

//logout
router.get('/log-out', tryCatch(userController.getLogOutUser));

//member
router.get('/member', tryCatch(indexController.getMember));

router.post('/member', userController.postGiveMembership);

router.post('/member-remove', userController.postRemoveMembership);

//admin
router.get('/admin', tryCatch(indexController.getAdmin));

router.post('/admin', userController.postGiveAdmin);

router.post('/admin-remove', userController.postRemoveAdmin);

//message
router.post('/post-msg', messageController.postCreateMessage);

router.post('/delete-message/:id', tryCatch(messageController.postDeleteMessage));

router.post('/like-message/:id', tryCatch(messageController.postLikeMessage));

router.get('/comments/message/:id', tryCatch(messageController.getComments));

router.post('/comments/message/:id', messageController.postCreateComment);

router.post('/message/:message_id/delete-comment/:id', tryCatch(messageController.postDeleteComment));

module.exports = router;