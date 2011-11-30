/*
 * This is a template step object that developers can use to create new
 * step types.
 * 
 * xTODO: Copy this file and rename it to
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
 * xTODO: in this file, change all occurrences of the word 'TEMPLATE' to the
 * name of your new step type
 * 
 * <new step type>
 * e.g. for example if you are creating a quiz step it would look
 * something like QUIZ
 */

/**
 * This is the constructor for the object that will perform the logic for
 * the step when the students work on it. An instance of this object will
 * be created in the .html for this step (look at template.html)
 * @constructor
 * xTODO: rename TEMPLATE
 */
function ExplanationBuilder(node, view) {
	this.node = node;
	this.view = view;
	this.content = node.getContent().getContentJSON();

	if(node.studentWork != null) {
		this.states = node.studentWork; 
	} else {
		this.states = [];  
	};

	//var studentExplanation;
	this.ideaBasket;
	this.basketChanged = false;
	this.stateChanged = false;
	
	this.question = '';
	this.instructions = '';
	this.bg = '';
	this.latestState;
	
	//the max background height
	this.maxBackgroundHeightWithoutResponseBox = 480;
	this.maxBackgroundHeightWithResponseBox = 320;
	
	//the max drop area height
	this.maxDropAreaHeightWithoutResponseBox = 460;
	this.maxDropAreaHeightWithResponseBox = 300;
	
	//the background dimensions
	this.backgroundWidth = 680;
	this.backgroundHeight = this.maxBackgroundHeightWithoutResponseBox;
	
	/*
	 * the drop area dimensions, this is smaller than the background dimensions
	 * because we do not want the student ideas to spill out of the drop area
	 */
	this.dropAreaWidth = 515;
	this.dropAreaHeight = this.maxDropAreaHeightWithoutResponseBox;
	
	if(this.content.enableStudentTextArea == null || this.content.enableStudentTextArea) {
		//we are displaying the student text area (aka response box) so we need to use a smaller height
		this.backgroundHeight = this.maxBackgroundHeightWithResponseBox;
		this.dropAreaHeight = this.maxDropAreaHeightWithResponseBox;		
	}
};

/**
 * This function renders everything the student sees when they visit the step.
 * This includes setting up the html ui elements as well as reloading any
 * previous work the student has submitted when they previously worked on this
 * step, if any.
 * 
 * xTODO: rename TEMPLATE
 * 
 * note: you do not have to use 'promptDiv' or 'studentResponseTextArea', they
 * are just provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at template.html).
 */
ExplanationBuilder.prototype.render = function() {
	//get the question or prompt the student will read
	var question = this.content.prompt;
	
	//get the instructions the stuent will read
	var instructions = this.content.instructions;
	
	//get the background image that will be displayed in the drop area
	var bg = this.content.background;
	
	if(question != null){
		this.question = question;
		$('#questionText').text(question);
	}
	
	if(instructions != null) {
		this.instructions = instructions;
		$('#instructions').html(instructions);
	}
	
	if(this.content.enableStudentTextArea == null || this.content.enableStudentTextArea) {
		/*
		 * previous instances of the eb step did not have this field
		 * so we will display the student text area if it is null
		 * or if it is set to true
		 */
		
		//show the student text area
		$('#answer').show();
		
		//set the height to the smaller value since we will show the student text area
		this.backgroundHeight = this.maxBackgroundHeightWithResponseBox;
		
		//resize the idea drop area
		$('#explanationIdeas').css('height', this.backgroundHeight + 'px');
		
		//set the max drop area height
		this.dropAreaHeight = this.maxDropAreaHeightWithResponseBox;
	} else {
		//we do not want to display the student text are
		
		//hide the student text area
		$('#answer').hide();
		
		//set the height to the larger size since we do not need to show the student text area
		this.backgroundHeight = this.maxBackgroundHeightWithoutResponseBox;
		
		//resize the idea drop area
		$('#explanationIdeas').css('height', this.backgroundHeight + 'px');
		
		//set the max drop area height
		this.dropAreaHeight = this.maxDropAreaHeightWithoutResponseBox;
	}
	
	if(bg){
		this.bg = bg;
		$('#explanationIdeas').css('background-image','url(' + bg + ')');
		$('#explanationIdeas').css('background-repeat','no-repeat');
		$('#explanationIdeas').css('background-position','left top');
	}

	//initialize the UI and load the idea basket
	this.initializeUI();
};

/**
 * Initialize the UI and load the idea basket and explanation ideas
 * the student has used
 */
