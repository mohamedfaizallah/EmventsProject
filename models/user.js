const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose =require('mongoose');
const Joi = require ('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength:50
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    roles: String,
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, roles: this.roles}, config.get('jwtPrivateKey') );
    return token;
}
const User = mongoose.model('User', userSchema);



function validateUser(user){
    //const complexityOptions = {
    //    min: 5,
    //    max: 255,
    //    lowerCase: 1,
    //    upperCase: 1,
    //    numeric: 1,
    //    symbol: 1,
     //   requirementCount: 4 
    //}
    const schema = {
        name: Joi.string().min(5).max(255).required(), 
        username: Joi.string().min(5).max(50).required(), 
        email: Joi.string().required().email(), 
        password: Joi.string().min(6).max(1024).required()
        //password: new passwordComplexity(complexityOptions).required()

    }
    return Joi.validate(user, schema);
}
exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;