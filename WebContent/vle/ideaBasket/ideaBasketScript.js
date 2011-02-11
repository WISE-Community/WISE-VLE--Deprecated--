/* Author: 
 * Jonathan Breitbart
 */

//global variable so it can be accessed by other functions
var basket;

//global variable that specifies whether the idea basket has been changed so we know whether to save to the server
var basketChanged = false;

$(document).ready(function() {
	if(basket == null){
		basket = new IdeaBasket();
	}
	
	/*
	 * get the idea basket from the iframe, this was set in
	 * vleview_topmenu.js in the displayIdeaBasket() function
	 */
	var viewIdeaBasket = parent.frames['ideaBasketIfrm'].thisView.ideaBasket;
	
	//generate the JSON string for the idea basket
	var ideaBasketJSON = $.stringify(viewIdeaBasket);
	
	/*
	 * generate the JSON object for the idea basket because we will need
	 * it later to load the basket
	 */
	var ideaBasketJSONObj = $.parseJSON(ideaBasketJSON);

	$('#showAdmin').click(function(){
		$('#adminLinks').toggle();
	});

	$("#ideaForm").validate();

	$('#source').change(function(){
		if($('#source').val()=='Other'){
			$('#otherSource').show();
			$('#other').addClass('required');
		} else {
			$('#otherSource').hide();
			$('#other').removeClass('required');
		}
		$("#ideaForm").validate();
	});

	$('#editSource').change(function(){
		if($('#editSource').val()=='Other'){
			$('#editOtherSource').show();
			$('#editOther').addClass('required');
		} else {
			$('#editOtherSource').hide();
			$('#editOther').removeClass('required');
		}
		$("#ideaForm").validate();
	});

	$('#ideaDialog').dialog({title:'Add New Idea to Basket', autoOpen:false, modal:true, resizable:false, width:'470', buttons:{
		"OK": function(){				
		if($("#ideaForm").validate().form()){
			var source = $('#source').val();
			if(source=='Other'){
				source = 'Other: ' + $('#other').val();
			}
			basket.add($('#text').val(),source,$('#tags').val(),$("input[name='flag']:checked").val());
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

	/*$('#clearDialog').dialog({title:'Empty Basket', autoOpen:false, modal:true, resizable:false, width:'400', buttons:{
		"OK": function(){				
		localStorage.clear();
		window.location.reload();
	}, Cancel: function(){
		$(this).dialog("close");
	} }
	});

	$('#clear').click(function(){
		$('#clearDialog').dialog('open');
	});

	$('#export').click(function(){
		document.exportForm['exportIdeas'].value = localStorage.ideas;
		document.exportForm['exportDeleted'].value = localStorage.deleted;
		document.exportForm['exportIndex'].value = localStorage.index;
		$('#exportForm').submit();
	});

	$('#importForm').ajaxForm({
		//target : 'import.php',
		dataType : 'text',
		success : function (response) {
		var storage = response.replace(/^<head><\/head><body>/,'');
		storage = storage.replace(/<\/body>$/,'');
		storage = storage.replace(/\\"/g,'"');
		var data = storage.split(/\r?\n/);
		var ideas, deleted, index;
		if(data[0] && data[1] && data[2]){
			if (data[0] == "undefined" || data[0] == null || data[0].length>-1){
				if(data[0].length>0){
					ideas = JSON.parse(data[0]);
				} else {
					ideas = [];
				}
			} else {
				alert('invalid data format');
				return;
			}
			if (data[1] == "undefined" || data[1] == null || data[1].length>-1){
				if(data[1].length>0){
					deleted = JSON.parse(data[1]);
				} else {
					deleted = [];
				}
			} else {
				alert('invalid data format');
				return;
			}
			if (typeof data[2] === 'string'){
				index = data[2];
			} else {
				alert('invalid data format');
				return;
			}
			localStorage.clear();
			basket.load(ideas,deleted,index,true);
		}
	}
	});

	$('#importDialog').dialog({title:'Import an Existing Idea Basket', autoOpen:false, modal:true, resizable:false, width:'400', buttons:{
		"Submit": function(){				
		$('#importForm').submit();
		$(this).dialog("close");
	}, Cancel: function(){
		$(this).dialog("close");
	} }
	});

	$('#import').click(function(){
		$('#importDialog').dialog('open');
	});*/
	
	// TODO: FIX - this is not firing in Chrome (click insn't either)
	$('#toggleDeleted').toggle(
			function() {
				$('#trash').fadeIn();
				$('#toggleDeleted').addClass('visible');
				$('#showDeleted').text('(Click to hide)');
				//$('#toggleDeleted img.arrow').attr('src','images/arrow-down.png');
				return false;
			},
			function() {
				$('#trash').fadeOut();
				$('#toggleDeleted').removeClass('visible');
				$('#showDeleted').text('(Click to show)');
				//$('#toggleDeleted img.arrow').attr('src','images/arrow.png');
				return false;
			}
	);

	//get the view
	var thisView = parent.frames['ideaBasketIfrm'].thisView;
	
	/*
	 * subscribe to the ideaBasketChanged event so that when that
	 * event is fired, we know we need to update our ideaBasket. this
	 * will occur when the student has a the global idea basket open and is
	 * changing the idea basket within an explanation builder step.
	 */
	thisView.eventManager.subscribe('ideaBasketChanged', ideaBasketChanged, thisView);
	
	//load the idea basket
	loadIdeaBasket(ideaBasketJSONObj, true);
});

/**
 * Loads the idea basket from the global ideaBasket JSON object
 * that should have been set into the iframe
 */
var loadIdeaBasket = function(ideaBasketJSONObj, generateUI) {
	//load the ideaBasket JSON object that should have been set into the iframe
	basket.load(ideaBasketJSONObj, generateUI);
};

/**
 * This is called when the 'ideaBasketChanged' event is fired.
 * @param type
 * @param args
 * @param obj the view
 */
var ideaBasketChanged = function(type,args,obj) {
	var thisView = obj;
	
	//get the idea basket
	var viewIdeaBasket = thisView.ideaBasket;
	
	//generate the JSON string for the idea basket
	var ideaBasketJSON = $.stringify(viewIdeaBasket);
	
	//generate the JSON object for the idea basket
	var ideaBasketJSONObj = $.parseJSON(ideaBasketJSON);
	
	//load the basket so that the newest changes are reflected
	loadIdeaBasket(ideaBasketJSONObj, true);
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
	/*$(':input','#' + target)
	 .not(':button, :submit, :reset, :hidden')
	 .val('')
	 .removeAttr('checked')
	 .removeAttr('selected');*/
};
