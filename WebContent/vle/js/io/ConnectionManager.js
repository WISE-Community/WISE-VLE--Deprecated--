function ConnectionManager(vle) {
	this.postURL = "../postdata.html";
	this.getURL = "";
	this.vle = vle;
	this.id = -2;
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
ConnectionManager.prototype.post = function(user) {
	var userId = user;
	if (userId == null) {
		userId = this.id;
	}
	
	if(userId < 0) {
		//return;
	}	

	var callback = {
		success: function(o) {
			//alert('success');
		},
		
		failure: function(o) {
			//alert('failure: ' + o.statusText + ' ' + o.argument);
		}
	};
	/*
	 * the data to send back to the db which includes id, and the xml
	 * representation of the students navigation and work 
	 */ 
	postData = 'dataId=' + userId + '&data=' + this.vle.getDataXML();
	//the async call to send the data back to the db
	//YAHOO.util.Connect.asyncRequest('POST', this.postURL, callback, postData);
}

ConnectionManager.prototype.get = function() {
	//TODO: implement if needed
}