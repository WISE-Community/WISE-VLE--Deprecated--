function Idea(id, timeCreated, timeLastEdited, text, source, tags, flag, nodeId, nodeName) {
	this.id = id; //unique id (order of creation)
	this.timeCreated = timeCreated; //creation timestamp
	this.timeLastEdited = timeLastEdited; //time last edited
	this.text = text; //idea's text
	this.source = source; //idea's source
	this.nodeId = nodeId; //the id of the step
	this.nodeName = nodeName; //the name of the step
	this.tags = tags; //idea's tags
	this.flag = flag; //idea's flag
	this.stepsUsedIn = [];
	this.changeText = null;
};

/**
 * Creates an IdeaBasket instance
 * @param ideaBasketJSONObj optional argument, if it is provided it will load
 * the data from the JSON into this object
 * @param createForStep boolean value whether we are creating the idea basket 
 * for an idea basket step
 * @return an IdeaBasket instance
 */
function IdeaBasket(ideaBasketJSONObj, createForStep) {
	if(createForStep) {
		//we are creating an idea basket for an idea basket step
		
		//set the values for the idea basket step
		this.node = node;
		this.view = node.view;
		this.content = node.getContent().getContentJSON();
		
		if(node.studentWork != null) {
			this.states = node.studentWork; 
		} else {
			this.states = [];  
		};
	}
	
	this.id;
	this.runId;
	this.workgroupId;
	this.projectId;
	this.ideas = [];
	this.deleted = [];
	this.nextIdeaId = 1;

	if(ideaBasketJSONObj == null) {
		//JSON is not provided so we will just initialize the UI
		this.init(this);	
	} else {
		/*
		 * JSON is provided so we will populate the data and not initialize the UI.
		 * this is supposed to be used when you want the idea basket object but
		 * do not need to display it such as when the vle retrieves the basket
		 * to "Add an Idea"
		 */
		this.load(ideaBasketJSONObj, false);
	}
};

/**
 * Initialize the IdeaBasket by turning on tablesorter to allow sorting
 * by columns and turning on sortable to allow students to drag and drop
 * rows to manually sort the table
 * @param context
 */
IdeaBasket.prototype.init = function(context) {
	//allow the ideas and deleted tables to be auto sorted by columns by clicking on the header columns
	$("#basketIdeas").tablesorter({textExtraction: "complex", sortMultiSortKey:'', widgets:['zebra'], headers:{4:{sorter:false}}});
	$("#basketDeleted").tablesorter({textExtraction: "complex", sortMultiSortKey:'', headers:{4:{sorter:false}}});
	
	/*
	 * update the order in our IdeaBasket arrays when the student manually
	 * drags and drops rows to manually sort the table
	 */
	$("#basketIdeas").bind("sortEnd",function() { 
		context.updateOrder(0); 
	});
	$("#basketDeleted").bind("sortEnd",function() { 
		context.updateOrder(1); 
	}); 

	//make the ideas table manually sortable
	$('#basketIdeas tbody').sortable({
			helper: fixHelper,
			start: function(event,ui){
			//context.current = $('#basketIdeas tbody tr').index(ui.item);
		},
		update: function(event,ui){
			context.updateOrder(0);
			$('#basketIdeas thead tr .header').removeClass('headerSortUp').removeClass('headerSortDown');
		}
	}).disableSelection();

	//make the deleted table manually sortable
	$('#basketDeleted tbody').sortable({
			helper: fixHelper,
			start: function(event,ui){
			//context.current = $('#basketDeleted tbody tr').index(ui.item);
		},
		update: function(event,ui){
			context.updateOrder(1);
			$('table.tablesorter th').removeClass('headerSortUp').removeClass('headerSortDown');
		}
	}).disableSelection();
};

/**
 * Load the ideas into the tables in the interface
 * @param ideaBasketJSONObj the JSON object to populate the data from
 * @param generateUI boolean value whether to generate the UI
 */
