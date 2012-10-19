/**
 * Functions related to the main layout of the project in the authoring view
 * 
 * @author patrick lawler
 * @authopr jonathan lim-breitbart
 */

/**
 * Creates the html elements necessary for authoring the currently
 * opened project.
 */
/*View.prototype.generateAuthoring = function(){
	var parent = document.getElementById('dynamicProject');
	$('#projectButtons button').removeAttr('disabled');
	
	//remove any old elements and clear variables
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	this.currentStepNum = 1;
	this.currentSeqNum = 1;
	
	//set up project table
	var tab = createElement(document, 'table', {id: 'projectTable'});
	var tHead = createElement(document, 'thead', {id: 'projectTableHead'});
	var tBod = createElement(document, 'tbody', {id: 'projectTableBody'});
	var existingRow = createElement(document, 'tr', {id: 'existingRow'});
	var unattachedSequenceRow = createElement(document, 'tr', {id: 'unattachedSequenceRow'});
	var unattachedNodeRow = createElement(document, 'tr', {id: 'unattachedNodeRow'});
	
	parent.appendChild(tab);
	tab.appendChild(tHead);
	tab.appendChild(tBod);
	tBod.appendChild(existingRow);
	tBod.appendChild(unattachedSequenceRow);
	tBod.appendChild(unattachedNodeRow);
	
	//generate existing project structure
	var existingTable = createElement(document, 'table', {id: 'existingTable'});
	var existingTH = createElement(document, 'thead', {id: 'existingTableHead'});
	var existingTB = createElement(document, 'tbody', {id: 'existingTableBody'});
	existingRow.appendChild(existingTable);
	existingTable.appendChild(existingTH);
	existingTable.appendChild(existingTB);
	
	if(this.project.getRootNode()){
		this.generateNodeElement(this.project.getRootNode(), null, existingTable, 0, 0);
	};
	
	//generate unattached nodes
	var uSeqTable = createElement(document, 'table', {id: 'unusedSequenceTable'});
	var uSeqTH = createElement(document, 'thead');
	var uSeqTB = createElement(document, 'tbody', {id: 'unusedSequenceTableBody'});
	var uSeqTR = createElement(document, 'tr', {id: 'unusedSequenceTitleRow'});
	var uSeqETD = createElement(document, 'td');
	var uSeqTD = createElement(document, 'td');
	
	unattachedSequenceRow.appendChild(uSeqTable);
	uSeqTable.appendChild(uSeqTH);
	uSeqTable.appendChild(uSeqTB);
	uSeqTB.appendChild(uSeqTR);
	uSeqTR.appendChild(uSeqETD);
	uSeqTR.appendChild(uSeqTD);
	
	var unusedSeqDiv = createElement(document, 'div', {id: 'uSeq', 'class': 'uSeq', onclick: 'eventManager.fire("selectClick","uSeq")', onMouseOver: 'eventManager.fire("checkAndSelect","uSeq")', onMouseOut: 'eventManager.fire("checkAndDeselect","uSeq")'});
	var unusedSeqText = document.createTextNode('Inactive Activities');
	var unusedSeqs = this.project.getUnattached('sequence');
	
	uSeqTD.appendChild(unusedSeqDiv);
	unusedSeqDiv.appendChild(unusedSeqText);
	unusedSeqDiv.innerHTML += ' <span>(Not Shown in Project)</span>';
	for(var d=0;d<unusedSeqs.length;d++){
		this.generateNodeElement(unusedSeqs[d], null, uSeqTB, 0, 0);
	};
	
	var uNodeTable = createElement(document, 'table', {id: 'unusedNodeTable'});
	var uNodeTH = createElement(document, 'thead');
	var uNodeTB = createElement(document, 'tbody', {id: 'unusedNodeTableBody'});
	var uNodeTR = createElement(document, 'tr', {id: 'unusedNodeTitleRow'});
	var uNodeETD = createElement(document, 'td');
	var uNodeTD = createElement(document, 'td');
	
	unattachedNodeRow.appendChild(uNodeTable);
	uNodeTable.appendChild(uNodeTH);
	uNodeTable.appendChild(uNodeTB);
	uNodeTB.appendChild(uNodeTR);
	uNodeTR.appendChild(uNodeETD);
	uNodeTR.appendChild(uNodeTD);
	
	var unusedNodeDiv = createElement(document, 'div', {id: 'uNode', onclick: 'eventManager.fire("selectClick","uNode")', onMouseOver: 'eventManager.fire("checkAndSelect","uNode")', onMouseOut: 'eventManager.fire("checkAndDeselect","uNode")'});
	var unusedNodesText = document.createTextNode('Inactive Steps');
	var unusedNodes = this.project.getUnattached('node');
	
	uNodeTD.appendChild(unusedNodeDiv);
	unusedNodeDiv.appendChild(unusedNodesText);
	unusedNodeDiv.innerHTML += ' <span>(Not Shown in Project)</span>';
	for(var e=0;e<unusedNodes.length;e++){
		this.generateNodeElement(unusedNodes[e], null, uNodeTB, 0, 0);
	};
	
	//notify user if any of their project violates their project structure mode and
	//advise to fix it in advanced structure mode if it does.
	if(this.projectStructureViolation){
		this.notificationManager.notify("The current project mode is Simple Project, but while generating the authoring, " +
				"nodes have been found that violate that structure (Project-->Activity-->Step). Those nodes have been " +
				"ignored! You should fix this by either authoring in Advanced Project mode or switching to Advanced " +
				"Project mode long enough to put the project in the structure required for Simple Project.", 3);
	};
	
	// show number of nodes per sequence
	$('.seq').each(function(){
		var split = $(this).attr('id').split('--');
		var sequenceId = split[1];
		var numNodes = 0;
		$('[id^='+sequenceId+']').each(function(){
			numNodes++;
		});
		if(numNodes==1){
			$(this).append('<div id="'+ sequenceId +'_count" class="nodeCount">'+ numNodes +' Step<span class="selectCount"></span></div>');
		} else {
			$(this).append('<div id="'+ sequenceId +'_count" class="nodeCount">'+ numNodes +' Steps<span class="selectCount"></span></div>');
		}
	});
	
	this.updateSelectCounts();
	
	$(window).resize(function() {
		eventManager.fire('browserResize');
	});
	eventManager.fire('browserResize');
};*/

/**
 * Generates the individual html elements that represent the given node and
 * appends them to the given element.
 * 
 * @param node - the node to represent
 * @param parentNode - the node's parent, can be null
 * @param el - the parent element that this element will append to
 * @param depth - depth (how many ancestors does it have)
 * @param pos - position in reference to its siblings (if no parent or siblings, this will be 0)
 */
/*View.prototype.generateNodeElement = function(node, parentNode, el, depth, pos){
	//create an id that represents this node's absolute position in the project/sequence
	if(parentNode){
		var absId = parentNode.id + '--' + node.id + '--' + pos;
	} else {
		var absId = 'null--' + node.id + '--' + pos;
	}
	
	//project structure validation
	// TODO: remove, simple project deprecated
	if(el.id=='existingTable' && this.simpleProject){
		if(depth>2 || (depth==1 && node.type!='sequence') || (depth==2 && node.type=='sequence')){
			this.projectStructureViolation = true;
			return;
		}
	}
	
	//create and append element representing this node
	var mainTR = createElement(document, 'tr');
	var mainDiv = null;
	if(absId.match(/null.*//*) || absId.match(/master.*//*)){
		mainDiv = createElement(document, 'div', {id: absId, onclick: 'eventManager.fire("selectClick","' + absId + '")', onMouseOver: 'eventManager.fire("checkAndSelect","' + absId + '")', onMouseOut: 'eventManager.fire("checkAndDeselect","' + absId + '")'});
	} else {
		mainDiv = createElement(document, 'div', {id: absId, onclick: 'eventManager.fire("selectClick","' + absId + '")', ondblclick: 'eventManager.fire("author", "' + absId + '----' + node.id + '")', onMouseOver: 'eventManager.fire("checkAndSelect","' + absId + '")', onMouseOut: 'eventManager.fire("checkAndDeselect","' + absId + '")'});
	}
	var taskTD = createElement(document, 'td');
	var mainTD = createElement(document, 'td');
	el.appendChild(	);
	mainTR.appendChild(taskTD);
	mainTR.appendChild(mainTD);
	
	//create space according to the depth of this node
	//var tabs = "";
	//for(var b=0;b<depth;b++){
		//tabs += this.tab;
	//}
	
	//create space according to the depth of this node
	var indent = 0;
	for(var b=0;b<depth;b++){
		indent ++;
	}
	
	//create and set title for this node along with step term and/or numbering as specified
	var titleInput = createElement(document, 'input', {id: 'titleInput_' + node.id, type: 'text', 'class':'nodeTitleInput', onchange: 'eventManager.fire("nodeTitleChanged","' + node.id + '")', title: 'Click to Edit Step Name', value: node.getTitle()});
	//var taskDiv = createElement(document, 'div', {id: 'taskDiv_' + node.id, 'class': 'taskDiv'});
	//taskTD.appendChild(taskDiv);
	mainTD.appendChild(mainDiv);
	
	if(node.type=='sequence'){
		var seqTitleDiv = createElement(document, 'div', {id: 'seqTitleDiv_' + absId});
		if(absId.match(/null.*//*)){
			var titleText = document.createTextNode('Activity: ');
		} else {
			var titleText = document.createTextNode('Activity ' + this.currentSeqNum + ': ');
			this.currentSeqNum++;
		}
		var choiceDiv = createElement(document, 'div', {id: 'choiceDiv_' + absId});
		
		mainDiv.appendChild(seqTitleDiv);
		mainDiv.appendChild(choiceDiv);
		//seqTitleDiv.innerHTML = tabs;
		if(indent>0){
			var marginlt = indent*.5 + 'em';
			$(mainDiv).css('margin-left',marginlt);
		}
		seqTitleDiv.appendChild(titleText);
		seqTitleDiv.appendChild(titleInput);
		titleInput.title = 'Click to Edit Activity Name';
		
		choiceDiv.style.display = 'none';
		choiceDiv.className = 'choice';
		
		if(this.getProject().getRootNode() && node.id==this.project.getRootNode().id){
			mainDiv.className = 'projectNode master';
			mainDiv.innerHTML = 'Project Sequence <span>(Active Activities & Steps)</span>';
		} else {
			mainDiv.className = 'projectNode seq';
		}
		if(this.project.useStepLevelNumbering()){
			this.currentStepNum = 1;
		}
	} else {
		//the html for the review html
		var reviewHtml = "";
		var reviewLink = null;
		
		//check if the step is a peer or teacher review
		if(node.peerReview || node.teacherReview) {
			//get the review group number
			var reviewGroup = node.reviewGroup;
			
			//check if there was a review group number
			if(reviewGroup) {
				var peerReviewStep = null;
				var reviewPhase = '';
				var reviewType = '';

				//get the review phase 'start', 'annotate', 'revise'
				if(node.peerReview) {
					reviewPhase = node.peerReview;
					reviewType = 'P';
				} else if(node.teacherReview) {
					reviewPhase = node.teacherReview;
					reviewType = 'T';
				}
				
				//set the phase number 1, 2, 3
				if(reviewPhase == 'start') {
					peerReviewStep = 1;
				} else if(reviewPhase == 'annotate') {
					peerReviewStep = 2;
				} else if(reviewPhase == 'revise') {
					peerReviewStep = 3;
				}
				
				if(peerReviewStep) {
					//make the review group class so we can obtain the elements in the group easily in the future
					var peerReviewGroupClass = "reviewGroup" + reviewGroup;
					
					//create a p element that will display the review label (e.g. PR1.1, PR1.2, PR1.3)
					reviewHtml = "<p class='" + peerReviewGroupClass + " reviewLabel' style='display:inline'>" + reviewType + "R" + reviewGroup + "." + peerReviewStep + "</p>";
					
					reviewLink = createElement(document, 'a', {'class': 'reviewLink ' + peerReviewGroupClass, id: 'reviewLink_' + reviewGroup, value: 'Delete Review Sequence', onclick: 'eventManager.fire("cancelReviewSequence",' + reviewGroup + ')'});
					//set the tabs to just one &nbsp since we now display the p element to the left of the step
					//tabs = "&nbsp;";
				}
			}
		}
		if(node.getNodeClass() && node.getNodeClass()!='null' && node.getNodeClass()!=''){
			var nodeIconPath = this.nodeIconPaths[node.type];
			//mainDiv.innerHTML = reviewHtml + tabs + '<img src=\'' + iconUrl + node.getNodeClass() + '16.png\'/> ';
			mainDiv.innerHTML = '<img src=\'' + nodeIconPath + node.getNodeClass() + '16.png\'/> ';
		} //else {
			//mainDiv.innerHTML = reviewHtml + tabs;
			//mainDiv.innerHTML = reviewHtml;
		//}
		if(indent>0){
			var marginlt = indent*.5 + 'em';
			$(mainDiv).css('margin-left',marginlt);
		}
		
		var titletext = '';
		if(absId.match(/null.*//*)){
			var titleText = document.createTextNode(this.getProject().getStepTerm() + ': ');
		} else {
			var titleText = document.createTextNode(this.getProject().getStepTerm() + ' ' + this.getProject().getVLEPositionById(node.id) + ': ');
			this.currentStepNum++;
		}
		
		if(titleText && el.id!='unused'){
			mainDiv.appendChild(titleText);
		}
		mainDiv.appendChild(titleInput);
		mainDiv.className = 'projectNode node';
		
		//set up select for changing this node's icon
		var selectNodeText = document.createTextNode('Icon: ');
		var selectDrop = createElement(document, 'select', {id: 'nodeIcon_' + node.id, onchange: 'eventManager.fire("nodeIconUpdated","' + node.id + '")'});
		mainDiv.appendChild(selectNodeText);
		mainDiv.appendChild(selectDrop);
		
		var nodeClassesForNode = [];
		var nodeIconPath;*/

		/* check to see if current node is in nodeTypes, if not ignore so that authoring 
		 * tool will continue processing remaining nodes. Resolve duplicate nodes to the
		 * type of the node that they represent */
		/*if(node.type=='DuplicateNode'){
			nodeClassesForNode = this.nodeClasses[node.getNode().type];
			nodeIconPath = this.nodeIconPaths[node.getNode().type];
		} else {
			nodeClassesForNode = this.nodeClasses[node.type];
			nodeIconPath = this.nodeIconPaths[node.type];
		}
		
		//populate select with icons for its step type
		if(nodeClassesForNode.length > 0){
			var opt = createElement(document, 'option');
			opt.innerHTML = '';
			opt.value = '';
			selectDrop.appendChild(opt);
			
			for(var x=0; x<nodeClassesForNode.length; x++) {
				var nodeClassObj = nodeClassesForNode[x];
				var opt = createElement(document, 'option');
				opt.value = nodeClassObj.nodeClass;
				opt.innerHTML = '<img src=\'' + nodeIconPath + nodeClassObj.nodeClass + '16.png\'/> ' + nodeClassObj.nodeClassText;
				selectDrop.appendChild(opt);
				if(node.getNodeClass() == nodeClassObj.nodeClass){
					selectDrop.selectedIndex = x + 1;
				}
			}
		}*/
		
		/* add max scores input field. values will be set on retrieval of metadata */
		/*var maxScoreText = document.createTextNode('Max Score: ');
		var maxScoreInput = createElement(document, 'input', {type: 'text', 'class':'maxScoreInput', title: 'Click to Edit Maximum Score', id: 'maxScore_' + node.id, 'size':'2', onchange: 'eventManager.fire("maxScoreUpdated","'+ node.id + '")'});
		mainDiv.appendChild(createSpace());
		mainDiv.appendChild(maxScoreText);
		mainDiv.appendChild(maxScoreInput);*/
		
		/* add link to revert node to its original state when version was created
		var revertNodeLink = createElement(document, 'a', {class: 'revertNodeLink', id:'revertNode_' + node.id, value:'Revert Node', onclick: 'eventManager.fire("versionRevertNode","' + node.id + '")'});
		mainDiv.appendChild(createSpace());
		mainDiv.appendChild(revertNodeLink);
		revertNodeLink.appendChild(document.createTextNode("Revert"));*/
		
		/* Add button to reference work to student's work in other steps, if this is
		 * a duplicate node, the type should be resolved to that of the node that it
		 * represents. */
		/*if(node.type=='DuplicateNode'){
			var ndx2 = this.excludedPrevWorkNodes.indexOf(node.getNode().type);
		} else {
			var ndx2 = this.excludedPrevWorkNodes.indexOf(node.type);
		}
		
		if(ndx2==-1){
			var prevWorkLink = createElement(document, 'a', {'class': 'prevWorkLink', id: 'prevWork_' + node.id, title: 'Show Work from Preview Step', onclick: 'eventManager.fire("launchPrevWork","' + node.id + '")'});
			mainDiv.appendChild(createSpace());
			mainDiv.appendChild(prevWorkLink);
			prevWorkLink.appendChild(document.createTextNode("Show Previous Work"));
		}
		
		if(reviewLink){ // if part of review sequence, add review title and remove link
			$(mainDiv).append(reviewHtml);
			mainDiv.appendChild(reviewLink);
			reviewLink.appendChild(document.createTextNode("Delete Review Sequence"));
			$(mainDiv).addClass('reviewNode');
		}
		
		// Add edit button to open node's editing interface
		var editInput = createElement(document, 'input', {type: 'button', value:'Edit', 'class':'editNodeInput', title: 'Click to Edit Step Content', id: 'editNode_' + node.id, onclick: 'eventManager.fire("author", "' + absId + '----' + node.id + '")'});
		mainDiv.appendChild(editInput);
	}
	
	// create select checkbox for this node
	if(!$(mainDiv).hasClass('master')){
		var selectBox = createElement(document, 'input', {id:'select_' + node.id, type:'checkbox', 'class':'selectNodeInput', title:'Click to Select', onclick:'eventManager.fire("selectBoxClick","'+absId+'")'});
		$(mainDiv).prepend(selectBox);
	}*/

	/* generate the node elements for any children that this node has */
	/*for(var a=0;a<node.children.length;a++){
		this.generateNodeElement(node.children[a], node, el, depth + 1, a);
	}
};*/

