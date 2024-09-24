const { validationResult } = require("express-validator");
const { validateMessage } = require('../config/validator');
const db = require('../db/queries');
const { tryCatch } = require('../utils/tryCatch');
const { customError } = require('../utils/customErrors');

const postCreateMessage = [
    validateMessage,
    tryCatch(
        async (req, res, next) => {
            if(!req.user){
                return next(new customError('You are not authenticated', 400));
            }

            const validationErrors = validationResult(req);
            if(!validationErrors.isEmpty()){
                res.status(400).render('index', {
                    errors: validationErrors.array(),
                });
                return;
            }
            console.log(req.body.message);

            if(!req.user.member){
                return next(new customError('You need to be a member to post messages', 400));
            }

            //insert message on db
            const { message } = req.body;
            await db.createMessage(message, req.user.id);

            res.redirect('/');
        }
    )
];

const postDeleteMessage = async (req, res, next) => {
    if(!req.user){
        return next(new customError('You are not authenticated', 400));
    }

    if(!req.user.admin){
        return next(new customError('You are not an admin', 400));
    }

    console.log(req.params.id);
    await db.deleteMessage(req.params.id);
    res.redirect('/');
}

const postLikeMessage = async (req, res, next) => {

    if(!req.user){
        return next(new customError('You are not authenticated', 400));
    }

    if(!req.user.member){
        return next(new customError('You are not a member', 400));
    }

    const referer = req.get('referer');
    await db.increaseLikes(req.params.id);

    if(referer.includes('/comments/message/')){
        return res.redirect(`/comments/message/${req.params.id}`);
    }

    res.redirect('/');
}
const getComments = async (req, res, next) => {

    const results = await Promise.all([db.getMessage(req.params.id), db.getMessageComments(req.params.id)]);
    const message = results[0][0];
    const comments = results[1];
    console.log("🚀 ~ getComments ~ comments:", comments)
    
    res.render('comments', {msg: message, comments: comments});
}

const postCreateComment = [
    validateMessage,
    tryCatch(
        async (req, res, next) => {
            if(!req.user){
                return next(new customError('You are not authenticated', 400));
            }

            const validationErrors = validationResult(req);
            if(!validationErrors.isEmpty()){
                res.status(400).redirect(`/comments/message/${req.params.id}`);
                return;
            }

            if(!req.user.member){
                return next(new customError('You need to be a member to post messages', 400));
            }

            const { message } = req.body;
            await db.insertComment(req.user.id, req.params.id, message);

            res.redirect(`/comments/message/${req.params.id}`);
        }
    )
];

const postDeleteComment = async (req, res, next) => {
    if(!req.user){
        return next(new customError('You are not authenticated', 400));
    }

    if(!req.user.admin){
        return next(new customError('You are not an admin', 400));
    }

    const {message_id, id} = req.params;

    await db.deleteComment(id);
    res.redirect(`/comments/message/${message_id}`);
}

module.exports = {
    postCreateMessage,
    postDeleteMessage,
    postLikeMessage,
    getComments,
    postCreateComment,
    postDeleteComment
}
