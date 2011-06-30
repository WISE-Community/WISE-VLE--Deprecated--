View.prototype.displayHint = function(){
/* set hints link in nav bar if hint exists for this step
	 * populate hints panel with current nodes hints
	 * */
	var currentNode = this.getCurrentNode(); //get the node the student is currently on
    if (currentNode.getHints() != null && currentNode.getHints().hintsArray != null && currentNode.getHints().hintsArray.length > 0) {
    	// check if hintsLink exists. if not, add it
    	if ($("#hintsLink").size() == 0) {
    		var hintButtonText = this.getI18NString("top_toolbar_hint_button_text");
    		$("#projectRightUpperBoxUL").prepend("<li><a id=\"hintsLink\" onclick='eventManager.fire(\"showStepHints\")' title=\"View Hints\"><img src=\"images/hint/star.png\" alt=\"Hints\" border=\"0\" /><span>&nbsp;"+hintButtonText+"&nbsp;</span></a></li>");
    	}
	
		var numHints = currentNode.getHints().hintsArray.length; //get the number of hints for current node
		
		function highlight(){
			$('#hintsLink').animate({
				backgroundColor: '#FFFF00'
			}, {
				duration: 1200,
				complete: function(){
					$('#hintsLink').animate({
						backgroundColor: '#FFFFFF'
					}, {
						duration: 1200,
						complete: function(){
							highlight();
						}
					});
				}
			});
		}

		//check if the hintsDiv div exists
	    if($('#hintsPanel').size()==0){
	    	//the show hintsDiv does not exist so we will create it
	    	$('<div id="hintsPanel"></div>').dialog(
			{	autoOpen:false,
				closeText:'Close',
				modal:false,
				title:this.getI18NString("hint_title"),
				zindex:9999, 
				position:["center",40],
				resizable:true    					
			}).bind( "dialogbeforeclose", {view:currentNode.view}, function(event, ui) {
			    // before the dialog closes, save hintstate
		    	if ($(this).data("dialog").isOpen()) {	    		    		
		    		var hintState = new HINTSTATE({"action":"hintclosed","nodeId":event.data.view.getCurrentNode().id});
		    		event.data.view.pushHintState(hintState);
		    		//$('#hintsHeader').html('&nbsp').addClass('visited');
		    	};
		    }).bind( "tabsselect", {view:currentNode.view}, function(event, ui) {
	    		var hintState = new HINTSTATE({"action":"hintpartselected","nodeId":event.data.view.getCurrentNode().id,"partindex":ui.index});
	    		event.data.view.pushHintState(hintState);
		    });
	    };
		
	    // append hints into one html string
	    var hintsStringPart1 = "";   // first part will be the <ul> for text on tabs
	    var hintsStringPart2 = "";   // second part will be the content within each tab
	    var hintsArr = currentNode.getHints().hintsArray;
	    
	    var contentBaseUrl = this.config.getConfigParam("getContentBaseUrl");
	    for (var i=0; i< hintsArr.length; i++) {
	    	var currentHint = hintsArr[i];
			if(contentBaseUrl != null) {
				//change the relative assets path to an absolute path
				currentHint = currentHint.replace(/\.\/assets|\/assets|assets/gi, contentBaseUrl + 'assets');
			}

	    	var nextLink = '<span class="tabNext">'+this.getI18NString("hint_next")+'</span>';
	    	var prevLink = '<span class="tabPrev">'+this.getI18NString("hint_prev")+'</span>';
	    	if(i==0){
	    		var prevLink = '';
	    		if(numHints<2){
	    			nextLink = '';
	    		}
	    	} else if (i==numHints-1){
	    		var nextLink = '';
	    	}
	    	hintsStringPart1 += "<li><a href='#tabs-"+i+"'>"+this.getI18NString("hint_hint")+" "+(i+1)+"</a></li>";
	    	hintsStringPart2 += "<div id='tabs-"+i+"'>"+
		    	"<div class='hintHeader'>"+this.getI18NString("hint_hint")+" "+ (i+1) +" of " + numHints + "</div>"+
		    	"<div class='hintText'>"+currentHint+"</div>"+
		    	"<div class='hintControls'>" + prevLink + nextLink + "</div>"+
	    		"</div>";
	    }
	    hintsStringPart1 = "<ul>" + hintsStringPart1 + "</ul>";

	    hintsString = "<div id='hintsTabs'>" + hintsStringPart1 + hintsStringPart2 + "</div>";
	    //set the html into the div
	    $('#hintsPanel').html(hintsString);

	    // instantiate tabs 
		var $tabs = $("#hintsTabs").tabs();
		
		// bind tab navigation link clicks
		$('.tabPrev').click(function(){
			var selected = $tabs.tabs('option', 'selected');
			if(selected != 0){
				$tabs.tabs('select', selected-1);
			}
			eventManager.fire("adjustHintSize");
		});
		
		// bind tab navigation links
		$('.tabNext').click(function(){
			var selected = $tabs.tabs('option', 'selected');
			if(selected < numHints-1){
				$tabs.tabs('select', selected+1);
			}
			eventManager.fire("adjustHintSize");
		});
			
		$("#hintsLink").show();
		highlight();
		
		// check if forceShow is set
		var forceShow = currentNode.getHints().forceShow;
		if (forceShow == "always") {  // always force show hints
			this.eventManager.fire("showStepHints");
		} else if (forceShow == "firsttime") {  // only show hints if this is the first time
		    var nodeVisitArray = this.state.getNodeVisitsByNodeId(currentNode.id);
		    if (nodeVisitArray.length == 1) {  // if this is the first time, the first nodevisit will already be created.
				this.eventManager.fire("showStepHints");
		    }
		}
    } else {
    	$("#hintsLink").hide();
    }
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/vle/vleview_hint.js');
}