
//On page load
$( document ).ready(function() {
	Edorble.Logic.Authorisation.sendToPageIfAlreadyLoggedIn("http://cederiks-playground.webflow.io/dashboard-prototype");
	
	//Prepare the login form if you want to enable loggin in using a form
	var idRegisterButton = '#button-register';
	var idRegisterForm = "#Register-Form";
	var idRegisterUserNameInput = "#Register-Input-UserName";
	var idRegisterInputPassword = "#Register-Input-Password";
	var idRegisterFeedback = "#Register-Feedback";
	Edorble.Logic.Authorisation.prepareRegisterForm(
		idRegisterButton, 
		idRegisterForm, 
		idRegisterUserNameInput,
		idRegisterInputPassword, 
		idRegisterFeedback)
	
	//Prepare login using facebook
	//var idFacebookLoginButton = "#button-login-facebook";
	//Edorble.Logic.Authorisation.prepareLoginFacebook(idFacebookLoginButton, LoginHandler);
	
	//Setup that upon login the user is redirected to the following page
	Edorble.Logic.Authorisation.redirectToPageOnLogin("http://cederiks-playground.webflow.io/dashboard-prototype");
});