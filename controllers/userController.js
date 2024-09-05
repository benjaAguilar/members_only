const { validationResult } = require("express-validator");
const { tryCatch } = require('../utils/tryCatch');
const validation = require('../config/validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../db/queries');
const { customError } = require("../utils/customErrors");

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

module.exports = {
    postSingUser,
    postLogUser,
    getLogOutUser
}