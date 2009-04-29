
/**
 * A representation of a Brainstorm which can be either 
 * open_response or single_choice (not implemented) and
 * can run with a server or serverless
 * 
 * @author: patrick lawler
 */
function BRAINSTORM(xmlDoc){
	this.serverless = true;
	this.states = [];
	this.vle = null;
	this.loadXMLDoc(xmlDoc);
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
};

BRAINSTORM.prototype.render = function(){
	var parent = document.getElementById('contentDiv');
	var frame = document.getElementById('brainstormFrame');
	
	//set new src for frame
	if(this.serverless){
		if (this.states!=null && this.states.length > 0) { //already visited, skip to next page
			this.renderResponsePage();
			return;
		} else {
			frame.src = 'brainlite.html';
		};
	} else {
		frame.src = 'brainfull.html';
	};
};

BRAINSTORM.prototype.brainliteLoaded = function(frameDoc){
	var parent = frameDoc.getElementById('main');
	var nextNode = frameDoc.getElementById('butt');
	var old = frameDoc.getElementById('questionPrompt');
	
	if(old){
		parent.removeChild(old);
	};
	
	var newQuestion = createElement(frameDoc, 'div', {id: 'questionPrompt'});
	newQuestion.innerHTML = this.prompt;
	
	parent.insertBefore(newQuestion, nextNode);
};

BRAINSTORM.prototype.renderResponsePage = function(){
	var frame = document.getElementById('brainstormFrame');
	
	frame.src = 'brainliteresponse.html';
};

BRAINSTORM.prototype.responsePageLoaded = function(frameDoc){
	var responsesParent = frameDoc.getElementById('responses');
	var promptParent = frameDoc.getElementById('questionDiv');
	
	promptParent.innerHTML = 'Question: <br>' + this.prompt;
	
	for(var p=0;p<this.cannedResponses.length;p++){
		var response = createElement(frameDoc, 'textarea', {rows: '3', cols:  '75', disabled: true, id: this.cannedResponses[p].getAttribute('name')});
		response.value = this.cannedResponses[p].firstChild.nodeValue;
		responsesParent.appendChild(response);
		responsesParent.appendChild(createElement(frameDoc, 'br'));
	};
	
	if (this.states!=null && this.states.length > 0) {
		frameDoc.getElementById('studentResponse').value = this.states[this.states.length - 1].response;
	};
};

BRAINSTORM.prototype.save = function(frameDoc){
	var response = frameDoc.getElementById('studentResponse').value
	if(response){
		var currentState = new BRAINSTORMSTATE(response);
		this.states.push(currentState);
		if(this.vle){
			this.vle.state.getCurrentNodeVisit().nodeStates.push(currentState);
		};
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