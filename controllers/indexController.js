const { customError } = require("../utils/customErrors");
const db = require('../db/queries');

async function getIndex(req, res){
    const feedback = req.session.feedback;
    delete req.session.feedback;

    const messages = await db.getAllMessages();
    
    res.render('index', { feedback, messages });
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
    
    const feedback = req.session.feedback;
    delete req.session.feedback;

    res.render('logIn', { feedback });
}

function getMember(req, res, next){
    if(!req.isAuthenticated()){
        return next(new customError(`You are not authenticated`, 400));
    }

    if(req.user.member){
        return res.render('member');
    }

    res.render('member', { siteKey: process.env.CAPTCHA_SITE});
}

function getAdmin(req, res, next){
    if(!req.isAuthenticated()){
        return next(new customError(`You are not authenticated`, 400));
    }

    const feedback = req.session.feedback;
    delete req.session.feedback;

    res.render('admin', { feedback });
}


module.exports = {
    getIndex,
    getSignUp,
    getLogIn,
    getMember,
    getAdmin
}