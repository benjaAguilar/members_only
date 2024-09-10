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
]

module.exports = {
    postCreateMessage
}
