var xmlPage;
var saved = true;
var project = window.parent.project;
var allowedGlue = new Array('MultipleChoiceNode', 'OpenResponseNode', 'HtmlNode');

function generatePage(){
	var parent = document.getElementById('dynamicParent');
	
	//wipe out old elements
	parent.removeChild(document.getElementById('dynamicPage'));
	
	//create new elements
	var pageDiv = createElement(document, 'div', {id:'dynamicPage'});
	parent.appendChild(pageDiv);
	
	var promptDiv = createElement(document, 'div', {id:'promptDiv'});
	var promptText = document.createTextNode('Edit Prompt');
	var promptInput = createElement(document, 'textarea', {id:'promptInput', cols: '75', rows: '18', wrap: 'soft', onkeyup: 'updatePrompt()'});
	
	pageDiv.appendChild(promptDiv);
	promptDiv.appendChild(promptText);
	promptDiv.appendChild(createBreak());
	promptDiv.appendChild(promptInput);
	
	promptInput.value = getPrompt();
	
	var ddTable = createElement(document, 'table', {id:'ddGlueTable', width:'100%'});
	var ddHeaderRow = createElement(document, 'tr', {id:'ddHeaderRow'});
	var ddAttachedHeadTD = createElement(document, 'td', {id:'ddAttachedHeadTD', width:'40%'});
	var ddNodesHeadTD = createElement(document, 'td', {id:'ddNodesHeadTD', width:'40%'});
	var ddTrashHeadTD = createElement(document, 'td', {id:'ddTrashHeadTD', width:'20%'});
	
	pageDiv.appendChild(ddTable);
	ddTable.appendChild(ddHeaderRow);
	ddHeaderRow.appendChild(ddAttachedHeadTD);
	ddHeaderRow.appendChild(ddNodesHeadTD);
	ddHeaderRow.appendChild(ddTrashHeadTD);
	
	ddAttachedHeadTD.innerHTML = "Add/Remove/Arrange Nodes";
	ddNodesHeadTD.innerHTML = "All Allowable Nodes";
	ddTrashHeadTD.innerHTML = "Trash Can";
	
	var ddRow = createElement(document, 'tr', {id:'ddRow'});
	var ddAttachedTD = createElement(document, 'td', {id:'ddAttachedTD'});
	var ddNodesTD = createElement(document, 'td', {id:'ddNodesTD'});
	var ddTrashTD = createElement(document, 'td', {id:'ddTrashTD'});
	
	ddTable.appendChild(ddRow);
	ddRow.appendChild(ddAttachedTD);
	ddRow.appendChild(ddNodesTD);
	ddRow.appendChild(ddTrashTD);
	
	generateAttached();
	generateNodes();
	generateTrash();
	generateGlueDD();
};

function generateAttached(){
	var parent = document.getElementById('ddAttachedTD');
	
	//remove old
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	//create new
	var attachedUL = createElement(document, 'ul', {id:'attachedUL', class:'container'});
	var attachedText = document.createTextNode('Attached Nodes:');
	var placeholder = createElement(document, 'li', {id:'placeholder'});
	var children = getChildren();
	
	parent.appendChild(attachedUL);
	attachedUL.appendChild(attachedText);
	attachedUL.appendChild(createBreak());
	attachedUL.appendChild(placeholder);
	
	for(var x=0;x<children.length;x++){
		var childId = children[x].getAttribute('ref');
		var child = createElement(document, 'li', {id:'attached_' + childId, name:'attached', class: 'draggable'});
		var childTitle = document.createTextNode(project.getNodeById(childId).title);
		attachedUL.appendChild(child);
		child.appendChild(childTitle);
	};
};

function generateNodes(){
	var parent = document.getElementById('ddNodesTD');
	
	//remove old
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	//create new
	var nodesUL = createElement(document, 'ul', {id:'nodesUL'});
	var placeholder = createElement(document, 'li', {id:'placeholder'});
	var nodes = project.allLeafNodes;
	
	parent.appendChild(nodesUL);
	nodesUL.appendChild(placeholder);
	
	for(var y=0;y<nodes.length;y++){
		if(allowedGlue.indexOf(nodes[y].type)>-1){
			var nodeId = nodes[y].id;
			var node = createElement(document, 'li', {id:'node_' + nodeId, name:'ddNodes', class:'draggable'});
			var nodeTitle = document.createTextNode(nodes[y].title);
			
			nodesUL.appendChild(node);
			node.appendChild(nodeTitle);
		};
	};
};

function generateTrash(){
	var parent = document.getElementById('ddTrashTD');
	
	var old = document.getElementById('trashDiv');
	
	if(old){
		parent.removeChild(old);
	};
	
	var trash = createElement(document, 'div', {id:'trashDiv', class:'trash'});
	
	parent.appendChild(trash);
	trash.innerHTML = 'Trash Bin';
};

function getChildren(){
	return xmlPage.getElementsByTagName('node-ref');
};

function getPrompt(){
	var promptEl = xmlPage.getElementsByTagName('prompt');
	if(promptEl[0].firstChild){
		return promptEl[0].firstChild.nodeValue;
	} else {
		return "";
	};
};

function updatePrompt(){
	var val = document.getElementById('promptInput').value;
	var promptEl = xmlPage.getElementsByTagName('prompt')[0];
	if(promptEl.firstChild){
		promptEl.firstChild.nodeValue = val;
	} else {
		promptEl.appendChild(xmlPage.createTextNode(val));
	};
	
	updatePreview();
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/js/glue_easy.js");