ExplanationBuilder.prototype.initializeUI = function() {
	//get the ideaBasket from the view
	this.ideaBasket = this.view.ideaBasket;

	$('#ideaDialog').dialog({title:'Add New Idea to Basket', autoOpen:false, modal:true, resizable:false, width:'470', buttons:{
		"OK": function(){       
		if($("#ideaForm").validate().form()){
			var source = $('#source').val();
			if(source == 'empty'){
				alert('Please select a source for your idea.');
			} else {
				if(source=='Other'){
					source = 'Other: ' + $('#other').val();
				}
				explanationBuilder.add($('#text').val(),source,$('#tags').val(),$("input[name='flag']:checked").val());
				$(this).dialog("close");
				resetForm('ideaForm');
			}
		}
	}, Cancel: function(){
		$(this).dialog("close");
		resetForm('ideaForm');
	}
	} });

	$('#addNew').click(function(){
		$('#ideaDialog').dialog('open');
	});
	
	$('textarea#text, textarea#editText').keyup(function() {
        var len = this.value.length;
        if (len >= 150) {
            this.value = this.value.substring(0, 150);
        }
    });

	//get the question or prompt the student will read
	var question = this.content.prompt;
	
	//get the instructions the student will read
	var instructions = this.content.instructions;
	
	//get the background image that will be displayed in the drop area
	var bg = this.content.background;

	var explanationIdeas = [];
	var answer = "";

	//get the latest state
	var latestState = this.getLatestState();
	this.latestState = latestState;
	
	if(latestState != null) {
		//get the ideas the student used last time
		explanationIdeas = latestState.explanationIdeas;
		
		//get the answer the student typed last time
		answer = latestState.answer;		
	}

	//load idea basket, the explanation ideas, and other elements of the UI
	this.load(question, instructions, bg, explanationIdeas, answer);
};

/**
 * This function retrieves the latest student work
 * 
 * xTODO: rename TEMPLATE
 * 
 * @return the latest state object or null if the student has never submitted
 * work for this step
 */
ExplanationBuilder.prototype.getLatestState = function() {
	var latestState = null;

	//check if the states array has any elements
	if(this.states != null && this.states.length > 0) {
		//get the last state
		latestState = this.states[this.states.length - 1];
	}

	return latestState;
};

/**
 * This function retrieves the student work from the html ui, creates a state
 * object to represent the student work, and then saves the student work.
 * 
 * xTODO: rename TEMPLATE
 * 
 * note: you do not have to use 'studentResponseTextArea', they are just 
 * provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at template.html).
 */
ExplanationBuilder.prototype.save = function() {
	//if the vle does not have the basket we will not save the student work for this step
	if(this.view.ideaBasket) {
		//the vle has the basket so we will save the student work
		
		//get the answer the student wrote
		var answer = $('#explanationText').val();
		
		//get the last state that was submitted (the previous time the student worked on this step)
		if(this.latestState != null) {
			if(this.latestState.answer != answer) {
				//the answer has changed since last time
				this.stateChanged = true;
			}
		}
		
		//check if the student has changed anything in this step
		if(this.stateChanged == true) {
			/*
			 * create the student state that will store the new work the student
			 * just submitted
			 * 
			 * xTODO: rename TEMPLATESTATE
			 * 
			 * make sure you rename TEMPLATESTATE to the state object type
			 * that you will use for representing student data for this
			 * type of step. copy and modify the file below
			 * 
			 * vlewrapper/WebContent/vle/node/template/templatestate.js
			 * 
			 * and use the object defined in your new state.js file instead
			 * of TEMPLATESTATE. for example if you are creating a new
			 * quiz step type you would copy the file above to
			 * 
			 * vlewrapper/WebContent/vle/node/quiz/quizstate.js
			 * 
			 * and in that file you would define QUIZSTATE and therefore
			 * would change the TEMPLATESTATE to QUIZSTATE below
			 */
			var explanationBuilderState = new ExplanationBuilderState(this.explanationIdeas, $('#explanationText').val(), Date.parse(new Date()));

			/*
			 * fire the event to push this state to the global view.states object.
			 * the student work is saved to the server once they move on to the
			 * next step.
			 */
			eventManager.fire('pushStudentWork', explanationBuilderState);

			//push the state object into this or object's own copy of states
			this.states.push(explanationBuilderState);
		}
		
		if(this.basketChanged == true) {
			//save the basket since it has been changed
			this.ideaBasket.saveIdeaBasket(this.view);
			
			//set this back to false now that we have saved it
			this.basketChanged = false;
		}		
	}
};


function resetForm(target){
	//clear validator messages
	var validator = $("#" + target).validate();
	validator.resetForm();
	//reset form values
	$('#' + target).find(':input').each(function() {
		switch(this.type) {
		case 'password':
		case 'select-multiple':
			//case 'select-one':
		case 'text':
		case 'textarea':
			$(this).val('');
			break;
			//case 'checkbox':
			//case 'radio':
			// this.checked = false;
		}
	});
};


