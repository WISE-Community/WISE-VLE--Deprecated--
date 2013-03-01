function StudentModel() {
	this.project;
	this.projectMetadata;
	this.state;
	this.annotations;
}

/**
 * Get the project object
 * @return the project object
 */
StudentModel.prototype.getProject = function() {
	return this.project;
};

/**
 * Set the project object
 * @param project the project object
 */
StudentModel.prototype.setProject = function(project) {
	this.project = project;
};

/**
 * Get the project metadata object
 * @return the project metadata
 */
StudentModel.prototype.getProjectMetadata = function() {
	return this.projectMetadata;
};

/**
 * Set the project metadata object
 * @param projectMetadata the project metadata object
 */
StudentModel.prototype.setProjectMetadata = function(projectMetadata) {
	this.projectMetadata = projectMetadata;
};

/**
 * Get the vle state
 * @return the vle state
 */
StudentModel.prototype.getState = function() {
	return this.state;
};

/**
 * Set the vle state
 * @param state the vle state
 */
StudentModel.prototype.setState = function(state) {
	this.state = state;
};

/**
 * Get the annotations
 * @return the annotations
 */
StudentModel.prototype.getAnnotations = function() {
	return this.annotations;
};

/**
 * Set the annotations
 * @param annotations the annotations
 */
StudentModel.prototype.setAnnotations = function(annotations) {
	this.annotations = annotations;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/vle/vleview_model.js');
}