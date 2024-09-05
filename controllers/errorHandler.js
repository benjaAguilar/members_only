const { createUserError } = require("../utils/customErrors");

async function errorHandler(error, req, res, next){
    
    console.log(error);
    console.log('------------------');
    console.log(error.message);

    if(error instanceof createUserError){
        res.status(500).render('index');
        return;
    }

    res.status(500).send('Server Error');
}

module.exports = errorHandler;