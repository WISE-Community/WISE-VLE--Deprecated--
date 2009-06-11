VLE.prototype.lockscreen = function() {
	YAHOO.namespace("example.container");

    if (!YAHOO.example.container.wait) {

        // Initialize the temporary Panel to display while waiting for external content to load

        YAHOO.example.container.wait = 
                new YAHOO.widget.Panel("wait",  
                                                { width: "240px", 
                                                  fixedcenter: true, 
                                                  close: false, 
                                                  draggable: false, 
                                                  zindex:4,
                                                  modal: true,
                                                  visible: false
                                                } 
                                            );

        YAHOO.example.container.wait.setHeader("Locked Screen");
        YAHOO.example.container.wait.setBody("<table><tr align='center'>Your teacher has locked your screen.</tr><tr align='center'></tr><table>");
        YAHOO.example.container.wait.render(document.body);

    }
	// Show the Panel
    YAHOO.example.container.wait.show();
    YAHOO.example.container.wait.cfg.setProperty("visible", true);
    
}

VLE.prototype.unlockscreen = function() {
	YAHOO.namespace("example.container");

    if (!YAHOO.example.container.wait) {

        // Initialize the temporary Panel to display while waiting for external content to load

        YAHOO.example.container.wait = 
                new YAHOO.widget.Panel("wait",  
                                                { width: "240px", 
                                                  fixedcenter: true, 
                                                  close: false, 
                                                  draggable: false, 
                                                  zindex:4,
                                                  modal: true,
                                                  visible: false
                                                } 
                                            );

        YAHOO.example.container.wait.setHeader("Loading, please wait...");
        YAHOO.example.container.wait.setBody("<table><tr align='center'>Teacher has locked your screen. Please talk to your teacher.</tr><tr align='center'></tr><table>");
        YAHOO.example.container.wait.render(document.body);

    }
	YAHOO.example.container.wait.hide();
}


//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/ui/vleui.js");