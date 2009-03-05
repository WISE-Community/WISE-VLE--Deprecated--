/*
 * FillinNode
 */

FillinNode.prototype = new Node();
FillinNode.prototype.constructor = FillinNode;
FillinNode.prototype.parent = Node.prototype;
function FillinNode(nodeType) {
	this.type = nodeType;
}

FillinNode.prototype.render = function(contentpanel) {
	window.frames["ifrm"].location = "js/node/fillin/fillin.html";
} 


FillinNode.prototype.load = function() {
	//window.frames["ifrm"].loadXMLString("<assessmentItem xmlns='http://www.imsglobal.org/xsd/imsqti_v2p0' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='http://www.imsglobal.org/xsd/imsqti_v2p0 imsqti_v2p0.xsd' identifier='textEntry' title='Dido' adaptive='false' timeDependent='false'><responseDeclaration identifier='response_0' cardinality='single' baseType='string'><correctResponse><value>meiosis</value></correctResponse><mapping defaultValue='0'><mapEntry mapKey='meiosis' mappedValue='1'/><mapEntry mapKey='Meiosis' mappedValue='1'/></mapping></responseDeclaration><responseDeclaration identifier='response_1' cardinality='single' baseType='string'><correctResponse><value>two</value></correctResponse><mapping defaultValue='0'><mapEntry mapKey='two' mappedValue='1'/><mapEntry mapKey='2' mappedValue='1'/></mapping></responseDeclaration><responseDeclaration identifier='response_2' cardinality='single' baseType='string'><correctResponse><value>four</value></correctResponse><mapping defaultValue='0'><mapEntry mapKey='four' mappedValue='1'/><mapEntry mapKey='4' mappedValue='1'/></mapping></responseDeclaration><outcomeDeclaration identifier='SCORE' cardinality='single' baseType='float'/><itemBody><htmltext>&lt;p&gt;&lt;/p&gt;&lt;p&gt; During </htmltext><textEntryInteraction responseIdentifier='response_0' expectedLength='10'/><htmltext>(1 word), the genome of a diploid germ cell, which is composed of long segments of DNA packaged into chromosomes, undergoes DNA replication followed by</htmltext><textEntryInteraction responseIdentifier='response_1' expectedLength='5'/><htmltext>(1 number) rounds of division, resulting in </htmltext><textEntryInteraction responseIdentifier='response_2' expectedLength='5'/><htmltext>(1 number) haploid cells.&lt;/p&gt;</htmltext></itemBody><responseProcessing template='http://www.imsglobal.org/question/qti_v2p0/rptemplates/map_response'/></assessmentItem>");
	//window.frames["ifrm"].loadXMLString("<assessmentItem xmlns='http://www.imsglobal.org/xsd/imsqti_v2p0' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:schemaLocation='http://www.imsglobal.org/xsd/imsqti_v2p0 imsqti_v2p0.xsd' identifier='textEntry' title='Dido' adaptive='false' timeDependent='false'><responseDeclaration identifier='response_0' cardinality='single' baseType='string'><correctResponse><value>hunger < 0</value></correctResponse><mapping defaultValue='0'><mapEntry mapKey='hunger < 0' mappedValue='1'/><mapEntry mapKey='hunger<0' mappedValue='1'/></mapping></responseDeclaration><outcomeDeclaration identifier='SCORE' cardinality='single' baseType='float'/><itemBody><htmltext>&lt;p&gt;Fill in the blank in the code below so that the rewritten &lt;tt&gt;feed&lt;/tt&gt; method has exactly the same effect on &lt;tt&gt;hunger&lt;/tt&gt; as the original.&lt;/p&gt;&lt;code&gt;public &lt;span class='redtext'&gt;void&lt;/span&gt; feed ( ) {&nbsp;&nbsp;&nbsp;hunger = hunger Ð 10;&nbsp;&nbsp;&nbsp;if ( </htmltext><textEntryInteraction responseIdentifier='response_0' expectedLength='10'/><htmltext>  ) { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hunger = 0;&nbsp;&nbsp;&nbsp;} face.setMessage('Yum, thanks'); face.setImage('normal'); } &lt;/code&gt;</htmltext></itemBody><responseProcessing template='http://www.imsglobal.org/question/qti_v2p0/rptemplates/map_response'/></assessmentItem>");
	
	//the content for these steps are now loaded from the vle/otml. This does not work yet for some reason.
	//window.frames["ifrm"].loadFromVLE(this, vle);
	
	//load the content from the otml
	var xmlNode = this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	window.frames["ifrm"].loadXMLString(xmlNode);
	
	document.getElementById('topStepTitle').innerHTML = this.title;
}

FillinNode.prototype.getDataXML = function(nodeStates) {
	return FillinNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with state object instances
 */
FillinNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an FILLINSTATE object and put it into the array that we will return
		 */
		statesArrayObject.push(FILLINSTATE.prototype.parseDataXML(stateXML));
	}
	
	return statesArrayObject;
}