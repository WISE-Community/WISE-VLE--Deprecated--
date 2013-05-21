(function (window)
{
	/** A space for displaying the names of materials, clickable/draggable materials
	and a grid space for putting them together */
	function ObjectTestingPanel (width_px, height_px)
	{
		this.initialize(width_px, height_px);
	}
	var p = ObjectTestingPanel.prototype = new createjs.Container();
	p.Container_initialize = ObjectTestingPanel.prototype.initialize;
	p.Container_tick = p._tick;
	p.TITLE_HEIGHT = 40;
	p.BORDER_WIDTH = 10;
	p.EXPORT_HEIGHT = 20;
	
	// constants
	//p.MATERIAL_TYPES = ["full", "center3", "center1", "ends"];

	p.initialize = function(width_px, height_px)
	{
		this.Container_initialize();
		this.width_px = width_px;
		this.height_px = height_px;
		this.width_from_depth = GLOBAL_PARAMETERS.MAX_DEPTH_UNITS * GLOBAL_PARAMETERS.SCALE * Math.sin(GLOBAL_PARAMETERS.view_sideAngle);
		this.height_from_depth = GLOBAL_PARAMETERS.MAX_DEPTH_UNITS * GLOBAL_PARAMETERS.SCALE * Math.sin(GLOBAL_PARAMETERS.view_topAngle);
		this.max_shape_width_px = this.width_from_depth +  GLOBAL_PARAMETERS.MAX_WIDTH_UNITS * GLOBAL_PARAMETERS.SCALE;
		this.max_shape_height_px = this.height_from_depth +  GLOBAL_PARAMETERS.MAX_HEIGHT_UNITS * GLOBAL_PARAMETERS.SCALE;
		
		//background
		this.g = new createjs.Graphics();
		this.shape = new createjs.Shape(this.g);
		this.addChild(this.shape);

		var current_x = this.BORDER_WIDTH;
		var current_y = GLOBAL_PARAMETERS.PADDING;
		
		//library
		if (GLOBAL_PARAMETERS.INCLUDE_LIBRARY){
			this.library = new ObjectLibrary(this.width_px-2*this.BORDER_WIDTH, this.max_shape_height_px, this.max_shape_width_px, this.max_shape_height_px, this.width_from_depth, this.height_from_depth);
			this.addChild(this.library);
			this.library.x = this.BORDER_WIDTH;
			this.library.y = this.BORDER_WIDTH;
			current_y += this.library.y + this.library.height_px;
		} else {
			this.library = null;
		}

		this.dragging_object = null;
		//balanceWorld
		//this.height_px = current_y;
		var separation_x = 0;
		var world_width_px = this.width_px - this.BORDER_WIDTH - current_x;
		var world_height_px = this.height_px - this.BORDER_WIDTH - current_y;
		this.testingWorld = new Testingb2World(world_width_px, world_height_px, current_x , current_y) ;
		this.addChild(this.testingWorld);
		this.testingWorld.x = current_x;
		this.testingWorld.y = current_y;
		separation_x = current_x - GLOBAL_PARAMETERS.PADDING;
			
		if (GLOBAL_PARAMETERS.INCLUDE_SCALE) {
		} 
		if (GLOBAL_PARAMETERS.INCLUDE_BALANCE) {
		}	
		
		if (GLOBAL_PARAMETERS.INCLUDE_BEAKER) {
			var beaker_width_px = this.max_shape_width_px-this.width_from_depth;
			var beaker_height_px = beaker_width_px*2;
			var beaker_depth_px = this.max_shape_width_px - this.width_from_depth;
			
			this.createBeakerInWorld(world_width_px/4, world_height_px-10, 5, 8, 5, 1.0, 0.5, "dynamic");
			//this.createBeakerInWorld(world_width_px*2/3, world_height_px-10, 10, 3, 5, 0.0, 0.0, "dynamic");
			this.createScaleInWorld(world_width_px*2/3, world_height_px-10, 5, "dynamic");
		} 
		var export_offsetL = 250;
		var export_offsetR = 50;

		this.g.beginFill("rgba(255,255,255,1.0)");
		this.g.drawRect(0, 0, this.width_px, this.height_px);
		this.g.endFill();
		this.g.beginFill("rgba(225,225,255,1.0)");
		this.g.drawRect(this.width_px-export_offsetL-this.BORDER_WIDTH, -this.EXPORT_HEIGHT, export_offsetL-export_offsetR+this.BORDER_WIDTH, this.EXPORT_HEIGHT+this.BORDER_WIDTH);
		this.g.endFill();

		// draw border
		this.g.beginLinearGradientFill(["rgba(100,100,100,1.0)","rgba(150,150,150,1.0)","rgba(200,200,200,1.0)","rgba(150,150,150,1.0)","rgba(100,100,100,1.0)"],[0,0.2,0.5,0.8,1.0],0,0,this.BORDER_WIDTH,0);
		this.g.moveTo(0,0);
		this.g.lineTo(this.BORDER_WIDTH,this.BORDER_WIDTH);
		this.g.lineTo(this.BORDER_WIDTH,this.height_px - this.BORDER_WIDTH);
		this.g.lineTo(0, this.height_px);
		this.g.lineTo(0,0);
		this.g.endFill();
		this.g.beginLinearGradientFill(["rgba(100,100,100,1.0)","rgba(150,150,150,1.0)","rgba(200,200,200,1.0)","rgba(150,150,150,1.0)","rgba(100,100,100,1.0)"],[0,0.2,0.5,0.8,1.0],0,0,0,this.BORDER_WIDTH);
		this.g.moveTo(0,0);
		this.g.lineTo(this.width_px-export_offsetL-this.BORDER_WIDTH,0);
		this.g.lineTo(this.width_px-export_offsetL,this.BORDER_WIDTH);
		this.g.lineTo(this.BORDER_WIDTH, this.BORDER_WIDTH);
		this.g.lineTo(0,0);
		this.g.endFill();
		this.g.beginLinearGradientFill(["rgba(100,100,100,1.0)","rgba(150,150,150,1.0)","rgba(200,200,200,1.0)","rgba(150,150,150,1.0)","rgba(100,100,100,1.0)"],[0,0.2,0.5,0.8,1.0],this.width_px-export_offsetL-this.BORDER_WIDTH,0,this.width_px-export_offsetL,0);
		this.g.moveTo(this.width_px-export_offsetL-this.BORDER_WIDTH,-this.EXPORT_HEIGHT);
		this.g.lineTo(this.width_px-export_offsetL,-this.BORDER_WIDTH - this.EXPORT_HEIGHT);
		this.g.lineTo(this.width_px-export_offsetL,this.BORDER_WIDTH);
		this.g.lineTo(this.width_px-export_offsetL-this.BORDER_WIDTH,0);
		this.g.lineTo(this.width_px-export_offsetL-this.BORDER_WIDTH,-this.EXPORT_HEIGHT);
		this.g.endFill();
		this.g.beginLinearGradientFill(["rgba(100,100,100,1.0)","rgba(150,150,150,1.0)","rgba(200,200,200,1.0)","rgba(150,150,150,1.0)","rgba(100,100,100,1.0)"],[0,0.2,0.5,0.8,1.0],0,0,0,this.BORDER_WIDTH);
		this.g.moveTo(this.width_px-export_offsetR,0);
		this.g.lineTo(this.width_px-export_offsetR-this.BORDER_WIDTH,this.BORDER_WIDTH);
		this.g.lineTo(this.width_px-this.BORDER_WIDTH,this.BORDER_WIDTH);
		this.g.lineTo(this.width_px,0);
		this.g.lineTo(this.width_px-export_offsetR,0);
		this.g.endFill();
		this.g.beginLinearGradientFill(["rgba(100,100,100,1.0)","rgba(150,150,150,1.0)","rgba(200,200,200,1.0)","rgba(150,150,150,1.0)","rgba(100,100,100,1.0)"],[0,0.2,0.5,0.8,1.0],this.width_px-export_offsetR-this.BORDER_WIDTH,0,this.width_px-export_offsetR,0);
		this.g.moveTo(this.width_px-export_offsetR-this.BORDER_WIDTH,-this.BORDER_WIDTH- this.EXPORT_HEIGHT);
		this.g.lineTo(this.width_px-export_offsetR,-this.EXPORT_HEIGHT);
		this.g.lineTo(this.width_px-export_offsetR,0);
		this.g.lineTo(this.width_px-export_offsetR-this.BORDER_WIDTH,this.BORDER_WIDTH);
		this.g.lineTo(this.width_px-export_offsetR-this.BORDER_WIDTH,-this.BORDER_WIDTH- this.EXPORT_HEIGHT);
		this.g.endFill();
		this.g.beginLinearGradientFill(["rgba(100,100,100,1.0)","rgba(150,150,150,1.0)","rgba(200,200,200,1.0)","rgba(150,150,150,1.0)","rgba(100,100,100,1.0)"],[0,0.2,0.5,0.8,1.0],this.width_px,0,this.width_px-this.BORDER_WIDTH,0);
		this.g.moveTo(this.width_px,0);
		this.g.lineTo(this.width_px-this.BORDER_WIDTH,this.BORDER_WIDTH);
		this.g.lineTo(this.width_px-this.BORDER_WIDTH,this.height_px - this.BORDER_WIDTH);
		this.g.lineTo(this.width_px, this.height_px);
		this.g.lineTo(this.width_px,0);
		this.g.endFill();
		this.g.beginLinearGradientFill(["rgba(100,100,100,1.0)","rgba(150,150,150,1.0)","rgba(200,200,200,1.0)","rgba(150,150,150,1.0)","rgba(100,100,100,1.0)"],[0,0.2,0.5,0.8,1.0],0,this.height_px,0,this.height_px-this.BORDER_WIDTH);
		this.g.moveTo(0,this.height_px);
		this.g.lineTo(this.width_px,this.height_px);
		this.g.lineTo(this.width_px-this.BORDER_WIDTH,this.height_px-this.BORDER_WIDTH);
		this.g.lineTo(this.BORDER_WIDTH, this.height_px-this.BORDER_WIDTH);
		this.g.lineTo(0,this.height_px);
		this.g.endFill();
		
		if (separation_x > 0){
			this.g.beginLinearGradientFill(["rgba(100,100,100,1.0)","rgba(150,150,150,1.0)","rgba(200,200,200,1.0)","rgba(150,150,150,1.0)","rgba(100,100,100,1.0)"],[0,0.2,0.5,0.8,1.0],separation_x,this.height_px-this.BORDER_WIDTH,separation_x+GLOBAL_PARAMETERS.PADDING,this.height_px-this.BORDER_WIDTH);
			this.g.moveTo(separation_x,this.height_px-this.BORDER_WIDTH);
			this.g.lineTo(separation_x+GLOBAL_PARAMETERS.PADDING,this.height_px-this.BORDER_WIDTH);
			this.g.lineTo(separation_x+GLOBAL_PARAMETERS.PADDING,this.height_px-this.BORDER_WIDTH-B2WORLD_HEIGHT);
			this.g.lineTo(separation_x,this.height_px-this.BORDER_WIDTH-B2WORLD_HEIGHT);
			this.g.lineTo(separation_x,this.height_px-this.BORDER_WIDTH);
			this.g.endFill();
		}
		//this.shape.cache(0, 0, this.height_px, this.width_px);

		this.actors = new Array();

		stage.ready_to_update = true;
	}

	p._tick = function()
	{
		this.Container_tick();
		//console.log(this, this.getNumChildren());
	}

	p.redraw = function()
	{
		stage.ready_to_update = true;
		this.shape.cache(0, 0, this.height_px, this.width_px);	
	}

	
	////////////////////// CLASS SPECIFIC ////////////////////
	p.createObjectForLibrary = function (o)
	{
		var actor;
		if (o.is_blockComp){
			actor = new BlockCompb2Actor(o); 
		} else if (o.is_cylinder){
			actor = new Cylinderb2Actor(o); 
		} else if (o.is_rectPrism){
			actor = new RectPrismb2Actor(o); 
		}	 
		 
		if (this.library != null && this.library.addObject(actor)){
			actor.onPress = this.actorPressHandler.bind(this);
			actor.orig_parent = this.library;
			actor.can_switch_worlds = true;
			this.actors.push(actor);
			if (this.library.getIsFull() && typeof builder != "undefined" && builder != null){
				builder.disableWithText('The library is full. To make a new model, first delete an old one.');
			}
			return true;
		} else {
			return false;
		}
	}	

	/** Called by the library, updated the building panel */
	p.removeObjectFromLibrary = function (o){
		builder.enable();
	}

	/** Place an object directly in the world */
	p.createObjectInWorld = function (o, x, y, rotation, type)
	{
		
		var actor;
		if (o.is_blockComp){
			actor = new BlockCompb2Actor(o); 
		} else if (o.is_cylinder){
			actor = new Cylinderb2Actor(o); 
		} else if (o.is_rectPrism){
			actor = new RectPrismb2Actor(o); 
		}
		actor.can_switch_worlds = false;

		//var wpoint = this.testingWorld.globalToLocal(testingWorld.x + x * GLOBAL_PARAMETERS.SCALE + actor.skin.width_px_left, testingWorld.y + testingWorld.height_px - y * GLOBAL_PARAMETERS.SCALE - actor.skin.height_px_below);
		
		this.testingWorld.addActor(actor, x * GLOBAL_PARAMETERS.SCALE, testingWorld.height_px - y * GLOBAL_PARAMETERS.SCALE - actor.skin.height_px_below);
		actor.orig_parent = this.testingWorld;
		if (type == "dynamic"){
			actor.onPress = this.actorPressHandler.bind(this);
		}

		return true;
	}	

	/** Place an interactive beaker in the testing world */
	p.createBeakerInWorld = function (x, y, width_units, height_units, depth_units, init_liquid_volume_perc, spilloff_volume_perc, type){
		var beaker = new Beakerb2Actor(width_units, height_units, depth_units, init_liquid_volume_perc, spilloff_volume_perc);
		beaker.can_switch_worlds = false;
		this.testingWorld.addBeaker(beaker, x, y);
		beaker.orig_parent = this.testingWorld;
		if (typeof type !== "undefined" && type == "dynamic"){
			beaker.skin.backContainer.onPress = this.actorPressHandler.bind(this);
		}

		return true;		
	}

	p.createScaleInWorld = function (x, y, pan_width_units, type){
		var scale = new Scaleb2Actor(pan_width_units, 0.1);
		scale.can_switch_worlds = false;
		this.testingWorld.addScale (scale, x, y);
		scale.orig_parent = this.testingWorld;
		if (typeof type !== "undefined" && type == "dynamic"){
			scale.onPress = this.actorPressHandler.bind(this);
		}

		return true;
	}

	/** Removes object from its current parent, allows movement based on current*/
	p.actorPressHandler = function (evt)
	{
		if (this.dragging_object != null) return;
		var is_beaker = false;
		if (typeof evt.target.beakerShape !== "undefined"){
			is_beaker = true;
			evt.target = evt.target.beakerShape.relativeParent;
		}
		var source_parent = evt.target.parent;
		//some special processing here for a beaker because the beaker has its front and back directly as children on world, put on beaker itself
		var offset = evt.target.globalToLocal(evt.stageX, evt.stageY);

		var lp = source_parent.localToLocal(evt.target.x, evt.target.y, this);
		// if object was in libarary remove
		if (source_parent instanceof ObjectLibrary){
			source_parent.removeObject(evt.target);
		} else if (source_parent instanceof Testingb2World){
			if (evt.target instanceof Beakerb2Actor) {
				source_parent.removeBeaker(evt.target);
			} else if (evt.target instanceof Scaleb2Actor) {
				source_parent.removeScale(evt.target);
			} else {
				source_parent.removeActor(evt.target);
			}
		} else if (source_parent instanceof Beakerb2Actor){
			source_parent = source_parent.parent;
			if (evt.target instanceof Beakerb2Actor) {
				source_parent.removeBeaker(evt.target);
			} else if (evt.target instanceof Scaleb2Actor) {
				source_parent.removeScale(evt.target);
			} else {
				source_parent.removeActor(evt.target);
			}
		} else {
			source_parent.removeActor(evt.target);
		}

		this.dragging_object = evt.target;
		//var gp = source_parent.localToGlobal(evt.target.x, evt.target.y);
					
		//var lp = this.globalToLocal(gp.x, gp.y);
		this.addChild(evt.target);
		evt.target.x = lp.x;
		evt.target.y = lp.y;
		evt.target.rotation = 0;
		evt.target.update();
		evt.onMouseMove = function (ev){
			var parent = this.target.parent;
			var lpoint = parent.globalToLocal(ev.stageX-offset.x, ev.stageY-offset.y);
			var newX = lpoint.x;
			var newY = lpoint.y;
			// place within bounds of this object
			if (parent instanceof ObjectTestingPanel){
				if (this.target.can_switch_worlds){
					if (newX < 0){ this.target.x = 0;
					} else if (newX > parent.width_px){	this.target.x = parent.width_px;
					} else { this.target.x = newX;
					}

					if (newY < 0){ this.target.y = 0;
					} else if (newY > parent.height_py){ this.target.y = parent.height_py;
					} else { this.target.y = newY;
					} 
				} else {
					// keep the target within the space of its source_parent object
					if (newX > source_parent.x + this.target.width_px_left && newX < source_parent.x + source_parent.width_px - this.target.width_px_right) this.target.x = newX;
					if (newY > source_parent.y && newY < source_parent.y + source_parent.height_px - this.target.height_px_below) this.target.y = newY;
				}
			} 
			stage.needs_to_update = true;
		}
		evt.onMouseUp = function (ev)
		{
			tester.dragging_object = null;
			var parent = this.target.parent;
			var wpoint;
			//
			if (parent.testingWorld != null && (!this.target.can_switch_worlds || parent.testingWorld.hitTestObject(this.target))) {
				wpoint = parent.testingWorld.globalToLocal(ev.stageX-offset.x, ev.stageY-offset.y);
				if (this.target instanceof Beakerb2Actor){
					parent.testingWorld.addBeaker(this.target, wpoint.x, wpoint.y);
				} else if (this.target instanceof Scaleb2Actor){
					parent.testingWorld.addScale(this.target, wpoint.x, wpoint.y);
				} else {
					parent.testingWorld.addActor(this.target, wpoint.x, wpoint.y);
				}
			} else {
				if (parent.library != null){
					parent.library.addObject(this.target);
				} else {
					wpoint = source_parent.globalToLocal(ev.stageX-offset.x, ev.stageY-offset.y);
					if (this.target instanceof Beakerb2Actor){
						source_parent.addBeaker(this.target, wpoint.x, wpoint.y);
					} else if (this.target instanceof Scaleb2Actor){
						source_parent.addScale(this.target, wpoint.x, wpoint.y);
					} else {
						source_parent.addActor(this.target, wpoint.x, wpoint.y);
					}					
				}
			}
			stage.needs_to_update = true;			
		}
	}
	
	window.ObjectTestingPanel = ObjectTestingPanel;
}(window));