//Preparation binding
function bindButtonEvents(){
	//Prepare Logout
	var idLogoutButton = "#button-logout";
	Edorble.Logic.Authorisation.prepareLogout(idLogoutButton);
}

//On page load
$( document ).ready(function() {
	var idRequiresLoginSection = "#Requires-login-section";
	var idDashboardSection ="#dashboard-section";
	Edorble.Logic.Dashboard.adjustViewBasedOnLoginState(idRequiresLoginSection, idDashboardSection);
	
	//Prepare Logout
	var idLogoutButton = "#button-logout";
	Edorble.Logic.Authorisation.prepareLogout(idLogoutButton);
});