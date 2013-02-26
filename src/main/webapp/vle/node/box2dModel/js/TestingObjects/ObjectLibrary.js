(function (window)
{
	/** Creates a menu with the names of the materials */
	function ObjectLibrary (width_px, height_px, shape_width_px, shape_height_px, shape_dx, shape_dy)
	{
		this.initialize(width_px, height_px, shape_width_px, shape_height_px, shape_dx, shape_dy);
	}
	var p = ObjectLibrary.prototype = new createjs.Container();
	p.Container_initialize = ObjectLibrary.prototype.initialize;
	p.Container_tick = p._tick;
	p.TEXT_COLOR = "rgba(255,255,255,1.0)";
	p.BACKGROUND_COLOR = "rgba(80, 80, 80, 1.0)";
	//p.FLOOR_COLOR = "rgba(200,145,145,1.0)";
	//p.BACK_COLOR = "rgba(100,45,45,1.0)";
	p.PLACE_ON_GROUND = true;
	
	p.initialize = function(width_px, height_px, shape_width_px, shape_height_px, shape_dx, shape_dy)
	{
		this.Container_initialize();
		this.width_px = width_px;
		this.height_px = height_px;
		this.shape_width_px = shape_width_px;
		this.shape_height_px = shape_height_px;
		this.shape_dx = shape_dx;
		this.shape_dy = shape_dy;
		//background
		this.g = new createjs.Graphics();
		this.shape = new createjs.Shape(this.g);
		this.addChild(this.shape);
		this.g.beginFill(this.BACKGROUND_COLOR);
		this.g.drawRect(0, 0, this.width_px, this.height_px);
		this.g.endFill();

		// text
		this.title = new createjs.Text("Model \nLibrary", "20px Arial", this.TEXT_COLOR);
		this.title.x = 20;
		this.title.y = 20;
		this.addChild(this.title);
	
		
		this.shapes = [];
		this.num_rows = Math.floor((this.height_px)/shape_height_px)
		this.num_cols = Math.floor((this.width_px)/shape_width_px);
		this.MAX_OBJECTS_IN_LIBRARY = Math.min(this.num_rows * this.num_cols -1, GLOBAL_PARAMETERS.MAX_OBJECTS_IN_LIBRARY);

		this.hinges = [];
		var hingeG, hingeS;
		
		for (var i = 0; i < this.num_rows; i++){
			
			for (var j = 0; j < this.num_cols; j++){
				if (!(i==0&&j==0)){
					//bottom
					this.g.beginStroke("rgba(100,100,100,1.0)");
					this.g.beginLinearGradientFill(["rgba(200,245,200,1.0)","rgba(180,210,180,1.0)"],[0,1.0],shape_width_px*j, shape_height_px*(i+1),shape_width_px*(j+1)+shape_dx, shape_height_px*(i+1)-shape_dy);
					this.g.moveTo(shape_width_px*j, shape_height_px*(i+1));
					this.g.lineTo(shape_width_px*(j+1), shape_height_px*(i+1));
					this.g.lineTo(shape_width_px*(j+1)+shape_dx, shape_height_px*(i+1)-shape_dy);
					this.g.lineTo(shape_width_px*(j)+shape_dx, shape_height_px*(i+1)-shape_dy);
					this.g.lineTo(shape_width_px*j, shape_height_px*(i+1));
					this.g.endFill();
					//back
					this.g.beginLinearGradientFill(["rgba(250,250,250,1.0)","rgba(230,210,220,1.0)"],[0,1.0],shape_width_px*j+shape_dx, shape_height_px*(i),shape_width_px*(j+1)+shape_dx, shape_height_px*(i+1)-shape_dy);
					this.g.moveTo(shape_width_px*(j+1)+shape_dx, shape_height_px*(i+1)-shape_dy);
					this.g.lineTo(shape_width_px*(j)+shape_dx, shape_height_px*(i+1)-shape_dy);					
					this.g.lineTo(shape_width_px*j+shape_dx, shape_height_px*(i));
					this.g.lineTo(shape_width_px*(j+1)+shape_dx, shape_height_px*(i));
					this.g.lineTo(shape_width_px*(j+1)+shape_dx, shape_height_px*(i+1)-shape_dy);
					this.g.endFill();
					// draw left hinge for first in row
					if (j==0 || (i==0 && j==1)){
						hingeG =  new createjs.Graphics();
						hingeS = new createjs.Shape(hingeG);
						this.addChild(hingeS);
						this.hinges.push(hingeS);
						hingeG.setStrokeStyle(2).beginStroke("rgba(120,160,120,1.0)");//.beginFill("rgba(200,200,200,1.0)");
						hingeG.moveTo(shape_width_px*(j)+shape_dx, shape_height_px*(i+1)-shape_dy-(shape_height_px-shape_dy)*2/2);
						hingeG.lineTo(shape_width_px*(j)+shape_dx, shape_height_px*(i+1)-shape_dy);
						hingeG.lineTo(shape_width_px*(j)+shape_dx*0/2, shape_height_px*(i+1)-shape_dy*0/2);
						hingeG.lineTo(shape_width_px*(j)+shape_dx, shape_height_px*(i+1)-shape_dy-(shape_height_px-shape_dy)*2/2);
						hingeG.endFill().endStroke();
					}
					// draw right side hinge
					hingeG =  new createjs.Graphics();
					hingeS = new createjs.Shape(hingeG);
					this.addChild(hingeS);
					this.hinges.push(hingeS);
					hingeG.setStrokeStyle(2).beginStroke("rgba(120,160,120,1.0)");//.beginFill("rgba(200,200,200,1.0)");
					hingeG.moveTo(shape_width_px*(j+1)+shape_dx, shape_height_px*(i+1)-shape_dy-(shape_height_px-shape_dy)*2/2);
					hingeG.lineTo(shape_width_px*(j+1)+shape_dx, shape_height_px*(i+1)-shape_dy);
					hingeG.lineTo(shape_width_px*(j+1)+shape_dx*0/2, shape_height_px*(i+1)-shape_dy*0/2);
					hingeG.lineTo(shape_width_px*(j+1)+shape_dx, shape_height_px*(i+1)-shape_dy-(shape_height_px-shape_dy)*2/2);
					hingeG.endFill().endStroke();
				}
			}	
		}

		stage.ready_to_update = true;
	}
	p.getIsFull = function(){
		return this.shapes.length >= this.MAX_OBJECTS_IN_LIBRARY;
	}

	p.addObject = function (o)
	{
		var index = this.shapes.length + 1;
		if (index <= this.MAX_OBJECTS_IN_LIBRARY)
		{
			this.addChildAt(o, this.getChildIndex(this.hinges[index-1+Math.floor(index / this.num_cols)])+1);
			o.x = (index % this.num_cols) * this.shape_width_px + this.shape_dx;
			if(this.PLACE_ON_GROUND){
				o.y = Math.ceil(index / this.num_cols) * this.shape_height_px - o.height_px_below;
			} else {
				o.y = Math.floor(index / this.num_cols) * this.shape_height_px + this.shape_dy;
			}
			this.shapes.push(o);

			// add html buttons
			var id = typeof o.skin.savedObject.id === "undefined" ? GLOBAL_PARAMETERS.total_objects_made : o.skin.savedObject.id;
			o.skin.savedObject.id = id;
			if (typeof o.skin.savedObject.is_deletable === "undefined") o.skin.savedObject.is_deletable = true;
			
			var b_id = "library-button-" + id;
			var htmlText;
			if (o.skin.savedObject.is_deletable){
				if (o.skin.savedObject.is_revisable){
					htmlText = '<div id ="' + b_id + '" style="font-size:14px; position:absolute"><input type="submit"/><ul><li><a href="#">Duplicate</a></li><li><a href="#">Delete</a></li><li><a href="#">Revise</a></li></ul></div>';
				} else {
					htmlText = '<div id ="' + b_id + '" style="font-size:14px; position:absolute"><input type="submit"/><ul><li><a href="#">Duplicate</a></li><li><a href="#">Delete</a></li></ul></div>';
				}
			} else {
				if (o.skin.savedObject.is_revisable){
					htmlText = '<div id ="' + b_id + '" style="font-size:14px; position:absolute"><input type="submit"/><ul><li><a href="#">Duplicate</a></li><li><a href="#">Revise</a></li></ul></div>';	
				} else {
					htmlText = '<div id ="' + b_id + '" style="font-size:14px; position:absolute"><input type="submit"/><ul><li><a href="#">Duplicate</a></li></ul></div>';			
				}
			}

			$('#library-button-holder').append(htmlText);id ="' + b_id + '"
			$('#library-button-holder').find("ul").menu().hide();
			var htmlElement = $("#" + b_id)
				.find("input")
				.button({
                    label: "Actions",
                    icons: {
                        primary: 'ui-icon-triangle-1-s'
                    }
                })
                .click(function() {
			        var menu = $(this).parent().find("ul").show().position({
			      		my: "left top",
                        at: "left bottom",
                        of: this
                    });
                    $( document ).one( "click",function() {
                         if ($(event.target).text() == "Duplicate")
                        {
                        	tester.library.duplicateObjectFromHTML($(event.target).parent().parent().parent());
	
                        } else if ($(event.target).text() == "Delete")
                        {
                        	tester.library.deleteObjectFromHTML($(event.target).parent().parent().parent());
                        } else if ($(event.target).text() == "Revise")
                        {
                        	tester.library.reviseObjectFromHTML($(event.target).parent().parent().parent());
                        }
                        menu.hide();
                        return false;
                    });
                    return false;
			    });
                
			var element = new createjs.DOMElement(htmlElement[0]);
			this.addChild(element);
			element.x = this.x + o.x;
			if (this.PLACE_ON_GROUND){
				element.y = this.y-10;
			} else {
				element.y = this.y + this.height_px - 30;
			}
			
			o.html = htmlElement.parent();
			o.button = element;

			return true;
		} else {
			return false;
		}
	}

	p.reviseObjectFromHTML = function (html){
		for (var i = 0; i < this.shapes.length; i++)
		{
			if (this.shapes[i].html.attr("id") == html.attr("id"))
			{
				eventManager.fire("revise-model", [this.shapes[i].skin.savedObject]);
				this.reviseObject(this.shapes[i]);
				return true;
			}
		}
		return false;
	}
		p.reviseObject = function (o){
			o.skin.savedObject.is_revisable = true;
			var savedObject = o.skin.savedObject;
			if (builder.restoreSavedObject(savedObject)){
				o.skin.savedObject.is_deleted = true;
				this.removeObject(o);
				this.parent.removeObjectFromLibrary();
				return true;
			} else {
				return false;
			}
		}

	p.duplicateObjectFromHTML = function (html)
	{
		for (var i = 0; i < this.shapes.length; i++)
		{
			if (this.shapes[i].html.attr("id") == html.attr("id"))
			{
				this.duplicateObject(this.shapes[i]);
				eventManager.fire("duplicate-model", [this.shapes[i].skin.savedObject]);
				return true;
			}
		}
		return false;
	}

		p.duplicateObject = function (o)
		{
			// always make duplicates deletable
			o.skin.savedObject.is_deletable = true;
			createObject(o.skin.savedObject);
		}

	p.deleteObjectFromHTML = function (html)
	{
		for (var i = 0; i < this.shapes.length; i++)
		{
			if (this.shapes[i].html.attr("id") == html.attr("id"))
			{
				this.shapes[i].skin.savedObject.is_deleted = true;
				eventManager.fire("delete-model", [this.shapes[i].skin.savedObject]);
				this.removeObject(this.shapes[i]);
				this.parent.removeObjectFromLibrary();
				return true;
			}
		}
		return false;
	}

		p.removeObject= function (o)
		{
			var index = this.shapes.indexOf(o);
			this.shapes.splice(index, 1);
			if (typeof o.button != "undefined") this.removeChild(o.button);
			if (typeof o.html != "undefined" && o.html != null)	o.html.remove();
			this.removeChild(o);
			// move shapes below up
			for (var i = index; i < this.shapes.length; i++)
			{
				var s = this.shapes[i];
				var new_index = i + 1;
				this.removeChild(s);
				this.addChildAt(s, this.getChildIndex(this.hinges[new_index-1+Math.floor(new_index / this.num_cols)])+1);
			
				s.x = (new_index % this.num_cols) * this.shape_width_px + this.shape_dx;
				if(this.PLACE_ON_GROUND){
					s.y = Math.ceil(new_index / this.num_cols) * this.shape_height_px - s.height_px_below;
				} else {
					s.y = Math.floor(new_index / this.num_cols) * this.shape_height_px + this.shape_dy;
				}
				
				if (typeof s.button != "undefined")
				{
					s.button.x = this.x + s.x;
					if (this.PLACE_ON_GROUND){
						s.button.y = this.y - 10;
					} else {
						s.button.y = this.y + this.height_px - 30;
					}					
				}
			}			
		}

	p._tick = function()
	{
		this.Container_tick();
	}

	p.redraw = function()
	{
		stage.ready_to_update = true;
			
	}
	
	window.ObjectLibrary = ObjectLibrary;
}(window));
