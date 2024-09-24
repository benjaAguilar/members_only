const { customError, loginError } = require("../utils/customErrors");

async function errorHandler(error, req, res, next){
    
    console.log(error);
    console.log('------------------');
    console.log(error.message);
    req.session.feedback = error.message;

    if(error instanceof loginError){
        res.status(error.statusCode).redirect('/log-in');
        return;
    }

    if(error instanceof customError){
        res.status(error.statusCode).redirect('/');
        return;
    }

    res.status(500).render('serverError', {status: 500, message: error.message});
}

module.exports = errorHandler;