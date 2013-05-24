(function (window)
{
	/** This actor in the world creates its own skin based upon dimensions */


	function Scaleb2Actor (pan_width_units, pan_height_units)
	{
		this.initialize (pan_width_units, pan_height_units);
	}

	var p = Scaleb2Actor.prototype = new createjs.Container();
	// public properties
	p.mouseEventsEnabled = true;
	p.Container_initialize = p.initialize;
	p.Container_tick = p._tick;

	p.initialize = function (pan_width_units, pan_height_units)
	{
		this.Container_initialize();
		this.pan_width_units = pan_width_units;
		this.pan_height_units = pan_height_units;
		this.pan_dy_units = pan_width_units / 2;
		this.base_width_units = pan_width_units * 3/4;
		this.base_width_top_units = pan_width_units * 1/2;
		this.base_height_units = this.base_width_units / 2;
		this.savedObject = {};
		this.savedObject.id = "sc"+GLOBAL_PARAMETERS.total_scales_made++;
		
		this.savedObject.pan_width_units = pan_width_units;
		
		this.skin = new ScaleShape(this.pan_width_units * GLOBAL_PARAMETERS.SCALE, this.pan_height_units * GLOBAL_PARAMETERS.SCALE, this.pan_dy_units * GLOBAL_PARAMETERS.SCALE, this.base_width_units * GLOBAL_PARAMETERS.SCALE, this.base_width_top_units * GLOBAL_PARAMETERS.SCALE, this.base_height_units * GLOBAL_PARAMETERS.SCALE, this.savedObject);
		this.addChild(this.skin);
		this.height_px_below = this.skin.height_px_below;
		this.height_px_above = this.skin.height_px_above;
		this.width_px_left = this.skin.width_px_left;
		this.width_px_right = this.skin.width_px_right;
		this.height_from_depth = this.skin.height_from_depth;
		this.width_from_depth = this.skin.width_from_depth;
		this.height_units_below = this.skin.height_px_below / GLOBAL_PARAMETERS.SCALE;
		this.height_units_above = this.skin.height_px_above / GLOBAL_PARAMETERS.SCALE;
		this.width_units_left = this.skin.width_px_left / GLOBAL_PARAMETERS.SCALE;
		this.width_units_right = this.skin.width_px_right / GLOBAL_PARAMETERS.SCALE;
		

		var bodyDef = this.bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.angularDamping = 0.5;
		bodyDef.position.x = 0;
		bodyDef.position.y = 0;
		bodyDef.userData = {"actor":this}
		
		this.viewing_rotation = 0;
		
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
		var vecs, vec;

		var baseFixtureDef = this.baseFixtureDef = new b2FixtureDef;
		baseFixtureDef.density = 100;
		baseFixtureDef.restitution = 0.2;
		baseFixtureDef.friction = 1.0;
		baseFixtureDef.filter.categoryBits = 2;
		baseFixtureDef.filter.maskBits = 7;
		vecs = [];
		vec = new b2Vec2(); vec.Set(this.base_width_top_units/2 , 0); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(this.base_width_units/2 , this.base_height_units); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set(-this.base_width_units/2 , this.base_height_units); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set(-this.base_width_top_units/2 , 0); vecs[3] = vec;
		baseFixtureDef.shape = new b2PolygonShape;
		baseFixtureDef.shape.SetAsArray(vecs, vecs.length);
		var baseBodyDef = this.baseBodyDef = new b2BodyDef;
		baseBodyDef.type = b2Body.b2_dynamicBody;
		
		var panFixtureDef = this.panFixtureDef = new b2FixtureDef;
		panFixtureDef.density = 100;
		panFixtureDef.restitution = 0.0;
		panFixtureDef.linearDamping = 1.0;
		panFixtureDef.friction = 5.0;
		panFixtureDef.filter.categoryBits = 2;
		panFixtureDef.filter.maskBits = 7;
		vecs = [];
		vec = new b2Vec2(); vec.Set(-this.pan_width_units / 2 , 0); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(this.pan_width_units / 2 , 0); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set(this.pan_width_units / 2 , this.pan_height_units); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set(-this.pan_width_units / 2 , this.pan_height_units); vecs[3] = vec;
		panFixtureDef.shape = new b2PolygonShape;
		panFixtureDef.shape.SetAsArray(vecs, vecs.length);
		var panBodyDef = this.panBodyDef = new b2BodyDef;
		panBodyDef.type = b2Body.b2_dynamicBody;

		var panPrismJointDef = this.panPrismJointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
		var panDistJointDef = this.panDistJointDef = new Box2D.Dynamics.Joints.b2DistanceJointDef();
		// contact listener
		//var contactListener = new b2ContactListener;
		//contactListener.BeginContact = this.BeginContact.bind(this);
		//this.b2world.SetContactListener(contactListener);
		

		this.actors = [];
		
	}

	p.setupInWorld = function (position_x, position_y, b2world){
		this.b2world = b2world;
		this.controlledByBuoyancy = false;

		// first destroy any current body on actor
		if (typeof this.base !== "undefined" && this.base != null){b2world.DestroyBody(this.base); b2world.DestroyBody(this.pan); }
		
		var baseBodyDef = this.baseBodyDef;
		var baseFixtureDef = this.baseFixtureDef;
		baseBodyDef.position.x = position_x;
		baseBodyDef.position.y = position_y - this.base_height_units;
		var base = this.base = this.b2world.CreateBody(baseBodyDef);
		this.baseFixture = base.CreateFixture(baseFixtureDef);
		base.volume = (this.base_width_units + this.base_width_top_units) / 2 * this.base_height_units * this.base_width_units;
		this.baseFixture.materialSpaces = base.volume;
		this.baseFixture.protectedSpaces = 0;
		this.baseFixture.interiorSpaces = 0;
		this.baseFixture.area = (this.base_width_units + this.base_width_top_units) / 2 * this.base_height_units;

		var panBodyDef = this.panBodyDef;
		var panFixtureDef = this.panFixtureDef;
		panBodyDef.position.x = position_x;
		panBodyDef.position.y = position_y - this.base_height_units - this.pan_dy_units;
		var pan = this.pan = this.b2world.CreateBody(panBodyDef);
		this.panFixture = pan.CreateFixture(panFixtureDef);
		pan.SetFixedRotation(true);
		pan.volume = Math.pow(this.pan_width_units, 2) * this.pan_height_units;
		this.panFixture.materialSpaces = pan.volume;
		this.panFixture.protectedSpaces = 0;
		this.panFixture.interiorSpaces = 0;
		this.panFixture.area = this.pan_width_units * this.pan_height_units;
		this.pan.ResetMassData();

		var panPrismJointDef = this.panPrismJointDef;
		var vec = new b2Vec2(); vec.Set(0, 1);
		panPrismJointDef.Initialize(base, pan, base.GetPosition(), vec);
		panPrismJointDef.localAnchorA = new b2Vec2(0, -this.pan_dy_units);
		panPrismJointDef.localAnchorB = new b2Vec2(0, 0);
		panPrismJointDef.referenceAngle = 0;
		panPrismJointDef.collideConnected = true;
		this.panPrismJoint = this.b2world.CreateJoint (panPrismJointDef);
		
		var panDistJointDef = this.panDistJointDef;
		panDistJointDef.Initialize(pan, base, pan.GetPosition(), base.GetPosition());
		panDistJointDef.dampingRatio = 0.008;
		panDistJointDef.frequencyHz = 1.0;
		this.panDistJoint = this.b2world.CreateJoint (panDistJointDef);

		// put aabb, i.e. upper and lower limit onto the body and area
		//body.local_width_right = mainbeaker.width_px_right / GLOBAL_PARAMETERS.SCALE;
		//body.local_height_below = mainbeaker.height_px_below / GLOBAL_PARAMETERS.SCALE;
		
		this.x = (this.base.GetPosition().x) * GLOBAL_PARAMETERS.SCALE - this.parent.x;
		this.y = (this.base_height_units + this.base.GetPosition().y) * GLOBAL_PARAMETERS.SCALE - this.parent.y;
		
		var pan_y = (this.pan.GetPosition().y) * GLOBAL_PARAMETERS.SCALE - this.parent.y;
		this.prev_pan_y = pan_y;
		this.prev_rF = 0;
		//this.faceShape.onClick = this.haltBeam.bind(this);
		

		// contact listener
		//var contactListener = new b2ContactListener;
		//contactListener.BeginContact = this.BeginContact.bind(this);
		//this.b2world.SetContactListener(contactListener);
		this.skin.redraw(pan_y - this.y, this.panPrismJoint.GetMotorForce());

		/*
		g = this.g = new createjs.Graphics();
		this.shape = new createjs.Shape(g);	
		g.beginFill("rgba(250,0,0,1.0)");
		g.drawCircle(0, 5, 5);
		g.endFill();
		this.addChild(this.shape);
		*/
	}

	/** Remove the bodies of this scale */
	p.removeFromWorld = function (){
		this.b2world.DestroyBody(this.pan);
		this.b2world.DestroyBody(this.base);
		this.b2world.DestroyJoint(this.panPrismJoint);
		this.b2world.DestroyJoint(this.panDistJoint);
		this.pan = null;
		this.base = null;
		this.panPrismJoint = null;
		this.panDistJoint = null;
		this.world = null;
		//this.skin.redraw();
		this.parent.removeChild(this);
	}	
	
	p.update = function (){
		if (this.base != null){
			var pan_y;
			if (this.parent.parent == null){
				this.x = (this.base.GetPosition().x) * GLOBAL_PARAMETERS.SCALE - this.parent.x;
				this.y = (this.base_height_units + this.base.GetPosition().y) * GLOBAL_PARAMETERS.SCALE - this.parent.y;
				pan_y = (this.pan.GetPosition().y) * GLOBAL_PARAMETERS.SCALE - this.parent.y;
			} else {
				this.x = (this.base.GetPosition().x) * GLOBAL_PARAMETERS.SCALE - this.parent.x - this.parent.parent.x;
				this.y = (this.base_height_units + this.base.GetPosition().y) * GLOBAL_PARAMETERS.SCALE - this.parent.y - this.parent.parent.y;
				pan_y = (this.pan.GetPosition().y) * GLOBAL_PARAMETERS.SCALE - this.parent.y - this.parent.parent.y;
			}
			// make sure pan is centered
			var panp = this.pan.GetPosition();
			panp.x = this.base.GetPosition().x;
			this.pan.SetPosition(panp);

			//console.log(this.panDistJoint.GetReactionForce(1/createjs.Ticker.getFPS()).y);
			var rF = this.panDistJoint.GetReactionForce(createjs.Ticker.getFPS()).y;

			if (this.prev_rF != rF){
				var displayrF;
				// acount for liqiud if necessary
				if (typeof this.controlledByBuoyancy !== "undefined" && this.controlledByBuoyancy && this.containedWithin != null){
					displayrF = (rF - this.pan.GetMass()*10 + this.pan.volume*this.containedWithin.liquid.density*10)/1000;
				} else {
					displayrF = (rF - this.pan.GetMass()*10)/1000;
				}
				//displayrF = (rF - this.pan.GetMass()*10)/1000;
				this.skin.redraw(pan_y - this.y, displayrF);
				this.prev_rF = rF;
			} 
			
			// power the joint
			/*
			var pj = this.panPrismJoint;
			var pjt = pj.GetJointTranslation();
			var pjs = pj.GetJointSpeed();
			var baseSpringForce = this.pan.GetMass() * 10;
			pj.SetMaxMotorForce(baseSpringForce + (20 * baseSpringForce * Math.pow(pjt, 2)));
			pj.SetMotorSpeed(-20*pjt);
			*/
		}
	}

	/** Tick function called on every step, if update, redraw */
	p._tick = function ()
	{
		this.Container_tick();
	}
	
	window.Scaleb2Actor = Scaleb2Actor;
}(window));
