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
 	document.getElementById('promptDiv').innerHTML = this.prompt;
 	var parent = document.getElementById('framesDiv');
 	for(var b=0;b<this.children.length;b++){
 		var frame = createElement(document, 'iframe', {id:'f'+this.children[b].id, name:'f'+this.children[b].id, width:'100%'});
 		parent.appendChild(frame);
 		this.children[b].renderLite('f'+this.children[b].id);
 		this.frames.push(frame);
 		this.children[b].loadLite('f'+this.children[b].id);
 	};
 	
 	var buttonParent = document.getElementById('buttonsDiv');
 	var saveButt = createElement(document, 'input', {id: 'saveButton', type: 'button', value: 'save', onclick: 'save()'});
 	var editButt = createElement(document, 'input', {id: 'editButton', type: 'button', value: 'edit', onclick: 'edit()'});
 	buttonParent.appendChild(saveButt);
 	buttonParent.appendChild(editButt);
 };
 
GLUE.prototype.save = function(){
 	//make sure all of the questions have been answered
 	for(var n=0;n<this.frames.length;n++){
 		var answer = window.frames[this.frames[n].name].mc.answered;
 		if(!answer){
 			alert('You must answer all of the questions before continuing');
 			return;
 		};
 	};
 	
 	//check the individual answers and add to glue state
 	var childstates = "";
 	for(var m=0;m<this.frames.length;m++){
 		var childState = window.frames[this.frames[m].name].mc.checkAnswerLite();
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