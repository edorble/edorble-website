//Prepare variables
var myFirebaseRef = 
	new Firebase("https://edorble-dev.firebaseio.com/");
	
var Edorble = 
{
	Model: true, //no models for now
	Logic:
	{
		Authorisation:
		{
			// ---- Auth check ----
			sendToDashboardIfAuthed: function (url_dashboardpage){
			var authData = myFirebaseRef.getAuth();
			if (authData) {
			  		window.location = url_dashboardpage;
				} 
			},

			// Try the login details provided by the user
			TryToLoginEmailPassword: function (email, password, loginHandler){
				// Try to auth using Firebase and with an email/password combination
			  myFirebaseRef.authWithPassword({
			    email    : email,
			    password : password
			  }, loginHandler);
			},

			//Holds all business logic when clicking the login button
			doLoginEmailPasswordBehavior: function (idLoginForm, idLoginUserNameInput, idLoginPasswordInput, loginHandler){
				var myForm = $(idLoginForm);
				var isFormValidated = Edorble.Helpers.HTML5.validateForm(myForm);
  
			  if(isFormValidated){
			    var email = $(idLoginUserNameInput).val();
			    var password = $(idLoginPasswordInput).val();
			    Edorble.Logic.Authorisation.TryToLoginEmailPassword(email, password, loginHandler); 
			  }
			},

			//Holds all business logic when clicking the login facebook button
			doLoginFacebookBehavior: function (loginHandler){
			    myFirebaseRef.authWithOAuthRedirect("facebook", 
			    	loginHandler,  
			    	{
			  			scope: "email" // the permissions requested
						});
			},
			
			//Add a function that takes care of login behavior for edorble
			prepareLoginForm: function (idLoginButton, idLoginForm, idLoginUserNameInput, idLoginPasswordInput, loginHandler)
			{
				$(idLoginButton).click(function (){
					Edorble.Logic.Authorisation.doLoginEmailPasswordBehavior(idLoginForm, idLoginUserNameInput, idLoginPasswordInput, loginHandler);
				});
			},

			//Preparation binding
			prepareLoginFacebook: function (idFacebookLoginButton, loginHandler){
				$(idFacebookLoginButton).click(function(){
					Edorble.Logic.Authorisation.doLoginFacebookBehavior(LoginHandler);
				});
			}
		}
	},
	Helpers:
	{
		HTML5:
		{
			validateForm: function (myForm)
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
		}
	}
}