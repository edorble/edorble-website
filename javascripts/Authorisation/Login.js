//Prepare variables
var myFirebaseRef = 
	new Firebase("https://edorble-dev.firebaseio.com/");
	
var url_dashboardpage = 
	"http://cederiks-playground.webflow.io/dashboard-prototype"

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
function TryToLoginEmailPassword(email, password, loginHandler){
	// Try to auth using Firebase and with an email/password combination
  myFirebaseRef.authWithPassword({
    email    : email,
    password : password
  }, loginHandler);
}

//Holds all business logic when clicking the login button
function doLoginEmailPasswordBehavior(idLoginForm, idLoginUserNameInput, idLoginPasswordInput, loginHandler){
	var myForm = $(idLoginForm);
	var isFormValidated = Edorble.Helpers.HTML5.validateForm(myForm);
  
  if(isFormValidated){
    var email = $(idLoginUserNameInput).val();
    var password = $('#Login-Input-Password').val();
    TryToLoginEmailPassword(email, password, loginHandler); //Async operation handles by authhandler
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

function prepareLoginForm(idLoginButton, idLoginForm, idLoginUserNameInput, idLoginPasswordInput, loginHandler)
{
	$("#button-login").click(doLoginEmailPasswordBehavior(idLoginForm, idLoginUserNameInput, idLoginPasswordInput, loginHandler));
}

//Preparation binding
function bindButtonEvents(){

$("#button-login-facebook").click(doLoginFacebookBehavior);
}

//On page load
$( document ).ready(function() {
	Edorble.Logic.Authorisation.sendToDashboardIfAuthed(url_dashboardpage);
	
	//Prepare the login form if you want to enable loggin in using a form
	var idLoginButton = '#button-login';
	var idLoginForm = "#Login-Form";
	var idLoginUserNameInput = "#Login-Input-UserName";
	var idLoginInputPassword = "#Login-Input-Password";
	prepareLoginForm('#button-login', idLoginForm, idLoginUserNameInput, idLoginInputPassword, LoginHandler)
	
	bindButtonEvents();
});