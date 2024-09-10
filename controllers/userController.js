const { validationResult } = require("express-validator");
const { RecaptchaV2 } = require('express-recaptcha');
const { tryCatch } = require('../utils/tryCatch');
const validation = require('../config/validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../db/queries');
const { customError } = require("../utils/customErrors");

const recaptcha = new RecaptchaV2(process.env.CAPTCHA_SITE, process.env.CAPTCHA_KEY);

const postSingUser = [
    validation.validateCreateUser,
    tryCatch(
        async (req, res, next) => {
            const validationErrors = validationResult(req);
            if(!validationErrors.isEmpty()){
                res.status(400).render('signUp', {
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    password: req.body.password,
                    errors: validationErrors.array(),
                });
                return;
            }
    
            const { username, firstname, lastname, password } = req.body;
    
            bcrypt.hash(password, 10, async (err, hashedPassword) => {
                if(err) {
                    return next(new customError('Internal server Error creating user, please try later', 500));
                } 
                
                await db.createUser(username, firstname, lastname, hashedPassword);

                res.render('logIn');
            });
        })
]

const postLogUser = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
});

const getLogOutUser = (req, res, next) => {
    req.logout((err) => {
        if(err) return next(new customError('Error logging Out, try again', 500));
        res.redirect('/');
    })
}

const postGiveMembership = [
    recaptcha.middleware.verify,
    tryCatch(
        async (req, res, next) => {

            if(req.recaptcha.error){
                return next(new customError('Oh no! seems that you are a Robot!', 400));
            }

            // update db member to true
            await db.toggleMembership(req.user.id, true);

            res.render('index');
        }
    )
]

const postRemoveMembership = tryCatch(
    async (req, res, next) => {
        // update db member to false
        await db.toggleMembership(req.user.id, false);

        res.render('index');
    }
);

module.exports = {
    postSingUser,
    postLogUser,
    getLogOutUser,
    postGiveMembership,
    postRemoveMembership
}