IdeaBasket.prototype.load = function(ideaBasketJSONObj, generateUI) {
	/*
	 * ideaBasketJSONObj will be null in authoring preview step in which case
	 * we do not want to load anything
	 */
	if(ideaBasketJSONObj != null) {
		//set the values from the JSON object we received from the server
		
		this.id = ideaBasketJSONObj.id;
		this.runId = ideaBasketJSONObj.runId;
		this.workgroupId = ideaBasketJSONObj.workgroupId;
		this.projectId = ideaBasketJSONObj.projectId;
		
		if(ideaBasketJSONObj.nextIdeaId != null) {
			this.nextIdeaId = ideaBasketJSONObj.nextIdeaId;
		}
		
		if(ideaBasketJSONObj.ideas != null) {
			this.ideas = ideaBasketJSONObj.ideas;
		}
		
		if(ideaBasketJSONObj.deleted != null) {
			this.deleted = ideaBasketJSONObj.deleted;		
		}

		if(generateUI) {
			//we will generate the UI
			
			// clear out existing rows
			$('#basketIdeas tbody tr').each(function(){
				$(this).remove();
			});

			$('#basketDeleted tbody tr').each(function(){
				$(this).remove();
			});

			//populate tables
			for(var i=0; i<this.ideas.length; i++){
				this.addRow(0,this.ideas[i],true);
			}
			for(var i=0; i<this.deleted.length; i++){
				this.addRow(1,this.deleted[i],true);
			}

			$("#basketIdeas").trigger("applyWidgets");
		}	
	}
};

/**
 * Get an idea given the ideaId
 * @param ideaId the id of the idea we want
 * @return the idea with the given id
 */
IdeaBasket.prototype.getIdeaById = function(ideaId) {
	//loop through the ideas array
	for(var i=0;i<this.ideas.length;i++){
		if(this.ideas[i].id==ideaId){
			return this.ideas[i];
		}
	}

	//loop through the deleted array
	for(var i=0;i<this.deleted.length;i++){
		if(this.deleted[i].id==ideaId){
			return this.deleted[i];
		}
	}

	return null;
};

/**
 * Create the idea and add it to the ideas array as well as the UI
 * @param text
 * @param source
 * @param tags
 * @param flag
 */
IdeaBasket.prototype.add = function(text,source,tags,flag) {
	this.setBasketChanged(true);

	var nodeName = ";"
	
	if(parent.frames['ideaBasketIfrm'] != null) {
		//we are adding an idea from the idea basket popup
		
		//get the values for the current step
		var nodeId = parent.frames['ideaBasketIfrm'].thisView.getCurrentNode().id;
		var vlePosition = parent.frames['ideaBasketIfrm'].thisView.getProject().getVLEPositionById(nodeId);
		nodeName = parent.frames['ideaBasketIfrm'].thisView.getCurrentNode().getTitle();
		nodeName = vlePosition + ": " + nodeName;
	} else {
		//we are adding an idea from an idea basket step so we have access to this
		
		//get the values for the current step
		var nodeId = this.view.getCurrentNode().id;
		var vlePosition = this.view.getProject().getVLEPositionById(nodeId);
		nodeName = this.view.getCurrentNode().getTitle();
		nodeName = vlePosition + ": " + nodeName;
	}
	
	//create an add an idea to the basket
	var newIdea = this.addIdeaToBasketArray(text, source, tags, flag, nodeId, nodeName);
	//add the idea to the UI
	basket.addRow(0,newIdea);
	this.updateToolbarCount(true);
};

/**
 * Create and add an idea to the basket
 * @param text
 * @param source
 * @param tags
 * @param flag
 * @param nodeId
 * @param nodeName
 * @return the new idea that was just added to the basket
 */
IdeaBasket.prototype.addIdeaToBasketArray = function(text,source,tags,flag,nodeId,nodeName) {
	//get the current time
	var newDate = new Date();
	var time = newDate.getTime();
	
	//create the new idea
	var newIdea = new Idea(this.nextIdeaId,time,time,text,source,tags,flag,nodeId,nodeName);
	
	//increment this counter so that the next idea will have a new id
	this.nextIdeaId++;

	//add the idea to the array of ideas
	this.ideas.push(newIdea);
	
	this.updateToolbarCount();
	
	return newIdea;
};

/**
 * Add the new idea to the UI
 * @param target
 * @param idea
 * @param load
 * @return
 */
