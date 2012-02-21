
View.prototype.promptManager = function() {
	this.view;
};

View.prototype.promptManager.dispatcher = function(type, args, obj) {
	if(type=='stepPromptChanged') {
		obj.updatePrompt();
	}
};

View.prototype.promptManager.insertPrompt = function(view) {
	this.view = view;
	var nodeToPromptRowSize = {
			OpenResponseNode:'35',
			BrainstormNode:'28',
			HtmlNode:'50',
			AssessmentListNode:'10',
			MultipleChoiceNode:'8',
			MatchSequenceNode:'10',
			DataGraphNode:'7',
			MySystemNode:'5',
			SVGDrawNode:'10'
	};
	$('#promptInput').attr('rows', nodeToPromptRowSize[view.resolveType(view.activeNode.type)]);
	$('#promptContainer').append($('#promptDiv').show().detach());
	
	this.view.populatePrompt();
	
	// bind show/hide rich text link clicks
	$("input[name='promptToggle']").unbind('change');
	$("input[name='promptToggle']").change(function(){
		if ($("input[name='promptToggle']:checked").attr('id')=='showRichText'){
			view.enableRichTextAuthoring($('#promptInput'),function() {eventManager.fire('stepPromptChanged');});
		} else if ($("input[name='promptToggle']:checked").attr('id')=='hideRichText'){
			if($('#promptInput').tinymce()){
				$('#promptInput').tinymce().remove();
			}
		}
	});
	
	$('#promptToggleRichText').buttonset();
	
	// if active node type is HtmlNode, show rich text editor on load - TODO: not working, so enabling for all step types on load
	// set Rich Text radio button as checked
	//if(view.resolveType(view.activeNode.type) == 'HtmlNode'){
		$('#showRichText').attr('checked','checked');
		$('#hideRichText').removeAttr('checked');
	//} else {
		//$('#hideRichText').attr('checked','checked');
		//$('#showRichText').removeAttr('checked');
	//}
	$('#promptToggleRichText').buttonset('refresh');
	
	// enable rich text editor for prompt if showRichText radio is selected
	//if($('#promptToggleRichText input[type=radio]:checked').attr('id')=='showRichText'){
		this.view.enableRichTextAuthoring($('#promptInput'),function() {eventManager.fire('stepPromptChanged');});
	//}
};

View.prototype.promptManager.cleanupPrompt = function() {
	$('body').append($('#promptDiv').hide().detach());
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/components/authorview_prompt.js');
};