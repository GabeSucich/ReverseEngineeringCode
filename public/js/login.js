$(document).ready(function() {
  // We use jQuery to grab the html elements
  var loginForm = $("form.login"); // Grabs whole form
  var emailInput = $("input#email-input"); // Grabs email input field
  var passwordInput = $("input#password-input"); // Grabs password input field

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", function(event) {
    event.preventDefault(); // Prevents for submission default
    var userData = {
      // Stores email and password input in object
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };
    
    // validates that neither field was left blank
    if (!userData.email || !userData.password) {
      return;
    }

    // Calls loginUser on the userData object
    loginUser(userData.email, userData.password);
    emailInput.val(""); // Clear input fields
    passwordInput.val("");
  });

  // Sends the new used data to the login api route, which will log the user in or throw an error if no user exists with the given credentials
  function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password
    })
      .then(function() {
        window.location.replace("/members"); // After the response is sent back by the api request, go to the /members page
        // If there's an error, log the error
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});
