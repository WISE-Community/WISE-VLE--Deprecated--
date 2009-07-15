/*****											    *****|
 * The following functions are used by YUI for the drag *|
 * and drop stuff on the authoring page				    *|
 *****											    *****/
function generateDD(){	
	YUI().use('dd-constrain', 'dd-proxy', 'dd-drop', 'dd-ddm', 'dd-ddm-drop', function(Y) {
	    //Listen for all drop:over events
	    Y.DD.DDM.on('drop:over', function(e) {
	    	
	       //Get a reference to out drag and drop nodes
	        var drag = e.drag.get('node'),
	            drop = e.drop.get('node');
	        
	        //Are we dropping on a li node?
	        if (drop.get('tagName').toLowerCase() === 'li') {
	        	
	            //Are we not going up?
	            if (!goingUp) {
	               drop = drop.get('nextSibling');
	            }
	            //Add the node to this list
	            e.drop.get('node').get('parentNode').insertBefore(drag, drop);
	            //Resize this nodes shim, so we can drop on it later.
	            e.drop.sizeShim();
	        }
	    });
	    //Listen for all drag:drag events
	    Y.DD.DDM.on('drag:drag', function(e) {
	        //Get the last y point
	        var y = e.target.lastXY[1];
	        //is it greater than the lastY var?
	        if (y < lastY) {
	            //We are going up
	            goingUp = true;
	        } else {
	            //We are going down..
	            goingUp = false;
	        }
	        //Cache for next check
	        lastY = y;
	    });
	    //Listen for all drag:start events
	    Y.DD.DDM.on('drag:start', function(e) {
	        //Get our drag object
	        var drag = e.target;
	        //Set some styles here
	        drag.get('node').setStyle('opacity', '.25');
	        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
	        drag.get('dragNode').setStyles({
	            opacity: '.5',
	            borderColor: drag.get('node').getStyle('borderColor'),
	            backgroundColor: drag.get('node').getStyle('backgroundColor')
	        });
	        
	    });
	    //Listen for a drag:end events
	    Y.DD.DDM.on('drag:end', function(e) {
	        var drag = e.target;
	        //Put out styles back
	        drag.get('node').setStyles({
	            visibility: '',
	            opacity: '1'
	        });
	    });
	    //Listen for all drag:drophit events
	    Y.DD.DDM.on('drag:drophit', function(e) {
	        var drop = e.drop.get('node'),
	            drag = e.drag.get('node');
			
	        //if we are not on an li, we must have been dropped on a ul
	        if (drop.get('tagName').toLowerCase() !== 'li') {
	            if (!drop.contains(drag)) {
	                drop.appendChild(drag);
	            }
	            onNodeDropped(drag, drop);
	        } 
	    });
	    
	    //Static Vars
	    var goingUp = false, lastY = 0;
	    
	    //create node draggables
	    var nodes = document.getElementsByName('nodes');
	    for(var n=0;n<nodes.length;n++){
	    	createDraggable(Y, nodes[n]);
	    };
	    
	    //create sequence draggables
	    var sequences = document.getElementsByName('sequenceTitleDiv');
	    for(var s=0;s<sequences.length;s++){
	    	createDraggable(Y, sequences[s]);
	    };
	    
	    //create reference draggables
	    var refs = document.getElementsByName('ref-node');
	    for(var r=0;r<refs.length;r++){
	    	createDraggable(Y, refs[r]);
	    };
	    
	    //Create targets from the sequenceContainters
	    var targets = document.getElementsByName('sequenceContainer');
	    for(var f=0;f<targets.length;f++){
	    	createTarget(Y, targets[f]);
	    };
	    
	    //Create trash target
	    createTarget(Y, document.getElementById('trash'));
	    
	    //Create nodes UL as target (so we can catch drop events for
	    //draggables that do not belong
	    createTarget(Y, document.getElementById('nodesUL'));
	});
};

/**
 * Allows yui to use the element as a drop target
 * for drag and drop
 */
