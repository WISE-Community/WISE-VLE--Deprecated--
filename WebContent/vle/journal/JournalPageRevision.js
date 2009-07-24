/**
 * A JournalPageRevision that contains the actual data of the journal.
 * JournalPageRevisions are used in JournalPage objects. 
 */

function JournalPageRevision() {
	//the integer id of the parent JournalPage
	this.journalPageId = "";
	
	//the time the parent JournalPage was created
	this.pageCreatedTime = "";
	
	//the time this revision was made
	this.pageLastEditedTime = "";
	
	//the integer course location
	this.location = "";
	
	//the string of the associated nodeId
	this.nodeId = "";
	
	//what the student wrote
	this.data = "";
}

/**
 * Parses the journal xml and creates a JournalPageRevision
 * @param xmlDoc the <journalPage> xml object
 * @return a new JournalPageRevision object
 */
JournalPageRevision.prototype.parseJournalXML = function(xmlDoc) {
	var journalPageRevision = new JournalPageRevision();
	
	//get what the student wrote
	journalPageRevision.data = xmlDoc.childNodes[0].nodeValue;
	
	//set the integer id
	journalPageRevision.journalPageId = xmlDoc.getAttribute('journalPageId');
	
	//set the creation time
	if(xmlDoc.getAttribute('pageCreatedTime') != null) {
		journalPageRevision.pageCreatedTime = xmlDoc.getAttribute('pageCreatedTime');	
	}
	
	//set the last edited time
	if(xmlDoc.getAttribute('pageLastEditedTime') != null) {
		journalPageRevision.pageLastEditedTime = xmlDoc.getAttribute('pageLastEditedTime');	
	}
	
	//set the location
	if(xmlDoc.getAttribute('location') != null) {
		journalPageRevision.location = xmlDoc.getAttribute('location');	
	}
	
	//set the nodeId
	if(xmlDoc.getAttribute('nodeId') != null) {
		journalPageRevision.nodeId = xmlDoc.getAttribute('nodeId');	
	}
	
	//return the new JournalPageRevision
	return journalPageRevision;
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/journal/JournalPageRevision.js");