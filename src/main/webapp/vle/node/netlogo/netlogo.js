
/**
 * @constructor
 * @param node
 * @returns
 */
function Netlogo(node) {
	this.node = node;
	this.content = node.getContent().getContentJSON();
  this.applet = '';
  this.nlObjPanel = null;
  this.nlObjWorkspace = null;
  this.nlObjWorld = null;
  this.nlObjProgram = null;
  this.nlObjObserver = null;
  this.nlObjGlobals = null;
  this.nlGlobals = null;
  this.clearDataReady = null;
}

Netlogo.prototype.render = function(){
	//display any into content to the student
	$('#promptDiv').html(this.content.prompt);

	// load the Netlogo jar and activity
	var archive = 'NetLogoLite5.jar';
	if(this.content.version == '4'){
		archive = 'NetLogoLite.jar';
	}

    //handle the case that there is no uri selected yet.
    var model = '';
    var appletStr = '';

    if(this.content.activity_uri !== '') {
		model = '<param name="DefaultModel" value="' + this.content.activity_uri + '">';

		appletStr = '<applet id="netlogo-applet" code="org.nlogo.lite.Applet" codebase="/vlewrapper/vle/node/netlogo/"' +
        'archive="' + archive + '" width="' + this.content.width + '" height="' + this.content.height + '">' +
         model + '</applet>';
	}
    $('#netlogo_wrapper').html(appletStr);
    this.applet = document.getElementById("netlogo-applet");
    this.applet.ready = false;
    this.applet.checkedMoreThanOnce = false;
    window.setTimeout(this.appletReady, 250);

};

function stripWhiteSpace(str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

Netlogo.prototype.appletReady = function() {
  var self = this,
      globalsStr;

  self.applet.ready = false;

  try {
    self.nlObjPanel     = self.applet.panel();                                           // org.nlogo.lite.Applet object
    self.nlObjWorkspace = self.nl_obj_panel.workspace();                                 // org.nlogo.lite.LiteWorkspace
    self.nlObjWorld     = self.nl_obj_workspace.org$nlogo$lite$LiteWorkspace$$world;     // org.nlogo.agent.World
    self.nlObjProgram   = self.nl_obj_world.program();                                   // org.nlogo.api.Program
    self.nlObjObserver  = self.nl_obj_world.observer();
    self.nlObjGlobals   = self.nl_obj_program.globals();
    globalsStr = self.nlObjGlobals.toString();
    self.nlGlobals = globalsStr.substr(1, globalsStr.length-2).split(",").map(function(e) { return stripWhiteSpace(e); });
    if (self.nlGlobals.length > 1) {
      self.applet.ready = true;
    }
  } catch (e) {
    // applet is not ready
  }

  if (!self.applet.ready) {
    self.applet.checkedMoreThanOnce = window.setTimeout(self.appletReady, 250);
  }

  return applet.ready;
};

Netlogo.prototype.nlDataReady = function() {
  var self = this;
  return self.nlReadGlobal("DATA-EXPORT:DATA-READY?");
};

Netlogo.prototype.nlCmdExecute = function(cmd) {
  var self = this;
  self.nlObjPanel.commandLater(cmd);
};

Netlogo.prototype.nlReadGlobal = function(global) {
  var self = this;
  if (self.nlGlobals.indexOf(global) < 0) return null;
  return self.nlObjObserver.getVariable(self.nlGlobals.indexOf(global));
};

Netlogo.prototype.getExportedData = function() {
  var self = this;
  return self.nlReadGlobal("DATA-EXPORT:MODEL-DATA");
};

Netlogo.prototype.exportDataHandler = function() {
  var self = this;
  self.nlCmdExecute("data-export:make-model-data");
  self.clearDataReady = window.setInterval(this.exportDataReadyCallback, 250);
};

Netlogo.prototype.exportDataReadyCallback = function() {
  var self = this,
      modelData,
      dataSeries,
      runSeries,
      exportDone = this.nlDataReady();

  if (exportDone) {
    clearInterval(self.clearDataReady);
    modelData = self.nlReadGlobal("DATA-EXPORT:DATA-READY?");
    console.log(modelData);
  }
};


 //+ this.content.activity_uri + '">' +
 //switched to default to the 5.0 version.

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/netlogo/netlogo.js');
}