/**
 * Creates the html elements necessary for authoring the currently
 * opened project.
 */
View.prototype.generateAuthoring = function(){
	var view = this,
		$parent = $('#dynamicProject');
	//$('#projectButtons button').removeAttr('disabled');
	
	//remove any old elements and clear variables
	$parent.empty();
	this.currentStepNum = 1;
	this.currentSeqNum = 1;
	
	//set up project table
	/*var tab = createElement(document, 'table', {id: 'projectTable'});
	var tHead = createElement(document, 'thead', {id: 'projectTableHead'});
	var tBod = createElement(document, 'tbody', {id: 'projectTableBody'});
	var existingRow = createElement(document, 'tr', {id: 'existingRow'});
	var unattachedSequenceRow = createElement(document, 'tr', {id: 'unattachedSequenceRow'});
	var unattachedNodeRow = createElement(document, 'tr', {id: 'unattachedNodeRow'});
	
	$parent.append(tab);
	tab.appendChild(tHead);
	tab.appendChild(tBod);
	tBod.appendChild(existingRow);
	tBod.appendChild(unattachedSequenceRow);
	tBod.appendChild(unattachedNodeRow);
	
	//generate existing project structure
	var existingTable = createElement(document, 'table', {id: 'existingTable'});
	var existingTH = createElement(document, 'thead', {id: 'existingTableHead'});
	var existingTB = createElement(document, 'tbody', {id: 'existingTableBody'});
	existingRow.appendChild(existingTable);
	existingTable.appendChild(existingTH);
	existingTable.appendChild(existingTB);*/
	
	// generate active project structure container
	var activeContainer = createElement(document,'ul',{id: 'activeContainer'});
	$parent.append(activeContainer);
	
	if(this.project.getRootNode()){
		this.generateNodeElement(this.project.getRootNode(), null, activeContainer, 0, 0);
	};
	
	//generate unattached nodes
	/*var uSeqTable = createElement(document, 'table', {id: 'unusedSequenceTable'});
	var uSeqTH = createElement(document, 'thead');
	var uSeqTB = createElement(document, 'tbody', {id: 'unusedSequenceTableBody'});
	var uSeqTR = createElement(document, 'tr', {id: 'unusedSequenceTitleRow'});
	var uSeqETD = createElement(document, 'td');
	var uSeqTD = createElement(document, 'td');
	
	unattachedSequenceRow.appendChild(uSeqTable);
	uSeqTable.appendChild(uSeqTH);
	uSeqTable.appendChild(uSeqTB);
	uSeqTB.appendChild(uSeqTR);
	uSeqTR.appendChild(uSeqETD);
	uSeqTR.appendChild(uSeqTD);
	
	var unusedSeqDiv = createElement(document, 'div', {id: 'uSeq', 'class': 'uSeq', onclick: 'eventManager.fire("selectClick","uSeq")', onMouseOver: 'eventManager.fire("checkAndSelect","uSeq")', onMouseOut: 'eventManager.fire("checkAndDeselect","uSeq")'});
	var unusedSeqText = document.createTextNode('Inactive Activities');
	var unusedSeqs = this.project.getUnattached('sequence');
	
	uSeqTD.appendChild(unusedSeqDiv);
	unusedSeqDiv.appendChild(unusedSeqText);
	unusedSeqDiv.innerHTML += ' <span>(Not Shown in Project)</span>';
	for(var d=0;d<unusedSeqs.length;d++){
		this.generateNodeElement(unusedSeqs[d], null, uSeqTB, 0, 0);
	};
	
	var uNodeTable = createElement(document, 'table', {id: 'unusedNodeTable'});
	var uNodeTH = createElement(document, 'thead');
	var uNodeTB = createElement(document, 'tbody', {id: 'unusedNodeTableBody'});
	var uNodeTR = createElement(document, 'tr', {id: 'unusedNodeTitleRow'});
	var uNodeETD = createElement(document, 'td');
	var uNodeTD = createElement(document, 'td');
	
	unattachedNodeRow.appendChild(uNodeTable);
	uNodeTable.appendChild(uNodeTH);
	uNodeTable.appendChild(uNodeTB);
	uNodeTB.appendChild(uNodeTR);
	uNodeTR.appendChild(uNodeETD);
	uNodeTR.appendChild(uNodeTD);
	
	var unusedNodeDiv = createElement(document, 'div', {id: 'uNode', onclick: 'eventManager.fire("selectClick","uNode")', onMouseOver: 'eventManager.fire("checkAndSelect","uNode")', onMouseOut: 'eventManager.fire("checkAndDeselect","uNode")'});
	var unusedNodesText = document.createTextNode('Inactive Steps');
	var unusedNodes = this.project.getUnattached('node');
	
	uNodeTD.appendChild(unusedNodeDiv);
	unusedNodeDiv.appendChild(unusedNodesText);
	unusedNodeDiv.innerHTML += ' <span>(Not Shown in Project)</span>';
	for(var e=0;e<unusedNodes.length;e++){
		this.generateNodeElement(unusedNodes[e], null, uNodeTB, 0, 0);
	};*/
	
	//notify user if any of their project violates their project structure mode and
	//advise to fix it in advanced structure mode if it does.
	// TODO: remove/update once new project structure is implemented
	if(this.projectStructureViolation){
		this.notificationManager.notify("The current project mode is Simple Project, but while generating the authoring, " +
				"nodes have been found that violate that structure (Project-->Activity-->Step). Those nodes have been " +
				"ignored! You should fix this by either authoring in Advanced Project mode or switching to Advanced " +
				"Project mode long enough to put the project in the structure required for Simple Project.", 3);
	};
	
	// make sequences sortable
	$('#activeContainer').sortable({
		placeholder:'dragTarget',
		tolerance:'pointer',
		revert:100,
		opacity:.9
	});
	
	// show number of nodes per sequence
	$('#dynamicProject .seq').each(function(){
		view.initSequence(this);
	});
	
	this.updateSelectCounts();
	
	$(window).resize(function() {
		eventManager.fire('browserResize');
	});
	eventManager.fire('browserResize');
};

/**
 * Initializes new sequence DOM elements
 * @param target DOM element containing sequence contents
 */
View.prototype.initSequence = function(target){
	var seq = $(target), view = this;
	/*seq.draggable({
		handle: '.sequenceTitle'
	});*/
	var split = seq.attr('id').split('--');
	var sequenceId = split[1];
	var numNodes = $('[id^='+sequenceId+']').length;
	if(numNodes==1){
		seq.append('<div id="'+ sequenceId +'_count" class="nodeCount"><span class="toggle">'+ numNodes +' Step +</span><span class="selectCount"></span></div>');
	} else {
		seq.append('<div id="'+ sequenceId +'_count" class="nodeCount"><span class="toggle">'+ numNodes +' Steps +</span><span class="selectCount"></span></div>');
		if(numNodes>3){
			$('.more',seq).show();
		}
	}
	
	$('li.node',seq).each(function(index){
		if(index>2){
			$(this).addClass('extra');
		}
	});
	
	$('.nodeCount .toggle', seq).off('click');
	$('.nodeCount .toggle', seq).on('click',function(){
		if(seq.hasClass('selected')){
			view.toggleSequence(target,false);
		} else {
			view.toggleSequence(target,true);
		}
	});
	
	seq.off('dblclick');
	seq.on('dblclick',function(){
		if(seq.hasClass('selected')){
			view.toggleSequence(target,false);
		} else {
			view.toggleSequence(target,true);
		}
	});
};

View.prototype.toggleSequence = function(target,expand){
	var view = this,
		doExpand = (expand===true) ? true : false,
		seq = $(target);
	
	if(doExpand){
		seq.addClass('selected');
		var toggleText = $('.nodeCount .toggle',seq).html().replace('+','-');
		$('.nodeCount .toggle',seq).html(toggleText);
		$('.more',seq).slideUp(250);
		$('li.node.extra',seq).each(function(){
			$(this).slideDown(250);
		});
		$('ul.sequence',seq).sortable({
			placeholder: 'placeholder'
		});
		seq.siblings().each(function(){
			view.toggleSequence(this,false);
		});
	} else {
		seq.removeClass('selected');
		var toggleText = $('.nodeCount .toggle',seq).html().replace('-','+');
		$('.nodeCount .toggle',seq).html(toggleText);
		var numNodes = $('li.node',seq).length;
		if(numNodes>3){
			$('.more',seq).slideDown(250);
		}
		$('li.node.extra',seq).each(function(){
			$(this).slideUp(250);
		});
		$('ul.sequence',seq).sortable('destroy');
	}
};

/**
 * Generates the individual html elements that represent the given node and
 * appends them to the given element.
 * 
 * @param node - the node to represent
 * @param parentNode - the node's parent, can be null
 * @param el - the parent element that this element will append to
 * @param depth - depth (how many ancestors does it have)
 * @param pos - position in reference to its siblings (if no parent or siblings, this will be 0)
 */
