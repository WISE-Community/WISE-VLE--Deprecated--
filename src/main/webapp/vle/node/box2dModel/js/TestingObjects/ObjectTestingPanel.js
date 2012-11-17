(function (window)
{
	/** A space for displaying the names of materials, clickable/draggable materials
	and a grid space for putting them together */
	function ObjectTestingPanel (width_px, height_px)
	{
		this.initialize(width_px, height_px);
	}
	var p = ObjectTestingPanel.prototype = new Container();
	p.Container_initialize = ObjectTestingPanel.prototype.initialize;
	p.Container_tick = p._tick;
	p.TITLE_HEIGHT = 40;
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
		this.g = new Graphics();
		this.shape = new Shape(this.g);
		this.addChild(this.shape);

		//library
		this.library = new ObjectLibrary(this.width_px, this.max_shape_height_px, this.max_shape_width_px, this.max_shape_height_px, this.width_from_depth, this.height_from_depth);
		this.addChild(this.library);
		this.library.x = 0;
		this.library.y = 0;
		//balanceWorld
		var current_x = 0;
		var current_y = this.library.y + this.library.height_px + GLOBAL_PARAMETERS.PADDING;
		if (GLOBAL_PARAMETERS.INCLUDE_BALANCE)
		{
			this.balanceWorld = new Balanceb2World((this.max_shape_width_px-this.width_from_depth)*4, (this.max_shape_height_px-this.height_from_depth)*3, current_x, current_y, 5, 5);
			this.addChild(this.balanceWorld);
			this.balanceWorld.x = current_x;
			this.balanceWorld.y = current_y;
			current_x = this.balanceWorld.x + GLOBAL_PARAMETERS.PADDING + this.balanceWorld.width_px;
			current_y = this.library.y + this.library.height_px + GLOBAL_PARAMETERS.PADDING;
		}
		//beakerWorld
		if (GLOBAL_PARAMETERS.INCLUDE_BEAKER)
		{
			var beaker_world_width_px = (this.max_shape_width_px-this.width_from_depth)*4;
			var beaker_world_height_px = (this.max_shape_height_px-this.height_from_depth)*3;
			var beaker_width_px = this.max_shape_width_px-this.width_from_depth;
			var beaker_height_px = beaker_world_height_px*2/3;
			var beaker_depth_px = this.max_shape_width_px - this.width_from_depth;
			this.beakerWorld = new Beakerb2World(beaker_world_width_px, beaker_world_height_px, current_x , current_y, beaker_width_px, beaker_height_px, beaker_depth_px) ;
			this.addChild(this.beakerWorld);
			this.beakerWorld.x = current_x;
			this.beakerWorld.y = current_y;
		}

		this.g.beginFill("rgba(255,255,255,1.0)");
		this.g.drawRect(0, 0, this.width_px, this.height_px);
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
		var actor = new Blockb2Actor(o); 
		this.library.addObject(actor);
		actor.onPress = this.actorPressHandler.bind(this);
		actor.orig_parent = this.library;
		this.actors.push(actor);
	}	

	
	/** Removes object from its current parent, allows movement based on current*/
	p.actorPressHandler = function (evt)
	{
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
		} else if (source_parent instanceof Beakerb2World)
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
				if (newX < 0)
				{
					this.target.x = 0;
				} else if (newX > parent.width_px)
				{
					this.target.x = parent.width_px;
				} else
				{
					this.target.x = newX;
				}
				if (newY < 0)
				{
					this.target.y = 0;
				} else if (newY > parent.height_py)
				{
					this.target.y = parent.height_py;
				} else
				{
					this.target.y = newY;
				} 

				//parent.beakerWorld.placeObject(this.target, ev.stageX-offset.x, ev.stageY-offset.y);
			} else if (parent instanceof Beakerb2World)
			{
				parent.placeObject(this.target, ev.stageX-offset.x, ev.stageY-offset.y);
			}
			stage.needs_to_update = true;
		}
		evt.onMouseUp = function (ev)
		{
			var parent = this.target.parent;
			//
			if (parent.balanceWorld != null && parent.balanceWorld.hitTestObject(this.target))
			{
				var wpoint = parent.balanceWorld.globalToLocal(ev.stageX-offset.x, ev.stageY-offset.y);
				parent.balanceWorld.addActor(this.target, wpoint.x, wpoint.y);
			} else if (parent.beakerWorld != null && parent.beakerWorld.hitTestObject(this.target))
			{
				var wpoint = parent.beakerWorld.globalToLocal(ev.stageX-offset.x, ev.stageY-offset.y);
				parent.beakerWorld.addActor(this.target, wpoint.x, wpoint.y);
			}else
			{
				parent.library.addObject(this.target);
			}
			stage.needs_to_update = true;			
		}
	}

	
	window.ObjectTestingPanel = ObjectTestingPanel;
}(window));