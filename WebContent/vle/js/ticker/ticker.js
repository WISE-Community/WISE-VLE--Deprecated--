
function getAndUpdate() {
	var postURL = "../getdata.html?dataId=4";

	/*
		var userId = user;
		if (userId == null) {
			userId = this.id;
		}
		
		if(userId < 0) {
			//return;
		}	
*/
		var callback = {
			success: function(o) {
			    //alert(o.responseText);
			    var vleState = o.responseXML;
			    var htmlSoFar = "";
			    var nodeVisits = vleState.getElementsByTagName("node_visit");
			    //alert('nodevisits.length:' + nodeVisits.length);
			    for (var i=0; i< nodeVisits.length; i++) {
			    	var nodeVisit = nodeVisits[i];
			    	if (nodeVisit.getElementsByTagName("state")) {
			    		// hack, only student assessments have states right now
			    		var responses = nodeVisit.getElementsByTagName("response");
			    		for (var k=0; k < responses.length; k++) {
			    			//alert("k:" + k);
			    			var response = responses[k];
			    			htmlSoFar += response.textContent + "<br/><br/>";
			    		}
			    	}
			    }
				document.getElementById("studentnote1").innerHTML = htmlSoFar;
			},
			
			failure: function(o) {
				//alert('failure: ' + o.statusText + ' ' + o.argument);
			}
		};
		/*
		 * the data to send back to the db which includes id, and the xml
		 * representation of the students navigation and work 
		 */ 
		//the async call to send the data back to the db
		YAHOO.util.Connect.asyncRequest('GET', postURL, callback);
	
}

function poll() {
	setInterval("getAndUpdate();", 10000);
}