IdeaBasket.prototype.addRow = function(target,idea,load){
	var context = this;
	var currTable = 'idea';
	//var table = this.ideaTable;
	var table = $('#basketIdeas tbody');
	var link = 'delete';
	var title = 'Click and drag to re-order, Double click to edit';
	var linkText = idea.text +	'<span class="editLink" title="Edit idea">Edit</span>';
	if (target===1){
		currTable = 'deleted';
		//table = this.deletedTable;
		table = $('#basketDeleted tbody');
		link = 'restore';
		title = 'Click on the + icon to take this idea out of the trash';
		linkText = idea.text;
	}
	if(idea.tags && idea.tags != 'undefined'){
		var tags = idea.tags;
	} else {
		var tags = '';
	}
	var html = '<tr id="' + currTable + idea.id + '" title="' + title + '"><td><div class="ideaText">' + linkText +
		'</div></td><td>' + idea.source + '</td>' +	'<td><div class="ideaTags">' + tags +
		'</div></td>' + '<td style="text-align:center;"><span title="' +idea.flag +	'" class="' + idea.flag + '"></span></td>'+
		'<td style="text-align:center;"><span class="' + link + '" title="' + link + ' idea"></span></td></tr>';

	table.prepend(html);
	var $newTr = $('#' + currTable + idea.id);
	var $newLink = $('#' + currTable + idea.id + ' span.' + link);
	var $editLink = $('#' + currTable + idea.id + ' span.editLink');

	if(!load){
		$newLink.parent().parent().effect("pulsate", { times:2 }, 500);
	}

	if(target===0){
		// bind edit link and double click of row to open edit dialog
		$editLink.click(function(){
			var $clicked = $newTr;
			var id = $newTr.attr('id');
			id = id.replace('idea','');
			context.openEditDialog(context,id,$clicked);
		});
		$newTr.dblclick(function(){
			var $clicked = $(this);
			var id = $(this).attr('id');
			id = id.replace('idea','');
			context.openEditDialog(context,id,$clicked);
		});

		$newLink.click(function(){
			var $clicked = $(this);
			$('#deleteDialog').dialog({ title:'Move to Trash', modal:true, resizable:false, width:'400', buttons:{
				'OK': function(){
				var index = $clicked.parent().parent().attr('id');
				index = index.replace('idea','');
				
				/*
				 * check if the idea is being used in an explanation builder step,
				 * if it is, we will display a confirmation popup that asks the
				 * student if they're sure they want to edit the idea. if the
				 * idea is not being used in an eb step it will return true
				 * by default.
				 */
				var answer = basket.checkIfIdeaUsed(index);
				
				if(answer) {
					var $tr = $clicked.parent().parent();
					basket.remove(index,$tr);
					$(this).dialog("close");					
				}
			},
			Cancel: function(){$(this).dialog("close");}
			} });
		});
	} else {
		$newLink.click(function(){
			/*if(confirm("Are you sure you want to move this idea back to your active ideas?")){*/
			var index = $(this).parent().parent().attr('id');
			index = index.replace('deleted','');
			var $tr = $(this).parent().parent();
			basket.putBack(index,$tr);
			//}
		});
	}

	$('#basketIdeas').trigger("update");
	$('#basketIdeas').trigger("applyWidgets");
	$('#basketDeleted').trigger("update");
	$('#basketDeleted').trigger("applyWidgets");

	var numDeleted = basket.deleted.length;
	$('#numDeleted').text(numDeleted + ' Deleted Idea(s)');
	if(numDeleted>0){
		$('#deletedEmpty').hide();
	} else {
		//$('#toggleDeleted').click();
		$('#deletedEmpty').show();
		//$('#trash').hide();
	}
	if(basket.ideas.length>0) {
		$('#ideasEmpty').hide();
	} else {
		$('#ideasEmpty').show();
	}
	
	$('tr .header').removeClass('headerSortDown').removeClass('headerSortUp');
};

