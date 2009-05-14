/**
 * A Glue is an object that contains and renders
 * one or more children collectively.
 * 
 * @author: patrick lawler
 */
 
 function GLUE(xmlDoc){
 	this.prompt = null;
 	this.states = [];
 	this.vle = null
 	this.children = [];
 	this.xmlDoc = xmlDoc;
 	this.frames = [];
 	this.currentChild = 0;
 	
 	this.parseXMLDoc();
 };
 
 GLUE.prototype.parseXMLDoc = function(){
 	if(this.xmlDoc.getElementsByTagName('prompt')[0].firstChild){
 		this.prompt = this.xmlDoc.getElementsByTagName('prompt')[0].firstChild.nodeValue;
 	} else{
 		this.prompt = "";
 	};
 	
 	if(this.xmlDoc && this.vle){
 		var children = this.xmlDoc.getElementsByTagName('node-ref');
 		for(var v=0;v<children.length;v++){
 			this.children.push(this.vle.project.getNodeById(children[v].getAttribute('ref')));
 		};
 	};
 };
 
 GLUE.prototype.render = function(){
 	this.frames = [];
 	var parent = document.getElementById('framesDiv');
 	document.getElementById('promptDiv').innerHTML = this.prompt;
 	
 	for(var b=0;b<this.children.length;b++){
 		var frame = createElement(document, 'iframe', {id:'f'+this.children[b].id, name:'f'+this.children[b].id, width:'100%'});
 		this.frames.push(frame);
 		parent.appendChild(frame);
 		frame.style.display = 'none';
 		this.children[b].renderLite('f'+this.children[b].id);
 		this.children[b].loadLite('f'+this.children[b].id);
 	};
 	
 	if(this.children.length>0){
 		setTimeout('delayRender()', 2000);
 	};
 };

function delayRender(){
	glue.renderChild(0);
};
 
GLUE.prototype.renderChild = function(index){
	this.currentChild = index;
	this.frames[index].style.display = 'inline';
	this.frames[index].height = window.frames[this.frames[index].name].document.body.scrollHeight;
 	
 	var buttonParent = document.getElementById('buttonsDiv');
 	
 	while(buttonParent.firstChild){
 		buttonParent.removeChild(buttonParent.firstChild);
 	};
 	
 	if(index == this.children.length-1){
 		this.renderButtons();
 	} else {
 		this.renderInfo();
 	};
};

GLUE.prototype.renderButtons = function(){
	var buttonParent = document.getElementById('buttonsDiv');
 	
 	var saveButt = createElement(document, 'input', {id: 'saveButton', type: 'button', value: 'save', onclick: 'save()'});
 	var editButt = createElement(document, 'input', {id: 'editButton', type: 'button', value: 'edit', onclick: 'edit()'});
 	buttonParent.appendChild(saveButt);
 	buttonParent.appendChild(editButt);
};

GLUE.prototype.renderInfo = function(){
	var parent = document.getElementById('buttonsDiv');
	
	var text = document.createTextNode('Question ' + (this.currentChild + 1) + ' of ' + this.children.length + '. Use the navigation arrows above to move to the next question.');
	
	parent.appendChild(text);
};

GLUE.prototype.renderNext = function(){
	if(this.currentChild==this.children.length-1){
		//load next in vle
		var nextNode = this.vle.navigationLogic.getNextNode(this.vle.getCurrentNode());
		while (nextNode != null && (nextNode.type == "Activity" || nextNode.children.length > 0)) {
			nextNode = this.vle.navigationLogic.getNextNode(nextNode);
		}
		if (nextNode == null) {
			alert("nextNode does not exist");
		} else {
			this.vle.renderNode(nextNode.id);
		}
	} else {
		this.frames[this.currentChild].style.display = 'none';
		this.renderChild(this.currentChild+1);
	};
};
 
GLUE.prototype.renderPrev = function(){
	if(this.currentChild==0){
		//load prev in vle
		var prevNode = this.vle.navigationLogic.getPrevNode(this.vle.getCurrentNode());
		while (prevNode != null && (prevNode.type == "Activity" || prevNode.children.length > 0)) {
			prevNode = this.vle.navigationLogic.getPrevNode(prevNode);
		}
		
		if (prevNode == null) {
			alert("prevNode does not exist");
		} else {
			this.vle.renderNode(prevNode.id);
		}
	} else {
		this.frames[this.currentChild].style.display = 'none';
		this.renderChild(this.currentChild-1);
	};
};
 
GLUE.prototype.save = function(){
	//make all frames visible
	for(var o=0;o<this.frames.length;o++){
		this.frames[o].style.display = 'inline';
	};
	
	//make sure all of the questions have been answered
 	for(var n=0;n<this.frames.length;n++){
 		var answer = window.frames[this.frames[n].name].getAnswered();
 		if(!answer){
 			alert('You must answer all of the questions before continuing');
 			return;
 		};
 	};
 	
 	//check the individual answers and add to glue state
 	var childstates = "";
 	for(var m=0;m<this.frames.length;m++){
 		var childState = window.frames[this.frames[m].name].checkAnswerLite();
 		var childId = this.frames[m].name.substring(1, this.frames[m].name.length);
 		childstates += '<childState childId=' + childId + '>' + childState.getDataXML() + '</childState>';
 	};
 	
 	var glueState = new GLUESTATE(childstates);
 	this.states.push(glueState);
 	
 	if (this.vle != null) {
		this.vle.state.getCurrentNodeVisit().nodeStates.push(glueState);
	};
	
	if (this.node != null) {
		// we're loading from the VLE, and have access to the node, so fire the ended session event
		this.node.nodeSessionEndedEvent.fire(null);
	};
	
	var savedDiv = createElement(document, 'div');
	var parent = document.getElementById('msgDiv');
	
	parent.appendChild(savedDiv);
	savedDiv.innerHTML = "<font color='8B0000'>saved</font>";
};
 
GLUE.prototype.loadStates = function(states){
 	if(states){
 		this.states = states;
 	};
 };
 
GLUE.prototype.loadVLE = function(vle){
 	if(vle){
 		this.vle = vle;
 		this.parseXMLDoc();
 	};
};