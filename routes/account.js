const router = require ('express').Router();
const jwt = require('jsonwebtoken');
const User =require('../models/user');
const config = require ('../config');
// middlewares
const checkJWT = require ('../middlewares/check-jwt');

router.post('/signup',  (req,res,next)=>{
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.picture = user.gravatar();
    user.isSeller = req.body.isSeller;
    
    
// find if user already exist 
User.findOne({email: req.body.email}, async (err,userExist) => {
    if (userExist){
        res.json({
            success:false,
            message: 'Account with that email is already exist'
        });
    }else {
        
       await user.save(); // saving user
       // encrypting user information
       let token =jwt.sign({
           user
       }, config.TOKEN_SECRET,{expiresIn: '7d'});
       // message
        res.json({
            success: true,
            message: 'Account created - Enjoy your token',
            token
        });
    }
  });
});

//login 

router.post('/login',(req,res,next)=>{

    User.findOne({email: req.body.email},(err,user)=>{
        if (err) throw err;
        if (!user){
            res.json({
                success: false,
                message: 'Authenticated failed, user not found'
            });
        }else if(user){

            var validPassword= user.comparePassword(req.body.password);
            if(!validPassword){
                res.json({
                    success:false,
                    message:'Authenticated failed. Wrong Password'
                });
            } else {
                let token =jwt.sign({user}, config.TOKEN_SECRET,{expiresIn: '7d'});
                res.json({
                    success: true,
                    message:'Succesfully Login',
                    token
         

                })
            }

        }
    });

});
// route profile
router.route('/profile')
.get(checkJWT, (req, res, next) => { 
    User.findOne({_id: req.decoded.user._id}, (err, user)=>{
        res.json({
            success:true,
            user,
            message:'Succesfull'
        });
    });
}) // close get 
.post( checkJWT, (req,res, next) => {
    User.findOne ({_id: req.decoded.user._id},(err,user) => {
        if (err) return next (err);

        if(req.body.name) user.name=req.body.name;
        if(req.body.email) user.email=req.body.email;
        if(req.body.password) user.password=req.body.password;

        user.isSeller = req.body.isSeller;

        user.save();
        res.json({
            success:true,
            message: 'Succesfully edited your profile'
        });
    });
}); // close post

// route Address
router.route('/address')
.get(checkJWT, (req, res, next) => { 
    User.findOne({_id: req.decoded.user._id}, (err, user)=>{
        res.json({
            success: true,
            address: user.address,
            message:'Succesfull address'
        });
    });
}) // close get 
.post( checkJWT, (req,res, next) => {
    User.findOne ({_id: req.decoded.user._id},(err,user) => {
        if (err) return next (err);

        if(req.body.addr1) user.address.addr1=req.body.addr1;
        if(req.body.addr2) user.address.addr2=req.body.addr2;
        if(req.body.city) user.address.city=req.body.city;
        if(req.body.state) user.address.state=req.body.state;
        if(req.body.country) user.address.country=req.body.country;
        if(req.body.postalCode) user.address.postalCode=req.body.postalCode;

        user.isSeller = req.body.isSeller;

        user.save();
        res.json({
            success:true,
            message: 'Succesfully edited your address'
        });
    });
}); // close post




module.exports = router;