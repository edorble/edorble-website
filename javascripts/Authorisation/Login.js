//Prepare variables
var myFirebaseRef = 
	new Firebase("https://edorble-dev.firebaseio.com/");
var url_dashboardpage = 
	"http://cederiks-playground.webflow.io/dashboard-prototype"

//Business Logic
//General
//Validate input based on the configuration set in webflow
function ValidateForm(myForm)
{
	//Forcing html 5 validation based on this example:
  //http://stackoverflow.com/questions/11866910/how-to-force-a-html5-form-validation-without-submitting-it-via-jquery
	var isFormValid = myForm[0].checkValidity();
  
  if(!isFormValid)
  {
  	// If the form is invalid, submit it. The form won't actually submit;
  	// this will just cause the browser to display the native HTML5 error messages.
    // If your form doesn't have a submit button, you can fake one:
  	$('<input type="submit">').hide().appendTo(myForm).click().remove();
  }
  
  return isFormValid;
}

//-----------
// Authentication 
//-----------
myFirebaseRef.onAuth(function(authData) {
  if (authData) {
    console.log("Authenticated with uid:", authData.uid);
    window.location = url_dashboardpage;
  } else {
    console.log("Client unauthenticated.")
  }
});
// Create a callback to handle the result of the authentication
function LoginHandler(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
}

function TryToLoginEmailPassword(email, password){
	// Try to auth using Firebase and with an email/password combination
  myFirebaseRef.authWithPassword({
    email    : email,
    password : password
  }, LoginHandler);
}

//Holds all business logic when clicking the login button
function doLoginEmailPasswordBehavior(){
	var myForm = $('#Login-Form');
	var isFormValidated = ValidateForm(myForm);
  
  if(isFormValidated){
    var email = $('#Login-Input-UserName').val();
    var password = $('#Login-Input-Password').val();
    TryToLoginEmailPassword(email, password); //Async operation handles by authhandler
  }
}

//Holds all business logic when clicking the login facebook button
function doLoginFacebookBehavior(){
    myFirebaseRef.authWithOAuthRedirect("facebook", 
    	LoginHandler,  
    	{
  			scope: "email" // the permissions requested
			});
}
//-----------
// End of Authentication 
//-----------

// Checks
function checkAuthState(){
var authData = myFirebaseRef.getAuth();
if (authData) {
  window.location = url_dashboardpage;
} else {
  $('#auth-state').text("User is logged out");
}
}

//Preparation binding
function bindButtonEvents(){
$("#button").on("click", checkAuthState);
$("#button-login").click(doLoginEmailPasswordBehavior);
$("#button-login-facebook").click(doLoginFacebookBehavior);
}

//Test functions
function runFirebaseExample(){

}

//On page load
$( document ).ready(function() {
	checkAuthState();
	bindButtonEvents();
	runFirebaseExample();

});