(function (window)
{

	function Testingb2World (width_px, height_px, world_dx, world_dy)
	{
		this.initialize (width_px, height_px, world_dx, world_dy);
	}

	var p = Testingb2World.prototype = new createjs.Container();
	// public properties
	p.mouseEventsEnabled = true;
	p.Container_initialize = p.initialize;
	p.Container_tick = p._tick;

	p.NUM_BACK_OBJECTS = 5;	
	p.FLOOR_HEIGHT = 80;

	p.initialize = function (width_px, height_px, world_dx, world_dy)
	{
		this.Container_initialize();
		this.width_px = width_px;
		this.height_px = height_px;
		this.world_dx = world_dx;
		this.world_dy = world_dy;
		this.dragging_object = null;

		this.liquid = GLOBAL_PARAMETERS.liquids[GLOBAL_PARAMETERS.liquid_available];
		this.liquid_color = this.liquid.fill_color; 
		this.liquid_stroke_color = this.liquid.stroke_color;

		var g = this.g = new createjs.Graphics();
		this.shape = new createjs.Shape(g);
		this.addChild(this.shape);

		g.beginLinearGradientFill(["rgba(250,250,250,1.0)","rgba(230,210,220,1.0)"],[0,1.0],0,0,this.width_px,this.height_px);
		g.drawRect(0, 0, this.width_px, this.height_px);
		g.endFill();
		//draw floor
		g.beginLinearGradientFill(["rgba(120,120,120,1.0)","rgba(80,80,80,1.0)"],[0,1.0],0,this.height_px-100,this.width_px,this.height_px);
		//g.drawRect(-this.width_px/2, this.height_px/2-10, this.width_px, 10);
		g.drawRect(0, this.height_px-this.FLOOR_HEIGHT, this.width_px, this.FLOOR_HEIGHT);
		g.endFill();

		// graphics for pouring of liquid
		var g = this.pourGraphics = new createjs.Graphics();
		this.pourShape = new createjs.Shape(g);
		this.addChild(this.pourShape);
		this.pouring = false;

		this.b2world = new b2World(new b2Vec2(0, 10), true);
		var floorFixture = new b2FixtureDef;
		floorFixture.density = 1;
		floorFixture.restitution = 0.2;
		floorFixture.filter.categoryBits = 2;
		floorFixture.filter.maskBits = 3;
		floorFixture.shape = new b2PolygonShape;
		floorFixture.shape.SetAsBox(this.width_px / 2 / GLOBAL_PARAMETERS.SCALE, 10 / 2 / GLOBAL_PARAMETERS.SCALE);
		var floorBodyDef = new b2BodyDef;
		floorBodyDef.type = b2Body.b2_staticBody;
		floorBodyDef.position.x = (this.world_dx + (this.width_px) / 2 ) / GLOBAL_PARAMETERS.SCALE;
		floorBodyDef.position.y = (this.world_dy + this.height_px - ( 10 ) / 2 ) / GLOBAL_PARAMETERS.SCALE;
		var floor = this.floor = this.b2world.CreateBody(floorBodyDef);
		floor.CreateFixture(floorFixture);

		var leftWallFixture = new b2FixtureDef;
		leftWallFixture.density = 1;
		leftWallFixture.restitution = 0.2;
		leftWallFixture.filter.categoryBits = 2;
		leftWallFixture.filter.maskBits = 3;
		leftWallFixture.shape = new b2PolygonShape;
		leftWallFixture.shape.SetAsBox(4 / 2 / GLOBAL_PARAMETERS.SCALE, this.height_px / 2 / GLOBAL_PARAMETERS.SCALE);
		var leftWallBodyDef = new b2BodyDef;
		leftWallBodyDef.type = b2Body.b2_staticBody;
		leftWallBodyDef.position.x = (this.world_dx + (4 / 2) ) / GLOBAL_PARAMETERS.SCALE;
		leftWallBodyDef.position.y = (this.world_dy + (this.height_px) / 2 ) / GLOBAL_PARAMETERS.SCALE;
		var leftWall = this.b2world.CreateBody(leftWallBodyDef);
		leftWall.CreateFixture(leftWallFixture);

		var rightWallFixture = new b2FixtureDef;
		rightWallFixture.density = 1;
		rightWallFixture.restitution = 0.2;
		rightWallFixture.filter.categoryBits = 2;
		rightWallFixture.filter.maskBits = 3;
		rightWallFixture.shape = new b2PolygonShape;
		rightWallFixture.shape.SetAsBox(4 / 2 / GLOBAL_PARAMETERS.SCALE, this.height_px / 2 / GLOBAL_PARAMETERS.SCALE);
		var rightWallBodyDef = new b2BodyDef;
		rightWallBodyDef.type = b2Body.b2_staticBody;
		rightWallBodyDef.position.x = (this.world_dx + this.width_px - (4 / 2) ) / GLOBAL_PARAMETERS.SCALE;
		rightWallBodyDef.position.y = (this.world_dy + (this.height_px) / 2 ) / GLOBAL_PARAMETERS.SCALE;
		var rightWall = this.b2world.CreateBody(rightWallBodyDef);
		rightWall.CreateFixture(rightWallFixture);

		this.actors = [];
		this.beakers = [];
		this.puddles = [];
		this.scales = [];
		this.balances = [];

		// contact listener
		var contactListener = new b2ContactListener;
		contactListener.BeginContact = this.BeginContact.bind(this);
		this.b2world.SetContactListener(contactListener);

		if (GLOBAL_PARAMETERS.DEBUG){
			var debugDraw = this.debugDraw = new b2DebugDraw;
			debugDraw.SetSprite(document.getElementById("debugcanvas").getContext("2d"));
			debugDraw.SetDrawScale(GLOBAL_PARAMETERS.SCALE);
			debugDraw.SetFillAlpha(1.0);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_controllerBit);
			this.b2world.SetDebugDraw(debugDraw);
		}
	}

	/** This works for objecs where the width_px_left, height_px_above, width_px_right, width_px_below are defined
	    i.e., there is no assumption of where 0,0 is relative to the object.
	    Both objects must be on the stage, i.e. must have parents */
	p.hitTestObject = function (o)
	{
		if (typeof(o.width_px_left) != "undefined" && typeof(o.width_px_right) != "undefined" && typeof(o.height_px_above) != "undefined" && typeof(o.height_px_below) != "undefined")
		{
			if (typeof(o.parent) != "undefined" && typeof(this.parent) != "undefined")
			{
				var gp = o.parent.localToGlobal(o.x, o.y);
				var lp = this.globalToLocal(gp.x, gp.y);
				if (this.hitTest(lp.x-o.width_px_left, lp.y+o.height_px_below) && this.hitTest(lp.x+o.width_px_right, lp.y+o.height_px_below))
				{
					return true;
				} else
				{
					return false;
				}
			} else		
			{
				return false;
			}
		} else
		{
			console.log("The height and width next to the object are not defined.");
			return false;
		}

	}
	
	p.addActor = function (actor, x, y){
		eventManager.fire('add-actor-world',[actor.skin.savedObject], box2dModel);
		
		actor.setupInWorld((this.world_dx + x) / GLOBAL_PARAMETERS.SCALE, (this.world_dy + y ) / GLOBAL_PARAMETERS.SCALE, this.b2world);
		actor.world = this;
		
		this.actors.push(actor);
		// set a flag so we can look for initial contact with this object
		this.justAddedActor = actor;
		this.justRemovedActor = null;
		this.update_mass_flag = true;
		//this.updateMassOnPan();

		// figure out where to place this object based on it's relative position to other actors.
		for (var i = 0; i < this.actors.length; i++){ this.actors[i].body.SetAwake(true); } 

		this.addChild(actor);
		
		this.sortActorsDisplayDepth();
	}

	p.addBeaker = function (beaker, x, y){
		eventManager.fire('add-beaker-world',[beaker.skin.savedObject], box2dModel);
		
		this.addChild(beaker);
		beaker.setupInWorld((this.world_dx + x ) / GLOBAL_PARAMETERS.SCALE, (this.world_dy + y ) / GLOBAL_PARAMETERS.SCALE, this.b2world);
		this.sortActorsDisplayDepth();

		beaker.world = this;
		this.beakers.push(beaker);
	}

	p.addScale = function (scale, x, y){
		eventManager.fire('add-scale-world',[scale.skin.savedObject], box2dModel);
		
		this.addChild(scale);
		scale.setupInWorld((this.world_dx + x ) / GLOBAL_PARAMETERS.SCALE, (this.world_dy + y ) / GLOBAL_PARAMETERS.SCALE, this.b2world);
		this.sortActorsDisplayDepth();

		scale.world = this;
		this.scales.push(scale);
	}

	p.removeActor = function (actor)
	{
		this.justRemovedActor = actor;
		this.justAddedActor = null;
		
		eventManager.fire('remove-actor-world',[actor.skin.savedObject], box2dModel);
		this.actors.splice(this.actors.indexOf(actor), 1);
		
		if (actor.controlledByBuoyancy){
			actor.containedWithin.removeActor(actor);	
		}
		this.b2world.DestroyBody(actor.body);
		actor.body = null;
		actor.world = null;
		this.sortActorsDisplayDepth();
	}

	/** When a beaker is removed from this world take the skin objects that were on the world and put them on the beaker */
	p.removeBeaker = function (beaker){
		// set skin containers to zero because they are now nested in single beaker object
		this.beakers.splice(this.beakers.indexOf(beaker), 1);
		
		eventManager.fire('remove-beaker-world',[beaker.skin.savedObject], box2dModel);
		if (beaker.controlledByBuoyancy){
			beaker.containedWithin.removeActor(beaker);	
		}

		beaker.removeFromWorld();
	}

	p.removeScale = function (scale){
		// set skin containers to zero because they are now nested in single beaker object
		this.scales.splice(this.scales.indexOf(scale), 1);
		
		eventManager.fire('remove-scale-world',[scale.skin.savedObject], box2dModel);
		if (scale.controlledByBuoyancy){
			scale.containedWithin.removeActor(scale);	
		}
		scale.removeFromWorld();
	}

	/** Called whenever anything touches anything.  Useful for knowing when something happens in world */
	p.BeginContact = function (contact)
	{
		this.sortActorsDisplayDepth();

		if (contact.GetFixtureA().m_body == this.justAddedActorToBuoyancy)
		{	
			contact.GetFixtureB().m_body.SetAwake(true);
		} else if (contact.GetFixtureB().m_body == this.justAddedActorToBuoyancy)
		{
			contact.GetFixtureA().m_body.SetAwake(true);
		} 
	}

	/**
	*	Will sort by the highest objects on top, then right-most objects
	*/
	p.sortActorsDisplayDepth = function(){
		var actors = this.beakers.concat(this.actors);
		for (var i = actors.length-1; i >= 0; i--){
			if (actors[i].parent == this){
				var i_index = this.getChildIndex(actors[i]);
				for (var j = i+1; j < actors.length; j++){
					if (actors[j].parent == this){
						var j_index = this.getChildIndex(actors[j]);
						//console.log(i_index, j_index, this.getChildAt(i_index).x, this.getChildAt(i_index).y, this.getChildAt(j_index).x, this.getChildAt(j_index).y);
						if (this.getChildAt(j_index).y - this.getChildAt(i_index).y > 10  || (Math.abs(this.getChildAt(i_index).y - this.getChildAt(j_index).y) <= 10 && this.getChildAt(i_index).x > this.getChildAt(j_index).x)){
							// Actor i is in front of j if order in display is not the same, switch
							if (i_index < j_index){
								this.swapChildrenAt(i_index, j_index);
								i_index = j_index;
							}
						} else {
							// Actor j is in front of i if order in display is not the same, switch
							if (j_index < i_index){
								this.swapChildrenAt(i_index, j_index);
								i_index = j_index;
							}
						}
					}
				}
			}
		}
	}

	p.getNumBackgroundChildren = function (){
		return 1 + this.puddles.length;
	}

	/** Some volume of liquid is being released from the given x,y point.  Look for any beakers below this point, else make a puddle */
	p.addLiquidVolumeToWorld = function (x, y, volume, beaker){
		var beaker_underneath = null;
		for (var b = 0; b < this.beakers.length; b++){
			var testbeaker = this.beakers[b];
			var bx = x - testbeaker.x;
			var by = y -testbeaker.y;
			if (beaker != testbeaker && testbeaker.hitTestUnderPoint(bx, by)){
				if (beaker_underneath != null){
					if (testbeaker.y < beaker_underneath.y){
						beaker_underneath = testbeaker;
					}
				} else {
					beaker_underneath = testbeaker;
				}
			}
		}
		var g = this.pourGraphics;
		this.pouring = true;
		if (beaker_underneath == null){
			this.addToPuddle(x, volume, beaker);
			// draw from beaker to ground
			g.beginFill(beaker.liquid.fill_color).drawRoundRect(x - 4, y, 4, this.height_px - this.FLOOR_HEIGHT/2 - y, 2).endFill();
		} else {
			beaker_underneath.addLiquidVolume(volume, beaker);
			// draw from beaker to beaker
			g.beginFill(beaker.liquid.fill_color).drawRoundRect(x - 4, y, 4, beaker_underneath.y - beaker_underneath.width_from_depth/2 - y, 2).endFill();
		}
	}

	/** When a beaker is refilled all of its liquid needs to be removed from  puddles and other beakers. */
	p.removeLiquidAssociatedWithBeaker = function (beaker){
		// puddles
		this.removePuddlesAssociatedWithBeaker(beaker);
		// other beakers
		for (var i = 0; i < this.beakers.length; i++){
			if (this.beakers[i] != beaker){
				var volume = this.beakers[i].removeLiquidAssociatedWithBeaker(beaker);
				if (volume > 0){
					beaker.addLiquidVolume (volume);	
				} 
			}
		}
	}

	/** Create an inital puddle object and add to puddles array */
	p.createPuddle = function (x, volume, beaker){
		var puddle = {};
		var liquid = beaker.liquid;
		puddle.beakers = [beaker];
		puddle.volumes = [volume];
		puddle.volume = volume;
		puddle.x = x;
		puddle.liquid = liquid;
		// assume a depth of .1
		var width_px = Math.sqrt(volume / 10.0) * Math.cos(GLOBAL_PARAMETERS.view_sideAngle) * GLOBAL_PARAMETERS.SCALE;
		var height_px = Math.sqrt(volume / 10.0) * Math.sin(GLOBAL_PARAMETERS.view_topAngle) * GLOBAL_PARAMETERS.SCALE;
		if (height_px > this.FLOOR_HEIGHT){
			//move extra liquid from height to width
			width_px += (height_px - this.FLOOR_HEIGHT);
			height_px = this.FLOOR_HEIGHT;
		} 
		var shape = new createjs.Shape();
		shape.graphics.beginFill(liquid.fill_color, 0.4).drawEllipse(-width_px/2, -height_px/2, width_px, height_px).endFill();
		this.addChildAt(shape, 1);
		shape.x = x;
		shape.y = this.height_px - this.FLOOR_HEIGHT/2;
		puddle.width_px = width_px;
		puddle.height_px = height_px;
		puddle.shape = shape;
		this.puddles.push(puddle);
	}

	/** Find a puddle under the object if one exists, else create a new puddle */
	p.addToPuddle = function(x, volume, beaker){
		// find this reference see if the 
		var liquid = beaker.liquid;
		for (var i = 0; i < this.puddles.length; i++){
			var puddle = this.puddles[i];
			if (liquid == puddle.liquid && x >= puddle.x - puddle.width_px/2 && x <= puddle.x + puddle.width_px/2){
				// search for a reference to this beaker
				var beaker_found = false;
				for (var j = puddle.beakers.length-1; j >= 0; j--){
					if (puddle.beakers[j] == beaker){
						beaker_found = true;
						puddle.volumes[j] += volume;
						break;
					}
				}
				if (!beaker_found){
					puddle.beakers.push(beaker);
					puddle.volumes.push(volume);
				}
				puddle.volume += volume;
				var width_px = Math.sqrt(volume / 10.0) * Math.cos(GLOBAL_PARAMETERS.view_sideAngle) * GLOBAL_PARAMETERS.SCALE;
				var height_px = Math.sqrt(volume / 10.0) * Math.sin(GLOBAL_PARAMETERS.view_topAngle) * GLOBAL_PARAMETERS.SCALE;
				if (height_px + puddle.height_px > this.FLOOR_HEIGHT){
					//move extra liquid from height to width
					width_px += (height_px + puddle.height_px - this.FLOOR_HEIGHT);
					puddle.height_px = this.FLOOR_HEIGHT;
					puddle.width_px += width_px;
				} else {
					puddle.height_px += height_px;
					puddle.width_px += width_px;
				}
				width_px = puddle.width_px;
				height_px = puddle.height_px;
				// don't bother drawing if width is greater than screen
				if (width_px < 2*$("#canvas").width()){
					puddle.shape.graphics.clear();
					puddle.shape.graphics.beginFill(liquid.fill_color, 0.4).drawEllipse(-width_px/2, -height_px/2, width_px, height_px).endFill();
				}
				return;
			}
		}
		this.createPuddle(x, volume, beaker);
	} 

	/** For an object remove (or decrease) puddles associated with an object */
	p.removePuddlesAssociatedWithBeaker = function(beaker){
		for (var i = this.puddles.length-1; i >= 0; i--){
			var puddle = this.puddles[i];
			for (var j = puddle.beakers.length-1; j >= 0; j--){
				if (puddle.beakers[j] == beaker){
					// beaker contributed to this puddle
					var volume = puddle.volumes[j];
					beaker.addLiquidVolume (volume);
					puddle.volume -= volume;
					var width_px = Math.sqrt(volume / 10.0) * Math.cos(GLOBAL_PARAMETERS.view_sideAngle) * GLOBAL_PARAMETERS.SCALE;
					var height_px = Math.sqrt(volume / 10.0) * Math.sin(GLOBAL_PARAMETERS.view_topAngle) * GLOBAL_PARAMETERS.SCALE;
					if (height_px > this.FLOOR_HEIGHT){
						//move extra liquid from height to width
						width_px += (height_px - this.FLOOR_HEIGHT);
						height_px = this.FLOOR_HEIGHT;
					} 
					puddle.width_px -= width_px;
					puddle.height_px -= height_px;
					puddle.beakers.splice(j, 1);
					puddle.volumes.splice(j, 1);
				}
				if (puddle.beakers.length == 0) break;
			}
			if (puddle.beakers.length == 0){
				this.removeChild(puddle.shape);
				this.puddles.splice(i, 1);
			} else {
				puddle.shape.graphics.clear();
				puddle.shape.graphics.beginFill(this.liquid.fill_color, 0.4).drawEllipse(-puddle.width_px/2, -puddle.height_px/2, puddle.width_px, puddle.height_px).endFill();
			}	
		}
	}


	/** Tick function called on every step, if update, redraw */
	p._tick = function ()
	{
		this.Container_tick();
		for (var i = 0; i < this.beakers.length; i++){
			this.beakers[i].update();
		}

		for(i = 0; i < this.actors.length; i++){
			if (this.actors[i].body.IsAwake()){
				for (var j = 0; j < this.beakers.length; j++){
					this.beakers[j].addIfWithin(this.actors[i]);
				}
			} 
			this.actors[i].update();
		}
		// are we pouring? if not clear pouring graphics
		if (!this.pouring){
			this.pourGraphics.clear();
		}
		this.pouring = false;

		for (i = 0; i < this.scales.length; i++){
			if (this.scales[i].base.IsAwake()){
				for (var j = 0; j < this.beakers.length; j++){
					this.beakers[j].addIfWithin(this.scales[i]);
				}
			} 
			this.scales[i].update();
		}

		for (i = 0; i < this.balances.length; i++){
			this.balances[i].update();
		}

		this.b2world.Step(1/createjs.Ticker.getFPS(), 10, 10);
		if (GLOBAL_PARAMETERS.DEBUG) this.b2world.DrawDebugData();
		this.b2world.ClearForces();
	}
	
	
	window.Testingb2World = Testingb2World;
}(window));