ExplanationBuilder.prototype.init = function(context){
	$('#save').addClass('ui-state-disabled');
	
	$('#explanationText').keyup(function(){
		context.answer = $('#explanationText').val();
		$('#save').removeClass('ui-state-disabled');
		//localStorage.answer = context.answer;
	});
	
	$('#save').click(function(){
		$(this).addClass('ui-state-disabled');
	});

	//set the drop area height
	$('#target').css('height', this.backgroundHeight);
	
	$('#target').droppable({
		scope: 'drag-idea',
		activeClass: 'active',
		//tolerance: 'pointer',
		drop: function(event, ui) {
		var id = ui.helper.find('tr').attr('id');
		id = id.replace('idea','');
		var pos = ui.helper.position();
		var left = pos.left;
		var top = pos.top;
		if (top < 1){
			top = 1;
		}

		if(left < 1){
			left = 1;
		} else if (left > context.dropAreaWidth) {
			left = context.dropAreaWidth;
		}
		context.stateChanged = true;
		context.addExpIdea(context,false,true,id,left,top);
	}
	});

	$('#ideasWrapper').droppable({
		scope: 'used-idea',
		activeClass: 'active',
		hoverClass: 'hover',
		//tolerance: 'pointer',
		drop: function(event, ui) {
		var id = ui.helper.attr('id');
		id = id.replace('explanationIdea','');
		if(ui.helper.hasClass('selected')){
			$.each(context.selected, function(index,value){
				if(value==id){
					context.selected.splice(index,1);
				}
			});
			if(context.selected.length<1){
				$('#colorPicker').fadeOut();
			}
		}
		
		context.removeExpIdea(context,id);
	}
	});

	// set up color picker
	var colors = ['rgb(38, 84, 207)','rgb(0, 153, 51)','rgb(204, 51, 51)','rgb(204, 102, 0)','rgb(153, 102, 255)','rgb(153, 51, 51)'];
	var elements = '';
	$.each(colors, function(index,value){
		elements += '<div class="color" style="background-color:' + value + '"></div>';
	});
	$('#colorPicker').html(elements);

	$('.color').click(function(){
		$('.color').removeClass('current');
		$(this).addClass('current');
		var color = $(this).css('background-color');
		$(context.selected).each(function(index,value){
			$('#explanationIdea' + value).css('background-color',color);
			context.updateExpIdea(value,null,null,color);
		});
	});

	$('#explanation').click(function(event){
		if($(event.target).attr('id')=='target' || $(event.target).attr('id')=='explanationText'){
			$('.exIdea').removeClass('selected');
			$('#colorPicker').fadeOut();
		}
	});
};

ExplanationBuilder.prototype.load = function(question, instructions, bg, explanationIdeas, answer){
	if(question != null){
		this.question = question;
		$('#questionText').text(question);
		//localStorage.question = question;
	}
	
	if(instructions != null) {
		this.instructions = instructions;
		$('#instructions').html(instructions);
	}
	
	if(bg){
		this.bg = bg;
		$('#explanationIdeas').css('background-image','url(' + bg + ')');
		$('#explanationIdeas').css('background-repeat','no-repeat');
		$('#explanationIdeas').css('background-position','left top');
		//localStorage.bg = bg;
	}

	if(answer){
		this.answer = answer;
		$('#explanationText').val(answer);
		//localStorage.answer = answer;
	} else {
		//localStorage.answer = '';
	}

	// clear out existing rows and explanation ideas
	$('#activeIdeas tbody tr').each(function(){
		$(this).remove();
	});

	$('.exIdea').remove();

	if(this.view.authoringMode) {
		//we are in preview step so we will create a dummy idea basket
		this.ideaBasket = new IdeaBasket('{"ideas":[],"deleted":[],"nextIdeaId":1,"id":-1,"runId":-1,"workgroupId":-1,"projectId":-1}');
	}
	
	if(this.ideaBasket == null) {
		//we do not have the basket
		
		/*
		 * display a message to the student and disable the buttons 
		 * and textarea so the student can't work on the step
		 */
		alert("Error: Failed to retrieve Idea Basket, you will not be able to work on this step, reload this step or refresh the VLE to try to load it again", 3);
		$('#addNew').attr('disabled', 'disabled');
		$('#save').attr('disabled', 'disabled');
		$('#explanationText').attr('disabled', 'disabled');
	} else {
		//we have the basket
		
		//loop through all the ideas in the basket
		for(var i=0; i<this.ideaBasket.ideas.length; i++){
			//add the idea to the display where we show all the ideas in the basket
			this.addRow(this.ideaBasket.ideas[i],true);
		}
		
		if(explanationIdeas){
			//loop through all the ideas that the student has used (dragged to the right)
			for (var a=0; a<explanationIdeas.length; a++){
				//get the attributes
				var id = explanationIdeas[a].id;
				var left = explanationIdeas[a].xpos;
				var top = explanationIdeas[a].ypos;
				var color = explanationIdeas[a].color;
				var lastAcceptedText = null;
				
				if(explanationIdeas[a].lastAcceptedText){
					//get the last accepted text
					lastAcceptedText = explanationIdeas[a].lastAcceptedText;
				} else {
					//get the text from the basket
					var idea = this.ideaBasket.getIdeaById(id);
					var ideaText = idea.text;
					explanationIdeas[a].lastAcceptedText = ideaText;
					lastAcceptedText = ideaText;
				}
				
				//determine if the idea is active or in the trash
				var isActive = this.ideaBasket.isIdeaActive(id);
				
				//add the explanation idea to 
				this.addExpIdea(this,true,isActive,id,left,top,color,lastAcceptedText);
			}
			
			this.explanationIdeas = explanationIdeas;
		}
	}

	$('#colorPicker').hide();
	$('.exIdea').removeClass('selected');

	this.selected = [];

	this.init(this);
};

ExplanationBuilder.prototype.add = function(text,source,tags,flag) {
	//get the values for the current step
	var nodeId = this.view.getCurrentNode().id;
	var nodeName = this.view.getCurrentNode().getTitle();
	var vlePosition = this.view.getProject().getVLEPositionById(nodeId);
	nodeName = vlePosition + ": " + nodeName;
	
	var newIdea = this.ideaBasket.addIdeaToBasketArray(text,source,tags,flag,nodeId,nodeName);
	this.ideaBasket.index++;
	//this.ideaBasket.ideas.splice(0, 0, newIdea);
	this.basketChanged = true;
	this.addRow(newIdea);
	//this.updateOrder();
	//localStorage.ideas = JSON.stringify(basket.ideas);
	//localStorage.index = JSON.stringify(basket.index);
};

