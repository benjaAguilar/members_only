const { customError } = require("../utils/customErrors");

async function errorHandler(error, req, res, next){
    
    console.log(error);
    console.log('------------------');
    console.log(error.message);

    if(error instanceof customError){
        res.status(error.statusCode).render('index');
        return;
    }

    res.status(500).send('Server Error');
}

module.exports = errorHandler;