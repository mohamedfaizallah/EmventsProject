const auth = require('../middleware/login');
const {User,validate} = require('../models/user');
const bcrypt = require('bcrypt');
const lodash = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/me',auth,async(req,res)=>{
    const user = await User.findById(req.user._id).select('-password -username');
    res.send(user);
});

router.post('/', async(req,res)=>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(409).send('User already exist');

    let username = await User.findOne({username: req.body.username});
    if (username) return res.status(409).send('Username already exist');

    user = new User (lodash.pick(req.body, ['name','username','email','password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(lodash.pick(user, ['name','username','email']));
});


module.exports =router;