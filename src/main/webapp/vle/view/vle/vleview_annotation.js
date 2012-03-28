/**
 * Display annotations for the current step.
 * Annotations will popup in a dialog
 * @param nodeIdToShow id of node to show
 */
View.prototype.showNodeAnnotations = function(nodeId) {
	$('#nodeAnnotationsLink').stop();
	$('#nodeAnnotationsLink').css('color','#FFFFFF');
	
	//var currentNode = this.getCurrentNode();
	var currentNode = this.getProject().getNodeById(nodeId); //get the node the student is currently on
	var currentNodeAnnotations = currentNode.getNodeAnnotations();
	if (currentNodeAnnotations != null && currentNodeAnnotations.length > 0) {

		//check if the hintsDiv div exists
		if($('#nodeAnnotationsPanel').size()==0){
			//the show hintsDiv does not exist so we will create it
			$('<div id="nodeAnnotationsPanel" class="nodeAnnotationsPanel"></div>').dialog(
					{	autoOpen:false,
						closeText:'Close',
						modal:false,
						show:{effect:"fade",duration:200},
						hide:{effect:"fade",duration:200},
						title:this.getI18NString("node_annotations_title"),
						zindex:9999,
						width:450,
						height:'auto',
						position:["center","middle"],
						resizable:true    					
					}).bind( "dialogbeforeclose", {view:currentNode.view}, function(event, ui) {
						// before the dialog closes, save hintstate
						if ($(this).data("dialog").isOpen()) {	    		    		
							//var hintState = new HINTSTATE({"action":"hintclosed","nodeId":event.data.view.getCurrentNode().id});
							//event.data.view.pushHintState(hintState);
						};
					});
		};

		// set the title of the dialog based on step title
		$('#nodeAnnotationsPanel').dialog("option","title",this.getI18NString("node_annotations_title")+" "+this.project.getVLEPositionById(currentNode.id)+": "+currentNode.getTitle());
		var nodeAnnotationComment = "";  // latest comment
		var nodeAnnotationScore = "";    // latest score
		var nodeAnnotationCRater = "";    // latest cRater feedback
		for (var i=0; i< currentNodeAnnotations.length; i++) {
			var currentNodeAnnotation = currentNodeAnnotations[i];
			if (currentNodeAnnotation.type == "comment") {
				nodeAnnotationComment = currentNodeAnnotation.value;
			} else if (currentNodeAnnotation.type == "score") {
				nodeAnnotationScore = currentNodeAnnotation.value;
			} else if (currentNodeAnnotation.type == "cRater") {
				nodeAnnotationCRater = currentNodeAnnotation.value[0].score;
			}
		}

		var nodeAnnotationsString = "<div id='nodeAnnotations'>";
		if (nodeAnnotationScore != "") {
			var maxScoreForThisStep = this.maxScores.getMaxScoreValueByNodeId(currentNode.id);
			nodeAnnotationsString += "<span class='nodeAnnotationsScore'>Score: "+nodeAnnotationScore+" out of "+ maxScoreForThisStep +"</span><br/><br/>";
		}
		if (nodeAnnotationCRater != "") {
			// if there is a CRater comment, show it instead of the teacher feedback
			nodeAnnotationsString += "<span class='nodeAnnotationsScore'>Comments: "+nodeAnnotationCRater+"</span>";				
		} else if (nodeAnnotationComment != "") {
			nodeAnnotationsString += "<span class='nodeAnnotationsScore'>Comments: "+nodeAnnotationComment+"</span>";
		}
		
		nodeAnnotationsString += "</div>";

		//set the html into the div
		$('#nodeAnnotationsPanel').html(nodeAnnotationsString);

		// show the hints panel
		$('#nodeAnnotationsPanel').dialog('open');
	}
    
};

/**
 * Displays node Annotation for specified nodeId
 * @param nodeId
 */
View.prototype.displayNodeAnnotation = function(nodeId){
	/* set annotation link in nav bar if annotation exists for this step
	 * populate annotation panel with current node's annotation
	 * */
	var currentNode = this.getProject().getNodeById(nodeId); //get the node the student is currently on
	var currentNodeAnnotations = currentNode.getNodeAnnotations();
	if (currentNodeAnnotations != null && currentNodeAnnotations.length > 0) {
    	var nodeAnnotationsLink = "<a id='nodeAnnotationsLink' onclick='eventManager.fire(\"showNodeAnnotations\",[\""+nodeId+"\"])' title='"+this.getI18NString("node_annotations_button_title")+"'>"+this.getI18NString("node_annotations_button_text")+"</a>";
    	$('#nodeAnnotations').empty().html(nodeAnnotationsLink);
	
		// highlight nodeAnnotationsLink
		function highlight(){
			$('#nodeAnnotationsLink').animate({
				color: '#FFE347'
			}, {
				duration: 1000,
				complete: function(){
					$('#nodeAnnotationsLink').animate({
						color: '#FFFFFF'
					}, {
						duration: 1000,
						complete: function(){
							highlight();
						}
					});
				}
			});
		}
    } else {
    	$("#nodeAnnotations").empty();
    }
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/vle/vleview_annotation.js');
}