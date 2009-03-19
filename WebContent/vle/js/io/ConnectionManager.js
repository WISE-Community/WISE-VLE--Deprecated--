function ConnectionManager(vle) {
	this.postURL = "../postdata.html";
	this.getURL = "";
	this.vle = vle;
	this.id = -2;
	this.lastSavedTimestamp = null;
	
	this.echoURL = "../echo.html";
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
ConnectionManager.prototype.post = function(user, save) {
	var userId = user;
	var save = save;
	var postData;
	
	if (userId == null) {
		userId = this.id;
	}
	
	if(userId < 0) {
		//return;
	}	


	/*
	 * the data to send back to the db which includes id, and the xml
	 * representation of the students navigation and work 
	 */ 
	postData = 'dataId=' + userId + '&data=' + this.vle.getDataXML();

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