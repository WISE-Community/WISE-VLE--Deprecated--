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
	var parent = xmlPage.getElementsByTagName('extendedTextInteraction')[0];
	parent.removeChild(xmlPage.getElementsByTagName('prompt')[0]);
	
	updateXMLPage();
	
	window.frames["previewFrame"].loadContent([xmlPage]);
};

/**
 * Load the authoring view from the specified filename
 * filename points to a plain old file.
 */
function loadAuthoringFromFile(filename, projectName, projectPath, pathSeparator) {
	var callback =
	{
	  success: function(o) { 
	  var xmlDocToParse = o.responseXML;
	  
		/**
		 * sets local xml and then generates the left panel
		 * of this page dynamically
		 */
		xmlPage = xmlDocToParse;
		generatePage();
		
		window.frames["previewFrame"].loadContent([xmlPage]);
	  },
		  failure: function(o) { alert('failure');},
		  scope: this
	}
	
	YAHOO.util.Connect.asyncRequest('POST', '../filemanager.html', callback, 'command=retrieveFile&param1=' + projectPath + pathSeparator + filename);
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
		
		window.parent.opener.connectionManager.request('GET', 1, 'node/openresponse/openresponse.html', null,  renderAfterGet);
	};
	
	window.frames['previewFrame'].location = '../blank.html';
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/js/openresponse_easy.js");