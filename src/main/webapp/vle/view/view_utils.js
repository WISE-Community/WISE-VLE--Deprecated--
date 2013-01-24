/**
 * The util object for this view
 * 
 * @author patrick lawler
 */
View.prototype.utils = {};

View.prototype.utilDispatcher = function(type, args, obj) {
	if (type == 'loadConfigComplete') {
		obj.initializeSession();
	} else if (type == 'maintainConnection') {
		obj.sessionManager.maintainConnection();
	} else if (type == 'renewSession') {
		// make a request to renew the session
		var renewSessionUrl = obj.config.getConfigParam('indexUrl');
		if (renewSessionUrl == null || renewSessionUrl == 'undefined') {
			renewSessionUrl = "/webapp/index.html";
		}
		obj.connectionManager.request('GET', 2, renewSessionUrl, {}, null, obj);
	} else if (type == 'checkSession') {
		// check if session has been expired
		obj.sessionManager.checkSession();
	} else if(type == 'forceLogout') {
		obj.forceLogout();
	};
};

/**
 * Update the max score for the given nodeId. Create a MaxScores
 * object if one does not exist.
 * @param nodeIds the ids of the nodes in the project
 * @param maxScoreValue the new max score value
 */
View.prototype.getMaxScoresSum = function(nodeIds) {
	//check if maxScores has been set
	if(this.maxScores == null) {
		//it has not been set so we will make a new MaxScores object
		return 0;
	} else {
		return this.maxScores.getMaxScoresSum(nodeIds);
	}
};

/**
 * Get the project meta data such as max score values
 */
View.prototype.getProjectMetaData = function() {
	//get the url to retrieve the project meta data
	var projectMetaDataUrl = this.getConfig().getConfigParam('projectMetaDataUrl');
	
	if(projectMetaDataUrl && projectMetaDataUrl != ""){
		var projectMetaDataCallbackSuccess = function(text, xml, args) {
			var thisView = args[0];
			
			if(text != null && text != "") {
				//thisView.processMaxScoresJSON(text);
				thisView.projectMetadata = thisView.$.parseJSON(text);
				
				var maxScores = thisView.projectMetadata.maxScores;
				if(maxScores == null || maxScores == "") {
					maxScores = "[]";
				}
				thisView.processMaxScoresJSON(maxScores);
			}
	
			thisView.projectMetaDataRetrieved = true;
			eventManager.fire("getProjectMetaDataComplete");
		};
		
		var projectMetaDataCallbackFailure = function(text, args) {
			var thisView = args[0];
			thisView.projectMetaDataRetrieved = true;
			eventManager.fire("getProjectMetaDataComplete");
		};
		
		var projectMetaDataUrlParams = {
				command:"getProjectMetaData",
				projectId:this.getConfig().getConfigParam("projectId")
		};
		this.connectionManager.request('GET', 1, projectMetaDataUrl, projectMetaDataUrlParams, projectMetaDataCallbackSuccess, [this], projectMetaDataCallbackFailure);
	};
};

/**
 * Get the run extras such as the max scores
 * @return
 */
View.prototype.getRunExtras = function() {
	//get the url to retrieve the run extras
	var getRunExtrasUrl = this.getConfig().getConfigParam('getRunExtrasUrl');
	
	var runExtrasCallbackSuccess = function(text, xml, args) {
		var thisView = args[0];
		
		if(text != null && text != "") {
			thisView.processMaxScoresJSON(text);
		}

		thisView.runExtrasRetrieved = true;
		eventManager.fire("getRunExtrasComplete");
	};
	
	var runExtrasCallbackFailure = function(text, args) {
		var thisView = args[0];
		thisView.runExtrasRetrieved = true;
		eventManager.fire("getRunExtrasComplete");
	};
	
	this.connectionManager.request('GET', 1, getRunExtrasUrl, null, runExtrasCallbackSuccess, [this], runExtrasCallbackFailure);
};



/**
 * Parses and sets or merges the new max scores
 * @param maxScoresJSON
 */
View.prototype.processMaxScoresJSON = function(maxScoresJSON) {
	//parse the max scores JSON
	var newMaxScores = MaxScores.prototype.parseMaxScoresJSONString(maxScoresJSON);
	
	//see if the max scores has already been set
	if(this.maxScores == null) {
		//it has not been set so we will set it
		this.maxScores = newMaxScores;
	} else {
		//it has been set so we will merge the new max scores
		this.maxScores.mergeMaxScores(newMaxScores);
	}
};


/**
 * Returns whether the content string contains an applet by searching for
 * an open and close applet tag in the content string.
 */
View.prototype.utils.containsApplet = function(content){
	/* check for open and close applet tags */
	var str = content.getContentString();
	if(str.indexOf("<applet") != -1 && str.indexOf("</applet>") != -1) {
		return true;
	} else {
		return false;
	};
};

/**
 * Given a string of a number of bytes, returns a string of the size
 * in either: bytes, kilobytes or megabytes depending on the size.
 */
View.prototype.utils.appropriateSizeText = function(bytes){
	if(bytes>1048576){
		return this.roundToDecimal(((bytes/1024)/1024), 1) + ' MB';
	} else /*if(bytes>1024)*/{
		return this.roundToDecimal((bytes/1024), 0) + ' KB';
	//} else {
		//return bytes + ' b';
	};
};


/**
 * Returns the given number @param num to the nearest
 * given decimal place @param decimal. (e.g if called 
 * roundToDecimal(4.556, 1) it will return 4.6.
 */
View.prototype.utils.roundToDecimal = function(num, decimal){
	var rounder = 1;
	if(decimal){
		rounder = Math.pow(10, decimal);
	};

	return Math.round(num*rounder)/rounder;
};

/**
 * Inserts the applet param into the the given content
 * @param content the content in which to insert the param
 * @param name the name of the param
 * @param value the value of the param
 */
View.prototype.utils.insertAppletParam = function(content, name, value){
	/* get the content string */
	var str = content.getContentString();
	
	/* create the param string */
	var paramTag = '<param name="' + name + '" value="' + value + '">';
	
	/* check if the param already exists in the content */
	if(str.indexOf(paramTag) == -1) {
		/* add the param right before the closing applet tag */
		content.setContent(str.replace("</applet>", paramTag + "\n</applet>"));
	};
};


/**
 * Extracts the file servlet information from the given url and returns the result.
 */
