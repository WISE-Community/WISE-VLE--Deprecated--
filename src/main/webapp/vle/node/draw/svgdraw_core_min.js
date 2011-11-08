SVGDrawNode.prototype=new Node;SVGDrawNode.prototype.constructor=SVGDrawNode;SVGDrawNode.prototype.parent=Node.prototype;SVGDrawNode.authoringToolName="WISE Draw";SVGDrawNode.authoringToolDescription="Students draw using basic drawing tools, take snapshots and create flipbook animations";
function SVGDrawNode(a,c){this.view=c;this.type=a;this.filename=this.content=null;this.audios=[];this.audioSupported=!0;this.exportableToNodes=["SVGDrawNode"];this.importableFileExtensions=["jpg","png","gif","svg"]}SVGDrawNode.prototype.updateJSONContentPath=function(a){this.content.replace(RegExp(this.filename),a+"/"+this.filename)};SVGDrawNode.prototype.parseDataJSONObj=function(a){return SVGDRAWSTATE.prototype.parseDataJSONObj(a)};
SVGDrawNode.prototype.translateStudentWork=function(a){if(typeof a=="string"&&a.match(/^--lz77--/))var c=new LZ77,a=a.replace(/^--lz77--/,""),a=$.parseJSON(c.decompress(a));a=a.svgString;a.match(/^--lz77--/)&&(c=new LZ77,a=a.replace(/^--lz77--/,""),a=c.decompress(a));return a=Utils.encode64(a)};SVGDrawNode.prototype.canExportWork=function(a){return this.exportableToNodes&&this.exportableToNodes.indexOf(a.type)>-1};
SVGDrawNode.prototype.exportWork=function(a){if(a.type=="SVGDrawNode"&&(a=this.view.state.getNodeVisitsByNodeId(this.id),a.length>0)){for(var c=[],b=0;b<a.length;b++)for(var e=a[b],d=0;d<e.nodeStates.length;d++)c.push(e.nodeStates[d]);a=c[c.length-1].getStudentWork();a=Utils.decode64(this.translateStudentWork(a));return a=a.replace(/[\n\r\t]/g,"").match("<title>student</title>(.*)</g>")[1]}return null};
SVGDrawNode.prototype.importWork=function(a){a=a.exportWork(this);a!=null&&this.contentPanel.svgCanvas.setSvgString(this.contentPanel.svgCanvas.getSvgString().replace("<title>student</title>","<title>student</title>"+a))};SVGDrawNode.prototype.canImportFile=function(a){return a.indexOf(".")!=-1&&this.importableFileExtensions.indexOf(a.substr(a.lastIndexOf(".")+1).toLowerCase())!=-1?!0:!1};
SVGDrawNode.prototype.importFile=function(a){return this.canImportFile(a)?(a='<image x="250" y="150" height="150" width="150" xlink:href="'+a+'" />',a=this.contentPanel.svgCanvas.getSvgString().replace("<title>student</title>","<title>student</title>"+a),a.indexOf('xmlns:xlink="http://www.w3.org/1999/xlink"')==-1&&(a=a.replace("<svg ",'<svg xmlns:xlink="http://www.w3.org/1999/xlink" ')),this.contentPanel.svgCanvas.setSvgString(a),!0):!1};SVGDrawNode.prototype.onExit=function(){if(this.contentPanel)try{if(this.contentPanel.onExit)try{this.contentPanel.onExit()}catch(a){}}catch(c){history.back()}};
SVGDrawNode.prototype.getHTMLContentTemplate=function(){return createContent("node/draw/svg-edit/svg-editor.html")};NodeFactory.addNode("SVGDrawNode",SVGDrawNode);typeof eventManager!="undefined"&&eventManager.fire("scriptLoaded","vle/node/draw/SVGDrawNode.js");View.prototype.svgdrawDispatcher=function(a,c,b){a=="drawingPromptChanged"?b.DrawNode.updatePrompt():a=="drawingBackgroundInfoChanged"?b.DrawNode.backgroundInfoChanged():a=="drawingRemoveBackgroundImage"?b.DrawNode.removeBackgroundImage():a=="drawingCreateBackgroundSpecified"?b.DrawNode.createBackgroundSpecified():a=="drawingAddNewStamp"?b.DrawNode.addNewStamp():a=="drawingStampInfoChanged"?b.DrawNode.stampInfoChanged(c[0]):a=="drawingRemoveStamp"?b.DrawNode.removeStamp(c[0]):a=="drawingCreateStampsSpecified"?
b.DrawNode.createStampsSpecified():a=="svgdrawSnapshotOptionChanged"?b.SVGDrawNode.snapshotOptionChanged():a=="svgdrawSnapshotMaxOptionChanged"?b.SVGDrawNode.snapshotMaxChanged():a=="svgdrawDescriptionOptionChanged"?b.SVGDrawNode.descriptionOptionChanged():a=="svgdrawDefaultDescriptionChanged"?b.SVGDrawNode.defaultDescriptionChanged():a=="svgdrawPromptChanged"?b.SVGDrawNode.updatePrompt():a=="svgdrawBackgroundChanged"?b.SVGDrawNode.backgroundChanged():a=="svgdrawAddNewStamp"?b.SVGDrawNode.addNewStamp():
a=="svgdrawStampValueChanged"?b.SVGDrawNode.stampValueChanged(c[0]):a=="svgdrawStampLabelChanged"?b.SVGDrawNode.stampLabelChanged(c[0]):a=="svgdrawRemoveStamp"?b.SVGDrawNode.removeStamp(c[0]):a=="svgdrawStampWidthChanged"?b.SVGDrawNode.stampWidthChanged(c[0]):a=="svgdrawStampHeightChanged"?b.SVGDrawNode.stampHeightChanged(c[0]):a=="svgdrawStampTitleClicked"?b.SVGDrawNode.stampTitleClicked(c[0]):a=="svgdrawDescriptionClicked"?b.SVGDrawNode.descriptionClicked():a=="svgdrawStampWidthClicked"?b.SVGDrawNode.stampWidthClicked(c[0]):
a=="svgdrawStampHeightClicked"&&b.SVGDrawNode.stampHeightClicked(c[0])};
for(var events=["drawingPromptChanged","drawingBackgroundInfoChanged","drawingRemoveBackgroundImage","drawingCreateBackgroundSpecified","drawingAddNewStamp","drawingStampInfoChanged","drawingRemoveStamp","drawingCreateStampsSpecified","svgdrawSnapshotOptionChanged","svgdrawSnapshotMaxOptionChanged","svgdrawDescriptionOptionChanged","svgdrawDefaultDescriptionChanged","svgdrawPromptChanged","svgdrawBackgroundChanged","svgdrawAddNewStamp","svgdrawStampValueChanged","svgdrawRemoveStamp","svgdrawStampLabelChanged",
"svgdrawStampWidthChanged","svgdrawStampHeightChanged","svgdrawStampTitleClicked","svgdrawDescriptionClicked","svgdrawStampWidthClicked","svgdrawStampHeightClicked"],x=0;x<events.length;x++)componentloader.addEvent(events[x],"svgdrawDispatcher");typeof eventManager!="undefined"&&eventManager.fire("scriptLoaded","vle/node/draw/svgDrawEvents.js");
if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', 'vle/node/draw/svgdraw_core_min.js');}