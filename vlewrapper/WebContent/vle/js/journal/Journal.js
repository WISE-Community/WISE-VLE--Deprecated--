/**
* A Journal manages the Journal and 
* Journal Entry Nodes.
*
* author: patrick lawler
*/

function Journal(xmlDoc){
	this.xmlDoc = xmlDoc;
	this.rootNode = null;
	this.currentCustomIndex = 0;
	
	this.generateNode(this.xmlDoc);
}

Journal.prototype.generateNode = function(xmlDoc){
	this.rootNode = new JournalNode();
	this.rootNode.type = 'Journal';
	this.rootNode.id = 'J:0';
	this.rootNode.element = xmlDoc;
	
	var journalEntries = null;
	if(xmlDoc){
		journalEntries = xmlDoc.getElementsByTagName('JournalEntry');
	};
	
	if(journalEntries){
		for(var z=0;z<journalEntries.length;z++){
			var journalEntryNode = new JournalEntryNode("JournalEntryNode");
			journalEntryNode.parent = this.rootNode;
			journalEntryNode.id = journalEntries[z].getAttribute('id');
			journalEntryNode.element = journalEntries[z];
			journalEntryNode.title = journalEntries[z].getAttribute('title');
			this.rootNode.addChildNode(journalEntryNode);
		};
	};
};

Journal.prototype.createCustomElement = function(){
	var custom = "<JournalEntry id=\"" + this.generateId() + "\" title=\"New Journal Entry\"><jaxbXML><assessmentItem xmlns=\"http://www.imsglobal.org/xsd/imsqti_v2p0\"";
		custom += " xmlns:ns3=\"http://www.w3.org/1998/Math/MathML\" xmlns:ns2=\"http://www.w3.org/1999/xlink\" timeDependent=\"false\"";
		custom += " adaptive=\"false\" identifier=\"customJournalEntry\"><responseDeclaration baseType=\"string\" cardinality=\"single\"";
		custom += " identifier=\"JOURNALENTRY\"/><itemBody><extendedTextInteraction hasInlineFeedback=\"false\" placeholderText=\"\"";
		custom += " responseIdentifier=\"JOURNALENTRY\" expectedLines=\"6\"><prompt>Your title here</prompt></extendedTextInteraction>";
		custom += "</itemBody></assessmentItem></jaxbXML></JournalEntry>";
	
	var callback = {
		success: function(o){
			window.parent.frames["journaliframe"].frames["journalentryiframe"].loadContentXMLString(o.responseXML.getElementsByTagName('JournalEntry')[0]);
			window.parent.frames["journaliframe"].frames["journalentryiframe"].loadStateAndRender(vle);
		},
		failure: function(o){alert('Unable to create new Journal Entry.')},
		scope: this
	};
	
	var getIt = YAHOO.util.Connect.asyncRequest('GET', "../echo.html?data=" + custom, callback, null);
};

Journal.prototype.generateId = function(){
	var id = "J:0:S:" + this.currentCustomIndex;
	this.currentCustomIndex ++;
	return id;
};