//Prepare variables
var myFirebaseRef = 
	new Firebase("https://edorble.firebaseio.com/");
var myFirebaseWorldsRef = 
	new Firebase("https://edorble.firebaseio.com/worlds/");
var myFirebaseUsersRef = 
	new Firebase("https://edorble.firebaseio.com/users/");
var myFirebaseCounterRef = 
	new Firebase("https://edorble.firebaseio.com/counter");
	
//General settings
	var dashboardpage = "http://edorble.com/dashboard/myedorble";
	var logoutpage = "http://edorble.com";

//Login.js variables
	var Login_idLoginFeedback = "";	
//Register.js variables	
var Register_emailholder = "";
var Register_passwordholder = "";
var Register_worldcode = null;
var Register_idRegisterFeedback = "";
var Register_idRegisterFacebookFeedback = "";
var Register_idRegisterTwitterFeedback = "";
var Register_idRegisterGoogleFeedback = "";
	
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
			  		window.location = dashboardpage;
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
			
			//***************************************
			// 				Logout
			//***************************************
			
			// Try the login details provided by the user
			logout: function (){
				// Try to auth using Firebase and with an email/password combination
				myFirebaseRef.unauth();
			  	window.location = logoutpage;
			},
			
			//Preparation binding
			prepareLogout: function (idLogoutButton){
				$(idLogoutButton).click(function(){
					Edorble.Logic.Authorisation.logout();
				});
			},
			
			// Create a callback to handle the result of the authentication
			loginHandler: function (error, authData) {
			  if (error) {
			    $(Login_idLoginFeedback).text(error);
			  } else {
			   				
				//Tell mixpanel we're logged in
				mixpanel.identify(authData.uid);
				mixpanel.track("Login");
				
		      	//add user
		      	var userRef = new Firebase(myFirebaseUsersRef + "/" + authData.uid);
		
				userRef.once('value', function(snap) {
					var result = snap.val();
					if(result == null)
					{ 	
						//Inform user he should register first
						$(Login_idLoginFeedback).text("You are not registered, please claim a world first.");
						Edorble.Helpers.Animation.showAndDissapear(Login_idLoginFeedback);
					}
					else{
						//Setup that upon login the user is redirected to the following page
						window.location = dashboardpage;
					}
				});
			  }
			},
			
			//***************************************
			// 		Login with email and password
			//***************************************
			
			// Try the login details provided by the user
			TryToLoginEmailPassword: function (email, password){
				// Try to auth using Firebase and with an email/password combination
			  myFirebaseRef.authWithPassword({
			    email    : email,
			    password : password
			  }, Edorble.Logic.Authorisation.loginHandler);
			},

			//Holds all business logic when clicking the login button
			doLoginEmailPasswordBehavior: function (idLoginForm, idLoginUserNameInput, idLoginPasswordInput){
				var myForm = $(idLoginForm);
				var isFormValidated = Edorble.Helpers.HTML5.validateForm(myForm);
  
			  if(isFormValidated){
			    var email = $(idLoginUserNameInput).val();
			    var password = $(idLoginPasswordInput).val();
			    Edorble.Logic.Authorisation.TryToLoginEmailPassword(email, password); 
			  }
			},
			
			//Add a function that takes care of login behavior for edorble
			prepareLoginForm: function (idLoginButton, idLoginForm, idLoginUserNameInput, idLoginPasswordInput, idLoginFeedback)
			{
				Login_idLoginFeedback = idLoginFeedback;
				
				$(idLoginButton).click(function (){
					Edorble.Logic.Authorisation.doLoginEmailPasswordBehavior(
						idLoginForm, 
						idLoginUserNameInput, 
						idLoginPasswordInput);
				});
			},
			
			//***************************************
			// 		Login with Facebook
			//***************************************
			
			//Holds all business logic when clicking the login facebook button
			doLoginFacebookBehavior: function (){
			    myFirebaseRef.authWithOAuthPopup("facebook", 
			    	Edorble.Logic.Authorisation.loginHandler,  
			    	{
			  			scope: "email" // the permissions requested
						});
			},
			
			//Preparation binding
			prepareLoginFacebook: function (idFacebookLoginButton, idLoginFeedback){
				Login_idLoginFeedback = idLoginFeedback;
				
				$(idFacebookLoginButton).click(function(){
					Edorble.Logic.Authorisation.doLoginFacebookBehavior();
				});
			},
			
			//***************************************
			// 		Login with Twitter
			//***************************************
			
			//Holds all business logic when clicking the login twitter button
			doLoginTwitterBehavior: function (){
			    myFirebaseRef.authWithOAuthPopup("twitter", 
					Edorble.Logic.Authorisation.loginHandler);
			},
			
			//Preparation binding
			prepareLoginTwitter: function (idTwitterLoginButton, idLoginFeedback){
				Login_idLoginFeedback = idLoginFeedback;
				
				$(idTwitterLoginButton).click(function(){
					Edorble.Logic.Authorisation.doLoginTwitterBehavior();
				});
			},
			
			//***************************************
			// 		Login with Google
			//***************************************
			
			//Holds all business logic when clicking the login google button
			doLoginGoogleBehavior: function (){
			    myFirebaseRef.authWithOAuthPopup("google", 
					Edorble.Logic.Authorisation.loginHandler);
			},
			
			//Prepare google login - important this will not work with coherent due to pop ups
			prepareLoginGoogle: function (idGoogleLoginButton, idLoginFeedback){
				Login_idLoginFeedback = idLoginFeedback;
				
				$(idGoogleLoginButton).click(function(){
					Edorble.Logic.Authorisation.doLoginGoogleBehavior();
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
		  	//CLAIM COMPLETED WITH WORLDNAME AND EMAIL 	
		  	postSignupToVariousServices: function(email, uid, worldname, worldcode){

		  		var d = new Date();
		  		var month = d.getMonth()+1;
				var day = d.getDate();
				if(day <10){day = '0' + day}
		  		if(month < 10){month = '0' + month}
	  	  		
		  		//post signup to various services
		  		$.get("https://zapier.com/hooks/catch/3odf1t/?category=Site%20Signup&Email%20Address="+encodeURIComponent(email)+"&World%20Name="+encodeURIComponent(worldname));
		  		
				mixpanel.alias(uid);
				mixpanel.people.set({
					"Class Name":worldname,
					$email : email,
					$created : d.getFullYear() + '-' + month + '-' + day,
					'Group' : 'Beta'
				});
				mixpanel.people.union({
					"World codes":worldcode
				});
			},
			
			//Store the information in our backend
			storeNewlyRegisteredUserInformation: function (userData){
		      	//Put a reserve on the worldcode - Increment worldcode
		      	myFirebaseCounterRef.transaction(function (worldcounter){
		          	return worldcounter + 1;
		        });
				//Use the now reserved worldcode to create what is required.
				var lockedWorldcode = Register_worldcode;
				var newWorldRef = new Firebase(myFirebaseWorldsRef + "/"+ lockedWorldcode);
				var worldname = "world " + lockedWorldcode;
				newWorldRef.transaction(function(currentData) {
					if (currentData === null) {
				    	return { 
				        	admin_uid: userData.uid,
				        	name: worldname
						};
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
				
						newUserRef.once('value', function(snap) {
							var result = snap.val();
							if(result == null)
							{
								console.log("user does not exist");
						      	myFirebaseUsersRef.child(userData.uid).set(
									{
										email: Register_emailholder, 
										worlds: {
											[lockedWorldcode]:true
										}
						       	});
								
								//post information on new user to various services
								Edorble.Logic.Authorisation.postSignupToVariousServices(
									Register_emailholder, 
									userData.uid, 
									worldname, 
									lockedWorldcode);
							}
							else{
								console.log("user exists");
								newUserRef.child("worlds").update({
									[lockedWorldcode]:true
								});
								
								//Identify on mixpanel
								mixpanel.identify(userData.uid);
								mixpanel.people.union({
									"World codes":lockedWorldcode
								});
							}
						});

				  		mixpanel.track("World Claimed");
				  }
				});
			},
			
			//Value monitor of firebase entry
			monitorWorldCounter: function(){
				//Firebase value monitors
				myFirebaseCounterRef.on("value", function(snapshot) {
					Register_worldcode = snapshot.val();
				});
			},
			
			//***************************************
			//	Register using Email & Password
			//***************************************
			
			// Create a callback to handle the result of the registration
			registerEmailPasswordHandler: function (error, userData) {
			  if (error) {
			    	$(Register_idRegisterFeedback).text(error);
			  } else {
				  mixpanel.track("World Claim Email");
				  
			    Edorble.Logic.Authorisation.storeNewlyRegisteredUserInformation(userData);
			    Edorble.Logic.Authorisation.TryToLoginEmailPassword(
					Register_emailholder, 
					Register_passwordholder); 
			  }
			},
			
			// Try the login details provided by the user
			TryToRegisterEmailPassword: function (email, password){
				// Try to auth using Firebase and with an email/password combination
				Register_emailholder = email;
				Register_passwordholder = password;

				myFirebaseRef.createUser({
				email    : email,
				password : password
				}, Edorble.Logic.Authorisation.registerEmailPasswordHandler);
			},
			
			//Holds all business logic when clicking the login button
			doRegisterEmailPasswordBehavior: function (idRegisterForm, idRegisterUserNameInput, idRegisterPasswordInput){
				var myForm = $(idRegisterForm);
				var isFormValidated = Edorble.Helpers.HTML5.validateForm(myForm);
  
			  if(isFormValidated){
			    var email = $(idRegisterUserNameInput).val();
			    var password = $(idRegisterPasswordInput).val();
			    Edorble.Logic.Authorisation.TryToRegisterEmailPassword(email, password); 
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
				  	mixpanel.track("World Claim Facebook");
					
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
			
			//***************************************
			//	Register using Twitter
			//***************************************
			
			continueTwitterHandler: function(error, authData){
  			  if (error) {
  			    	$(Register_idRegisterTwitterFeedback).text(error);
  			  } else {
				  mixpanel.track("World Claim Twitter");
				  	//Pull the email adress from facebook
				  Register_emailholder = "";
				  Edorble.Logic.Authorisation.storeNewlyRegisteredUserInformation(authData);
				  
				  //Setup that upon login the user is redirected to the following page
				  window.location = dashboardpage; 
  			  }
			},
			
			//Holds all business logic when clicking the login facebook button
			doRegisterTwitterBehavior: function (loginHandler){
			    myFirebaseRef.authWithOAuthPopup("twitter", Edorble.Logic.Authorisation.continueTwitterHandler);
			},
			
			//Add a function that takes care of login behavior for edorble
			prepareRegisterTwitter: function (idRegisterTwitterButton, idRegisterTwitterFeedback)
			{
				Register_idRegisterTwitterFeedback = idRegisterTwitterFeedback;
				
				$(idRegisterTwitterButton).click(function (){
					Edorble.Logic.Authorisation.doRegisterTwitterBehavior();
				});
								
				Edorble.Logic.Authorisation.monitorWorldCounter();
			},
			
			//***************************************
			//	Register using Google
			//***************************************
			
			continueGoogleHandler: function(error, authData){
  			  if (error) {
  			    	$(Register_idRegisterGoogleFeedback).text(error);
  			  } else {
				  mixpanel.track("World Claim Google");
				  	//Pull the email adress from google
				  Register_emailholder = authData.google.email;
				  	Edorble.Logic.Authorisation.storeNewlyRegisteredUserInformation(authData);
				  
				  	//Setup that upon login the user is redirected to the following page
				  	window.location = dashboardpage;
  			  }
			},
			
			//Holds all business logic when clicking the login google button
			doRegisterGoogleBehavior: function (loginHandler){
			    myFirebaseRef.authWithOAuthPopup("google", 
			    	Edorble.Logic.Authorisation.continueGoogleHandler, //Logs in using google  
			    	{
			  			scope: "email" // the permissions requested
						});
			},
			
			//Add a function that takes care of login behavior for edorble
			prepareRegisterGoogle: function (idRegisterGoogleButton, idRegisterGoogleFeedback)
			{
				Register_idRegisterGoogleFeedback = idRegisterGoogleFeedback;
				
				$(idRegisterGoogleButton).click(function (){
					Edorble.Logic.Authorisation.doRegisterGoogleBehavior();
				});
								
				Edorble.Logic.Authorisation.monitorWorldCounter();
			},
		},
		Dashboard:
		{
			bindDashboardData: function(authData){
				//define view fields
				var viewWorldCode = "#data-world-code";
				var idTweetInviteOthersButton = "#tweet-invite-others-button";
				
			  	var user = myFirebaseUsersRef.child(authData.uid);
				
			    user.once("value", function(data) {
			        var userInfo = data.val();
					//Hack to get the first worldcode out the list. In the future we can provide multiple world support.
					//Backend is ready for users to claim multiple worlds.
					var worldcode = Object.keys(userInfo.worlds)[0];
					
			        //Bind data to dom
			        $(viewWorldCode).text(worldcode);
					
					//Bind twitter info
					var urlAndWorldCode = "http://www.edorble.com/?w=" + worldcode;
					Edorble.Logic.Twitter.bindTweetToButton(idTweetInviteOthersButton, urlAndWorldCode, "Come join me in my edorble world!", "edtech, edchat")
					
			      });
			},
			
			adjustViewBasedOnLoginState: function(idRequiresLoginSection, idDashboardSection){
				var authData = myFirebaseUsersRef.getAuth();
				if (authData) {
					//Bind the model to the data
					Edorble.Logic.Dashboard.bindDashboardData(authData);
					
					//Hide the 'you need to login' part
					$(idRequiresLoginSection).css("display","none"); 					
				} else {
					$(idDashboardSection).css("display","none"); //Hide the 'information you can see when logged in' part
				}
			},
		},
		Twitter:
		{
			//url=<url to tweet>
			//text=<text to tweet>
			//hashtags=<comma separated list of hashtags, with no # on them>
			bindTweetToButton: function(idTwitterButton, url, text, hashtags)
			{
				var urlPart = "url=" + url;
				var textPart = "&text=" + text;
				var hashtagPart = "&hashtags=" + hashtags;

				var a = document.getElementById('tweet-invite-others-button'); //or grab it by tagname etc
				a.href = "https://twitter.com/intent/tweet?" + urlPart + textPart + hashtagPart;
			}
		},
	},
	Helpers:
	{
		Animation:
		{
			showAndDissapear: function (jqueryID)
			{
				$(jqueryID).animate(
					{opacity:100}, 
					600,
					function(){
						$(jqueryID).animate(
							{opacity:0},
						600)
						});
			},
		},
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