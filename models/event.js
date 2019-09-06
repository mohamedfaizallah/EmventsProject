const User = require('./user');
const mongoose = require('mongoose');
const Joi = require('joi');

const Event = mongoose.model('Event', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 500
    },
    date: {
        type: Date,
        required: true,
    },
    owner: {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userJoin: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }]


}));

function validateEvent(event){
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        description: Joi.string().min(5).max(500).required(),
        date: Joi.date()
    };
    return Joi.validate(event, schema);
}

exports.Event= Event;
exports.validate= validateEvent;