View.prototype.generateNodeElement = function(node, parentNode, el, depth, pos){
	//create an id that represents this node's absolute position in the project/sequence
	var absId = parentNode ? parentNode.id + '--' + node.id + '--' + pos : 'null--' + node.id + '--' + pos;
	var title = node.getTitle();
	var targetEl = el;
	
	//project structure validation
	// TODO: update/remove when new project structure is implemented
	if(el.id=='activeContainer' && this.simpleProject){
		if(depth>2 || (depth==1 && node.type!='sequence') || (depth==2 && node.type=='sequence')){
			this.projectStructureViolation = true;
			return;
		}
	}
	
	//create and append element representing this node
	//var mainTR = createElement(document, 'tr');
	//var mainDiv = null;
	
	//create space according to the depth of this node
	/*var tabs = "";
	for(var b=0;b<depth;b++){
		tabs += this.tab;
	}*/
	
	//create space according to the depth of this node
	// TODO: remove
	var indent = 0;
	for(var b=0;b<depth;b++){
		indent ++;
	}
	
	//create and set title for this node along with step term and/or numbering as specified
	//var titleInput = createElement(document, 'input', {id: 'titleInput_' + node.id, type: 'text', 'class':'nodeTitleInput', onchange: 'eventManager.fire("nodeTitleChanged","' + node.id + '")', title: 'Click to Edit Step Name', value: node.getTitle()});
	//var taskDiv = createElement(document, 'div', {id: 'taskDiv_' + node.id, 'class': 'taskDiv'});
	//taskTD.appendChild(taskDiv);
	//mainTD.appendChild(mainDiv);
	
	if(node.type=='sequence' && (this.getProject().getRootNode() && node.id!=this.project.getRootNode().id)){
		var sequenceEl = createElement(document, 'li', {id: absId, 'class': 'projectNode seq'}),
			seqTitleEl = createElement(document, 'div', {id: 'seqTitle_' + absId, 'class': 'sequenceTitle'});
		//var seqTitleDiv = createElement(document, 'div', {id: 'seqTitleDiv_' + absId});
		var titleText = 'Activity';
		if(absId.match(/null.*/)){
			titleText += ': ';
		} else {
			titleText += ' ' + this.currentSeqNum + ': ';
			this.currentSeqNum++;
		}
		$(seqTitleEl).text(titleText + ' ' + title);
		$(sequenceEl).append(seqTitleEl);
		var seqUl = createElement(document, 'ul', {id: 'seqContents_' + absId, 'class': 'sequence'});
		var moreDiv = createElement(document, 'div', {'class': 'more'});
		$(moreDiv).html('...');
		$(sequenceEl).append(seqUl).append(moreDiv);
		
		$(el).append(sequenceEl);
		//var choiceDiv = createElement(document, 'div', {id: 'choiceDiv_' + absId});
		
		//mainDiv.appendChild(seqTitleDiv);
		//mainDiv.appendChild(choiceDiv);
		//seqTitleDiv.innerHTML = tabs;
		//if(indent>0){
			//var marginlt = indent*.5 + 'em';
			//$(mainDiv).css('margin-left',marginlt);
		//}
		//seqTitleDiv.appendChild(titleText);
		//seqTitleDiv.appendChild(titleInput);
		//titleInput.title = 'Click to Edit Activity Name';
		
		//choiceDiv.style.display = 'none';
		//choiceDiv.className = 'choice';
		
		//mainDiv.className = 'projectNode seq';
		
		if(this.project.useStepLevelNumbering()){
			this.currentStepNum = 1;
		}
		
		targetEl = seqUl;
	} else if(!absId.match(/null.*/)) {
		var nodeEl = createElement(document, 'li', {id: absId, 'class': 'projectNode node'}),
			nodeTitleEl = createElement(document, 'span', {id: 'nodeTitle_' + absId});
		
		//the html for the review html
		var reviewHtml = "",
			reviewLink = null;
		
		//check if the step is a peer or teacher review
		if(node.peerReview || node.teacherReview) {
			//get the review group number
			var reviewGroup = node.reviewGroup;
			
			//check if there was a review group number
			if(reviewGroup) {
				var peerReviewStep = null;
				var reviewPhase = '';
				var reviewType = '';

				//get the review phase 'start', 'annotate', 'revise'
				if(node.peerReview) {
					reviewPhase = node.peerReview;
					reviewType = 'P';
				} else if(node.teacherReview) {
					reviewPhase = node.teacherReview;
					reviewType = 'T';
				}
				
				//set the phase number 1, 2, 3
				if(reviewPhase == 'start') {
					peerReviewStep = 1;
				} else if(reviewPhase == 'annotate') {
					peerReviewStep = 2;
				} else if(reviewPhase == 'revise') {
					peerReviewStep = 3;
				}
				
				if(peerReviewStep) {
					//make the review group class so we can obtain the elements in the group easily in the future
					var peerReviewGroupClass = "reviewGroup" + reviewGroup;
					
					//create a p element that will display the review label (e.g. PR1.1, PR1.2, PR1.3)
					reviewHtml = "<p class='" + peerReviewGroupClass + " reviewLabel' style='display:inline'>" + reviewType + "R" + reviewGroup + "." + peerReviewStep + "</p>";
					
					reviewLink = createElement(document, 'a', {'class': 'reviewLink ' + peerReviewGroupClass, id: 'reviewLink_' + reviewGroup, value: 'Delete Review Sequence', onclick: 'eventManager.fire("cancelReviewSequence",' + reviewGroup + ')'});
					//set the tabs to just one &nbsp since we now display the p element to the left of the step
					//tabs = "&nbsp;";
				}
			}
		}
		
		var nodeIconPath = null;
		if(node.getNodeClass() && node.getNodeClass()!='null' && node.getNodeClass()!=''){
			nodeIconPath = this.nodeIconPaths[node.type];
			$(nodeEl).append('<img src=\'' + nodeIconPath + node.getNodeClass() + '16.png\'/>');
			//mainDiv.innerHTML = reviewHtml + tabs + '<img src=\'' + iconUrl + node.getNodeClass() + '16.png\'/> ';
			//mainDiv.innerHTML = '<img src=\'' + nodeIconPath + node.getNodeClass() + '16.png\'/> ';
		} //else {
			//mainDiv.innerHTML = reviewHtml + tabs;
			//mainDiv.innerHTML = reviewHtml;
		//}
		//if(indent>0){
			//var marginlt = indent*.5 + 'em';
			//$(mainDiv).css('margin-left',marginlt);
		//}
		
		var titleText = '';
		if(el.id!='unused'){
			if(absId.match(/null.*/)){
				titleText = this.getProject().getStepTerm() + ': ';
			} else {
				titleText = this.getProject().getStepTerm() + ' ' + this.getProject().getVLEPositionById(node.id) + ': ';
				this.currentStepNum++;
			}
		}
		
		$(nodeTitleEl).text(title);
		$(nodeEl).append(titleText).append(nodeTitleEl);
		
		//mainDiv.appendChild(titleInput);
		//mainDiv.className = 'projectNode node';
		
		//set up select for changing this node's icon
		/*var selectNodeText = document.createTextNode('Icon: ');
		var selectDrop = createElement(document, 'select', {id: 'nodeIcon_' + node.id, onchange: 'eventManager.fire("nodeIconUpdated","' + node.id + '")'});
		mainDiv.appendChild(selectNodeText);
		mainDiv.appendChild(selectDrop);*/
		
		var nodeClassesForNode = [];
		//var nodeIconPath;

		/* check to see if current node is in nodeTypes, if not ignore so that authoring 
		 * tool will continue processing remaining nodes. Resolve duplicate nodes to the
		 * type of the node that they represent */
		if(node.type=='DuplicateNode'){
			nodeClassesForNode = this.nodeClasses[node.getNode().type];
			nodeIconPath = this.nodeIconPaths[node.getNode().type];
		} else {
			nodeClassesForNode = this.nodeClasses[node.type];
			nodeIconPath = this.nodeIconPaths[node.type];
		}
		
		//populate select with icons for its step type
		/*if(nodeClassesForNode.length > 0){
			var opt = createElement(document, 'option');
			opt.innerHTML = '';
			opt.value = '';
			selectDrop.appendChild(opt);
			
			for(var x=0; x<nodeClassesForNode.length; x++) {
				var nodeClassObj = nodeClassesForNode[x];
				var opt = createElement(document, 'option');
				opt.value = nodeClassObj.nodeClass;
				opt.innerHTML = '<img src=\'' + nodeIconPath + nodeClassObj.nodeClass + '16.png\'/> ' + nodeClassObj.nodeClassText;
				selectDrop.appendChild(opt);
				if(node.getNodeClass() == nodeClassObj.nodeClass){
					selectDrop.selectedIndex = x + 1;
				}
			}
		}*/
		
		/* add max scores input field. values will be set on retrieval of metadata */
		/*var maxScoreText = document.createTextNode('Max Score: ');
		var maxScoreInput = createElement(document, 'input', {type: 'text', 'class':'maxScoreInput', title: 'Click to Edit Maximum Score', id: 'maxScore_' + node.id, 'size':'2', onchange: 'eventManager.fire("maxScoreUpdated","'+ node.id + '")'});
		mainDiv.appendChild(createSpace());
		mainDiv.appendChild(maxScoreText);
		mainDiv.appendChild(maxScoreInput);*/
		
		/* add link to revert node to its original state when version was created
		var revertNodeLink = createElement(document, 'a', {class: 'revertNodeLink', id:'revertNode_' + node.id, value:'Revert Node', onclick: 'eventManager.fire("versionRevertNode","' + node.id + '")'});
		mainDiv.appendChild(createSpace());
		mainDiv.appendChild(revertNodeLink);
		revertNodeLink.appendChild(document.createTextNode("Revert"));*/
		
		/* Add button to reference work to student's work in other steps, if this is
		 * a duplicate node, the type should be resolved to that of the node that it
		 * represents. */
		/*if(node.type=='DuplicateNode'){
			var ndx2 = this.excludedPrevWorkNodes.indexOf(node.getNode().type);
		} else {
			var ndx2 = this.excludedPrevWorkNodes.indexOf(node.type);
		}
		
		if(ndx2==-1){
			var prevWorkLink = createElement(document, 'a', {'class': 'prevWorkLink', id: 'prevWork_' + node.id, title: 'Show Work from Preview Step', onclick: 'eventManager.fire("launchPrevWork","' + node.id + '")'});
			mainDiv.appendChild(createSpace());
			mainDiv.appendChild(prevWorkLink);
			prevWorkLink.appendChild(document.createTextNode("Show Previous Work"));
		}
		
		if(reviewLink){ // if part of review sequence, add review title and remove link
			$(mainDiv).append(reviewHtml);
			mainDiv.appendChild(reviewLink);
			reviewLink.appendChild(document.createTextNode("Delete Review Sequence"));
			$(mainDiv).addClass('reviewNode');
		}
		
		// Add edit button to open node's editing interface
		var editInput = createElement(document, 'input', {type: 'button', value:'Edit', 'class':'editNodeInput', title: 'Click to Edit Step Content', id: 'editNode_' + node.id, onclick: 'eventManager.fire("author", "' + absId + '----' + node.id + '")'});
		mainDiv.appendChild(editInput);*/
		
		$(el).append(nodeEl);
	}
	
	// create select checkbox for this node
	//if(!$(mainDiv).hasClass('master')){
		//var selectBox = createElement(document, 'input', {id:'select_' + node.id, type:'checkbox', 'class':'selectNodeInput', title:'Click to Select', onclick:'eventManager.fire("selectBoxClick","'+absId+'")'});
		//$(mainDiv).prepend(selectBox);
	//}

	/* generate the node elements for any children that this node has */
	for(var a=0;a<node.children.length;a++){
		this.generateNodeElement(node.children[a], node, targetEl, depth + 1, a);
	}
};

/**
 * Changes the title of the node with the given id (@param id) in
 * the project with the value of the html element. Enforces size
 * restrictions for title length.
 */
View.prototype.nodeTitleChanged = function(id){
	var node = this.project.getNodeById(id);
	var val = document.getElementById('titleInput_' + id).value;

	if(val.length>60 && node.type!='sequence'){
		this.notificationManager.notify('Step titles cannot exceed 60 characters.', 3);
		document.getElementById('titleInput_' + id).value = val.substring(0, 60);
	} else if(val.length>50 && node.type=='sequence'){
		this.notificationManager.notify('Activity titles cannot exceed 50 characters.', 3);
		document.getElementById('titleInput_' + id).value = val.substring(0, 50);
	} else {
		/* if this node is a duplicate node, we need to update the value of the original
		 * and any other duplicates of the original, if this node is not a duplicate, we
		 * need to check for duplicates and update their values as well */
		var nodes = this.getProject().getDuplicatesOf(node.id, true);
		for(var b=0;b<nodes.length;b++){
			nodes[b].setTitle(val);
			document.getElementById('titleInput_' + nodes[b].id).value = val;
		}
		
		/* save the changes to the project file */
		this.saveProject();
	};
};

/**
 * Updates the changed project title in the current project and updates the
 * metadata, publishing changes to the portal.
 * @param newTitle String for the project's new title
 */
View.prototype.projectTitleChanged = function(newTitle){
	// update title display
	$('#projectTitle').text(newTitle);
	
	/* update metadata and save */
	this.projectMeta.title = newTitle;
	this.updateProjectMetaOnServer(true,true);
	
	/* update project and save */
	this.project.setTitle(newTitle);
	this.saveProject();
};

/**
 * Saves any changes in the project by having the project
 * regenerate the project file, incorporating any changes
 */
View.prototype.saveProject = function(){
	if(this.getProject()){
		var data = $.stringify(this.getProject().projectJSON(),null,3);
		
		var success_callback = function(text, xml, o){
			if(text!='success'){
				o.notificationManager.notify('Unable to save project to WISE server. The server or your Internet connection may be down. An alert will pop up with the project file data, copy this and paste it into a document for backup.', 3);
				alert(data);
			} else {
				o.notificationManager.notify('Project Saved.', 3);
				o.eventManager.fire('setLastEdited');
			};
		};
		
		var failure_callback = function(o, obj){
			obj.notificationManager.notify('Unable to save project to WISE server. The server or your Internet connection may be down. An alert will pop up with the project file data, copy this and paste it into a document for backup.', 3);
			alert(data);
		};
		
		this.connectionManager.request('POST', 1, this.requestUrl, {forward:'filemanager', projectId:this.portalProjectId, command: 'updateFile', fileName: this.project.getProjectFilename(), data: encodeURIComponent(data)}, success_callback, this, failure_callback);
	} else {
		this.notificationManager.notify('Please open or create a Project before attempting to save.', 3);
	};
};

/**
 * Updates the class of the node with the given id to that selected by the user
 */
View.prototype.nodeIconUpdated = function(id){
	var node = this.project.getNodeById(id);
	var select = document.getElementById('nodeIcon_' + id);
	
	/* even if this is a duplicate, setting the node class will update
	 * the original and refreshing the project will make that change visible
	 * in all duplicates. */
	node.setNodeClass(select.options[select.selectedIndex].value);
	
	this.saveProject();
	this.generateAuthoring();
	this.populateMaxScores();
};

/**
 * Updates the project's stepTerm value
 */
View.prototype.stepTermChanged = function(){
	if(this.project){
		this.project.setStepTerm(document.getElementById('stepTerm').value);
		this.saveProject();
		this.generateAuthoring();
		this.populateMaxScores();
	};
};

/**
 * Updates step numbering when step numbering option has changed
 */
View.prototype.stepNumberChanged = function(){
	var val = parseInt(document.getElementById('numberStepSelect').options[document.getElementById('numberStepSelect').selectedIndex].value);
	if(val==0){
		this.autoStepChanged();
	} else if(val==1){
		this.stepLevelChanged();
	};
};

/**
 * updates auto step labeling and project when autoStep is selected
 */
View.prototype.autoStepChanged = function(){
	if(this.project){
		this.project.setAutoStep(true);
		this.project.setStepLevelNumbering(false);
		this.saveProject();
		this.generateAuthoring();
		this.populateMaxScores();
	};
};

/**
 * updates step labeling boolean for step level numbering (1.1.2, 1.3.1 etc.)
 * when step level numbering is selected
 */
View.prototype.stepLevelChanged = function(){
	if(this.project){
		this.project.setStepLevelNumbering(true);
		this.project.setAutoStep(false);
		this.saveProject();
		this.generateAuthoring();
		this.populateMaxScores();
	};
};

/**
 * Sets appropriate variables and launches the previous work popup.
 * If this is a duplicate node, launched the previous work of the node
 * it represents.
 */
View.prototype.launchPrevWork = function(nodeId){
	showElement('previousWorkDialog');
	this.activeNode = this.project.getNodeById(nodeId).getNode(); //calling getNode gets the original node even if this is a duplicate
	
	//generate the node label e.g. "1.3: Analyze the data"
	var nodeId = this.activeNode.getNodeId();
	var nodeTitle = this.activeNode.getTitle();
	var vlePosition = this.project.getVLEPositionById(nodeId);
	var nodeLabel = vlePosition + ": " + nodeTitle;
	
	document.getElementById('nodeTitle').innerHTML = nodeLabel;
	
	this.clearCols();
	this.populateToCol();
	this.populateFromCol();
	$('#previousWorkDialog').dialog('open');
};

/**
 * Shows the create project dialog
 */
View.prototype.createNewProject = function(){
	showElement('createProjectDialog');
	$("#openProjectDialog").dialog("close");
	$('#createProjectDialog').dialog('open');
};

/**
 * Sets necessary form variables, confirms that project has been saved and
 * shows create sequence dialog.
 */
View.prototype.createNewSequence = function(){
	if(this.project){
		showElement('createSequenceDialog');
		$('#createSequenceDialog').dialog('open');
	} else {
		this.notificationManager.notify('Please open or create a Project before creating an Activity', 3);
	}
};

/**
 * Sets necessary form variables, confirms that project has been saved and
 * shows create node dialog.
 */
View.prototype.createNewNode = function(){
	if(this.project){
		showElement('createNodeDialog');
		$('#createNodeDialog').dialog('open');
	} else {
		this.notificationManager.notify('Please open or create a Project before adding a Step', 3);
	}
};

/**
 * Sets necessary form variables, confirms that project has been saved and
 * shows edit project dialog.
 */
View.prototype.editProjectFile = function(){
	if(this.getProject()){
		$('#projectText').val($.stringify(this.getProject().projectJSON(),null,3));
		showElement('editProjectFileDialog');
		$('#editProjectFileDialog').dialog('open');
	} else {
		this.notificationManager.notify('Please open or create a Project before editing the project data file.', 3);
	}
};


/**
 * Export currently-opened project as a zip file. Simply directs user to a servlet that does all the work.
 */
View.prototype.exportProject = function(params){
	if(this.project && this.portalProjectId){
		window.open("/webapp/author/project/exportproject.html?projectId=" + this.portalProjectId);
	} else {
		this.notificationManager.notify("Please open or create a project that you wish to export.", 3);
	}
};

/**
 * Launches the currently opened project in the vle.
 */
View.prototype.previewProject = function(){
	if(this.project){
		if(this.project.getStartNodeId() || confirm('Could not find a start node for the project. You can add sequences and/or nodes to remedy this. Do you still wish to preview the project (you will not see any steps)?')){
			if(this.portalProjectId){
				window.open(this.requestUrl + '?command=preview&projectId=' + this.portalProjectId);
			} else {
				window.open('vle.html', 'PreviewWindow', "toolbar=no,width=1024,height=768,menubar=no");
			}
		}
	} else {
		this.notificationManager.notify('Please open or create a Project to preview.', 3);
	}
};

/**
 * The opened vle window is ready, start the loading of the project in the vle
 * by firing the startpreview event in the given eventManager with a custom object
 * of name:value pairs that match that of the config object in the vle @see config.js
 */
View.prototype.startPreview = function(em){
	var obj = {'mode':'standaloneauthorpreview','getContentUrl':this.getProject().getUrl(),'getContentBaseUrl':this.getProject().getContentBase(),'updateAudio':this.updateAudioInVLE};
	em.fire('startVLEFromParams', obj);
	this.updateAudioInVLE = false;
};

/**
 * Retrieves the project name and sets global path and name, then
 * loads the project into the authoring tool.
 * @param id The id of the project to open (optional)
 */
