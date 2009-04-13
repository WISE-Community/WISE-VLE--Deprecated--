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
	this.prompt = this.assessmentItem.getElementsByTagName('prompt')[0].firstChild.nodeValue;
	this.cannedResponses = xmlDoc.getElementsByTagName('response');

	this.questionType = this.assessmentItem.getAttribute('identifier');
};

BRAINSTORM.prototype.render = function(){
	var parent = document.getElementById('frameDiv');
	var old = document.getElementById('brainstormFrame');
	
	//remove previous frame if it exists
	if(old){
		parent.removeChild(old);
	};
	
	//create new frame
	if(this.serverless){
		var frame = createElement(document, 'iframe', {id: 'brainstormFrame', name: 'brainstormFrame', width: '100%', height: '100%', frameborder: '0', src: 'brainlite.html'});
	} else {
		var frame = createElement(document, 'iframe', {id: 'brainstormFrame', name: 'brainstormFrame', width: '100%', height: '100%', frameborder: '0', src: 'brainfull.html'});
	};
	parent.appendChild(frame);
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
	var parent = document.getElementById('frameDiv');
	parent.removeChild(document.getElementById('brainstormFrame'));
	
	var newFrame = createElement(document, 'iframe', {id: 'brainstormFrame', name: 'brainstormFrame', width: '100%', height: '100%', frameborder: '0', src: 'brainliteresponse.html'});
	parent.appendChild(newFrame);
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
};

BRAINSTORM.prototype.save = function(frameDoc){
	var response = frameDoc.getElementById('studentResponse').value
	if(response){
		this.states.push(new BRAINSTORMSTATE(response));
	};
	alert(this.states.length);
};

BRAINSTORM.prototype.loadState = function(states){
	if(states){
		this.states = states;
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