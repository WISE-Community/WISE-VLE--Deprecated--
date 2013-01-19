/*
 * This is a box2dModel step object that developers can use to create new
 * step types.
 * 
 * TODO: Copy this file and rename it to
 * 
 * <new step type>.js
 * e.g. for example if you are creating a quiz step it would look
 * something like quiz.js
 *
 * and then put the new file into the new folder
 * you created for your new step type
 *
 * your new folder will look something like
 * vlewrapper/WebContent/vle/node/<new step type>/
 *
 * e.g. for example if you are creating a quiz step it would look something like
 * vlewrapper/WebContent/vle/node/quiz/
 * 
 * 
 * TODO: in this file, change all occurrences of the word 'Box2dModel' to the
 * name of your new step type
 * 
 * <new step type>
 * e.g. for example if you are creating a quiz step it would look
 * something like Quiz
 */

/**
 * This is the constructor for the object that will perform the logic for
 * the step when the students work on it. An instance of this object will
 * be created in the .html for this step (look at box2dModel.html)
 * 
 * TODO: rename Box2dModel
 * 
 * @constructor
 */
function Box2dModel(node) {
	this.node = node;
	this.view = node.view;
	this.content = node.getContent().getContentJSON();
	if(node.studentWork != null) {
		this.states = node.studentWork; 
	} else {
		this.states = [];  
	};
	var d = new Date();
	this.timestamp = d.getTime();

};

/**
 * Find the previous models for all the steps that have the given tag and occur
 * before the current step in the project
 * @param tagName the tag name
 * @param functionArgs the arguments to this function
 * @returns the results from the check, the result object
 * contains an array of previous saved models
 */
Box2dModel.prototype.checkPreviousModelsForTags = function(tagName, functionArgs) {
	//default values for the result
	var result = {
		"previousModels":[]
	};
	
	if (typeof this.view.getProject != "undefined")
	{
		//the node ids of the steps that come before the current step and have the given tag
		var nodeIds = this.view.getProject().getPreviousNodeIdsByTag(tagName, this.node.id);
		if(nodeIds != null) {
			//loop through all the node ids that come before the current step and have the given tag
			for(var x=0; x<nodeIds.length; x++) {
				//get a node id
				var nodeId = nodeIds[x];
				
				if(nodeId != null) {
					//get the latest work for the node
					var latestWork = this.view.state.getLatestWorkByNodeId(nodeId);
					//console.log(latestWork, latestWork.response.savedModels, result.previousModels,  result.previousModels.concat(latestWork.response.savedModels))
					result.previousModels = result.previousModels.concat(latestWork.response.savedModels);					
				}
			}
		}		
	}
	return result;
};


/**
 * This function renders everything the student sees when they visit the step.
 * This includes setting up the html ui elements as well as reloading any
 * previous work the student has submitted when they previously worked on this
 * step, if any.
 * 
 * TODO: rename Box2dModel
 * 
 * note: you do not have to use 'promptDiv' or 'studentResponseTextArea', they
 * are just provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at box2dModel.html).
 */
Box2dModel.prototype.render = function() {
	//display any prompts to the student
	$('#promptDiv').html(this.content.prompt);
	
	var previousModels = [];
	//process the tag maps if we are not in authoring mode
	if(typeof this.view.authoringMode === "undefined" || this.view.authoringMode == null || !this.view.authoringMode) {
		var tagMapResults = this.processTagMaps();
		//get the result values
		previousModels = tagMapResults.previousModels;
		
	}

	//load any previous responses the student submitted for this step
	var latestState = this.getLatestState();
	
	if(latestState != null) {
		/*
		 * get the response from the latest state. the response variable is
		 * just provided as an example. you may use whatever variables you
		 * would like from the state object (look at box2dModelState.js)
		 */
		var latestResponse = latestState.response;
		previousModels = previousModels.concat(latestResponse.savedModels);
		
		
		//set the previous student work into the text area
		$('#studentResponseTextArea').val(latestResponse); 
	}


	// setup the event logger and feedbacker
	if (typeof this.content.feedbackEvents != "undefined"){
		this.feedbackManager =  new FeedbackManager(this.node, this.content.feedbackEvents, this.node.customEventTypes) ;
	} else {
		this.feedbackManager =  new FeedbackManager(this.node, [], this.node.customEventTypes) ;
		this.node.setCompleted();
	}

	if (typeof tester == "undefined" || tester == null){ 
		init(box2dModel.content, previousModels.length>0?false:true);
	}
	//eventManager.fire("box2dInit", [{}], this);
	eventManager.fire('pushStudentWork', {});
	
	for (var i = 0; i < previousModels.length; i++)
	{
		createObject(previousModels[i]);
	}
	
	
};

