function NavigationPanel(view) {
	this.view = view;
	this.rootNode = this.view.getProject().getRootNode();
	this.autoStep = this.view.getProject().useAutoStep(); //boolean value whether to automatically number the steps
	this.stepLevelNumbering = this.view.getProject().useStepLevelNumbering(); //boolean value whether to use tree level numbering e.g. 1, 1.1, 1.1.2
	this.stepTerm = this.view.getProject().getStepTerm(); //The term to precede a step (i.e. Step or Page) when autoStep=true
	this.currentStepNum;
	this.navigationPanelLoaded = false;
};


/*
 * Obtain the html from my_menu and run trim on the html to remove all
 * white space. If it is empty string after the trim that means we
 * need to create the nav html. If the string is not empty that means
 * we have previously created the nav html and we only need to update
 * some of the elements.
 * @param forceReRender true iff we want to rerender the navigation from scratch
 */
NavigationPanel.prototype.render = function(forceReRender) {
	// overridden by children
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/navigation/NavigationPanel.js');
};