IdeaBasket.prototype.openEditDialog = function(context,id,$clicked){
	var text = '';
	
	//populate edit fields
	for(var i=0;i<basket.ideas.length;i++){
		if(basket.ideas[i].id==id){
			text = basket.ideas[i].text;
			$('#editText').val(text);
			if(basket.ideas[i].source.match(/^Other: /)){
				$('#editSource').val("Other");
				$('#editOther').val(basket.ideas[i].source.replace(/^Other: /,''));
				$('#editOtherSource').show();
				$('#editOther').addClass('required');
			} else {
				$('#editSource').val(basket.ideas[i].source);
				$('#editOtherSource').hide();
				$('#editOther').removeClass('required');
			}
			$('#editTags').val(basket.ideas[i].tags);
			$("input[name='editFlag']").each(function(){
				if($(this).attr('value')==basket.ideas[i].flag){
					$(this).attr('checked', true);
				} else {
					$(this).attr('checked', false);
				}
			});
			break;
		}
	}

	$('#editDialog').dialog({ title:'Edit Your Idea', modal:true, resizable:false, width:'470', buttons:{
		"OK": function(){
			var answer = false;
			if($("#editForm").validate().form()){
				if($('#editText').val() != text){
					/*
					 * if the idea text has changed, check if the idea is being used
					 * in an explanation builder step, if it is, we will display
					 * a confirmation popup that asks the students if they're sure
					 * they want to edit the idea. if the idea is not being used
					 * in an eb step it will return true by default.
					 */
					var answer = basket.checkIfIdeaUsed(id);
				} else {
					answer = true;
				}
				
				if(answer) {
					var source = $('#editSource').val();
					if(source=='Other'){
						source = 'Other: ' + $('#editOther').val();
					}
					basket.edit(id,$('#editText').val(),source,$('#editTags').val(),$("input[name='editFlag']:checked").val(),$clicked);
					$(this).dialog("close");
					resetForm('editForm');						
				}
			}
		}, Cancel: function(){
			$(this).dialog("close");
			resetForm('editForm');
		}
	} });
};

/**
 * Check if the idea is being used in an explanation builder step,
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
IdeaBasket.prototype.checkIfIdeaUsed = function(id) {
	var idea = basket.getIdeaById(id);
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
			var node = parent.frames['ideaBasketIfrm'].thisView.getProject().getNodeById(nodeId);
			
			if(node != null) {
				//get the node position
				var vlePosition = parent.frames['ideaBasketIfrm'].thisView.getProject().getVLEPositionById(nodeId);
				
				//get the node title
				var title = node.title;
				
				//add the step to the message
				message += vlePosition + ": " + title + "\n";
			}
		}
		
		message += "\nIf you change this idea, you will also change your answer in those steps.";
		
		/*
		 * display the message to the student that notifies them 
		 * that they will also be changing the idea text in the
		 * steps that they have used the idea in
		 */
		answer = confirm(message);
	}
	
	return answer;
};

/**
 * Delete an idea by putting it in the trash
 * @param index
 * @param $tr
 */
IdeaBasket.prototype.remove = function(index,$tr) {
	this.setBasketChanged(true);
	
	if($tr){
		$tr.remove();
	}
	for(var i=0; i<this.ideas.length; i++){
		if(this.ideas[i].id == index){
			//this.deleted.push(this.ideas[i]);
			this.deleted.splice(0,0,this.ideas[i]);
			var idea = this.ideas[i];
			
			//get the current time
			var newDate = new Date();
			var time = newDate.getTime();
			
			//update the timeLastEdited
			idea.timeLastEdited = time;
			
			var ideaId = idea.id;
			this.ideas.splice(i,1);
			this.addRow(1,idea);

			break;
		}
	}
	this.updateToolbarCount(true);
};

/**
 * Take an idea out of the trash
 * @param index
 * @param $tr
 */
IdeaBasket.prototype.putBack = function(index,$tr) {
	this.setBasketChanged(true);
	
	if($tr){
		$tr.remove();
	}
	for(var i=0; i<this.deleted.length; i++){
		if(this.deleted[i].id == index){
			this.ideas.push(this.deleted[i]);
			//this.ideas.splice(0,0,this.deleted[i]);
			var idea = this.deleted[i];
			
			//get the current time
			var newDate = new Date();
			var time = newDate.getTime();
			
			//update the timeLastEdited
			idea.timeLastEdited = time;
			
			var ideaId = idea.id;
			this.deleted.splice(i,1);
			this.addRow(0,idea);

			break;
		}
	}
	this.updateToolbarCount(true);
};

/**
 * Determine whether the student has changed any values in the idea
 * @param idea the previous state of the idea
 * @param text the new text
 * @param source the new source
 * @param tags the new tags
 * @param flag the new flag
 * @return whether the student has made any changes to the idea
 */
IdeaBasket.prototype.isIdeaChanged = function(idea, text, source, tags, flag) {
	var ideaChanged = true;
	
	//compare all the fields
	if(idea.text == text && idea.source == source && idea.tags == tags && idea.flag == flag) {
		ideaChanged = false;
	}
	
	return ideaChanged;
};

/**
 * Edit an idea
 * @param index
 * @param text
 * @param source
 * @param tags
 * @param flag
 * @param $tr
 */
