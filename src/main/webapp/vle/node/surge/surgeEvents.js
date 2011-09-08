
/*
 * This handles events and calls the appropriate function to handle
 * the event.
 */
View.prototype.surgeDispatcher = function(type,args,obj){
	/*
	 * check to see if the event name matches 
	 */ 
	if(type == 'surgeUpdateLevelString') {
		obj.SurgeNode.updateLevelString(args);
	} else if (type == 'surgeImportLevelStringToEditor') {
		obj.SurgeNode.importLevelStringToEditor(args);
	}
};

/*
 * this is a list of events that can be fired. when the event is fired,
 * the dispatcher function above will be called and then call the
 * appropriate function to handle the event.
 */
var events = [
	'surgeUpdateLevelString',
	'surgeImportLevelStringToEditor'
];

/*
 * add all the events to the vle so the vle will listen for these events
 * and call the dispatcher function when the event is fired
 */
for(var x=0; x<events.length; x++) {
	componentloader.addEvent(events[x], 'surgeDispatcher');
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/surge/surgeEvents.js');
};