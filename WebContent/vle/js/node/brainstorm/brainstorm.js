
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
	}
};

BRAINSTORM.prototype.render = function(){
	var parent = document.getElementById('contentDiv');
	var frame = document.getElementById('brainstormFrame');
	
	//set new src for frame
	if(this.serverless){
		frame.src = 'brainlite.html';
	} else {
		frame.src = 'brainfull.html';
	};
};

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
		frameDoc.getElementById('studentResponse').value = this.states[this.states.length - 1].response;
		this.showCannedResponses(frameDoc);
	};
	
	if(this.isGated=='false' || this.isGated==false){
		this.showCannedResponses(frameDoc);
	};
};

/**
 * Handles brainstorm when it has a server backend
 * @param frameDoc the dom object for the brainstorm html interface
 */
BRAINSTORM.prototype.brainfullLoaded = function(frameDoc) {
	var parent = frameDoc.getElementById('main');
	var nextNode = frameDoc.getElementById('studentResponseDiv');
	var old = frameDoc.getElementById('questionPrompt');
	
	if(old){
		parent.removeChild(old);
	};
	
	var newQuestion = createElement(frameDoc, 'div', {id: 'questionPrompt'});
	newQuestion.innerHTML = this.prompt;
	
	parent.insertBefore(newQuestion, nextNode);
	
	var classmateResponsesShown = false;
	
	if (this.states!=null && this.states.length > 0) {
		frameDoc.getElementById('studentResponse').value = this.states[this.states.length - 1].response;
		this.showClassmateResponses(frameDoc);
		classmateResponsesShown = true;
	};
	
	if(!classmateResponsesShown && (this.isGated=='false' || this.isGated==false)) {
		this.showClassmateResponses(frameDoc);
	};
}

/**
 * Displays the responses class mates have posted
 * @param frameDoc the dom object for the brainstorm html interface
 */
BRAINSTORM.prototype.showClassmateResponses = function(frameDoc){
	//this.vle.runId = 66;
	//alert("runId: " + this.vle.runId + "\nnodeId: " + this.nodeId);
	
	//make the request to get posts made by class mates and then display those posts
	this.vle.connectionManager.request('GET', 2, this.vle.getDataUrl, {runId: this.vle.runId, nodeId: this.nodeId}, getClassmateResponsesCallback, {frameDoc: frameDoc});
}

/**
 * The callback function for displaying class mate posts
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
				var localReponseId = "response" + x + "_" + y;
				
				//create the response and response title elements
				var response = createElement(frameDoc, 'textarea', {rows: '7', cols:  '80', disabled: true, id: localReponseId});
				var responseTitle = createElement(frameDoc, 'div', {id: 'responseTitle_' + localReponseId});
				
				//set the html for the response title
				responseTitle.innerHTML = 'Posted By: &nbsp;' + userId;
				responseTitle.appendChild(createElement(frameDoc, 'br'));
				responseTitle.appendChild(response);
				
				//set the student text in the response textarea
				response.value = postText;

				//add the whole response element into the parent container
				responsesParent.appendChild(responseTitle);
				responsesParent.appendChild(createElement(frameDoc, 'br'));
			}
		}
	}
}

BRAINSTORM.prototype.showCannedResponses = function(frameDoc){
	var responsesParent = frameDoc.getElementById('responses');
	
	
	for(var p=0;p<this.cannedResponses.length;p++){
		var response = createElement(frameDoc, 'textarea', {rows: '7', cols:  '80', disabled: true, id: this.cannedResponses[p].getAttribute('name')});
		var responseTitle = createElement(frameDoc, 'div', {id: 'responseTitle_' + this.cannedResponses[p].getAttribute('name')});
		responseTitle.innerHTML = 'Posted By: &nbsp;' + this.cannedResponses[p].getAttribute('name');
		responseTitle.appendChild(createElement(frameDoc, 'br'));
		responseTitle.appendChild(response);
		response.value = this.cannedResponses[p].firstChild.nodeValue;
		
		responsesParent.appendChild(responseTitle);
		responsesParent.appendChild(createElement(frameDoc, 'br'));
	};
};

BRAINSTORM.prototype.save = function(frameDoc){
	var response = frameDoc.getElementById('studentResponse').value;
	if(response && response!=""){
		var currentState = new BRAINSTORMSTATE(response);
		this.states.push(currentState);
		if(this.vle){
			this.vle.state.getCurrentNodeVisit().nodeStates.push(currentState);
		};
		frameDoc.getElementById('saveMsg').innerHTML = "<font color='8B0000'>save successful</font>";
		this.showCannedResponses(frameDoc);
	} else {
		frameDoc.getElementById('saveMsg').innerHTML = "<font color='8B0000'>nothing to save</font>";
	};
};

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