View.prototype.utils.getContentPath = function(baseUrl, url){
	return url.substring(url.indexOf(baseUrl) + baseUrl.length, url.length);
};

/**
 * Returns the value of the currently selected option in a select element
 * with the given id.
 */
View.prototype.utils.getSelectedValueById = function(id){
	var select = document.getElementById(id);
	if(select){
		var opt = select.options[select.selectedIndex];
		if(opt){
			return opt.value;
		};
	};
	
	return '';
};

/**
 * Attempts to set the correct selected option in a select element
 * with the given id that has the given value.
 */
View.prototype.utils.setSelectedValueById = function(id, value){
	var select = document.getElementById(id);
	if(select && value){
		for(var a=0;a<select.options.length;a++){
			if(select.options[a].value == value){
				select.selectedIndex = a;
			};
		};
	};
};

/**
 * If the given string is undefined, null or false, returns an empty
 * string, otherwise, returns the given string.
 */
View.prototype.utils.resolveNullToEmptyString = function(str){
	if(str == null || str == 'null'){
		return '';
	};
	
	return str;
};

/**
 * Get all elements with the given class name
 * @param node
 * @param searchClass
 * @param tag
 * @return
 */
View.prototype.getElementsByClassName = function(node,searchClass,tag) {  
	var classElements = new Array();  
	if ( node == null )  
		node = document;  
	if ( tag == null )  
		tag = '*';  
	var els = node.getElementsByTagName(tag); // use "*" for all elements  
	var elsLen = els.length;  
	var pattern = new RegExp("\\b"+searchClass+"\\b");  
	for (i = 0, j = 0; i < elsLen; i++) {  
		if ( pattern.test(els[i].className) ) {  
			classElements[j] = els[i];  
			j++;  
		}  
	}  
	return classElements;  
};


/**
 * Get the latest node state for the given node
 * @param nodeId
 * @return a node state
 */
View.prototype.getLatestStateForNode = function(nodeId) {
	var nodeState = null;
	
	if(this.state != null) {
		for (var i=this.state.visitedNodes.length - 1; i>=0 ; i--) {
			var nodeVisit = this.state.visitedNodes[i];
			if (nodeVisit.getNodeId() == nodeId) {
				for (var j=nodeVisit.nodeStates.length - 1; j>=0; j--) {
					nodeState = nodeVisit.nodeStates[j];
					return nodeState;
				}
			}
		}	
	}
	
	return nodeState;
};

/**
 * Checks if the latest node state for the given node is locked
 * @param nodeId
 * @return whether the latest node state for the given node is locked
 */
View.prototype.isLatestNodeStateLocked = function(nodeId) {
	//get the latest node state for the given node
	var nodeState = this.getLatestStateForNode(nodeId);

	if(nodeState != null && nodeState.locked != null) {
		//return the locked value
		return nodeState.locked;
	} else {
		return false;
	}
};

/**
 * Returns the state for the current step
 * If the current step is not {HTML step || MySystem step || Draw step || MW step}, do nothing.
 */
View.prototype.getLatestStateForCurrentNode = function() {
	var currentNode = this.getCurrentNode();
	if (currentNode.type != "HtmlNode" 
			&& currentNode.type != "MySystemNode" 
			&& currentNode.type != "SVGDrawNode"
			&& currentNode.type != "MWNode") {
		return;
	} 
	var stringSoFar = "";   // build the data
	
	if(this.state != null) {
		var allNodeVisitsForCurrentNode = this.state.getNodeVisitsByNodeId(currentNode.id);
		for (var i=0; i<allNodeVisitsForCurrentNode.length; i++) {
			var nodeStates = allNodeVisitsForCurrentNode[i].nodeStates;
			if (nodeStates != null) {
				for (var j=0; j < nodeStates.length; j++) {
					if (nodeStates[j].data != "") {
						stringSoFar = nodeStates[j].data;
					}
				}
			}
		}
	}

	return stringSoFar;
};

/**
 * Save the max score the teacher has specified
 * @param runId
 * @param nodeId
 */
View.prototype.saveMaxScore = function(runId, nodeId) {
	/*
	 * updates the local copy of the max scores after the server
	 * has successfully updated it on the server
	 */
	var postMaxScoreCallback = function(text, xml, args) {
		var thisView = args[0];
		var maxScoreObj = null;
		
		try {
			//parse the json that is returned
			maxScoreObj = $.parseJSON(text);
		} catch(error) {
			//do nothing
		}
		
		if(maxScoreObj == null) {
			if(text == 'ERROR:LoginRequired') {
				//the user is not logged in because their session has timed out
				alert("Your latest grade has not been saved.\n\nYou have been inactive for too long and have been logged out. Please sign in to continue.");
				
				//redirect the user to the login page
				window.top.location = "/webapp/j_spring_security_logout";
			} else {
				//there was a server error
				
				var nodeId = args[1];

				//revert the max score value to its previous value
				thisView.revertMaxScore(nodeId);
			}
		} else {
			//get the node id the max score is for
			var nodeId = maxScoreObj.nodeId;
			
			//get the value for the max score
			var maxScoreValue = maxScoreObj.maxScoreValue;
			
			//update the max score in the maxScores object
			thisView.updateMaxScore(nodeId, maxScoreValue);
		}
	};
	
	var postMaxScoreCallbackFail = function(text, args) {
		var thisView = args[0];
		var nodeId = args[1];
		
		//revert the max score value to its previous value
		thisView.revertMaxScore(nodeId);
	};
	
	//get the new max score the teacher has entered for this nodeId
	var maxScoreValue = document.getElementById("maxScore_" + nodeId).value;
	
	//parse the value from the text box to see if it is a valid integer
	var maxScoreValueInt = parseInt(maxScoreValue);
	
	//check that the value entered is a number greater than or equal to 0
	if(isNaN(maxScoreValueInt) || maxScoreValueInt < 0) {
		//the value is invalid so we will notify the teacher
		alert("Error: invalid Max Score value, please enter a value 0 or greater");
		
		//set the value back to the previous value
		document.getElementById("maxScore_" + nodeId).value = this.getMaxScoreValueByNodeId(nodeId);
		
		return;
	}
	
	//create the args used to update the max score on the server
	var postMaxScoreParams = {command: "postMaxScore", projectId: this.getProjectId(), nodeId: nodeId, maxScoreValue: maxScoreValue};
	
	//send the new max score data back to the server
	this.connectionManager.request('POST', 1, this.getConfig().getConfigParam('projectMetaDataUrl'), postMaxScoreParams, postMaxScoreCallback, [this, nodeId], postMaxScoreCallbackFail);
};

