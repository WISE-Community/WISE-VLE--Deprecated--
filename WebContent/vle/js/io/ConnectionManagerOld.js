function ConnectionManager() {
	this.postURL = "../postdata.html";
	this.getURL = "";
	this.id = -2;
	this.lastSavedTimestamp = null;
	
	this.echoURL = "../echo.html";
    this.postURL;
	this.lastPostStates = "";
}

ConnectionManager.prototype.setPostStates = function(vle) {
	this.lastPostStates = vle.state.getCompletelyVisitedNodesDataXML();
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
ConnectionManager.prototype.post = function(workgroupId, vle, save) {
	//this.postURL = "http://localhost:8080/vlewrapper/postdata.html";

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

	//obtain the current post states
	var currentPostStates = vle.state.getCompletelyVisitedNodesDataXML();
	
	//get the diff between the current and the last posted states
	var diff = currentPostStates.replace(this.lastPostStates, "");
        if (diff != null && diff != "") {
		diff = "<vle_state>" + diff + "</vle_state>";

		//update the lastPostStates to be the current
		this.lastPostStates = currentPostStates;

		/*
		 * the data to send back to the db which includes id, and the xml
		 * representation of the students navigation and work 
		 */ 
		//postData = 'dataId=' + workgroupId + '&userName=' + userName + '&data=' + this.vle.getDataXML();
		postData = 'userId=' + workgroupId + '&data=' + diff;

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
}

ConnectionManager.prototype.statesSaved = function(){
	return(vle.getLastStateTimestamp()==this.lastSavedTimestamp);
};

ConnectionManager.prototype.loadVLEState = function(getURL, handler) {

	var callback = {
		success: function(o) {
			handler(o.responseXML);
		},
		failure: function(o) {},
		scope:this
	};
	YAHOO.util.Connect.asyncRequest('GET', getURL, callback, null);
};

/**
 * Given the content URL, loads a project in the VLE
 */
ConnectionManager.prototype.loadProject = function(contentURL, handler, contentBaseUrl){
	var callback =
	{
	  success: function(o) {
		handler(o.responseXML, contentBaseUrl);
	  },
	  failure: function(o) { alert('failure, could not get content');},
	  scope: this
	};
	
	var transaction = YAHOO.util.Connect.asyncRequest('GET', contentURL, callback, null);
};

/**
 * Given a user URL, loads learner data for this vle and project
 */
ConnectionManager.prototype.loadLearnerData = function(userURL, handler){
	var callback = {
				success: function(o) {
					handler(o.responseXML);
			  	},
				failure: function(o) {
					alert('Error: Unable to load user info');
				},
				scope: this
	};
	
	YAHOO.util.Connect.asyncRequest('GET', userURL, callback, null);
};

/**
 * Given a projectName, loads the specified project from the server
 */
ConnectionManager.prototype.loadProjectFromServer = function(handler){
	var callback =
		{
		success: function(o) {
		  var xmlDocToParse = o.responseXML;
		  
		  /***						***|
		   * Extra work needed for IE *|
		   ***						***/
		  if(window.ActiveXObject){
		  	var ieXML = new ActiveXObject("Microsoft.XMLDOM");
		  	ieXML.async = "false";
		  	ieXML.loadXML(o.responseText);
		  	xmlDocToParse = ieXML;
		  };
		  /***						***|
		   * End extra work for IE	  *|
		   ***						***/
		  		   
		  handler(xmlDocToParse);
	  },			
	  failure: function(o) { alert('unable to retrieve project from server'); return false;},
	  scope:this
	}
	
	YAHOO.util.Connect.asyncRequest('POST', 'filemanager.html', callback, 'command=retrieveFile&param1=' + currentProjectPath + '&param2=~project~');
};

ConnectionManager.prototype.retrieveFile = function(handler, node){
	var callback = {
		success:function(o){
			var responseXML = o.responseXML;
							
			/***						***|
			 * Extra work needed for IE *|
			 ***						***/
			 if(window.ActiveXObject){
			 	 var ieXML = new ActiveXObject("Microsoft.XMLDOM");
			 	 ieXML.async = "false";
			 	 ieXML.loadXML(o.responseText);
			 	 responseXML = ieXML;
			 };
			/***						***|
			 * End extra work for IE	  *|
			 ***						***/
			
			if(!responseXML && loadXMLDocFromString){
				var anotherTry = loadXMLDocFromString(o.responseText);
				if(anotherTry){
					responseXML = anotherTry;
				} else {
					alert('possibly mal-formed xml, unable to load from file');
				};
			};
			
			handler(responseXML, o.responseText, node);
		},
		failure:function(o){ alert('unable to retrieve file:' + node.filename); alert(window.location);},
		scope:this
	};
		
    if (node.filename.search(/http:/) > -1 || node.filename.search('/') > -1) {
    	YAHOO.util.Connect.asyncRequest('GET', node.filename, callback, null);
    } else {
        YAHOO.util.Connect.asyncRequest('POST', 'filemanager.html', callback, 'command=retrieveFile&param1=' + currentProjectPath + '&param2=' + node.filename);
    };
};


function Connection(url, cArgs, handler, hArgs, em){
	this.em = em;
};

Connection.prototype.startRequest = function(eventName){
	var en = eventName;
	var callback = {
		success: function(o){
			this.em.fire('end' + en, [o.responseText, o.responseXML]);
		},
		failure: function(o){alert('connection request failed, please check parameters or if server is available');},
		scope:this
	};
	
	YAHOO.util.Connect.asyncRequest(this.type, this.url, callback, this.params);
};

GetConnection.prototype = new Connection();
GetConnection.prototype.constructore = GetConnection;
GetConnection.prototype.parent = Connection.prototype;
function GetConnection(url, cArgs, handler, hArgs, em){
	this.type = 'GET';
	this.em = em;
	this.url = url;
	this.cArgs = cArgs,
	this.handler = handler;
	this.hArgs = hArgs;
	this.params = null;
	this.parseConnectionArgs();
};

GetConnection.prototype.parseConnectionArgs = function(){
	if(this.cArgs && this.cArgs.length>0){
		for(var p in this.cArgs){
			this.url += '&' + p + '=' + this.cArgs[p];
		};
		this.url.replace(/\&/, '?');
	};
};

PostConnection.prototype = new Connection();
PostConnection.prototype.constructor = PostConnection;
PostConnection.prototype.parent = Connection.prototype;
function PostConnection(url, cArgs, handler, hArgs){
	this.type = 'POST';
	this.url = url;
	this.cArgs = cArgs,
	this.handler = handler;
	this.hArgs = hArgs;
	this.params = null;
	this.parseConnectionArgs();
};

PostConnection.prototype.parseConnectionArgs = function(){
	if(this.cArgs && this.cArgs.length>0){
		this.params = '';
		for(var p in this.cArgs){
			this.params += '&' + p + '=' + this.cArgs[p];
		};
		this.params.replace(/\&/, '');
	};
};