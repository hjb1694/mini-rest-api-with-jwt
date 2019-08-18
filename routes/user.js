const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');

router.post('/create', [
    check('name', 'Please enter a valid name').isLength({min : 2}), 
    check('email','Please enter a valid email address').isEmail(), 
    check('password', 'Please enter a password with a minimum length of 6 characters').isLength({min: 6})
], async (req,res,next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({errors : errors.array()});
    }

    const exists = await User.findOne({email : req.body.email});

    if(exists){
        return res.status(422).json({errors : [{msg : 'This email already exists'}]});
    }

    try{

    const salt = bcrypt.genSaltSync(8);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const user = new User({
        name : req.body.name,
        email : req.body.email, 
        password : hashedPassword, 
    });

    await user.save();

    jwt.sign({
        userId : user.id
    },'thisisasupersupersecret',{
        expiresIn : '1hr'
    }, function(err, token){

        if(err) throw new Error('An error has occcurred when signing the token');

        return res.status(200).header('auth-token', token).json({token});

    });



    } catch (e) {

        res.status(400).json({errors : [{ msg :`There was a server error that occurred: ${e}`}]});


    }


});


router.post('/login', async (req,res,next) => {

    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(422).json({errors : [{msg : 'Email is invalid'}]});
        }

        const compare = await bcrypt.compare(password, user.password);

        if(!compare){
            return res.status(403).json({errors : [{msg : 'Password is invalid'}]});
        }

        jwt.sign({
            userId : user.id
        },'thisisasupersupersecret',{
            expiresIn : '1hr'
        }, function(err, token){
    
            if(err) throw new Error('An error has occcurred when signing the token');
    
            return res.status(200).header('auth-token', token).json({token});
    
        });

    } catch (e) {

        res.status(400).json({errors : [{ msg :`There was a server error that occurred: ${e}`}]});

    }


});


router.get('/protected-route', auth, (req,res,next) => {

    res.json({msg : 'Welcome to the protected route!'});

});


module.exports = router;