ExplanationBuilder.prototype.addRow = function(idea,load){
	var title = 'Click and drag to add to idea space, Double click to edit';
	var text = idea.text.replace(new RegExp("(\\w{" + 25 + "})(?=\\w)", "g"), "$1<wbr>");
	/*if(idea.tags && idea.tags != 'undefined'){
		var tags = idea.tags;
	} else {
		var tags = '';
	}*/
	if(idea.flag && idea.flag != 'undefined'){
		var flag = idea.flag;
	} else {
		var flag = '';
	}

	var html = '<tr id="idea' + idea.id + '" title="' + title + '"><td>' + text + '</td><td style="text-align:center;"><span title="' + idea.flag + '" class="' + idea.flag + '"></span>';

	$('#activeIdeas tbody').prepend(html);

	var $newTr = $('#idea' + idea.id);
	//var $newLink = $('#' + currTable + idea.id + ' span.' + link);

	if(!load){
		$newTr.effect("pulsate", { times:2 }, 500);
	}

	this.makeDraggable(this,$newTr);

	if(this.ideaBasket.ideas.length>0) {
		$('#ideasEmpty').hide();
	} else {
		$('#ideasEmpty').show();
	}
};

ExplanationBuilder.prototype.edit = function(index,text,source,tags,flag,textChanged) {
	var title = 'Click and drag to add to idea space, Double click to edit';
	var id;
	var idea;
	for(var i=0; i<this.ideaBasket.ideas.length; i++){
		if(this.ideaBasket.ideas[i].id == index){
			id = this.ideaBasket.ideas[i].id;
			var $tr = $('#idea' + id);
			this.ideaBasket.ideas[i].text = text;
			this.ideaBasket.ideas[i].source = source;
			this.ideaBasket.ideas[i].tags = tags;
			this.ideaBasket.ideas[i].flag = flag;
			
			//get the current time
			var newDate = new Date();
			var time = newDate.getTime();
			
			//update the timeLastEdited
			this.ideaBasket.ideas[i].timeLastEdited = time;
			
			idea = this.ideaBasket.ideas[i];
			var text = this.ideaBasket.ideas[i].text.replace(new RegExp("(\\w{" + 25 + "})(?=\\w)", "g"), "$1<wbr>");
			//if($tr){
			$tr.html('<td>' + text + '</td><td>' + '<span title="' + idea.flag + '" class="' + idea.flag + '"></span></td>');
			$tr.effect("pulsate", { times:2 }, 500);
			if($tr.hasClass('ui-draggable-disabled')){
				setTimeout(function(){
					$tr.css('opacity','.5');
				},1200);
			}
			//}
			this.basketChanged = true;
			//localStorage.ideas = JSON.stringify(basket.ideas);
			break;
		}
	}
	if(textChanged){ // set lastAcceptedText of exp idea to idea's current text
		for (var i=0; i<this.explanationIdeas.length; i++){
			if(this.explanationIdeas[i].id == index){
				this.updateExpIdea(id,null,null,null,text);
				break;
			}
		}
	}
};

ExplanationBuilder.prototype.updateOrder = function(){
	var newOrder = [];
	var $tr = $('#activeIdeas tbody tr');
	var data = this.ideaBasket.ideas;
	var regex = 'idea';

	$tr.each(function(){
		var id = $(this).attr('id');
		id = id.replace(regex,'');
		id = parseInt(id);
		for(var i=0; i<data.length; i++){
			if (data[i].id == id){
				newOrder.push(data[i]);
				break;
			}
		}
	});
	this.ideaBasket.ideas = newOrder;
	//localStorage.ideas = JSON.stringify(newOrder);
};

ExplanationBuilder.prototype.makeDraggable = function(context,$target) {
	$target.draggable({
		helper: function(event) {
		return $('<div class="drag-idea"><table class="tablesorter" style="width:260px;"></table></div>').find('table').append($(event.target).closest('tr').clone()).end().insertAfter($('#target'));
	},
	start: function(event){
		$(event.target).addClass('drag');
	},
	stop: function(event){
		$(event.target).removeClass('drag');
	},
	cursor: 'pointer',
	scope: 'drag-idea'
		//revert: 'invalid'
	});
	
	
	// open edit dialog on double click
	$target.dblclick(function(){
		var $clicked = $(this);
		var id = $(this).attr('id');
		id = id.replace('idea','');
		var text = '';
		id = parseInt(id);

		//populate edit form fields
		var text = context.populateEditForm(context,id,true);
		
		// open edit dialog
		$('#editDialog').dialog({ title:'Edit Your Idea', modal:true, resizable:false, width:'470', buttons:{
			"OK": function(){       
				if($("#editForm").validate().form()){
					var answer = false;
					var textChanged = false;
					if($('#editSource').val() == 'empty'){
						alert('Please select a source for your idea.');
					} else {
						if($('#editText').val() != text){ // check if the idea text has changed
							textChanged = true; // idea text has changed
							answer = context.checkIfIdeaUsed(id); // check if idea is being used in any explanation builder steps (returns true by default)
						} else {
							answer = true;
						}
					
						if(answer) {
							var source = $('#editSource').val();
							if(source=='Other'){
								source = 'Other: ' + $('#editOther').val();
							}
							context.edit(id,$('#editText').val(),source,$('#editTags').val(),$("input[name='editFlag']:checked").val(),textChanged);
							$(this).dialog("close");
							resetForm('editForm');
						}
					}
				}
			}, Cancel: function(){
				$(this).dialog("close");
				resetForm('editForm');
			}
		} });
	});
};

