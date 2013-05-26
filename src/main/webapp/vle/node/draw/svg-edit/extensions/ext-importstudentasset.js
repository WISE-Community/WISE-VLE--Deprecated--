/*
 * ext-importStudentAsset.js
 * launches the student assets dialog
 * @author hirokiterashima
 */
svgEditor.addExtension("Import Student Asset", function() {
	var loaded = false;
	
	var api = svgEditor.ext_importstudentasset = {
		/** 
		 * Gets whether extensions has completely loaded
		 * 
		 * @returns Boolean
		 */
		isLoaded: function(){
			return loaded;
		},
		/**
		 * Listener function that is called when the extension has fully loaded
		 */
		loadComplete: function(){
			// optional: override with custom actions
		}
	};

	return {
		name: "import student asset",
		svgicons: "extensions/import_student_asset.xml",
		buttons: [{
			id: "tool_import_student_asset",
			type: "mode",
			title: "Import Student Asset Tool", 
			events: {
				'click': function() {
					eventManager.fire("viewStudentAssets", null);
				}
			}
		}],
		callback: function(){
			//$('#tool_import_student_asset').insertAfter('#tool_text'); // place connector button directly after text_tool
			// reset flyout positions
			setTimeout(function(){
				$('.tools_flyout').each(function() {
					var shower = $('#' + this.id + '_show');
					var pos = shower.offset();
					var w = shower.outerWidth();
					$(this).css({left: pos.left + w, top: pos.top});
				});
			},500);
			
			loaded = true;
			api.loadComplete();
		}
	};
});

