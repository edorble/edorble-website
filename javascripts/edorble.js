var worldCode = null;

$(document).ready(function(){
 	///DOM Start state
 	if($(window).width() <= 480)
 	{
 		$("#claimWorld").html("Claim a World");
 	}
	$("#signupForm").css("opacity","0").css("display","none");
	$("#mainslide1").css("display","block");
	$("#slide1").css("display","block");
 	$("#overlay").css("display","none");
 	
 	var edorble = new Firebase("https://edorble.firebaseio.com/");
 	var counter = new Firebase("https://edorble.firebaseio.com/counter");
 	
 	var locked = false;
 	var worldCode = null;
 	
 	//check for world code	
	var query = location.search.substr(1);
  	var result = {};
  	query.split("&").forEach(function(part) {
    	var item = part.split("=");
    	result[item[0]] = decodeURIComponent(item[1]);
  	});

	//if it's present, show student version of hero
    if(result.w)
    {
        setTimeout(function(){
        	$("#mainslide1").animate({opacity:0}, 500);
        	$("#worldNameLabel2").html(result.w);
        	$("#worldLink").html("edorble.com?w="+result.w);
			$("#navBar").animate({"opacity":0}, 500);
			$("#downloadScreen").css("top","0").css("left","0%").css("display","block").css("opacity","0");
        	$("#reserveWorldBox").animate({opacity:0}, 500, function(){
	        	$("#overlay").css("display","block").css("opacity","0").animate({'opacity':1}, 500, function(){
  					$("#downloadScreen").animate({"opacity":"1"},350);
	        	});
        	});
        }, 0);
    }
 	
 	//if no student world code, GET AVAILABLE WORLD. Update whenever world is claimed.
 	if(!result.w)
 	{
 		counter.on("value", function(snapshot) {
	  	$("#worldCount").html(snapshot.val());
  		if(locked === false)
  			{
 			$("#worldNumber").html(snapshot.val()+1);
 			$("#finalButtonCode").html(snapshot.val());
 			$("#worldNameLabel2").html(snapshot.val());
 			$("#worldNumber").html(snapshot.val());
 			worldCode = snapshot.val();
 			locked=true; 	
  			}
  		}); 	
 	}
 	
  	//pre-load the download button with the OS-appropriate link
  	
  	if (navigator.appVersion.indexOf("Win")!=-1) 
  	{
  		downloadURL = winURL;//"https://edorble.blob.core.windows.net/client/Edorble_win_64bit.zip";
		OS = "windows";
  	}
	if (navigator.appVersion.indexOf("Mac")!=-1) 
	{
		downloadURL = macURL;//"https://edorble.blob.core.windows.net/client/Edorble_mac_64bit.zip";
		OS = "mac";
	}
	

	$("#inlineDownload").on("click", function(){
		console.log("click");
		downloadApp()
		window.location=downloadURL;
	});	
	$("#download2").on("click", function(){
		downloadApp()
		window.location=downloadURL;
	});			
	$("#download").on("click", function(){
		downloadApp()
		window.location=downloadURL;
	});
			
	function downloadApp()
	{
		mixpanel.track("Download",{"OS":OS});
	}

  	
  	
  	//CLAIM WORLD INITIATED
  	$("#claimWorld").on("click", function(){
  		$("#overlay").css("display","block").css("opacity","0").animate({"opacity":"1"},500);
  		$("#signupForm").css("display","block").css("opacity","0").animate({"opacity":"1"},500);
  		$("#slide1").animate({"opacity":"0"},250);
  		$("#mainslide1").animate({"opacity":"0"},250);
  		
  		//track in mixpanel
  		mixpanel.track("World Claim Click");
  		
	});
	
});

//worldLink
//download
 //worldNameLabel2   
 //completed
 //worldStamp
 //className
 //email
 
 //https://zapier.com/hooks/catch/3odzbs/
 

 
 /*
 if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
 */