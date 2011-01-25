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
 * 
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
	this.bg = '';
	this.latestState;
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
	
	//get the background image that will be displayed in the drop area
	var bg = this.content.background;
	
	if(question){
		this.question = question;
		$('#questionText').text(question);
	}
	if(bg){
		this.bg = bg;
		$('#explanationIdeas').css('background-image','url(' + bg + ')');
		$('#explanationIdeas').css('background-repeat','no-repeat');
		$('#explanationIdeas').css('background-position','center top');
	}
	
	//set the params we will use in the request to the server
	var ideaBasketParams = {
			action:"getIdeaBasket"	
	};

	//request the idea basket from the server
	this.view.connectionManager.request('GET', 3, this.view.getConfig().getConfigParam('getIdeaBasketUrl'), ideaBasketParams, this.initializeUI, {explanationBuilder:this});

};

ExplanationBuilder.prototype.initializeUI = function(responseText, responseXML, args) {
	var thisExplanationBuilder = args.explanationBuilder;

	//parse the idea basket JSON and set it into the view
	var ideaBasketJSONObj = $.parseJSON(responseText);
	thisExplanationBuilder.ideaBasketJSONObj = ideaBasketJSONObj;

	//create an IdeaBasket object from the JSON and set it into the view
	var ideaBasket = new IdeaBasket(ideaBasketJSONObj);
	thisExplanationBuilder.ideaBasket = ideaBasket;

	$('#ideaDialog').dialog({title:'Add New Idea to Basket', autoOpen:false, modal:true, resizable:false, width:'400', buttons:{
		"OK": function(){       
		if($("#ideaForm").validate().form()){
			var source = $('#source').val();
			if(source=='Other'){
				source = 'Other: ' + $('#other').val();
			}
			explanationBuilder.add($('#text').val(),source,$('#tags').val(),$("input[name='flag']:checked").val());
			$(this).dialog("close");
			resetForm('ideaForm');
		}
	}, Cancel: function(){
		$(this).dialog("close");
		resetForm('ideaForm');
	}
	} });

	$('#addNew').click(function(){
		$('#ideaDialog').dialog('open');
	});

	$('#clearDialog').dialog({title:'Empty Basket', autoOpen:false, modal:true, resizable:false, width:'400', buttons:{
		"OK": function(){       
		//localStorage.clear();
		window.location.reload();
	}, Cancel: function(){
		$(this).dialog("close");
	} }
	});

	$('#clear').click(function(){
		$('#clearDialog').dialog('open');
	});

	//loadFromLocal(1);

	//get the question or prompt the student will read
	var question = thisExplanationBuilder.content.prompt;
	
	//get the background image that will be displayed in the drop area
	var bg = thisExplanationBuilder.content.background;

	var explanationIdeas = [];
	var answer = "";

	//get the latest state
	var latestState = thisExplanationBuilder.getLatestState();
	thisExplanationBuilder.latestState = latestState;
	
	if(latestState != null) {
		//get the ideas the student used last time
		explanationIdeas = latestState.explanationIdeas;
		
		//get the answer the student typed last time
		answer = latestState.answer;		
	}

	thisExplanationBuilder.load(question,bg,explanationIdeas,answer);
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

	$('#explanationText').keyup(function(){
		context.answer = $('#explanationText').val();
		//localStorage.answer = context.answer;
	});

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
		} else if (left > 320) {
			left = 320;
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
			context.updateExpIdea(value,null,null,null,color);
		});
	});

	$('#explanation').click(function(event){
		if($(event.target).attr('id')=='target' || $(event.target).attr('id')=='explanationText'){
			$('.exIdea').removeClass('selected');
			$('#colorPicker').fadeOut();
		}
	});
};

