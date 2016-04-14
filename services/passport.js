/**
 * Created by dchernyh on 14.04.16.
 */
'use strict';

const passport = require('passport');
const User = require('../models/user-model');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//setup options for JWT strategy
//Find JWT token in the request header, in "authorization" key,
//and use our secret
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

const localOptions = {usernameField: 'email'};

//create local strategy
//use it on sign in request
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
    //Verify user's email and password
    User.findOne({email: email}, function(err, user) {
        if (err) {
            return done(err, false);
        }
 
        if (!user) {
            done(null, false);
        }

        user.comparePassword(password, function(err, isMatch){
            if(err){
                return done(err);
            }

            if(!isMatch){
                done(null, false);
            }

            return done(null, user);
        });
    });
});


//create JWT strategy
/**
 * @payload - decripted JWT
 * @done - callback for passport continue
 */
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    //see if the user ID from the payload exists in DB
    User.findById(payload.sub, function(err, user){
        if (err) {
            return done(err, false);
        }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
