/* Author: 
 * Jonathan Breitbart
 */

//global variable so it can be accessed by other functions
var basket;

//global variable that specifies whether the idea basket has been changed so we know whether to save to the server
var basketChanged = false;

var subscribedToIdeaBasketChanged = false;

$(document).ready(function() {
	if(basket == null){
		basket = new IdeaBasket();
	}

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

	parent.eventManager.fire('ideaBasketDocumentLoaded');
});

/**
 * Loads the idea basket from the global ideaBasket JSON object
 * that should have been set into the iframe
 * @param ideaBasketJSONObj the idea basket JSON object
 * @param generateUI whether to generate the UI and load the basket
 * or just load the basket
 * @param thisView the view
 */
var loadIdeaBasket = function(ideaBasketJSONObj, generateUI, thisView) {
	//only subscribe to the 'ideaBasketChanged' event once
	if(!subscribedToIdeaBasketChanged) {
		//remember thisView in the iframe so we can access it later
		parent.frames['ideaBasketIfrm'].thisView = thisView;
		
		//subscribe to the event
		thisView.eventManager.subscribe('ideaBasketChanged', ideaBasketChanged, thisView);
		subscribedToIdeaBasketChanged = true;
	}
	
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
	loadIdeaBasket(ideaBasketJSONObj, true, thisView);
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
