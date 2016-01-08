//Prepare variables
var myFirebaseRef = 
	new Firebase("https://edorble-dev.firebaseio.com/");
	
var url_dashboardpage = 
	"http://cederiks-playground.webflow.io/dashboard-prototype"

//Business Logic

	// Create a callback to handle the result of the authentication
	function LoginHandler(error, authData) {
	  if (error) {
	    console.log("Login Failed!", error);
	  } else {
	    console.log("Authenticated successfully with payload:", authData);
	  }
	}
	
	// Authentication 
	myFirebaseRef.onAuth(function(authData) {
		  if (authData) {
		    console.log("Authenticated with uid:", authData.uid);
		    window.location = url_dashboardpage;
		  } else {
		    console.log("Client unauthenticated.")
		  }
		});


//On page load
$( document ).ready(function() {
	Edorble.Logic.Authorisation.sendToDashboardIfAuthed(url_dashboardpage);
	
	//Prepare the login form if you want to enable loggin in using a form
	var idLoginButton = '#button-login';
	var idLoginForm = "#Login-Form";
	var idLoginUserNameInput = "#Login-Input-UserName";
	var idLoginInputPassword = "#Login-Input-Password";
	Edorble.Logic.Authorisation.prepareLoginForm(idLoginButton, idLoginForm, idLoginUserNameInput, idLoginInputPassword, LoginHandler)
	
	//Prepare login using facebook
	var idFacebookLoginButton = "#button-login-facebook";
	Edorble.Logic.Authorisation.prepareLoginFacebook(idFacebookLoginButton, LoginHandler);
	
	//Setup that upon login the user is redirected to the following page
	redirectUserToThisPageOnLogin(url_dashboardpage);
});