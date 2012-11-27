(function (window)
{

	function Balanceb2World (width_px, height_px, world_dx, world_dy, width_units, depth_units)
	{
		this.initialize (width_px, height_px, world_dx, world_dy, width_units, depth_units);
	}

	var p = Balanceb2World.prototype = new createjs.Container();
	// public properties
	p.mouseEventsEnabled = true;
	p.Container_initialize = p.initialize;
	p.Container_tick = p._tick;

	// constants
	p.MAX_TILT_ANGLE = Math.PI/2*0.7;
	p.BASE_WIDTH = 200;
	p.BASE_HEIGHT_EDGE = 5;
	p.BASE_HEIGHT = 20;
	p.STEM_WIDTH = 10;
	p.STEM_HEIGHT = 200;
	p.BEAM_HEIGHT = 10;
	p.BEAM_HEIGHT_EDGE = 2;
	p.BEAM_ARC_DY = 30;
	p.BEAM_MASS = 1000;
	p.PAN_DY = 100;
	p.PAN_HEIGHT = 2;
	p.MASS_DISPLAY_WIDTH = 58;
	
	p.initialize = function (width_px, height_px, world_dx, world_dy, width_units, depth_units)
	{
		this.Container_initialize();
		this.width_px = width_px;
		this.height_px = height_px;
		this.world_dx = world_dx;
		this.world_dy = world_dy;
		this.width_units = width_units;
		this.depth_units = depth_units;
		this.BEAM_LENGTH_X = this.width_px/4;
		this.BEAM_LENGTH_Y = this.BEAM_ARC_DY;
		this.BEAM_LENGTH = Math.sqrt(this.BEAM_LENGTH_X*this.BEAM_LENGTH_X + this.BEAM_LENGTH_Y*this.BEAM_LENGTH_Y);
		this.BEAM_ANGLE = Math.tan(this.BEAM_LENGTH_Y/this.BEAM_LENGTH_X);
		this.PAN_WIDTH = this.width_units * GLOBAL_PARAMETERS.SCALE;
		this.PAN_DEPTH = this.depth_units * GLOBAL_PARAMETERS.SCALE;
		this.SHOW_MASS = typeof GLOBAL_PARAMETERS.SHOW_MASS_BALANCE != "undefined" ? GLOBAL_PARAMETERS.SHOW_MASS_BALANCE : true;
		
		this.mass_on_left_pan = 0;
		this.mass_on_right_pan = 0;
		this.actors_on_left_pan = [];
		this.actors_on_right_pan = [];
		this.balance_moving = false;

		this.justAddedActor = null;
		this.justRemovedActor = null;
		this.justAddedActorToLeft = null;
		this.justRemovedActorToLeft = null;
		this.justAddedActorToRight = null;
		this.justRemovedActorToRight = null;
		

		g = this.g = new createjs.Graphics();
		this.shape = new createjs.Shape(g);
		this.addChild(this.shape);

		g.beginFill("rgba(220, 220, 255, 1.0)");
		//g.drawRect(-this.width_px/2, -this.height_px/2, this.width_px, this.height_px);
		g.drawRect(0, 0, this.width_px, this.height_px);
		g.endFill();
		//draw floor
		//g.beginFill("rgba(200, 200, 150, 1.0)");
		g.beginFill("rgba(80, 80, 80, 1.0)");
		g.drawRect(0, this.height_px-100, this.width_px, 100);
		g.endFill();

		// draw the center pole
		// easel
		var g = this.baseg = new createjs.Graphics();
		this.baseShape = new createjs.Shape(g);
		this.baseShape.x = this.width_px / 2;
		this.addChild(this.baseShape);
		g.clear();
		g.setStrokeStyle(0.5);
		g.beginStroke("#AA9900");
		g.beginLinearGradientFill(["rgba(150,150,50,1.0)", "rgba(200,200,50,1.0)", "rgba(250,250,50,1.0)", "rgba(200,200,50,1.0)", "rgba(150,150,50,1.0)"], [0, 0.25, 0.5, 0.75, 1], -this.BASE_WIDTH/2, 0, this.BASE_WIDTH/2, 0);
		g.moveTo(-this.BASE_WIDTH/2, this.height_px);
		g.lineTo(-this.BASE_WIDTH/2, this.height_px - this.BASE_HEIGHT_EDGE);
		g.lineTo(-this.STEM_WIDTH/2, this.height_px - this.BASE_HEIGHT);
		g.lineTo(+this.STEM_WIDTH/2, this.height_px - this.BASE_HEIGHT);
		g.lineTo(+this.BASE_WIDTH/2, this.height_px - this.BASE_HEIGHT_EDGE);
		g.lineTo(+this.BASE_WIDTH/2, this.height_px);
		g.lineTo(-this.BASE_WIDTH/2, this.height_px);
		
		g.beginLinearGradientFill(["rgba(150,150,50,1.0)",  "rgba(200,200,50,1.0)","rgba(250,250,50,1.0)",  "rgba(200,200,50,1.0)", "rgba(150,150,500,1.0)"], [0, 0.1, 0.5, 0.9, 1], -this.STEM_WIDTH/2, 0, this.STEM_WIDTH/2, 0);
		g.moveTo(-this.STEM_WIDTH/2, this.height_px - this.BASE_HEIGHT);
		g.lineTo(-this.STEM_WIDTH/2, this.height_px - this.STEM_HEIGHT + this.BASE_HEIGHT);
		g.lineTo(0, this.height_px - this.STEM_HEIGHT);
		g.lineTo(+this.STEM_WIDTH/2, this.height_px - this.STEM_HEIGHT + this.BASE_HEIGHT);
		g.lineTo(+this.STEM_WIDTH/2, this.height_px - this.BASE_HEIGHT);
		g.lineTo(-this.STEM_WIDTH/2, this.height_px - this.BASE_HEIGHT);
		g.endFill();

		/// beam
		// easel
		g = this.beamg = new createjs.Graphics();
		this.beamShape = new createjs.Shape(g);
		this.beamShape.x = this.width_px / 2;
		this.beamShape.y = this.height_px - this.STEM_HEIGHT;
		this.addChild(this.beamShape);
		this.beamShape.onClick = this.haltBeam.bind(this);
		g.clear();
		g.setStrokeStyle(1);
		g.beginStroke("#AA9900");
		g.beginFill("#DDCC00");
		g.moveTo(-this.BEAM_LENGTH_X, this.BEAM_ARC_DY);
		g.curveTo(-this.BEAM_LENGTH_X/2, this.BEAM_ARC_DY, 0, 0);
		g.curveTo(this.BEAM_LENGTH_X/2, this.BEAM_ARC_DY, this.BEAM_LENGTH_X, this.BEAM_ARC_DY);
		g.lineTo(this.BEAM_LENGTH_X, this.BEAM_ARC_DY-this.BEAM_HEIGHT_EDGE);
		g.curveTo(this.BEAM_LENGTH_X/2, this.BEAM_ARC_DY-this.BEAM_HEIGHT_EDGE, 0, -this.BEAM_HEIGHT);
		g.curveTo(-this.BEAM_LENGTH_X/2, this.BEAM_ARC_DY-this.BEAM_HEIGHT_EDGE, -this.BEAM_LENGTH_X, this.BEAM_ARC_DY-this.BEAM_HEIGHT_EDGE);
		g.lineTo(-this.BEAM_LENGTH_X, this.BEAM_ARC_DY);	
		g.endFill();
		g.setStrokeStyle(2);
		g.beginStroke("#888888");
		g.beginFill("#EEEEEE");
		g.drawEllipse (-this.MASS_DISPLAY_WIDTH/2, -this.BEAM_HEIGHT - this.MASS_DISPLAY_WIDTH, this.MASS_DISPLAY_WIDTH, this.MASS_DISPLAY_WIDTH);
		g.endFill();
		
		if (this.SHOW_MASS){
			this.massText = new TextContainer("0", "16px Arial", "rgba(100,100,50,1.0)", this.MASS_DISPLAY_WIDTH, this.MASS_DISPLAY_WIDTH, null, null, 0, "center", "center", 0, 0,"rect" ,true)
			this.addChild(this.massText);
			this.massText.x = this.beamShape.x;
			this.massText.y = this.beamShape.y -this.BEAM_HEIGHT - this.MASS_DISPLAY_WIDTH/2;			
		}
		
		// pans
		// easel
		g = this.leftPang = new createjs.Graphics();
		this.leftPanShape = new createjs.Shape(g);
		this.leftPanShape.x = this.width_px / 4;
		this.leftPanShape.y = this.height_px - this.STEM_HEIGHT + this.BEAM_ARC_DY + this.PAN_DY;
		this.addChild(this.leftPanShape);
		
		/// right pan
		// easel
		g = this.rightPang = new createjs.Graphics();
		this.rightPanShape = new createjs.Shape(g);
		this.rightPanShape.x = this.width_px * 3 / 4;
		this.rightPanShape.y = this.height_px - this.STEM_HEIGHT + this.BEAM_ARC_DY + this.PAN_DY;
		this.addChild(this.rightPanShape);
		
		this.drawPans();
		
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

		var vecs, vec;

		//////////////////////////// b2 ////////////////////////////////
		//////////////////////////// b2 ////////////////////////////////
		//////////////////////////// b2 ////////////////////////////////

		var stemFixture = new b2FixtureDef;
		stemFixture.density = 1;
		stemFixture.restitution = 0.2;
		stemFixture.friction = 1.0;
		stemFixture.filter.categoryBits = 2;
		stemFixture.filter.maskBits = 7;
		vecs = new Array();
		vec = new b2Vec2(); vec.Set(0,0); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set( this.STEM_WIDTH/2 / GLOBAL_PARAMETERS.SCALE, this.STEM_HEIGHT / GLOBAL_PARAMETERS.SCALE); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set(-this.STEM_WIDTH/2 / GLOBAL_PARAMETERS.SCALE, this.STEM_HEIGHT / GLOBAL_PARAMETERS.SCALE); vecs[2] = vec;
		stemFixture.shape = new b2PolygonShape;
		stemFixture.shape.SetAsArray(vecs, vecs.length);
		var stemBodyDef = new b2BodyDef;
		stemBodyDef.type = b2Body.b2_staticBody;
		stemBodyDef.position.x = (this.world_dx + this.width_px / 2 ) / GLOBAL_PARAMETERS.SCALE;
		stemBodyDef.position.y = (this.world_dy + this.height_px - this.STEM_HEIGHT) / GLOBAL_PARAMETERS.SCALE;
		var stem = this.b2world.CreateBody(stemBodyDef);
		stem.CreateFixture(stemFixture);

		
		// draw the beam in two parts
		var lefttip = new b2Vec2();
		lefttip.Set( (this.world_dx + this.width_px/2 -this.BEAM_LENGTH_X) / GLOBAL_PARAMETERS.SCALE, (this.world_dy + this.height_px - this.STEM_HEIGHT + this.BEAM_ARC_DY) / GLOBAL_PARAMETERS.SCALE);
		var leftBeamFixture = new b2FixtureDef;
		leftBeamFixture.density = 100;
		leftBeamFixture.friction = 0.5;
		leftBeamFixture.filter.categoryBits = 4;
		leftBeamFixture.filter.maskBits = 6;
		leftBeamFixture.restitution = 0.0;
		vecs = new Array();
		vec = new b2Vec2(); vec.Set(-this.BEAM_LENGTH_X / GLOBAL_PARAMETERS.SCALE, (this.BEAM_ARC_DY) / GLOBAL_PARAMETERS.SCALE); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(-this.BEAM_LENGTH_X / GLOBAL_PARAMETERS.SCALE, (this.BEAM_ARC_DY-this.BEAM_HEIGHT_EDGE) / GLOBAL_PARAMETERS.SCALE); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set(0, -this.BEAM_HEIGHT / GLOBAL_PARAMETERS.SCALE); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set(0, 0); vecs[3] = vec;
		leftBeamFixture.shape = new b2PolygonShape;
		leftBeamFixture.shape.SetAsArray(vecs, vecs.length);
		
		var righttip = new b2Vec2();
		righttip.Set( (this.world_dx + this.width_px/2 + this.BEAM_LENGTH_X) / GLOBAL_PARAMETERS.SCALE, (this.world_dy + this.height_px - this.STEM_HEIGHT + this.BEAM_ARC_DY) / GLOBAL_PARAMETERS.SCALE);
		var rightBeamFixture = new b2FixtureDef;
		rightBeamFixture.density = 100;
		rightBeamFixture.friction = 0.5;
		rightBeamFixture.restitution = 0.0;
		rightBeamFixture.filter.categoryBits = 4;
		rightBeamFixture.filter.maskBits = 6;
		vecs = new Array();
		vec = new b2Vec2(); vec.Set(0, 0); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(0, -this.BEAM_HEIGHT / GLOBAL_PARAMETERS.SCALE); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set(this.BEAM_LENGTH_X / GLOBAL_PARAMETERS.SCALE, (this.BEAM_ARC_DY-this.BEAM_HEIGHT_EDGE) / GLOBAL_PARAMETERS.SCALE); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set(this.BEAM_LENGTH_X / GLOBAL_PARAMETERS.SCALE, (this.BEAM_ARC_DY) / GLOBAL_PARAMETERS.SCALE); vecs[3] = vec;
		rightBeamFixture.shape = new b2PolygonShape;
		rightBeamFixture.shape.SetAsArray(vecs, vecs.length);
		
		var beamBodyDef = new b2BodyDef;
		beamBodyDef.type = b2Body.b2_dynamicBody;
		beamBodyDef.position.x = (this.world_dx + this.width_px / 2) / GLOBAL_PARAMETERS.SCALE;
		beamBodyDef.position.y = (this.world_dy + this.height_px - this.STEM_HEIGHT) / GLOBAL_PARAMETERS.SCALE;
		beamBodyDef.enableLimit = true;
		beamBodyDef.upperLimit = this.MAX_TILT_ANGLE;
		beamBodyDef.lowerLimit = -this.MAX_TILT_ANGLE;
		var beam = this.beam = this.b2world.CreateBody(beamBodyDef);
		beam.SetAngularDamping(0.4);
		beam.CreateFixture(leftBeamFixture);
		beam.CreateFixture(rightBeamFixture);

		
		// join beam with stem
		var tip = new b2Vec2();
		tip.Set((this.world_dx + this.width_px / 2) / GLOBAL_PARAMETERS.SCALE, (this.world_dy + this.height_px - this.STEM_HEIGHT) / GLOBAL_PARAMETERS.SCALE);
		var beamJointDef = new b2RevoluteJointDef();
		beamJointDef.Initialize(stem, beam, tip);
		this.beamJoint = this.b2world.CreateJoint (beamJointDef);
		this.beamJoint.SetLimits(-Math.PI/4, Math.PI/4);
			
		// b2
		var panDip = 0.5;
		var leftPanFixtureL = new b2FixtureDef;
		leftPanFixtureL.density = 50;
		leftPanFixtureL.restitution = 0.0;
		leftPanFixtureL.friction = 1.0;
		leftPanFixtureL.filter.categoryBits = 2;
		leftPanFixtureL.filter.maskBits = 7;
		vecs = new Array();
		vec = new b2Vec2(); vec.Set(-this.PAN_WIDTH / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(0, panDip); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set(0, panDip+(this.PAN_HEIGHT)/GLOBAL_PARAMETERS.SCALE); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set(-this.PAN_WIDTH / 2 / GLOBAL_PARAMETERS.SCALE, (this.PAN_HEIGHT)/GLOBAL_PARAMETERS.SCALE); vecs[3] = vec;
		leftPanFixtureL.shape = new b2PolygonShape;
		leftPanFixtureL.shape.SetAsArray(vecs, vecs.length);

		var leftPanFixtureR = new b2FixtureDef;
		leftPanFixtureR.density = 50;
		leftPanFixtureR.restitution = 0.0;
		leftPanFixtureR.friction = 1.0;
		leftPanFixtureR.filter.categoryBits = 2;
		leftPanFixtureR.filter.maskBits = 7;
		vecs = new Array();
		vec = new b2Vec2(); vec.Set(0, panDip); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(this.PAN_WIDTH / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set(this.PAN_WIDTH / 2 / GLOBAL_PARAMETERS.SCALE, (this.PAN_HEIGHT)/GLOBAL_PARAMETERS.SCALE); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set(0, panDip+(this.PAN_HEIGHT)/GLOBAL_PARAMETERS.SCALE); vecs[3] = vec;
		leftPanFixtureR.shape = new b2PolygonShape;
		leftPanFixtureR.shape.SetAsArray(vecs, vecs.length);


		//ropes
		var leftPanFixtureLRope = new b2FixtureDef;
		leftPanFixtureLRope.density = 10;
		leftPanFixtureLRope.friction = 1.0;
		leftPanFixtureLRope.isSensor = true;
		vecs = new Array();
		vec = new b2Vec2(); vec.Set(-1 / 2 /GLOBAL_PARAMETERS.SCALE, -(this.PAN_DY)/GLOBAL_PARAMETERS.SCALE); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(1 / 2 / GLOBAL_PARAMETERS.SCALE, -(this.PAN_DY)/GLOBAL_PARAMETERS.SCALE); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set((-this.PAN_WIDTH+1) / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set((-this.PAN_WIDTH-1) / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[3] = vec;
		leftPanFixtureLRope.shape = new b2PolygonShape;
		leftPanFixtureLRope.shape.SetAsArray(vecs, vecs.length);
		var leftPanFixtureRRope = new b2FixtureDef;
		leftPanFixtureRRope.friction = 1.0;
		leftPanFixtureRRope.density = 1;
		leftPanFixtureRRope.isSensor = true;
		vecs = new Array();
		vec = new b2Vec2(); vec.Set(-1 / 2 / GLOBAL_PARAMETERS.SCALE, -(this.PAN_DY)/GLOBAL_PARAMETERS.SCALE); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(1 / 2 / GLOBAL_PARAMETERS.SCALE, -(this.PAN_DY)/GLOBAL_PARAMETERS.SCALE); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set((this.PAN_WIDTH+1) / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set((this.PAN_WIDTH-1) / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[3] = vec;
		leftPanFixtureRRope.shape = new b2PolygonShape;
		leftPanFixtureRRope.shape.SetAsArray(vecs, vecs.length);
		var leftPanBodyDef = new b2BodyDef;
		leftPanBodyDef.type = b2Body.b2_dynamicody;
		//leftPanBodyDef.fixedRotation = true;
		leftPanBodyDef.position.x = (this.world_dx + this.width_px / 4 ) / GLOBAL_PARAMETERS.SCALE;
		leftPanBodyDef.position.y = (this.world_dy + this.height_px - this.STEM_HEIGHT + this.BEAM_ARC_DY  + this.PAN_DY ) / GLOBAL_PARAMETERS.SCALE;
		leftPanBodyDef.userData = {"type":"leftPan", "contact":null}
		var leftPan = this.leftPan = this.b2world.CreateBody(leftPanBodyDef);
		leftPan.CreateFixture(leftPanFixtureL);
		leftPan.CreateFixture(leftPanFixtureR);
		leftPan.CreateFixture(leftPanFixtureLRope);
		leftPan.CreateFixture(leftPanFixtureRRope);
		
		var leftPanJointDef = new b2RevoluteJointDef();
		leftPanJointDef.collideConnected = true;
		leftPanJointDef.enableLimit = true;
		leftPanJointDef.lowerAngle = -Math.PI/4;
		leftPanJointDef.upperAngle = Math.PI/4;
		leftPanJointDef.Initialize(leftPan, beam, lefttip);
		this.leftPanJoint = this.b2world.CreateJoint (leftPanJointDef);
		
		
		//b2
		
		var rightPanFixtureL = new b2FixtureDef;
		rightPanFixtureL.density = 50;
		rightPanFixtureL.restitution = 0.0;
		rightPanFixtureL.friction = 1.0;
		rightPanFixtureL.filter.categoryBits = 2;
		rightPanFixtureL.filter.maskBits = 7;
		vecs = new Array();
		vec = new b2Vec2(); vec.Set(-this.PAN_WIDTH / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(0, panDip); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set(0, panDip+(this.PAN_HEIGHT)/GLOBAL_PARAMETERS.SCALE); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set(-this.PAN_WIDTH / 2 / GLOBAL_PARAMETERS.SCALE, (this.PAN_HEIGHT)/GLOBAL_PARAMETERS.SCALE); vecs[3] = vec;
		rightPanFixtureL.shape = new b2PolygonShape;
		rightPanFixtureL.shape.SetAsArray(vecs, vecs.length);

		var rightPanFixtureR = new b2FixtureDef;
		rightPanFixtureR.density = 50;
		rightPanFixtureR.restitution = 0.0;
		rightPanFixtureR.friction = 1.0;
		rightPanFixtureR.filter.categoryBits = 2;
		rightPanFixtureR.filter.maskBits = 7;
		vecs = new Array();
		vec = new b2Vec2(); vec.Set(0, panDip); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(this.PAN_WIDTH / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set(this.PAN_WIDTH / 2 / GLOBAL_PARAMETERS.SCALE, (this.PAN_HEIGHT)/GLOBAL_PARAMETERS.SCALE); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set(0, panDip+(this.PAN_HEIGHT)/GLOBAL_PARAMETERS.SCALE); vecs[3] = vec;
		rightPanFixtureR.shape = new b2PolygonShape;
		rightPanFixtureR.shape.SetAsArray(vecs, vecs.length);


		//ropes
		var rightPanFixtureLRope = new b2FixtureDef;
		rightPanFixtureLRope.isSensor = true;
		rightPanFixtureLRope.density = 10;
		rightPanFixtureLRope.friction = 1.0;
		vecs = new Array();
		vec = new b2Vec2(); vec.Set(-1 / 2 /GLOBAL_PARAMETERS.SCALE, -(this.PAN_DY)/GLOBAL_PARAMETERS.SCALE); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(1 / 2 / GLOBAL_PARAMETERS.SCALE, -(this.PAN_DY)/GLOBAL_PARAMETERS.SCALE); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set((-this.PAN_WIDTH+1) / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set((-this.PAN_WIDTH-1) / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[3] = vec;
		rightPanFixtureLRope.shape = new b2PolygonShape;
		rightPanFixtureLRope.shape.SetAsArray(vecs, vecs.length);
		var rightPanFixtureRRope = new b2FixtureDef;
		rightPanFixtureRRope.isSensor = true;
		rightPanFixtureRRope.density = 1;
		rightPanFixtureRRope.friction = 1.0;
		vecs = new Array();
		vec = new b2Vec2(); vec.Set(-1 / 2 / GLOBAL_PARAMETERS.SCALE, -(this.PAN_DY)/GLOBAL_PARAMETERS.SCALE); vecs[0] = vec;
		vec = new b2Vec2(); vec.Set(1 / 2 / GLOBAL_PARAMETERS.SCALE, -(this.PAN_DY)/GLOBAL_PARAMETERS.SCALE); vecs[1] = vec;
		vec = new b2Vec2(); vec.Set((this.PAN_WIDTH+1) / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[2] = vec;
		vec = new b2Vec2(); vec.Set((this.PAN_WIDTH-1) / 2 / GLOBAL_PARAMETERS.SCALE, 0); vecs[3] = vec;
		rightPanFixtureRRope.shape = new b2PolygonShape;
		rightPanFixtureRRope.shape.SetAsArray(vecs, vecs.length);
		var rightPanBodyDef = new b2BodyDef;
		rightPanBodyDef.type = b2Body.b2_dynamicody;
		//rightPanBodyDef.fixedRotation = true;
		rightPanBodyDef.position.x = (this.world_dx + this.width_px * 3 / 4 ) / GLOBAL_PARAMETERS.SCALE;
		rightPanBodyDef.position.y = (this.world_dy + this.height_px - this.STEM_HEIGHT + this.BEAM_ARC_DY  + this.PAN_DY ) / GLOBAL_PARAMETERS.SCALE;
		rightPanBodyDef.userData = {"type":"rightPan", "contact":null}
		var rightPan = this.rightPan = this.b2world.CreateBody(rightPanBodyDef);
		rightPan.CreateFixture(rightPanFixtureL);
		rightPan.CreateFixture(rightPanFixtureR);
		rightPan.CreateFixture(rightPanFixtureLRope);
		rightPan.CreateFixture(rightPanFixtureRRope);
		
		var rightPanJointDef = new b2RevoluteJointDef();
		rightPanJointDef.collideConnected = true;
		rightPanJointDef.enableLimit = true;
		rightPanJointDef.lowerAngle = -Math.PI/4;
		rightPanJointDef.upperAngle = Math.PI/4;
		rightPanJointDef.Initialize(rightPan, beam, righttip);
		this.rightPanJoint = this.b2world.CreateJoint (rightPanJointDef);
		
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
	p.drawPans = function ()
	{
		var lpanColor, rpanColor;
		if (this.mass_on_left_pan != this.mass_on_right_pan && this.leftPanShape.y - this.rightPanShape.y > 1){lpanColor = "#99CC99"; rpanColor = "#CC9999";}
		else if (this.mass_on_left_pan != this.mass_on_right_pan  && this.leftPanShape.y - this.rightPanShape.y < -1) {rpanColor = "#99CC99"; lpanColor = "#CC9999";}
		else {lpanColor = "#CCCCCC"; rpanColor = "#CCCCCC";}

		var g = this.leftPanShape.graphics;
		g.clear();
		g.setStrokeStyle(2);
		g.beginStroke("#AAAAAA");
		g.beginFill(lpanColor);
		g.drawEllipse(-this.PAN_WIDTH/2, -this.PAN_HEIGHT*16, this.PAN_WIDTH, this.PAN_HEIGHT*20);
		g.endFill();
		g.moveTo(-this.PAN_WIDTH/2, -this.PAN_HEIGHT*8);
		g.lineTo(0, -this.PAN_DY)
		g.moveTo(this.PAN_WIDTH/2, -this.PAN_HEIGHT*8);
		g.lineTo(0, -this.PAN_DY);
		g.endFill();

		var g = this.rightPanShape.graphics;
		g.clear();
		g.setStrokeStyle(2);
		g.beginStroke("#AAAAAA");
		g.beginFill(rpanColor);
		g.drawEllipse(-this.PAN_WIDTH/2, -this.PAN_HEIGHT*16, this.PAN_WIDTH, this.PAN_HEIGHT*20);
		g.endFill();
		g.moveTo(-this.PAN_WIDTH/2, -this.PAN_HEIGHT*8);
		g.lineTo(0, -this.PAN_DY)
		g.moveTo(this.PAN_WIDTH/2, -this.PAN_HEIGHT*8);
		g.lineTo(0, -this.PAN_DY)
		g.endFill();
	}

	/** When user clicks on beam, stop the beam from moving */
	p.haltBeam = function (evt)
	{
		this.beam.SetAngularVelocity(0);
	}

	p.updateMassOnPans = function ()
	{	
		var pan;
		pan = this.leftPan;
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
				if (typeof(actor.onLeftPan) == "undefined" || !actor.onLeftPan)
				{	
					eventManager.fire("add-balance", [actor.skin.savedObject]);
					this.justAddedActorToLeft = actor;
					this.actors_on_left_pan.push(actor);
				}
				actor.onLeftPan = true;
				actor.onRightPan = false;
				mass += actor.body.GetMass();
			} else if (typeof(actor.onLeftPan) != "undefined" && actor.onLeftPan)
			{
				// remove event
				eventManager.fire("remove-balance", [actor.skin.savedObject]);
				actor.onLeftPan = false;
				this.actors_on_left_pan.splice(this.actors_on_left_pan.indexOf(actor));
				this.justRemovedActorToLeft = actor;
			}
		}
		this.mass_on_left_pan = mass;

		pan = this.rightPan;
		pan_leftx = pan.GetPosition().x - this.PAN_WIDTH/2/GLOBAL_PARAMETERS.SCALE;
		pan_rightx = pan.GetPosition().x + this.PAN_WIDTH/2/GLOBAL_PARAMETERS.SCALE;
		pan_y = pan.GetPosition().y;
		mass = 0;
		for (i = 0; i < this.actors.length; i++)
		{
			actor = this.actors[i];
			leftx = actor.body.GetPosition().x - actor.width_px_left/GLOBAL_PARAMETERS.SCALE;
			rightx = actor.body.GetPosition().x + actor.width_px_right/GLOBAL_PARAMETERS.SCALE
			y = actor.body.GetPosition().y;
			if (actor.parent == this && y < pan_y && (leftx >= pan_leftx && leftx <= pan_rightx || rightx >= pan_leftx && rightx <= pan_rightx))
			{
								// was this object here before?
				if (typeof(actor.onRightPan) == "undefined" || !actor.onRightPan)
				{	
					eventManager.fire("add-balance", [actor.skin.savedObject]);
					this.justAddedActorToRight = actor;
					this.actors_on_right_pan.push(actor);
				}
				actor.onLeftPan = false;
				actor.onRightPan = true;
				mass += actor.body.GetMass();
			} else if (typeof(actor.onRightPan) != "undefined" && actor.onRightPan)
			{
				// remove event
				eventManager.fire("remove-balance", [actor.skin.savedObject]);
				actor.onRightPan = false;
				this.justRemovedActorToRight = actor;
				this.actors_on_right_pan.splice(this.actors_on_right_pan.indexOf(actor));
			}
		}
		this.mass_on_right_pan = mass;

		if (this.SHOW_MASS){
			var mass_diff = this.mass_on_right_pan - this.mass_on_left_pan;
			if (mass_diff != 0){
				this.massText.setText(Math.round(1000*mass_diff)/1000);
			} else {
				this.massText.setText("0");
			}
			
			
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
		eventManager.fire('add-balance-world',[actor.skin.savedObject], box2dModel);
		
		actor.x = x;
		actor.y = y;
		
		actor.world = this;
		
		var bodyDef = actor.bodyDef;
		//bodyDef.fixedRotation = true;
		bodyDef.position.x = (this.x + x) / GLOBAL_PARAMETERS.SCALE;
		bodyDef.position.y = (this.y + y) / GLOBAL_PARAMETERS.SCALE;
			
		var body = actor.body = this.b2world.CreateBody(bodyDef);
	
		// figure out where to place this object based on it's relative position to other actors.
		var count_right_of = 0;
		for (var i = 0; i < this.actors.length; i++)
		{
			if (body.GetWorldCenter().x > this.actors[i].body.GetWorldCenter().x) count_right_of++;
			// also, wake any actors up
			this.actors[i].body.SetAwake(true);
		} 

		this.addChildAt(actor, this.getNumChildren() - this.actors.length + count_right_of);
		

		for (var i = 0; i < actor.fixDefs.length; i++)
		{
			var fixDef = actor.fixDefs[i];
			body.CreateFixture(fixDef);

		}
		this.actors.push(actor);
		// set a flag so we can look for initial contact with this object
		this.justAddedActor = body;
		this.justRemovedActor = null;
		this.justAddedActorToLeft = null;
		this.justRemovedActorToLeft = null;
		this.justAddedActorToRight = null;
		this.justRemovedActorToRight = null;
		this.updateMassOnPans();
	}

	p.removeActor = function (actor)
	{
		this.removeChild(actor);
		this.justRemovedActor = actor;
		this.justAddedActor = null;
		this.justAddedActorToLeft = null;
		this.justRemovedActorToLeft = null;
		this.justAddedActorToRight = null;
		this.justRemovedActorToRight = null;
		this.updateMassOnPans();

		eventManager.fire('remove-balance-world',[actor.skin.savedObject], box2dModel);
		this.actors.splice(this.actors.indexOf(actor), 1);
		this.b2world.DestroyBody(actor.body);
		actor.body = null;
		actor.world = null;
		
	}

	p.BeginContact = function (contact)
	{
		
		// When the object just added makes contact, set linear damping high to avoid too much motion.
		if (this.justAddedActor != null)
		{
			if (contact.GetFixtureA().m_body == this.justAddedActor.body)
			{	
				contact.GetFixtureA().m_body.SetLinearDamping(1);
				contact.GetFixtureA().m_body.SetFixedRotation(true);
			} else if (contact.GetFixtureB().m_body == this.justAddedActor.body)
			{
				contact.GetFixtureB().m_body.SetLinearDamping(1);
				contact.GetFixtureA().m_body.SetFixedRotation(true);
			} 
			//this.justAddedActor = null;
		}
		this.updateMassOnPans();
	}

	/** Tick function called on every step, if update, redraw */
	p._tick = function ()
	{
		this.Container_tick();
		var i;
		
		// adjust pans and beam
		this.leftPanJoint.SetLimits(this.beamJoint.GetJointAngle(), this.beamJoint.GetJointAngle());
		this.rightPanJoint.SetLimits(this.beamJoint.GetJointAngle(), this.beamJoint.GetJointAngle());
		
		this.beamShape.x = this.beam.GetPosition().x * GLOBAL_PARAMETERS.SCALE - this.world_dx;
		this.beamShape.y = this.beam.GetPosition().y * GLOBAL_PARAMETERS.SCALE - this.world_dy;
		this.beamShape.rotation = this.beam.GetAngle() * 180 / Math.PI;

		this.leftPanShape.x = this.leftPan.GetPosition().x * GLOBAL_PARAMETERS.SCALE - this.world_dx;
		this.leftPanShape.y = this.leftPan.GetPosition().y * GLOBAL_PARAMETERS.SCALE - this.world_dy;
		this.leftPanShape.rotation = this.leftPan.GetAngle() * 180 / Math.PI;

		this.rightPanShape.x = this.rightPan.GetPosition().x * GLOBAL_PARAMETERS.SCALE - this.world_dx;
		this.rightPanShape.y = this.rightPan.GetPosition().y * GLOBAL_PARAMETERS.SCALE - this.world_dy;
		this.rightPanShape.rotation = this.rightPan.GetAngle() * 180 / Math.PI;

		if (this.beam.IsAwake())
		{
			this.drawPans();
			this.balance_moving = true;
		} else if (this.balance_moving)
		{
			this.balance_moving = false;
			// look to see if this is a direct comparison, 1xN, NxN
			if (this.actors_on_left_pan.length == 1 && this.actors_on_right_pan.length == 1)
			{
				eventManager.fire('test-balance-1to1',[this.actors_on_left_pan[0].skin.savedObject, this.actors_on_right_pan[0].skin.savedObject], box2dModel);
			} else if (this.actors_on_left_pan.length == 1)
			{
				eventManager.fire('test-balance-1toN',[this.actors_on_left_pan[0].skin.savedObject, this.mass_on_right_pan], box2dModel);
			} else if (this.actors_on_left_pan.length == 1)
			{
				eventManager.fire('test-balance-Nto1',[this.mass_on_left_pan, this.actors_on_right_pan[0].skin.savedObject], box2dModel);
			} else if (this.actors_on_left_pan.length > 0 || this.actors_on_right_pan.length > 0)
			{
				eventManager.fire('test-balance-NtoN',[this.mass_on_left_pan, this.mass_on_right_pan]);
			}
			this.justAddedActorToLeft = null;
			this.justRemovedActorToLeft = null;
			this.justAddedActorToRight = null;
			this.justRemovedActorToRight = null;
		}

		for(i = 0; i < this.actors.length; i++)
		{
			this.actors[i].update();
		}

		if (this.SHOW_MASS){
			var r = this.beamShape.rotation * Math.PI / 180;
			this.massText.x = this.beamShape.x + (this.BEAM_HEIGHT+this.MASS_DISPLAY_WIDTH/2) * Math.sin(r);
			this.massText.y = this.beamShape.y - (this.BEAM_HEIGHT+this.MASS_DISPLAY_WIDTH/2) * Math.cos(r);
		}

		this.b2world.Step(1/createjs.Ticker.getFPS(), 10, 10);
		//console.log(this, this.getNumChildren());
		if (GLOBAL_PARAMETERS.DEBUG) this.b2world.DrawDebugData();
	}
	
	
	window.Balanceb2World = Balanceb2World;
}(window));
