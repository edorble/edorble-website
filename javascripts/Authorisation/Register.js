<!-- start Mixpanel -->
<script type="text/javascript">
(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);
mixpanel.init("8e7d7d91d93cf32e45644b27e96209b9");</script><!-- end Mixpanel -->
//On page load
$( document ).ready(function() {
	//Not a good idea i think
	//Edorble.Logic.Authorisation.sendToPageIfAlreadyLoggedIn("http://cederiks-playground.webflow.io/dashboard-prototype");
	
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
	
	//Prepare register using facebook
	var idFacebookRegisterButton = "#button-register-facebook";
	Edorble.Logic.Authorisation.prepareRegisterFacebook(idFacebookRegisterButton, idRegisterFeedback);
	
	//Prepare register using twitter
	var idTwitterRegisterButton = "#button-register-twitter";
	Edorble.Logic.Authorisation.prepareRegisterTwitter(idTwitterRegisterButton, idRegisterFeedback);
	
	//Prepare register using google
	var idGoogleRegisterButton = "#button-register-google";
	Edorble.Logic.Authorisation.prepareRegisterGoogle(idGoogleRegisterButton, idRegisterFeedback);
});