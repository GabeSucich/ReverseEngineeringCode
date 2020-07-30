var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var db = require("../models");

// This specifies that we are using the passport LocalStrategy -- signing in with a username and password
passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: "email"
  },
  function(email, password, done) {
    // Query the user database and find the row that matches the usernameField if it exists
    db.User.findOne({
      where: {
        email: email
      }
    }).then(function(dbUser) {
      // If we couldn't find a matching user, end the authentication attempt with the message that the email was incorrect
      if (!dbUser) {
        return done(null, false, {
          message: "Incorrect email."
        });
      }
      // Otherwise, if the user was found, but the password inputted doesnt match the user password, end the authentication attempt with the message that the password was incorrect
      else if (!dbUser.validPassword(password)) {
        return done(null, false, {
          message: "Incorrect password."
        });
      }
      // If we successfully authenticated, return the user
      return done(null, dbUser);
    });
  }
));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
