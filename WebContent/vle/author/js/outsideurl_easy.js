var xmlPage;
var saved = true;


function generatePage(){
	var parent = document.getElementById('dynamicParent');
	
	//wipe out old
	parent.removeChild(document.getElementById('dynamicPage'));
	
	//create new
	var pageDiv = createElement(document, 'div', {id:'dynamicPage'});
	var urlText = document.createTextNode('Enter/Edit URL: ');
	if(xmlPage.getElementsByTagName('url')[0].firstChild){
		var val = xmlPage.getElementsByTagName('url')[0].firstChild.nodeValue;
	} else {
		var val = "";
	};
	var urlInput = createElement(document, 'input', {type: 'text', id: 'urlInput', size: '100', value: val, onkeyup: "sourceUpdated()"});
	
	pageDiv.appendChild(urlText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(urlInput);
	
	parent.appendChild(pageDiv);
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
		
		var xmlString = "";
		if(window.ActiveXObject) {
			xmlString = xmlDocToParse.xml;
		} else {
			xmlString = (new XMLSerializer()).serializeToString(xmlDocToParse);
		}

		if(xmlPage.getElementsByTagName('url')[0].firstChild){
			window.frames["previewFrame"].loadUrl(xmlDocToParse.getElementsByTagName('url')[0].firstChild.nodeValue);
		};

		  },
		  failure: function(o) { alert('failure');},
		  scope: this
	}

	YAHOO.util.Connect.asyncRequest('POST', '../filemanager.html', callback, 'command=retrieveFile&param1=' + projectPath + pathSeparator + filename);
}

/*
 * Called when 'keyup' event is received on sourceTextArea on this page.
 * gets the text in the textarea and re-renders the previewFrame
 */
function sourceUpdated() {
	saved = false;
	
	if(xmlPage.getElementsByTagName('url')[0].firstChild){
		xmlPage.getElementsByTagName('url')[0].firstChild.nodeValue = document.getElementById('urlInput').value;
	} else {
		var text = xmlPage.createTextNode(document.getElementById('urlInput').value);
		xmlPage.getElementsByTagName('url')[0].appendChild(text);
	};

	window.frames["previewFrame"].loadUrl(xmlPage.getElementsByTagName('url')[0].firstChild.nodeValue);
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
		
		window.parent.opener.connectionManager.request('GET', 1, 'node/outsideurl/outsideurl.html', null,  renderAfterGet);
	};
	
	window.frames['previewFrame'].location = '../blank.html';
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/js/outsideurl_easy.js");