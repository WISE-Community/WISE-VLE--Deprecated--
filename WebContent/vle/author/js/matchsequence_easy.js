var xmlPage;
var saved = true;


/**
 * Dynamically generates the page based on the current
 * state of xmlPage
 */
function generatePage(){
	var parent = document.getElementById('dynamicParent');
	
	//wipe out old elements and variables
	parent.removeChild(document.getElementById('dynamicPage'));
	
	//create new elements
	var pageDiv = createElement(document, 'div', {id:'dynamicPage'});
	var prompt = createElement(document, 'textarea', {id: 'promptArea', rows: '10', cols: '75', wrap: 'hard', onchange: 'updatePrompt()'});
	var promptText = document.createTextNode('Edit prompt:');
	var orderingDiv = createElement(document, 'div', {id: 'orderingOptions'});
	var order = createElement(document, 'input', {type: 'radio', id: 'ordered', name: 'ordered', value: true, onclick: 'updateOrdered("true")'});
	var notOrder = createElement(document, 'input', {type: 'radio', id: 'notOrdered', name: 'ordered', value: false, onclick: 'updateOrdered("false")'});
	var orderedText = document.createTextNode('Select ordering option:');
	var orderText = document.createTextNode('Choices have a specific sequential order per Target');
	var notOrderText = document.createTextNode('Choices are unordered per Target');
	var addNewButton = createElement(document, 'input', {type: 'button', id: 'addContainerButton', onclick: 'addContainer()', value: 'Add Container'});
 	var createNew = createElement(document, 'input', {type: 'button', value: 'Create New Choice', onclick: 'addChoice()'});
	var removeChoice = createElement(document, 'input', {type: 'button', value: 'Remove Choice', onclick: 'removeChoice()'});
	var removeContainerButton = createElement(document, 'input', {type: 'button', id: 'removeContainerButton', onclick: 'removeContainer()', value: 'Remove Container'});
	var editFeedback = createElement(document, 'input', {type: 'button', value: 'Edit/Create Feedback', onclick: 'editFeedback()'});
	var shuffle = createElement(document, 'input', {type: 'checkbox', id: 'shuffled', onclick: 'shuffleChanged()'});
	var shuffleText = document.createTextNode('Shuffle Choices');
	
	shuffle.checked = getShuffle();
	
	if(getOrdered()=='true'){
		order.checked = true;
	} else {
		notOrder.checked = true;
	};
	
	if(getPrompt().firstChild){
		prompt.value = getPrompt().firstChild.nodeValue;
	} else {
		prompt.value = "";
	};
	
	orderingDiv.appendChild(orderedText);
	orderingDiv.appendChild(createBreak());
	orderingDiv.appendChild(order);
	orderingDiv.appendChild(orderText);
	orderingDiv.appendChild(createBreak());
	orderingDiv.appendChild(notOrder);
	orderingDiv.appendChild(notOrderText);
	orderingDiv.appendChild(createBreak());
	orderingDiv.appendChild(createBreak());
	orderingDiv.appendChild(shuffle);
	orderingDiv.appendChild(shuffleText);
	orderingDiv.appendChild(createBreak());
	
	pageDiv.appendChild(promptText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(prompt);
	pageDiv.appendChild(orderingDiv);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(addNewButton);
	pageDiv.appendChild(removeContainerButton);
	pageDiv.appendChild(createSpace());
	pageDiv.appendChild(createSpace());
	pageDiv.appendChild(createSpace());
	pageDiv.appendChild(createNew);
	pageDiv.appendChild(removeChoice);
	pageDiv.appendChild(editFeedback);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(generateContainerTable());
	
	parent.appendChild(pageDiv);
	
	generateContainers();
};

/**
 * Returns a table element for containers and generates
 * the row element to which existing containers will be appended
 */
function generateContainerTable(){
	var containerTable = createElement(document, 'table', {id: 'containerTable'});
	var row = createElement(document, 'tr', {id: 'containerRow'});
	
	containerTable.appendChild(row);
	return containerTable;
};

/**
 * Removes previous containerSelect element (if exists) and
 * generates a new one based on the gapMultiple elements
 * defined in xmlPage
 */
 function generateContainers(){
 	var parent = document.getElementById('containerTable');
 	var gaps = getGapMultiples();
 	
 	//remove old tr elements
 	var rows = document.getElementsByName('containerRow');
 	for(var v=0;v<rows.length;v++){
 		parent.removeChild(rows[v]);
 	};
 	
 	for(var u=0;u<gaps.length;u++){
 		var row = createElement(document, 'tr', {id: 'containerRow', name: 'containerRow'});
 		row.appendChild(generateContainer(gaps[u], u));
 		parent.appendChild(row);
 	};
 };

/**
 * Given a gapMultiple element from xmlPage, generates and returns
 * a TD Element based on the container information
 */
function generateContainer(gap, index){
	var identifier = gap.getAttribute('identifier');
	var containerTD = createElement(document, 'td', {id: 'containerTD_' + identifier});
	var radioContainer = createElement(document, 'input', {type: 'radio', name: 'radioContainer', id: 'radioContainer_' + identifier, onclick: 'containerSelected("radioContainer_' + identifier + '")', value: identifier});
	var textContainer = createElement(document, 'input', {type: 'text', id: 'textContainer_' + identifier, onclick: 'containerSelected("radioContainer_' + identifier + '")', onchange: 'containerTextUpdated("' + identifier + '")'});
	var choiceDiv = createElement(document, 'div', {id: 'choiceDiv_' + identifier});
	var titleText = document.createTextNode('Title: ');
	var targetText = document.createTextNode('Target Box ' + index);
	
	if(gap.firstChild){
		textContainer.value = gap.firstChild.nodeValue;
	};
	
	containerTD.appendChild(radioContainer);
	containerTD.appendChild(targetText);
	containerTD.appendChild(createBreak());
	containerTD.appendChild(titleText);
	containerTD.appendChild(textContainer);
	containerTD.appendChild(choiceDiv);
	
	generateChoices(choiceDiv, identifier);
	
	return containerTD;
};

/**
 * Given the parent element and gapMultiple identifier
 * generates and appends the associated choices table
 */
function generateChoices(parent, gapIdentifier){
	var choiceTable = createElement(document, 'table', {id: 'choiceTable_' + gapIdentifier, border: '1'});
	var choices = getChoicesByContainerIdentifier(gapIdentifier);
	
	for(var e=0;e<choices.length;e++){
		choiceTable.appendChild(generateChoice(choices[e], gapIdentifier));
	};
	
	parent.appendChild(choiceTable);
	parent.appendChild(createBreak());
};

/**
 * Given a choice (gapText) and its associated gapIdentifier, generates
 * and returns a table row with the choice Text
 */
function generateChoice(choice, gapIdentifier){
	var identifier = choice.getAttribute('identifier');
	var row = createElement(document, 'tr', {id: 'choiceRow_'+ identifier});
	var td = createElement(document, 'td', {id: 'choiceTD_' + identifier});
	var radioChoice = createElement(document, 'input', {type: 'radio', name: 'radioChoice_' + gapIdentifier, onclick: 'choiceSelected("' + identifier + '", "' + gapIdentifier + '")', value: identifier});
	var textChoice = createElement(document, 'input', {type: 'text', id: 'textChoice_' + identifier, onclick: 'choiceSelected("' + identifier + '", "' + gapIdentifier + '")', onchange: 'choiceTextUpdated("' + identifier + '")'});
	var ordered = createElement(document, 'input', {type: 'text', size: '1', id: 'orderChoice_' + identifier, onclick: 'choiceSelected("' + identifier + '", "' + gapIdentifier + '")', onkeyup: 'orderUpdated("' + identifier + '")'});
	var textOrder = document.createTextNode('order pos:');
	
	if(choice.firstChild){
		textChoice.value = choice.firstChild.nodeValue;
	};
	
	td.appendChild(radioChoice);
	td.appendChild(textChoice);
	
	if(getOrdered()=='true'){
		ordered.value = getOrderPositionByChoiceIdentifier(identifier);
		td.appendChild(textOrder);
		td.appendChild(ordered);
	};
	
	row.appendChild(td);
	return row;
};


/**
 * Returns the prompt element in xmlPage
 */
function getPrompt(){
	return xmlPage.getElementsByTagName('prompt')[0];
};

/**
 * Updates the prompt element in xmlPage with the text
 * in prompt textarea box
 */
function updatePrompt(){
	if(getPrompt().firstChild){
		getPrompt().firstChild.nodeValue = document.getElementById('promptArea').value;
	} else {
		var text = xmlPage.createTextNode(document.getElementById('promptArea').value);
		getPrompt().appendChild(text);
	};
	updatePreview();
};

/**
 * Returns the value of the order element in xmlPage
 */
 function getOrdered(){
 	return xmlPage.getElementsByTagName('gapMatchInteraction')[0].getAttribute('ordered');
 };
 
 /**
  * Updates the order element in xmlPage with the value
  * selected by the radio inputs
  */
  function updateOrdered(val){
  	xmlPage.getElementsByTagName('gapMatchInteraction')[0].setAttribute('ordered', val);
  	generatePage();
  	updatePreview();
  };

/**
 * Selects the appropriate option button given the index
 */
 function containerSelected(index){
 	document.getElementsByName('radioContainer')[index].checked = true;
 	clearOtherChoices(getSelectedContainerIdentifier());
 };

/**
 * Selects the appropriate option button given the identifier
 */
function containerSelectedByIdentifier(identifier){
	document.getElementById('radioContainer_' + identifier).checked = true;
};
 
/**
 * Selects the appopriate option button given the choice identifier and
 * container identifier
 */
function choiceSelected(choiceId, containerId){
	var choices = document.getElementsByName('radioChoice_' + containerId);
	clearOtherChoices(containerId);
	containerSelectedByIdentifier(containerId); //ensures that associated container is also selected
	if(choices!=null && choices.length>0){
		for(var f=0;f<choices.length;f++){
			if(choices[f].value == choiceId){
				choices[f].checked = true;
			};
		};
	};
};

/**
 * Clears the selection of choices not associated
 * with this identifier
 */
function clearOtherChoices(identifier){
	var gaps = getGapMultiples();
	for(var m=0;m<gaps.length;m++){
		if(gaps[m].getAttribute('identifier')!=identifier){
			var choices = document.getElementsByName('radioChoice_' + gaps[m].getAttribute('identifier'));
			for(var n=0;n<choices.length;n++){
				choices[n].checked = false;
			};
		};
	};
};

/**
 * Updates the text of a gapMultiple element in the xmlPage
 * given the associated identifier
 */
function containerTextUpdated(identifier){
	var gap = getGapMultiple(identifier);
	if(gap.firstChild){
		gap.firstChild.nodeValue = document.getElementById('textContainer_' + identifier).value;
	} else {
		var text = xmlPage.createTextNode(document.getElementById('textContainer_' + identifier).value);
		gap.appendChild(text);
	};
	updatePreview();
};

/**
 * Updates the gapText element specified by the given identifier
 * in xmlPage when a change is detected
 */
function choiceTextUpdated(identifier){
	var choice = getChoiceByChoiceIdentifier(identifier);
	if(choice.firstChild){
		choice.firstChild.nodeValue = document.getElementById('textChoice_' + getSelectedChoiceIdentifier()).value;
	} else {
		var text = xmlPage.createTextNode(document.getElementById('textChoice_' + getSelectedChoiceIdentifier()).value);
		choice.appendChild(text);
	};
	updatePreview();
};

/**
 * Updates the value element's order attribute with the value in the orderInput
 * that is associated with the given choice identifier in xmlPage
 */
function orderUpdated(identifier){
	updateOrderPositionByChoiceIdentifier(identifier, document.getElementById('orderChoice_' + identifier).value);
	updatePreview();
};

/**
 * Returns the radio element of the corresponding selected container
 */
function getSelectedContainer(){
	var radios = document.getElementsByName('radioContainer');
	for(var g=0;g<radios.length;g++){
		if(radios[g].checked){
			return radios[g];
		};
	};
};

/**
 * Returns the identifier of the corresponding selected container
 */
function getSelectedContainerIdentifier(){
	var radio = getSelectedContainer();
	if(radio){
		return radio.value;
	};
};

/**
 * Returns the radio element corresponding to the selected choice
 */
function getSelectedChoice(){
	var choices = document.getElementsByName('radioChoice_' + getSelectedContainerIdentifier());
	for(var h=0;h<choices.length;h++){
		if(choices[h].checked){
			return choices[h];
		};
	};
};

/**
 * Returns the identifier of the corresponding selected choice
 */
function getSelectedChoiceIdentifier(){
	var choice = getSelectedChoice();
	if(choice){
		return choice.value;
	};
};

/**
 * Returns all gapMultiple elements in xmlPage
 */
function getGapMultiples(){
	return xmlPage.getElementsByTagName('gapMultiple');
};

/**
 * Returns the gapMultiple element in the xmlPage
 * that is associated with the given identifier
 */
function getGapMultiple(identifier){
	var gaps = getGapMultiples();
	for(var t=0;t<gaps.length;t++){
		if(gaps[t].getAttribute('identifier')==identifier){
			return gaps[t];
		};
	};
};

/**
 * Returns all value elements in the correctResponse element in xmlPage
 */
 function getResponseValues(){
 	return xmlPage.getElementsByTagName('correctResponse')[0].getElementsByTagName('value');
 };
 
 /**
  * Returns all value elements in the correctResponse element that
  * has a field identifier that matches the given identifier
  */
 function getResponseValuesByFieldIdentifier(identifier){
 	var allVals = getResponseValues();
 	var vals = [];
 	for(var y=0;y<allVals.length;y++){
 		if(allVals[y].getAttribute('fieldIdentifier')==identifier){
 			vals.push(allVals[y]);
 		};
 	};
 	return vals;
 };

/**
 * Returns all value elemens in the correctResponse elemnt that
 * has a choiceIdentifier that matches the given identifier
 */
function getResponseValuesByChoiceIdentifier(identifier){
	var allVals = getResponseValues();
	var vals =[];
	for(var y=0;y<allVals.length;y++){
		if(allVals[y].getAttribute('choiceIdentifier')==identifier){
			vals.push(allVals[y]);
		};
	};
	return vals;
};

/**
 * Returns the order position given a choice identifier
 */
function getOrderPositionByChoiceIdentifier(identifier){
	var vals = getResponseValuesByChoiceIdentifier(identifier);
	for(var i=0;i<vals.length;i++){
		var order = vals[i].getAttribute('order');
		if(order!=null && order!=""){
			return order;
		};
	};
};

/**
 * Updates the order position in the xmlPage given a choice identifier
 * and the order position
 */
function updateOrderPositionByChoiceIdentifier(identifier, order){
	var vals = getResponseValuesByChoiceIdentifier(identifier);
	for(var j=0;j<vals.length;j++){
		vals[j].setAttribute('order', order);
	};
};

/**
 * Returns all available choices defined in xmlPage for this
 * match sequence
 */
function getChoices(){
	return xmlPage.getElementsByTagName('gapMatchInteraction')[0].getElementsByTagName('gapText');
};

/**
 * Given an identifier, returns the choice (gap text) associated with it
 */
function getChoiceByChoiceIdentifier(identifier){
	var choices = getChoices();
	for(var a=0;a<choices.length;a++){
		if(choices[a].getAttribute('identifier')==identifier){
			return choices[a];
		};
	};
};

/**
 * Given a container identifier, returns all choices associated with it
 */
 function getChoicesByContainerIdentifier(identifier){
 	var vals = getResponseValuesByFieldIdentifier(identifier);
 	var choiceIds = [];
 	var choices = [];
 	
 	//get the choiceIdentifiers from the response values associated with the container identifier
 	for(var b=0;b<vals.length;b++){
 		var id = vals[b].getAttribute('choiceIdentifier');
 		if(id!=null && choiceIds.indexOf(id)==-1 && vals[b].getAttribute('isCorrect')=='true'){
 			choiceIds.push(id);
 		};
 	};
 	
 	//then get the choices by the found identifiers
 	for(var c=0;c<choiceIds.length;c++){
 		choices.push(getChoiceByChoiceIdentifier(choiceIds[c]));
 	};
 	
 	return choices;
 };

/**
 * Returns all value elements in xmlPage that are associated
 * with the given choice and container identifiers
 */
function getValueByChoiceAndFieldIdentifiers(choiceId, containerId){
	var vals = getResponseValuesByChoiceIdentifier(choiceId);
	for(var s=0;s<vals.length;s++){
		if(vals[s].getAttribute('fieldIdentifier')==containerId){
			return vals[s];
		};
	};
	return null;
};

/**
 * Generates and returns a unique identifier
 */
function generateUniqueIdentifier(type){
	var count = 0;
	var gaps;
	
	if(type=='gapMultiple'){
		gaps = getGapMultiples();
	} else if(type=='gapText'){
		gaps = getChoices();
	};
	
	while(true){
		var id = type + '_' + count;
		var found = false;
		for(var k=0;k<gaps.length;k++){
			if(gaps[k].getAttribute('identifier')==id){
				found = true;
			};
		};
		
		if(!found){
			return id;
		};
		
		count ++;
	};
};

/**
 * Adds a new container to xmlPage and refreshes
 */
function addContainer(){
	var parent = xmlPage.getElementsByTagName('gapMatchInteraction')[0];
	var gap = xmlPage.createElement('gapMultiple');
	var text = xmlPage.createTextNode('Enter Title Here');
	
	gap.setAttribute('identifier', generateUniqueIdentifier('gapMultiple'));
	gap.setAttribute('ordinal', 'false');
	gap.setAttribute('numberOfEntries', '0');
	gap.appendChild(text);
	
	parent.appendChild(gap);
	
	setIncorrectExistingChoices(gap.getAttribute('identifier'));
	
	generatePage();
	updatePreview();
};

/**
 * Removes the selected container and ALL references
 * to it from xmlPage and refreshes page
 */
function removeContainer(){
	var identifier = getSelectedContainerIdentifier();
	if(identifier){
		if(confirm('Removing a container also removes all associated choices, ordering, etc. This can not be undone. Are you sure you wish to continue?')){
			var vals = getResponseValuesByFieldIdentifier(identifier);
			var choices = getChoicesByContainerIdentifier(identifier);
			var gap = getGapMultiple(identifier);
			var parent = gap.parentNode;
			
			parent.removeChild(gap);
			for(var l=0;l<choices.length;l++){
				parent.removeChild(choices[l]);
			};
			
			if(vals.length>0){
				parent = vals[0].parentNode;
				for(var m=0;m<vals.length;m++){
					parent.removeChild(vals[m]);
				};
			};
			generatePage();
			updatePreview();
		};
	} else {
		alert('One of the containers must be selected before removing it');
	};
};

/**
 * Given a container identifier, adds a new choice to xmlPage and 
 * appends it to the associated container
 */
function addChoice(){
	var identifier = getSelectedContainerIdentifier();
	var gapText = xmlPage.createElement('gapText');
	var gapTextText = xmlPage.createTextNode('Enter Choice');
	var value = xmlPage.createElement('value');
	var valueText = xmlPage.createTextNode('Correct.');
	
	if(!identifier){
		alert('Please select a container in which you wish to create a new choice.');
		return;
	};
	
	gapText.setAttribute('identifier', generateUniqueIdentifier('gapText'));
	gapText.setAttribute('matchMax', '1');
	gapText.appendChild(gapTextText);
	
	xmlPage.getElementsByTagName('gapMatchInteraction')[0].appendChild(gapText);
	
	value.setAttribute('isDefault', 'false');
	value.setAttribute('isCorrect', 'true');
	value.setAttribute('choiceIdentifier', gapText.getAttribute('identifier'));
	value.setAttribute('fieldIdentifier', identifier);
	value.setAttribute('order', '0');
	value.appendChild(valueText);
	
	setIncorrectOtherContainers(gapText.getAttribute('identifier'), identifier);
	
	xmlPage.getElementsByTagName('correctResponse')[0].appendChild(value);
	generatePage();
	updatePreview();
};

/**
 * Given a choiceId and the containerId that it is associated
 * with, sets default feedback as 'Incorrect' for any other
 * containers that may exist. Used when creating a new choice.
 */
function setIncorrectOtherContainers(choiceId, containerId){
	var containers = getGapMultiples();
	
	for(var o=0;o<containers.length;o++){
		var identifier = containers[o].getAttribute('identifier');
		if(identifier!=containerId){
			createNewFeedback(choiceId, identifier);
			updateFeedback(choiceId, identifier, 'Incorrect');
		};
	};
};

/**
 * Given a container Id, sets all existing choices to default
 * as incorrect for that container. Used when creating a new container
 */
function setIncorrectExistingChoices(containerId){
	var choices = getChoices();
	
	for(var a=0;a<choices.length;a++){
		var identifier = choices[a].getAttribute('identifier');
		createNewFeedback(identifier, containerId);
		updateFeedback(identifier, containerId, 'Incorrect');
	};
};

/**
 * Removes the selected choice from xmlPage, refreshes and updates preview
 */
function removeChoice(){
	var choice = getChoiceByChoiceIdentifier(getSelectedChoiceIdentifier());
	if(choice){
		if(confirm('Removing a choice also removes all associated feedback. This can not be undone. Are you sure you wish to continue?')){
			var vals = getResponseValuesByChoiceIdentifier(choice.getAttribute('identifier'));
			var parent = choice.parentNode;
			
			parent.removeChild(choice);
			
			if(vals!=null && vals.length>0){
				parent = vals[0].parentNode;
				for(var o=0;o<vals.length;o++){
					parent.removeChild(vals[o]);
				};	
			};
			generatePage();
			updatePreview();
		};
	} else {
		alert('A choice must be selected before removing it.');
	};
};

/**
 * Opens a popup window where users can edit feedback for a selected choice
 */
function editFeedback(){
	window.open('feedback.html', 'Edit/Create Feedback', 'height=450, width=800');
};

/**
 * Given a choice identifier and a container identifier,
 * creates a new value element for feedback in xmlPage
 */
function createNewFeedback(choiceId, containerId, isCorrect){
	var parent = xmlPage.getElementsByTagName('correctResponse')[0];
	var value = xmlPage.createElement('value')
	var text = xmlPage.createTextNode("");
	
	value.setAttribute('isDefault', 'false');
	value.setAttribute('isCorrect', 'false');
	value.setAttribute('choiceIdentifier', choiceId);
	value.setAttribute('fieldIdentifier', containerId);
	
	if(getOrdered()=='true'){
		var vals = getResponseValuesByChoiceIdentifier(choiceId);
		if(vals!=null & vals.length>0){
			var order;
			for(var r=0;r<vals.length;r++){
				var foundOrder = vals[r].getAttribute('order');
				if(foundOrder!=null){
					order = foundOrder;
				};
			};
			if(order!=null){
				value.setAttribute('order', order);
			} else {
				value.setAttribute('order', '0');
			};
		} else {
			value.setAttribute('order', '0');
		};
	} else {
		value.setAttribute('order', '0');
	};
	
	value.appendChild(text);
	parent.appendChild(value);
};

/**
 * Given the choice identifier, container identifier and new text,
 * updates the associated value (feedback element) in xmlPage
 */
function updateFeedback(choiceId, containerId, text){
	var val = getValueByChoiceAndFieldIdentifiers(choiceId, containerId);
	if(val){
		if(val.firstChild){
			val.firstChild.nodeValue = text;
		} else {
			val.appendChild(xmlPage.createTextNode(text));
		};
	} else {
		alert('unable to update feedback');
	};
};

/**
 * Validates the ordering of each container when ordering is specified
 */
function validateOrdering(){
	if(getOrdered()=='true'){
		if(duplicated()){
			return false;
		} else if(!sequential()){
			return false;
		};
	} else { //ordering is not set - just return true
		return true;
	};
	return true;
};

/**
 * returns true if any of the ordering variables for any of the containers
 * is duplicated, otherwise, returns false
 */
function duplicated(){
	var containers = getGapMultiples();
	for(var t=0;t<containers.length;t++){
		var choices = getChoicesByContainerIdentifier(containers[t].getAttribute('identifier'));
		var order = [];
		for(var u=0;u<choices.length;u++){
			var orderVal = getValueByChoiceAndFieldIdentifiers(choices[u].getAttribute('identifier'), containers[t].getAttribute('identifier')).getAttribute('order');
			if(orderVal!=null){
				if(order.indexOf(orderVal)==-1){
					order.push(orderVal);
				} else {
					return true;
				};
			};
		};
	};
	return false;
};

/**
 * returns 1 if a is > b, 0 if a = b and -1 if a < b
 */
function sort(a, b){
	if(a > b){
		return 1;
	} else if (a==b){
	 	return 0;
	} else {
		return -1;
	};
};

/**
 * returns true if there is < 2 order values or if all of the values
 * are exactly 1 more than the previous
 */
function sequential(){
	var containers = getGapMultiples();
	for(var u=0;u<containers.length;u++){
		var choices = getChoicesByContainerIdentifier(containers[u].getAttribute('identifier'));
		var order = [];
		for(var v=0;v<choices.length;v++){
			var val = getValueByChoiceAndFieldIdentifiers(choices[v].getAttribute('identifier'), containers[u].getAttribute('identifier')).getAttribute('order');
			order.push(val);
		};
		order.sort(sort);
		for(var w=0;w<order.length;w++){
			if(w!=0){
				if(parseInt(order[w])!=(parseInt(order[w-1]) + 1)){
					return false;
				};
			};
		};
	};
	return true;
};

/**
 * Load the authoring view from the specified filename
 * filename points to a plain old file.
 */
function loadAuthoringFromFile(filename, projectName, projectPath, pathSeparator) {
	var callback =
	{
	  success: function(o) { 
		var xmlDoc=loadXMLDocFromString(o.responseText);
		
		/*
		 * set the xmlPage to use for editing dynamically
		 */
		xmlPage = xmlDoc;
		generatePage();
	
		//retrieve the xmlString from the mcObj
		var xmlString;
		var customCheck;
		if(window.ActiveXObject) {
			xmlString = xmlDoc.getElementsByTagName('assessmentItem')[0].xml;
			if(xmlDoc.getElementsByTagName('customCheck')[0]!=null){
				customCheck = xmlDoc.getElementsByTagName('customCheck')[0].firstChild.nodeValue;
			};
		} else {
			xmlString = (new XMLSerializer()).serializeToString(xmlDoc.getElementsByTagName('assessmentItem')[0]);
			if(xmlDoc.getElementsByTagName('customCheck')[0]!=null){
				customCheck = xmlDoc.getElementsByTagName('customCheck')[0].firstChild.nodeValue;
			};
		}
		if(customCheck==undefined || customCheck==''){
			customCheck=null;
		};
		
		window.frames["previewFrame"].loadContent(xmlString, customCheck);

		  },
		  failure: function(o) { alert('failure');},
		  scope: this
	}

	YAHOO.util.Connect.asyncRequest('POST', '../filemanager.html', callback, 'command=retrieveFile&param1=' + projectPath + pathSeparator + filename);
}

/**
 * Returns a boolean, whether or not to shuffle choices when displaying
 */
function getShuffle(){
	if(xmlPage.getElementsByTagName('gapMatchInteraction')[0].getAttribute('shuffle')=='true'){
		return true;
	} else {
		return false;
	};
};

function shuffleChanged(){
	xmlPage.getElementsByTagName('gapMatchInteraction')[0].setAttribute('shuffle', document.getElementById('shuffled').checked);
	updatePreview();
};

/**
 * Updates the preview portion with the modifications in xmlPage
 */
 function updatePreview(){
 	saved = false;
 	var customCheck;
 	var xmlString;
 	
 	if(window.ActiveXObject) {
		xmlString = xmlPage.getElementsByTagName('assessmentItem')[0].xml;
	} else {
		xmlString = (new XMLSerializer()).serializeToString(xmlPage.getElementsByTagName('assessmentItem')[0]);
	};
	
	if(xmlPage.getElementsByTagName('customCheck')[0]!=null){
		customCheck = xmlPage.getElementsByTagName('customCheck')[0].firstChild.nodeValue;
	};
	
	if(customCheck==undefined || customCheck==''){
		customCheck=null;
	};
	
	window.frames["previewFrame"].loadContent(xmlString, customCheck);
 };

function loaded(){
	//set frame source to blank and create page dynamically
	window.allReady = function(){
		var renderAfterGet = function(text, xml){
			var frm = window.frames["previewFrame"];
			
			frm.document.open();
			frm.document.write(window.parent.opener.injectVleUrl(text));
			frm.document.close();
			
			frm.loadAuthoring = function(){
				window.parent.childSave = save;
				window.parent.getSaved = getSaved;
				loadAuthoringFromFile(window.parent.filename, window.parent.projectName, window.parent.projectPath, window.parent.pathSeparator);
			};
		};
		
		window.parent.opener.connectionManager.request('GET', 1, 'node/matchsequence/matchsequence.html', null,  renderAfterGet);
	};
	
	window.frames['previewFrame'].location = '../blank.html';
};
 
//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/js/matchsequence_easy.js");