var worldCode = null;

$(document).ready(function(){
	console.log("here");
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
 		edorble.child("counter").on("value", function(snapshot) {
	  	$("#worldCount").html(snapshot.val());
  		if(locked === false)
  			{
 			$("#worldNumber").html(snapshot.val());
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
  		//put a reserve on the world code
  		counter.transaction(function(count){
  			return count+1;
  		});
  		
  		//track in mixpanel
  		mixpanel.track("World Claim Click");

	  	//CLAIM COMPLETED WITH WORLDNAME AND EMAIL 	
	  	$("#continue").on("click", function(){
  			$("#downloadScreen").css("top","0").css("left","0%").css("display","block").css("opacity","0");

  			//do animations
			$("#signupForm").animate({"opacity":"0"},350, function(){
				$("#downloadScreen").animate({"opacity":"1"},350);
				$("#signupForm").css("display","none");
			});

  	  		var d = new Date();
  	  		var month = d.getMonth()+1;
  			var day = d.getDate();
  			if(day <10){day = '0' + day}
  	  		if(month < 10){month = '0' + month}
		  	  		
  	  		//post signup to various services
  	  		$.get("https://zapier.com/hooks/catch/3odf1t/?category=Site%20Signup&Email%20Address="+encodeURIComponent($("#email").val())+"&World%20Name="+encodeURIComponent($("#className").val()));
  	  		mixpanel.alias($("#worldNameLabel2").html());
  			mixpanel.people.set({
  				"Class Name":$("#className").val(),
  				"World Code":$("#worldNameLabel2").html(),
  				$email : $("#email").val(),
  				$created : d.getFullYear() + '-' + month + '-' + day,
  				'Group' : 'Beta'
  			});

	  		mixpanel.track("World Claimed");
  	  			
			
			$("#worldLink").attr("href", "http://www.edorble.com/?w="+worldCode);
			$("#worldLink").html("edorble.com/?w="+worldCode);
			
			$("#copyLink").on("click", function(){
			
				$("#email").val($("#worldLink").html());
  				var copyTextarea = document.querySelector('#email');
  				copyTextarea.select();

  				try {
    				var successful = document.execCommand('copy');
    				var msg = successful ? 'successful' : 'unsuccessful';
    				console.log('Copying text command was ' + msg);
  				} catch (err) {
    				console.log('Oops, unable to copy');
  				}
				
			
				$("#copiedalert").css("opacity","0").css("display","block").animate({opacity:1}, 300, function(){
					setTimeout(function(){
						$("#copiedalert").animate({opacity:0}, 500, function(){
							$("#copiedalert").css("display","none");
						});
					}, 500);
				});
			});
			
  		});	
  		
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