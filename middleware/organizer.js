module.exports = function (req,res,next){
    if(req.user.roles!== 'organizer') return res.status(403).send('Access denied');
    next();
}