
// Create a callback to handle the result of the authentication
function LoginHandler(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
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
	Edorble.Logic.Authorisation.prepareLoginForm(
		idLoginButton, 
		idLoginForm, 
		idLoginUserNameInput,
		idLoginInputPassword, 
		LoginHandler)
	
	//Prepare login using facebook
	var idFacebookLoginButton = "#button-login-facebook";
	Edorble.Logic.Authorisation.prepareLoginFacebook(idFacebookLoginButton, LoginHandler);
	
	//Setup that upon login the user is redirected to the following page
	Edorble.redirectToPageOnLogin("http://cederiks-playground.webflow.io/dashboard-prototype");
});