function AuthoringTool() {
	this.id="authoringtool";
}

/*
 * called when a node was dragged and dropped somewhere
 */
onNodeDropped = function(draggedNode, droppedNode) {
	//alert('onNodesDropped called with node1:' + draggedNode);
	//alert('onNodesDropped called with node2:' + droppedNode);
	// get the sequence by inspecting the DOM, and then tell project to
	// update the sequence
    //Get the list of li's with class draggable in the lists and make them draggable
	var sequenceArray = [];
	YUI().use('node', function(Y) {
	var lis = Y.Node.all('#navAuthoringDiv ul li.draggable');
    if (lis != null) {
    	lis.each(function(v, k) {
    		sequenceArray.push(v.get('id'));
    	});
    }
	});
	project.updateSequence(sequenceArray);
}