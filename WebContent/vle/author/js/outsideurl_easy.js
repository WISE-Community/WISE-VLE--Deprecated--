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
	  
	  /***						***|
		   * Extra work needed for IE *|
		   ***						***/
		  if(window.ActiveXObject){
		  	var ieXML = new ActiveXObject("Microsoft.XMLDOM");
		  	ieXML.async = "false";
		  	ieXML.loadXML(o.responseText);
		  	xmlDocToParse = ieXML;
		  };
		  /***						***|
		   * End extra work for IE	  *|
		   ***						***/

		/**
		 * sets local xml and then generates the left panel
		 * of this page dynamically
		 */
		xmlPage = xmlDocToParse;
		generatePage();
		
		//retrieve the xmlString from the mcObj
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

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/js/outsideurl_easy.js");