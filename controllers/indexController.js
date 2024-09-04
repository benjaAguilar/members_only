function getIndex(req, res){
    res.render('index');
}

function getSignUp(req, res){
    const context = {
        username: '', 
        firstname: '',
        lastname: '',
        password: ''
    };

    res.render('signUp', context);
}

function getLogIn(req, res){
    res.render('logIn');
}

module.exports = {
    getIndex,
    getSignUp,
    getLogIn
}