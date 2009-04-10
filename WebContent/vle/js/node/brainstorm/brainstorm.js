/**
 * A representation of a Brainstorm which can be either 
 * open_response or single_choice (not implemented) and
 * can either via server or serverless
 * 
 * @author: patrick lawler
 */
function BRAINSTORM(xmlDoc){
	this.serverless = true;
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
	
	this.questionType = this.assessmentItem.getAttribute('identifier');
};

BRAINSTORM.prototype.render = function(){
	var parent = document.getElementById('frameDiv');
	if(this.serverless){
		var frame = createElement(document, 'iframe', {id: 'brainstormFrame', name: 'brainstormFrame', width: '100%', height: '100%', frameborder: '0', src: 'brainlite.html'});
	} else {
		var frame = createElement(document, 'iframe', {id: 'brainstormFrame', name: 'brainstormFrame', width: '100%', height: '100%', frameborder: '0', src: 'brainfull.html'});
	};
	parent.appendChild(frame);
};

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