ExplanationBuilder.prototype.load = function(question,bg,explanationIdeas,answer){
	if(question){
		this.question = question;
		$('#questionText').text(question);
		//localStorage.question = question;
	}
	if(bg){
		this.bg = bg;
		$('#explanationIdeas').css('background-image','url(' + bg + ')');
		$('#explanationIdeas').css('background-repeat','no-repeat');
		$('#explanationIdeas').css('background-position','center top');
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

	//populate table and explanation ideas
	for(var i=0; i<this.ideaBasket.ideas.length; i++){
		this.addRow(this.ideaBasket.ideas[i],true);
		if(explanationIdeas){
			for (var a=0; a<explanationIdeas.length; a++){
				if(this.ideaBasket.ideas[i].id == explanationIdeas[a].id){
					var id = explanationIdeas[a].id;
					var left = explanationIdeas[a].xpos;
					var top = explanationIdeas[a].ypos;
					var color = explanationIdeas[a].color;
					this.addExpIdea(this,true,true,id,left,top,color);
					break;
				}
			}
		}
	}

	for(var i=0; i<this.ideaBasket.deleted.length; i++){
		if(explanationIdeas){
			for (var a=0; a<explanationIdeas.length; a++){
				if(this.ideaBasket.deleted[i].id == explanationIdeas[a].id){
					var id = explanationIdeas[a].id;
					var left = explanationIdeas[a].xpos;
					var top = explanationIdeas[a].ypos;
					var color = explanationIdeas[a].color;
					this.addExpIdea(this,true,false,id,left,top,color);
					break;
				}
			}
		}
	}

	if(explanationIdeas){
		this.explanationIdeas = explanationIdeas;
		//localStorage.explanationIdeas = JSON.stringify(explanationIdeas);
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
	if(idea.tags && idea.tags != 'undefined'){
		var tags = idea.tags;
	} else {
		var tags = '';
	}

	var html = '<tr id="idea' + idea.id + '" title="' + title + '"><td>' + text + '</td><td>' + tags + '</td>';

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

ExplanationBuilder.prototype.edit = function(index,text,source,tags,flag,$tr) {
	var title = 'Click and drag to add to idea space, Double click to edit';
	var id;
	var idea;
	for(var i=0; i<this.ideaBasket.ideas.length; i++){
		if(this.ideaBasket.ideas[i].id == index){
			id = this.ideaBasket.ideas[i].id; 
			this.ideaBasket.ideas[i].text = text;
			this.ideaBasket.ideas[i].source = source;
			this.ideaBasket.ideas[i].tags = tags;
			this.ideaBasket.ideas[i].flag = flag;
			idea = this.ideaBasket.ideas[i];
			var text = this.ideaBasket.ideas[i].text.replace(new RegExp("(\\w{" + 25 + "})(?=\\w)", "g"), "$1<wbr>");
			if($tr){
				$tr.html('<td>' + text + '</td><td>' + this.ideaBasket.ideas[i].tags + '</td>');
				$tr.effect("pulsate", { times:2 }, 500);
				if($tr.hasClass('ui-draggable-disabled')){
					setTimeout(function(){
						$tr.css('opacity','.35');
					},1200);
				}
			}
			//localStorage.ideas = JSON.stringify(basket.ideas);
			break;
		}
	}

	for (var i=0; i<this.explanationIdeas.length; i++){
		if(this.explanationIdeas[i].id == id){
			this.updateExpIdea(id);
			break;
		}
	}
	
	//update the text displayed in the explanation idea
	$('#explanationIdea' + id).html(text);
	
	this.basketChanged = true;
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

	$target.dblclick(function(){
		var $clicked = $(this);
		var id = $(this).attr('id');
		id = id.replace('idea','');
		id = parseInt(id);

		//populate edit fields
		for(var i=0;i<context.ideaBasket.ideas.length;i++){
			if(context.ideaBasket.ideas[i].id==id){
				$('#editText').val(context.ideaBasket.ideas[i].text);
				if(context.ideaBasket.ideas[i].source.match(/^Other: /)){
					$('#editSource').val("Other");
					$('#editOther').val(context.ideaBasket.ideas[i].source.replace(/^Other: /,''));
					$('#editOtherSource').show();
					$('#editOther').addClass('required');
				} else {
					$('#editSource').val(context.ideaBasket.ideas[i].source);
					$('#editOtherSource').hide();
					$('#editOther').removeClass('required');
				}
				$('#editTags').val(context.ideaBasket.ideas[i].tags);
				$("input[name='editFlag']").each(function(){
					if($(this).attr('value')==context.ideaBasket.ideas[i].flag){
						$(this).attr('checked', true);
					} else {
						$(this).attr('checked', false);
					}
				});
				break;
			}
		}

		$('#editDialog').dialog({ title:'Edit Your Idea', modal:true, resizable:false, width:'400', buttons:{
			"OK": function(){       
			if($("#editForm").validate().form()){
				var idea = context.ideaBasket.getIdeaById(id);
				var stepsUsedIn = idea.stepsUsedIn;
				
				var answer = true;
				
				//check if this student used this idea in any steps 
				if(stepsUsedIn != null && stepsUsedIn.length > 0) {
					//the student has used this idea in a step
					
					var message = "This idea is currently used in the following steps\n\n";
					
					//loop through all the steps the student has used this idea in
					for(var x=0; x<stepsUsedIn.length; x++) {
						//get the node id
						var nodeId = stepsUsedIn[x];
						
						//get the node
						var node = context.view.getProject().getNodeById(nodeId);
						
						if(node != null) {
							//get the node position
							var vlePosition = context.view.getProject().getVLEPositionById(nodeId);
							
							//get the node title
							var title = node.title;
							
							//add the step to the message
							message += vlePosition + ": " + title + "\n";
						}
					}
					
					message += "\nIf you change this idea, you might want to review your answer in those steps.";
					
					/*
					 * display the message to the student that notifies them 
					 * that they will also be changing the idea text in the
					 * steps that they have used the idea in
					 */
					answer = confirm(message);
				}
				
				if(answer) {
					var source = $('#editSource').val();
					if(source=='Other'){
						source = 'Other: ' + $('#editOther').val();
					}
					context.edit(id,$('#editText').val(),source,$('#editTags').val(),$("input[name='editFlag']:checked").val(),$clicked);
					$(this).dialog("close");
					resetForm('editForm');
				}
			}
		}, Cancel: function(){
			$(this).dialog("close");
			resetForm('editForm');
		}
		} });
	});
};

ExplanationBuilder.prototype.addExpIdea = function(context,isLoad,isActive,id,left,top,color){
	$('#spacePrompt').hide();
	var text='';
	var timeLastEdited = null;
	var timeCreated = null;
	var newIdea;
	var currColor = 'rgb(38, 84, 207)';
	if(color){
		currColor = color;
	}
	if(isActive){
		for(var i=0; i<this.ideaBasket.ideas.length; i++){
			if(this.ideaBasket.ideas[i].id == id){
				newIdea = new ExplanationIdea(id,left,top,color);
				text = this.ideaBasket.ideas[i].text;
				timeLastEdited = this.ideaBasket.ideas[i].timeLastEdited;
				timeCreated = this.ideaBasket.ideas[i].timeCreated;
				
				if(this.latestState != null && timeLastEdited != null && timeCreated != null) {
					if(timeLastEdited == timeCreated) {
						/*
						 * this idea was just created so it's not possible for
						 * the idea to have been previously changed
						 */
					} else if(this.latestState.timestamp < timeLastEdited) {
						//the idea has been changed since the idea was used in this step
						text += "!";
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
		$('#idea' + id).css('opacity','.35');
	} else {
		for(var i=0; i<this.ideaBasket.deleted.length; i++){
			if(this.ideaBasket.deleted[i].id == id){
				newIdea = new ExplanationIdea(id,left,top,color);
				text = this.ideaBasket.deleted[i].text;
				timeLastEdited = this.ideaBasket.ideas[i].timeLastEdited;
				timeCreated = this.ideaBasket.ideas[i].timeCreated;
				
				if(this.latestState != null && timeLastEdited != null && timeCreated != null) {
					if(timeLastEdited == timeCreated) {
						/*
						 * this idea was just created so it's not possible for
						 * the idea to have been previously changed
						 */
					} else if(this.latestState.timestamp < timeLastEdited) {
						//the idea has been changed since the idea was used in this step
						text += "!";
					}
				}
				
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

	$('#target').append('<div class="exIdea" class="selected" title="Click and drag to move; Click to change color" id="explanationIdea' 
			+ id + '" style="position:absolute; left:' + left + 'px; top:' + top + 'px; background-color:' + currColor + '">' + text + '</div>');

	$('#colorPicker').show(); // show color picker

	var bottomBoundary = 300-$('#explanationIdea' + id).height();
	if (top > bottomBoundary) {
		top = bottomBoundary;
		$('#explanationIdea' + id).css('top',top);
	};

	if(!isLoad){
		context.explanationIdeas.push(newIdea);
		//localStorage.explanationIdeas = JSON.stringify(context.explanationIdeas);
	}

	if (!isActive){
		$('#explanationIdea' + id).addClass('deleted');
	}

	$('#explanationIdea' + id).click(function(e){
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
		}
	});

	$('#explanationIdea' + id).draggable({
		//containment: $('#explanationSpace'),
		scope: 'used-idea',
		stop: function(event,ui){
		var pos = $(this).position();
		var left = pos.left;
		var top = pos.top;
		var bottomBoundary = 300-$(this).height();
		if (top > bottomBoundary) {
			top = bottomBoundary;
		} else if (top < 1){
			top = 1;
		}

		if(left < 1){
			left = 1;
		} else if (left > 320) {
			left = 320;
		}

		$(this).css('top', top + 'px');
		$(this).css('left', left + 'px');
		var id = $(this).attr('id');
		id = id.replace('explanationIdea','');
		context.updateExpIdea(id,null,left,top);
	}
	});

	$('#explanationIdea' + id).click();
};

ExplanationBuilder.prototype.updateExpIdea = function(id,idea,left,top,color){
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