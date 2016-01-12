//Prepare variables
var myFirebaseRef = 
	new Firebase("https://edorble-dev.firebaseio.com/");
var myFirebaseWorldsRef = 
	new Firebase("https://edorble-dev.firebaseio.com/worlds/");
var myFirebaseUsersRef = 
	new Firebase("https://edorble-dev.firebaseio.com/users/");
	
//General settings
	var dashboardpage = "http://cederiks-playground.webflow.io/dashboard-prototype";
	
//Register.js variables	
var Register_emailholder = "";
var Register_passwordholder = "";
var Register_worldcode = null;
var Register_idRegisterFeedback = "";
var Register_idRegisterFacebookFeedback = "";
	
var Edorble = 
{
	Model: true, //no models for now
	Logic:
	{
		Authorisation:
		{
			// ---- Auth check ----
			sendToPageIfAlreadyLoggedIn: function (page){
			var authData = myFirebaseRef.getAuth();
			if (authData) {
			  		window.location = url_dashboardpage;
				} 
			},
			
			redirectToPageOnLogin: function (page){
				myFirebaseRef.onAuth(function(authData) {
					  if (authData) {
					    console.log("Authenticated with uid:", authData.uid);
					    window.location = page;
					  } else {
					    console.log("Client unauthenticated.")
					  }
					});
			},
			
			//***************************************
			//***************************************
			// 				Login
			//***************************************
			//***************************************
			
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
					Edorble.Logic.Authorisation.doLoginEmailPasswordBehavior(
						idLoginForm, 
						idLoginUserNameInput, 
						idLoginPasswordInput, 
						loginHandler);
				});
			},

			//Preparation binding
			prepareLoginFacebook: function (idFacebookLoginButton, loginHandler){
				$(idFacebookLoginButton).click(function(){
					Edorble.Logic.Authorisation.doLoginFacebookBehavior(LoginHandler);
				});
			},
			
			//***************************************
			//***************************************
			// 				Registration
			//***************************************
			//***************************************
			
			//***************************************
			// 				General
			//***************************************
			storeNewlyRegisteredUserInformation: function (userData){
			var lockedWorldcode = Register_worldcode;
			var newWorldRef = new Firebase(myFirebaseWorldsRef + "/"+ lockedWorldcode);
			console.log("new world path " + newWorldRef.toString());
			  newWorldRef.transaction(function(currentData) {
			    if (currentData === null) {
			      return { 
			        admin_uid: userData.uid,
			        name: "world " + lockedWorldcode};
			    } else {
			      console.log('World already exists: ' + lockedWorldcode);
			      return; // Abort the transaction.
			    }
			  }, function(error, committed, snapshot) {
			    if (error) {
			      console.log('Transaction failed abnormally!', error);
			    } else if (!committed) {
			      console.log('We aborted the transaction (because world already exists).');
			    } else {
			      console.log('world added! ' + lockedWorldcode );
			      //add user
			      var newUserRef = new Firebase(myFirebaseUsersRef + "/" + userData.uid);
			      console.log("new user to be created: " + newUserRef.toString());
			      myFirebaseUsersRef.child(userData.uid).set({email: Register_emailholder, 
			        	world: lockedWorldcode
			          });
			      //Increment worldcode
			      myFirebaseRef.child("worldcounter").transaction(function (worldcounter){
			          return worldcounter + 1;
			        });
			    }
			  });
			  // Set mixpanel alias
			},
			
			// Create a callback to handle the result of the login after auth. Normally this should never occur.
			loginAfterRegisterHandler: function (error, authData) {
			  if (error) {
			    console.log("Login Failed!", error);
			  } else {
			    console.log("Authenticated successfully with payload:", authData);
				
				//Setup that upon login the user is redirected to the following page
				window.location = dashboardpage;
			  }
			},
			
			//Value monitor of firebase entry
			monitorWorldCounter: function(){
				//Firebase value monitors
				myFirebaseRef.child("worldcounter").on("value", function(snapshot) {
					Register_worldcode = snapshot.val();
				});
			},
			
			//***************************************
			//	Register using Email & Password
			//***************************************
			
			// Create a callback to handle the result of the authentication
			registerEmailPasswordHandler: function (error, userData) {
			  if (error) {
			    	$(Register_idRegisterFeedback).text(error);
			  } else {
			    Edorble.Logic.Authorisation.storeNewlyRegisteredUserInformation(userData);
			    Edorble.Logic.Authorisation.TryToLoginEmailPassword(
					Register_emailholder, 
					Register_passwordholder, 
					Edorble.Logic.Authorisation.loginAfterRegisterHandler); 
			  }
			},
			
			// Try the login details provided by the user
			TryToRegisterEmailPassword: function (email, password, registerHandler){
				// Try to auth using Firebase and with an email/password combination
				Register_emailholder = email;
				Register_passwordholder = password;

				myFirebaseRef.createUser({
				email    : email,
				password : password
				}, registerHandler);
			},
			
			//Holds all business logic when clicking the login button
			doRegisterEmailPasswordBehavior: function (idRegisterForm, idRegisterUserNameInput, idRegisterPasswordInput){
				var myForm = $(idRegisterForm);
				var isFormValidated = Edorble.Helpers.HTML5.validateForm(myForm);
  
			  if(isFormValidated){
			    var email = $(idRegisterUserNameInput).val();
			    var password = $(idRegisterPasswordInput).val();
			    Edorble.Logic.Authorisation.TryToRegisterEmailPassword(email, password, Edorble.Logic.Authorisation.registerEmailPasswordHandler); 
			  }
			},
			
			//Add a function that takes care of login behavior for edorble
			prepareRegisterForm: function (idRegisterButton, idRegisterForm, idRegisterUserNameInput, idRegisterPasswordInput, idRegisterFeedback)
			{
				Register_idRegisterFeedback = idRegisterFeedback;
				
				$(idRegisterButton).click(function (){
					Edorble.Logic.Authorisation.doRegisterEmailPasswordBehavior(idRegisterForm, idRegisterUserNameInput, idRegisterPasswordInput);
				});
								
				Edorble.Logic.Authorisation.monitorWorldCounter();
			},
			
			//***************************************
			//	Register using Facebook
			//***************************************
			
			continueFacebookHandler: function(error, authData){
  			  if (error) {
  			    	$(Register_idRegisterFacebookFeedback).text(error);
  			  } else {
				  	//Pull the email adress from facebook
				  	Register_emailholder = authData.facebook.email
				  	Edorble.Logic.Authorisation.storeNewlyRegisteredUserInformation(authData);
				  
				  	//Setup that upon login the user is redirected to the following page
				  	window.location = dashboardpage;
  			  }
			},
			
			//Holds all business logic when clicking the login facebook button
			doRegisterFacebookBehavior: function (loginHandler){
			    myFirebaseRef.authWithOAuthPopup("facebook", 
			    	Edorble.Logic.Authorisation.continueFacebookHandler, //Logs in using facebook  
			    	{
			  			scope: "email" // the permissions requested
						});
			},
			
			//Add a function that takes care of login behavior for edorble
			prepareRegisterFacebook: function (idRegisterFacebookButton, idRegisterFacebookFeedback)
			{
				Register_idRegisterFacebookFeedback = idRegisterFacebookFeedback;
				
				$(idRegisterFacebookButton).click(function (){
					Edorble.Logic.Authorisation.doRegisterFacebookBehavior();
				});
								
				Edorble.Logic.Authorisation.monitorWorldCounter();
			},
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