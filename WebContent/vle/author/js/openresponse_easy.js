var xmlPage;
var saved = true;

function generatePage(){
	var parent = document.getElementById('dynamicParent');
	
	//wipe out old
	parent.removeChild(document.getElementById('dynamicPage'));
	
	//create new
	var pageDiv = createElement(document, 'div', {id:'dynamicPage'});
	var promptText = document.createTextNode("Question for Student:");
	var linesText = document.createTextNode("Size of Student Response Box (# rows):");
	
	pageDiv.appendChild(linesText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(generateLines());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(promptText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(generatePrompt());
	
	parent.appendChild(pageDiv);
};

function generateLines(){
	var lines = createElement(document, 'input', {type: 'text', id: 'linesInput', value: xmlPage.getElementsByTagName('extendedTextInteraction')[0].getAttribute('expectedLines')});
	return lines;
};

function generatePrompt(){
	var prompt = createElement(document, 'textarea', {id: 'promptInput', name: 'promptInput', cols: '85', rows: '35', wrap: 'hard', onkeyup: "sourceUpdated()"});
	if(xmlPage.getElementsByTagName('prompt')[0].firstChild){
		prompt.value = xmlPage.getElementsByTagName('prompt')[0].firstChild.nodeValue;
	} else {
		prompt.value = "";
	};
	return prompt;
};

function updateXMLPage(){
	var parent = xmlPage.getElementsByTagName('extendedTextInteraction')[0];
	var pagePrompt = xmlPage.createElement('prompt');
	var pagePromptText = xmlPage.createTextNode(document.getElementById('promptInput').value);
	
	parent.setAttribute('expectedLines', document.getElementById('linesInput').value);
	pagePrompt.appendChild(pagePromptText);
	parent.appendChild(pagePrompt);
};

/*
 * Called when 'keyup' event is received on sourceTextArea on this page.
 * gets the text in the textarea and re-renders the previewFrame
 */
function sourceUpdated() {
	saved = false;
	//retrieve the authored text
	//var xmlString = document.getElementById('sourceTextArea').value;
	var parent = xmlPage.getElementsByTagName('extendedTextInteraction')[0];
	parent.removeChild(xmlPage.getElementsByTagName('prompt')[0]);
	
	updateXMLPage();
	
	var xmlString;
	if(window.ActiveXObject) {
		xmlString = xmlPage.xml;
	} else {
		xmlString = (new XMLSerializer()).serializeToString(xmlPage);
	}
	
	window.frames["previewFrame"].loadFromXMLString(xmlString);
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/js/openresponse_easy.js");