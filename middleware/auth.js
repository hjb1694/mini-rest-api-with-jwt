const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {

    const token = req.header('auth-token');

    if(!token){

        return res.status(403).json({errors : [{msg: 'No token provided. Access Denied.'}]});

    }

    try{

    const decoded = jwt.verify(token, 'thisisasupersupersecret');

    req.user = decoded;

    next();

    }catch (e) {

        res.status(403).json({errors : [{msg : 'Invalid token'}]});


    }

}