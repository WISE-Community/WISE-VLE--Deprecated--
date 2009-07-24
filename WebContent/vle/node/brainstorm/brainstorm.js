
/**
 * A representation of a Brainstorm which can be either 
 * open_response or single_choice (not implemented) and
 * can run with a server or serverless
 * 
 * @author: patrick lawler
 */
function BRAINSTORM(xmlDoc, nodeId){
	this.serverless = true;
	this.states = [];
	this.vle = null;
	this.loadXMLDoc(xmlDoc);
	this.nodeId = nodeId;
	
	/*
	 * array to store the responses the student has posted for the
	 * current node visit
	 */
	this.recentResponses = new Array();
};

BRAINSTORM.prototype.loadXMLDoc = function(xmlDoc){
	this.xmlDoc = xmlDoc.getElementsByTagName('Brainstorm')[0];	
	this.assessmentItem = this.xmlDoc.getElementsByTagName('assessmentItem')[0];
	this.title = this.xmlDoc.getAttribute('title');
	this.isAnonymousAllowed = this.xmlDoc.getAttribute('isAnonAllowed');
	this.isGated = this.xmlDoc.getAttribute('isGated');
	this.displayNameOption = this.xmlDoc.getAttribute('displayNameOption');
	this.isRichTextEditorAllowed = this.xmlDoc.getAttribute('isRichTextEditorAllowed');
	this.isPollEnded = this.xmlDoc.getAttribute('isPollEnded');
	this.isInstantPollActive = this.xmlDoc.getAttribute('isInstantPollActive');
	if(this.assessmentItem.getElementsByTagName('prompt')[0].firstChild){
		this.prompt = this.assessmentItem.getElementsByTagName('prompt')[0].firstChild.nodeValue;
	} else {
		this.prompt = "";
	};
	this.cannedResponses = xmlDoc.getElementsByTagName('response');
	
	this.questionType = this.assessmentItem.getAttribute('identifier');
	var serverless = this.xmlDoc.getAttribute('serverless');
	if(serverless != null && serverless == 'false') {
		this.serverless = false;
	};
};

/**
 * Renders either the brainlite page, if this.serverless=true or the
 * brainfull page if this.serverless = false.
 */
BRAINSTORM.prototype.render = function(contentPanel){
	window.allReady = function(){
		var renderAfterGet = function(text, xml, args){
			bs = args[0];
			contentPanel = args[1];
			
			if(contentPanel){
				var frame = contentPanel;
			} else {
				var frame = window.frames['brainstormFrame'];
			};
			
			frame.document.open();
			if(window.parent && window.parent.vle){//from vle
				frame.document.write(bs.injectBaseRef(injectVleUrl(text)));
			} else {//from at
				frame.document.write(injectVleUrl(text));
			};
			frame.document.close();
		};
		
		if(bs.serverless){
			var bsLoc = 'node/brainstorm/brainlite.html';
		} else {
			var bsLoc = 'node/brainstorm/brainfull.html';
		};
		
		if(window.parent && window.parent.vle){//called from VLE
			window.parent.vle.connectionManager.request('GET', 1, bsLoc, null,  renderAfterGet, [window.bs, window.contentPanel]);
		} else if(window.parent && window.parent.parent){//called from AT
			window.parent.parent.connectionManager.request('GET', 1, bsLoc, null,  renderAfterGet, [window.bs, window.contentPanel]);
		};
	};
	
	if(contentPanel){
		var frame = contentPanel;
	}else{
		var frame = window.frames['brainstormFrame'];
	};
	
	if(window.parent && window.parent.vle){//called from VLE
		var loc = window.location.toString();
		var vleLoc = loc.substring(0, loc.indexOf('/vle/')) + '/vle/';
		frame.location = vleLoc + 'blank.html';
	} else {//called from AT
		frame.location = '../blank.html';
	};
	window.bs = this;
	window.contentPanel
};

/**
 * Loads the serverless version that this brainstorm represents
 * 
 * @param frameDoc
 * @return
 */
