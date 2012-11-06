
/*
 * This handles events and calls the appropriate function to handle
 * the event.
 * 
 * TODO: rename box2dModelDispatcher
 * For example if you are creating a quiz node you would change it to
 * quizDispatcher
 */
View.prototype.box2dModelDispatcher = function(type,args,obj){
	/*
	 * check to see if the event name matches 
	 * 
	 * TODO: rename box2dModelUpdatePrompt
	 * wait until you implement the authoring before you rename this
	 */ 
	var evt = {"type":type, "args":args, "obj":obj};
	switch (type)
	{
		case 'box2dModelUpdatePrompt': break;
		case 'box2dModelUpdatePrompt':
		case 'make-model':
		case 'delete-model':
		case 'duplicate-model':
		case 'add-balance-world':
		case 'add-balance':
		case 'remove-balance-world':
		case 'remove-balance':
		case 'add-beaker-world':
		case 'add-beaker':
		case 'add-spilloff':
		case 'remove-beaker-world':
		case 'remove-beaker':
		case 'remove-spilloff':
		case 'press-refill':
		case 'press-release':
		case 'test-balance-1to1':
		case 'test-balance-1toN':
		case 'test-balance-Nto1':
		case 'test-balance-NtoN':
		case 'test-beaker-add':
		case 'test-beaker-release':
			//obj.currentNode.interpretEvent(evt);
			break;
	}


};

/*
 * this is a list of events that can be fired. when the event is fired,
 * the dispatcher function above will be called and then call the
 * appropriate function to handle the event.
 */
var events = [
	/*
	 * TODO: rename box2dModelUpdatePrompt
	 * wait until you implement the authoring before you rename this
	 */
	'box2dModelUpdatePrompt',
	'make-model',
	'delete-model',
	'duplicate-model',
	'add-balance-world',
	'add-balance',
	'remove-balance-world',
	'remove-balance',
	'add-beaker-world',
	'add-beaker',
	'add-spilloff',
	'remove-beaker-world',
	'remove-beaker',
	'remove-spilloff',
	'press-release',
	'press-refill',
	'test-balance-1to1',
	'test-balance-1toN',
	'test-balance-Nto1',
	'test-balance-NtoN',
	'test-beaker-add',
	'test-beaker-release'
];


/*
 * add all the events to the vle so the vle will listen for these events
 * and call the dispatcher function when the event is fired
 */
for(var x=0; x<events.length; x++) {
	/*
	 * TODO: rename box2dModelDispatcher
	 * For example if you are creating a quiz node you would change it to
	 * quizDispatcher. The name for the dispatcher should match the function
	 * name at the top of this file.
	 */
	componentloader.addEvent(events[x], 'box2dModelDispatcher');
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * TODO: rename box2dModel to your new folder name
	 * TODO: rename box2dModelEvents
	 * 
	 * e.g. if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/quizEvents.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/box2dModel/box2dModelEvents.js');
};