function Idea(id,time,text,source,tag,flag,nodeId,nodeName) {
	this.id = id; //unique id (order of creation)
	this.time = time; //creation timestamp
	this.text = text; //idea's text
	this.source = source; //idea's source
	this.nodeId = nodeId;
	this.nodeName = nodeName;
	this.tag = tag; //idea's tag
	this.flag = flag; //idea's flag
};

function IdeaBasket() {
	this.ideas = [];
	this.deleted = [];
	this.index = 0;
	
	this.current = null;
	
	this.ideaRows = $('#basketIdeas tbody tr');
	this.deletedRows = $('#basketDeleted tbody tr');
	this.ideaTable = $('#basketIdeas tbody');
	this.deletedTable = $('#basketDeleted tbody');
	
	this.init(this);
};

IdeaBasket.prototype.init = function(context) {
	$("#basketIdeas").tablesorter({textExtraction: "complex", sortMultiSortKey:'', widgets:['zebra'], headers:{4:{sorter:false}}});
	$("#basketDeleted").tablesorter({textExtraction: "complex", sortMultiSortKey:'', headers:{4:{sorter:false}}});
	$("#basketIdeas").bind("sortEnd",function() { 
      context.updateOrder(0); 
  });
  $("#basketDeleted").bind("sortEnd",function() { 
      context.updateOrder(1); 
  }); 
		
	$('#basketIdeas tbody').sortable({
		helper: fixHelper,
		start: function(event,ui){
			context.current = $('#basketIdeas tbody tr').index(ui.item);
		},
		update: function(event,ui){
			context.updateOrder(0);
			$('table.tablesorter th').removeClass('headerSortUp').removeClass('headerSortDown');
		}
	}).disableSelection();
	
	$('#basketDeleted tbody').sortable({
		helper: fixHelper,
		start: function(event,ui){
			context.current = $('#basketDeleted tbody tr').index(ui.item);
		},
		update: function(event,ui){
			context.updateOrder(1);
			$('table.tablesorter th').removeClass('headerSortUp').removeClass('headerSortDown');
		}
	}).disableSelection();
};

IdeaBasket.prototype.load = function(ideas,deleted,index,isImport) {
	this.ideas = ideas;
	this.deleted = deleted;
	this.index = parseInt(index);
	//localStorage.ideas = JSON.stringify(ideas);
	//localStorage.deleted = JSON.stringify(deleted);
	//localStorage.index = index;
	
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
	
	if(isImport){
		alert('Idea Basket successfully imported!');
	}
};

IdeaBasket.prototype.getIdeaById = function(ideaId) {
	for(var i=0;i<this.ideas.length;i++){
		if(this.ideas[i].id==id){
			return this.ideas[i];
		}
	}
	
	for(var i=0;i<this.deleted.length;i++){
		if(this.deleted[i].id==id){
			return this.deleted[i];
		}
	}
	
	return null;
};

IdeaBasket.prototype.add = function(text,source,tag,flag) {
	var newDate = new Date();
	var time = newDate.getTime();
  
	var nodeId = thisView.getCurrentNode().id;
	var nodeName = thisView.getCurrentNode().getTitle();
	var vlePosition = thisView.getProject().getVLEPositionById(nodeId);
	
	nodeName = vlePosition + ": " + nodeName;
	
	var newIdea = new Idea(null,time,text,source,tag,flag,nodeId,nodeName);
	//this.index++;
	this.ideas.push(newIdea);
	//this.addRow(0,newIdea);
	//localStorage.ideas = JSON.stringify(this.ideas);
	//localStorage.index = this.index;
	
	//set the params to post back to the server to save the idea
	var ideaBasketParams = {
		action:"addIdea",
		text:text,
		source:source,
		nodeName: nodeName,
		nodeId: nodeId,
		tag: tag,
		flag: flag
	};
	
	//save the idea to the server
	thisView.connectionManager.request('POST', 3, thisView.getConfig().getConfigParam('postIdeaBasketUrl'), ideaBasketParams, this.addDone, {basket:this,thisView:thisView,newIdea:newIdea});
};