View.prototype.projectOptionSelected = function(id){
	var projectId = null;
	if (typeof id == 'string'){
		projectId = id;
		projectId = parseInt(projectId);
	} else if(typeof id == 'number'){
		projectId = id;
	} else {
		//projectId = document.getElementById('selectProject').options[document.getElementById('selectProject').selectedIndex].value;
		this.notificationManager.notify('Please select a project to open.', 2);
		return;
	}

	var path = "";
	
	/* if this is a portal project, we need to set the portal variables based on the project name/id combo */
	if(this.portalUrl){
		var ndx = this.portalProjectIds.indexOf(projectId);
		if(ndx!=-1){
			this.portalProjectId = projectId;
			this.authoringBaseUrl = this.portalUrl + '?forward=filemanager&projectId=' + this.portalProjectId + '&command=retrieveFile&fileName=';
			path = this.portalProjectPaths[ndx];
		} else {
			this.portalProjectId = undefined;
			this.notificationManager.notify('Could not find corresponding portal project id when opening project!', 2);
		}
	}
	
	//if all is set, load project into authoring tool
	if(path!=null && path!=""){
		$('#projectContent').css('z-index','auto');
		// hide the welcome panel, show the loading message
		$('#projectContent').show();
		$('#projectOverlay').show();
		$('#projectLoading').show();
		$('#projectWelcome').hide();
		
		/* if a project is currently open and the authoring tool is in portal mode, notify the
		 * portal that this user is no longer working on the project */
		if(this.getProject() && this.portalUrl){
			this.notifyPortalCloseProject();
		}
		
		this.loadProject(this.authoringBaseUrl + path, this.utils.getContentBaseFromFullUrl(this.authoringBaseUrl + path), true);
		$('#openProjectDialog').dialog('close');
		
		eventManager.fire('browserResize');
	} else {
		this.notificationManager.notify('Error: could not find project path.', 2);
		return;
	}
};

/**
 * Retrieves the project name and sets global path and name, then
 * copies the project and loads it into the authoring tool.
 * @param id The id of the project to open
 */
View.prototype.copyOptionSelected = function (id){
	var view = this;
	
	var portalProjectId = id;
	/*
	 * processes the response to the request to copy a project
	 * @param t the new folder name
	 * e.g.
	 * 513
	 */
	var success = function(t,x,o){
		o.notificationManager.notify('Project Copied', 3);
		/* create new project in the portal if in portal mode */
		if(o.portalUrl){
			/*
			 * the url (first argument) is the relative project folder path
			 * e.g.
			 * /513/wise4.project.json
			 * the project file name is the same as the project file name
			 * from the project that was copied
			 */
			var index = $.inArray(parseInt(portalProjectId),o.portalProjectIds);
			var fileName = o.portalProjectPaths[index];
			var title = o.portalProjectTitles[index];
			o.createPortalProject('/' + t + fileName, title, portalProjectId);
		}
		
		$('#openProjectDialog').dialog('close');
	};
	
	/* handles a failure response to the request to copy a project */
	var failure = function(t,o){
		o.notificationManager.notify('Failed copying project on server.', 3);
	};
	
	var index = $.inArray(portalProjectId,view.portalProjectIds);
	var fileName = view.portalProjectPaths[index];
	$('#openProjectLoading .loadingText').text(view.getI18NString('authoring_dialog_copy_processing'));
	$('#openProjectOverlay').show();
	$('#openProjectLoading').show();
	view.connectionManager.request('POST',1,view.requestUrl,{forward:'filemanager',projectId:portalProjectId,command:'copyProject', fileName:fileName},success,view,failure);
};

/**
 * Retrieves an updated list of projects, either from the authoring tool
 * or the portal and shows the list in the open project dialog.
 * 
 * @param selectedTab Integer to indicate which tab should be selected by default (optional)
 * @param copyMode Boolean to specify whether we are copying a project instead of opening
 * one (default is false)
 */
View.prototype.openProject = function(selectedTab,copyMode){
	var view = this;
	
	/* wipe out old select project options and set placeholder option */
	$('#selectProject').children().remove();
	$('#selectProject').append('<option name="projectOption" value=""></option>');
	
	//initialzie jQuery UI tabs
	var tab = 0;
	if(typeof selectedTab == 'number'){
		tab = selectedTab;
	}
	$('#projectTabs').tabs({
		active:tab,
		activate: function(){
			view.setProjectListingWidths();
		}
	});
	
	/* make request to populate the project select list */
	this.retrieveProjectList(copyMode);
	
	/* show the loading div and hide the select drop down until the
	 * project list request comes back */
	//$('#openProjectForm').hide();
	//$('#loadingProjectMessageDiv').show();
	//clear out existing project lists
	$('#projectTabs .projectList').html('');
	
	// show loading overlay and message
	$('#openProjectLoading .loadingText').text(view.getI18NString('authoring_dialog_open_loading'));
	$('#openProjectOverlay').show();
	$('#openProjectLoading').show();
	
	// set height for dialog to fill window (or 500 pixels)
	this.utils.setDialogHeight($('#openProjectDialog'));
	
	var title = this.getI18NString('authoring_dialog_open_title');
	if (copyMode === true){
		title = this.getI18NString('authoring_dialog_open_titlecopy');
	}
	$('#openProjectDialog').dialog('option','title',title);
	
	/* open the dialog */
	$('#openProjectDialog').dialog('open');
	//eventManager.fire('browserResize');
};

/**
 * Opens the copy project dialog, populates the select-able projects,
 * sets hidden form elements, and shows the dialog.
 */
View.prototype.copyProject = function(){
	$("#createProjectDialog").dialog("close");
	//use the open project dialog, but with copyMode set to true
	this.openProject(0,true);
	
	/*showElement('copyProjectDialog');
	
	var doSuccess = function(list, view){
		var parent = document.getElementById('copyProjectSelect');

		while(parent.firstChild){
			parent.removeChild(parent.firstChild);
		};
		
		//parse the JSON string into a JSONArray
		var projectsArray = JSON.parse(list);
		
		//sort the array by id
		projectsArray.sort(view.sortProjectsById);
		
		//loop through all the projects
		for(var x=0; x<projectsArray.length; x++) {
			//get a project and obtain the id, path, and title
			var project = projectsArray[x];
			var projectId = project.id;
			var projectPath = project.path;
			var projectTitle = project.title;
			
			//create a drop down option for the project
			var opt = createElement(document, 'option', {name: 'copyProjectOption'});
			parent.appendChild(opt);*/
			
			/*
			 * create the text for the drop down for this project
			 * e.g.
			 * 531: Photosynthesis
			 */
			/*opt.text = projectId + ': ' + projectTitle;
			opt.value = projectId;
			opt.fileName = projectPath;
			opt.title = projectTitle;
		}
		$('#copyProjectDialog').dialog('open');
		eventManager.fire('browserResize');
	};
	
	if(this.portalUrl){
		this.connectionManager.request('GET', 1, this.requestUrl, {command: 'projectList', projectTag: 'authorableAndLibrary'}, function(t,x,o){doSuccess(t,o);}, this);
	} else {
		this.connectionManager.request('GET', 1, this.requestUrl, {command: 'projectList', 'projectPaths': this.projectPaths}, function(t,x,o){doSuccess(t,o);}, this);
	};*/
};

/**
 * Switches the project mode between Simple and Advanced and refreshes
 * the project.
 * TODO: remove, deprecated
 */
View.prototype.toggleProjectMode = function(){
	this.projectStructureViolation = false;
	
	//toggle modes and set associated text
	if(this.simpleProject){
		this.simpleProject = false;
		$('#projectModeDiv > span').text('Advanced Mode');
	} else {
		this.simpleProject = true;
		$('#projectModeDiv > span').text('Simple Mode');
	};
	//regenerate authoring if a project is open
	if(this.project){
		this.generateAuthoring();
	};
};

/**
 * Sets initial values and shows the edit project metadata dialog
 */
View.prototype.editProjectMetadata = function(){
	if(this.getProject()){
		//showElement('editProjectMetadataDialog');
		$('#projectMetadataTitle').val(this.utils.resolveNullToEmptyString(this.projectMeta.title));
		var author = $.parseJSON(this.projectMeta.author);
		$('#projectMetadataAuthor').text(this.utils.resolveNullToEmptyString(author.fullname));
		
		if(this.projectMeta.theme != null){
			this.utils.setSelectedValueById('projectMetadataTheme', this.projectMeta.theme);
		}
		var navMode = '';
		if(this.projectMeta.navMode != null){
			navMode = this.projectMeta.navMode;
		}
		var themeName = $('#projectMetadataTheme').val();
		// display selected theme
		$('#currentTheme').text($('#projectMetadataTheme option:selected').text());
		// set nav mode
		this.populateNavModes(themeName,navMode);
		
		this.utils.setSelectedValueById('projectMetadataSubject', this.utils.resolveNullToEmptyString(this.projectMeta.subject));
		document.getElementById('projectMetadataSummary').value = this.utils.resolveNullToEmptyString(this.projectMeta.summary);
		this.utils.setSelectedValueById('projectMetadataGradeRange', this.utils.resolveNullToEmptyString(this.projectMeta.gradeRange));
		this.utils.setSelectedValueById('projectMetadataTotalTime', this.utils.resolveNullToEmptyString(this.projectMeta.totalTime));
		this.utils.setSelectedValueById('projectMetadataCompTime', this.utils.resolveNullToEmptyString(this.projectMeta.compTime));
		this.utils.setSelectedValueById('projectMetadataLanguage', this.utils.resolveNullToEmptyString(this.projectMeta.language));
		document.getElementById('projectMetadataContact').value = this.utils.resolveNullToEmptyString(this.projectMeta.contact);
		
		var techReqs = this.projectMeta.techReqs;
		
		if(this.projectMeta.techReqs != null) {

			//determine if flash needs to be checked
			if(techReqs.flash) {
				$('#flash').attr('checked', true);
			}
			
			//determine if java needs to be checked
			if(techReqs.java) {
				$('#java').attr('checked', true);
			}
			
			//determine if quicktime needs to be checked
			if(techReqs.quickTime) {
				$('#quickTime').attr('checked', true);
			}

			//set the tech details string
			$('#projectMetadataTechDetails').attr('value', this.utils.resolveNullToEmptyString(this.projectMeta.techReqs.techDetails));
		}
		
		document.getElementById('projectMetadataLessonPlan').value = this.utils.resolveNullToEmptyString(this.projectMeta.lessonPlan);
		document.getElementById('projectMetadataStandards').value = this.utils.resolveNullToEmptyString(this.projectMeta.standards);
		document.getElementById('projectMetadataKeywords').value = this.utils.resolveNullToEmptyString(this.projectMeta.keywords);
		this.utils.setDialogHeight($('#editProjectMetadataDialog'),600);
		$('#editProjectMetadataDialog').dialog('open');
		//eventManager.fire('browserResize');
	} else {
		this.notificationManager.notify('Open a project before using this tool.', 3);
	};
};

/**
 * Shows the edit title dialog
 */
View.prototype.editTitle = function(){
	$('#editTitleDialog').dialog('open');
};

/**
 * Sets intial values and shows the edit IM Settings dialog
 */
View.prototype.editIMSettings = function(){
	// enable or disable IM settings panel
	var enableIMSettings = function(enabled){
		if(enabled) {
			$('#enableIdeaManager').prop('checked',true);
			$('#imSettings input').prop('disabled',false);
			$('#imSettings a').removeClass('disabled');
			$('#imSettings').fadeTo('fast',1);
		} else {
			$('#enableIdeaManager').prop('checked',false);
			$('#imSettings input').prop('disabled',true);
			$('#imSettings a').addClass('disabled');
			$('#imSettings').fadeTo('fast',.5);
		}
		if($('#editIMSettingsDialog').is(':visible')){
			$('#enableIdeaManager').toggleSwitch('refresh');
		}
	};
	
	// clear out validation error messages
	$('#editIMSettingsDialog label.error').remove();
	
	// initialize idea manager settings object and IM version
	var imSettings = {}, imVersion = '1', imEnabled = true;
	
	if (this.projectMeta.tools != null) {
		var tools = this.projectMeta.tools;
		
		// get whether Idea Manager is enabled
		if(typeof tools.isIdeaManagerEnabled != 'undefined'){
			imEnabled = tools.isIdeaManagerEnabled;
		}
		
		// get whether public Idea Manager is enabled
		if(typeof tools.isPublicIdeaManagerEnabled != 'undefined'){
			$('#enablePublicIdeaManager').prop('checked',tools.isPublicIdeaManagerEnabled);
		}
		
		// get Idea Manager settings
		if (typeof tools.ideaManagerSettings != 'undefined'){
			imSettings = tools.ideaManagerSettings;
			if(typeof tools.ideaManagerSettings.version != 'undefined'){
				imVersion = tools.ideaManagerSettings;
			}
		}
	}
	
	if(this.projectHasRun && parseInt(imVersion) < 2){
		// notify user that project uses old version of IM and has run in classroom, so settings cannot be changed
		
		// disable IM settings panel
		$('#ideaManagerSettings :input').prop('disabled',true);
		$('#ideaManagerSettings .delete').off('click.imSettings');
	} else {
		// bind click action for enable IM checkbox
		$('#enableIdeaManager').on('click.imSettings',function(){
			enableIMSettings($(this).prop('checked'));
		});
		
		// since project hasn't run with IM v1, we can use IM v2 for this project from now on
		imVersion = '2';
		// set version as attribute of enable IM checkbox (will be read and stored when saving project metadata)
		$('#enableIdeaManager').attr('data-version',imVersion);
		
		// show run warning text if project has been run in classroom, vice versa
		this.projectHasRun ? $('#imRunWarning').show() : $('#imRunWarning').hide();
		
		//populate Idea Manager settings
		this.populateIMSettings(imSettings);
	}
	
	enableIMSettings(imEnabled);
	
	this.utils.setDialogHeight($('#editIMSettingsDialog'),600);
	$('#editIMSettingsDialog').dialog('open');
};

/**
 * Populates Idea Manager settings fields in the authoring DOM
 * @param settings Idea Manager settings object
 */
View.prototype.populateIMSettings = function(settings){
	var view = this;
	
	// get and populate any custom labels for IM terms
	if('ideaTerm' in settings && this.utils.isNonWSString(settings.ideaTerm)) {
		$('#imIdeaTerm').val(settings.ideaTerm);
	} else {
		$('#imIdeaTerm').val(this.getI18NString('idea'));
	}
	
	if('ideaTermPlural' in settings && this.utils.isNonWSString(settings.ideaTermPlural)) {
		$('#imIdeaTermPlural').val(settings.ideaTermPlural);
	} else {
		$('#imIdeaTermPlural').val(this.getI18NString('idea_plural'));
	}
	
	if('basketTerm' in settings && this.utils.isNonWSString(settings.basketTerm)) {
		$('#imBasketTerm').val(settings.basketTerm);
	} else {
		$('#imBasketTerm').val(this.getI18NString('idea_basket'));
	}
	
	if('ebTerm' in settings && this.utils.isNonWSString(settings.ebTerm)) {
		$('#imEBTerm').val(settings.ebTerm);
	} else {
		$('#imEBTerm').val(this.getI18NString('explanation_builder'));
	}
	
	if('addIdeaTerm' in settings && this.utils.isNonWSString(settings.addIdeaTerm)) {
		$('#imAddIdeaTerm').val(settings.addIdeaTerm);
	} else {
		$('#imAddIdeaTerm').val(this.getI18NString('idea_basket_add_an_idea'));
	}
	
	// clear active idea attributes
	$('#ideaAttributes .attribute.active').each(function(){
		$(this).html('').removeClass('active').addClass('empty');
	});
	
	// get and populate idea attributes for this project
	if('ideaAttributes' in settings){
		// idea attributes have been previously set, so get and populate
		var attributes = settings.ideaAttributes;
		for(var i=0; i<attributes.length; i++){
			var type = attributes[i].type;
			var options = attributes[i].options;
			var name = attributes[i].name;
			var isRequired = attributes[i].isRequired;
			var id = attributes[i].id;
			var allowCustom = null;
			if('allowCustom' in attributes[i]){
				allowCustom = attributes[i].allowCustom;
			}
			view.addIdeaAttribute(type,options,name,isRequired,allowCustom,null,id);
		}
	} else {
		// idea attributes haven't been set, so add default attributes
		view.addIdeaAttribute('source');
		view.addIdeaAttribute('icon',null,null,false);
	}
	
	// make active attribute fields sortable
	$('#ideaAttributes').sortable({
		items:'td.attribute.active, td.attribute.empty',
		handle:'h6',
		cancel: 'h6 < a'
	});
	
	// insert add new attribute links to all unused attribute fields
	$('#ideaAttributes .attribute.empty').each(function(){
		view.deleteIdeaAttribute($(this));
	});
};

