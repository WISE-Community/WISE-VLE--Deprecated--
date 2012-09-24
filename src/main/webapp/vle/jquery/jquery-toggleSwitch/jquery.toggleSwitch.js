/*!
 * jQuery Toggle Switch plugin (converts input checkboxes to toggle on/off switches)
 * Author: Jonathan Lim-Breitbart
 * Version: 1.0
 * Licensed under the MIT license
 * Inspired by: http://tutorialzine.com/2011/03/better-check-boxes-jquery-css/
 */

;(function($){
	
	var methods = {
		init : function( options ){
			// Extend default options
			options = $.extend({}, $.fn.toggleSwitch.options, options);
	
			return this.each(function(){
				var cBox = $(this),
					data = cBox.data('toggleSwitch');
				
				if(!data){
					var labels = [],
						onColor = options.onColor,
						offColor = options.offColor;
		
					// Check for 'data-on' and 'data-off' HTML5 attributes
					if(cBox.data('on')){
						labels[0] = cBox.data('on');
						labels[1] = cBox.data('off');
					} else {
						labels = options.labels;
					}
		
					// Create new switch markup
					var cSwitch = $('<div>',{
						'class' : 'tSwitch '+(this.checked?'checked':''),
						'html' : '<div class="tSwitchSlider">'+
								'<span class="tSwitchOn tSwitchLabel">'+labels[0]+'</span>'+
								'<span class="tSwitchHandle"></span>'+
								'<span class="tSwitchOff tSwitchLabel">'+labels[1]+'</span></div>'
								
					});
					
					var cSlider = cSwitch.children('.tSwitchSlider');
		
					// Insert the new switch, hide the original checkbox
					cSwitch.insertAfter(cBox.hide());
					
					// Set label content element widths equal to widest label width
					var labels = $('.tSwitchLabel',cSwitch),
						labelW = Math.max.apply(Math, labels.map(function(){ return $(this).width(); }).get());
					labels.each(function(){
						$(this).width(labelW);
					});
					
					// Set slider margin offset
					var offset = $('.tSwitchOn',cSwitch).outerWidth();
					
					// Set 'off' label position
					$('.tSwitchOff',cSwitch).css('left',offset+$('.tSwitchHandle',cSwitch).outerWidth());
					
					// Set handle position
					$('.tSwitchHandle',cSwitch).css('left',offset);
					
					// Set switch width
					cSwitch.width(offset + $('.tSwitchHandle',cSwitch).outerWidth());
					
					// Store plugin data
					cBox.data('toggleSwitch', {
						target : this,
						cSwitch : cSwitch,
						cSlider : cSlider,
						onColor : onColor,
						offColor : offColor,
						offset : offset
					});
					
					// Set initial state
					setDisplay(cBox,this.checked);
					
					// Bind click action on new switch
					cSwitch.on('click.toggleSwitch',function(){
						cSwitch.toggleClass('checked');
						var isChecked = cSwitch.hasClass('checked');
						setDisplay(cBox,isChecked);
		
						// Synchronize with the original checkbox
						cBox.prop('checked',isChecked);
						cBox.triggerHandler('click');
					});
		
					// Listen for changes on the original checkbox and update switch
					cBox.on('change.toggleSwitch',function(){
						cSwitch.click();
					});
				}
			});
		},
		destroy : function(){
			return this.each(function(){
				var cBox = $(this),
					data = cBox.data('toggleSwitch');
				
				if( typeof data !== 'undefined'){
					// Unbind original checkbox change event listener for toggleSwitch and remove the switch
					cBox.off('.toggleSwitch');
					data.cSwitch.remove();
					
					// show original checkbox
					cBox.show();
					
					cBox.removeData('toggleSwitch');
				}
			});
		},
		refresh : function(){
			return this.each(function(){				
				setDisplay($(this),this.checked)
			});
		}
	};
	
	// Private function to update toggleSwitch display state
	function setDisplay( cBox, checked ){
		var data = cBox.data('toggleSwitch');
		checked ? data.cSlider.css({'margin-left':'0','background-color':data.onColor}) : 
			data.cSlider.css({'margin-left':-data.offset-1 + 'px','background-color':data.offColor});
	};
	
	$.fn.toggleSwitch = function( method ){
		if ( methods[method] ) {
	      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.toggleSwitch' );
	    }  
	};
	
	// Default options
	$.fn.toggleSwitch.options = {
        labels: ['ON','OFF'],
        onColor: '#1c8ca8',
        offColor: '#EEEEEE'
    };
	
})(jQuery);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/jquery/jquery-toggleSwitch/jquery.toggleSwitch.js');
}