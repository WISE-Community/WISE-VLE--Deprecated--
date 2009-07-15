VLE.prototype.lockscreen = function(message) {
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

    } else {
    	
    }
    if (message == null) {
    	message = "<table><tr align='center'>Your teacher has paused your screen.</tr><tr align='center'></tr><table>"
    }

    YAHOO.example.container.wait.setHeader("Message");
    YAHOO.example.container.wait.setBody(message);
    YAHOO.example.container.wait.render(document.body);

	// Show the Panel
    YAHOO.example.container.wait.show();
    YAHOO.example.container.wait.cfg.setProperty("visible", true);
    
}

VLE.prototype.unlockscreen = function(message) {
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

        if (message == null) {
        	message = "<table><tr align='center'>Your teacher has paused your screen.</tr><tr align='center'></tr><table>"
        }

        YAHOO.example.container.wait.setHeader("Message");
        YAHOO.example.container.wait.setBody(message);
        YAHOO.example.container.wait.render(document.body);

    }
	YAHOO.example.container.wait.hide();
}


//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/ui/vleui.js");