/**
 * Created by dchernyh on 14.04.16.
 */
'use strict';
const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user-model');

function generateToken(user) {
    //jwt have a sub - "subject" property, who is this token owner
    // and iat - "issue at time"
    let timestamp = new Date().getTime(),
        payload = {
            sub: user.id,
            iat: timestamp
        };
    
    return jwt.encode(payload, config.secret);
}

exports.signup = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).json({error: 'No Empty fields'});
    }

    //see if the user with the given email exists
    User.findOne({email: email}, (err, existingUser) => {
        if (err) {
            return next(err);
        }

        //if the user with the given email does exists, return an error
        if (existingUser) {

            //unprocessable entity
            return res.status(422).json({error: 'Email is in use'});
        }

        // if the user with the given email does NOT exists, create and save record
        const user = new User({email: email, password: password});

        user.save((err)=> {
            if (err) {
                return next(err);
            }

            res.json({token: generateToken(user)});
        });
    });
};

exports.signin = function (req, res, next) {
    //user has already their email and pwd auth'd,
    //return token
    res.json({token: generateToken(req.user)});
};
