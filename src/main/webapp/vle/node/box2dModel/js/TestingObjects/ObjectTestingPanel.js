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


		//library
		this.library = new ObjectLibrary(this.width_px-2*this.BORDER_WIDTH, this.max_shape_height_px, this.max_shape_width_px, this.max_shape_height_px, this.width_from_depth, this.height_from_depth);
		this.addChild(this.library);
		this.library.x = this.BORDER_WIDTH;
		this.library.y = this.BORDER_WIDTH;
		this.dragging_object = null;
		//balanceWorld
		var current_x = this.BORDER_WIDTH;
		var current_y = this.library.y + this.library.height_px + GLOBAL_PARAMETERS.PADDING;
		//this.height_px = current_y;
		var B2WORLD_HEIGHT = this.height_px-this.BORDER_WIDTH-current_y;
		if (GLOBAL_PARAMETERS.INCLUDE_SCALE)
		{
			this.scaleWorld = new Scaleb2World((this.max_shape_width_px-this.width_from_depth)*4, B2WORLD_HEIGHT, current_x, current_y, 5, 5);
			this.addChild(this.scaleWorld);
			this.scaleWorld.x = current_x;
			this.scaleWorld.y = current_y;
			current_x = this.scaleWorld.x + GLOBAL_PARAMETERS.PADDING + this.scaleWorld.width_px;
			//this.height_px = Math.max(this.height_px, current_y + this.scaleWorld.height_px);
		} else if (GLOBAL_PARAMETERS.INCLUDE_BALANCE)
		{
			this.balanceWorld = new Balanceb2World((this.max_shape_width_px-this.width_from_depth)*4, B2WORLD_HEIGHT, current_x, current_y, 5, 5);
			this.addChild(this.balanceWorld);
			this.balanceWorld.x = current_x;
			this.balanceWorld.y = current_y;
			current_x = this.balanceWorld.x + GLOBAL_PARAMETERS.PADDING + this.balanceWorld.width_px;
			//this.height_px = Math.max(this.height_px, current_y + this.balanceWorld.height_px)
		}
		//beakerWorld
		if (GLOBAL_PARAMETERS.INCLUDE_BEAKER)
		{
			var beaker_world_width_px = this.width_px - this.BORDER_WIDTH - current_x;
			var beaker_width_px = this.max_shape_width_px-this.width_from_depth;
			var beaker_height_px = beaker_width_px*2;
			var beaker_depth_px = this.max_shape_width_px - this.width_from_depth;
			this.beakerWorld = new Beakerb2World(beaker_world_width_px, B2WORLD_HEIGHT, current_x , current_y, beaker_width_px, beaker_height_px, beaker_depth_px) ;
			this.addChild(this.beakerWorld);
			this.beakerWorld.x = current_x;
			this.beakerWorld.y = current_y;
			//this.height_px = Math.max(this.height_px, current_y + this.beakerWorld.height_px)
		} else if (GLOBAL_PARAMETERS.INCLUDE_EMPTY)
		{
			var empty_world_width_px = this.width_px - this.BORDER_WIDTH - current_x;
			this.emptyWorld = new Emptyb2World(empty_world_width_px, B2WORLD_HEIGHT, current_x , current_y) ;
			this.addChild(this.emptyWorld);
			this.emptyWorld.x = current_x;
			this.emptyWorld.y = current_y;
		}

		this.g.beginFill("rgba(255,255,255,1.0)");
		this.g.drawRect(0, 0, this.width_px, this.height_px);
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
		this.g.lineTo(this.width_px,0);
		this.g.lineTo(this.width_px-this.BORDER_WIDTH,this.BORDER_WIDTH);
		this.g.lineTo(this.BORDER_WIDTH, this.BORDER_WIDTH);
		this.g.lineTo(0,0);
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
		 
		 
		if (this.library.addObject(actor)){
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
	p.createObjectInWorld = function (o, world, x, y, rotation, type)
	{
		
		var b2world;
		if (world == "empty" && typeof this.emptyWorld != "undefined" && this.emptyWorld != null){
			b2world = this.emptyWorld;
		} else if (world == "balance" && typeof this.balanceWorld != "undefined" && this.balanceWorld != null){
			b2world = this.balanceWorld;
		} else if (world == "scale" && typeof this.scaleWorld != "undefined" && this.scaleWorld != null){
			b2world = this.scaleWorld;
		} else if (world == "beaker" && typeof this.beakerWorld != "undefined" && this.beakerWorld != null){
			b2world = this.beakerWorld;
		} else {
			return false;
		}

		var actor;
		if (o.is_blockComp){
			actor = new BlockCompb2Actor(o); 
		} else if (o.is_cylinder){
			actor = new Cylinderb2Actor(o); 
		} else if (o.is_rectPrism){
			actor = new RectPrismb2Actor(o); 
		}
		actor.can_switch_worlds = false;

		var wpoint = b2world.globalToLocal(b2world.x + x * GLOBAL_PARAMETERS.SCALE + actor.skin.width_px_left, b2world.y + b2world.height_px - y * GLOBAL_PARAMETERS.SCALE - actor.skin.height_px_below);
		//b2world.addActor(actor, wpoint.x, wpoint.y);
		b2world.addActor(actor, x * GLOBAL_PARAMETERS.SCALE, b2world.height_px - y * GLOBAL_PARAMETERS.SCALE - actor.skin.height_px_below);
		actor.orig_parent = b2world;
		if (type == "dynamic"){
			actor.onPress = this.actorPressHandler.bind(this);
		}

		return true;
		
	}	
	
	/** Removes object from its current parent, allows movement based on current*/
	p.actorPressHandler = function (evt)
	{
		if (this.dragging_object != null) return;
		this.dragging_object = evt.target;
		var source_parent = evt.target.parent;
		var gp = source_parent.localToGlobal(evt.target.x, evt.target.y);
		var offset = evt.target.globalToLocal(evt.stageX, evt.stageY);
		// remove object from wherever it is and place it on this object
		if (source_parent instanceof ObjectLibrary)
		{
			source_parent.removeObject(evt.target);
		} else if (source_parent instanceof Balanceb2World)
		{
			source_parent.removeActor(evt.target);
		} else if (source_parent instanceof Scaleb2World)
		{
			source_parent.removeActor(evt.target);
		} else if (source_parent instanceof Beakerb2World)
		{
			source_parent.removeActor(evt.target);
		} else if (source_parent instanceof Emptyb2World)
		{
			source_parent.removeActor(evt.target);
		}
		var lp = this.globalToLocal(gp.x, gp.y);
		this.addChild(evt.target);
		evt.target.x = lp.x;
		evt.target.y = lp.y;
		evt.target.rotation = 0;
		evt.target.update();
		evt.onMouseMove = function (ev)
		{
			var parent = this.target.parent;
			var lpoint = parent.globalToLocal(ev.stageX-offset.x, ev.stageY-offset.y);
			var newX = lpoint.x;
			var newY = lpoint.y;
			
			
			// place within bounds of this object
			if (parent instanceof ObjectTestingPanel)
			{
				if (this.target.can_switch_worlds){
					if (newX < 0){this.target.x = 0;
					} else if (newX > parent.width_px){	this.target.x = parent.width_px;
					} else{	this.target.x = newX;
					}

					if (newY < 0){this.target.y = 0;
					} else if (newY > parent.height_py){this.target.y = parent.height_py;
					} else{this.target.y = newY;
					} 
				} else {
					// keep the target within the space of its source_parent object
					if (newX > source_parent.x + this.target.width_px_left && newX < source_parent.x + source_parent.width_px - this.target.width_px_right) this.target.x = newX;
					if (newY > source_parent.y + this.target.height_px_above && newY < source_parent.y + source_parent.height_px - this.target.height_px_below) this.target.y = newY;
				}
			} else if (parent instanceof Beakerb2World)
			{
				parent.placeObject(this.target, ev.stageX-offset.x, ev.stageY-offset.y);
			}
			stage.needs_to_update = true;
		}
		evt.onMouseUp = function (ev)
		{
			tester.dragging_object = null;
			var parent = this.target.parent;
			var wpoint;
			//
			if (parent.balanceWorld != null && parent.balanceWorld.hitTestObject(this.target))
			{
				wpoint = parent.balanceWorld.globalToLocal(ev.stageX-offset.x, ev.stageY-offset.y);
				parent.balanceWorld.addActor(this.target, wpoint.x, wpoint.y);
			} else if (parent.scaleWorld != null && parent.scaleWorld.hitTestObject(this.target))
			{
				wpoint = parent.scaleWorld.globalToLocal(ev.stageX-offset.x, ev.stageY-offset.y);
				parent.scaleWorld.addActor(this.target, wpoint.x, wpoint.y);
			} else if (parent.beakerWorld != null && parent.beakerWorld.hitTestObject(this.target))
			{
				wpoint = parent.beakerWorld.globalToLocal(ev.stageX-offset.x, ev.stageY-offset.y);
				parent.beakerWorld.addActor(this.target, wpoint.x, wpoint.y);
			} else if (parent.emptyWorld != null && parent.emptyWorld.hitTestObject(this.target))
			{
				wpoint = parent.emptyWorld.globalToLocal(ev.stageX-offset.x, ev.stageY-offset.y);
				parent.emptyWorld.addActor(this.target, wpoint.x, wpoint.y);
			}else
			{
				parent.library.addObject(this.target);
			}
			stage.needs_to_update = true;			
		}
	}

	
	window.ObjectTestingPanel = ObjectTestingPanel;
}(window));