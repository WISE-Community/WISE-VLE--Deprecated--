/*
 * FlashNode
 * interfaces VLE and Flash via javascript
 * Flash can invoke javascript and javascript can invoke Flash via specific interfaces
 * see here for interface API: link_goes_here
 */

FlashNode.prototype = new Node();
FlashNode.prototype.constructor = FlashNode;
FlashNode.prototype.parent = Node.prototype;
FlashNode.authoringToolName = "Flash";
FlashNode.authoringToolDescription = "";
function FlashNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.filename = null;
	this.audios = [];
	
	this.selfRendering = true;
}

FlashNode.prototype.setContent = function(content) {
	//update the content attribute that contains the html
	this.content = content;
};

FlashNode.prototype.writeHTML = function(doc){
	this.replaceVars(doc);
	doc.open();
	doc.write(this.content);
	doc.close();
};

FlashNode.prototype.replaceVars = function(){
	var objSrchStrStart = '<param name="movie" value="';
	var objSrchStrEnd = '"/>';
	var base = vle.project.contentBaseUrl;
	if(base){
		base = base + '/';
	} else {
		base = "";
	};
	
	var obs = this.content.match(/<object.*>(.|\n|\r)*<\/object.*>/i);
	for(var z=0;z<obs.length;z++){
		if(obs[z] && obs[z]!="" && obs[z]!='\n' && obs[z]!='\r' && obs[z]!='\t' && obs[z]!= " "){
			var startIndex = obs[z].indexOf(objSrchStrStart) + objSrchStrStart.length;
			var endIndex = obs[z].indexOf('"', startIndex);
			var filename = obs[z].substring(startIndex, endIndex);
			var exp = new RegExp(filename, 'g');
			this.content = this.content.replace(exp, base + filename);
		};
	};
};

FlashNode.prototype.createFlashJSInterface = function(){
	window.frames["ifrm"].showJsAlert = function(){alert('calling js from flash');};
	window.frames["ifrm"].callToFlash = function(flashObjId){
		if(navigator.appName.indexOf("Microsoft")!=-1){
			window.frames["ifrm"].window[flashObjId].callToFlash();
		} else {
			window.frames["ifrm"].document[flashObjId].callToFlash();
		};
	};
};

FlashNode.prototype.getHTMLContentTemplate = function() {
	return createContent('');
};

NodeFactory.addNode('FlashNode', FlashNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/flash/FlashNode.js');
};