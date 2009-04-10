/**
 * BrainstormNode
 *
 * @author: patrick lawler
 */

BrainstormNode.prototype = new Node();
BrainstormNode.prototype.constructor = BrainstormNode;
BrainstormNode.prototype.parent = Node.prototype;
function BrainstormNode(nodeType) {
	this.type = nodeType;
};

BrainstormNode.prototype.render = function(contentpanel){
	alert('rendering');
};

BrainstormNode.prototype.load = function(){
	alert('loading');
};

BrainstormNode.prototype.getDataXML = function(nodeStates) {
	return BrainstormNode.prototype.parent.getDataXML(nodeStates);
};

BrainstormNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		var stateObject = MSSTATE.prototype.parseDataXML(stateXML);
		
		if(stateObject != null) {
			statesArrayObject.push(stateObject);
		};
	};
	
	return statesArrayObject;
};