/**
 * BrainstormNode
 *
 * @author: patrick lawler
 */

BrainstormNode.prototype = new Node();
BrainstormNode.prototype.constructor = BrainstormNode;
BrainstormNode.prototype.parent = Node.prototype;
function BrainstormNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
};

BrainstormNode.prototype.render = function(contentpanel){
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	this.renderComplete = false;
	vle.eventManager.addEvent(this, 'nodeRenderComplete_' + this.id);
	
	var frm = window.frames["ifrm"];
	window.allready = function(){
		var callbackCallback = function(args){
			args[0].renderComplete = true;
			args[1].eventManager.fire('nodeRenderComplete_' + args[0].id);
		};
		
		var callback = function(){
			frm.scriptloader.initialize(frm.document, callbackCallback, 'brainstorm', [vle.currentNode, vle]);
		};
		
		frm.pageBuilder = pageBuilder;
		frm.pageBuilder.build(frm.document, 'brainstorm', callback);
	};
	
	frm.location = 'blank.html';
};

BrainstormNode.prototype.load = function(){
	var load = function(event, args, bNode){console.log('ev: ' + event + '  args: ' + args + '  bNode: ' + bNode);
		if(!bNode){//Firefox only passes the obj
			bNode = event;
		};
		
		var states = [];
		for (var i=0; i < vle.state.visitedNodes.length; i++) {
			var nodeVisit = vle.state.visitedNodes[i];
			if (nodeVisit.node.id == bNode.id) {
				for (var j=0; j<nodeVisit.nodeStates.length; j++) {
					states.push(nodeVisit.nodeStates[j]);
				};
			};
		};
		
		window.frames["ifrm"].loadContent(bNode.element, bNode.id, states, vle);
	};
	
	if(this.renderComplete){
		load(this);
	} else {
		vle.eventManager.subscribe('nodeRenderComplete_' + this.id, load, this);
	};
};

BrainstormNode.prototype.getDataXML = function(nodeStates) {
	return BrainstormNode.prototype.parent.getDataXML(nodeStates);
};

BrainstormNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		var stateObject = BRAINSTORMSTATE.prototype.parseDataXML(stateXML);
		
		if(stateObject != null) {
			statesArrayObject.push(stateObject);
		};
	};
	
	return statesArrayObject;
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/BrainstormNode.js");