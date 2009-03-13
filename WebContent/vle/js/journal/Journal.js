/**
* A Journal manages the Journal and 
* Journal Entry Nodes.
*
* author: patrick lawler
*/

function Journal(xmlDoc){
	this.xmlDoc = xmlDoc;
	this.rootNode = null;
	
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
			var journalEntryNode = new JournalEntryNode(journalEntries[z]);
			journalEntryNode.parent = this.rootNode;
			journalEntryNode.id = journalEntries[z].getAttribute('id');
			journalEntryNode.element = journalEntries[z];
			journalEntryNode.title = journalEntries[z].getAttribute('title');
			this.rootNode.addChildNode(journalEntryNode);
		};
	};
};