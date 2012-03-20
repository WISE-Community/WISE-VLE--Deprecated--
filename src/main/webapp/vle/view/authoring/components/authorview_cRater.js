
View.prototype.cRaterManager = function() {
	this.view;
};

View.prototype.cRaterManager.dispatcher = function(type, args, obj) {
	if(type=='cRaterVerify') {
		obj.updateCRater();
	} else if(type=='cRaterItemIdChanged') {
		obj.cRaterItemIdChanged();
	} else if(type=='cRaterFeedbackChanged') {
		obj.updateCRaterFeedback(args);
	} else if(type=='cRaterDisplayFeedbackImmediatelyChanged') {
		obj.updateCRaterDisplayFeedbackImmediately();
	}
};

/**
 * Insert the CRater authoring items into the author step page
 * @param view
 */
View.prototype.cRaterManager.insertCRater = function(view) {
	this.view = view;
	$('#cRaterContainer').append($('#cRaterDiv').show().detach());
	
	//populate the CRater values from the authored step content
	this.view.populateCRater();
};

/**
 * Clear input values and remove the div from the author step page
 * and put it back into the main authoring page
 */
View.prototype.cRaterManager.cleanupCRater = function() {
	$('#cRaterItemIdInput').val('');
	$('#cRaterItemIdStatus').html('');
	$('#cRaterDisplayFeedbackImmediately').attr('checked', false);
	$('#cRaterFeedback').html('');
	$('body').append($('#cRaterDiv').hide().detach());
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/components/authorview_cRater.js');
};