IdeaBasket.prototype.edit = function(index,text,source,tags,flag,$tr) {
	var context = this;
	for(var i=0; i<this.ideas.length; i++){
		if(this.ideas[i].id == index){
			var idea = this.ideas[i];
			
			/*
			 * check if any of the fields in the idea have changed,
			 * if they have not changed we do not need to do anything
			 */
			if(this.isIdeaChanged(idea, text, source, tags, flag)) {
				//the idea has changed
				this.setBasketChanged(true);
				
				idea.text = text;
				idea.source = source;
				idea.tags = tags;
				idea.flag = flag;
				var linkText = idea.text +	'<span class="editLink" title="Edit idea">Edit</span>';
				
				//get the current time
				var newDate = new Date();
				var time = newDate.getTime();
				
				idea.timeLastEdited = time;
				
				if($tr){
					$tr.html('<td><div class="ideaText">' + linkText + '</div></td><td>' + idea.source + '</td>' +
							'<td><div class="ideaTags">' + idea.tags + '</div></td>' + '<td style="text-align:center;"><span title="' + idea.flag + '" class="' + idea.flag + '"></span></td>'+
					'<td style="text-align:center;"><span class="delete" title="delete idea"></span></td>');

					$tr.effect("pulsate", { times:2 }, 500);
				}

				var currTable = 'idea';
				var link = 'delete';
				var $newTr = $('#' + currTable + idea.id);
				var $newLink = $('#' + currTable + idea.id + ' span.' + link);
				var $editLink = $('#' + currTable + idea.id + ' span.editLink');
				
				// re-bind edit link click and row double click to open edit dialog
				$editLink.click(function(){
					var $clicked = $newTr;
					var id = $newTr.attr('id');
					id = id.replace('idea','');
					context.openEditDialog(context,id,$clicked);
				});
				
				// re-bind delete link click
				$newLink.click(function(){
					var $clicked = $(this);
					$('#deleteDialog').dialog({ title:'Move to Trash', modal:true, resizable:false, width:'400', buttons:{
						'OK': function(){
						var index = $clicked.parent().parent().attr('id');
						index = index.replace('idea','');
						var $tr = $clicked.parent().parent();
						basket.remove(index,$tr);
						$(this).dialog("close");
					},
					Cancel: function(){$(this).dialog("close");}
					} });
					/*if(confirm("Are you sure you want to delete this idea?\n\n(You can always retrieve it from the trash later on if you change your mind.)")){
						var index = $(this).parent().parent().attr('id');
						index = index.replace('idea','');
						var $tr = $(this).parent().parent();
						basket.remove(index,$tr);
					}*/
				});
			}

			break;
		}
	}
};

/**
 * Update the order of the ideas in our ideas or deleted array
 * because the student has changed the order in the UI
 * @param target 0 for ideas array, 1 for deleted array
 */
IdeaBasket.prototype.updateOrder = function(target){
	var newOrder = [];
	var table = $('#basketIdeas tbody tr');
	var data = basket.ideas;
	var regex = 'idea';
	if(target===1){
		table = $('#basketDeleted tbody tr');
		data = basket.deleted;
		regex = 'deleted';
	}
	table.each(function(){
		var id = $(this).attr('id');
		id = id.replace(regex,'');
		id = parseInt(id);
		for(var i=0; i<data.length; i++){
			if (data[i].id == id){
				//newOrder.push(data[i]);
				newOrder.splice(0,0,data[i]);
				break;
			}
		}
	});
	if(target===0){
		//check if the order has changed
		if(!this.isSameOrder(basket.ideas, newOrder)) {
			//the new order is not the same
			this.setBasketChanged(true);
		}
		
		basket.ideas = newOrder;
		$("#basketIdeas").trigger("applyWidgets");
	} else if (target===1){
		//check if the order has changed
		if(!this.isSameOrder(basket.deleted, newOrder)) {
			//the new order is not the same
			this.setBasketChanged(true);
		}
		
		basket.deleted = newOrder;
		$("#basketDeleted").trigger("applyWidgets");
	}
};

/**
 * Update the Idea Basket Link on the toolbar to display current number of active ideas
 * @param target an integer (0 or 1) to specify source context (ideamanager.html or vle.html)
 * @param pulsate a boolean to specify whether toolbar link should blink on update (non-loading case)
 */
