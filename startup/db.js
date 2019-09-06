const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function(){
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useCreateIndex', true);
    
    mongoose.connect('mongodb://localhost/emvents', { useNewUrlParser: true })
    .then(()=> winston.info('Connected to the database'));
}