/**
 * Process the tag maps and obtain the results
 * @return an object containing the results from processing the
 * tag maps. the object contains two fields
 * enableStep
 * message
 */
Box2dModel.prototype.processTagMaps = function() {
	
	var previousModels = [];
	//the tag maps
	var tagMaps = this.node.tagMaps;
	//check if there are any tag maps
	if(tagMaps != null) {
		
		//loop through all the tag maps
		for(var x=0; x<tagMaps.length; x++) {
			
			//get a tag map
			var tagMapObject = tagMaps[x];
			
			if(tagMapObject != null) {
				//get the variables for the tag map
				var tagName = tagMapObject.tagName;
				var functionName = tagMapObject.functionName;
				var functionArgs = tagMapObject.functionArgs;
				
				if(functionName == "getPreviousModels") {
					
					//get the result of the check
					var result = this.checkPreviousModelsForTags(tagName, functionArgs);					
					previousModels = previousModels.concat(result.previousModels);
				} 
			}
		}
	}
	
	//put the variables in an object so we can return multiple variables
	var returnObject = {
		"previousModels":previousModels
	};
	
	return returnObject;
};

/**
 * This function retrieves the latest student work
 * 
 * TODO: rename Box2dModel
 * 
 * @return the latest state object or null if the student has never submitted
 * work for this step
 */
Box2dModel.prototype.getLatestState = function() {
	var latestState = null;
	
	//check if the states array has any elements
	if(this.states != null && this.states.length > 0) {
		//get the last state
		latestState = this.states[this.states.length - 1];
	}
	
	return latestState;
};



/**
 * When an event that is exclusive to Box2dModel is fired it is interpreted here.
 * @param type, args, obj
 * @return 
 */