/**
 * Adds a new idea attribute to the Idea Manager settings authoring panel
 * @param type String for the type of attribute ('source', 'icon', 'tag', 'label' are allowed)
 * @param options Array of the available options for the field (optional; allowed values depend on type)
 * @param name String for the name of the attribute field (optional)
 * @param isRequired Boolean for whether the attribute field is required or not (optional; default is true)
 * @param allowCustom Boolean for whether the students can add their own custom field (optional; only applies to 'source' and 'label')
 * @param target jQuery DOM element to add new attribute content to (optional)
 * @param id String to uniquely identify the idea attribute (optional)
 */
View.prototype.addIdeaAttribute = function(type,options,name,isRequired,allowCustom,target,id){
	var view = this;
	
	function addOption(target,option){
		// create new option input and add to DOM
		var newInput = $("<div class='optionWrapper'><span class='ui-icon ui-icon-grip-dotted-vertical move'></span><input type='text' class='option' value='" + option + "' maxlength='25' /><a class='delete' title='Remove option' >X</a></div>");
		if(!Modernizr.testAllProps('boxSizing')){
			// prevent input from extending beyond parent div in old browsers
			$('input.option',newInput).css('width','auto');
		}
		$('.add', target).before(newInput);
		$('input',newInput).focus();
		
		if ($('.option', target).length > 9){
			// 10 option fields shown, so remove add more link
			$('.add', target).hide();
		}
		
		// add new item to jquery-ui sortable
		//target.sortable('refresh');
		
		// bind delete link click event
		$('.delete',newInput).on('click.imSettings',function(){
			if($(this).hasClass('disabled')) return;
			
			if($('.option', target).length == 2){
				alert('You must specify at least two (2) options for this attribute.');
				return;
			}
			newInput.fadeOut(function(){
				$(this).remove();
				//if($('.option', target).length < 10){
					// show add option link
					$('.add', target).fadeIn();
				//}
			});
		});
	};
	
	// check for unused attribute elements
	if($('#ideaAttributes .attribute.empty').length > 0){
		// there are empty attribute fields, so we can add another
		
		// get target param if provided or next unused attribute element
		var newAttribute = null;
		if(target){
			newAttribute = target;
		} else {
			newAttribute = $('#ideaAttributes .attribute.empty').eq(0);
		}
		
		// if id param wasn't sent, generate unique id for new attribute
		if(!id || typeof id != 'string'){
			id = view.utils.generateKey();
		}
		
		var count = 0;
		var header = null, choices = null;
		// set header depending on attribute type
		if(type=='source'){
			header = $("<h6><span class='ui-icon ui-icon-grip-dotted-vertical move'></span><span>Source</span><a class='action delete tooltip' title='Delete attribute'>X</a></h6>");
		} else if (type=='icon'){
			header = $("<h6><span class='ui-icon ui-icon-grip-dotted-vertical move'></span><span>Icon</span><a class='action delete tooltip' title='Delete attribute'>X</a></h6>");
		} else if (type=='tags'){
			header = $("<h6><span class='ui-icon ui-icon-grip-dotted-vertical move'></span><span>Tags</span><a class='action delete tooltip' title='Delete attribute'>X</a></h6>");
		} else if (type=='label'){
			header = $("<h6><span class='ui-icon ui-icon-grip-dotted-vertical move'></span><span>Label</span><a class='action delete tooltip' title='Delete attribute'>X</a></h6>");
		}
		
		if(type=='source' || type=='tags' || type=='label'){
			choices = $(document.createElement('div')).addClass('options').attr('id','options_' + id);
			if(type=='tags'){
				choices.append('<p>Options<span class="details">(students can choose any)</span>:</p>');
			} else {
				choices.append('<p>Options<span class="details">(students choose 1)</span>:</p>');
			}
			
			// insert add more link and bind click
			var moreLink = $("<p class='add'><a>Add more +</a></p>");
			choices.append(moreLink);
			$('a',moreLink).on('click.imSettings',function(){
				if($(this).hasClass('disabled')) return;
				addOption(choices,'');
			});
			
			// insert saved options
			if(options && options.length > 0){
				for(var i=0;i<options.length;i++){
					if(typeof options[i] == 'string' && count<11){
						addOption(choices,options[i]);
						count++;
					}
				}
			}
			
			if (count == 0){
				// no valid options were set, so add default options
				var defaults = [];
				if(type=='source'){
					defaults = ['Evidence Step','Visualization or Model','Movie/Video','Everyday Observation','School or Teacher'];
				} else if(type=='tags'){
					defaults = ['Tag1','Tag2'];
					
				} else if(type=='label'){
					defaults = ['Label1','Label2'];
				}
				for(var a=0;a<defaults.length;a++){
					addOption(choices,defaults[a]);
				}
			} else if (count == 1){
				// only one option was set, so add a default second option (minimum of two options allowed for these attribute types)
				var choice = '';
				if(type=='source'){
					choice = 'Source2';
				} else if (type=='tags'){
					choice = 'Tag2';
				} else if (type=='label'){
					choice = 'Label2';
				}
				addOption(choices,choice);
			}
			
			// make options sortable
			choices.sortable({
				items: '.optionWrapper',
				handle: 'span.move'
			});
		} else if(type=='icon'){
			choices = $(document.createElement('div')).addClass('options').attr('id','options_' + id);
			choices.append('<p>Options<span class="details">(students choose 1)</span>:</p>');
			var icons = {'blank':'None','important':'Important','question':'Not Sure','check':'Check','favorite':'Favorite','star_empty':'Star Empty','star_half':'Star Half Full','star_full':'Star Full'};
			for(key in icons){
				var option = $("<div class='optionWrapper'><input type='checkbox' class='option' value='" + key + "' /><img class='icon' src='images/ideaManager/" + key + ".png' alt='" + key + "' />" + icons[key] + "</div>");
				choices.append(option);
				if(options && options.length > 0){
					for(var i=0;i<options.length;i++){
						if(options[i] == key){
							$('.option',option).prop('checked',true);
						}
					}
				} else {
					if(key=='blank' || key=='important' || key=='question'){
						$('.option',option).prop('checked',true);
					}
				}
			}
		}
		
		if(header && choices){
			// options have been set and type is valid, so populate new attribute element
			// create name input
			var fieldName = view.utils.capitalize(type);
			if(typeof name == 'string' && view.utils.isNonWSString(name)){
				fieldName = name;
			}
			var nameElement = $(document.createElement('p'));
			var nameInput = $(createElement(document, 'input', {type: 'text', id: 'fieldName_' + id, name: 'fieldName_' + id, value: fieldName})).addClass('fieldName').addClass('required').attr('maxlength','25');
			nameElement.append(document.createTextNode('Field Name:')).append(nameInput);
			
			// create required checkbox
			var required = $(document.createElement('p'));
			var requiredCheck = $(createElement(document, 'input', {type: 'checkbox', id: 'required_' + id})).attr('checked','checked').css('margin-left','0');
			required.append(requiredCheck).append(document.createTextNode('This field is required'));
			if(isRequired == false){
				requiredCheck.prop('checked',false);
			}
			
			// clear new attribute element and add id
			newAttribute.html('').attr('id','attribute_' + id);
			
			// add header and choices to new attribute element
			newAttribute.append(header).append(choices);
			// add name inptu and required toggles to DOM
			header.after(nameElement);
			nameElement.after(required);
			
			if(type=='source' || type=='label'){
				// create allow custom field checkbox
				var custom = $(document.createElement('p'));
				var customCheck = $(createElement(document, 'input', {type: 'checkbox', id: 'custom_' + id})).css('margin-left','0');
				custom.append(customCheck).append(document.createTextNode('Allow students specify their own ' + type));;
				if(allowCustom == true){
					customCheck.prop('checked',true);
				}
				// add custom field checkbox to attribute element
				newAttribute.append(custom);
			}
			// remove empty class and add active class
			newAttribute.removeClass('empty').addClass('active').attr('data-type',type);
			
			// bind attribute delete link click event (with confirm dialog)
			$('.delete', header).on('click.imSettings',function(){
				if($(this).hasClass('disabled')) return;
				var answer = confirm('Are you sure you want to permanently delete this attribute?');
				if (answer){
					// do delete
					view.deleteIdeaAttribute($(this).parent().parent());
				}
			});
			
			view.insertTooltips(newAttribute);
		} else {
			// header & choices elements not defined so type is not allowed, fire error notification
			this.notificationManager.notify('Error adding idea attribute. Invalid type.', 2);
		}
	} else {
		// there are no unused attribute elements left, so fire error notification
		this.notificationManager.notify('Error adding idea attribute. Too many attributes specified.', 2);
	}
};

/**
 * Clears specified attribute DOM element and inserts add new attribute links
 * @param target jQuery DOM element
 */
View.prototype.deleteIdeaAttribute = function(target){
	var view = this;
	
	// clear content
	target.html('').removeClass('active').addClass('empty').removeAttr('id');
	
	// create new attribute links
	var newLinks = $(document.createElement('div')).addClass('newLinks');
	newLinks.append('<h6>Add new attribute +</h6>');
	var container = $(document.createElement('ul'));
	container.append('<li><a name="source">Source</a></li><li><a name="label">Label</a></li><li><a name="icon">Icon</a></li><li><a name="tags">Tags</a></li>');
	newLinks.append(container);
	
	// add new attribute links to DOM element
	target.append(newLinks);
	
	// bind click actions to new links
	$('a',container).click(function(){
		var type = $(this).attr('name');
		var isRequired = false;
		if(type=='source' || type=='label'){
			isRequired = true;
		}
		view.addIdeaAttribute(type,null,null,isRequired,null,target);
	});
};

/**
 * Called each time a project is loaded to set necessary variables
 * and generates the authoring for this project.
 */
View.prototype.onProjectLoaded = function(){
	if(this.cleanMode){
		this.retrieveMetaData();
		this.retrieveProjectRunStatus();
		eventManager.fire('cleanProject');
	} else {
		this.projectStructureViolation = false;
		if(this.selectModeEngaged){
			this.disengageSelectMode(-1);
		};
	
		/*if(this.project && this.project.useStepLevelNumbering()==true){
			//document.getElementById('stepLevel').checked = true;
			document.getElementById('numberStepSelect').options[1].selected = true;
		} else {
			//document.getElementById('stepLevel').checked = false;
			document.getElementById('numberStepSelect').options[0].selected = true;
		};*/
	
		if(this.project && this.project.getStepTerm()){
			document.getElementById('stepTerm').value = this.project.getStepTerm();
		} else {
			document.getElementById('stepTerm').value = '';
			this.project.setStepTerm('');
			this.notificationManager.notify('stepTerm not set in project, setting default value: \"\"', 2);
		};
	
		// reset logging level checkbox (default to checked, high post level)
		$('#loggingToggle').prop('checked',true);
		//document.getElementById('postLevelSelect').selectedIndex = 0;
		
		$('#projectInfo input[type="checkbox"]').toggleSwitch('destroy');
		$('#projectInfo input[type="checkbox"]').toggleSwitch();
	
		// if we're in portal mode, tell the portal that we've opened this project
		if (this.portalUrl) {
			this.notifyPortalOpenProject(this.project.getContentBase(), this.project.getProjectFilename());
		}
		
		var title = '';
		if(this.project.getTitle()){
			title = this.project.getTitle();
		} else {
			title = this.project.getProjectFilename().substring(0, this.project.getProjectFilename().lastIndexOf('.project.json'));
			this.project.setTitle(title);
		};
		
		// reset thumbnail, toggle as favorite link, hide project info inputs, show project info input display text
		$('#projectThumb').attr('src','');
		$('a.bookmark',$('#projectContent')).removeClass('true');
		$('#projectInfo input').hide();
		$('#projectInfo .inputDisplay').show();
		
		// insert title
		//$('#titleInput').val(title);
		$('#projectTitle').text(title);

		// insert project id
		$('#projectId').text(this.getI18NString("ID") + ': ' + this.portalProjectId);
		$('a.bookmark',$("#projectInfo")).attr('data-projectid',this.portalProjectId);
		
		this.populateThemes();
	
		this.generateAuthoring();
	
		this.retrieveMetaData();
		
		this.retrieveProjectInfo();
		
		this.retrieveProjectRunStatus();
		
		//add these two params to the config
		this.getConfig().setConfigParam('getContentUrl', this.getProject().getUrl());
		this.getConfig().setConfigParam('getContentBaseUrl', this.getProject().getContentBase());
	
		if(this.placeNode){
			this.placeNewNode(this.placeNodeId);
		}
		
		this.premadeCommentLists = null;
		
		$('#stepTerm').show(); // TODO: not sure why this is necessary
		
		eventManager.fire('browserResize');
		
		// hide loading message and show the project content panel
		$('#projectOverlay').hide();
		$('#projectLoading').hide();
		$('#projectContent').css('z-index',1);
		this.notificationManager.notify("Loaded Project ID: " + this.portalProjectId, 2);
	}
};

/**
 * Get basic info about project for authoring
 * @returns Boolean
 */
View.prototype.retrieveProjectInfo = function(){
	if(this.mode == "portal") {
		var requestParams = {
			"projectId":this.portalProjectId,
			"command":"getProjectInfo"
		};
		this.connectionManager.request('GET', 1, (this.portalUrl ? this.portalUrl : this.requestUrl), requestParams, this.retrieveProjectInfoSuccess, this, this.retrieveProjectInfoFailure);
	}
	
};

/**
 * Success callback for project info request - inserts project info into editing panel
 */
View.prototype.retrieveProjectInfoSuccess = function(text,xml,o) {
	var view = o, infoJSON = JSON.parse(text);
	var thumbUrl = infoJSON.thumbUrl,
		projectOwnerName = infoJSON.projectOwnerName,
		projectOwnerUsername = infoJSON.projectOwnerUsername,
		isLibrary = infoJSON.isLibrary,
		isFavorite = infoJSON.isFavorite,
		sharedUsers = infoJSON.sharedUsers;
	
	// check if thumb image exists, insert thumb image
	$.ajax({
	    url:thumbUrl,
	    type:'HEAD',
	    error: function(){
	    	// image doesn't exist, so use default thumb url
			$('#projectThumb').attr('src',view.defaultThumbUrl);
	    },
	    success: function(){
	    	// insert thumbnail
	    	$('#projectThumb').attr('src',thumbUrl);
	    }
	});
	
	// if project is bookmarked, add 'true' to toggle bookmark link
	if(isFavorite){
		$('a.bookmark',$("#projectInfo")).addClass('true');
	}
	
	// clear out existing shared/library icons
	$('.infoIcon').remove();
	
	// if project is shared, insert shared icon
	if(projectOwnerUsername != view.portalUsername){
		var sharedTitle = view.getI18NString("authoring_project_shared_pre") + projectOwnerName;
		$('#topProjectTools').before('<img id="sharedIcon" class="infoIcon" alt="shared" src="/vlewrapper/vle/images/icons/red/multi-agents.png" title="' + sharedTitle + '" />');
	}
	
	// if project is a library project, add library icon
	if(isLibrary){
		var libraryTitle = view.getI18NString("authoring_project_library");
		$('#topProjectTools').before('<img id="libraryIcon" class="infoIcon" alt="library project" src="/vlewrapper/vle/images/icons/red/bookmark.png" title="' + libraryTitle + '" />');
	}
	
	// insert tooltips
	view.insertTooltips($('#projectContent'));
};
	

