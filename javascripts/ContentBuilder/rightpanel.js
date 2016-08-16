
		// every stored link should have unique id, it filled in this script by unity when user clicks on some link in left panel
	    var Id = "";
		var Icon = "";
		var Title = "";
		var Description = "";
		
		//receive data for fill in the HTML template
		engine.on("OnReceiveData", function (id, json_string)
		{
			console.log("OnReceiveData " + id + ", json_string " + json_string);		
			if(id==null || id===false)
					return;  // wrong data input
			
			var arr_from_json = JSON.parse( json_string );
			
			Id = id;
		    Icon = arr_from_json[0];
			Title = arr_from_json[1];
			Description = arr_from_json[2];;
			
			console.log( "OnReceiveData " + Id + ", linkIcon " + Icon + ", title " +  Title + ", desc " + Description);
			
			FillInData();
		});

		// fill in this HTML template
		function FillInData()
		{
			var obj = $("#icon");
			obj.removeClass();
			obj.addClass(Icon);
		
			$("#title").html(Title);
			$("#description").html(Description);
		}
		