/**
 * Check if the idea is being used in any explanation builder steps (excluding the current step),
 * if it is, we will display a confirmation popup that asks the
 * student if they're sure they want to edit the idea. if the
 * idea is not being used in an eb step it will return true
 * by default.
 * @param id the id of the idea
 * @return whether the student confirmed that they still want
 * to edit the idea. if the idea is not being used in an
 * explanation builder step, we will not display the popup
 * and will just return true
 */
ExplanationBuilder.prototype.checkIfIdeaUsed = function(id) {
	// TODO: ignore current node in this check
	var answer = true;
	var idea = this.ideaBasket.getIdeaById(id);
	var stepsUsedIn = idea.stepsUsedIn;
	var isUsed = false;
	var currNodeId = this.view.getCurrentNode().id;
	
	if(stepsUsedIn != null && stepsUsedIn.length > 0) {
		//the student has used this idea in a step
		
		var message = "This idea is currently used in the following steps\n\n";
		
		//loop through all the steps the student has used this idea in
		for(var x=0; x<stepsUsedIn.length; x++) {
			//get the node id
			var nodeId = stepsUsedIn[x];
			
			if(nodeId != currNodeId) { // don't warn if used in current explanation builder node
				isUsed = true;
				
				//get the node
				var node = this.view.getProject().getNodeById(nodeId);
				
				if(node != null) {
					//get the node position
					var vlePosition = this.view.getProject().getVLEPositionById(nodeId);
					
					//get the node title
					var title = node.title;
					
					//add the step to the message
					message += vlePosition + ": " + title + "\n";
				}
			}
		}
		
		message += "\nIf you change this idea, you might want to review your answers in those steps.";
		
		/*
	 	* display the message to the student that notifies them 
	 	* that they will also be changing the idea text in the
	 	* steps that they have used the idea in
	 	*/
		if(isUsed){
			answer = confirm(message);
		}
	}
	
	return answer;
};

