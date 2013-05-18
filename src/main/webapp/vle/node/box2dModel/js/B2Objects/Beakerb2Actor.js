(function (window)
{
	/** This actor in the world creates its own skin based upon dimensions */
	function Beakerb2Actor (width_units, height_units, depth_units, init_liquid_volume_perc, spilloff_volume_perc)
	{
		this.initialize (width_units, height_units, depth_units, typeof init_liquid_volume_perc === "undefined"? 0: init_liquid_volume_perc, typeof spilloff_volume_perc === "undefined"? 0: spilloff_volume_perc);
	}

	var p = Beakerb2Actor.prototype = new createjs.Container();
	// public properties
	p.mouseEventsEnabled = true;
	p.Container_initialize = p.initialize;
	p.Container_tick = p._tick;

	//parameters
	p.BEAKER_WALL_THICKNESS = 2;
	p.NUM_RULER_TICKS = 10;
	p.DRAINING_PER_SECOND = 5;
	p.ALLOW_FILL_INTERIOR = true;
	
	p.initialize = function (width_units, height_units, depth_units, init_liquid_volume_perc, spilloff_volume_perc)
	{
		this.Container_initialize();
		this.width_units = width_units;
		this.height_units = height_units;
		this.depth_units = depth_units;
		this.savedObject = {};

		this.init_liquid_volume_perc = init_liquid_volume_perc;
		this.beaker_volume = this.width_units * this.height_units * this.depth_units;
		this.init_liquid_volume = init_liquid_volume_perc * this.beaker_volume;
		this.liquid_volume = this.init_liquid_volume;
		this.spilloff_volume_perc = spilloff_volume_perc;
		this.spilloff_height = height_units * spilloff_volume_perc;

		// save
		this.savedObject.id = "bk" + GLOBAL_PARAMETERS.total_beakers_made++;
		this.savedObject.width_units = width_units;
		this.savedObject.height_units = height_units;
		this.savedObject.depth_units = depth_units;
		this.savedObject.init_liquid_volume_perc = init_liquid_volume_perc;
		this.savedObject.spilloff_volume_perc = spilloff_volume_perc;


		this.skin = new BeakerShape(this, width_units*GLOBAL_PARAMETERS.SCALE, height_units*GLOBAL_PARAMETERS.SCALE, depth_units*GLOBAL_PARAMETERS.SCALE, init_liquid_volume_perc, spilloff_volume_perc, this.savedObject);
		this.addChild(this.skin.backContainer);
		this.addChild(this.skin.frontContainer);
		// for use when dragging
		this.height_px_below = this.skin.height_px_below;
		this.height_px_above = this.skin.height_px_above;
		this.width_px_left = this.skin.width_px_left;
		this.width_px_right = this.skin.width_px_right;
		this.height_from_depth = this.skin.height_from_depth;
		this.width_from_depth = this.skin.width_from_depth;

		this.justAddedActorToBuoyancy = null;
		this.actorsInBeakerCount = 0;
		this.onPress = this.skin.frontContainer.onPress;
		this.onMouseMove = this.skin.frontContainer.onMouseMove;
		this.onMouseUp = this.skin.frontContainer.onMouseUp;

		this.liquid = GLOBAL_PARAMETERS.liquids[GLOBAL_PARAMETERS.liquid_available];
		
		var bodyDef = this.bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.angularDamping = 0.5;
		bodyDef.position.x = 0;
		bodyDef.position.y = 0;
		bodyDef.userData = {"actor":this}
		
		this.viewing_rotation = 0;
		this.refillElement = null;
		this.releaseElement = null;
		

		this.constructFixtures();
	}

	p.hitTestPoint = function (x, y){
		if (x >= -this.width_px_left && x <= this.width_px_right && y >= -this.height_px_above && y <= this.height_px_below){
			return true;
		} else {
			return false;
		}
	}

	p.hitTestUnderPoint = function (x,y){
		if (x >= -this.width_px_left && x <= this.width_px_right && y <= this.height_px_below){
			return true;
		} else {
			return false;
		}
	}

	p.constructFixtures = function (){
		var i, j;
		var skin = this.skin;
		// beaker
		var beakerFloorFixture = this.beakerFloorFixtureDef = new b2FixtureDef;
		beakerFloorFixture.density = 1.0;
		beakerFloorFixture.filter.categoryBits = 2;
		beakerFloorFixture.filter.maskBits = 3;
		beakerFloorFixture.friction = 0.5;
		beakerFloorFixture.shape = new b2PolygonShape;
		beakerFloorFixture.shape.SetAsOrientedBox(this.width_units / 2 + this.BEAKER_WALL_THICKNESS / GLOBAL_PARAMETERS.SCALE, this.BEAKER_WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE, new b2Vec2(0, -this.BEAKER_WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE));
		
		var beakerLeftWallFixture = this.beakerLeftWallFixtureDef = new b2FixtureDef;
		beakerLeftWallFixture.density = 1.0;
		beakerLeftWallFixture.filter.categoryBits = 2;
		beakerLeftWallFixture.filter.maskBits = 3;
		beakerLeftWallFixture.friction = 0.0;
		beakerLeftWallFixture.shape = new b2PolygonShape;
		beakerLeftWallFixture.shape.SetAsOrientedBox(this.BEAKER_WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE, this.height_units / 2, new b2Vec2(-this.width_units / 2 -this.BEAKER_WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE , -this.height_units/2-this.BEAKER_WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE) );
		
		var beakerRightWallFixture = this.beakerRightWallFixtureDef = new b2FixtureDef;
		beakerRightWallFixture.density = 1.0;
		beakerRightWallFixture.filter.categoryBits = 2;
		beakerRightWallFixture.filter.maskBits = 3;
		beakerRightWallFixture.friction = 0.0;
		beakerRightWallFixture.shape = new b2PolygonShape;
		beakerRightWallFixture.shape.SetAsOrientedBox(this.BEAKER_WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE, this.height_units / 2, new b2Vec2(this.width_units / 2 +this.BEAKER_WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE , -this.height_units/2-this.BEAKER_WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE) );
		//this.drawSpout();
		
	}

	p.setupInWorld = function (position_x, position_y, b2world){
		var bodyDef = this.bodyDef;
		bodyDef.position.x = position_x;
		bodyDef.position.y = position_y;
		this.b2world = b2world;
		this.contents_volume = 0;
		this.controlledByBuoyancy = false;

		// first destroy any current body on actor
		if (typeof this.body !== "undefined" && this.body != null) b2world.DestroyBody(this.body);
		
		var body = this.body = b2world.CreateBody(bodyDef);

		this.beakerFloorFixture = body.CreateFixture(this.beakerFloorFixtureDef);
		this.beakerLeftWallFixture = body.CreateFixture(this.beakerLeftWallFixtureDef);
		this.beakerRightWallFixture = body.CreateFixture(this.beakerRightWallFixtureDef);
		
		// put aabb, i.e. upper and lower limit onto the body and area
		//body.local_width_right = mainbeaker.width_px_right / GLOBAL_PARAMETERS.SCALE;
		//body.local_height_below = mainbeaker.height_px_below / GLOBAL_PARAMETERS.SCALE;
		
		body.SetFixedRotation(true);
		body.ResetMassData();
		this.x = (this.body.GetPosition().x) * GLOBAL_PARAMETERS.SCALE - this.parent.x;
		this.y = (this.body.GetPosition().y) * GLOBAL_PARAMETERS.SCALE - this.parent.y;
		// buoyancy controller
		
		var controller = this.controller = this.b2world.AddController(new Myb2BuoyancyController());
		controller.density = this.liquid.density;
		var normal = new b2Vec2(); normal.Set(0, -1);
		controller.normal = normal;
		controller.SetY(position_y)
		controller.SetInitialOffset(-this.liquid_volume / this.beaker_volume * this.height_units);
		controller.surfaceArea = this.width_units* this.depth_units;
		// include mass of water
		var massData = new b2MassData();
		body.GetMassData(massData);
		massData.mass += this.liquid.density * this.liquid_volume;
		body.SetMassData(massData);
		
		// contact listener
		//var contactListener = new b2ContactListener;
		//contactListener.BeginContact = this.BeginContact.bind(this);
		//this.b2world.SetContactListener(contactListener);
		this.skin.redraw(-this.controller.offset, true);

		
		this.draining = false;

		this.actors = [];
		this.puddles = [];
		
		// draw spout first time
		if (this.refillElement != null) $("#refill-button-" + this.id).show();
		if (this.releaseElement != null){ $("#release-button-" + this.id).show();}
		else { this.drawReleaseButton();}

		/*
		g = this.g = new createjs.Graphics();
		this.shape = new createjs.Shape(g);	
		g.beginFill("rgba(250,0,0,1.0)");
		g.drawCircle(0, 5, 5);
		g.endFill();
		this.addChild(this.shape);
		*/
	}

	/** Remove the body of this beaker as well as the buoyancy controller */
	p.removeFromWorld = function (){
		for (var i = this.actors.length-1; i >= 0; i--){
			var actor = this.actors.splice(i, 1)[0];
			var body = actor.body;
			var bodyDef = actor.bodyDef;
			body.percentSubmerged2d = [];
			for (j = 0; j < actor.skin.array2d.length; j++) {
				body.percentSubmerged2d[j] = [];
				for (k = 0; k < actor.skin.array2d[0].length; k++){
					body.percentSubmerged2d[j][k] = 0;
				}
			}
			body.fullySubmerged = false;
			body.fullyEmerged = true;
			body.percentSubmerged2d = bodyDef.percentSubmerged2d;
			body.percentSubmergedChangedFlag = false;
			body.soaked = false;
			body.SetAwake(true);
			actor.update_flag = true;
			actor.containedWithin = null;
			actor.controlledByBuoyancy = false;
			this.controller.RemoveBody(actor.body);
			var lp = this.localToLocal(actor.x, actor.y, this.parent);
			this.parent.addChild(actor);
			actor.x = lp.x;
			actor.y = lp.y;
		}
		
		this.contents_volume = 0;

		this.b2world.DestroyBody(this.body);
		this.b2world.DestroyController(this.controller);
		this.controller.SetInitialOffset(NaN);
		this.body = null;
		this.controller = null;
		this.world = null;
		this.drawRefillButton();
		this.skin.redraw(this.liquid_volume / this.beaker_volume * this.height_units * GLOBAL_PARAMETERS.SCALE, false);
	}

	/** Check to see whether actor is within the domain of this beaker */
	p.addIfWithin= function (actor)
	{
		//let's not be redundant;
		if (typeof(actor.controlledByBuoyancy) == "undefined" || !actor.controlledByBuoyancy )
		{

			// add only if within confines of beaker
			//console.log(actor.y + actor.height_px_below, this.y + this.controller.offset * GLOBAL_PARAMETERS.SCALE, actor.x - actor.width_px_left, this.x - this.width_px_left,actor.x + actor.width_px_right , this.x + this.width_px_right);
			if (actor.y + actor.height_px_below >= this.y + this.controller.offset * GLOBAL_PARAMETERS.SCALE && actor.x - actor.width_px_left/2 >= this.x - this.width_px_left && actor.x + actor.width_px_right/2 <= this.x + this.width_px_right){
				// just test the first fixture - I mean its either in or out right?	
				//var f;
				//if (actor instanceof Scaleb2Actor){
				//	f = actor.base.GetFixtureList();
				//} else {
				//	f = actor.body.GetFixtureList();
				//}				
				//var p1 = new b2Vec2(this.beakerLeftWallFixture.GetAABB().lowerBound.x, (f.GetAABB().lowerBound.y + f.GetAABB().upperBound.y)/2);
				//var p2 = new b2Vec2(this.beakerRightWallFixture.GetAABB().upperBound.x, (f.GetAABB().lowerBound.y + f.GetAABB().upperBound.y)/2);
				//var p1 = new b2Vec2(this.body.GetPosition().x-this.width_units/2, this.body.GetPosition().y+this.controller.offset)
				//var p2 = new b2Vec2(this.body.GetPosition().x+this.width_units/2, this.body.GetPosition().y+this.controller.offset)
				//console.log(p1.x, p1.y, p2.x, p2.y);
				//var ray_in = new Box2D.Collision.b2RayCastInput(p1, p2, 1);
				//var ray_out = new Box2D.Collision.b2RayCastOutput();
				//f.RayCast(ray_out, ray_in);
				//if (ray_out.fraction >= 0 && ray_out.fraction <= 1)
			//	{
					eventManager.fire('add-beaker',[actor.skin.savedObject], box2dModel);
					if (actor instanceof Scaleb2Actor){
						this.contents_volume += actor.base.volume;
						this.controller.MyAddBody(actor.base);
						this.contents_volume += actor.pan.volume;
						this.controller.MyAddBody(actor.pan);	
					} else {
						this.contents_volume += actor.body.volume;
						this.controller.MyAddBody(actor.body);	
					}

					// set a reference so we can look for initial contact with this object
					this.justAddedActorToBuoyancy = actor;
					actor.controlledByBuoyancy = true;
					actor.containedWithin = this;
					this.addChildAt(actor, 1 + this.actors.length);
					this.actors.push(actor);
					actor.x = actor.x - this.x;
					actor.y = actor.y - this.y;
					this.drawReleaseButton();
			//	} else
			//	{
			//		actor.controlledByBuoyancy = false;
			//	}
			} else {
				actor.controlledByBuoyancy = false;
			}
		}
	}

	/** Remove a single actor from this beaker */
	p.removeActor = function (actor){
		if (actor instanceof Scaleb2Actor){
			//this.controller.RemoveBody(actor.base);
			this.contents_volume -= actor.base.volume;
			//this.controller.RemoveBody(actor.pan);
			this.contents_volume -= actor.pan.volume;
		} else {
			this.controller.RemoveBody(actor.body);
			this.contents_volume -= actor.body.volume;
		}
		
		actor.controlledByBuoyancy = false;	
		this.actors.splice(this.actors.indexOf(actor),1);
		actor.containedWithin = null;	
		var lp = this.localToLocal(actor.x, actor.y, this.parent);
		this.parent.addChild(actor);
		actor.x = lp.x;
		actor.y = lp.y;
		this.drawRefillButton();
	}

	/**
	*
	*/
	p.drawRefillButton = function (){
		if (this.refillElement == null && this.liquid_volume + this.contents_volume < this.init_liquid_volume){
			var refillButtonName = "refill-button-" + this.id;
			$('#beaker-button-holder').append('<input type="submit" id="'+refillButtonName+'" value="Refill" style="font-size:14px; position:absolute"/>');
			var htmlElement = $('#' + refillButtonName).button().bind('click', {parent: this}, this.refillBeaker);
			this.refillElement = new createjs.DOMElement(htmlElement[0]);
			this.addChild(this.refillElement);
			
			this.refillElement.x = -20;
			this.refillElement.y = -(this.height_units + this.depth_units * Math.sin(GLOBAL_PARAMETERS.view_topAngle) ) * GLOBAL_PARAMETERS.SCALE;
		}
	}
		/* Refills beaker to inital liquid level.  Removes the button */
		p.refillBeaker = function (evt){
			var beaker = evt.data.parent;
			if (!beaker.draining && (beaker.contents_volume + beaker.liquid_volume) < beaker.init_liquid_volume) {
				eventManager.fire("press-refill-beaker", [beaker.init_liquid_volume - (beaker.contents_volume + beaker.liquid_volume)], box2dModel);
				// wake up any actors in this
				for (var i = 0; i < beaker.actors.length; i++){
					beaker.actors[i].body.SetAwake(true);
				}
				// find puddles with liquid from this beaker, and replace
				beaker.parent.removeLiquidAssociatedWithBeaker(beaker);
				// remove refill button
				beaker.removeChild(beaker.refillElement);
				$("#refill-button-" + beaker.id).remove();
				beaker.refillElement = null;
				beaker.drawReleaseButton();
			}
		}

	/** If there is a spout we can release if volume is over spout line */
	p.drawReleaseButton = function (){
		if (this.releaseElement == null && this.spilloff_volume_perc > 0 && this.spilloff_volume_perc < 1 && -this.controller.offset > this.spilloff_height){
			var releaseButtonName = "release-button-" + this.id;
			$('#beaker-button-holder').append('<input type="submit" id="'+releaseButtonName+'" value="Release" style="font-size:14px; position:absolute"/>');
			var htmlElement = $('#' + releaseButtonName).button().bind('click', {parent: this}, this.pressRelease);
			this.releaseElement = new createjs.DOMElement(htmlElement[0]);
			this.addChild(this.releaseElement);			
			this.releaseElement.x = 20 + this.width_units/2 * GLOBAL_PARAMETERS.SCALE;
			this.releaseElement.y = -70 - this.spilloff_height * GLOBAL_PARAMETERS.SCALE;
		}
	}
		p.pressRelease = function (evt){
			var beaker = evt.data.parent;
			if (!beaker.draining){
				// wake up any actors in this
				for (var i = 0; i < beaker.actors.length; i++){
					beaker.actors[i].body.SetAwake(true);
				}
				beaker.draining = true;
				$('#release-button-' + beaker.id).attr('value', 'Stop');
			} else {
				beaker.draining = false;
				$('#release-button-' + beaker.id).attr('value', 'Release');
			}
		}

	/** For pouring or replacing liquid in this beaker.
		If poured from another beaker the reference is saved

	*/
	p.addLiquidVolume = function(volume, beaker){
		// wake up any actors in this
		for (var i = 0; i < this.actors.length; i++){
			this.actors[i].body.SetAwake(true);
		}
		if (typeof beaker !== "undefined"){
			if (beaker.liquid.display_name == this.liquid.display_name){
				var beaker_found = false;
				for (var i = 0; i < this.puddles.length; i++){
					if (this.puddles[i].beaker == beaker){
						beaker_found = true;
						this.puddles[i].volume += volume;
						break;
					}
				}
				if (!beaker_found){
					var puddle = {};
					puddle.beaker = beaker;
					puddle.volume = volume;
					this.puddles.push(puddle);
				}
			} else {
				return false;
			}
		}
		this.liquid_volume += volume;
		this.controller.ChangeOffset (-volume/(this.width_units * this.depth_units));
		return true;
	}	

	/** Remove another beaker's liquid */
	p.removeLiquidAssociatedWithBeaker = function (beaker){
		for (var i = this.puddles.length-1; i >= 0; i--){
			if (this.puddles[i].beaker == beaker){
				// wake up any actors in this
				for (var j = 0; j < this.actors.length; j++){
					this.actors[j].body.SetAwake(true);
				}
				var volume = this.puddles[i].volume;
				this.liquid_volume -= volume;
				this.controller.ChangeOffset (volume/(this.width_units * this.depth_units));
				this.puddles.splice(i, 1);
				this.skin.redraw(-this.controller.offset * GLOBAL_PARAMETERS.SCALE, false);
				return volume;
			}
		}
		return 0;
	}

	/** Update skin to reflect position of b2 body on screen */
	p.update = function ()
	{
		prevx = this.x;
		prevy = this.y;
		
		// when we have an active body;
		if (this.body != null){
			this.x = (this.body.GetPosition().x) * GLOBAL_PARAMETERS.SCALE - this.parent.x;
			this.y = (this.body.GetPosition().y) * GLOBAL_PARAMETERS.SCALE - this.parent.y;
			//overflow
			if (-this.controller.offset > this.height_units){
				var volume = (-this.controller.offset - this.height_units) * this.width_units * this.depth_units;
				this.liquid_volume -= volume;
				this.controller.ChangeOffset (-(this.height_units + this.controller.offset));
				this.parent.addLiquidVolumeToWorld(this.x + this.width_px_right, this.y - this.height_px_above, volume, this);
				this.drawRefillButton();
			}
			//draining
			if (this.draining){
				var spilloff = this.DRAINING_PER_SECOND/createjs.Ticker.getFPS();
				var spilloff_dheight = spilloff / (this.width_units * this.depth_units);
				if (-this.controller.offset + spilloff_dheight <= this.spilloff_height){
					spilloff_dheight = -this.controller.offset - this.spilloff_height;
					spilloff = spilloff_dheight * this.width_units * this.depth_units;
					this.draining = false;
					// remove release button
					this.removeChild(this.releaseElement);
					$("#release-button-" + this.id).remove();
					this.releaseElement = null;
				}
				this.liquid_volume -= spilloff;
				this.controller.ChangeOffset(spilloff_dheight);
				this.parent.addLiquidVolumeToWorld(this.x+this.skin.spout_point.x, this.y+this.skin.spout_point.y, spilloff, this);
				this.drawRefillButton();
			}

			if (prevx != this.x || prevy != this.y){
				if (this.refillElement != null){
					this.refillElement.x = -20;
					this.refillElement.y = -(this.height_units + this.depth_units * Math.sin(GLOBAL_PARAMETERS.view_topAngle) ) * GLOBAL_PARAMETERS.SCALE;
				}
				this.controller.SetY(this.body.GetPosition().y);
				this.skin.redraw(-this.controller.offset * GLOBAL_PARAMETERS.SCALE, true);	
			} else {
				this.skin.redraw(-this.controller.offset * GLOBAL_PARAMETERS.SCALE, false);
			}	
		} else {
			if (this.refillElement != null) $("#refill-button-" + this.id).hide();
			if (this.releaseElement != null) $("#release-button-" + this.id).hide();
		}
	}

	/** Tick function called on every step, if update, redraw */
	p._tick = function ()
	{
		this.Container_tick();
	}
	
	window.Beakerb2Actor = Beakerb2Actor;
}(window));
