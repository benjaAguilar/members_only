const { customError } = require("../utils/customErrors");

function getIndex(req, res){
    res.render('index');
}

function getSignUp(req, res, next){
    const context = {
        username: '', 
        firstname: '',
        lastname: '',
        password: ''
    };

    if(req.isAuthenticated()){
        return next(new customError(`You are already authenticated as @${req.user.username}`, 400));
    }  

    res.render('signUp', context);
}

function getLogIn(req, res, next){
    if(req.isAuthenticated()){
        return next(new customError(`You are already authenticated as @${req.user.username}`, 400));
    }  

    res.render('logIn');
}

module.exports = {
    getIndex,
    getSignUp,
    getLogIn
}