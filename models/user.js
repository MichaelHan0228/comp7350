var mongoose = require('mongoose');

module.exports = { 
    user:{ 
        name:{type:String,required:true},
        password:{type:String,required:true},
    }
};