/**
 * Failure callback for project info request
 */
function retrieveProjectInfoFailure(c,o) {
	o.notificationManager.notify('Error retrieving information for this project. Please contact WISE for assistance.', 3);
};


/**
 * Checks whether project has been run in classrooms
 * @returns Boolean
 */
View.prototype.retrieveProjectRunStatus = function(){
	if(this.mode == "portal") {
		var requestParams = {
			"projectId":this.portalProjectId,
			"command":"getNumberOfRuns"
		};
		this.connectionManager.request('GET', 1, '/webapp/teacher/projects/projectinfo.html', requestParams, this.retrieveProjectRunStatusSuccess, this, this.retrieveProjectRunStatusFailure);
	} else {
		this.projectHasRun = false;
	}
	
};

/**
 * Success callback for project run check
 */
View.prototype.retrieveProjectRunStatusSuccess = function(text,xml,o) {
	var numRuns = parseInt(text);
	if(numRuns > 0){
		o.projectHasRun = true;
	} else {
		o.projectHasRun = false;
	}
};

/**
 * Failure callback for project run check
 */
function retrieveProjectRunStatusFailure(c,o) {
	o.notificationManager.notify('Error retrieving run listing for this project. Assuming project has not been run.', 2);
	o.projectHasRun = false;
}

/**
 * Notifies portal that this user is now authoring this project
 */
View.prototype.notifyPortalOpenProject = function(projectPath, projectName) {
	var handler = function(responseText, responseXML, o){
		if (responseText != "") {
			o.notificationManager.notify(responseText + " is also editing this project right now. Please make sure not to overwrite each other's work.", 3);
			document.getElementById("concurrentAuthorDiv").innerHTML = "Also Editing: " + responseText;
			o.currentEditors = responseText;
			eventManager.fire('browserResize');
		} else {
			o.currentEditors = '';
			document.getElementById("concurrentAuthorDiv").innerHTML = "";
			eventManager.fire('browserResize');
		}
	};
	
	this.connectionManager.request('POST', 1, this.portalUrl, {command: 'notifyProjectOpen', projectId: this.portalProjectId}, handler, this);
};

/**
 * Notifies portal that this user is no longer authoring this project
 * 
 * @param boolean - sync - whether the request should be synchronous
 */
View.prototype.notifyPortalCloseProject = function(sync){
	if(this.getProject()){
		var success = function(t,x,o){
			//o.notificationManager.notify('Portal notified that project session is closed.', 3);
		};
		
		var failure = function(t,o){
			//o.notificationManager.notify('Unable to notify portal that project session is closed', 3);
		};
		this.connectionManager.request('POST', 1, this.portalUrl, {command:'notifyProjectClose', projectId: this.portalProjectId}, success, this, failure, sync);
	}
};

/**
 * Run on an interval, notifies the user when another user is also editing the
 * same project.
 */
View.prototype.getEditors = function(){
	var success = function(t,x,o){
		/* there was a change and we need to get the difference */
		if(t!=this.currentEditors){
			/* notify user of the difference */
			var diffText = o.getEditorDifferenceText(t);
			
			if(diffText && diffText!=''){
				o.notificationManager.notify(o.getEditorDifferenceText(t), 3);
			};
			
			/* update the also editing display to the current editors if any */
			if(t==''){
				document.getElementById("concurrentAuthorDiv").innerHTML = '';
				eventManager.fire('browserResize');
			} else {
				document.getElementById("concurrentAuthorDiv").innerHTML = "Also Editing: " + t;
				eventManager.fire('browserResize');
			};
			
			/* set the current editors to the new response */
			o.currentEditors = t;
		};
	};
	
	/* only request if a project is currently opened */
	if(this.getProject()){
		this.connectionManager.request('POST', 1 ,this.portalUrl, {command:'getEditors', projectId: this.portalProjectId, path: this.getProject().getUrl()}, success, this);
	};
};

/**
 * Returns the appropriate string based on the new given text of editors and the
 * current editors.
 * 
 * @param text
 * @return
 */
View.prototype.getEditorDifferenceText = function(text){
	var current = this.currentEditors.split(',');
	var incoming = text.split(',');
	var diffText = '';
	
	/* remove usernames in common to get the differences */
	for(var a=current.length - 1;a>=0;a--){
		if(incoming.indexOf(current[a])!=-1){
			incoming.splice(incoming.indexOf(current[a]), 1);
			current.splice(a,1);
		};
	};
	
	/* add text for users that may have left */
	for(var b=0;b<current.length;b++){
		if(current[b]!=''){
			diffText += 'User ' + current[b] + ' is no longer working on this project.<br/>';
		};
	};
		
	/* add text for users that may have joined */
	for(var c=0;c<incoming.length;c++){
		if(incoming[c]!=''){
			diffText += 'User ' + incoming[c] + ' has started editing this project.<br/>';
		};
	};
	
	return diffText;
};

/**
 * Stops the polling interval to see who else is editing the project if it was set.
 */
View.prototype.stopEditingInterval = function(){
	if(this.editingPollInterval){
		clearInterval(this.editingPollInterval);
	}
};

/* This function is called when the user wants to author the specified node.
 * Duplicate nodes are replaced with the node that they represent */
View.prototype.author = function(nodeInfo) {
	var absId = nodeInfo.split('----')[0];
	var nodeId = nodeInfo.split('----')[1];
	
	// add editing (highlight) class to node display
	setTimeout(function(){$('#' + $.escapeId(absId)).addClass('editing');},1000);
		
	// retrieve the node from the project
	var node = this.project.getNodeById(nodeId);
	
	if(node.type=='DuplicateNode'){
		node = node.getNode();
		// replace duplicate node with the node it represents
	}
	
	// launch the authoring for the node
	if(NodeFactory.acceptedTagNames.indexOf(node.type)==-1){
		this.notificationManager.notify('No tool exists for authoring this step yet', 3);
		return;
	} else if(this.versionMasterUrl){
		//this.versioning.versionConflictCheck(nodeId);
	} else {
		this.activeNode = node;
		this.showAuthorStepDialog();
		this.setInitialAuthorStepState();
	}
};

/**
 * When a node type is selected, dynamically creates a select element
 * and option elements with icons and names for that specific nodeType.
 * The node's className is set as the value for param2 of the createNodeDialog.
 */
View.prototype.nodeTypeSelected = function(){
	var parent = document.getElementById('createNodeDiv');
	var old = document.getElementById('selectNodeIconDiv');
	var val = document.getElementById('createNodeType').options[document.getElementById('createNodeType').selectedIndex].value;
	
	if(old){
		parent.removeChild(old);
	};
	
	if(val && val!=""){
		var nodeIconPath = this.nodeIconPaths[val];
		var nodeClassesForNode = this.nodeClasses[val];
		
		var selectDiv = createElement(document, 'div', {id: 'selectNodeIconDiv'});
		var selectText = document.createTextNode('Select an Icon:');
		var select = createElement(document, 'select', {id: 'selectNodeIcon', name: 'param2'});
		
		for(var x=0;x<nodeClassesForNode.length;x++){
			var nodeClassObj = nodeClassesForNode[x];
			var opt = createElement(document, 'option', {name: 'nodeClassOption'});
			opt.value = nodeClassObj.nodeClass;
			opt.innerHTML = '<img src=\'' + nodeIconPath + nodeClassObj.nodeClass + '16.png\'/> ' + nodeClassObj.nodeClassText;
			
			select.appendChild(opt);
		};
		
		//the div that will contain the description of the step type
		var descriptionDiv = createElement(document, 'div', {id: 'selectNodeDescription'});
		
		//the actual text that contains the description, this will initially be set to the default description
		var descriptionText = "Description not provided";
		
		//get the constructor for the chosen step type
		var nodeConstructor = NodeFactory.nodeConstructors[val];
		
		if(nodeConstructor != null) {
			//the constructor exists
			if(NodeFactory.nodeConstructors[val].authoringToolDescription != null &&
					NodeFactory.nodeConstructors[val].authoringToolDescription != "") {
				//get the description text
				descriptionText = NodeFactory.nodeConstructors[val].authoringToolDescription;			
			}
		}
		
		//create a text node with the description
		var descriptionTextNode = document.createTextNode('Description: ' + descriptionText);
		
		//add the text node to the description div
		descriptionDiv.appendChild(descriptionTextNode);
		
		//add all the elements to the select div
		selectDiv.appendChild(selectText);
		selectDiv.appendChild(select);
		selectDiv.appendChild(createElement(document, 'br'));
		selectDiv.appendChild(createElement(document, 'br'));
		selectDiv.appendChild(descriptionDiv);
		
		//add the select div to the select dialog
		parent.appendChild(selectDiv);
	};
};

/**
 * Populates and shows the node selector dialog and attachs
 * the given events to the select and cancel buttons.
 */
View.prototype.populateNodeSelector = function(event, cancelEvent){
	var parent = document.getElementById('nodeSelectDiv');
	var COLORS = ['blue','red','purple','green','yellow','black','white','silver'];
	
	/* clear any old select elements */
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	}
	
	/* create new node select element */
	var select = createElement(document, 'select', {id:'nodeSelectorSelect'});
	parent.appendChild(select);
	
	/* create color select element */
	var colorSelect = createElement(document, 'select', {id:'colorSelectorSelect'});
	parent.appendChild(colorSelect);
	
	/* parse project from root node and add option for each node in project */
	var addOption = function(node, select){
		/* if this node is a sequence node, add all of its children */
		if(node.type=='sequence'){
			for(var a=0;a<node.children.length;a++){
				addOption(node.children[a], select);
			}
		} else {
			var opt = createElement(document, 'option', {id:node.id});
			opt.value = node.view.getProject().getPositionById(node.id);
			opt.text = node.title;
			
			select.appendChild(opt);
		}
	};
	
	addOption(this.getProject().getRootNode(), select);
	
	/* add colors to the color selector */
	for(var b=0;b<COLORS.length;b++){
		var opt = createElement(document, 'option');
		opt.value = COLORS[b];
		opt.text = COLORS[b];
		
		colorSelect.appendChild(opt);
	}
	
	
	/* add the buttons */
	var selectButt = createElement(document, 'input', {type:'button', value:'Create Link', onclick:'eventManager.fire(\'' + event + '\')'});
	var cancelButt = createElement(document, 'input', {type:'button', value:'Cancel', onclick:'eventManager.fire(\'' + cancelEvent + '\')'});
	parent.appendChild(createBreak());
	parent.appendChild(createBreak());
	parent.appendChild(selectButt);
	parent.appendChild(cancelButt);
	
	/* show the dialog */
	showElement('nodeSelectorDialog');
	$('#nodeSelectorDialog').dialog('open');
};

/**
 * Called whenever the author window is scrolled
 */
