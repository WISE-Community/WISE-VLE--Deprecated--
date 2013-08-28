function ClassroomMonitorModel() {
	this.project;
	this.projectMetadata;
	this.states;
	this.annotations;
}

/**
 * Get the project object
 * @return the project object
 */
ClassroomMonitorModel.prototype.getProject = function() {
	return this.project;
};

/**
 * Set the project object
 * @param project the project object
 */
ClassroomMonitorModel.prototype.setProject = function(project) {
	this.project = project;
};

/**
 * Get the project metadata object
 * @return the project metadata
 */
ClassroomMonitorModel.prototype.getProjectMetadata = function() {
	return this.projectMetadata;
};

/**
 * Set the project metadata object
 * @param projectMetadata the project metadata object
 */
ClassroomMonitorModel.prototype.setProjectMetadata = function(projectMetadata) {
	this.projectMetadata = projectMetadata;
};

/**
 * Get the vle states
 * @return the vle states
 */
ClassroomMonitorModel.prototype.getStates = function() {
	return this.states;
};

/**
 * Set the vle states
 * @param states the vle states
 */
ClassroomMonitorModel.prototype.setStates = function(states) {
	this.states = states;
};

/**
 * Get the annotations
 * @return the annotations
 */
ClassroomMonitorModel.prototype.getAnnotations = function() {
	return this.annotations;
};

/**
 * Set the annotations
 * @param annotations the annotations
 */
ClassroomMonitorModel.prototype.setAnnotations = function(annotations) {
	this.annotations = annotations;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/classroomMonitor/classroomMonitorView_model.js');
};