BRAINSTORM.prototype.brainliteLoaded = function(frameDoc){
	var parent = frameDoc.getElementById('main');
	var nextNode = frameDoc.getElementById('studentResponseDiv');
	var old = frameDoc.getElementById('questionPrompt');
	
	if(old){
		parent.removeChild(old);
	};
	
	var newQuestion = createElement(frameDoc, 'div', {id: 'questionPrompt'});
	newQuestion.innerHTML = this.prompt;
	
	parent.insertBefore(newQuestion, nextNode);
	


	if (this.states!=null && this.states.length > 0) {
		/*
		 * if the student has posted a response previously, we will display
		 * the canned responses as well as the responses the student has
		 * posted
		 */
		frameDoc.getElementById('studentResponse').value = this.states[this.states.length - 1].response;
		this.showCannedResponses(frameDoc);
		
		for(var x=0; x<this.states.length; x++) {
			var state = this.states[x];
			this.addStudentResponse(frameDoc, this.states[x].response, this.vle.getWorkgroupId(), "responsestates" + x, this.vle);
		}
	} else if(this.isGated=='false' || this.isGated==false) {
		/*
		 * if the student has not posted before, but this brainstorm
		 * is not gated, we will display the canned responses for
		 * the student to see before they have posted any responses
		 * themselves 
		 */
		this.showCannedResponses(frameDoc);
	}
};

/**
 * Handles brainstorm when it has a server backend
 * @param frameDoc the dom object for the brainstorm html interface
 */
BRAINSTORM.prototype.brainfullLoaded = function(frameDoc) {
	this.recentResponses = new Array();
	var parent = frameDoc.getElementById('main');
	var nextNode = frameDoc.getElementById('studentResponseDiv');
	var old = frameDoc.getElementById('questionPrompt');
	
	if(old){
		parent.removeChild(old);
	};
	
	/*
	 * create the element that will display the question for the student to
	 * respond to
	 */
	var newQuestion = createElement(frameDoc, 'div', {id: 'questionPrompt'});
	newQuestion.innerHTML = this.prompt;
	
	parent.insertBefore(newQuestion, nextNode);
	
	if (this.states!=null && this.states.length > 0) {
		/*
		 * if the student has previously posted a response to this brainstorm
		 * we will display all the canned and classmate responses. we do not
		 * need to display the responses in the states because all previous
		 * responses should have been posted to the server so they should
		 * show up from calling showClassmateResponses()
		 */
		frameDoc.getElementById('studentResponse').value = this.states[this.states.length - 1].response;
		this.showCannedResponses(frameDoc);
		this.showClassmateResponses(frameDoc);
	} else if(this.isGated=='false' || this.isGated==false) {
		/*
		 * if this brainstorm is not gated we will display all the canned
		 * and classmate responses
		 */
		this.showCannedResponses(frameDoc);
		this.showClassmateResponses(frameDoc);
	};
}

/**
 * Displays the responses class mates have posted
 * @param frameDoc the dom object for the brainstorm html interface
 */
BRAINSTORM.prototype.showClassmateResponses = function(frameDoc){
	this.vle.runId = 66;
	//alert("runId: " + this.vle.runId + "\nnodeId: " + this.nodeId);
	
	//make the request to get posts made by class mates and then display those posts
	this.vle.connectionManager.request('GET', 2, this.vle.getDataUrl, {runId: this.vle.runId, nodeId: this.nodeId}, getClassmateResponsesCallback, {frameDoc: frameDoc, recentResponses: this.recentResponses, vle: this.vle});
}

/**
 * The callback function for displaying class mate posts. After it displays
 * all the class mate posts, we will display the student's recent post from
 * the recentResponses array.
 * @param responseText the response text from the async request
 * @param responseXML the response xml from the async request
 * @param handlerArgs the extra arguments used by this function
 */
