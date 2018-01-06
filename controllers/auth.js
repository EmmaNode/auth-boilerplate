var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models')
var router = express.Router();

router.get('/login', function(req, res){
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  successFlash: 'Login Successful',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid Credentials'
}));
// router.get('/login', function(req, res){
  // console.log('req.body is', req.body);
  // res.send('login post route - coming soon');
// });

router.get('/signup', function(req, res){
  res.render('auth/signup');
});

router.post('/signup', function(req, res, next){
  console.log('req.body is', req.body);
  // res.send('signup post route - coming soon');
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: { //in the case it is creating a user and did not find an existing username
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    }
  }).spread(function(user, wasCreated){ //spread is a promise that runs after the database has been called, tells you if it was found or created
    if(wasCreated){
      //Good job, you didn't try to make a duplicate
      //this part is calling a function
      passport.authenticate('local', {
        successRedirect: '/profile',
        successFlash: 'Successfully logged in'
      })(req, res, next);
    }
    else {
      //bad job you tried to sign up when username already exists
      req.flash('error', 'Email already exists'); //1st type is what kind of message 2nd text is what is the message going to be displayed
      res.redirect('/auth/login');
    }
  }).catch(function(err){
    req.flash('error', err.message);
    res.redirect('/auth/signup');
  });
});

router.get('/logout', function(req, res){
  console.log('can I logout??');
  req.logout();
  req.flash('success', 'Successfully logged out');
  res.redirect('/');
  // res.send('logout post route - coming soon');
});

module.exports = router;