ExplanationBuilder.prototype.addExpIdea = function(context,isLoad,isActive,id,left,top,color,lastAcceptedText){
	$('#spacePrompt').hide();
	var text='';
	var ideaText = '';
	var title = '';
	var timeLastEdited = null;
	var timeCreated = null;
	var newIdea;
	var currColor = 'rgb(38, 84, 207)';
	if(color){
		currColor = color;
	}
	var changed = false;
	
	if(isActive){
		for(var i=0; i<this.ideaBasket.ideas.length; i++){
			if(this.ideaBasket.ideas[i].id == id){
				newIdea = new ExplanationIdea(id,left,top,color);
				title = 'Click and drag to move; Click to change color';
				ideaText = this.ideaBasket.ideas[i].text;
				text = '<span title="' + title + '">' + ideaText + '</span>';
				timeLastEdited = this.ideaBasket.ideas[i].timeLastEdited;
				timeCreated = this.ideaBasket.ideas[i].timeCreated;
				
				if(this.latestState != null && timeLastEdited != null && timeCreated != null) {
					if(timeLastEdited == timeCreated) {
						/*
						 * this idea was just created so it's not possible for
						 * the idea to have been previously changed
						 */
					//} else if(this.latestState.timestamp < timeLastEdited) {
					} else if(lastAcceptedText && ideaText != lastAcceptedText) {
						changed = true;
						//the idea has been changed since the idea was used in this step
						text += " <img class='notification' src='/vlewrapper/vle/images/ideaManager/info.png' alt='warn' />" +
							"<div class='tooltip'><div>This idea has <b>changed</b> since you added it to the explanation. What do you want to do?</div>" +
							"<div class='notificationLinks'><a class='notificationLink revise'>Revise</a>" +
							"<a class='notificationLink accept'>Keep</a></div></div>";
					}
				}
				
				//get the current node id
				var nodeId = context.node.id;
				
				//add the node id to this idea's array of stepsUsedIn
				this.addStepUsedIn(id, nodeId);
				
				isActive = true;
				break;
			}
		}
		$('#idea' + id).draggable('disable');
	} else {
		for(var i=0; i<this.ideaBasket.deleted.length; i++){
			if(this.ideaBasket.deleted[i].id == id){
				newIdea = new ExplanationIdea(id,left,top,color);
				title = 'Click and drag to move';
				text = '<span title="' + title + '">' + this.ideaBasket.deleted[i].text + '</span>';
				timeLastEdited = this.ideaBasket.deleted[i].timeLastEdited;
				timeCreated = this.ideaBasket.deleted[i].timeCreated;
				
				// the idea has been deleted since it was used in this step
				text += " <img class='notification' src='/vlewrapper/vle/images/ideaManager/info.png' alt='warn' />" +
					"<div class='tooltip'><div>You have <b>deleted</b> this idea. What do you want to do?</div>" +
					"<div class='notificationLinks'><a class='notificationLink restore'>Restore & Revise</a><a class='notificationLink remove'>Remove</a>" +
					"</div></div>";
				
				//get the current node id
				var nodeId = context.node.id;
				
				//add the node id to this idea's array of stepsUsedIn
				this.addStepUsedIn(id, nodeId);
				
				isDeleted = true;
				break;
			}
		}
		currColor = '#CCCCCC';
	}

	$('.exIdea').removeClass('selected'); // remove any current selection

	$('#target').append('<div class="exIdea" class="selected" id="explanationIdea' + id + '" style="position:absolute; left:' +
			left + 'px; top:' + top + 'px; background-color:' + currColor + '">' + text + '</div>');

	$('#colorPicker').show(); // show color picker

	var bottomBoundary = this.dropAreaHeight - $('#explanationIdea' + id).height();
	if (top > bottomBoundary) {
		top = bottomBoundary;
		$('#explanationIdea' + id).css('top',top);
	};

	if(!isLoad){
		newIdea.lastAcceptedText = ideaText;
		context.explanationIdeas.push(newIdea);
		//localStorage.explanationIdeas = JSON.stringify(context.explanationIdeas);
	}

	if (!isActive){
		context.bindNotificationLinks(context,false,id,ideaText);
	} else {
		// open edit dialog on double click
		$('#explanationIdea' + id).dblclick(function(){
			var $clicked = $(this);
			var id = $(this).attr('id');
			id = id.replace('explanationIdea','');
			var text = '';
			id = parseInt(id);

			//populate edit form fields
			var text = context.populateEditForm(context,id,true);
			
			// open edit dialog
			$('#editDialog').dialog({ title:'Edit Your Idea', modal:true, resizable:false, width:'470', buttons:{
				"OK": function(){       
					if($("#editForm").validate().form()){
						var answer = false;
						var textChanged = false;
						if($('#editSource').val() == 'empty'){
							alert('Please select a source for your idea.');
						} else {
							if($('#editText').val() != text){ // check if the idea text has changed
								textChanged = true; // idea text has changed
								answer = context.checkIfIdeaUsed(id); // check if idea is being used in any explanation builder steps (returns true by default)
							} else {
								answer = true;
							}
						
							if(answer) {
								var source = $('#editSource').val();
								if(source=='Other'){
									source = 'Other: ' + $('#editOther').val();
								}
								context.edit(id,$('#editText').val(),source,$('#editTags').val(),$("input[name='editFlag']:checked").val(),textChanged);
								$(this).dialog("close");
								resetForm('editForm');
							}
						}
					}
				}, Cancel: function(){
					$(this).dialog("close");
					resetForm('editForm');
				}
			} });
		});
	}
	
	if(changed){
		context.bindNotificationLinks(context,true,id,ideaText);
	}

	$('#explanationIdea' + id).click(function(e){
		if (!$(this).is(":animated")) {
			if(!$(this).hasClass('deleted')){
				var id = $(this).attr('id');
				id = id.replace('explanationIdea','');
				var color = $(this).css('background-color');
				if (e.shiftKey) {
					if($(this).hasClass('selected')){
						$(this).removeClass('selected');
						$.each(context.selected,function(index,value){
							if(value==id){
								context.selected.splice(index,1);
							}
						});
						if(context.selected.length<1){
							$('.exIdea').removeClass('selected');
							$('#colorPicker').fadeOut();
						} else if (context.selected.length==1){
							$('.color').removeClass('current');
						}
					} else {
						$('#colorPicker').fadeIn();
						context.selected.push(id);
						$(this).addClass('selected');
						$('.color').removeClass('current');
						if (context.selected.length==1){
							$('.color').each(function(){
								if($(this).css('background-color') == color){
									$(this).addClass('current');
								}
							});
						}
					}
				} else {
					context.selected = [id];
					$('.exIdea').removeClass('selected');
					$(this).addClass('selected');
					$('#colorPicker').fadeIn();
					$('.color').removeClass('current');
					$('.color').each(function(){
						if($(this).css('background-color') == color){
							$(this).addClass('current');
						}
					});
				}
			} else {
				$('#colorPicker').hide();
				$('.exIdea').removeClass('selected');
	
				this.selected = [];
			}
		}
	});

	$('#explanationIdea' + id).draggable({
		//containment: $('#explanationSpace'),
		scope: 'used-idea',
		stop: function(event,ui){
		var pos = $(this).position();
		var left = pos.left;
		var top = pos.top;
		var bottomBoundary = context.dropAreaHeight - $(this).height();
		if (top > bottomBoundary) {
			top = bottomBoundary;
		} else if (top < 1){
			top = 1;
		}

		if(left < 1){
			left = 1;
		} else if (left > context.dropAreaWidth) {
			left = context.dropAreaWidth;
		}

		$(this).css('top', top + 'px');
		$(this).css('left', left + 'px');
		var id = $(this).attr('id');
		id = id.replace('explanationIdea','');
		context.updateExpIdea(id,left,top);
	}
	});

	$('#explanationIdea' + id).click();
};

