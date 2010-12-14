/**
 * Functions that handle adding/editing/removing previuos work for nodes
 * 
 * @author patrick lawler
 */

/**
 * Clears both To and From cols of all Option elements
 */
View.prototype.clearCols = function(){ 
	var toSelect = document.getElementById('selectTo');
	var fromSelect = document.getElementById('selectFrom');

	while(toSelect.firstChild){
		toSelect.removeChild(toSelect.firstChild);
	};

	while(fromSelect.firstChild){
		fromSelect.removeChild(fromSelect.firstChild);
	};
};

/**
 * Uses the activeNode's prevWorkNodeIds list to populate the
 * TO columns select list with appropriate option elements.
 */
View.prototype.populateToCol = function(){
	var parent = document.getElementById('selectTo');
	var tos = this.activeNode.prevWorkNodeIds;
	if(tos){
		for(var q=0;q<tos.length;q++){
			var toNode = this.project.getNodeById(tos[q]);
			parent.appendChild(this.createOptionElement(toNode.id, toNode.title));
		};
	};
};

/**
 * Uses the project's node list minus the activeNode and other
 * nodes that are already in the list to populate the FROM columns
 * select list with the appropriate option elements.
 */
View.prototype.populateFromCol = function(){
	var parent = document.getElementById('selectFrom');
	var fromNodes = this.removeUnwanted(this.project.getLeafNodes());
	if(fromNodes){
		for(var w=0;w<fromNodes.length;w++){
			parent.appendChild(this.createOptionElement(fromNodes[w].id, fromNodes[w].title));
		};
	};
};

/**
 * Given a list of nodes, removes any nodes that: are already
 * in the TO list, SequenceNodes, excludedNodes and the currently
 * activeNode and returns that list.
 */
View.prototype.removeUnwanted = function(nodes){
	//make copy of array to work with
	workNodes = nodes.slice();
	
	//remove activeNode
	var ndx = workNodes.indexOf(this.activeNode);
	if(ndx!=-1){
		workNodes.splice(ndx, 1);
	};
	
	//cycle through remaining and remove any in TO list, Sequence or excluded
	for(var e=workNodes.length-1;e>=0;e--){
		var node = workNodes[e];
		if(node.type=='sequence' || node.type=='Activity' || node.children.length>0 || 
				this.excludedPrevWorkNodes.indexOf(node.type)!=-1 || 
				this.activeNode.prevWorkNodeIds.indexOf(node.id)!=-1){
			workNodes.splice(e,1);
		};
	};

	return workNodes;
};

/**
 * Adds the selected options in the right column to the activeNode
 * and refreshes so they appear in the left column
 */
View.prototype.moveSelectedLeft = function(){
	var opts = document.getElementById('selectFrom').options;
	var selected = [];

	//retrieve selected
	for(var r=0;r<opts.length;r++){
		if(opts[r].selected){
			selected.push(opts[r]);
		};
	};

	//then move them
	for(var y=0;y<selected.length;y++){
		var detached = selected[y].parentNode.removeChild(selected[y]);
		document.getElementById('selectTo').appendChild(detached);
	};
};

/**
 * Removes the selected options in the left column from the activeNode
 * and refreshes so they appear in the right column
 */
View.prototype.moveSelectedRight = function(){
	var opts = document.getElementById('selectTo').options;
	var selected = [];

	//retrieve selected
	for(var t=0;t<opts.length;t++){
		if(opts[t].selected){
			selected.push(opts[t]);
		};
	};

	//then move them
	for(var u=0;u<selected.length;u++){
		var detached = selected[u].parentNode.removeChild(selected[u]);
		document.getElementById('selectFrom').appendChild(detached);
	};
};

/**
 * Given a nodeId and title, creates and returns an 
 * option element whose value is that id and displays
 * the title.
 */
View.prototype.createOptionElement = function(nodeId, title){
	var opt = createElement(document, 'option', {id: nodeId + '_opt'});
	opt.text = title;
	opt.value = nodeId;
	return opt;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_previouswork.js');
}