//Prepare variables
var myFirebaseUsersRef = 
	new Firebase("https://edorble-dev.firebaseio.com/users");

//Business Logic
//General
// Checks
function checkAuthState(){
var authData = myFirebaseUsersRef.getAuth();
if (authData) {
  $('#welcome-message').text("Welcome User " + authData.uid);
  $("#Requires-login-section").css("display","none"); //Hide the 'you need to login' part
} else {
  $('#welcome-message').text("You need to be logged in for this page");
  $("#dashboard-section").css("display","none"); //Hide the 'information you can see when logged in' part
}
}

//Preparation binding
function bindButtonEvents(){
$('#button-logout').click( function(){
	myFirebaseUsersRef.unauth();
  window.location = "http://cederiks-playground.webflow.io/";
  });
}

//View binding
function bindViewData(){
	var authData = myFirebaseUsersRef.getAuth();
  if(authData)
  {
  	var user = myFirebaseUsersRef.child(authData.uid);
    console.log("uid " + authData.uid);
    console.log("user string " + user.toString());
    user.once("value", function(data) {
        var userInfo = data.val();
        //Bind data to dom
        $("#placeholder-email").text(userInfo.email);
        $("#placeholder-world").text(userInfo.world);
      });
  }
  else{
  	console.log("the user is not logged in.");
  }
  
}

//Test functions
function runFirebaseExample(){
//Do nothing
}

//On page load
$( document ).ready(function() {
	checkAuthState();
	bindButtonEvents();
  bindViewData();
	runFirebaseExample();
});