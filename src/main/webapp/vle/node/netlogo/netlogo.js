/**
 * @constructor
 * @param node
 * @returns
 */
function Netlogo(node, view) {
  this.node = node;
	this.view = view;
  this.content = node.getContent().getContentJSON();
  this.applet = '';
  this.nlObjPanel = null;
  this.nlObjWorkspace = null;
  this.nlObjWorld = null;
  this.nlObjProgram = null;
  this.nlObjObserver = null;
  this.nlObjGlobals = null;
  this.nlGlobals = null;
}

Netlogo.prototype = {

  render: function() {
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
    if (this.applet) {
      this.applet.ready = false;
      this.applet.checkedMoreThanOnce = false;
      window.setTimeout(this.nlAppletReady.bind(this), 250);
    }
  },

  save: function() {
    // Try and get the inquiry data from the NetLogo model for up to 0.5s
    var modelData = {},
        exportReady = false,
        stillChecking = true,
        startTime,
        elapsedTime = 0;

    if (this.nlDataExportModuleAvailable()) {
      this.nlCmdExecute("data-export:make-model-data");
      startTime = Date.now();
      // for some reason we have to wait here 200ms
      while(elapsedTime < 200) {
        elapsedTime = Date.now() - startTime;
      }
      // check for another 300ms for data to be available
      while(elapsedTime < 500) {
        exportReady = this.nlDataReady();
        if (exportReady) {
          modelData = this.nlGetExportedData();
          break;
        }
        elapsedTime = Date.now() - startTime;
      }
    }
    jsonStr = JSON.stringify(modelData);
    nlState = new NetlogoState(jsonStr);
    console.log("save, jsonStr:" + jsonStr);
    /*
    * fire the event to push this state to the global view.states object.
    * the student work is saved to the server once they move on to the
    * next step.
    */
    this.view.pushStudentWork(this.node.id, nlState);
  },

  nlAppletReady: function() {
    var globalsStr;

    function stripWhiteSpace(str) {
      return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    this.applet.ready = false;

    try {
      this.nlObjPanel     = this.applet.panel();                                         // org.nlogo.lite.Applet object
      this.nlObjWorkspace = this.nlObjPanel.workspace();                                 // org.nlogo.lite.LiteWorkspace
      this.nlObjWorld     = this.nlObjWorkspace.org$nlogo$lite$LiteWorkspace$$world;     // org.nlogo.agent.World
      this.nlObjProgram   = this.nlObjWorld.program();                                   // org.nlogo.api.Program
      this.nlObjObserver  = this.nlObjWorld.observer();
      this.nlObjGlobals   = this.nlObjProgram.globals();
      globalsStr = this.nlObjGlobals.toString();
      this.nlGlobals = globalsStr.substr(1, globalsStr.length-2).split(",").map(function(e) { return stripWhiteSpace(e); });
      if (this.nlGlobals.length > 1) {
        this.applet.ready = true;
      }
    } catch (e) {
      // applet is not ready
    }

    if (!this.applet.ready) {
      this.applet.checkedMoreThanOnce = window.setTimeout(this.nlAppletReady.bind(this), 250);
    }

    return this.applet.ready;
  },

  nlDataExportModuleAvailable: function() {
    return this.nlReadGlobal("DATA-EXPORT:MODULE-AVAILABLE");
  },

  nlDataReady: function() {
    return this.nlReadGlobal("DATA-EXPORT:DATA-READY?");
  },

  nlCmdExecute: function(cmd) {
    this.nlObjPanel.commandLater(cmd);
  },

  nlReadGlobal: function(global) {
    if (this.nlGlobals.indexOf(global) < 0) return null;
    return this.nlObjObserver.getVariable(this.nlGlobals.indexOf(global));
  },

  nlGetExportedData: function() {
    return this.nlReadGlobal("DATA-EXPORT:MODEL-DATA");
  }
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
  eventManager.fire('scriptLoaded', 'vle/node/netlogo/netlogo.js');
}