/**
* A Journal manages the Journal and 
* Journal Entry Nodes.
*
* author: patrick lawler
*/

function Journal(xmlDoc){
	this.xmlDoc = xmlDoc; //the xml for the journal
	this.workgroupId = null; //the id of the workgroup this journal belongs to
	this.journalPages = new Array(); //an array of JournalPage objects
	
	//parse the journal xml to populate the array of journal pages
	this.parseJournalXML(xmlDoc);
}

/**
 * Parses the journal xml and populates the journal pages array.
 * @param xmlDoc the xml of the journal
 * e.g.
 * <journal workgroupid='1'>
 *	  <journalPages>
 *	     <journalPage journalPageId='1' pageCreatedTime='Wed, Jul 15, 2009 03:32:05 PM' pageLastEditedTime='Wed, Jul 15, 2009 03:32:05 PM' location='' nodeId='a1s1'>
 *          blah blah blah
 *	     </journalPage >
 *	     < journalPage journalPageId='2' pageCreatedTime='Wed, Jul 15, 2009 03:33:05 PM' pageLastEditedTime='Wed, Jul 15, 2009 03:34:05 PM' location='' nodeId='a1s2'>
 *          more blah blah blah
 *	     </journalPage >
 *	  </journalPages>
 * </journal>
 */
Journal.prototype.parseJournalXML = function(xmlDoc) {
	var journalEntriesXML = null;
	
	if(xmlDoc) {
		//get an array of <journalPage> xml objects
		journalEntriesXML = xmlDoc.getElementsByTagName('journalPage');
	}
	
	if(journalEntriesXML) {
		//loop through all the <journalPage> xml objects
		for(var x=0; x<journalEntriesXML.length; x++) {
			//obtain a <journalPage> xml object
			var journalPageXML = journalEntriesXML[x];
			
			//parse the <journalPage> xml object
			var journalPage = JournalPage.prototype.parseJournalXML(journalPageXML);
			
			if(journalPage != null) {
				//add the JournalPage object our array of journal pages
				this.addJournalPage(journalPage);
			}
		}
	}
}

/**
 * Add the Journal Page object to our array of journal pages
 * @param newJournalPage a Journal Page object
 */
Journal.prototype.addJournalPage = function(newJournalPage) {
	/* 
	 * see if we already have a JournalPage object with the same id
	 * as the new JournalPage
	 */
	var journalPage = this.getJournalPage(newJournalPage.id);
	
	if(journalPage == null) {
		/*
		 * we don't have a JournalPage with the new id so we will add
		 * the whole JournalPage 
		 */
		this.journalPages.push(newJournalPage);
	} else {
		/*
		 * we already have a JournalPage with the new id so we will
		 * just add the new JournalPage's revision to the old
		 * JournalPage's array of revisions
		 */
		journalPage.journalPageRevisionArray.push(newJournalPage.getLatestRevision());
	}
}

/**
 * Get the JournalPage object with the given id
 * @param id the integer id of the JournalPage we want
 * @return the JournalPage object with the given id
 */
Journal.prototype.getJournalPage = function(id) {
	//loop through all the journal pages
	for(var x=0; x<this.journalPages.length; x++) {
		//check if the id of the journal page matches the argument id
		if(this.journalPages[x].id == id) {
			//return the page if we found a match
			return this.journalPages[x];
		}
	}
	
	//return null if we didn't find a JournalPage with the argument id
	return null;
}

/**
 * Adds the JournalPageRevision to the JournalPage
 * @param journalPageRevision a JournalPageRevision object
 */
Journal.prototype.addJournalPageRevisionToJournalPage = function(journalPageRevision) {
	//get the JournalPage with the same id as the JournalPageRevision
	var journalPage = this.getJournalPage(journalPageRevision.journalPageId);
	
	if(journalPage == null) {
		/*
		 * we did not find a JournalPage with the same id so we will need to
		 * create a JournalPage to put the JournalPageRevision into
		 */
		this.addJournalPage(this.createJournalPageFromJournalPageRevision(journalPageRevision));
	} else {
		/*
		 * we found a JournalPage so we will just stick the JournalPageRevision
		 * into the JournalPage's array
		 */
		journalPage.addJournalPageRevision(journalPageRevision);		
	}
}

/**
 * Creates a JournalPage given a JournalPageRevision
 * @param journalPageRevision a JournalPageRevision
 * @return a JournalPage
 */
Journal.prototype.createJournalPageFromJournalPageRevision = function(journalPageRevision) {
	//create a new JournalPage
	var journalPage = new JournalPage();
	
	//set the id for the JournalPage
	journalPage.id = journalPageRevision.journalPageId;
	
	//add the JournalPageRevision to the JournalPage's array
	journalPage.journalPageRevisionArray.push(journalPageRevision);
	
	//return the new JournalPage
	return journalPage;
}

/**
 * Remove the JournalPage with the argument id 
 * @param id the integer id of the JournalPage to remove
 */
Journal.prototype.removeJournalPage = function(id) {
	//loop through the JournalPage array 
	for(var x=0; x<this.journalPages.length; x++) {
		//check the id to see if it matches the id we want to remove
		if(this.journalPages[x].id == id) {
			/*
			 * cut the current element out of the array, the 1 means to
			 * only cut 1 element starting from position x
			 */
			this.journalPages.splice(x, 1);
		}
	}
}


//below is old stuff

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

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/journal/Journal.js");