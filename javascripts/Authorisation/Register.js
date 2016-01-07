<!-- Firebase -->
<script>
//Prepare variables
var myFirebaseRef = 
	new Firebase("https://edorble-dev.firebaseio.com/");
var myFirebaseWorldsRef = 
	new Firebase("https://edorble-dev.firebaseio.com/worlds/");
var myFirebaseUsersRef = 
	new Firebase("https://edorble-dev.firebaseio.com/users/");
var url_dashboardpage = 
	"http://cederiks-playground.webflow.io/dashboard-prototype"
var emailholder = "";
var passwordholder = "";
var worldcode = null;

//Firebase value monitors
myFirebaseRef.child("worldcounter").on("value", function(snapshot) {
	worldcode = snapshot.val();
});

//Business Logic
//General
//Validate input based on the configuration set in webflow
function ValidateForm(myForm)
{
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
// Authentication 
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
// End of Authentication 
// Registration 
function StoreNewlyRegisteredUserInformation(email, userData){
var lockedWorldcode = worldcode;
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
      myFirebaseUsersRef.child(userData.uid).set({email: email, 
        	world: lockedWorldcode
          });
      //Increment worldcode
      myFirebaseRef.child("worldcounter").transaction(function (worldcounter){
          return worldcounter + 1;
        });
    }
  });
  // Set mixpanel alias
}
// Create a callback to handle the result of the authentication
function RegisterHandler(error, userData) {
  if (error) {
    	$('#Register-Feedback').text(error);
  } else {
    StoreNewlyRegisteredUserInformation(emailholder, userData);
    TryToLoginEmailPassword(emailholder,passwordholder);
  }
}

function TryToRegister(email, password){
	// Try to auth using Firebase and with an email/password combination
  emailholder = email;
  passwordholder = password;
  
  myFirebaseRef.createUser({
    email    : email,
    password : password
  }, RegisterHandler);
}

//Holds all business logic when clicking the login button
function doRegisterBehavior(){
	var myForm = $('#Register-Form');
	var isFormValidated = ValidateForm(myForm);
  
  if(isFormValidated){
    var email = $('#Register-Input-UserName').val();
    var password = $('#Register-Input-Password').val();
    TryToRegister(email, password); //Async operation handles by authhandler
  }
}
// End of Registration 
// Checks
function checkAuthState(){
var authData = myFirebaseRef.getAuth();
if (authData) {
  $('#auth-state').text("User " + authData.uid + " is logged in with " + authData.provider);
} else {
  $('#auth-state').text("User is logged out");
}
}

//Preparation binding
function bindButtonEvents(){
$("#button").on("click", checkAuthState);
$("#button-register").click(doRegisterBehavior);
}

//Test functions
function runFirebaseExample(){
}

//On page load
$( document ).ready(function() {
	bindButtonEvents();
	runFirebaseExample();

});

</script>