const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String, 
        required : true, 
        minlength : 2
    },
    email : {
        type : String, 
        required : true
    }, 
    password : {
        type : String, 
        required : true
    }, 
    createdDate : {
        type : Date, 
        default : Date.now
    }
});


module.exports = mongoose.model('User', userSchema);