View.prototype.authorWindowScrolled = function() {
	//see if there is a msgDiv
	if(document.msgDiv) {
		//modify the vertical position so the msgDiv is always displayed at the top of the screen
		document.msgDiv.style.top = (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
	}
};

/**
 * Fires the pageRenderComplete event whenever the preview frame is loaded.
 */
View.prototype.onPreviewFrameLoad = function(){
	if(this.activeNode){
		this.eventManager.fire('pageRenderComplete', this.activeNode.id);
	}
};

/**
 * Returns the activeNode (the node step currently being authored) if one
 * is active, returns null otherwise.
 * 
 * @return Node || null - activeNode
 */
View.prototype.getCurrentNode = function(){
	return (this.activeNode ? this.activeNode : null);
};

/**
 * Cleans up before exiting the authoring tool.
 * @param logout whether to log out the user
 */
View.prototype.onWindowUnload = function(logout){
	//this.stopEditingInterval();
	this.notifyPortalCloseProject(true);

	if(logout === true) {
		//log out the user
		window.top.location = "/webapp/j_spring_security_logout";		
	}
};

/**
 * Retrieves and populates the project list for the open project dialog.
 * @param copyMode Boolean to specify whether we are opening the copy dialog instead of the open dialog
 */
View.prototype.retrieveProjectList = function(copyMode){
	//this.connectionManager.request('GET', 1, (this.portalUrl ? this.portalUrl : this.requestUrl), {command: 'projectList', projectTag: 'authorable', 'projectPaths': this.projectPaths}, this.retrieveProjectListSuccess, this, this.retrieveProjectListFailure);
	if(copyMode === true){
		this.connectionManager.request('GET', 1, (this.portalUrl ? this.portalUrl : this.requestUrl), {command: 'projectList', 'projectPaths': this.projectPaths, 'listMode': 'copy'}, this.retrieveProjectListSuccess, {thisView: this, copyMode: true}, this.retrieveProjectListFailure);
	} else {
		this.connectionManager.request('GET', 1, (this.portalUrl ? this.portalUrl : this.requestUrl), {command: 'projectList', 'projectPaths': this.projectPaths, 'listMode': ''}, this.retrieveProjectListSuccess, {thisView: this, copyMode: false}, this.retrieveProjectListFailure);
	}
};

/**
 * Retrieves and populates the project list for the welcome page.
 */
View.prototype.retrieveWelcomeProjectList = function(){
	this.connectionManager.request('GET', 1, (this.portalUrl ? this.portalUrl : this.requestUrl), {command: 'welcomeProjectList'}, this.retrieveProjectListWelcomeSuccess, this, this.retrieveProjectListFailure);
};

/**
 * Processes the response and populates the project list with the response
 * from the server for a project list.
 */
View.prototype.retrieveProjectListSuccess = function(t,x,o){
	if(o.thisView.portalUrl){
		o.thisView.populatePortalProjects(t,o.copyMode);
	} else {
		o.thisView.populateStandAloneProjects(t);
	}
};

/**
 * Processes the response and populates the project list with the response
 * from the server for the welcome page.
 */
View.prototype.retrieveProjectListWelcomeSuccess = function(t,x,o){
	if(o.portalUrl){
		o.populateWelcomeProjects(t);
	} else {
		//o.populateStandAloneProjects(t,true);
	}
};

/**
 * Notifies user of error when attempting to retrieve the project list.
 */
View.prototype.retrieveProjectListFailure = function(t,o){
	o.notificationManager.notify('Error when attempting to retrieve project list.', 3);
};

/**
 * Populates the open project dialog with projects retrieved from the portal.
 * 
 * @param t
 * @param copyMode Boolean to indicate whether user is copying a project (instead of opening one)
 * @return
 */
View.prototype.populatePortalProjects = function(t,copyMode){
	var view = this;
	
	//parse the JSON string into a JSONArray
	var projectsArray = JSON.parse(t);
	
	//sort the array by id (descending)
	projectsArray.sort(this.sortProjectsById);
	
	//variables to hold total number of favorite, owned, and shared projects
	var numFave = 0, numOwned = 0, numShared = 0, numLibrary = 0; //numAll = 0;
	//arrays to hold string segments for each project listing
	var favoriteSegments = [], ownedSegments = [], sharedSegments = [], librarySegments = []; //allSegments = [];
	//object to hold details tooltip content for each project listing
	var detailsContent = {};
	
	// pre-load i18N strings
	var createdDetailsPreText = this.getI18NString('authoring_project_created_pre'),
	createdDetailsRunPreText = this.getI18NString('authoring_project_created_pre_run'),
	runWarningShortText = this.getI18NString("authoring_project_run_warning_short"),
	openDialogSharedText = this.getI18NString('authoring_dialog_open_shared'),
	openDialogOwnedText = this.getI18NString('authoring_dialog_open_owned'),
	projectSharedPreText = this.getI18NString("authoring_project_shared_pre"),
	projectSharedUsersPreText = this.getI18NString("authoring_project_shared_users_pre"),
	projectLibraryText = this.getI18NString("authoring_project_library"),
	projectCopyLibraryPreText = this.getI18NString("authoring_project_copy_library_pre"),
	projectCopyPreText = this.getI18NString("authoring_project_copy_pre"),
	lastEditedPreText = this.getI18NString('authoring_project_last_edited_pre'),
	toggleFavoriteTitleText = this.getI18NString("authoring_toggle_favorite_title"),
	idText = this.getI18NString('ID'),
	openText = this.getI18NString("open"),
	copyText = this.getI18NString("copy");
	
	//loop through all the projects
	for(var x=projectsArray.length-1; x>-1; x--) {
		//add the fields to the appropriate arrays
		var index = $.inArray(projectId,this.portalProjectIds);
		if(index < 0){
			this.portalProjectPaths.push(projectPath);
			this.portalProjectIds.push(projectId);
			this.portalProjectTitles.push(projectTitle);
		} else {
			this.portalProjectPaths[index] = projectPath;
			this.portalProjectTitles[index] = projectTitle;
		}
		
		//get a project and obtain the id, path, and title
		var project = projectsArray[x];
		var projectId = project.id;
		var projectPath = project.path;
		var projectTitle = project.title;
		var lastEdited = project.lastEdited;
		var isFavorite = project.isFavorite, bookmarkClass = '';
		var isAuthorable = true;
		if(copyMode && !project.authorable){
			isAuthorable = false;
		}
		if(isFavorite){
			bookmarkClass = 'true ';
		}
		if(isAuthorable){
			bookmarkClass += 'authorable ';
		}
		var dateCreated = project.dateCreated;
		var projectOwner = project.projectOwnerName;
		var runId = null, hasRun = false, createdClass = '', createdPre = '';
		var createdDetails = createdDetailsPreText + ': ';
		var runDetails = '';
		if(typeof project.runId == 'number' && typeof project.isLibrary == 'boolean' && !project.isLibrary){
			hasRun = true;
			runId = project.runId;
			createdClass = 'runCopy ';
			createdPre = createdDetailsRunPreText + ' ' + runId + ': ';
			runDetails = '<p class="warning">' + runWarningShortText + '</p>';
		} else {
			createdPre = createdDetails;
		}
		var isOwned = false, iconSrc = '/vlewrapper/vle/images/icons/red/shared.png', iconAlt = openDialogSharedText;
		var sharedDetails = '', sharedUsers = '';
		if(projectOwner == this.portalUserFullname){
			isOwned = true;
			iconSrc = '/vlewrapper/vle/images/icons/teal/briefcase.png';
			iconAlt = openDialogOwnedText;
		} else {
			if(isAuthorable){
				sharedDetails = '<p class="sharedDetails">' +
					'<img alt="copy" src="/vlewrapper/vle/images/icons/red/shared.png" />' +
					projectSharedPreText + projectOwner +
					'</p>';
				
				sharedUsers = '<p class="sharedDetails sharedUsers">' +
					'<img alt="copy" src="/vlewrapper/vle/images/icons/red/shared.png" />' +
					projectSharedUsersPreText + project.sharedUsers +
					'</p>';
			}
		}
		var infoIcon = '';
		var libraryDetails = '', parentDetails = '', isLibrary = false;
		if(typeof project.isLibrary == 'boolean' && project.isLibrary){
			isLibrary = true;
			var infoTitle = projectLibraryText;
			infoIcon = '<img alt="copy" src="/vlewrapper/vle/images/icons/brown/bookmark.png" title="' + infoTitle + '">';
			libraryDetails = '<p class="libraryDetails">' +
				'<img alt="copy" src="/vlewrapper/vle/images/icons/red/bookmark.png" />' +
				infoTitle +
				'</p>';
		} else if(typeof project.parentId == 'number'){
			var infoTitle = '', titlePre = '';
			if(project.parentLibrary){
				titlePre = projectCopyLibraryPreText;
			} else {
				titlePre = projectCopyPreText;
			}
			infoTitle = titlePre + project.parentId + ' (' + project.parentTitle + ')';
			infoIcon = '<img alt="copy" src="/vlewrapper/vle/images/icons/brown/copy-item.png" title="' + infoTitle + '">';
			parentDetails = '<p class="parentDetails">' + titlePre + ' <span>' + project.parentId + ' (' + project.parentTitle + ')</span></p>';
		}
		
		var ownershipIcon = '';
		if(isAuthorable){
			ownershipIcon = '<img alt="' + iconAlt + '" title="' + iconAlt + '" src="' + iconSrc + '" />';
		}
		
		createdDetails = '<p class="' + createdClass + 'createdDetails">' + createdDetails + '<span>' + dateCreated + '</span></p>';
		
		var editedDetails = '';
		if(typeof lastEdited == 'string' && lastEdited != ''){
			editedDetails = '<p class="editDetails">' + lastEditedPreText + '<span>' + lastEdited + '</span></p>';
		}
		
		var detailsTitle = '<h3 class="titleDetails">' + projectTitle + ' <span>(' + idText + ': ' + projectId + ')</span></h3>';
		
		// insert project thumb path attribute
		var thumbUrl = '';
		if(typeof project.thumbUrl == 'string'){
			thumbUrl = project.thumbUrl; 
		} else {
			thumbUrl = view.defaultThumbUrl;
		}
		var details = $('<div><img class="projectThumb" src="' + thumbUrl + '" alt="thumb" />' + 
			'<div class="summaryInfo">' + libraryDetails + sharedDetails + createdDetails + editedDetails + parentDetails + sharedUsers + runDetails + '</div><div style="clear:both;"></div></div>');
		details.prepend(detailsTitle);
		//add to tooltip content object
		detailsContent[projectId] = details;
		//details = details.replace(/"/g,"&quot;"); // escape double quotes so that the details text can be set as the value of the tooltip attribute
		
		//set button class and value
		var buttonValue = openText;
		if(copyMode){
			buttonValue = copyText;
		}
		
		//create project listing DOM element
		var projectListing = '<div class="projectListing" data-projectid="' + projectId + '">' +
			'<input type="button" class="openProject" data-projectid="' + projectId + '" value="' + buttonValue + '" />' +
			'<div class="infoWrapper">' +
			'<div class="projectInfo">' +
			'<a class="' + bookmarkClass + 'bookmark tooltip" data-projectid="' + projectId + '" title="' +  toggleFavoriteTitleText + '" data-tooltip-offset="-2"></a>' +
			'<span class="projectTitle">' + projectTitle + '</span><span class="projectId"> (' + idText + ': ' + projectId + ')</span>' +
			ownershipIcon + infoIcon + 
			'</div>' +
			'<div class="' + createdClass + 'projectDetails">' + createdPre + dateCreated + '<img class="info" alt="more info" src="/vlewrapper/vle/images/icons/info.png" data-projectid="' + projectId + '" data-tooltip-class="info" data-tooltip-anchor="left" /></div>' +
			'</div>' +
			'</div>';
		
		if(isFavorite){
			numFave+=1;
			//add project to favorites list
			favoriteSegments.push(projectListing);
		}
		if(isOwned){
			numOwned+=1;
			//add project to owned list
			ownedSegments.push(projectListing);
		} else if (isAuthorable){
			numShared+=1;
			//add project to shared list
			sharedSegments.push(projectListing);
		}
		if(copyMode && isLibrary){
			numLibrary+=1;
			//add project to shared list
			librarySegments.push(projectListing);
		}
		//if(!copyMode && isAuthorable){
			//numAll+=1;
			//add project to view all list
			//allSegments.push(projectListing);
		//}
		
		//populate the open project dialog with entry for project
		//$('#selectProject').append('<option name="projectOption" value="' + projectId + '">' +  projectId + ': ' + projectTitle +'</option>');
	}
	
	//populate the project tabs
	$('#favoriteProjects').append(favoriteSegments.join(""));
	$('#ownedProjects').append(ownedSegments.join(""));
	$('#sharedProjects').append(sharedSegments.join(""));
	if(copyMode){
		$('#libraryProjects').append(librarySegments.join(""));
	}// else {
		//$('#allProjects').append(allSegments.join(""));
	//}
	
	var projectTabs = $('#projectTabs');
	
	// insert project thumbs into project details content
	$('img.info',projectTabs).each(function(){
		var id = $(this).attr('data-projectid'),
			content = detailsContent[id],
			imgsrc = $('img.projectThumb',content).attr('src');
		
		if(imgsrc != view.defaultThumbUrl){
			$.ajax({
			    url:imgsrc,
			    type:'HEAD',
			    error: function(){
			    	// image doesn't load, so use default thumb and insert details content as info icon tooltip
					$('img.projectThumb',content).attr('src',view.defaultThumbUrl);
					var infoImg = $('img.info[data-projectid="' + id + '"]',projectTabs);
					infoImg.attr('title',content.html()).addClass('tooltip').attr('data-tooltip-class','info').attr('data-tooltip-anchor','left');
					//initialize tooltip
					view.insertTooltips(infoImg);
			    },
			    success: function(){
			    	// image loads, so insert details content as info icon tooltip
					var infoImg = $('img.info[data-projectid="' + id + '"]',projectTabs);
					infoImg.attr('title',content.html()).addClass('tooltip').attr('data-tooltip-class','info').attr('data-tooltip-anchor','left');
					// initialize tooltip
					view.insertTooltips(infoImg);
			    }
			});
		}
	});
	
	// bind open project button clicks
	projectTabs.off('click','.openProject');
	projectTabs.on('click','.openProject',function(){
		var id = $(this).attr('data-projectid');
		if(copyMode){
			eventManager.fire('copyProjectSelected',id);
		} else {
			eventManager.fire('projectSelected',id);
		}
	});
	
	//bind toggle bookmark link clicks
	projectTabs.off('click','a.bookmark');
	projectTabs.on('click','a.bookmark',function(){
		$(this).tipTip('hide');
		var id = $(this).attr('data-projectid');
		var isBookmark = $(this).hasClass('true');
		view.toggleBookmark(id, isBookmark, function(id,isBookmark){
			var authorableChange = 0;
			var isAuthorable = $('a.bookmark[data-projectid="' + id + '"]', projectTabs).hasClass('authorable');
			if(isBookmark){
				//remove project entry from favorites tab
				$('#favoriteProjects .projectListing[data-projectid="' + id + '"]').fadeOut(function(){$(this).remove();});
				
				//remove stars from project listings
				$('a.bookmark[data-projectid="' + id + '"]', projectTabs).each(function(){
					$(this).removeClass('true');
				});
				
				// if id matches active project, remove star from editing panel
				if(id == view.portalProjectId){
					$('a.bookmark',$('#projectContent')).removeClass('true');
				}
				
				//update favorites count
				view.portalFavorites-=1;
				if(isAuthorable){
					authorableChange = -1;
				}
			} else {
				//add stars to project listings
				$('a.bookmark[data-projectid="' + id + '"]', projectTabs).each(function(){
					$(this).addClass('true');
				});
				$('.projectListing[data-projectid="' + id + '"]', projectTabs).each(function(index){
					if(index==0){
						//create clone DOM element for project listing
						var entry = $(this).clone(), infoTitle = detailsContent[$(this).attr('data-projectid')].html();
						$('a.bookmark',entry).addClass('tooltip').attr('title',view.getI18NString("authoring_toggle_favorite_title")).attr('data-tooltip-anchor','right');
						$('img.info',entry).addClass('tooltip').attr('title',infoTitle).attr('data-tooltip-class','info').attr('data-tooltip-anchor','left');
						//add project listing to favorites tab
						$('#favoriteProjects').append(entry);
						// update tooltips for new entry
						view.insertTooltips(entry);
					}
				});
				
				// if id matches active project, add star to editing panel
				if(id == view.portalProjectId){
					$('a.bookmark',$('#projectContent')).addClass('true');
				}
				
				//update favorites count
				view.portalFavorites+=1;
				if(isAuthorable){
					authorableChange = 1;
				}
			}
			//update favorites count displays
			$('#favoriteTab').html(view.getI18NString('authoring_dialog_open_favorites') + ' (' + view.portalFavorites + ')');
			if(isAuthorable){
				var count = parseInt($('#myFavorites > .count').text()) + authorableChange;
				$('#myFavorites > .count').text(count);
			}
		});
	});
	
	//insert total numbers of projects in open project dialog tabs
	if(copyMode){
		// if we're in copy mode, insert total number of library projects
		$('#libraryTab').html(this.getI18NString('authoring_dialog_copy_library') + ' (' + numLibrary + ')');
		//$('#allTab').hide();
		$('#libraryTab').show();
	} else {
		// if we're not in copy mode, hide library tab
		//$('#allTab').html(this.getI18NString('authoring_dialog_open_all') + ' (' + numAll + ')');
		//$('#allTab').show();
		$('#libraryTab').hide();
	}
	$('#favoriteTab').html(this.getI18NString('authoring_dialog_open_favorites') + ' (' + numFave + ')');
	$('#ownedTab').html(this.getI18NString('authoring_dialog_open_owned') + ' (' + numOwned + ')');
	$('#sharedTab').html(this.getI18NString('authoring_dialog_open_shared') + ' (' + numShared + ')');
	
	
	this.portalFavorites = numFave;
	
	//set height of project tabs to fit bottom of dialog, widths of the project listing elements
	this.setProjectTabsHeight();
	this.setProjectListingWidths();
	
	// insert tooltips
	this.insertTooltips(projectTabs);
	
	this.onOpenProjectReady();
};

/**
 * Sets the height of the project tabs in the open project dialog so that it fills
 * the dialog's height
 */
View.prototype.setProjectTabsHeight = function(){
	var tabHeight = $('#openProjectDialog').height() - $('#familySelect').outerHeight();
	$('.projectList').height(tabHeight-5);
};

/**
 * Sets the widths of the project listing elements in the open project dialog so that they fit
 * the list item's width
 */
View.prototype.setProjectListingWidths = function(){
	$('.projectList:visible .projectListing').each(function(){
		var buttonWidth = $('input.openProject',$(this)).outerWidth();
		$('.infoWrapper',$(this)).css('margin-left',buttonWidth + 6);
		var infoWidth = $('.infoWrapper',$(this)).width();
		var detailsWidth = $('.projectDetails',$(this)).width();
		$('.projectInfo',$(this)).width(infoWidth-detailsWidth-20);
	});
};

/**
 * Adds or removes bookmark (favorite) for a specified project.
 * @param pID Integer that specifies id of project
 * @param isFav Boolean to identify whether the project is currently bookmarked
 * @param callback Function to run on update success (with pId and isBookmark params passed in)
 */
View.prototype.toggleBookmark = function(pID,isBookmark,callback){
	var view = this;
	$.ajax({
		type: 'get',
		url: '/webapp/teacher/projects/bookmark.html?projectId=' + pID + '&checked=' + !isBookmark,
		success: function(request){
			callback(pID,isBookmark);
		},
		error: function(request,error){
			alert(view.getI18NString('authoring_toggle_favorite_failed'));
		}
	});
};

/**
 * Populates the welcome project list with projects retrieved from the portal.
 * 
 * @param t
 * @return
 */
View.prototype.populateWelcomeProjects = function(t){
	var view = this;
	
	//parse the JSON string into a JSONObject
	var projectsObj = JSON.parse(t);
	
	//get the number of favorite, owned, and shared projects and insert in DOM
	$('#myOwned > .count').text(projectsObj.owned);
	$('#myShared > .count').text(projectsObj.shared);
	$('#myFavorites > .count').text(projectsObj.bookmarked);
	
	// set portal variables
	this.portalFavorites = projectsObj.bookmarked;
	this.portalProjectId = null;
	
	//loop through all the recently edited projects
	for(var x=0; x<projectsObj.recentProjects.length; x++) {
		//get a project and obtain the id, title, and last edited time
		var project = projectsObj.recentProjects[x];
		var projectId = project.id;
		var projectTitle = project.title;
		var projectPath = project.path;
		var lastEdited = project.lastEdited;
		
		//add the fields to the appropriate arrays
		var index = $.inArray(projectId,this.portalProjectIds);
		if(index < 0){
			this.portalProjectPaths.push(projectPath);
			this.portalProjectIds.push(projectId);
			this.portalProjectTitles.push(projectTitle);
		} else {
			this.portalProjectPaths[index] = projectPath;
			this.portalProjectTitles[index] = projectTitle;
		}
		
		var linkClass = '';
		if(x>2){
			linkClass = 'extra';
		}
		//add the current project to the recently edited projects space
		$('#recent').append('<p class="recentProject ' + linkClass + '"><a data-projectid="' + projectId + '" title="' + this.getI18NString('authoring_openlink_title') + ' ' + projectId + '">' + projectTitle + ' (' + this.getI18NString('authoring_id') + ' ' + projectId + ')' + '</a><span class="lastEdited">' + lastEdited + '</span></p>');
	}
	
	if(projectsObj.recentProjects.length > 3){
		var toggleEl = $('<p><a title="' + this.getI18NString('authoring_welcome_togglerecent_more') + '" class="tooltip more" data-tooltip-anchor="bottom" tooltip-offset="5">...</a></p>');
		$('#recent').append(toggleEl);
		$('a',toggleEl).click(function(){
			if($(this).hasClass('more')){
				$(this).removeClass('more').attr('title',view.getI18NString('authoring_welcome_togglerecent_less')).tipTip('destroy').tipTip({defaultPosition:'bottom',edgeOffset:5});
			} else {
				$(this).addClass('more').attr('title',view.getI18NString('authoring_welcome_togglerecent_more')).tipTip('destroy').tipTip({defaultPosition:'bottom',edgeOffset:5});
			}
			$('.recentProject').each(function(){
				if($(this).hasClass('extra')){
					$(this).slideToggle('fast');
				}
			});
		});
	}
	
	//bind click action to recent project links
	$('.recentProject > a').click(function(){
		var id = $(this).attr('data-projectid');
		//open selected project
		eventManager.fire("projectSelected",id);
	});
	
	//show more details text on create panel hover
	$('#myCreate').hover(
		function(){$('#myCreate > .familyDetails').fadeIn(250);},
		function(){$('#myCreate > .familyDetails').fadeOut(250);}
	);
	
	// insert tooltips
	this.insertTooltips($('#projectWelcome'));
	
	this.onOpenProjectReady();
};

/**
 * A function used by Array.sort() to sort the objects
 * by their id (descending)
 * @param project1
 * @param project2
 * @return a value less than 0 if project1 comes before project2
 * 0 if project1 and project2 are equal
 * a value greater than 0 if project1 comes after project2
 */
View.prototype.sortProjectsById = function(project1, project2) {
	var result = 0;
	
	if(project1 != null && project2 != null) {
		result = project1.id - project2.id;
	} else if(project1 == null) {
		//project1 is null so we will put it after project2
		result = 1;
	} else if(project2 == null) {
		//project2 is null so we will put it after project1
		result = -1;
	}
	
	return result;
};

/**
 * Populates the project list with projects retrieved from the filemanager.
 * 
 * @param t
 * @return
 */
View.prototype.populateStandAloneProjects = function(t){
	var projects = t.split('|');
	for(var a=0;a<projects.length;a++){
		$('#selectProject').append('<option name="projectOption" value="' + projects[a] + '">' + projects[a] + '</option>');
	}
	
	this.onOpenProjectReady();
};

/**
 * When the project list (either stand-alone or portal) is loaded, hides the 
 * loading div and shows the select project div.
 */
View.prototype.onOpenProjectReady = function(){
	//$('#loadingProjectMessageDiv').hide();
	//$('#openProjectForm').show();
	$('#openProjectOverlay').hide();
	$('#openProjectLoading').hide();
};

View.prototype.reviewUpdateProject = function() {
	
	if(this.projectMetadata != null && this.projectMetadata.parentProjectId == null) {
		/*
		 * there is no parent project id in the metadata which means there is no parent project.
		 * this means we can't update project.
		 */
		alert("This project does not have a parent so Update Project is not available.");
	} else {
		//update the project by retrieving the files from the parent project
		
		var success = function(text,xml,obj){
			//o.notificationManager.notify('Success', 3);
			//alert(t);
			var reviewResults = $.parseJSON(text);
			
			$('#reviewUpdateProjectDiv').html("");
			
			var reviewDescriptionHtml = "<div>";
			reviewDescriptionHtml += "Here is how this project will be modified when you perform the update.";
			reviewDescriptionHtml += "<br>";
			reviewDescriptionHtml += "<input type='button' value='View changed nodes' onclick='$(\".reviewUpdateNode\").hide();$(\".reviewUpdateNodeChanged\").show();' />";
			reviewDescriptionHtml += "<input type='button' value='View all nodes' onclick='$(\".reviewUpdateNode\").show();' />";
			reviewDescriptionHtml += "<hr>";
			reviewDescriptionHtml += "</div>";
			
			$('#reviewUpdateProjectDiv').append(reviewDescriptionHtml);
			
			for(var x=0; x<reviewResults.length; x++) {
				var nodeResult = reviewResults[x];
				
				var stepNumber = nodeResult.stepNumber;
				var title = nodeResult.title;
				var nodeType = nodeResult.nodeType;
				var status = nodeResult.status;
				var modified = nodeResult.modified;
				var stepOrActivity = "";
				var divClass = "";
				
				if(status != "not moved" || modified != "false") {
					//step was changed
					divClass = "class='reviewUpdateNode reviewUpdateNodeChanged'";
				} else {
					//step was not changed
					divClass = "class='reviewUpdateNode reviewUpdateNodeNotChanged'";
				}
				
				var nodeResultHtml = "<div " + divClass + ">";
				
				if(nodeType == "sequence") {
					stepOrActivity = "Activity";
				} else {
					stepOrActivity = "Step";
				}
				
				nodeResultHtml += stepOrActivity + " " + stepNumber + ": " + title;
				
				if(nodeType != "sequence") {
					nodeResultHtml += " (" + nodeType + ")";
				}
				
				nodeResultHtml += "<br>";
				
				var nodeStatus = "";
				
				//check whether the node was added, deleted, or moved
				if(status == 'added') {
					nodeStatus += "[Added]";
				} else if(status == 'deleted') {
					nodeStatus += "[Deleted]";
				} else if(status == 'moved') {
					nodeStatus += "[Moved]";
				} else if(status == 'not moved') {
					//do nothing
				}
				
				//check whether the node was modified
				if(modified == 'true') {
					nodeStatus += "[Modified]";
				} else if(modified == 'false') {
					//do nothing
				}
				
				//if nothing has changed we will display no change
				if(nodeStatus == "") {
					nodeStatus += "[No Change]";
				}
				
				nodeResultHtml += nodeStatus;
				
				//the hr between each node
				nodeResultHtml += "<hr>";
				
				nodeResultHtml += "</div>";
				
				$('#reviewUpdateProjectDiv').append(nodeResultHtml);
			}
			
			//only show the nodes that have changed
			$(".reviewUpdateNode").hide();
			$(".reviewUpdateNodeChanged").show();
			
			//display the popup dialog
			$('#reviewUpdateProjectDiv').dialog('open');
		};
		
		var failure = function(text,obj){
			//o.notificationManager.notify('Fail', 3);
		};
		
		var requestParams = {
			command: 'reviewUpdateProject',
			forward: 'filemanager',
			projectId: this.portalProjectId
		};
		
		this.connectionManager.request('POST', 1, this.portalUrl, requestParams, success, this, failure);
	}	
};

View.prototype.updateProject = function() {
	
	var answer = confirm("Are you sure you want to update the project with the latest changes from the parent project?\n\nUpdating the project may have negative consequences to student data from existing runs depending on how the project was changed.");
	
	if(answer) {
		var success = function(t,x,o){
			//o.notificationManager.notify('Success', 3);
		};
		
		var failure = function(t,o){
			//o.notificationManager.notify('Fail', 3);
		};
		
		
		var contentPath = this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase());
		
		var requestParams = {
			command: 'updateProject',
			forward: 'filemanager',
			projectId: this.portalProjectId,
			contentPath: contentPath
		};
		
		this.connectionManager.request('POST', 1, this.portalUrl, requestParams, success, this, failure);
	}
};

