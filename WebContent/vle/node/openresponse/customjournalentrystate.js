/**
 * Object for storing state information of a Custom Journal Entry item.
 */
 
function CUSTOMJOURNALENTRYSTATE (response, timestamp, id, title){
	this.response = response;
	this.id = id;
	this.title = title;
	this.timestamp = timestamp;
};

CUSTOMJOURNALENTRYSTATE.prototype.getHtml = function(){
	return "title: " + this.title + " created on: " + this.timestamp + " response: " + this.response;
};

CUSTOMJOURNALENTRYSTATE.prototype.getDataXML = function() {
	return "<JournalEntry title=\"" + this.title + "\" id=\"" + this.id + "\"><timestamp>" + this.timestamp + "</timestamp><response>" + this.response + "</response></JournalEntry>";
};

CUSTOMJOURNALENTRYSTATE.prototype.parseDataXML = function(stateXML){
	var response = stateXML.getElementsByTagName("response")[0];
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	var id = stateXML.getAttribute('id');
	var title = stateXML.getAttribute('title');
	
	if(response == undefined || timestamp == undefined || id == undefined || title == undefined) {
		return null;
	} else {
		return new CUSTOMJOURNALENTRYSTATE(response.textContent, timestamp.textContent, id, title);		
	}
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/openresponse/customjournalentrystate.js");