function createTarget(Y, el){
	var tar = new Y.DD.Drop({node: el});
};

/**
 * Allows yui to make an element draggable
 */
function createDraggable(Y, el){
	var dd = new Y.DD.Drag({node: el, proxy: true, moveOnEnd: false, constrain2node: '#ddTable',  target:{padding: '0 0 0 20'}});
};

/**
 * Removes the dragged element from the authoring tool,
 * the loaded project and the nodes file from the server
 */
function removeDragged(el){
	var nodeId = el.get('id');
	var docEl = document.getElementById(nodeId);
	var parent = docEl.parentNode;
	
	removeNodeFileFromServer(nodeId);
	parent.removeChild(docEl);
	project.removeNodeById(nodeId);
};

/**
 * Removes the referenced element from the project
 */
function removeReferencedNode(el, location){
	var nodeId = el.get('id');
	var docEl = document.getElementById(nodeId);
	var parent = docEl.parentNode;
	var parentChildLocation = nodeId.split('|');
	
	parent.removeChild(docEl);
	project.removeReferenceFromSequence(parentChildLocation[0], parentChildLocation[1], parentChildLocation[2]);
};

/**
 * When a node (sequence or leaf) is dropped, checks to see if it is
 * dropped on 'trash' and removes sequence, leaf from project, if it is 
 * a reference, removes reference from the sequence. If the sequence or node was 
 * dropped on a sequence, adds a reference to the sequence. If it was a reference,
 * removes reference from old sequence and/or location from old sequence
 * and adds it to new seqeuence. If node was dropped in the nodes list updates
 * ordering of the nodes in the project match nodes in list.
 */
function onNodeDropped(dragged, dropped){
	
	if(dropped.get('id')=='trash'){
		projectSaved = false;
		if(document.getElementById(dragged.get('id')).getAttribute('name')=='ref-node'){
			removeReferencedNode(dragged);
		} else {
			removeDragged(dragged);
		};
	} else if(document.getElementById(dropped.get('id')).getAttribute('name')=='sequenceContainer'){
		projectSaved = false;
		var dropEl = document.getElementById(dropped.get('id'));
		var dragEl = document.getElementById(dragged.get('id'));
		
		var location = 0;
		for(var c=0;c<dropEl.childNodes.length;c++){
			if(dropEl.childNodes[c].getAttribute('name') == 'placeholder'){
				location = -1; //reset, this is where the reference elements begin
			};
			if(dropEl.childNodes[c].id == dragEl.id){
				break; //found it
			};
			location ++;
		};
		
		if(dragEl.getAttribute('name')=='sequenceTitleDiv'){
			project.addSequenceToSequence(dragEl.id, dropEl.id.substring(0, dropEl.id.lastIndexOf('_')), location);
		} else if(dragEl.getAttribute('name')=='nodes'){
			project.addNodeToSequence(dragEl.id, dropEl.id.substring(0, dropEl.id.lastIndexOf('_')), location);
		} else {
			removeReferencedNode(dragged);
			project.addNodeToSequence(dragged.get('id').split('|')[1], dropEl.id.substring(0, dropEl.id.lastIndexOf('_')), location);
		};
	} else if(dropped.get('id')=='nodesUL'){
		var dropEl = document.getElementById(dropped.get('id'));
		var dragEl = document.getElementById(dragged.get('id'));
		
		if(dragEl.getAttribute('name')=='nodes'){
			projectSaved = false;
			
			var location = 0;
			for(var c=0;c<dropEl.childNodes.length;c++){
				if(dropEl.childNodes[c].getAttribute('name') != 'placeholder'){
					if(dropEl.childNodes[c].id == dragEl.id){
						project.updateNodeLocation(dragEl.id, location);
					};
					location ++;
				};
			};
		};
	}; 
	
	populateSequences();
	populateNodes();
	generateDD();
};
/*****												******|
 * End functions used by YUI for the drag and drop stuff *|
 *****												******/
 
 //used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/authoring.js");