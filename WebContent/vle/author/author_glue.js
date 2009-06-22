/*****											    *****|
 * The following functions are used by YUI for the drag *|
 * and drop stuff on the author_glue page			    *|
 *****											    *****/
function generateGlueDD(){	
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
	            onGlueNodeDropped(drag, drop);
	        } 
	    });
	    
	    //Static Vars
	    var goingUp = false, lastY = 0;
	    
	    //create node draggables
	    var nodes = document.getElementsByName('ddNodes');
	    for(var n=0;n<nodes.length;n++){
	    	createDraggable(Y, nodes[n]);
	    };
	    
	    //create reference draggables
	    var refs = document.getElementsByName('attached');
	    for(var r=0;r<refs.length;r++){
	    	createDraggable(Y, refs[r]);
	    };
	    
	    //Create target for the glue container
	    createTarget(Y, document.getElementById('attachedUL'));
	    
	    //Create trash target
	    createTarget(Y, document.getElementById('trashDiv'));
	    
	    //Create nodes UL as target (so we can catch drop events for
	    //draggables that do not belong
	    createTarget(Y, document.getElementById('nodesUL'));
	});
};

function createTarget(Y, el){
	var tar = new Y.DD.Drop({node: el});
};

function createDraggable(Y, el){
	var dd = new Y.DD.Drag({node: el, proxy: true, moveOnEnd: false, constrain2node: '#ddTable',  target:{padding: '0 0 0 20'}});
};

function createReferences(){
	var parent = xmlPage.getElementsByTagName('children')[0];
	
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	var docParent = document.getElementById('attachedUL');
	var children = docParent.childNodes;
	for(var z=0;z<children.length;z++){
		if(children[z].id!=null && children[z].id!='placeholder' && children[z].id!=""){
			var childId = children[z].id.substring(children[z].id.indexOf('_') + 1, children[z].id.length);
			var child = xmlPage.createElement('node-ref');
			child.setAttribute('ref', childId);
			parent.appendChild(child);
		};
	};
};

function onGlueNodeDropped(dragged, dropped){
	if(dropped.get('id')=='trashDiv'){
		if(dragged.get('id').substring(0, dragged.get('id').indexOf('_'))=='node'){
			alert('Please create and remove nodes from the main authoring page only.');
		} else {
			var child = document.getElementById(dragged.get('id'));
			child.parentNode.removeChild(child);
			createReferences();
		};
	} else if(dropped.get('id')=='attachedUL'){
		createReferences();
	};
	
	generateAttached();
	generateNodes();
	generateTrash();
	generateGlueDD();
};
/*****												******|
 * End functions used by YUI for the drag and drop stuff *|
 *****												******/
 
 //used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/author_glue.js");