ExplanationBuilder.prototype.updateExpIdea = function(id,left,top,color,lastAcceptedText){
	this.stateChanged = true;
	for(var i=0; i<this.explanationIdeas.length; i++){
		if(this.explanationIdeas[i].id == id){
			if(left){
				this.explanationIdeas[i].xpos = left;
			}
			if(top){
				this.explanationIdeas[i].ypos = top; 
			}
			if(color){
				this.explanationIdeas[i].color = color;
			}
			if(lastAcceptedText){
				this.explanationIdeas[i].lastAcceptedText = lastAcceptedText;
				//update the text displayed in the explanation idea
				$('#explanationIdea' + id).html(lastAcceptedText);
			}
			//localStorage.explanationIdeas = JSON.stringify(this.explanationIdeas);
			break;
		}
	}
};

ExplanationBuilder.prototype.removeExpIdea = function(context,id){
	this.stateChanged = true;
	for(var i=0; i<this.explanationIdeas.length; i++){
		if(this.explanationIdeas[i].id == id){
			this.explanationIdeas.splice(i,1);
			
			//get the current node id
			var nodeId = context.node.id;
			
			//remove the node id to this idea's array of stepsUsedIn
			this.removeStepUsedIn(id, nodeId);
			
			//localStorage.explanationIdeas = JSON.stringify(this.explanationIdeas);
			break;
		}
	}
	$('#explanationIdea' + id).remove();
	if ($('#idea' + id)){
		$('#idea' + id).draggable('enable');
		$('#idea' + id).effect("pulsate", { times:2 }, 500); 
	}

	if(context.explanationIdeas.length<1){
		$('#spacePrompt').show();
	}
};

/**
 * Binds click actions to notification popup links
 * @param isActive boolean specifying whether idea is in basket or in trash
 * @param id the id of the current idea
 */
ExplanationBuilder.prototype.bindNotificationLinks = function(context,isActive,id,ideaText) {
	$('#explanationIdea' + id + ' img').tooltip({
		relative: true,
		offset: [8,0]
	}).dynamic({ bottom: { direction: 'down'} });
	if(isActive){ // idea is not in trash;
		// set 'revise' click action
		$('#explanationIdea' + id + ' a.revise').click(function(e){
			//populate edit form fields
			var text = context.populateEditForm(context,id,true);

			$('#editDialog').dialog({ title:'Revise Your Idea', modal:true, resizable:false, width:'470', buttons:{
				"OK": function(){
					if($("#editForm").validate().form()){
						var answer = false;
						var textChanged = false;
						if($('#editSource').val() == 'empty'){
							alert('Please select a source for your idea.');
						} else {
							if($('#editText').val() != text){ // check if the idea text has changed
								textChanged = true; // idea text has changed
								answer = context.checkIfIdeaUsed(id); // check if idea is being used in any explanation builder steps (returns true by default)
							} else {
								answer = true;
							}
						
							if(answer) {
								var source = $('#editSource').val();
								if(source=='Other'){
									source = 'Other: ' + $('#editOther').val();
								}
								context.edit(id,$('#editText').val(),source,$('#editTags').val(),$("input[name='editFlag']:checked").val(),true);
								$(this).dialog("close");
								resetForm('editForm');
								//setLastAcceptedText(id);
							}
						}
					}
				}, Cancel: function(){
					$(this).dialog("close");
					resetForm('editForm');
				}
			} });
		});
		
		// set 'accept' click action
		$('#explanationIdea' + id + ' a.accept').click(function(e){
			setLastAcceptedText(id);
			removeNotification();
		});
	} else { // idea is in trash
		$('#explanationIdea' + id).addClass('deleted');
		
		// set 'restore & revise' click action
		$('#explanationIdea' + id + ' a.restore').click(function(e){
			//populate edit form fields
			context.populateEditForm(context,id,false);

			$('#editDialog').dialog({ title:'Revise Your Idea', modal:true, resizable:false, width:'470', buttons:{
				"OK": function(){       
					var source = $('#editSource').val();
					if(source == 'empty'){
						alert('Please select a source for your idea.');
					} else {
						if(source=='Other'){
							source = 'Other: ' + $('#editOther').val();
						}
						var color = context.putBack(id); // move idea out of trash (returns assigned color)
						context.edit(id,$('#editText').val(),source,$('#editTags').val(),$("input[name='editFlag']:checked").val(),true);
						setTimeout(function(){
							$('#idea' + id).css('opacity','.5');
						},1200);
						$('#explanationIdea' + id).css('background-color',color);
						$('#explanationIdea' + id).removeClass('deleted');
						$('#idea' + id).draggable('disable');
						resetForm('editForm');
						//setLastAcceptedText(id);
						$(this).dialog("close");
					}
				}, Cancel: function(){
					$(this).dialog("close");
					resetForm('editForm');
				}
			} });
		});
		
		// set 'remove' click action
		$('#explanationIdea' + id + ' a.remove').click(function(e){
			context.removeExpIdea(context,id);
		});
	}
	
	function removeNotification(){
		$('#explanationIdea' + id + ' .tooltip').fadeOut('medium',function(){
			$('#explanationIdea' + id + ' .tooltip').remove();
		});
		$('#explanationIdea' + id + ' .notification').fadeOut('medium',function(){
			$('#explanationIdea' + id + ' .notification').remove();
		});
	};
	
	function setLastAcceptedText(id){
		for(var i=0; i<context.explanationIdeas.length; i++){
			if(context.explanationIdeas[i].id == id){
				context.explanationIdeas[i].lastAcceptedText = ideaText;
			}
		}
	};
};

