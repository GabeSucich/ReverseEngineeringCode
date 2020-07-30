$(document).ready(function() {
  // jQuery selectors to DOM elements
  var signUpForm = $("form.signup"); //grabs form
  var emailInput = $("input#email-input"); //grabs email input field
  var passwordInput = $("input#password-input"); //grabs password input field

  // Event listener for submitting form
  signUpForm.on("submit", function(event) {
    event.preventDefault(); // Prevents form submit default
    var userData = {
      // Stores input values in object
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    // validates that neither field was left blank
    if (!userData.email || !userData.password) {
      return;
    }
    // Call the signUpUser function on the input data
    signUpUser(userData.email, userData.password);
    emailInput.val(""); //Clear the input
    passwordInput.val("");
  });


  function signUpUser(email, password) {
    // Send a post request to signup a new user with the given information
    $.post("/api/signup", {
      email: email,
      password: password
    })
      .then(function(data) {
        window.location.replace("/members");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  // This creates an error alert using a combination of bootstrap and jquery
  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
