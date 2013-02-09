(function (window)
{

	function Scaleb2World (width_px, height_px, world_dx, world_dy, width_units, depth_units)
	{
		this.initialize (width_px, height_px, world_dx, world_dy, width_units, depth_units);
	}

	var p = Scaleb2World.prototype = new createjs.Container();
	// public properties
	p.mouseEventsEnabled = true;
	p.Container_initialize = p.initialize;
	p.Container_tick = p._tick;

	// constants
	p.MAX_TILT_ANGLE = Math.PI/2*0.7;
	p.PAN_DY = 50;
	p.PAN_HEIGHT = 2;
	p.MASS_DISPLAY_WIDTH = 58;
	p.BASE_WIDTH_BOTTOM = 160;
	p.BASE_WIDTH_TOP = 120;
	p.BASE_HEIGHT = 80;
	p.BASE_DEPTH = 60;
		
	p.BASE_DY = 5;
	
	p.initialize = function (width_px, height_px, world_dx, world_dy, width_units, depth_units)
	{
		this.Container_initialize();
		this.width_px = width_px;
		this.height_px = height_px;
		this.world_dx = world_dx;
		this.world_dy = world_dy;
		this.width_units = width_units;
		this.depth_units = depth_units;
		this.PAN_WIDTH =1.5* this.width_units * GLOBAL_PARAMETERS.SCALE;
		this.PAN_DEPTH =1.5* this.depth_units * GLOBAL_PARAMETERS.SCALE;
		
		this.mass_on_pan = 0;
		this.actors_on_pan = [];
		this.scale_moving = false;

		this.justAddedActor = null;
		this.justRemovedActor = null;
		
		g = this.g = new createjs.Graphics();
		this.shape = new createjs.Shape(g);
		this.addChild(this.shape);

		//g.beginFill("rgba(240,220,230,1.0)");
		g.beginLinearGradientFill(["rgba(250,250,250,1.0)","rgba(230,210,220,1.0)"],[0,1.0],0,0,this.width_px,this.height_px);
		g.drawRect(0, 0, this.width_px, this.height_px);
		g.endFill();
		//draw floor
		//g.beginFill("rgba(200, 200, 150, 1.0)");
		g.beginLinearGradientFill(["rgba(120,120,120,1.0)","rgba(80,80,80,1.0)"],[0,1.0],0,this.height_px-100,this.width_px,this.height_px);
		g.drawRect(0, this.height_px-100, this.width_px, 100);
		g.endFill();

		var dw = this.BASE_DEPTH * Math.sin(GLOBAL_PARAMETERS.view_sideAngle);
		var dh = this.BASE_DEPTH * Math.sin(GLOBAL_PARAMETERS.view_topAngle);

		// draw the base
		var g = this.baseg = new createjs.Graphics();
		this.baseShape = new createjs.Shape(g);
		this.addChild(this.baseShape);
		this.baseShape.x = this.width_px / 2;
		this.baseShape.y = this.height_px - this.BASE_DY;
		g.setStrokeStyle(0.5);
		g.beginStroke("#AA9900");
		g.beginLinearGradientFill(["rgba(150,150,50,1.0)", "rgba(200,200,50,1.0)", "rgba(250,250,50,1.0)", "rgba(200,200,50,1.0)", "rgba(150,150,50,1.0)"], [0, 0.25, 0.5, 0.75, 1], -this.BASE_WIDTH_BOTTOM/2, 0, this.BASE_WIDTH_BOTTOM/2, 0);
		g.moveTo(-this.BASE_WIDTH_TOP/2, -this.BASE_HEIGHT);
		g.lineTo(this.BASE_WIDTH_TOP/2, -this.BASE_HEIGHT);
		g.lineTo(this.BASE_WIDTH_BOTTOM/2, 0);
		g.lineTo(-this.BASE_WIDTH_BOTTOM/2, 0);
		g.lineTo(-this.BASE_WIDTH_TOP/2, -this.BASE_HEIGHT);
		g.endFill();
		g.beginStroke("#AA9900");
		g.beginLinearGradientFill(["rgba(100,100,25,1.0)", "rgba(150,150,25,1.0)", "rgba(200,200,25,1.0)", "rgba(150,150,25,1.0)", "rgba(100,100,25,1.0)"], [0, 0.25, 0.5, 0.75, 1], -this.BASE_WIDTH_BOTTOM/2, 0, this.BASE_WIDTH_BOTTOM/2, 0);
		g.moveTo(-this.BASE_WIDTH_TOP/2, -this.BASE_HEIGHT);
		g.lineTo(-this.BASE_WIDTH_TOP/2+dw, -this.BASE_HEIGHT-dh);
		g.lineTo(this.BASE_WIDTH_TOP/2+dw, -this.BASE_HEIGHT-dh);
		g.lineTo(this.BASE_WIDTH_BOTTOM/2+dw, -dh);
		g.lineTo(this.BASE_WIDTH_BOTTOM/2, 0);
		g.lineTo(this.BASE_WIDTH_TOP/2, -this.BASE_HEIGHT);
		g.lineTo(-this.BASE_WIDTH_TOP/2, -this.BASE_HEIGHT);
		g.lineTo(-this.BASE_WIDTH_TOP/2, -this.BASE_HEIGHT);
		g.endFill();
		
		// face
		g = this.faceg = new createjs.Graphics();
		this.faceShape = new createjs.Shape(g);
		this.faceShape.x = this.baseShape.x;
		this.faceShape.y = this.baseShape.y - this.BASE_HEIGHT/2;
		this.addChild(this.faceShape);
		this.faceShape.onClick = this.haltBeam.bind(this);
		g.setStrokeStyle(2);
		g.beginFill("#EEEEEE");
		g.drawEllipse (-this.MASS_DISPLAY_WIDTH/2, -this.MASS_DISPLAY_WIDTH/2, this.MASS_DISPLAY_WIDTH, this.MASS_DISPLAY_WIDTH);
		g.endFill();
		
		
		this.massText = new TextContainer("0", "16px Arial", "rgba(100,100,50,1.0)", this.MASS_DISPLAY_WIDTH, this.MASS_DISPLAY_WIDTH, null, null, 0, "center", "center", 0, 0,"rect" ,true)
		this.addChild(this.massText);
		this.massText.x = this.baseShape.x;
		this.massText.y = this.baseShape.y - this.BASE_HEIGHT/2;			
		
		
		// pans
		// easel
		g = this.pang = new createjs.Graphics();
		this.panShape = new createjs.Shape(g);
		this.panShape.x = this.width_px / 4;
		this.panShape.y = this.baseShape.y - this.PAN_DY;
		this.addChild(this.panShape);
		
		this.drawPan();
		
		///////////// b2

		this.b2world = new b2World(new b2Vec2(0, 10), true);
		var zerop = new b2Vec2();
		zerop.Set(0, 0);
		
		// floor
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

		//ceiling
		
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

		
		//////////////////////////// b2 ////////////////////////////////
		//////////////////////////// b2 ////////////////////////////////
		//////////////////////////// b2 ////////////////////////////////

		var vecs, vec;
		var baseFixture = new b2FixtureDef;
		baseFixture.density = 1;
		baseFixture.restitution = 0.2;
		baseFixture.friction = 1.0;
		baseFixture.filter.categoryBits = 2;
		baseFixture.filter.maskBits = 7;
		vecs = [];
		vec = new b2Vec2(); vec.Set(this.BASE_WIDTH_TOP/2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(this.BASE_WIDTH_BOTTOM/2 / GLOBAL_PARAMETERS.SCALE, this.BASE_HEIGHT / GLOBAL_PARAMETERS.SCALE); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set(-this.BASE_WIDTH_BOTTOM/2 / GLOBAL_PARAMETERS.SCALE, this.BASE_HEIGHT / GLOBAL_PARAMETERS.SCALE); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set(-this.BASE_WIDTH_TOP/2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[3] = vec;
		baseFixture.shape = new b2PolygonShape;
		baseFixture.shape.SetAsArray(vecs, vecs.length);
		var baseBodyDef = new b2BodyDef;
		baseBodyDef.type = b2Body.b2_staticBody;
		baseBodyDef.position.x = (this.world_dx + this.width_px / 2 ) / GLOBAL_PARAMETERS.SCALE;
		baseBodyDef.position.y = (this.world_dy + this.height_px - this.BASE_HEIGHT) / GLOBAL_PARAMETERS.SCALE;
		var base = this.base = this.b2world.CreateBody(baseBodyDef);
		base.CreateFixture(baseFixture);
		
		var panFixture = new b2FixtureDef;
		panFixture.density = 50;
		panFixture.restitution = 0.0;
		panFixture.friction = 1.0;
		panFixture.filter.categoryBits = 2;
		panFixture.filter.maskBits = 7;
		vecs = [];
		vec = new b2Vec2(); vec.Set(-this.PAN_WIDTH / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(this.PAN_WIDTH / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set(this.PAN_WIDTH / 2 / GLOBAL_PARAMETERS.SCALE, (this.PAN_HEIGHT)/GLOBAL_PARAMETERS.SCALE); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set(-this.PAN_WIDTH / 2 / GLOBAL_PARAMETERS.SCALE, (this.PAN_HEIGHT)/GLOBAL_PARAMETERS.SCALE); vecs[3] = vec;
		panFixture.shape = new b2PolygonShape;
		panFixture.shape.SetAsArray(vecs, vecs.length);
		var panBodyDef = new b2BodyDef;
		panBodyDef.type = b2Body.b2_dynamicBody;
		panBodyDef.position.x = (this.world_dx + this.width_px / 2 ) / GLOBAL_PARAMETERS.SCALE;
		panBodyDef.position.y = (this.world_dy + this.height_px-this.BASE_HEIGHT-this.PAN_DY) / GLOBAL_PARAMETERS.SCALE;
		var pan = this.pan = this.b2world.CreateBody(panBodyDef);
		pan.CreateFixture(panFixture);
		
		var panJointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
		vec = new b2Vec2(); vec.Set(0,1);
		panJointDef.Initialize(base, pan, pan.GetWorldCenter(), vec);
		panJointDef.collideConnected = true;
		panJointDef.enableMotor = true;
		this.panJoint = this.b2world.CreateJoint (panJointDef);
		this.panJoint.EnableMotor(true);

		// contact listener
		var contactListener = new b2ContactListener;
		contactListener.BeginContact = this.BeginContact.bind(this);
		this.b2world.SetContactListener(contactListener);
		if (GLOBAL_PARAMETERS.DEBUG)
		{
			var debugDraw = this.debugDraw = new b2DebugDraw;
			debugDraw.SetSprite(document.getElementById("debugcanvas").getContext("2d"));
			debugDraw.SetDrawScale(GLOBAL_PARAMETERS.SCALE);
			debugDraw.SetFillAlpha(1.0);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			this.b2world.SetDebugDraw(debugDraw);
		}

		this.actors = new Array();
	}
	
	/** A separate function so that we can draw the pan color based on the heavir of the two pans */
	p.drawPan = function ()
	{
		var panColor;
		if (this.mass_on_pan != 0){panColor = "#99CC99";}
		else {panColor = "#CCCCCC";}

		var g = this.panShape.graphics;
		g.clear();
		g.setStrokeStyle(1);
		g.beginStroke("#888888");
		g.beginFill("#AAAAAA");
		g.drawRect(-5, 0, 10, this.baseShape.y-this.BASE_HEIGHT-this.panShape.y-10);
		g.endFill();
		g.endStroke();
		g.setStrokeStyle(2);
		g.beginStroke("#AAAAAA");
		g.beginFill(panColor);
		g.drawEllipse(-this.PAN_WIDTH/2, -this.PAN_DEPTH*Math.sin(GLOBAL_PARAMETERS.view_topAngle), this.PAN_WIDTH, this.PAN_DEPTH*Math.sin(GLOBAL_PARAMETERS.view_topAngle));
		g.endFill();
		
	}

	/** When user clicks on beam, stop the beam from moving */
	p.haltBeam = function (evt)
	{
		this.pan.SetLinearVelocity(0);
	}

	p.updateMassOnPan = function ()
	{	
		var pan;
		pan = this.pan;
		var pan_leftx = pan.GetPosition().x - this.PAN_WIDTH/2/GLOBAL_PARAMETERS.SCALE;
		var pan_rightx = pan.GetPosition().x + this.PAN_WIDTH/2/GLOBAL_PARAMETERS.SCALE;
		var leftx, lefty, y;
		var pan_y = pan.GetPosition().y;
		var mass = 0;
		var actor;
		for (var i = 0; i < this.actors.length; i++)
		{
			actor = this.actors[i];
			leftx = actor.body.GetPosition().x - actor.width_px_left/GLOBAL_PARAMETERS.SCALE;
			rightx = actor.body.GetPosition().x + actor.width_px_right/GLOBAL_PARAMETERS.SCALE
			y = actor.body.GetPosition().y;
			if (actor.parent == this && y < pan_y && (leftx >= pan_leftx && leftx <= pan_rightx || rightx >= pan_leftx && rightx <= pan_rightx))
			{
				// was this object here before?
				if (typeof(actor.onPan) == "undefined" || !actor.onPan)
				{	
					eventManager.fire("add-scale", [actor.skin.savedObject]);
					this.justAddedActor = actor;
					this.actors_on_pan.push(actor);
				}
				actor.onPan = true;
				mass += actor.body.GetMass();
			} else if (typeof(actor.onPan) != "undefined" && actor.onPan)
			{
				// remove event
				eventManager.fire("remove-scale", [actor.skin.savedObject]);
				actor.onPan = false;
				this.actors_on_pan.splice(this.actors_on_pan.indexOf(actor));
				this.justRemovedActor = actor;
			}
		}
		this.mass_on_pan = mass;

		if (mass != 0){
			this.massText.setText(Math.round(1000*mass)/1000);
		} else {
			this.massText.setText("0");
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
	p.addActor = function (actor, x, y)
	{
		eventManager.fire('add-scale-world',[actor.skin.savedObject], box2dModel);
		
		actor.x = x;
		actor.y = y;
		
		actor.world = this;
		
		var bodyDef = actor.bodyDef;
		//bodyDef.fixedRotation = true;
		bodyDef.position.x = (this.x + x) / GLOBAL_PARAMETERS.SCALE;
		bodyDef.position.y = (this.y + y) / GLOBAL_PARAMETERS.SCALE;
			
		var body = actor.body = this.b2world.CreateBody(bodyDef);
	
		// figure out where to place this object based on it's relative position to other actors.
		for (var i = 0; i < this.actors.length; i++)
		{
			// also, wake any actors up
			this.actors[i].body.SetAwake(true);
		} 

		this.addChild(actor);
		this.sortActorsDisplayDepth();
		

		for (var i = 0; i < actor.fixDefs.length; i++)
		{
			var fixDef = actor.fixDefs[i];
			body.CreateFixture(fixDef);

		}
		this.actors.push(actor);
		// set a flag so we can look for initial contact with this object
		this.justAddedActor = body;
		this.justRemovedActor = null;
		this.update_mass_flag = true;
		//this.updateMassOnPan();
	}

	p.removeActor = function (actor)
	{
		this.removeChild(actor);
		this.justRemovedActor = actor;
		this.justAddedActor = null;
		this.updateMassOnPan();
		//this.sortActorsDisplayDepth();

		eventManager.fire('remove-scale-world',[actor.skin.savedObject], box2dModel);
		this.actors.splice(this.actors.indexOf(actor), 1);
		this.b2world.DestroyBody(actor.body);
		actor.body = null;
		actor.world = null;
		
	}

	/** Called whenever anything touches anything.  Useful for knowing when something happens in world */
	p.BeginContact = function (contact)
	{
		if (this.update_mass_flag) this.updateMassOnPan();
		this.sortActorsDisplayDepth();
		// When the object just added makes contact, set linear damping high to avoid too much motion.
		if (this.justAddedActor != null)
		{
			if (contact.GetFixtureA().m_body == this.justAddedActor.body)
			{	
				contact.GetFixtureA().m_body.SetLinearDamping(0.5);
				//contact.GetFixtureA().m_body.SetFixedRotation(true);
			} else if (contact.GetFixtureB().m_body == this.justAddedActor.body)
			{
				contact.GetFixtureB().m_body.SetLinearDamping(0.5);
				//contact.GetFixtureA().m_body.SetFixedRotation(true);
			} 
			//this.justAddedActor = null;
		}
		this.updateMassOnPan();
	}

	/**
	*	Will sort by the highest objects on top, then right-most objects
	*/
	p.sortActorsDisplayDepth = function(){
		for (var i = this.actors.length-2; i >= 0; i--){
			var i_index = this.getChildIndex(this.actors[i]);
			for (var j = i+1; j < this.actors.length; j++){
				var j_index = this.getChildIndex(this.actors[j]);
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

	/** Tick function called on every step, if update, redraw */
	p._tick = function ()
	{
		this.Container_tick();
		var i;
		
		// adjust pans and beam
		this.panShape.x = this.pan.GetPosition().x * GLOBAL_PARAMETERS.SCALE - this.world_dx;
		this.panShape.y = this.pan.GetPosition().y * GLOBAL_PARAMETERS.SCALE - this.world_dy;
		
		if (this.pan.IsAwake())
		{
			this.drawPan();
			this.scale_moving = true;
		} else if (this.scale_moving)
		{
			this.scale_moving = false;
			// look to see if this is a direct comparison, 1xN, NxN
			if (this.actors_on_pan.length == 1)
			{
				eventManager.fire('test-scale-1',[this.actors_on_pan[0].skin.savedObject], box2dModel);
			} else {
				eventManager.fire('test-scale-N',[this.mass_on_pan]);
			}
		}

		for(i = 0; i < this.actors.length; i++)
		{
			this.actors[i].update();
		}

		var pj = this.panJoint;
		var pjt = pj.GetJointTranslation();
		var pjs = pj.GetJointSpeed();
		var baseSpringForce = this.pan.GetMass() * 10;
		pj.SetMaxMotorForce(baseSpringForce + (20 * baseSpringForce * Math.pow(pjt, 2)));
		pj.SetMotorSpeed(-20*pjt);
		
		this.b2world.Step(1/createjs.Ticker.getFPS(), 10, 10);
		if (GLOBAL_PARAMETERS.DEBUG) this.b2world.DrawDebugData();
	}
	
	
	window.Scaleb2World = Scaleb2World;
}(window));
