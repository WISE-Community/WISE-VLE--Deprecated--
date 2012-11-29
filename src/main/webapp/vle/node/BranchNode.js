/**
 * Branch Node
 */
BranchNode.prototype = new MultipleChoiceNode();
BranchNode.prototype.constructor = BranchNode;
BranchNode.prototype.parent = MultipleChoiceNode.prototype;
function BranchNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
}

/**
 * Whether this step type has a grading view. Steps types that do not
 * save any student work will not have a grading view such as HTMLNode
 * and OutsideUrlNode.
 * @returns whether this step type has a grading view
 */
BranchNode.prototype.hasGradingView = function() {
	return false;
};

/**
 * Override of Node.processStateConstraints
 */
BranchNode.prototype.processStateConstraints = function() {
	var response = this.view.state.getLatestWorkByNodeId(this.id);
	if(response != ''){
		
		/* we need to disallow further work on this branch node */
		//this.view.eventManager.fire('addConstraint', {type:'NotVisitableXConstraint', x:{id:this.id, mode:'node'}, status:1, menuStatus:0, msg:'You can only answer this question once.'});
		
		/* get the choice Id based on the response */
		var content = this.content.getContentJSON(), choiceId = null;
		for(var u=0;u<content.assessmentItem.interaction.choices.length;u++){
			if(content.assessmentItem.interaction.choices[u].text == response){
				choiceId = content.assessmentItem.interaction.choices[u].identifier;
			}
		}
		
		/**
		 * Remove the constraints that are associated with the choice in
		 * the student's response.
		 */
		for(var v=0;v<content.branches.length;v++){
			/* if the determined choiceId is in the choiceIds of this branch, then
			 * we need to remove the specified constraints for this branch */
			if(content.branches[v].choiceIds.indexOf(choiceId) != -1){
				for(var w=0;w<content.branches[v].constraintIds.length;w++){
					//this.view.eventManager.fire('removeConstraint', content.branches[v].constraintIds[w]);
				}
			}
		}
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/BranchNode.js');
}