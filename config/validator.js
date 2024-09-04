const { body } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 4 and 20 characters.";

const validateCreateUser = [
    body('username').trim()
        .isAlpha().withMessage(`Username ${alphaErr}`)
        .isLength({min: 4, max: 20}).withMessage(`Username ${lengthErr}`)
        .notEmpty().withMessage('Username is required')
        .toLowerCase(),

    body('firstname').trim()
        .isAlpha().withMessage(`Firstname ${alphaErr}`)
        .isLength({min: 4, max: 20}).withMessage(`Firstname ${lengthErr}`)
        .notEmpty().withMessage('Firstname is required'),

    body('lastname').trim()
        .isAlpha().withMessage(`Lastname ${alphaErr}`)
        .isLength({min: 4, max: 20}).withMessage(`Lastname ${lengthErr}`)
        .notEmpty().withMessage('Lastname is required'),
        
        body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    body('c_password')
        .trim()
        .notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
]

module.exports = {
    validateCreateUser,
}