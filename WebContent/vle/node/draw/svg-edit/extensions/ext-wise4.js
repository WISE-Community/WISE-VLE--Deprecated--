/*
 * ext-wise4.js
 *
 * Licensed under the Apache License, Version 2
 *
 * Copyright(c) 2010 Jonathan Breitbart
 *
 * Customizes the svg-edit user interface for use in the WISE4 learning environment
 */

 
svgEditor.addExtension("WISE4", function(S) {
	//var svgcontent = S.svgcontent;
	var lz77 = new LZ77(); // lz77 compression object
	svgEditor.changed = false; // boolean to specify whether data has changed, if no changes, do not post nodestate on exit
	svgEditor.initLoad = false; // boolean to specify whether svgeditor is populating canvas on node entry or on snapshot click
	var changeNum = 0;
	
	function updateDisplay(){
		// remove unused elements in wise4
		$('#tool_wireframe').remove();
		$('#tool_source').remove();
		$('#tool_zoom').remove();
		$('#tool_fhrect').remove();
		$('#tool_fhellipse').remove();
		$('.stroke_tool').remove();
		$('#toggle_stroke_tools').remove();
		$('#idLabel').remove();
		$('#tool_blur').remove();
		$('#line_panel').remove();
		$('#circle_panel').remove();
		$('#ellipse_panel').remove();
		$('#rect_panel > .toolset').remove();
		$('#xy_panel').remove();
		$('#zoom_panel').hide();
		$('#tool_font_family').remove();
		$('#tool_node_x').remove();
		$('#tool_node_y').remove();
		$('#tool_topath').remove();
		$('#tool_reorient').remove();
		$('#layerpanel').remove();
		$('#palette_holder').remove();
		$('#main_button').remove();
		$('#history_panel > .tool_sep').remove();
		$('#tool_image').hide();
		$('#image_panel > .toolset').remove();
		$('#sidepanel_handle').remove();
		
		// move elements and adjust display in wise4
		$('#tool_angle').insertAfter('#tool_reorient');
		$('#tool_opacity').insertAfter('#tool_angle');
		$('#tool_move_top').insertAfter('#tool_opacity');
		$('#tool_move_bottom').insertAfter('#tool_move_top');
		$('#tool_position').insertAfter('#tool_move_bottom');
		$('#selected_panel > div.toolset:eq(0) > div.tool_sep:eq(2)').remove();
		$('<div class="tool_sep"></div>').insertAfter('#tool_position');
		$('#cur_position').css({'margin-top':'1px','padding-right':'0'});
		$('#tool_position').css('margin-right','2px');
		$('#tool_opacity').css({'background':'none','position':'inherit'});
		$('#opacity_dropdown').removeClass('dropup');
		$('#group_opacity').css({'padding':'2px 5px 2px 2px','margin-right':'2px'});
		$('#group_opacityLabel').css('margin','0');
		$('#angle').css('padding','2px 10px 2px 2px');
		$('#font_size').css('padding','2px 10px 2px 2px');
		$('#tool_angle').css('margin-left','0');
		$('#cornerRadiusLabel').css('margin-left','0');
		$('.tool_sep').css({'height':'28px','margin':'3px 3px'});
		$('#workarea').css({'top':'60px','bottom':'36px'});
		$('#sidepanels').css({'top':'60px','bottom':'36px','padding':'0'});
		$('#tools_top').css({'left':'2px','height':'57px'});
		$('#tools_left').css('top','60px');
		$('#tools_bottom').css('height','32px');
		$('#workarea').css('right','5px');
		//$('ellipse#svg_1').attr('fill','url(http://localhost:8080/vlewrapper/vle/vle.html#xxsvg_47010)'); // needed for some reason in wise4
		
		svgCanvas.setFontFamily('sans-serif'); // set default font family
		
		$(window).resize(function() {
			if($('#workarea').height()>30){
				$('#fit_to_canvas').mouseup(); // fit svg drawing canvas to window whenever content resizes
			}
		});
		
		setupWarning();
	};
	
	function setupWarning(){
		var drawWarning = '<div id="drawlimit_dialog" title="Drawing is Too Big" style="display:none;"><div class="ui-state-error">' +
			'<span class="ui-icon ui-icon-alert" style="float:left"></span>Warning! Your current drawing is too large.' +
			'</div><div class="ui-dialog-content-content">If you would like to save this drawing, please delete some of the items in the picture.  Thank you!' +
			'</div></div>';
		
		$('#svg_editor').append(drawWarning);
		
		$('#drawlimit_dialog').dialog({
			bgiframe: true,
			resizable: false,
			modal: true,
			autoOpen:false,
			width:420,
			buttons: {
				'OK': function() {
					$(this).dialog('close');
				}
			}
		});
	};
	
	// whenever user has modified drawing canvas, check whether current drawing is too large (>20k)
	// TODO: add text tool changes to this code (svg-edit bug)
	function checkDrawSize(){
		var current = svgCanvas.getSvgString();
		var compressed = lz77.compress(current);
		//alert(current.length*2 + ' ' + compressed.length * 2);
		// if compressed svg string is larger than 20k, alert user and undo latest change
		if(compressed.length * 2 > 20480){
			$('#tool_undo').click();
			$('#drawlimit_dialog').dialog('open');
		}
	};
		
	return {
		name: "WISE4",
		context_tools: [],
		callback: function() {
			updateDisplay();
		},
		elementChanged: function(){
			if(!svgEditor.initLoad && !svgEditor.initSnap) {
				changeNum++;
				checkDrawSize(); // if not opening a snapshot or loading initial drawing, check draw size
			}
			//alert(svgEditor.initLoad + ' ' + svgEditor.initSnap + ' ' + svgEditor.changed);
			if (changeNum>0){ // check to see if this change is this initial drawing import
				svgEditor.changed = true;
			}
		}
	};
});
