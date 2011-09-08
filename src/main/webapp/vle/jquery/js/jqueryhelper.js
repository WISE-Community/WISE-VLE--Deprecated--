/**
 * The following are helper functions which should be appended to jQuery
 */
$.escapeId = function(id){
	if(id){
		return id.replace(/(:|\.)/g,'\\$1');
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/jquery/js/jqueryhelper.js');
}