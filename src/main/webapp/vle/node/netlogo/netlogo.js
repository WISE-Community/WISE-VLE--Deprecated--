
/**
 * @constructor
 * @param node
 * @returns
 */
function Netlogo(node) {
	this.node = node;
	this.content = node.getContent().getContentJSON();
};



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
    if(this.content.activity_uri != '') {
		model = '<param name="DefaultModel" value="' + this.content.activity_uri + '">';
	}
    
	var applet = '<applet code="org.nlogo.lite.Applet" codebase="/vlewrapper/vle/node/netlogo/"' +  
        'archive="' + archive + '" width="' + this.content.width + '" height="' + this.content.height + '">' +
         model + 
        '</applet>';
        
	$('#netlogo_wrapper').html(applet);
    
};


 //+ this.content.activity_uri + '">' +
 //switched to default to the 5.0 version.

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/netlogo/netlogo.js');
};