function getClassmateResponsesCallback(responseText, responseXML, handlerArgs) {
	/*
	 * obtain the frameDoc from the handlerArgs. the frameDoc is the
	 * dom object for the brainstorm html interface
	 */
	var frameDoc = handlerArgs.frameDoc;
	
	/*
	 * retrieve the response(s) the student has posted during this current
	 * node visit
	 */ 
	var recentResponses = handlerArgs.recentResponses;
	
	//the student's vle
	var vle = handlerArgs.vle;
	
	//obtain the dom object that holds all the responses
	var responsesParent = frameDoc.getElementById('responses');
	
	/*
	 * node_visits are wrapped in a workgroup tag, the same workgroup may show
	 * up multiple times in the xml if that workgroup posted multiple times
	 */
	var workgroups = responseXML.getElementsByTagName("workgroup");

	//loop through all the workgroups
	for(var x=0; x<workgroups.length; x++) {
		//obtain the userId (same as workgroupId)
		var userId = workgroups[x].attributes.getNamedItem("userId").nodeValue;
		
		//the data is the node state xml text
		var data = workgroups[x].getElementsByTagName("data")[0];
		if(data != null && data != "") {
			/*
			 * obtain all the responses from the node state data. each node
			 * state can have multiple response tags if the student posted
			 * multiple times in a single node visit
			 */
			var responses = data.getElementsByTagName("response");

			//loop through the responses in this node visit
			for(var y=0; y<responses.length; y++) {
				//obtain the text the student wrote and posted
				var postText = responses[y].firstChild.nodeValue;

				//create a unique dom id for the response
				var localResponseId = "response" + responsesParent.childNodes.length;

				//add the posted response to the user interface
				BRAINSTORM.prototype.addStudentResponse(frameDoc, postText, userId, localResponseId, vle);
			}
		}
	}
	
	BRAINSTORM.prototype.showRecentResponses(frameDoc, recentResponses, responsesParent, vle);
}

/**
 * This displays the responses made by the author/teacher. This
 * is used in server as well as serverless mode.
 * @param frameDoc the dom object that contains all the brainstorm
 * 		elements
 */
BRAINSTORM.prototype.showCannedResponses = function(frameDoc){
	var responsesParent = frameDoc.getElementById('responses');
	
	for(var p=0;p<this.cannedResponses.length;p++){
		var response = createElement(frameDoc, 'div', {rows: '7', cols:  '100', disabled: true, id: this.cannedResponses[p].getAttribute('name')});
		var responseTitle = createElement(frameDoc, 'div', {id: 'responseTitle_' + this.cannedResponses[p].getAttribute('name')});
		responseTitle.innerHTML = 'Posted By: &nbsp;' + this.cannedResponses[p].getAttribute('name');
		responseTitle.appendChild(createElement(frameDoc, 'br'));
		responseTitle.appendChild(response);
		responseTitle.setAttribute('class', 'responseTitle');
		response.innerHTML = this.cannedResponses[p].firstChild.nodeValue;
		response.setAttribute('class', 'responseTextArea');
		
		responsesParent.appendChild(responseTitle);
		responsesParent.appendChild(createElement(frameDoc, 'br'));
	};
	
};

/**
 * Displays the responses made by the student during this node visit.
 * These responses have not been posted back to the server yet which
 * is why we need to keep a local copy of them until they have been
 * posted back to the server. This is only used in server mode.
 * @param frameDoc the dom object that contains all the brainstorm
 * 		elements
 * @param recentResponses an array of responses that the student has
 * 		made during this node visit
 * @param responsesParent the dom object of the parent element for 
 * 		the brainstorm
 * @param vle this student's vle
 */
BRAINSTORM.prototype.showRecentResponses = function(frameDoc, recentResponses, responsesParent, vle) {
	/*
	 * loop through all the response(s) the student has posted during the
	 * current node visit and display them
	 */
	for(var z=0; z< recentResponses.length; z++) {
		/*
		 * display the responses the student has just posted during the
		 * current node visit
		 */
		var recentResponse = recentResponses[z];
		BRAINSTORM.prototype.addStudentResponse(frameDoc, recentResponse, vle.getWorkgroupId(), "response" + responsesParent.childNodes.length, vle);
	}
}

/**
 * When the save button is clicked, this function is called. It will save
 * the student's response in the node state and then display everyone's
 * responses including this current one just saved.
 * @param frameDoc the dom object that contains all the brainstorm elements
 */
