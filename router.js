/**
 * Created by dchernyh on 14.04.16.
 */
'use strict';
const passport = require('passport');
const passportService = require('./services/passport');
const auth = require('./controllers/auth');

//Set interceptor between request and router
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignIn = passport.authenticate('local', {session: false});

module.exports = function (app){
    app.get('/', requireAuth, function(req,res){
       res.send('Authenticated');
    });
    app.post('/signup', auth.signup);
    app.post('/signin', requireSignIn, auth.signin)
};