/**
 * Revert the max score value for a specific step
 * @param nodeId the id of the node that we are reverting the max score value for
 */
View.prototype.revertMaxScore = function(nodeId) {
	//display a message telling the teacher the max score value will be reverted back
	alert("Failed to save max score, the max score will be reverted back to its previous value.");
	
	//set the value back to the previous value
	document.getElementById("maxScore_" + nodeId).value = this.getMaxScoreValueByNodeId(nodeId);
};

/**
 * Get the max score for the specified step/nodeId
 * If there are no max scores or there is no max score
 * for the step/nodeId we will just return ""
 * @param nodeId the step/nodeId
 * @return the max score for the step/nodeId or ""
 */
View.prototype.getMaxScoreValueByNodeId = function(nodeId) {
	var maxScore = "0";
	
	//check if the max scores object has been set
	if(this.maxScores != null) {
		//get the max score for this step
		maxScore = this.maxScores.getMaxScoreValueByNodeId(nodeId) + "";	
	}
	
	return maxScore;
};

View.prototype.updateMaxScore = function(nodeId, maxScoreValue) {
	//check if maxScores has been set
	if(this.maxScores == null) {
		//it has not been set so we will make a new MaxScores object
		this.maxScores = new MaxScores();
	}
	
	//update the score for the given nodeId
	this.maxScores.updateMaxScore(nodeId, maxScoreValue);
};

View.prototype.getProjectId = function() {
	var projectId = "";
	
	if(this.portalProjectId != null) {
		//for when we are in authoring tool
		projectId = this.portalProjectId;
	} else {
		//for when we are in grading or student vle mode
		projectId = this.getConfig().getConfigParam("projectId");
	}
	
	if(projectId != null && projectId != "") {
		//parse the project to an int
		projectId = parseInt(projectId);
	}
	
	return projectId;
};

/**
 * Replaces each \n with a <div>
 * @param studentWork the student work, this may be a string or
 * an array with one element that is a string
 * @return a string with \n replaced with <div>
 * TODO: filter out extraneous tags and stylings
 */
View.prototype.replaceSlashNWithDiv = function(studentWork) {
	
	if(studentWork == null) {
		//do nothing
	} else if (studentWork.constructor.toString().indexOf("Array") == -1) {
		//studentWork is not an array
		//studentWork = studentWork.replace(/\n/g, "<br>");
		studentWork = studentWork.replace(/\n/g, "</div><div>");
		studentWork = '<div>' + studentWork;
		studentWork = studentWork.replace(/<div>$/,'');
	} else {
		//studentWork is an array
		//studentWork = studentWork[0].replace(/\n/g, "<br>");
		studentWork = studentWork[0].replace(/\n/g, "</div><div>");
		studentWork = '<div>' + studentWork;
		studentWork = studentWork.replace(/<div>$/,'');
	}
	
	return studentWork;
};

/**
 * Replaces the \n with a <br>
 * @param studentWork the student work, this may be a string or
 * an array with one element that is a string
 * @return a string with \n replaced with <br>
 */
View.prototype.replaceSlashNWithBR = function(studentWork) {
	
	if(studentWork == null) {
		//do nothing
	} else if (studentWork.constructor.toString().indexOf("Array") == -1) {
		//studentWork is not an array
		studentWork = studentWork.replace(/\n/g, "<br>");
	} else {
		//studentWork is an array
		studentWork = studentWork[0].replace(/\n/g, "<br>");
	}
	
	return studentWork;
};

/**
 * Logs the user out of the vle. We use this when their session has timed
 * out so that they don't continue working since their work won't save
 * after their session has timed out.
 */
View.prototype.forceLogout = function() {
	alert("You have been inactive for too long and have been logged out. Please log back in to continue.");
	parent.window.location = "/webapp/j_spring_security_logout";
};

/**
 * Get the idea basket for the given workgroup id
 * @param workgroupId the id of the workgroup we want the idea basket from
 * @return the idea basket from the given workgroup or null if not found
 */
View.prototype.getIdeaBasketByWorkgroupId = function(workgroupId) {
	var ideaBasket = null;
	
	if(this.getUserAndClassInfo().getWorkgroupId() == workgroupId) {
		//the user wants their own basket
		ideaBasket = this.ideaBasket;
	} else {
		//check if we have retrieved the idea baskets
		if(this.ideaBaskets != null) {
		
			//loop through all the idea baskets
			for(var x=0; x<this.ideaBaskets.length; x++) {
				var tempIdeaBasket = this.ideaBaskets[x];
				
				//compare the workgroup id of the idea basket
				if(tempIdeaBasket.workgroupId == workgroupId) {
					//we have found a match so we will break out of the for loop
					ideaBasket = tempIdeaBasket;
					break;
				}
			}
		}
	}
	
	return ideaBasket;
};

/**
 * Determines whether a nodeType knows how to render its grading view
 * @param nodeType the type of the node
 * @return whether this node type implements renderGradingView()
 */
/*
View.prototype.isSelfRenderingGradingViewNodeType = function(nodeType) {
	var isSelfRenderingGradingView = false;
	
	if(nodeType != 'HtmlNode' && 
			nodeType != 'BrainstormNode' && 
			nodeType != 'FillinNode' && 
			nodeType != 'NoteNode' && 
			nodeType != 'JournalEntryNode' && 
			nodeType != 'OutsideUrlNode' && 
			nodeType != 'OpenResponseNode' && 
			nodeType != 'BlueJNode' && 
			nodeType != 'DrawNode' && 
			nodeType != 'DataGraphNode' && 
			nodeType != 'MySystemNode' && 
			nodeType != 'SVGDrawNode' && 
			nodeType != 'MWNode' &&  
			nodeType != 'BranchNode') {
		isSelfRenderingGradingView = true;
	}
	
	return isSelfRenderingGradingView;
};
*/

/**
 * Get the max possible score for the project
 * @return the max possible score for the project
 */
View.prototype.getMaxScoreForProject = function() {
	var maxScoreForProject = 0;
	
	//get all the node ids in the project
	var nodeIdsInProject = this.getProject().getNodeIds();
	
	if(this.maxScores != null) {
		//get the max scores sum for all the node ids 
		maxScoreForProject = this.maxScores.getMaxScoresSum(nodeIdsInProject);
	}
	
	return maxScoreForProject;
};

