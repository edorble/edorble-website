
// Create a callback to handle the result of the authentication
function LoginHandler(error, authData) {
  if (error) {
    $("#Login-AuthFeedback").text(error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
}

//On page load
$( document ).ready(function() {
	Edorble.Logic.Authorisation.sendToPageIfAlreadyLoggedIn("http://cederiks-playground.webflow.io/dashboard-prototype");
	
	//Prepare the login form if you want to enable loggin in using a form
	var idLoginButton = '#button-login';
	var idLoginForm = "#Login-Form";
	var idLoginUserNameInput = "#Login-Input-UserName";
	var idLoginInputPassword = "#Login-Input-Password";
	var idLoginFeedback = "#Login-AuthFeedback";
	Edorble.Logic.Authorisation.prepareLoginForm(
		idLoginButton, 
		idLoginForm, 
		idLoginUserNameInput,
		idLoginInputPassword,
		idLoginFeedback)
	
	//Prepare login using facebook
	var idFacebookLoginButton = "#button-login-facebook";
	Edorble.Logic.Authorisation.prepareLoginFacebook(idFacebookLoginButton, idLoginFeedback);
	
	//Prepare login using facebook
	var idTwitterLoginButton = "#button-twitter-facebook";
	Edorble.Logic.Authorisation.prepareLoginTwitter(idTwitterLoginButton, idLoginFeedback);
	
	//Setup that upon login the user is redirected to the following page
	Edorble.Logic.Authorisation.redirectToPageOnLogin("http://cederiks-playground.webflow.io/dashboard-prototype");
});