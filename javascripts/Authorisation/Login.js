//Prepare variables
var myFirebaseRef = 
	new Firebase("https://edorble-dev.firebaseio.com/");
	
var url_dashboardpage = 
	"http://cederiks-playground.webflow.io/dashboard-prototype"
	
var myEdorbleRef =
	new Edorble();

//Business Logic

//-----------
// Authentication 
//-----------
//Create a event listener for when a user is authed.
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

// Try the login details provided by the user
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

//Preparation binding
function bindButtonEvents(){
$("#button-login").click(doLoginEmailPasswordBehavior);
$("#button-login-facebook").click(doLoginFacebookBehavior);
}

//On page load
$( document ).ready(function() {
	myEdorbleRef.sendToDashboardIfAuthed(url_dashboardpage);
	bindButtonEvents();
});