// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// This middleware will check for us if there is a user currently credentialed and signed in.
// It will protect our html routes from serving up pages to users who are not signed in.
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  // Get request for the root route
  app.get("/", function(req, res) {
    if (req.user) {
      res.redirect("/members"); //If the user has credentials in the session, send them right to the members page
    }
    res.sendFile(path.join(__dirname, "../public/signup.html")); //If the user does not have credentials, send them to the signup page
  });

  //Get request for login page
  app.get("/login", function(req, res) {

    if (req.user) {
      res.redirect("/members"); // If the user has credentials in the session, send them right to the members page
    }
    res.sendFile(path.join(__dirname, "../public/login.html")); //If they do not have credentials, serve them the login.html page
  });

  // Get request for the /members page
  // the isAuthenticated middleware will check if req.user exists. If it does, it will serve the members.html file.
  // Otherwise, the middleware will redirect us to the root route, where as seen above, we will be served the signup html page
  app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

};
