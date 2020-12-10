const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user-model');

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: "163582076813-r1did6q82gqg6gmiaqtqbubn5butp7rq.apps.googleusercontent.com",
    clientSecret: "G4u8zj2YWxbs6yyTv8JZm9nD",
    callbackURL: "http://127.0.0.1:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    new User({
      username: profile.displayName,
      googleId: profile.id
    }).save().then((newUser) => {
      console.log('new user created: ' + newUser)
    })
  }
));