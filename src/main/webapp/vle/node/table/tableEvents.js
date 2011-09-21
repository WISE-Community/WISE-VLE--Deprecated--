
/*
 * This handles events and calls the appropriate function to handle
 * the event.
 * 
 * TODO: rename templateDispatcher
 * For example if you are creating a quiz node you would change it to
 * quizDispatcher
 */
View.prototype.tableDispatcher = function(type,args,obj){
	/*
	 * check to see if the event name matches 
	 * 
	 * TODO: rename templateUpdatePrompt
	 * wait until you implement the authoring before you rename this
	 */ 
	if(type == 'tableUpdatePrompt') {
		/*
		 * the event name matches so we will call the function that
		 * handles that event
		 * 
		 * TODO: rename TemplateNode
		 * wait until you implement the authoring before you rename this 
		 */
		obj.TableNode.updatePrompt();
	} else if(type == 'tableUpdateNumColumns') {
		obj.TableNode.updateNumColumns();
	} else if(type == 'tableUpdateNumRows') {
		obj.TableNode.updateNumRows();
	} else if(type == 'tableUpdateCellText') {
		obj.TableNode.updateCellText(args[0]);
	} else if(type == 'tableUpdateCellUneditable') {
		obj.TableNode.updateCellUneditable(args[0]);
	} else if(type == 'tableInsertColumn') {
		obj.TableNode.tableInsertColumn(args[0]);
	} else if(type == 'tableDeleteColumn') {
		obj.TableNode.tableDeleteColumn(args[0]);
	} else if(type == 'tableInsertRow') {
		obj.TableNode.tableInsertRow(args[0]);
	} else if(type == 'tableDeleteRow') {
		obj.TableNode.tableDeleteRow(args[0]);
	} else if(type == 'tableUpdateGlobalCellSize') {
		obj.TableNode.updateGlobalCellSize();
	} else if(type == 'tableUpdateCellSize') {
		obj.TableNode.updateCellSize(args[0]);
	} else if(type == 'tableUpdatePrompt2') {
		obj.TableNode.updatePrompt2();
	} else if(type == 'tableUpdateStarterSentence') {
		obj.TableNode.updateStarterSentence();
	} else if(type == 'tableUpdateHideEverythingBelowTable') {
		obj.TableNode.updateHideEverythingBelowTable();
	}
};

/*
 * this is a list of events that can be fired. when the event is fired,
 * the dispatcher function above will be called and then call the
 * appropriate function to handle the event.
 */
var events = [
	/*
	 * TODO: rename templateUpdatePrompt
	 * wait until you implement the authoring before you rename this
	 */
	'tableUpdatePrompt',
	'tableUpdateNumColumns',
	'tableUpdateNumRows',
	'tableUpdateCellText',
	'tableUpdateCellUneditable',
	'tableInsertColumn',
	'tableDeleteColumn',
	'tableInsertRow',
	'tableDeleteRow',
	'tableUpdateGlobalCellSize',
	'tableUpdateCellSize',
	'tableUpdatePrompt2',
	'tableUpdateStarterSentence',
	'tableUpdateHideEverythingBelowTable'
];

/*
 * add all the events to the vle so the vle will listen for these events
 * and call the dispatcher function when the event is fired
 */
for(var x=0; x<events.length; x++) {
	/*
	 * TODO: rename templateDispatcher
	 * For example if you are creating a quiz node you would change it to
	 * quizDispatcher. The name for the dispatcher should match the function
	 * name at the top of this file.
	 */
	componentloader.addEvent(events[x], 'tableDispatcher');
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * TODO: rename template to your new folder name
	 * TODO: rename templateEvents
	 * 
	 * e.g. if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/quizEvents.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/table/tableEvents.js');
};