IdeaBasket.prototype.updateToolbarCount = function(pulsate){
	var total = this.ideas.length;
	if($("#ideaBasketLink span").length){
		$("#ideaBasketLink span").text(' Ideas (' + total + ')');
		if(pulsate){
			$("#ideaBasketLink span").effect("pulsate", { times:2 }, 500);
		}
	} else if($("#ideaBasketLink span", parent.document.body).length){
		$("#ideaBasketLink span", parent.document.body).text(' Ideas (' + total + ')');
		if (pulsate){
			$("#ideaBasketLink span", parent.document.body).effect("pulsate", { times:2 }, 500);
		}
	}
};

/**
 * Check if the order of the ideas in the two arrays are the same
 * @param order1 an array containing idea objects
 * @param order2 an array containing idea objects
 * @return whether the orders are same or not
 */
IdeaBasket.prototype.isSameOrder = function(order1, order2) {
	var sameOrder = true;
	
	var maxLength = Math.max(order1.length, order2.length);
	
	for(var x=0; x<maxLength; x++) {
		if(x >= order1.length) {
			sameOrder = false;
			break;
		} else if(x >= order2.length) {
			sameOrder = false;
			break;
		} else {
			var order1Idea = order1[x];
			var order2Idea = order2[x];
			
			if(order1Idea != null && order2Idea != null) {
				if(order1Idea.id != order2Idea.id) {
					sameOrder = false;
					break;
				}
			}
		}
	}
	
	return sameOrder;
};

/**
 * Saves the idea basket back to the server
 */
IdeaBasket.prototype.saveIdeaBasket = function(thisView) {
	/*
	 * the ideaBasketIfrm is only used in the idea basket popup. if we are
	 * on an idea basket step, setting thisView is not required
	 */
	if(thisView == null && parent.window.frames['ideaBasketIfrm'] != null) {
		//if thisView is not passed in to the function, try to retrieve it from the iframe
		thisView = parent.window.frames['ideaBasketIfrm'].thisView;
	}
	
	//set the action for the server to perform
	var action = "saveIdeaBasket";
	
	/*
	 * create a new copy of the idea basket without the fields from the idea basket step
	 * (such as this.node, this.view, this.content, this.states) because we don't want
	 * to save those values in the idea basket, plus it causes an infinite loop
	 * when $.stringify is called below.
	 * 
	 * we need to ask thisView to create the idea basket so that the idea basket is
	 * created in the context of the view and not in the context of this IdeaBasket
	 * object. this is to prevent an error that was occurring when adding a new idea
	 * complained that Idea was not defined. this was because of a weird context error
	 * and is resolved by creating the idea basket from the context of thisView.
	 */
	var newIdeaBasket = thisView.createIdeaBasket(this);
	
	//obtain the JSON string serialization of the basket
	var data = encodeURIComponent($.stringify(newIdeaBasket));
	
	var ideaBasketParams = {
			action:action,
			data:data 
	};
	
	//post the idea basket back to the server to be saved
	thisView.connectionManager.request('POST', 3, thisView.getConfig().getConfigParam('postIdeaBasketUrl'), ideaBasketParams, this.saveIdeaBasketCallback, {thisView:thisView});

	//set the updated ideaBasket back into the view
	thisView.ideaBasket = newIdeaBasket;
	
	/*
	 * call the function that will fire the 'ideaBasketChanged' event that will
	 * notify listeners to refresh their ideaBasket to get the latest changes
	 */
	if(this.view != null) {
		//we are on an idea basket step
		thisView.ideaBasketChanged(this);		
	} else {
		//we are on the idea basket popup or explanation builder step
		thisView.ideaBasketChanged();
	}
};

/**
 * The callback after we try to save the idea basket back to the server
 * @param responseText if the basket successfully saved this will be set to
 * "Successfully saved Idea Basket"
 * or if the basket failed to save it will be set to the JSON for the
 * previous basket revision that successfully saved so that we can rollback
 * to that revision
 * @param responseXML
 * @param args
 */
IdeaBasket.prototype.saveIdeaBasketCallback = function(responseText, responseXML, args) {
	var thisView = args.thisView;
	
	if(responseText != "Successfully saved Idea Basket") {
		//we failed to save the basket
		
		//display a message to the student
		thisView.notificationManager.notify("Error: Failed to save Idea Basket", 3);
		
		//we received the previous basket revision to rollback to
		var ideaBasketJSONObj = $.parseJSON(responseText);
		
		//revert the IdeaBasket and set it into the view
		thisView.ideaBasket = new IdeaBasket(ideaBasketJSONObj);
		thisView.ideaBasket.updateToolbarCount();
	}
};

