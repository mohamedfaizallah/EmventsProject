const config = require('config');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/', async(req,res)=>{
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid Email or Password');
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid Email or Password');

    const token = user.generateAuthToken();
    res.send(token);
});

function validateUser(req){
    const schema = {
        email: Joi.string().required(),
        password: Joi.string().required()
       
    };
    return Joi.validate(req, schema);
}

module.exports= router;