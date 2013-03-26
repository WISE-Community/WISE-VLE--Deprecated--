function StudentModel() {
	this.project;
	this.projectMetadata;
	this.state;
	this.annotations;
	this.currentNodePosition;
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

/**
 * Push the student work to the latest node visit if the node id matches
 * the node id in the node visit
 * @param nodeId the node id of the step that is pushing the student work
 * @param nodeState the student work
 */
StudentModel.prototype.pushStudentWorkToLatestNodeVisit = function(nodeId, nodeState) {
	var nodeVisit = this.getState().getCurrentNodeVisit();
	
	if(nodeVisit != null) {
		var nodeVisitNodeId = nodeVisit.nodeId;
		
		if(nodeId == nodeVisitNodeId) {
			nodeVisit.nodeStates.push(nodeState);
			eventManager.fire('studentWorkUpdated');
		} else {
			//display some error message
		}
	}
};

/**
 * Get the currentNodePosition
 * @return the currentNodePosition
 */
StudentModel.prototype.getCurrentNodePosition = function() {
	return this.currentNodePosition;
};

/**
 * Set the currentNodePosition
 * @param project the currentNodePosition
 */
StudentModel.prototype.setCurrentNodePosition = function(currentNodePosition) {
	this.currentNodePosition = currentNodePosition;
	eventManager.fire('currentNodePositionUpdated');
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/vle/vleview_model.js');
}