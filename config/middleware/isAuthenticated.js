// This custom middleware will be inserted into server requests to protect routes from being accessed by unauthenticated user
module.exports = function(req, res, next) {
  // If the user is logged in, the server router will pass over this middleware with no problems
  if (req.user) {
    return next(); // Move on to next middleware
  }

  // Non-logged-in users will be redirected to the root route, protecting the target html
  return res.redirect("/");
};
