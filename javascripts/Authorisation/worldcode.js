
/// @file worldcode.js
/// @namespace worldcode

////////////////////////////
///// Callbacks for Unity Login screen
///// The `worldcode` module contains high level  functions for communication between the UI and edorble worldcode web page
///////////////////////////

// define containers for DOM elements
var optionsButton;
var closeButton;
var playButton;
var worldCodeField;
var worldPwdField;
var worldCodeForm;

var errorDiv;
var errorName;
var errorMessage;
var passField;

//Firebase
var myFirebaseWorldsRef = new Firebase("https://edorble-dev.firebaseio.com/worlds/");

//$(document).ready(function(){});

// remove old go button for new launcher
engine.on("AttachControls", function() 
{
    if(optionsButton == null)  
	optionsButton = document.querySelector('a.w-button.icon-settings');    
  if(optionsButton)
    {
	    optionsButton.onclick = function()
	    {        	
		    engine.trigger('OnOptionsButtonClick');
	    };
    }    
  
  if(closeButton == null)  
	closeButton = document.querySelector('a.w-button.icon-cancel');

  if(closeButton)
    {
	    closeButton.onclick = function()
	    {        	
		    engine.trigger('OnCloseButtonClick');
	    };
    }    

  if(worldCodeField == null)  
	worldCodeField = document.querySelector('#input-world-code');

  if(passField == null)
    passField = $("#WorldNeedsPasswordBlock");

  if(passField != null)
    if(passField.is(":visible"))
	passField.hide();
    
  if(playButton == null)
	playButton = document.querySelector('a.w-button.login-button-play');

  if(playButton)
    {
	    playButton.onclick = function()
	    {
		if(worldCodeField.value.length < 1)// wrong world code
			return;

    		console.log("--value--" + worldCodeField.value);

    		    var newWorldRef = new Firebase(myFirebaseWorldsRef + "/"+ worldCodeField.value + "/public/stricted");
        	    newWorldRef.once('value', function(snap)
		    {
			var result = snap.val();
    			console.log("--value-res-" + result);
			if(result == null || result == false)
			{								
			    // not stricted
    			    console.log("--not-stricted--" + worldCodeField.value);
	    		    engine.trigger('OnPlayButtonClick', worldCodeField.value);
			    if(passField.is(":visible"))
    				passField.hide();
			    return; 
            		}
            		
			if(passField.is(":hidden"))
			{
    			    console.log("-show password field-");
			    passField.show("slow");
			    return;
			}

			if(worldPwdField == null)  
			    worldPwdField = document.querySelector('#input-world-password');

			if(worldPwdField.value.length < 1)
			{
			    console.log("-too short password-");
			    return;
			}

    			console.log("-- try world with given password --");
    			var newWorldPwdRef = new Firebase(myFirebaseWorldsRef + "/"+ worldCodeField.value + "/private/password/" + worldPwdField.value);
        		newWorldPwdRef.once('value', function(snap)
			{
			    var result = snap.val();
			    console.log("-password check res-" + result);
			    if(result)
			    {
			        // password is correct
			        console.log("-- correct password --");
			        engine.trigger('OnPlayButtonClick', worldCodeField.value);
            		    }
            		    else
            		    {
			        //incorrect password
			        console.log("-- incorrect password --");
            		    }
        		});
        	    });
	    };
    }


  if(worldCodeForm == null)  
    worldCodeForm = document.querySelector('#wcode-form');
  if(worldCodeForm)
    {
	worldCodeForm.onsubmit = function(e)
	{
          e.preventDefault();
          if(playButton)  
            playButton.onclick();
          return false;
	};
    }
 
    //error msg elements
    if(errorName == null)
	errorName = document.querySelector('#error-name');
    if(errorMessage == null)
	errorMessage = document.querySelector('#error-message');
    if(errorDiv == null)
	errorDiv = document.querySelector('div.login-choice-div.login-div-error');  
});

// fill in input field with saved worldcode value
engine.on("SetWorldCode", function(worldcode) {	

  if(worldCodeField == null)  
	worldCodeField = document.querySelector('input.w-input.login-choice-input');

    if(worldCodeField)  
	worldCodeField.value = worldcode;
});

engine.on("ErrorMessage", function(errorId, name, message) {	

    // activate error div
    //if(errorName) errorDiv.style.display = "block";
  if( errorId == -1)
  {
    if(errorName) errorDiv.style.opacity="0.0"; //hide
    return;
  }
  else
    if(errorName) errorDiv.style.opacity="1.0"; //show
    
  // assign values
  if(errorId == 1) // show custom error from Unity frontend
  {
	if(errorName) errorName.innerHTML = name;
	if(errorMessage)	errorMessage.innerHTML = message;
    }
  else
  if(errorId == 2) // worldcode  error
  {
	if(errorName) errorName.innerHTML = "Wrong worldcode";
	if(errorMessage)	errorMessage.innerHTML = "Only symbols and digits are allowed in worldcode!";
    }
  else
  if(errorId == 3) // LobbyState Disconnected
  {
	if(errorName) errorName.innerHTML = "Disconnected";
	if(errorMessage)	errorMessage.innerHTML = "Client was disconnected from the lobby.";
    }  
  else
  if(errorId == 4) // LobbyState Disconnected
  {
	if(errorName) errorName.innerHTML = "Error when connecting to Lobby";
	if(errorMessage)	errorMessage.innerHTML = "Connection error. Please contact us at support@edorble.com";
    }    
  else // unknown error
  {
	if(errorName) errorName.innerHTML = "An error occurred";
	if(errorMessage)	errorMessage.innerHTML = "Unexpected error " + errorId + " occured, please e-mail to support@edorble.com";
    }
});
