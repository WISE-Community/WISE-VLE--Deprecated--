/*
 * JournalNode is a child of openresponse
 */

JournalNode.prototype = new Node();
JournalNode.prototype.constructor = JournalNode;
JournalNode.prototype.parent = Node.prototype;
function JournalNode(nodeType) {
	this.type = nodeType;
	
	//The second argument passed to the
    //constructor is a configuration object:
    journalPanel = new YAHOO.widget.Panel("journalPanel", {
        width: "600px",
        height: "600px",
        fixedcenter: false,
        constraintoviewport: true,
        underlay: "shadow",
        close: true,
        visible: false,
        draggable: true
    });
    //If we haven't built our panel using existing markup,
    //we can set its content via script:
    journalPanel.setHeader("My Journal");
    journalPanel.setBody("<iframe name=\"journaliframe\" id=\"journaliframe\" width=\"100%\" height=\"100%\" src=\"js/node/openresponse/journalpage.html\"><iframe>");
    //Although we configured many properties in the
    //constructor, we can configure more properties or 
    //change existing ones after our Panel has been
    //instantiated:
    
    journalPanel.cfg.setProperty("underlay", "matte");
	journalPanel.render();
}

JournalNode.prototype.render = function(contentpanel){
	//alert(this.id);
    journalPanel.cfg.setProperty("visible", true);
    //window.frames["ifrm"].location = "js/node/openresponse/openresponse.html";
}


JournalNode.prototype.load = function() {
	//window.frames["journaliframe"].loadXMLString("<assessmentItem xmlns='http://www.imsglobal.org/xsd/imsqti_v2p0' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='http://www.imsglobal.org/xsd/imsqti_v2p0 imsqti_v2p0.xsd' identifier='textEntry' title='Dido' adaptive='false' timeDependent='false'><responseDeclaration identifier='response_0' cardinality='single' baseType='string'><correctResponse><value>meiosis</value></correctResponse><mapping defaultValue='0'><mapEntry mapKey='meiosis' mappedValue='1'/><mapEntry mapKey='Meiosis' mappedValue='1'/></mapping></responseDeclaration><responseDeclaration identifier='response_1' cardinality='single' baseType='string'><correctResponse><value>two</value></correctResponse><mapping defaultValue='0'><mapEntry mapKey='two' mappedValue='1'/><mapEntry mapKey='2' mappedValue='1'/></mapping></responseDeclaration><responseDeclaration identifier='response_2' cardinality='single' baseType='string'><correctResponse><value>four</value></correctResponse><mapping defaultValue='0'><mapEntry mapKey='four' mappedValue='1'/><mapEntry mapKey='4' mappedValue='1'/></mapping></responseDeclaration><outcomeDeclaration identifier='SCORE' cardinality='single' baseType='float'/><itemBody><htmltext>&lt;p&gt;&lt;/p&gt;&lt;p&gt; During </htmltext><textEntryInteraction responseIdentifier='response_0' expectedLength='10'/><htmltext>(1 word), the genome of a diploid germ cell, which is composed of long segments of DNA packaged into chromosomes, undergoes DNA replication followed by</htmltext><textEntryInteraction responseIdentifier='response_1' expectedLength='5'/><htmltext>(1 number) rounds of division, resulting in </htmltext><textEntryInteraction responseIdentifier='response_2' expectedLength='5'/><htmltext>(1 number) haploid cells.&lt;/p&gt;</htmltext></itemBody><responseProcessing template='http://www.imsglobal.org/question/qti_v2p0/rptemplates/map_response'/></assessmentItem>");
	//window.frames["journaliframe"].loadFromVLE(this, vle);
	
	//journal is not fully implemented at the moment
}

JournalNode.prototype.getDataXML = function(nodeStates) {
	return JournalNode.prototype.parent.getDataXML(nodeStates);
}