/**
 * Delete the project so that it will no longer show up for the logged in user.
 * This will not actually delete the project folder or content. It will only
 * set the isDeleted boolean flag in the projects database table.
 */
View.prototype.deleteProject = function() {
	//get the project title
	var projectTitle = this.project.getTitle();
	
	//get the project id
	var projectId = this.portalProjectId;
	
	//get the url for making the request to delete the project
	var deleteProjectUrl = this.getConfig().getConfigParam('deleteProjectUrl');
	
	//confirm with the user that they really want to delete the project
	var response = confirm("WARNING!!!\n\nAre you really sure you want to delete this project?\nThis will remove the project from your library and\nyou will no longer be able to see it.\n\nProject Title: " + projectTitle + "\n" + "Project Id: " + projectId + "\n\nClick 'OK' to delete the project.\nClick 'Cancel' to keep the project.");
	
	//params for making the delete project request
	var requestParams = {
		projectId:this.portalProjectId
	};
	
	if(response) {
		//the user clicked 'OK' to delete the project so we will make the request
		this.connectionManager.request('POST', 1, deleteProjectUrl, requestParams, this.deleteProjectSuccess, this, this.deleteProjectFailure);
	}
};

/**
 * The success function for deleting the project
 * @param text a string containg success or failure
 * @param xml
 * @param obj
 */
View.prototype.deleteProjectSuccess = function(text, xml, obj) {
	var thisView = obj;
	
	if(text == 'success') {
		//the project was successfully deleted
		
		//get the title and project id
		var projectTitle = thisView.project.getTitle();
		var projectId = thisView.portalProjectId;
		
		//display the success message to the user
		alert("Successfully deleted project.\n\nProject Title: " + projectTitle + "\n" + "Project Id: " + projectId + "\n\nThe Authoring Tool will now reload.");
		
		//refresh the authoring tool
		location.reload();
	} else if(text == 'failure: not owner') {
		//the user is not the owner of the project so the project was not deleted
		alert('Error: Failed to delete project.\n\nYou must be the owner to delete this project.');
	} else if(text == 'failure: invalid project id') {
		alert('Error: Failed to delete project.\n\nInvalid project id.');
	} else if(text == 'failure: project does not exist') {
		alert('Error: Failed to delete project.\n\nInvalid project id.');
	} else if(text == 'failure') {
		alert('Error: Failed to delete project.');
	}
};

/**
 * Th failure function for deleting the project
 * @param text
 * @param obj
 */
View.prototype.deleteProjectFailure = function(text, obj) {
	alert('Error: Failed to delete project.');
};

/**
 * Make the request to analyze the project
 * @param analyzeType the analyze type e.g. 'findBrokenLinksInProject' or 'findUnusedAssetsInProject'
 */
View.prototype.analyzeProject = function(analyzeType) {
	
	if(analyzeType == 'findBrokenLinksInProject') {
		/*
		 * display a popup message notifying the user that it may take 
		 * a little while to analyze the broken links in the project
		 */
		alert("Analyzing the project to find broken links may take up to\n30 seconds depending on how many links are in your project.\n\nClick 'OK' to start analyzing.");
		
		//remove the 'InProject' part from the string
		analyzeType = 'findBrokenLinks';
	} else if(analyzeType == 'findUnusedAssetsInProject') {
		//remove the 'InProject' part from the string
		analyzeType = 'findUnusedAssets';
	}
	
	//get the project id
	var projectId = this.portalProjectId;
	
	//get the url for making the request to analyze the project for broken links
	var analyzeProjectUrl = this.getConfig().getConfigParam('analyzeProjectUrl');
	
	//the params for the request
	var requestParams = {
		analyzeType:analyzeType,
		projectId:projectId,
		html:true
	};
	
	//make the request to analyze the project for broken links
	this.connectionManager.request('POST', 1, analyzeProjectUrl, requestParams, this.analyzeProjectSuccess, [this, analyzeType], this.analyzeProjectFailure);
};

/**
 * Success callback for analyzing the project
 * @param text the response text
 * @param xml
 * @param obj
 */
View.prototype.analyzeProjectSuccess = function(text, xml, obj) {
	//get the analyze type
	var analyzeType = obj[1];
	
	//change the title of the popup dialog appropriately
	if(analyzeType == 'findBrokenLinks') {
		$('#analyzeProjectDialog').dialog('option', 'title', 'Find Broken Links');
	} else if(analyzeType == 'findUnusedAssets') {
		$('#analyzeProjectDialog').dialog('option', 'title', 'Find Unused Assets');
	}
	
	//insert the text into the div
	$('#analyzeProjectDialog').html(text);
	
	//display the dialog
	$('#analyzeProjectDialog').dialog('open');
};

/**
 * Failure callback for finding broken links in the project
 * @param text
 * @param obj
 */
View.prototype.analyzeProjectFailure = function(text, obj) {
	//get the analyze type
	var analyzeType = obj[1];
	
	if(analyzeType == 'findBrokenLinks') {
		alert("Error: an error occurred while trying to find broken links in the project.");		
	} else if(analyzeType == 'findUnusedAssets') {
		alert("Error: an error occurred while trying to find unused assets in the project.");
	}
};

/**
 * Show the step type descriptions popup to the author 
 */
View.prototype.openStepTypeDescriptions = function(){
	showElement('stepTypeDescriptions');
	$('#stepTypeDescriptions').dialog('open');
};

/**
 * Populates the available themes for this VLE installation.
 */
View.prototype.populateThemes = function(){
	var themeSelect = $('#projectMetadataTheme').html('');
	for(var i=0;i<this.activeThemes.length;i++){
		var themeName = this.activeThemes[i];
		// get theme's config file
		var themepath = 'themes/' + themeName + '/';
		var configpath = themepath + 'config.json';
		$.ajax({
			dataType:'json',
			async:false,
			url: configpath,
			success: function(data){
				themeSelect.append('<option value="' + themeName + '">' + data.name + '</option>');
				// TODO: insert thumnail and screenshot
				
			},
			error: function(jqXHR,textStatus,errorThrown){
				alert('Selected VLE theme "' + themeName + '" is broken: Invalid configuration file.');
			},
			statusCode: {
				404: function(){
					alert('Selected VLE theme "' + themeName + '" is broken: Configuration file not found.');
				}
			}
		});
	}
};

/**
 * Populates the available navigation modes for selected theme
 * @param themeName the name of the theme
 * @param navMode the name of the navMode to set (optional)
 */
View.prototype.populateNavModes = function(themeName,navMode){
	var view = this;
	// get theme's config file
	var themepath = 'themes/' + themeName + '/';
	var configpath = themepath + 'config.json';
	$.ajax({
		url: configpath,
		dataType: 'json',
		success: function(data){
			// populate navModes for selected theme
			var navSelect = $('#projectMetadataNavigation').html('');
			for(var i=0;i<data.nav_modes.length;i++){
				navSelect.append('<option value="' + data.nav_modes[i].id + '">' + data.nav_modes[i].name + '</option>');
			}
			if(navMode){
				view.setNavMode(navMode);
			} else {
				// display selected (default) nav mode
				$('#currentNavMode').text($('#projectMetadataNavigation option:selected').text());
			}
		},
		error: function(jqXHR,textStatus,errorThrown){
			alert('Selected VLE theme "' + themeName + '" is broken: Invalid configuration file.');
		},
		statusCode: {
			404: function(){
				alert('Selected VLE theme "' + themeName + '" is broken: Configuration file not found.');
			}
		}
	});
};

/**
 * Sets the project's navigation mode in the project metadata dialog and project settings based
 * on the project's metadata
 * @param navMode the navigation mode identifer
 */
View.prototype.setNavMode = function(navMode){
	if(navMode != ''){
		this.utils.setSelectedValueById('projectMetadataNavigation', navMode);
		// display selected nav mode
		$('#currentNavMode').text($('#projectMetadataNavigation option:selected').text());
	}
};

/**
 * Reload the project from the server
 */
View.prototype.reloadProject = function() {
	this.loadProject(this.getProject().getContentBase() + this.utils.getSeparator(this.getProject().getContentBase()) + this.getProject().getProjectFilename(), this.getProject().getContentBase(), true);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_main.js');
};