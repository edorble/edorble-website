//Validate a html 5 form from javascript
function ValidateForm(myForm)
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