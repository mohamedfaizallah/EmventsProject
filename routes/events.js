const organizer = require('../middleware/organizer');
const auth = require('../middleware/login');
const lodash = require('lodash');
const {Event, validate} = require('../models/event');
const User = require('../models/user');
const express = require('express');
const router = express.Router();



//Partial Search for event
router.get('/search', async (req,res)=>{
    
    let title = req.query.title;
    //Parial Search Text 
    let event = await Event.find({title: {
        $regex: new RegExp(title)
    }
    }).limit(10);
 
    res.send(event);
       
});


//Get all display events
router.get('/',async (req,res)=>{
    const events = await Event.find().populate({path:'owner', select: 'name -_id email'}).select('title description date owner');
    res.send(events);

});


//Create Event with authentification and organizer role
router.post('/',[auth,organizer],async(req,res)=>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const event = new Event({
        title : req.body.title,
        description: req.body.description,
        date: req.body.date,
        owner: req.user._id
    });
    await event.save();
    res.send(event);

});


//Update the event with the owner of the event and organizer role
router.put('/:id',[auth,organizer],async(req,res)=>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const eventOwner = await Event.findOne({_id:req.params.id, owner: req.user._id});
   
    if(!eventOwner) return res.status(401).send('You cannot update the event');

      const event = await Event.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date},
        {new : true}
        );
        if (!event) return res.status(400).send('The event with the given ID is not Found!!');
    res.send(event);

    

});

//Delete event with the event owner and organizer role
router.delete('/:id',[auth,organizer],async(req,res)=>{
    let eventOwner = await Event.findOne({_id:req.params.id, owner: req.user._id});
    if (!eventOwner) return res.status(401).send('you cannot delete this event');
    const event = await Event.findByIdAndRemove(req.params.id);
    if (!event) return res.status(400).send('The event with the Given ID is not Found!');
    res.send('event was deleted');

});

//Get an event by id
router.get('/:id',async(req,res)=>{
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(400).send('The event with the given ID is not found');
    res.send(event);
});

//User join an event
router.post('/:id',auth,async(req,res)=>{
    const event = await Event.findById(req.params.id);
    if (!event) {
    res.status(400).send('The event with the given ID is not found');}
    for (let i = 0; i < event.userJoin.length; i++){
        if (event.userJoin[i] == req.user._id) {
            return res.status(400).send('You are already joined the event');
        }
        
    }
    
    event.userJoin.push(req.user._id);
    await event.save();
    res.send("You join this event");
   
    
});


//Get all users are joined to an event
router.get('/users/:id',[auth,organizer],async(req,res)=>{
    const event = await Event.findOne({_id:req.params.id, owner: req.user._id});
    if (!event) return res.status(400).send('The event with the given ID is not found');
    
    const users = await Event.find({_id: req.params.id}).populate({path: 'userJoin', select: 'name email username -_id'}).select('userJoin -_id');
    res.send(users);
    
    
    
});


module.exports= router;