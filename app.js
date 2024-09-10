const express = require('express');
const path = require('node:path');
const app = express();

require('dotenv').config();

const session = require('express-session');
const passport = require('passport');
const pool = require('./db/pool');

const errorHandler = require('./controllers/errorHandler');
const indexRouter = require('./routes/indexRoute');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new (require('connect-pg-simple')(session))({
        pool: pool
     }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    res.locals.currentUser = req.user;
    res.locals.isAuth = req.isAuthenticated();
    next();
  });

app.set("views", `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use('/', indexRouter);

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => console.log(`server running on ${PORT}`));