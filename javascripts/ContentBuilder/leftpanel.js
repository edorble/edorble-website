		var linksData = new Array();		
		linksData[0] = '["iconLink", "George Orwell. 1984", "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him. <br><br>The hallway smelt of boiled cabbage and old rag mats."]';
		linksData[1] = '["iconVideo", "Independence day 2", "We always knew they were coming back. The next epic chapter delivers global catastrophe on an unimaginable scale. Using recovered alien technology, the nations of Earth have collaborated on an immense defence program to protect the planet. But nothing can prepare us for the aliens’ advanced and unprecedented force."]';
		linksData[2] = '["iconPicture", "Content Builder", "One of our strongest assets is the community`s ability to bring self-expression into conversation, pushing the boundaries of creativity to a new level. Today, we`ve improved creative communication by launching a new way to delivery the content, with access to formatting, emotions, and, for Premium Members, the ability to include artwork and files in your descriptions."]';
		linksData[3] = '["iconAssessment", "Psychological assessment", "<b>Psychological evaluation</b> is defined as a way of testing people about their behaviour, personality, and capabilities to draw conclusions using combinations of techniques.[1] Over the years, it has developed from unethical methods of locking people up for tests to the many different strategies seen today."]';
		linksData[4] = '["iconPresentation", "Develop collaboratively", "A presentation program is often used to generate the presentation content, some of which also allow presentations to be developed collaboratively, e.g. using the Internet by geographically disparate collaborators. Presentation viewers can be used to combine content from different sources into one presentation."]';
		
		var links = new Object();
		$(document).ready(function() {
	
			$(".destination").mouseup(
				function (event)
				{
					var attrId = event.target.id;
					engine.trigger('OnDestinationUP', attrId);						
				}
			);

			$(".destination").mousedown(
				function (event)
				{
					var attrId = event.target.id;
					engine.trigger('OnLinkDown', attrId);						
				}
			);
			
			$(".destination").click(
				function (event)
				{
					var attrId = event.target.id;
					if (links.hasOwnProperty(attrId)) 
					{
						//console.log( "objId " + attrId + ", " + links[attrId]);
						engine.trigger('OnLinkClicked', links[attrId], attrId, linksData[Math.floor(Math.random() * linksData.length)]);
					}
				}
			);
			
			$("#Exit").click(
				function (event)
				{
					engine.trigger('OnExitWebcastClicked');
				}
			);			
		});
		
		engine.on("OnReceiveData", function (id, value)
		{
			console.log( "OnReceiveData " + id + ", value " +  value);		
			links[id] = value;
			
			var obj = $("#" + id);			
			obj.removeClass("iconAdd");
			obj.removeClass("iconLink");
			obj.addClass("iconLink");
		});

		engine.on("OnLinkCleared", function (id)
		{
			console.log( "OnLinkCleared " + id );
			if (links.hasOwnProperty(id))
			{
				delete links[id];				
			}
			
			var obj = $("#" + id);			
			obj.removeClass("iconAdd");
			obj.removeClass("iconLink");
			obj.addClass("iconAdd");
		});
