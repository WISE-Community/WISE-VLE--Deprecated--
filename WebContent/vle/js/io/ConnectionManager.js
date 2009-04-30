function ConnectionManager(vle) {
	this.postURL = "../postdata.html";
	this.getURL = "";
	this.vle = vle;
	this.id = -2;
	this.lastSavedTimestamp = null;
	
	this.echoURL = "../echo.html";
	if (vle && vle != null && vle.postDataUrl != null) {
    	this.postURL = vle.postDataUrl;
    }
	this.lastPostStates = "";
}

ConnectionManager.prototype.setVLE = function(vle) {
	this.vle = vle;
}

ConnectionManager.prototype.setPostURL = function(postURL) {
	this.postURL = postURL;
}

ConnectionManager.prototype.setGetURL = function(getURL) {
	this.getURL = getURL;
}

/**
 * Sends the user's navigation and student data back to the vle db
 */
ConnectionManager.prototype.post = function(workgroupId, userName, save) {
	
	if(this.postURL == null) {
		return;
	}
	
	var save = save;
	var postData;
	
	if (workgroupId == null) {
		workgroupId = this.id;
	}
	
	if(workgroupId < 0) {
		//return;
	}	


	/*
	 * the data to send back to the db which includes id, and the xml
	 * representation of the students navigation and work 
	 */ 
	postData = 'dataId=' + workgroupId + '&userName=' + userName + '&data=' + this.vle.getDataXML();

	var currentPostStates = this.vle.state.getVisitedNodesDataXML();
	var dif = currentPostStates.replace(this.lastPostStates, "");
	
	//alert("last: " + this.lastPostStates);
	//alert("current: " + this.vle.state.getVisitedNodesDataXML());
	//alert("dif: " + dif);
	
	this.lastPostStates = this.vle.state.getVisitedNodesDataXML();
	
	var callback = {
		success: function(o) {
			var time = vle.getLastStateTimestamp();
			if(time!=null && time!=0){
				this.lastSavedTimestamp = time;
			};
		},
		
		failure: function(o) {
			if(save){
				alert('failed update to server - server may be unavailable. In the next popup window, copy text and save it in a document somewhere.');
				alert(vle.getDataXML());
			};			
		},
		scope:this
	};
	
	//the async call to send the data back to the db
	YAHOO.util.Connect.asyncRequest('POST', this.postURL, callback, postData);
}

ConnectionManager.prototype.get = function() {
	//TODO: implement if needed
}

ConnectionManager.prototype.statesSaved = function(){
	return(vle.getLastStateTimestamp()==this.lastSavedTimestamp);
};