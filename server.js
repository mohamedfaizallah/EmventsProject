require('express-async-errors');
const winston = require('winston');
const error = require('./middleware/error');
const config= require('config');
const login = require('./routes/login');
const events = require('./routes/events');
const users = require('./routes/users')
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

require('./startup/db')();


if (!config.get('jwtPrivateKey')){
        console.log('Fatal Error: Jwt Private Key is not defined');
        process.exit(1);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/events', events);
app.use('/api/users', users);
app.use('/api/login', login);
//Log exception
app.use(error);


app.listen(7000, ()=> console.log('Started on the port 7000'));


