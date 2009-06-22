var node; //an HtmlNode
var thisFilename = null;
var saved = true;

/**
 * Load the html authoring view from the specified filename
 * filename points to a plain old html file.
 */
function loadAuthoringFromFile(filename, projectName, projectPath, pathSeparator) {
	var callback =
	{
	  success: function(o) { 
		  var xmlDocObj = new LoadXMLDocObj();
		  xmlDocObj.xmlDoc = o.responseXML;   // o.responseXML is the OTML
		  htmlContent = o.responseText;
		  var xmlDocToParse = o.responseXML;
		  node = new HtmlNode();
		  node.setContent(htmlContent);
		  document.getElementById('sourceTextArea').value = htmlContent;
		  node.render(window.frames["previewFrame"]);
	  },
	  failure: function(o) { alert('failure');},
	  scope: this
	}

	YAHOO.util.Connect.asyncRequest('POST', '../filemanager.html', callback, 'command=retrieveFile&param1=' + projectPath + pathSeparator + filename);
}	

/*
 * This is called by the authoring_tool.html after it has
 * set the node.
 */
function loadAuthoring() {
	if(node != null) {
		//tell the node to render itself in the previewFrame right iframe
		node.render(window.frames["previewFrame"]);

		//set the text in the left text area to contain the html from the node
		document.getElementById('sourceTextArea').value = node.content;
	}
}

/*
 * Called to send the authored text back to the previewFrame so the
 * previewFrame can update itself and reflect the changes the author
 * has made.
 */
function sourceUpdated() {
	saved = false;
	//retrieve the authored text
	var htmlString = document.getElementById('sourceTextArea').value;

	//set the authored html into the HtmlNode
	node.setContent(htmlString);

	//tell the node to render itself in the previewFrame iframe
	node.render(window.frames["previewFrame"]);
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/js/html_advanced.js");