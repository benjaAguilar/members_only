const { validationResult } = require("express-validator");
const validation = require('../config/validator');

const postSingUser = [
    validation.validateCreateUser,
    async (req, res) => {
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
        console.log("🚀 ~ password:", password)
        console.log("🚀 ~ lastname:", lastname)
        console.log("🚀 ~ firstname:", firstname)
        console.log("🚀 ~ username:", username)
        
        // await db.createUser(username, firstname, lastname, password)
        res.render('logIn');
    }
]

module.exports = {
    postSingUser,
}