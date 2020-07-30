
var db = require("../models"); // require all of our models
var passport = require("../config/passport"); // require the passport authentication

module.exports = function(app) { // We are exporting a function that, when called on the express server, will give the server access to these routes

  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // The middleware passport.authenticate('local') will ensure that the user credentials sent to the post request are valid
    res.json(req.user); // Send back the user information stored in the req object
  });

  
  app.post("/api/signup", function(req, res) {
    // Create a user with the data contained in the req.body when a call is made to this route
    db.User.create({
      email: req.body.email, // Set email and password
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login"); // Redirect the user to the api/login route. The user has credentials in the session after signing up, so the api/login route will authenticate
      })
      .catch(function(err) {
        res.status(401).json(err); // send any errors in the response if they occur
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout(); // This is a passport function that ends the current user session and removes the user object from the request object
    res.redirect("/"); // Sends the user back to the root route
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // If there are no user credentials, send back an empty json object
      res.json({});
    } else {
      res.json({
        email: req.user.email, // send back a json object with the user email and id if there is a user object stored in the request object by passport
        id: req.user.id
      });
    }
  });
};
