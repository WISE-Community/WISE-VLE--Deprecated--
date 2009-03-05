
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

function createVLEStateObject(xml) {
	xml = "<?xml version='1.0' encoding='ISO-8859-1'?><vle_state><node_visit><node><type>OTIntroPage</type></node><nodeStates></nodeStates><visitStartTime>Tue Mar 03 2009 11:10:25 GMT-0800 (PST)</visitStartTime><visitEndTime>Tue Mar 03 2009 11:10:33 GMT-0800 (PST)</visitEndTime></node_visit><node_visit><node><type>OTStudentAssessment</type></node><nodeStates><state><response>abc</response><timestamp>Tue Mar 03 2009 11:10:47 GMT-0800 (PST)</timestamp></state><state><response>abc</response><timestamp>Tue Mar 03 2009 11:10:48 GMT-0800 (PST)</timestamp></state><state><response>abc def</response><timestamp>Tue Mar 03 2009 11:10:53 GMT-0800 (PST)</timestamp></state></nodeStates><visitStartTime>Tue Mar 03 2009 11:10:33 GMT-0800 (PST)</visitStartTime><visitEndTime>Tue Mar 03 2009 11:10:54 GMT-0800 (PST)</visitEndTime></node_visit><node_visit><node><type>OTMatchSequence</type></node><nodeStates></nodeStates><visitStartTime>Tue Mar 03 2009 11:10:54 GMT-0800 (PST)</visitStartTime><visitEndTime>Tue Mar 03 2009 11:11:35 GMT-0800 (PST)</visitEndTime></node_visit><node_visit><node><type>OTQuiz</type></node><nodeStates><state><choiceIdentifier>choice 2</choiceIdentifier><timestamp>Tue Mar 03 2009 11:11:51 GMT-0800 (PST)</timestamp></state><state><choiceIdentifier>choice 3</choiceIdentifier><timestamp>Tue Mar 03 2009 11:11:57 GMT-0800 (PST)</timestamp></state></nodeStates><visitStartTime>Tue Mar 03 2009 11:11:35 GMT-0800 (PST)</visitStartTime><visitEndTime>Tue Mar 03 2009 11:11:59 GMT-0800 (PST)</visitEndTime></node_visit><node_visit><node><type>OTFillin</type></node><nodeStates><state><textEntryInteractionIndex>0</textEntryInteractionIndex><response>meiosis</response><timestamp>Tue Mar 03 2009 11:12:15 GMT-0800 (PST)</timestamp></state><state><textEntryInteractionIndex>1</textEntryInteractionIndex><response>poop</response><timestamp>Tue Mar 03 2009 11:12:21 GMT-0800 (PST)</timestamp></state></nodeStates><visitStartTime>Tue Mar 03 2009 11:11:59 GMT-0800 (PST)</visitStartTime><visitEndTime>Tue Mar 03 2009 11:12:23 GMT-0800 (PST)</visitEndTime></node_visit><node_visit><node><type>OTBlueJ</type></node><nodeStates></nodeStates><visitStartTime>Tue Mar 03 2009 11:12:23 GMT-0800 (PST)</visitStartTime><visitEndTime>null</visitEndTime></node_visit></vle_state>";
	vleState = VLE_STATE.prototype.parseDataXML(xml);
}


function poll() {
	setInterval("getAndUpdate();", 10000);
}

