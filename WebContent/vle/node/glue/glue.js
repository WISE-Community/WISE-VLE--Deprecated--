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
 
 /**
  * Parses the xmlDoc for this glue, set prompt
  * field and retrieves children from vle
  */
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
 
 /**
  * Renders the prompt frame, initializes the children 
  * frames for this glue.
  */
 GLUE.prototype.render = function(){
 	this.frames = [];
 	var parent = document.getElementById('framesDiv');
 	
 	//create a display frame which prompts students before questions
 	var frame = createElement(document, 'iframe', {id:'display', name:'display', width:'100%', src:'glue.html'});
 	this.frames.push(frame);
 	parent.appendChild(frame);
 	window.frames['display'].document.open();
 	window.frames['display'].document.write(this.prompt);
 	window.frames['display'].document.close();
 	frame.style.display = 'none';
 	
 	//create frames for children of this glue and initialize them
 	for(var b=0;b<this.children.length;b++){
 		var frame = createElement(document, 'iframe', {id:'f'+this.children[b].id, name:'f'+this.children[b].id, width:'100%'});
 		this.frames.push(frame);
 		parent.appendChild(frame);
 		frame.style.display = 'none';
 		this.children[b].renderLite('f'+this.children[b].id);
 		this.children[b].loadLite('f'+this.children[b].id);
 	};
 	
 	//allow time for children to render, then render prompt
 	setTimeout('delayRender()', 2000);
 };

/**
 * Renders prompt page ('0' is prompt)
 */
function delayRender(){
	glue.renderChild(0);
};

/**
 * Renders the child of this glue with the given @param index
 */
GLUE.prototype.renderChild = function(index){
	this.currentChild = index;
	this.frames[index].style.display = 'inline';
	this.frames[index].height = window.frames[this.frames[index].name].document.body.scrollHeight;
	
	var buttonParent = document.getElementById('buttonsDiv');
	
	//remove existing buttons
	while(buttonParent.firstChild){
		buttonParent.removeChild(buttonParent.firstChild);
	};
	
	if(index == this.children.length){
		this.renderButtons();
	};
	
	//set title bar with 'Question X of Y'
	window.parent.document.getElementById('topStepTitle').innerHTML = 'Question ' + this.currentChild + ' of ' + this.children.length + '.';
};

/**
 * Creates the save and edit buttons and appends them
 * to the buttons Div
 */
GLUE.prototype.renderButtons = function(){
	var buttonParent = document.getElementById('buttonsDiv');
 	
 	var saveButt = createElement(document, 'input', {id: 'saveButton', type: 'button', value: 'save', onclick: 'save()'});
 	var editButt = createElement(document, 'input', {id: 'editButton', type: 'button', value: 'edit', onclick: 'edit()'});
 	buttonParent.appendChild(saveButt);
 	buttonParent.appendChild(editButt);
};

/**
 * If glue still has more children, renders the next child,
 * otherwise, relinquishes control of the nav buttons to the
 * vle.
 */
GLUE.prototype.renderNext = function(){
	if(this.currentChild==this.children.length){
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

/**
 * If glue still has more children, renders the previous child,
 * otherwise, relinquishes control of the nav buttons to the
 * vle.
 */
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

/**
 * Displays all children frames for this glue, calls the 
 * children save functions, retrieves children states and
 * appends to the glue state
 */
GLUE.prototype.save = function(){
	//make all frames visible except prompt frame
	for(var o=1;o<this.frames.length;o++){
		this.frames[o].style.display = 'inline';
	};
	
	//make sure all of the questions have been answered
 	for(var n=1;n<this.frames.length;n++){
 		var answer = window.frames[this.frames[n].name].getAnswered();
 		if(!answer){
 			alert('You must answer all of the questions before continuing');
 			return;
 		};
 	};
 	
 	//check the individual answers and add to glue state
 	var childstates = "";
 	for(var m=1;m<this.frames.length;m++){
 		var childState = window.frames[this.frames[m].name].checkAnswerLite();
 		var childId = this.frames[m].name.substring(1, this.frames[m].name.length);
 		if(childState.getDataXML){
 			childstates += '<childState childId=' + childId + '>' + childState.getDataXML() + '</childState>';
 		} else {
 			childstates += '<childState childId=' + childId + '>' + childState + '</childState>';
 		};
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
 
/**
 * loads the state for this glue
 */
GLUE.prototype.loadStates = function(states){
 	if(states){
 		this.states = states;
 	};
 };

/**
 * loads the vle for this glue
 */ 
GLUE.prototype.loadVLE = function(vle){
 	if(vle){
 		this.vle = vle;
 		this.parseXMLDoc();
 	};
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/glue/glue.js");	