/**
 * A JournalPage that is used in Journal objects 
 */

function JournalPage() {
	this.id = ""; //the integer id of the JournalPage
	this.journalPageRevisionArray = new Array(); //an array of JournalPageRevision objects
}

/**
 * Parses the <journalPage> xml object into a JournalPage object
 * @param xmlDoc a <journalPage> xml object
 * @return a JournalPage object
 */
JournalPage.prototype.parseJournalXML = function(xmlDoc) {
	var journalPage = new JournalPage();
	
	//obtain the id of the JournalPage
	journalPage.id = xmlDoc.getAttribute('journalPageId');
	
	//parse the contents of the JournalPage by parsing the JournalPageRevision
	var journalPageRevision = JournalPageRevision.prototype.parseJournalXML(xmlDoc);
	
	//add the revision to the array of revisions
	journalPage.journalPageRevisionArray.push(journalPageRevision);
	
	//return the new JournalPage
	return journalPage;
}

/**
 * Add the JournalPageRevision to this JournalPage's array of
 * JournalPageRevisions
 * @param journalPageRevision a JournalPageRevision object
 */
JournalPage.prototype.addJournalPageRevision = function(journalPageRevision) {
	//add the JournalPageRevision to the array of JournalPageRevisions
	this.journalPageRevisionArray.push(journalPageRevision);
}

/**
 * Get the latest JournalPageRevision in this JournalPage
 * @return the latest JournalPageRevision
 */
JournalPage.prototype.getLatestRevision = function() {
	//get the last JournalPageRevision in the array
	return this.journalPageRevisionArray[this.journalPageRevisionArray.length - 1];
}


//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/journal/JournalPage.js");