/**
 * Add a nodeId to the array of steps that the idea is used in
 * @param ideaId the id of the idea
 * @param nodeId the id of the node
 */
ExplanationBuilder.prototype.addStepUsedIn = function(ideaId, nodeId) {
	//get the idea
	var idea = this.ideaBasket.getIdeaById(ideaId);
	
	if(idea != null) {
		//get the array of steps that the idea is used in
		var stepsUsedIn = idea.stepsUsedIn;
		
		if(stepsUsedIn == null) {
			idea.stepsUsedIn = [];
			stepsUsedIn = idea.stepsUsedIn;
		}
		
		var stepAlreadyAdded = false;
		
		//make sure it is not already in the array of stepsUsedIn
		for(var x=0; x<stepsUsedIn.length; x++) {
			//get a nodeId
			var stepUsedIn = stepsUsedIn[x];
			
			if(stepUsedIn == nodeId) {
				//the nodeId is already in the array
				stepAlreadyAdded = true;
			}
		}
		
		if(!stepAlreadyAdded) {
			//add the nodeId to the array
			stepsUsedIn.push(nodeId);
			this.basketChanged = true;
		}
	}
};

/**
 * Remove a nodeId from the array of steps that the idea is used in
 * @param ideaId the id of the idea
 * @param nodeId the id of the node
 */
ExplanationBuilder.prototype.removeStepUsedIn = function(ideaId, nodeId) {
	//get the idea
	var idea = this.ideaBasket.getIdeaById(ideaId);
	
	if(idea != null) {
		//get the array of steps that the idea is used in
		var stepsUsedIn = idea.stepsUsedIn;
		
		if(stepsUsedIn == null) {
			idea.stepsUsedIn = [];
			stepsUsedIn = idea.stepsUsedIn;
		}
		
		//make sure it is not already in the array of stepsUsedIn
		for(var x=0; x<stepsUsedIn.length; x++) {
			//get a nodeId
			var stepUsedIn = stepsUsedIn[x];
			
			if(stepUsedIn == nodeId) {
				//remove the nodeId from the array
				stepsUsedIn.splice(x, 1);
				
				/*
				 * move the counter back one because we just removed an element
				 * and we want to continue to search the array in case the
				 * nodeId shows up multiple times just to be safe even though
				 * nodeIds should never show up more than once in the stepsUsedIn
				 * array 
				 */
				x--;
				
				this.basketChanged = true;
			}
		}
	}
};

/**
 * Take an idea out of the trash
 * @param index
 * @param $tr
 * @returns explanation idea's color
 */
ExplanationBuilder.prototype.putBack = function(index) {
	for(var i=0; i<this.ideaBasket.deleted.length; i++){
		if(this.ideaBasket.deleted[i].id == index){
			//this.ideas.push(this.deleted[i]);
			this.ideaBasket.ideas.splice(0,0,this.ideaBasket.deleted[i]);
			var idea = this.ideaBasket.deleted[i];
			
			//get the current time
			var newDate = new Date();
			var time = newDate.getTime();
			
			//update the timeLastEdited
			idea.timeLastEdited = time;
			var ideaId = idea.id;
			this.ideaBasket.deleted.splice(i,1);
			this.addRow(idea,true);

			break;
		}
	}
	for(var i=0; i<this.explanationIdeas.length; i++){
		//debugger;
		if(this.explanationIdeas[i].id == index){
			var color = this.explanationIdeas[i].color;
			break;
		}
	}
	this.basketChanged = true;
	this.ideaBasket.updateToolbarCount(true);
	return color;
};

/**
 * Populate edit form fields with current idea info
 * @param context ExplanationBuilder object
  * @param id current idea's id
  * @param active Boolean specifying whether current idea is in basket or has been deleted
 */
ExplanationBuilder.prototype.populateEditForm = function(context,id,active) {
	if(active){
		var ideas = context.ideaBasket.ideas;
	} else {
		var ideas = context.ideaBasket.deleted;
	}
	for(var i=0;i<ideas.length;i++){
		if(ideas[i].id==id){
			text = ideas[i].text;
			$('#editText').val(text);
			if(ideas[i].source.match(/^Other: /)){
				$('#editSource').val("Other");
				$('#editOther').val(ideas[i].source.replace(/^Other: /,''));
				$('#editOtherSource').show();
				$('#editOther').addClass('required');
			} else {
				$('#editSource').val(ideas[i].source);
				$('#editOtherSource').hide();
				$('#editOther').removeClass('required');
			}
			$('#editTags').val(ideas[i].tags);
			$("input[name='editFlag']").each(function(){
				if($(this).attr('value')==ideas[i].flag){
					$(this).attr('checked', true);
				} else {
					$(this).attr('checked', false);
				}
			});
			break;
		}
	}
	return text;
};

/**
 * Reload the step with the new idea basket 
 * @param updatedIdeaBasket the updated idea basket
 */
ExplanationBuilder.prototype.ideaBasketChanged = function(updatedIdeaBasket) {
	//set the new ideaBasket
	this.ideaBasket = updatedIdeaBasket;
	
	//reload everything in the step
	this.load(this.question, this.instructions, this.bg, this.explanationIdeas, this.answer);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * xTODO: rename template to your new folder name
	 * xTODO: rename template.js
	 * 
	 * e.g. if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/quiz.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/explanationbuilder/explanationBuilder.js');
}