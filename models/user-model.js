/**
 * Created by dchernyh on 14.04.16.
 */
'use strict';
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define our model
const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String
});

//Encrypt Password
//Before saving a Model, run this function
userSchema.pre('save', function(next) {
    //get access to UserModel
    const user = this;

    //generate a salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }

        //hash the password with salt
        bcrypt.hash(user.password, salt, null, (err, hash) => {

            //set users password as hash
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch){
        if(err){
            return callback(err);
        }
        
        callback(null, isMatch);
    });
};

//Create the model Class
//loads the model to mongoDB, and define the userModel
const ModelClass = mongoose.model('user', userSchema);

//Export the model
module.exports = ModelClass;