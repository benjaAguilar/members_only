const express = require('express');
const path = require('node:path');
const app = express();
require('dotenv').config();
const indexRouter = require('./routes/indexRoute');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use('/', indexRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`server running on ${PORT}`));