/**
 * Given a filename, returns the extension of that filename
 * if it exists, null otherwise.
 */
View.prototype.utils.getExtension = function(text){
	var ndx = text.lastIndexOf('.');
	if(-1 < ndx){
		return text.substring(ndx + 1, text.length);
	};

	return null;
};

/**
 * Callback function for when the dynamically created frame for uploading assets has recieved
 * a response from the request. Notifies the response and removes the frame.
 */
View.prototype.assetUploaded = function(target,view){
	var htmlFrame = target;
	var frame = window.frames[target.id];
	
	if(frame.document && frame.document.body && frame.document.body.innerHTML != ''){
		var message = "";
		
		if(frame.document.body.innerHTML != null && frame.document.body.innerHTML.indexOf("server has encountered an error") != -1) {
			//the server returned a generic error page
			message = "Error: an error occurred while trying to upload your file, please make sure you do not try to upload files larger than 10 mb";
		} else {
			//there was no error so we will display the message that we received
			message = frame.document.body.innerHTML;
		}
		
		//display the message in the upload manager
		notificationManager.notify(message, 3, 'uploadMessage', 'notificationDiv');
		
		/* set source to blank in case of page reload */
		htmlFrame.src = 'about:blank';
		
		/* cancel fired to clean up and hide the dialog */
		//eventManager.fire('assetUploadCancel');
		
		// refresh edit asset dialog
		if (target.getAttribute('type')=="student") {
			eventManager.fire('viewStudentAssets',view.assetEditorParams);			
		} else {
			eventManager.fire('viewAssets',view.assetEditorParams);
		}
		$('#assetProcessing').hide();
		
		/* change cursor back to default */
		document.body.style.cursor = 'default';
		
		document.getElementById('uploadAssetFile').setAttribute("name", 'uploadAssetFile');
	} else {
		document.body.removeChild(htmlFrame);
	}
};

/**
 * Initializes Session for currently logged in user.
 */
View.prototype.initializeSession = function(){
	this.sessionManager = new SessionManager(eventManager, this);
};

/**
 * Returns true if the given name is an allowed file type
 * to upload as asset, false otherwise.
 */
View.prototype.utils.fileFilter = function(extensions,name){
	return extensions.indexOf(this.getExtension(name).toLowerCase()) != -1;
};

/**
 * Initialize XMPP service
 * @return
 */
View.prototype.startXMPP = function() {
	this.xmpp = WISE.init(this);
};


View.prototype.checkXMPPEnabled = function() {
	
	this.isXMPPEnabled = false;
	if (this.config.getConfigParam("isXMPPEnabled") != null && this.config.getConfigParam("isXMPPEnabled")) {
		var runInfo = this.config.getConfigParam("runInfo");
		
		if(runInfo != null && runInfo != "") {
			var runInfoJSON = JSON.parse(runInfo);
			
			if(runInfoJSON != null) {
				if(runInfoJSON.isXMPPEnabled != null) {
					this.isXMPPEnabled = runInfoJSON.isXMPPEnabled;
				}
			}
		}
	}
};

/**
 * Function used by Array.sort() to sort an array of strings
 * alphabetically
 * @param a
 * @param b
 * @return -1 if a comes before b
 * 1 if a comes after b
 * 0 if a and b are equal
 */
View.prototype.sortAlphabetically = function(a, b) {
	var aLowerCase = a.toLowerCase();
	var bLowerCase = b.toLowerCase();
	
	if(aLowerCase < bLowerCase) {
		return -1;
	} else if(aLowerCase > bLowerCase) {
		return 1;
	} else {
		return 0;
	}
};


/**
 * Prepends contentBaseUrl string to each occurrence of 
 * "./assets"
 * "/assets"
 * "assets"
 * './assets'
 * '/assets'
 * 'assets'
 * in the string passed in.
 * They must occur as the first character of a word., i.e., "./assets" must be preceded by a space.
 */
View.prototype.utils.prependContentBaseUrlToAssets = function(contentBaseUrl, stringIn) {
	stringIn = stringIn.replace(new RegExp('\"./assets', 'g'), '\"'+contentBaseUrl + 'assets');
	stringIn = stringIn.replace(new RegExp('\"/assets', 'g'), '\"'+contentBaseUrl + 'assets');
	stringIn = stringIn.replace(new RegExp('\"assets', 'g'), '\"'+contentBaseUrl + 'assets');
	stringIn = stringIn.replace(new RegExp('\'./assets', 'g'), '\"'+contentBaseUrl + 'assets');
	stringIn = stringIn.replace(new RegExp('\'/assets', 'g'), '\"'+contentBaseUrl + 'assets');
	stringIn = stringIn.replace(new RegExp('\'assets', 'g'), '\"'+contentBaseUrl + 'assets');	
	
	return stringIn;
};

/**
 * Escape the DOM id so that it can be used in a jquery id selector.
 * e.g.
 * node_1.or will be converted to node_1\.or
 * If we do not do this, the jquery selector will treat the . as a
 * class selector and will not find the element.
 * @param id the DOM id
 * @returns the id with . escaped
 */
View.prototype.escapeIdForJquery = function(id) {
	//replace all . with \.
	id = id.replace(/\./g, '\\.');
	
	return id;
};

/**
 * Make a CRater verify request for the given item id
 * @param itemId the item id to verify
 */
View.prototype.makeCRaterVerifyRequest = function(itemId) {
	//get the url to our servlet that will make the request to the CRater server for us
	var cRaterRequestUrl = this.config.getConfigParam('cRaterRequestUrl');
	
	var requestArgs = {
		cRaterRequestType:'verify',
		itemId:itemId
	};
	
	var responseText = this.connectionManager.request('GET', 1, cRaterRequestUrl, requestArgs, this.makeCRaterVerifyRequestCallback, {vle:this}, this.makeCRaterVerifyRequestCallbackFail, true);
};

/**
 * The success callback function when making a CRater verify request
 * @param responseText
 * @param responseXML
 * @param args
 * @returns
 */
View.prototype.makeCRaterVerifyRequestCallback = function(responseText, responseXML, args) {
	var vle = args.vle;
	
	//remember the response text in a variable in the vle so we can access it later
	vle.cRaterResponseText = responseText;
};

/**
 * The fail callback function when making a CRater verify request
 * @param responseText
 * @param args
 */
View.prototype.makeCRaterVerifyRequestCallbackFail = function(responseText, args) {
	alert('Error: CRater verify request failed');
};