Box2dModel.prototype.interpretEvent = function(type, args, obj) {
	evt = {};
	evt.type = type;
	evt.args = args;
	var d = new Date();
	evt.time = d.getTime() - this.timestamp;
	evt.ModelDataDescriptions = {};
	evt.ModelDataDescriptions.DataSeriesDescription = [];
	evt.ModelDataDescriptions.ComputationalInputs = [];
	evt.ModelDataDescriptions.ComputationalOutputs = [];
	evt.ModelData = {};
	evt.ModelData.DataSeries = [];
	evt.ModelData.ComputationalInputValues = [];
	evt.ModelData.ComputationalOutputValues = [];
	evt.ObjectProperties = {};

	var mass_on_left, mass_on_right, mass_diff;
	// for the following types there is a central object, set its properties
	if (evt.type == "make-model" || evt.type == "delete-model" || evt.type == "add-balance-world" || evt.type == "add-balance" || evt.type == "add-scale" || evt.type == "add-scale-world" || evt.type == "remove-scale" ||
		evt.type == "remove-balance"  || evt.type == "add-beaker-world" || evt.type == "add-beaker" || evt.type == "test-scale-1" || evt.type == "test-add-beaker" || evt.type == "remove-beaker" || evt.type == "test-release-beaker" || evt.type == "press-release-beaker"){
		evt.ObjectProperties.id = evt.args[0].id;
		evt.ObjectProperties.mass = evt.args[0].mass;
		evt.ObjectProperties.volume = evt.args[0].volume;
		evt.ObjectProperties.density = evt.args[0].mass/ evt.args[0].volume;
		evt.ObjectProperties.is_container = typeof evt.args[0].is_container != "undefined"? evt.args[0].is_container : false;
		if (evt.ObjectProperties.is_container){
			evt.ObjectProperties.liquid_perc_volume = evt.args[0].liquid_perc_volume;
			evt.ObjectProperties.liquid_mass = evt.args[0].liquid_mass;
			evt.ObjectProperties.liquid_volume = evt.args[0].liquid_volume;
		} else {
			evt.ObjectProperties.liquid_perc_volume = 0;
			evt.ObjectProperties.liquid_mass = 0;
			evt.ObjectProperties.liquid_volume = 0;
		}
	}

	// when saved from a higher level function (i.e., not making use of event type, save objects in library)
	if (evt.type == "make-model" || evt.type == "delete-model")
    {
    	
		evt.ModelDataDescriptions.ComputationalInputs = 
		[
			{"label":"object-id", "units":"", "min":0, "max":1000},
			{"label":"object-mass", "units":"g", "min":0, "max":100000},
			{"label":"object-volume", "units":"cm^3", "min":0, "max":100000}		
		];
		evt.ModelData.ComputationalInputValues =
		[evt.args[0].id, evt.args[0].mass, evt.args[0].volume];
	
	} else if (evt.type == "test-balance-1to1")
	{
		evt.ModelDataDescriptions.ComputationalInputs = 
		[
			{"label":"objects-left-mass", "units":"g", "min":0, "max":100000},
			{"label":"objects-right-mass", "units":"g", "min":0, "max":100000},
			{"label":"object-left-id", "units":"", "min":0, "max":1000},
			{"label":"object-left-mass", "units":"g", "min":0, "max":100000},
			{"label":"object-left-volume", "units":"cm^3", "min":0, "max":100000},
			{"label":"object-right-id", "units":"", "min":0, "max":1000},
			{"label":"object-right-mass", "units":"g", "min":0, "max":100000},
			{"label":"object-right-volume", "units":"cm^3", "min":0, "max":100000}			
		];
		mass_on_left = evt.args[0].mass;
		mass_on_right = evt.args[1].mass;
		mass_diff = mass_on_right - mass_on_left;
		evt.ModelData.ComputationalInputValues =
		[mass_on_left, mass_on_right, evt.args[0].id, evt.args[0].mass, evt.args[0].volume, evt.args[1].id, evt.args[1].mass, evt.args[1].volume];
	
		evt.ModelDataDescriptions.ComputationalOutputs = 
		[
			{"label":"balance-state", "units":"", "min":-1, "max":1},
			{"label":"balance-mass-difference", "units":"g", "min":-1000, "max":1000},			
		];
		evt.ModelData.ComputationalOutputValues = 
		[mass_diff < -.001 ? -1 : (mass_diff > .001 ? 1 : 0), mass_diff];
 
	} else if (evt.type == "test-balance-1toN")
	{
		evt.ModelDataDescriptions.ComputationalInputs = 
		[
			{"label":"objects-left-mass", "units":"g", "min":0, "max":100000},
			{"label":"objects-right-mass", "units":"g", "min":0, "max":100000},
			{"label":"object-left-id", "units":"", "min":0, "max":1000},
			{"label":"object-left-mass", "units":"g", "min":0, "max":100000},	
			{"label":"object-left-volume", "units":"cm^3", "min":0, "max":100000}	
		];
		mass_on_left = evt.args[0].mass;
		mass_on_right = evt.args[1];
		mass_diff = mass_on_right - mass_on_left;
		evt.ModelData.ComputationalInputValues =
		[mass_on_left, mass_on_right, evt.args[0].id, evt.args[0].mass, evt.args[0].volume];
	
		evt.ModelDataDescriptions.ComputationalOutputs = 
		[
			{"label":"balance-state", "units":"", "min":-1, "max":1},
			{"label":"balance-mass-difference", "units":"g", "min":-1000, "max":1000}		
		]
		evt.ModelData.ComputationalOutputValues = 
		[mass_diff < -.001 ? -1 : (mass_diff > .001 ? 1 : 0), mass_diff]; 
	} else if (evt.type == "test-balance-Nto1")
	{
		evt.ModelDataDescriptions.ComputationalInputs = 
		[
			{"label":"objects-left-mass", "units":"g", "min":0, "max":100000},
			{"label":"objects-right-mass", "units":"g", "min":0, "max":100000},
			{"label":"object-right-id", "units":"", "min":0, "max":1000},
			{"label":"object-right-mass", "units":"g", "min":0, "max":100000},
			{"label":"object-right-volume", "units":"cm^3", "min":0, "max":100000}				
		];
		mass_on_left = evt.args[0];
		mass_on_right = evt.args[1].mass;
		mass_diff = mass_on_right - mass_on_left;
		evt.ModelData.ComputationalInputValues =
		[mass_on_left, mass_on_right, evt.args[1].id, evt.args[1].mass, evt.args[1].volume];
	
		evt.ModelDataDescriptions.ComputationalOutputs = 
		[
			{"label":"balance-state", "units":"", "min":-1, "max":1},
			{"label":"balance-mass-difference", "units":"g", "min":-1000, "max":1000}		
		];
		evt.ModelData.ComputationalOutputValues = 
		[mass_diff < -.001 ? -1 : (mass_diff > .001 ? 1 : 0), mass_diff];
 
	} else if (evt.type == "test-balance-NtoN")
	{
		evt.ModelDataDescriptions.ComputationalInputs = 
		[
			{"label":"objects-left-mass", "units":"g", "min":0, "max":100000},
			{"label":"objects-right-mass", "units":"g", "min":0, "max":100000}		
		];
		mass_on_left = evt.args[0];
		mass_on_right = evt.args[1];
		mass_diff = mass_on_right - mass_on_left;
		evt.ModelData.ComputationalInputValues =
		[mass_on_left, mass_on_right];
	
		evt.ModelDataDescriptions.ComputationalOutputs = 
		[
			{"label":"balance-state", "units":"", "min":-1, "max":1},
			{"label":"balance-mass-difference", "units":"g", "min":-1000, "max":1000}			
		];
		evt.ModelData.ComputationalOutputValues = 
		[mass_diff < -.001 ? -1 : (mass_diff > .001 ? 1 : 0), mass_diff];
 
	} else if (evt.type == "test-release-beaker" || evt.type == "press-release-beaker"){
		evt.perc_filled_in_spilloff_container = typeof evt.args[1] == "undefined"? 0: evt.args[1].perc_filled_in_spilloff_container;
	} else if (evt.type == "test-add-beaker"){
		evt.displacement = evt.args[1].displacement;
	} else if (evt.type == "gave-feedback"){
		evt.feedbackEvent = evt.args[0];
	}
	var isStepCompleted = true;
	// delete args
	delete evt.args;
	// run event through feedback manager
	if (typeof obj.feedbackManager != "undefined" && obj.feedbackManager != null && evt.type != "gave-feedback"){
		 var f = obj.feedbackManager.checkEvent(evt);
		 if (f != null){
		 	eventManager.fire("gave-feedback",[f]);
		 }

		 isStepCompleted = obj.feedbackManager.completed;
		 // trick to get student constraints to end
		 if (isStepCompleted){eventManager.fire('pushStudentWork', {});}
	}

	// save on a test
	if (evt.type.substr(0,4) == "test"){
		obj.save();
	}	
}