/**
 * Return whether the idea basket has changed or not
 * @return a boolean value whether the idea basket has changed or not
 */
IdeaBasket.prototype.isBasketChanged = function() {
	return basketChanged;
};

/**
 * Set whether the idea basket has changed or not
 * @param basketChangedBool boolean value whether the idea basket has changed or not 
 */
IdeaBasket.prototype.setBasketChanged = function(basketChangedBool) {
	basketChanged = basketChangedBool;
};

/**
 * Determine if the idea is in the active ideas array
 * @param ideaId the id of the idea
 * @return whether the idea is in the active ideas array
 */
IdeaBasket.prototype.isIdeaActive = function(ideaId) {
	var ideaActive = false;

	//loop through the ideas array
	for(var i=0;i<this.ideas.length;i++){
		if(this.ideas[i].id==ideaId){
			ideaActive = true;
			break;
		}
	}

	return ideaActive;
};

/**
 * Determine if the idea is in the deleted array
 * @param ideaId the id of the idea
 * @return whether the idea is in the deleted array
 */
IdeaBasket.prototype.isIdeaInTrash = function(ideaId) {
	var ideaInTrash = false;

	//loop through the deleted array
	for(var i=0;i<this.deleted.length;i++){
		if(this.deleted[i].id==ideaId){
			ideaInTrash = true;
			break;
		}
	}

	return ideaInTrash;
};

//Return a helper with preserved width of cells
var fixHelper = function(e, ui) {
	ui.children().each(function() {
		$(this).width($(this).width());
	});
	return ui;
};

/**
 * This function renders everything the student sees when they visit the step.
 * This includes setting up the html ui elements as well as reloading any
 * previous work the student has submitted when they previously worked on this
 * step, if any.
 * 
 * TODO: rename TEMPLATE
 * 
 * note: you do not have to use 'promptDiv' or 'studentResponseTextArea', they
 * are just provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at template.html).
 */
IdeaBasket.prototype.render = function() {
	documentReadyFunction(null, true, this);
	
	//display any prompts to the student
	$('#promptDiv').html(this.content.prompt);
	
	//load any previous responses the student submitted for this step
	var latestState = this.getLatestState();
};

/**
 * This function retrieves the latest student work
 * 
 * TODO: rename TEMPLATE
 * 
 * @return the latest state object or null if the student has never submitted
 * work for this step
 */
IdeaBasket.prototype.getLatestState = function() {
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
 * TODO: rename TEMPLATE
 * 
 * note: you do not have to use 'studentResponseTextArea', they are just 
 * provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at template.html).
 */
IdeaBasket.prototype.save = function() {
	if(this.isBasketChanged()) {
		this.saveIdeaBasket(this.view);		
	}

	/*
	 * create the student state that will store the new work the student
	 * just submitted
	 * 
	 * TODO: rename TEMPLATESTATE
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
	var ideaBasketState = new IdeaBasketState();
	
	/*
	 * fire the event to push this state to the global view.states object.
	 * the student work is saved to the server once they move on to the
	 * next step.
	 */
	eventManager.fire('pushStudentWork', ideaBasketState);

	//push the state object into this or object's own copy of states
	this.states.push(ideaBasketState);
};

/**
 * Load the idea basket for an idea basket step
 */
IdeaBasket.prototype.loadIdeaBasket = function() {
	if(this.view.ideaBasket != null) {
		//generate the JSON string for the idea basket
		var ideaBasketJSON = $.stringify(this.view.ideaBasket);
		
		//generate the JSON object for the idea basket
		var ideaBasketJSONObj = $.parseJSON(ideaBasketJSON);
		
		//load the idea basket into the step
		loadIdeaBasket(ideaBasketJSONObj, true, this.view);		
	} else {
		/*
		 * the vle failed to retrieve the idea basket so we will disable
		 * this idea basket step to prevent the student from overriding
		 * and losing their idea basket.
		 */
		
		//hide the basket UI
		$('#main').hide();
		
		//set the error message
		$('#errorMessageDialog').html("Error: Failed to retrieve Idea Basket, refresh the VLE or visit a different step and then come back to this step to try to load it again.");
		
		//display the error message div
		$('#errorMessageDialog').show();
	}
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/ideaBasket/basket.js');
}