BRAINSTORM.prototype.save = function(frameDoc){
	var response = frameDoc.getElementById('studentResponse').value;
	
	//obtain the dom object that holds all the responses
	var responsesParent = frameDoc.getElementById('responses');
	
	/*
	 * clear out all the responses from the last time we loaded
	 * them so we do not have any duplicates. down below, we will 
	 * re-load all of the responses again including any new responses.
	 */
	while(responsesParent.firstChild){
		responsesParent.removeChild(responsesParent.firstChild);
	};
	
	if(response && response!=""){
		var currentState = new BRAINSTORMSTATE(response);
		this.states.push(currentState);
		if(this.vle){
			this.vle.state.getCurrentNodeVisit().nodeStates.push(currentState);
		};
		frameDoc.getElementById('saveMsg').innerHTML = "<font color='8B0000'>save successful</font>";
		
		this.recentResponses.push(response);
		
		//display the canned responses
		this.showCannedResponses(frameDoc);
		
		if(!this.serverless) {
			/*
			 * if we are running with a server back end, display the classmate
			 * responses
			 */
			this.showClassmateResponses(frameDoc, response);
		} else {
			for(var x=0; x<this.states.length; x++) {
				var state = this.states[x];
				this.addStudentResponse(frameDoc, this.states[x].response, this.vle.getWorkgroupId(), "responsestates" + x, this.vle);
			}
		}
	} else {
		frameDoc.getElementById('saveMsg').innerHTML = "<font color='8B0000'>nothing to save</font>";
	};
};

/**
 * Add the response to the brainstorm display. This function is used to display
 * canned responses, classmate responses, and recent responses.
 * @param frameDoc the dom object that contains all the brainstorm display elements
 * @param responseText the text a student has posted in response to the question
 * @param userId the id of the student who made this post
 * @param localResponseId a local dom id for the response element we are going to make
 * @param vle the vle of the student who is logged in
 */
BRAINSTORM.prototype.addStudentResponse = function(frameDoc, responseText, userId, localResponseId, vle) {
	//obtain the dom object that holds all the responses
	var responsesParent = frameDoc.getElementById('responses');
	
	//create the response and response title elements
	var responseTextArea = createElement(frameDoc, 'div', {rows: '7', cols:  '80', disabled: true, id: localResponseId});
	var responseTitle = createElement(frameDoc, 'div', {id: 'responseTitle_' + localResponseId});
	
	//set the html for the response title
	responseTitle.innerHTML = 'Posted By: &nbsp;' + vle.getUserNameByUserId(userId);
	responseTitle.appendChild(createElement(frameDoc, 'br'));
	responseTitle.appendChild(responseTextArea);
	responseTitle.setAttribute('class', 'responseTitle');
	
	//set the student text in the response textarea
	responseTextArea.innerHTML = responseText;
	responseTextArea.setAttribute('class', 'responseTextArea');

	//add the whole response element into the parent container
	responsesParent.appendChild(responseTitle);
	responsesParent.appendChild(createElement(frameDoc, 'br'));
}

BRAINSTORM.prototype.loadState = function(states){
	if(states){
		this.states = states;
	};
};

BRAINSTORM.prototype.loadVLE = function(vle){
	if(vle){
		this.vle = vle;
	};
};

//REMOVE - for testing purposes
BRAINSTORM.prototype.getText = function(){
	var text = '';
	text += 'title: ' + this.title;
	text += '  anonAllowed: ' + this.isAnonymousAllowed;
	text += '  gated: ' + this.isGated;
	text += '  displayNameOption: ' + this.displayNameOption;
	text += '  richText: ' + this.isRichTextEditorAllowed;
	text += '  isPollEnded: ' + this.isPollEnded;
	text += '  isPollActive: ' + this.isInstantPollActive;
	text += '  questionType: ' + this.questionType;
	return text;
};

/**
 * Attempts to retrieve the contentbase url from project and inject
 * it into the content.
 */
BRAINSTORM.prototype.injectBaseRef = function(content){
	if (content.search(/<base/i) > -1) {
		// no injection needed because base is already in the html
		return content;
	} else {		
		var domain = 'http://' + window.location.toString().split("//")[1].split("/")[0];
		
		if(window.parent.vle){
			var baseRefTag = "<base href='" + window.parent.vle.project.contentBaseUrl + "'/>";
		} else if(typeof vle!='undefined'){
			var baseRefTag = "<base href='" + vle.project.contentBaseUrl + "'/>";
		} else {
			return content;
		};
		
		var headPosition = content.indexOf("<head>");
		var newContent = content.substring(0, headPosition + 6);  // all the way up until ...<head>
		newContent += baseRefTag;
		newContent += content.substring(headPosition+6);

		return newContent;
	};	
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/brainstorm/brainstorm.js");