/**
 * This function retrieves the student work from the html ui, creates a state
 * object to represent the student work, and then saves the student work.
 * 
 * TODO: rename Box2dModel
 * 
 * note: you do not have to use 'studentResponseTextArea', they are just 
 * provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at box2dModel.html).
 */
Box2dModel.prototype.save = function() {
	//get the answer the student wrote
	//var response = $('#studentResponseTextArea').val();
	//if (typeof evt === "undefined") evt = {"type":"server"};

	var response = {};
	//load with objects from library
	response.savedModels = [];
	//response.evt = evt;
	// when saved from a higher level function (i.e., not making use of event type, save objects in library)
	//if (evt.type == "make-model" || evt.type == "delete-model")
    //{
    	// save all the models stored in the library    

		for (var i = 0; i < GLOBAL_PARAMETERS.objectLibrary.length; i++)
		{
			if (response.savedModels.length > 12) break; // just in case

			var o =  GLOBAL_PARAMETERS.objectLibrary[i];
			if (typeof o.is_deleted == "undefined" || !o.is_deleted)
			{
				response.savedModels.push(o);
			}
		}	
	// save event history
	response.history = this.feedbackManager.getHistory(25000);
	console.log("---------------------- SAVING appx length -----------------------", (JSON.stringify(response.history).length+JSON.stringify(response.savedModels).length)*2);
	//} 
	//go thro
	/*
	 * create the student state that will store the new work the student
	 * just submitted
	 * 
	 * TODO: rename Box2dModelState
	 * 
	 * make sure you rename Box2dModelState to the state object type
	 * that you will use for representing student data for this
	 * type of step. copy and modify the file below
	 * 
	 * vlewrapper/WebContent/vle/node/box2dModel/box2dModelState.js
	 * 
	 * and use the object defined in your new state.js file instead
	 * of Box2dModelState. for example if you are creating a new
	 * quiz step type you would copy the file above to
	 * 
	 * vlewrapper/WebContent/vle/node/quiz/quizState.js
	 * 
	 * and in that file you would define QuizState and therefore
	 * would change the Box2dModelState to QuizState below
	 */
	var box2dModelState = new Box2dModelState(response);
	/*
	 * fire the event to push this state to the global view.states object.
	 * the student work is saved to the server once they move on to the
	 * next step.
	 */
	eventManager.fire('pushStudentWork', box2dModelState);

	//push the state object into this or object's own copy of states
	this.states.push(box2dModelState);

	return box2dModelState;
};



//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * TODO: rename box2dModel to your new folder name
	 * TODO: rename box2dModel.js
	 * 
	 * e.g. if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/quiz.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/box2dModel/box2dModel.js');
}