IdeaBasket.prototype.addDone = function(responseText, responseXML, args) {
	var newIdea = args.newIdea;
	newIdea.id = parseInt(responseText);
	
	basket.addRow(0,newIdea);
};

IdeaBasket.prototype.addRow = function(target,idea,load){
	var currTable = 'idea';
	var table = this.ideaTable;
	var link = 'delete';
	var title = 'Click and drag to re-order, Double click to edit';
	if (target===1){
		currTable = 'deleted';
		table = this.deletedTable;
		link = 'restore';
		title = 'Click on the + icon to take this idea out of the trash';
	}
	var html = '<tr id="' + currTable + idea.id + '" title="' + title + '"><td>' + idea.text + '</td><td>' + idea.source + '</td>' +
		'<td>' + idea.tag + '</td>' + '<td style="text-align:center;"><span title="' + idea.flag + '" class="' + idea.flag + '"></span></td>'+
		'<td style="text-align:center;"><span class="' + link + '" title="' + link + ' idea"></span></td></tr>';
	
	table.prepend(html);
	var $newTr = $('#' + currTable + idea.id);
	var $newLink = $('#' + currTable + idea.id + ' span.' + link);
	
	if(!load){
		$newLink.parent().parent().effect("pulsate", { times:2 }, 500);
	}
	
	if(target===0){
		$newTr.dblclick(function(){
			var $clicked = $(this);
			var id = $(this).attr('id');
			id = id.replace('idea','');
			
			//populate edit fields
			for(var i=0;i<basket.ideas.length;i++){
				if(basket.ideas[i].id==id){
					$('#editText').val(basket.ideas[i].text);
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
					$('#editTags').val(basket.ideas[i].tag);
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
			
			$('#editDialog').dialog({ title:'Edit Your Idea', modal:true, resizable:false, width:'400', buttons:{
				"OK": function(){				
					if($("#editForm").validate().form()){
						var source = $('#editSource').val();
						if(source=='Other'){
							source = 'Other: ' + $('#editOther').val();
						}
						basket.edit(id,$('#editText').val(),source,$('#editTags').val(),$("input[name='editFlag']:checked").val(),$clicked);
						$(this).dialog("close");
						resetForm('editForm');
					}
				}, Cancel: function(){
					$(this).dialog("close");
					resetForm('editForm');
				}
			} });
		})
		
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
};

IdeaBasket.prototype.remove = function(index,$tr) {
	if($tr){
		$tr.remove();
	}
	for(var i=0; i<this.ideas.length; i++){
		if(this.ideas[i].id == index){
			this.deleted.push(this.ideas[i]);
			var idea = this.ideas[i];
			var ideaId = idea.id;
			this.ideas.splice(i,1);
			this.addRow(1,idea);
			//localStorage.ideas = JSON.stringify(this.ideas);
			//localStorage.deleted = JSON.stringify(this.deleted);
			
			var action = "trashIdea";
			
			var ideaBasketParams = {
					action:action,
					ideaId:ideaId
			};
			
			//tell the server to put the idea in the trash
			thisView.connectionManager.request('POST', 3, thisView.getConfig().getConfigParam('postIdeaBasketUrl'), ideaBasketParams, null, {thisView:this, ideaId:ideaId});
			
			break;
		}
	}
};

IdeaBasket.prototype.putBack = function(index,$tr) {
	if($tr){
		$tr.remove();
	}
	for(var i=0; i<this.deleted.length; i++){
		if(this.deleted[i].id == index){
			this.ideas.push(this.deleted[i]);
			var idea = this.deleted[i];
			var ideaId = idea.id;
			this.deleted.splice(i,1);
			this.addRow(0,idea);
			//localStorage.ideas = JSON.stringify(this.ideas);
			//localStorage.deleted = JSON.stringify(this.deleted);
			
			var action = "unTrashIdea";
			
			var ideaBasketParams = {
					action:action,
					ideaId:ideaId
			};

			//tell the server to take the idea out of the trash and back into the ideas
			thisView.connectionManager.request('POST', 3, thisView.getConfig().getConfigParam('postIdeaBasketUrl'), ideaBasketParams, null, {thisView:thisView, ideaId:ideaId});

			break;
		}
	}
};

IdeaBasket.prototype.edit = function(index,text,source,tag,flag,$tr) {
	for(var i=0; i<this.ideas.length; i++){
		if(this.ideas[i].id == index){
			var idea = this.ideas[i];
			idea.text = text;
			idea.source = source;
			idea.tag = tag;
			idea.flag = flag;
			if($tr){
				$tr.html('<td>' + idea.text + '</td><td>' + idea.source + '</td>' +
					'<td>' + idea.tag + '</td>' + '<td style="text-align:center;"><span title="' + idea.flag + '" class="' + idea.flag + '"></span></td>'+
					'<td style="text-align:center;"><span class="delete" title="delete idea"></span></td>');
				
				$tr.effect("pulsate", { times:2 }, 500);
			}
			
			var currTable = 'idea';
			var link = 'delete';
			var $newLink = $('#' + currTable + idea.id + ' span.' + link);
			
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
			
			//localStorage.ideas = JSON.stringify(this.ideas);
			
			//set the params to post back to the server to save the idea
			var ideaBasketParams = {
				action:"editIdea",
				ideaId:idea.id,
				text:idea.text,
				source:idea.source,
				nodeName:idea.nodeName,
				nodeId:idea.nodeId,
				tag:idea.tag,
				flag:idea.flag
			};
			
			//save the idea to the server
			thisView.connectionManager.request('POST', 3, thisView.getConfig().getConfigParam('postIdeaBasketUrl'), ideaBasketParams, null, thisView);

			break;
		}
	}
};

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
				newOrder.push(data[i]);
				break;
			}
		}
	});
	if(target===0){
		basket.ideas = newOrder;
		localStorage.ideas = JSON.stringify(newOrder);
		$("#basketIdeas").trigger("applyWidgets");
	} else if (target===1){
		basket.deleted = newOrder;
		localStorage.deleted = JSON.stringify(newOrder);
		$("#basketDeleted").trigger("applyWidgets");
	}
};