/**
 * Check the xml response text to see if the item id is valid
 * @param responseText the xml response text
 * @returns whether the crater item is valid or not
 */
View.prototype.checkCRaterVerifyResponse = function(responseText) {
	var isValid = false;
	
	/*
	 * find the text that contains the avail field
	 * e.g. 
	 * <item id="Photo_Sun" avail="Y">
	 */
	var availMatch = responseText.match(/avail="(\w*)"/);
	
	
	if(availMatch != null && availMatch.length > 1) {
		/*
		 * check the match
		 * e.g.
		 * availMatch[0] = avail="Y"
		 * availMatch[1] = Y
		 */
		var availValue = availMatch[1];
		
		if(availValue != null && availValue == 'Y') {
			//item id is valid
			isValid = true;
		}
	}
	
	return isValid;
};


/**
 * Get the scoring rules from the crater item verification response xml
 * @param xml the string with the xml response text from the verify request 
 */
View.prototype.getCRaterScoringRulesFromXML = function(xml) {
	var cRaterScoringRules = [];
	var zeroScoreScoringRule = false;
	
	/*
	 * find all the scoring rule values
	 * e.g.
	 * <scoring_rules>
	 * <scoring_rule concepts="1-4" nummatches="4" rank="1" score="4"/>
	 * <scoring_rule concepts="1" nummatches="1" rank="2" score="3"/>
	 * <scoring_rule concepts="2-4" nummatches="3" rank="3" score="3"/>
	 * <scoring_rule concepts="2-4" nummatches="1" rank="4" score="2"/>
	 * <scoring_rule concepts="5" nummatches="1" rank="5" score="1"/>
	 * </scoring_rules>
	 */
	var scoringRules = xml.match(/scoring_rule.*"/g);
	
	if(scoringRules != null) {
		//loop through all the scoring rules
		for(var x=0; x<scoringRules.length; x++) {
			
			var currScoreRule = {};
			
			//get a concepts rule e.g. concepts="1-4"
			var scoringRule = scoringRules[x];
						
			//create a match to extract the concept value
			var conceptsMatch = scoringRule.match(/concepts="(.*?)"/);
			
			if(conceptsMatch != null && conceptsMatch.length > 1) {
				/*
				 * get the concepts
				 * conceptsMatch[0] = concepts="1-4"
				 * conceptsMatch[1] = 1-4
				 */
				var concepts = conceptsMatch[1];
				
				currScoreRule.concepts = concepts;
			}

			// create a match to extract the nummatches value
			var nummatchesMatch = scoringRule.match(/nummatches="(\d*)"/);
			
			if(nummatchesMatch != null && nummatchesMatch.length > 1) {
				/*
				 * get the nummatches
				 * nummatchesMatch[0] = nummatches="1"
				 * nummatchesMatch[1] = 1
				 */
				var nummatches = nummatchesMatch[1];
				
				currScoreRule.numMatches = nummatches;
			}
			
			
			//create a match to extract the rank value
			var rankMatch = scoringRule.match(/rank="(\d*)"/);
			
			if(rankMatch != null && rankMatch.length > 1) {
				/*
				 * get the rank
				 * rankMatch[0] = rank="1"
				 * rankMatch[1] = 1
				 */
				var rank = rankMatch[1];
				
				currScoreRule.rank = rank;
			}

			//create a match to extract the score value
			var scoreMatch = scoringRule.match(/score="(\d*)"/);
			
			if(scoreMatch != null && scoreMatch.length > 1) {
				/*
				 * get the score
				 * scoreMatch[0] = score="1"
				 * scoreMatch[1] = 1
				 */
				var score = scoreMatch[1];
				
				currScoreRule.score = score;
				
				if(score == 0) {
					//we have found a zero score scoring rule
					zeroScoreScoringRule = true;
				}
			}
			
			//set an array as the feedback. put an empty string into the array for the feedback. 
			currScoreRule.feedback = [this.createCRaterFeedbackTextObject()];
			
			cRaterScoringRules.push(currScoreRule);
		}
		
		if(!zeroScoreScoringRule) {
			//we did not find a zero score scoring rule so we will add one
			
			//create the scoring rule
			var zeroScoreRule = {};
			zeroScoreRule.concepts = "";
			zeroScoreRule.numMatches = "";
			zeroScoreRule.rank = "";
			zeroScoreRule.score = "0";
			zeroScoreRule.feedback = [this.createCRaterFeedbackTextObject()];
			
			//add the scoring rule to the array of scoring rules
			cRaterScoringRules.push(zeroScoreRule);
		}
	}
	
	return cRaterScoringRules;
};

/**
 * Create an object that we will put into the feedback array.
 * This object will contain the fields feedbackText and feedbackId.
 * @param feedbackText an optional argument that we will set the
 * feedback text to
 * @returns an object containing the fields feedbackText and feedbackid
 */
View.prototype.createCRaterFeedbackTextObject = function(feedbackText) {
	//generate a random alphanumeric value e.g. 7fEEeHE73R
	var feedbackId = this.utils.generateKey();
	
	if(feedbackText == null) {
		//set the default feedbackText value
		feedbackText = "";
	}
	
	//create the feedback object
	var feedbackObject = {
		feedbackText:feedbackText,
		feedbackId:feedbackId
	};
	
	return feedbackObject;
};

/**
 * Get the max score from the xml
 * @param xml the string with the xml response text from the verify request 
 */
View.prototype.getCRaterMaxScoreFromXML = function(xml) {
	var maxScore = null;
	
	/*
	 * find all the scoring rule values
	 * e.g.
	 * <scoring_rules>
	 * <scoring_rule concepts="1-4" nummatches="4" rank="1" score="4"/>
	 * <scoring_rule concepts="1" nummatches="1" rank="2" score="3"/>
	 * <scoring_rule concepts="2-4" nummatches="3" rank="3" score="3"/>
	 * <scoring_rule concepts="2-4" nummatches="1" rank="4" score="2"/>
	 * <scoring_rule concepts="5" nummatches="1" rank="5" score="1"/>
	 * </scoring_rules>
	 */
	var scoringRules = xml.match(/score="\d*"/g);
	
	if(scoringRules != null) {
		//loop through all the scoring rules
		for(var x=0; x<scoringRules.length; x++) {
			//get a scoring rule e.g. score="4"
			var scoreRule = scoringRules[x];
			
			//create a match to extract the score value
			var scoreMatch = scoreRule.match(/score="(\d*)"/);
			
			if(scoreMatch != null && scoreMatch.length > 1) {
				/*
				 * get the score
				 * scoreMatch[0] = score="4"
				 * scoreMatch[1] = 4
				 */
				var score = parseInt(scoreMatch[1]);
				
				//check if we need to update the max score value
				if(score > maxScore) {
					maxScore = score;
				}
			}
		}		
	}
	
	return maxScore;
};


/**
 * Returns the string of concepts converted into an array
 * @param conceptsString, can be "1,2,3" or "1-4" or "1-4,7" or ""
 * @return array [1,2,3], [1,2,3,4], [1,2,3,4,7], []
 */
View.prototype.convertCRaterConceptsToArray = function(conceptsString) {
	var allConcepts = [];
	if (conceptsString && conceptsString != "") {
		var conceptsArr = conceptsString.split(",");
		for (var i=0; i<conceptsArr.length; i++) {
			var conceptsElement = conceptsArr[i];
			if (conceptsElement.indexOf("-") >= 0) {
				var conceptsElementArr = conceptsElement.split("-");		
				for (var k=conceptsElementArr[0]; k <= conceptsElementArr[1]; k++) {
					allConcepts.push(parseInt(k));							
				}
			} else {
				allConcepts.push(parseInt(conceptsElement));			
			}
		}
	}
	return allConcepts;
};

/**
 * Return true iff the specified studentConcepts exactly matches the specified ruleConcepts
 * @param studentConcepts string of concepts the student got. like "1,2"
 * @param ruleConcepts string of concepts in the rule. looks like "1", "1,2", "1-4"
 */
View.prototype.satisfiesCRaterRulePerfectly = function(studentConcepts, ruleConcepts) {
	var studentConceptsArr = this.convertCRaterConceptsToArray(studentConcepts);
	var ruleConceptsArr = this.convertCRaterConceptsToArray(ruleConcepts);
	return (studentConceptsArr.length == ruleConceptsArr.length && studentConceptsArr.compare(ruleConceptsArr));
};

/**
 * Return true iff the specified studentConcepts matches the specified ruleConcepts numMatches or more times
 * @param studentConcepts string of concepts the student got
 * @param ruleConcepts string of concepts in the rule
 * @param numMatches number of concepts that need to match to be true.
 */
View.prototype.satisfiesCRaterRule = function(studentConcepts, ruleConcepts, numMatches) {
	var studentConceptsArr = this.convertCRaterConceptsToArray(studentConcepts);
	var ruleConceptsArr = this.convertCRaterConceptsToArray(ruleConcepts);
	var countMatchSoFar = 0;  // keep track of matched concepts
	for (var i=0; i < studentConceptsArr.length; i++) {
		var studentConcept = studentConceptsArr[i];
		if (ruleConceptsArr.indexOf(studentConcept) >= 0) {
			countMatchSoFar++;
		}
	}
	return countMatchSoFar >= numMatches;
};

/**
 * Get the feedback for the given concepts
 * @param scoringRules an array of scoring rules
 * @param concepts a string containing the concepts
 * @returns the feedback
 */
View.prototype.getFeedbackFromScoringRules = function(scoringRules, concepts) {
	var feedbackSoFar = "No Feedback";
	var maxScoreSoFar = 0;
	
	if (scoringRules) {
		//loop through all the scoring rules
		for (var i=0; i < scoringRules.length; i++) {
			//get a scoring rule
			var scoringRule = scoringRules[i];
			
			if (this.satisfiesCRaterRulePerfectly(concepts, scoringRule.concepts)) {
				//the concepts perfectly match this scoring rule
				
				//if this scoring rule has more than one feedback, choose one randomly
				feedbackSoFar = this.chooseFeedbackRandomly(scoringRule.feedback);
				
				//no longer need to check other rules if we have a pefect match
				break;
			} else if (scoringRule.score > maxScoreSoFar && this.satisfiesCRaterRule(concepts, scoringRule.concepts, parseInt(scoringRule.numMatches))) {
				/*
				 * the concepts match this scoring rule but we still need to
				 * look at the other scoring rules to make sure there aren't
				 * any better matches that will give the student a better score
				 */
				
				//if this scoring rule has more than one feedback, choose one randomly
				feedbackSoFar = this.chooseFeedbackRandomly(scoringRule.feedback);
				maxScoreSoFar = scoringRule.score;
			}
		}
	}
	
	return feedbackSoFar;
};

/**
 * If the feedback is an array we will choose one of the elements at random.
 * If the feedback is a string we will just return the string.
 * @param feedback a string or an array of strings
 * @return a feedback string
 */
View.prototype.chooseFeedbackRandomly = function(feedback) {
	var chosenFeedback = "";
	
	if(feedback == null) {
		//feedback is null
	} else if(feedback.constructor.toString().indexOf("String") != -1) {
		//feedback is a string
		chosenFeedback = feedback;
	} else if(feedback.constructor.toString().indexOf("Array") != -1) {
		//feedback is an array
		
		if(feedback.length > 0) {
			/*
			 * randomly choose one of the elements in the array
			 * Math.random() returns a value between 0 and 1
			 * Math.random() * feedback.length returns a value between 0 and feedback.length (not inclusive)
			 * Math.floor(Math.random() * feedback.length) returns an integer between 0 and feedback.length (not inclusive)
			 */
			var index = Math.floor(Math.random() * feedback.length);
			chosenFeedback = feedback[index];
		}
	}
	
	return chosenFeedback;
};

/*
 * Returns Annotations by specified annotationType
 * @param annotationType annotation type
 */
View.prototype.getAnnotationsByType = function(annotationType) {
	this.runAnnotations = {};  // looks like {"groups":["A","D","Branch1-A","Branch2-X"] }
	var processGetAnnotationResponse = function(responseText, responseXML, args) {
		var thisView = args[0];
		
		//parse the xml annotations object that contains all the annotations
		thisView.runAnnotations = Annotations.prototype.parseDataJSONString(responseText);
	};

	var annotationsUrlParams = {
				runId: this.getConfig().getConfigParam('runId'),
				toWorkgroup: this.getUserAndClassInfo().getWorkgroupId(),
				fromWorkgroups: this.getUserAndClassInfo().getAllTeacherWorkgroupIds(),
				periodId:this.getUserAndClassInfo().getPeriodId(),
				annotationType:annotationType
			};
	var fHArgs = null;
	var synchronous = true;	
	this.connectionManager.request('GET', 3, this.getConfig().getConfigParam('getAnnotationsUrl'), 
					annotationsUrlParams, processGetAnnotationResponse, [this], fHArgs, synchronous);

	// lookup the annotationKey in the runAnnotations obj. runAnnotationsObj should be set by this point.
	return this.runAnnotations;
};

/*
 * Finds any DOM elements with the 'tooltip' class and initializes the tipTip (modified) plugin on each.
 * 
 * @param target A jQuery DOM object on which to process elements (Optional; default is entire page)
 * @param options An object to specify default tipTip settings for all tooltips (Optional; 
 * see https://github.com/indyone/TipTip for allowable options)
 * 
 * Individual tooltip options can be customized by adding jQuery data fields or HTML5 data-* attributes 
 * to the DOM element 
 * (Optional; will override default settings):
 * - tooltip-event: 'hover', 'click', 'focus', and 'manual' set the tooltip to show on mouse click,
 * mouse hover, element focus, and manual activation [via $('#element').tipTip.('show')] respectively
 * (default is 'hover')
 * - tooltip-anchor: 'bottom', 'top', 'left', and 'right' set the positions of the tooltip to bottom, top, left, 
 * and right respectively (default is 'top')
 * - tooltip-maxw: 'X' sets the max-width of the tooltip element (accepts any valid css 'max-width' value, e.g 
 * '100px', '50%', 'auto'; default is '400px');
 * - tooltip-content: String (or HTML String) to set as the tooltip's content (default is the element's 
 * title attribute)
 * - tooltip-title: String (or inline HTML) to set as the tooltip's title (this will prepend an h3 element
 * to the tooltip content)
 * - tooltip-class: String to add to the tooltip element's css class (default is none)
 * - tooltip-offset: 'X' sets the offset of the tooltip element to X pixels (default is '0')
 * - tooltip-delay: 'X' sets the appearance delay of the tooltip element to X milliseconds (default is '200')
 * - tooltip-keep: String ('true' or 'false') to specify whether the tooltip should stay visible when mouse
 * moves away from the element (and hide when the mouse leaves the tooltip or the user clicks on another
 * part of the page) (default is 'false')
 */
View.prototype.insertTooltips = function(target,options){
	function processElement(item,options){
		item.css('cursor','pointer');
		
		// set tipTip default options
		var settings = {
			defaultPosition:'top',
			maxWidth:'400px',
			edgeOffset:2,
			fadeIn:100,
			fadOut:100,
			delay:100
		};
		if(options != null && typeof options == 'object'){
			// tipTip options have been sent in as a parameter, so merge with defaults
			$.extend(settings,options);
		}
		
		// set options based on target element attributes
		if(item.data('tooltip-event') == 'click' || jQuery.browser.mobile){ // if using a mobile browser, always set activation to 'click' (mobile browsers don't support hover events well)
			settings['activation'] = 'click';
			settings['keepAlive'] = true; // if activation is set to click, always keep tip alive
		} else if(item.data('tooltip-event') == 'hover'){
			settings['activation'] = 'hover';
		} else if(item.data('tooltip-event') == 'manual'){
			settings['activation'] = 'manual';
		}
		if(item.data('tooltip-anchor') == 'right'){
			settings['defaultPosition'] = 'right';
		} else if (item.data('tooltip-anchor') == 'bottom'){
			settings['defaultPosition'] = 'bottom';
		} else if (item.data('tooltip-anchor') == 'left'){
			settings['defaultPosition'] = 'left';
		} else if (item.data('tooltip-anchor') == 'top'){
			settings['defaultPosition'] = 'top';
		}
		if(typeof item.data('tooltip-maxw') == 'string'){
			settings['maxWidth'] = item.data('tooltip-maxw');
		}
		if(typeof item.data('tooltip-content') == 'string'){
			settings['content'] = item.data('tooltip-content');
		}
		if(typeof item.data('tooltip-offset') == 'string'){
			settings['edgeOffset'] = parseInt(item.data('tooltip-offset'));
		}
		if(typeof item.data('tooltip-class') == 'string'){
			settings['cssClass'] = item.data('tooltip-class');
		}
		if(typeof item.data('tooltip-delay') == 'string'){
			var delay = parseInt(item.data('tooltip-delay'));
			if(delay != 'NaN'){
				settings['delay'] = delay;
			}
		}
		if(typeof item.data('tooltip-keep') == 'string'){
			if (item.data('tooltip-keep') == 'true'){
				settings['keepAlive'] = true;
			} else if (item.data('tooltip-keep') == 'false'){
				settings['keepAlive'] = false;
			}
		}
		
		// prevent the title from showing on hover when activation is set to 'click', 'focus', or 'manual'
		if(item.attr('title') && item.attr('title') != '' && !settings.content){
			// if title is set and content is not, set content to title value and remove title
			settings.content = item.attr('title');
			item.removeAttr('title');
		}
		
		if(typeof item.data('tooltip-title') == 'string'){
			settings['content'] = '<h3>' + item.data('tooltip-title') + '</h3>' + settings['content'];
		}
		
		// initialize tipTip on element
		item.tipTip(settings);
		
		// remove all tooltip attributes and class from DOM element (to clean up html and so item are not re-processed if insertTooltips is called again on same page)
		item.removeAttr('data-tooltip-event').removeAttr('data-tooltip-anchor').removeAttr('data-tooltip-maxw').removeAttr('data-tooltip-content').removeAttr('data-tooltip-class').removeAttr('data-tooltip-offset').removeAttr('data-tooltip-keep').removeAttr('data-tooltip-delay').removeClass('tooltip');
	}
	
	// for all DOM elements with the 'tooltip' class, initialize tipTip
	if(target){
		if(target.hasClass('tooltip')){
			processElement(target,options);
		} else {
			$('.tooltip',target).each(function(){
				processElement($(this),options);
			});
		}
	} else {
		$('.tooltip').each(function(){
			processElement($(this),options);
		});
	}
};

/**
 * Get the step position given the step number
 * @param stepNumber a step number which is a string with numbers
 * separated by .'s. step numbers start count at 1. step positions
 * start count at 0 so a step number that is 1.1 would have a step
 * position of 0.0
 * e.g.
 * the step number for the first step in the project is 1.1
 * the step number for activity 3 step 10 would be 3.10
 * @returns the step position
 */
View.prototype.getStepPositionFromStepNumber = function(stepNumber) {
	var stepPosition = '';
	
	//split the step number by the .'s
	var stepSplits = stepNumber.split('.');
	
	//loop through each number that has been split
	for(var x=0; x<stepSplits.length; x++) {
		var stepSplit = stepSplits[x];
		
		//create an int from the number string
		var intStepSplit = parseInt(stepSplit);
		
		if(stepPosition != '') {
			//put a . between each number split
			stepPosition += '.';
		}
		
		/*
		 * decrement the value to convert it from a step number to a step position
		 * then append it to our ongoing step position string
		 */
		stepPosition += (intStepSplit - 1);
	}
	
	return stepPosition;
};

/**
 * Get the step number given the step position
 * @param stepPosition a step position which is a string with numbers
 * separated by .'s. step positions start count at 0. step numbers
 * start count at 1 so a step position that is 0.0 would have a step
 * number of 1.1
 * e.g.
 * the step position for the first step in the project is 0.0
 * the step position for activity 3 step 10 would be 2.9
 * @returns the step number
 */
View.prototype.getStepNumberFromStepPosition = function(stepPosition) {
	var stepNumber = '';
	
	//split the step position by the .'s
	var stepSplits = stepPosition.split('.');
	
	//loop through each number that has been split
	for(var x=0; x<stepSplits.length; x++) {
		var stepSplit = stepSplits[x];
		
		//create an int from the number string
		var intStepSplit = parseInt(stepSplit);
		
		if(stepNumber != '') {
			//put a . between each number split
			stepNumber += '.';
		}
		
		/*
		 * increment the value to convert it from a step position to a step number
		 * then append it to our ongoing step number string
		 */
		stepNumber += (intStepSplit + 1);
	}
	
	return stepNumber;
};

/**
 * If the given item is a non-whitespace only string, return true.
 */
View.prototype.utils.isNonWSString = function(item){
	if(typeof item == 'string' && /\S/.test(item)){
		return true;
	};
	
	return false;
};

/**
 * Capitalizes the first letter of the given string.
 * @returns string The new string
 */
View.prototype.utils.capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Generates and returns a random key of the given length if
 * specified. If length is not specified, returns a key 10
 * characters in length.
 * 
 * @param length Integer
 */
View.prototype.utils.generateKey = function(length){
	this.CHARS = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r", "s","t",
	              "u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
	              "P","Q","R","S","T", "U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];
	
	/* set default length if not specified */
	if(!length){
		length = 10;
	}
	
	/* generate the key */
	var key = '';
	for(var a=0;a<length;a++){
		key += this.CHARS[Math.floor(Math.random() * (this.CHARS.length - 1))];
	};
	
	/* return the generated key */
	return key;
};

/**
 * Given a nodeType, returns the readable node name (as specified in a node's 
 * authoringToolName variable.
 * 
 * @param nodeType String
 */
View.prototype.utils.getAuthoringNodeName = function(nodeType){
	var nodeName = '';
	// get all the node constructors
	var nodeConstructors = NodeFactory.nodeConstructors;
	var constructor = nodeConstructors[nodeType];
	
	// check if there is a constructor
	if(constructor != null) {
		// get the readable name of the node
		nodeName = constructor.authoringToolName;
	}
	return nodeName;
};

/**
 * Given an image url, calculates and returns the height and width of the image in pixels.
 * Modified from: http://stackoverflow.com/questions/106828/javascript-get-image-height/952185#952185
 * @param url String identifying the url of an image file
 * @param callback Function to execute when dimensions have been found
 */
View.prototype.utils.getImageDimensions = function(url,callback){
	var dimensions = {
		"height": 0,
		"width": 0
	};
	
	function findHHandWW() {
		if(this.height){
			dimensions.height = this.height;
		}
		if(this.width){
			dimensions.width = this.width;
		}
		callback(dimensions);
	}
	
	var myImage = new Image();
	myImage.name = url;
	myImage.onload = findHHandWW;
	myImage.src = url;
	
	//return dimensions;
};

/**
 * Given a swf url, calculates and returns the height and width of the swf in pixels.
 * With help from: http://stackoverflow.com/questions/7710799/load-timer-on-swfobject-for-swf-load-time
 * @param url String identifying the url of an swf file
 * @param callback Function to execute when dimensions have been found
 */
View.prototype.utils.getSwfDimensions = function(url,callback){
	// TODO: accomplish by loading swf in a helper swf that loads the file and sends dimensions to browser via ExternalInterface
};

/**
 * If jQuery dialog height is larger than window height, adjusts dialog to fit window (with
 * 20px padding on top and bottom)
 * @param element DOM element of jQuery dialog
 */
View.prototype.utils.adjustDialogHeight = function(element){
	var winH = $(window).height()-40,
		minH = $(element).dialog("option","minHeight");
	
	// if window height is larger than dialog's minHeight option, resize to fit window height
	// otherwise, do not resize because minHeight option should take precedent
	if(winH > minH && $(element).parent().height() > winH){
		$(element).dialog({height: winH});
    	$(element).scrollTop(0);
	    
		if($(element).dialog("option","modal") === true){
			// resize jQuery widget overlay to fit window dimensions
		    $('.ui-widget-overlay').height('100%').width('100%');
		}
	    
	    // re-center dialog 
	    $(element).dialog({position: "center"});
	}
};

/**
 * Given a string, escapes : and . characters and returns the escaped string.
 * @param selector String
 * @returns String
 * 
 * Since jQuery uses CSS syntax for selecting elements, escaping CSS notation characters is necessary 
 * when using jQuery to select elements that contain them.
 * See: http://docs.jquery.com/Frequently_Asked_Questions#How_do_I_select_an_element_by_an_ID_that_has_characters_used_in_CSS_notation.3F
 */
View.prototype.jquerySelectorEscape = function(selector){
	return selector.replace(/(:|\.)/g,'\\$1');
};

/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
(function(a){jQuery.browser.mobile=/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

/**
 * Blocks out the UI and displays a message
 * @param message the message to display 
 */
View.prototype.blockUI = function(message) {
	$.blockUI({ message: message, css: {padding:15}, overlayCSS: {opacity:1.0} });
};

/**
 * Used in Show My Work for draw steps
 * TODO: move
 */
function enlargeDraw(divId){
	var newwindow = window.open("/vlewrapper/vle/node/draw/svg-edit/svg-editor-grading.html");
	newwindow.divId = divId;
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/view_utils.js');
};
