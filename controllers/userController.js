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
                req.session.feedback = 'User created successfully!';

                res.redirect('/log-in');
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
        req.session.feedback = 'Logged Out successfully';

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
            req.session.feedback = 'You are now a Member!';

            res.redirect('/');
        }
    )
]

const postRemoveMembership = tryCatch(
    async (req, res, next) => {
        // update db member to false
        await db.toggleMembership(req.user.id, false);
        req.session.feedback = 'You are not a member anymore';

        res.redirect('/');
    }
);

const postGiveAdmin = [
    validation.validateAdmin,
    tryCatch(
        async (req, res, next) => {
            const validationErrors = validationResult(req);
            if(!validationErrors.isEmpty()){
                res.status(400).render('admin', {
                    errors: validationErrors.array(),
                });
                return;
            }
        
            //give admin permissions
            await db.toggleAdmin(req.user.id, true);
            req.session.feedback = 'You are now an admin!';
        
            res.redirect('/');
        }
    )
];

const postRemoveAdmin = tryCatch(
    async (req, res, next) => {
        // update db member to false
        await db.toggleAdmin(req.user.id, false);
        req.session.feedback = 'You are not an admin anymore';

        res.redirect('/');
    }
);

const getProfile = async (req, res, next) => {
    if(!req.user){
        return next(new customError('You are not authenticated', 400));
    }

    if(!req.user.member){
        return next(new customError('You are not a member', 400));
    }

    const username = req.params.user;
    const results = await Promise.all([db.getUser(username), db.getUserProfileMessages(username)]);
    
    res.render('profile', {user: results[0][0], messages: results[1]});
}

module.exports = {
    postSingUser,
    postLogUser,
    getLogOutUser,
    postGiveMembership,
    postRemoveMembership,
    postGiveAdmin,
    postRemoveAdmin,
    getProfile
}