IdeaBasket.prototype.saveOrder = function() {
	//alert('saveOrder');
	//alert($('#basketIdeas').toArray());
	
	var basketOrder = [];
	var ideas = $('#basketIdeas tbody').sortable('toArray');
	
	for(var x=0; x<ideas.length; x++) {
		var ideaDOMId = ideas[x];
		
		var ideaId = ideaDOMId.replace('idea', '');
		
		basketOrder.push(parseInt(ideaId));
	}
	
	basketOrder.reverse();
	
	basketOrder = $.stringify(basketOrder);
	
	var action = "reOrderBasket";
	
	var ideaBasketParams = {
			action:action,
			basketOrder:basketOrder 
	};
	
	//post the basket order to the server
	thisView.connectionManager.request('POST', 3, thisView.getConfig().getConfigParam('postIdeaBasketUrl'), ideaBasketParams, null, {thisView:thisView});

	
	//alert($('#basketDeleted').toArray());
	
	var trash = $('#basketDeleted tbody').sortable('toArray');
	
	for(var y=0; y<trash.length; y++) {
		var ideaDOMId = trash[y];
		
		var ideaId = ideaDOMId.replace('deleted', '');
	}
};

// Return a helper with preserved width of cells
var fixHelper = function(e, ui) {
	ui.children().each(function() {
		$(this).width($(this).width());
	});
	return ui;
};