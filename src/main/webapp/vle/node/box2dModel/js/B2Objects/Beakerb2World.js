(function (window)
{

	function Beakerb2World (width_px, height_px, world_dx, world_dy, beaker_width_px, beaker_height_px, beaker_depth_px)
	{
		this.initialize (width_px, height_px, world_dx, world_dy, beaker_width_px, beaker_height_px, beaker_depth_px);
	} 

	var p = Beakerb2World.prototype = new Container();
	// public properties
	p.mouseEventsEnabled = true;
	p.Container_initialize = p.initialize;
	p.Container_tick = p._tick;
	p.NUM_BACK_OBJECTS = 5;
	p.WALL_THICKNESS = 4;
	p.BEAKER_WALL_THICKNESS = 2;
	p.NUM_RULER_TICKS = 10;
	p.DRAINING_PER_SECOND = 0.5;
	p.ALLOW_FILL_INTERIOR = false;
	
	p.initialize = function (width_px, height_px, world_dx, world_dy, beaker_width_px, beaker_height_px, beaker_depth_px)
	{
		this.Container_initialize();
		this.width_px = width_px;
		this.height_px = height_px;
		this.world_dx = world_dx;
		this.world_dy = world_dy;
		liquid_volume_perc = GLOBAL_PARAMETERS.liquid_volume_perc;
		spilloff_volume_perc = GLOBAL_PARAMETERS.spilloff_volume_perc;
		var width_from_depth = this.width_from_depth = beaker_depth_px * Math.sin(GLOBAL_PARAMETERS.view_sideAngle);
		var height_from_depth = this.height_from_depth = beaker_depth_px * Math.sin(GLOBAL_PARAMETERS.view_topAngle);
		this.beaker_width_px = beaker_width_px;
		this.beaker_height_px = beaker_height_px;
		this.beaker_depth_px = beaker_depth_px;
		this.beaker_bottom_dy = 5;
		this.beaker_volume = this.beaker_width_px/GLOBAL_PARAMETERS.SCALE * this.beaker_depth_px/GLOBAL_PARAMETERS.SCALE * this.beaker_height_px/GLOBAL_PARAMETERS.SCALE;
		this.liquid_volume_perc = liquid_volume_perc;
		this.init_liquid_y = (1 - liquid_volume_perc) * this.beaker_height_px;
		this.liquid_y = this.init_liquid_y;
		if (typeof(spilloff_volume_perc) == "undefined"){this.spilloff_volume_perc = 1}else{this.spilloff_volume_perc = spilloff_volume_perc}
		this.init_liquid_volume = liquid_volume_perc * this.beaker_volume;
		this.liquid_volume = this.init_liquid_volume;
		this.contents_volume = this.liquid_volume;
		this.volume_under_spout = this.spilloff_volume_perc * this.liquid_volume;
		this.min_liquid_y = this.beaker_height_px - this.beaker_height_px * this.spilloff_volume_perc
		this.beaker_x = 40 + beaker_width_px/2;

		this.liquid = GLOBAL_PARAMETERS.liquids[GLOBAL_PARAMETERS.liquid_available];
		this.liquid_color = this.liquid.fill_color; //.replace("1.0", "0.5");
		this.liquid_stroke_color = this.liquid.stroke_color;//.replace("1.0", "0.5");

		g = this.g = new Graphics();
		this.shape = new Shape(g);
		this.addChild(this.shape);

		g.beginFill("rgba(220, 220, 255, 1.0)");
		g.drawRect(0, 0, this.width_px, this.height_px);
		g.endFill();
		//draw floor
		g.beginFill("rgba(80, 80, 80, 1.0)");
		g.drawRect(0, this.height_px-100, this.width_px, 100);
		g.endFill();

		this.puddleGraphics = new Graphics();
		this.puddleShape = new Shape(this.puddleGraphics);
		this.addChild(this.puddleShape);

		this.backWaterGraphics = new Graphics();
		this.backWaterShape = new Shape(this.backWaterGraphics);
		this.backWaterLineGraphics = new Graphics();
		this.backWaterLineShape = new Shape(this.backWaterLineGraphics);
		this.backGraphics = new Graphics();
		this.backShape = new Shape(this.backGraphics);
		this.frontWaterGraphics = new Graphics();
		this.frontWaterShape = new Shape(this.frontWaterGraphics);
		this.frontWaterLineGraphics = new Graphics();
		this.frontWaterLineShape = new Shape(this.frontWaterLineGraphics);
		this.frontGraphics = new Graphics();
		this.frontShape = new Shape(this.frontGraphics);
		this.spoutGraphics = new Graphics();
		this.spoutShape = new Shape(this.spoutGraphics);
		this.rulerGraphics = new Graphics();
		this.rulerShape = new Shape(this.rulerGraphics);
		this.pointerGraphics = new Graphics();
		this.pointerShape = new Shape(this.pointerGraphics);
		this.pointerText = new Text(Math.round(this.total_volume), "1.0em Bold Arial", "#222");

		// add to display
		this.addChild(this.backShape);
		this.addChild(this.backWaterShape);
		this.addChild(this.backWaterLineShape);
		this.addChild(this.frontWaterShape);
		this.addChild(this.frontShape);
		this.addChild(this.spoutShape);
		this.addChild(this.rulerShape);
		this.addChild(this.rulerShape);
		this.addChild(this.addShape);
		
		this.frontShape.x = this.beaker_x; this.frontShape.y = this.height_px - this.beaker_bottom_dy - this.beaker_height_px;
		this.frontWaterShape.x = this.beaker_x; this.frontWaterShape.y = this.height_px - this.beaker_bottom_dy - this.beaker_height_px;
		this.frontWaterLineShape.x = this.beaker_x; this.frontWaterLineShape.y = this.height_px - this.beaker_bottom_dy - this.beaker_height_px;
		this.backShape.x = this.frontShape.x + this.width_from_depth; this.backShape.y = this.frontShape.y - this.height_from_depth;
		this.backWaterShape.x = this.frontWaterShape.x + this.width_from_depth; this.backWaterShape.y = this.frontWaterShape.y - this.height_from_depth;
		this.backWaterLineShape.x = this.frontWaterLineShape.x + this.width_from_depth; this.backWaterLineShape.y = this.frontWaterLineShape.y - this.height_from_depth;
		this.spoutShape.x = this.beaker_x + this.beaker_width_px/2 + this.width_from_depth/2; this.spoutShape.y = this.height_px - this.beaker_bottom_dy - this.spilloff_volume_perc * this.beaker_height_px - this.height_from_depth/2;		
		this.rulerShape.x = this.beaker_x + -this.beaker_width_px/2 - 10;
		this.pointerShape.x = this.beaker_x - this.beaker_width_px/2;
		this.pointerText.x = this.pointerShape.x - 33;
		this.puddle_width = 0;
		this.spout_open = false;
		this.draining = false;
		this.spout_change = false;
		this.spout_point = new Point (this.spoutShape.x + 50, this.spoutShape.y + 50);
		this.refill_button_drawn = false;
		this.release_button_drawn = false;

		// draw liquid line
		g = this.backWaterLineGraphics;
		//g.setStrokeStyle(1);
		//g.beginLinearGradientFill(["rgba(100,100,255,0.6)", "rgba(150,150,255,0.6)","rgba(175,175,255,0.6)", "rgba(150,150,255,0.6)", "rgba(100,100,255,0.6)"], [0, 0.1, 0.5, 0.9, 1], -this.beaker_width_px/2-this.width_from_depth*3/4, 0, this.beaker_width_px/2-this.width_from_depth*3/4, 0);
		g.beginFill(this.liquid_stroke_color);
		g.moveTo(-this.beaker_width_px/2, 0);
		g.lineTo(this.beaker_width_px/2, 0);
		g.lineTo(this.beaker_width_px/2 - this.width_from_depth*4/4, this.height_from_depth*4/4);
		g.lineTo(-this.beaker_width_px/2 - this.width_from_depth*4/4, this.height_from_depth*4/4);
		g.lineTo(-this.beaker_width_px/2, 0)
		g.endFill();

		// initial drawing
		var g = this.backGraphics;
		g.clear();
		// rim
		g.setStrokeStyle(1);
		//g.beginLinearGradientFill(["rgba(56,56,56,0.6)", "rgba(100,100,100,0.4)","rgba(127,127,127,0.2)", "rgba(100,100,100,0.4)", "rgba(56,56,56,0.6)"], [0, 0.1, 0.5, 0.9, 1], 0, -this.height_px/8-10, 0, -this.height_px/8);
		//g.drawRoundRect(-this.beaker_width_px/2-4, this.height_px-this.beaker_bottom_dy-this.beaker_height_px, this.beaker_width_px+8, 4, 4);
		//g.drawEllipse(-this.beaker_width_px/2-4, this.height_px-this.beaker_height_px-8-10, this.beaker_width_px+8, 16);
		//g.endFill();
		// cylinder
		g.setStrokeStyle(this.BEAKER_WALL_THICKNESS);
		g.beginLinearGradientFill(["rgba(127,127,127,0.4)", "rgba(200,200,200,0.4)","rgba(225,225,255,0.5)", "rgba(200,200,200,0.4)", "rgba(127,127,127,0.4)"], [0, 0.1, 0.5, 0.9, 1], -this.beaker_width_px/2, 0, this.beaker_width_px/2, 0);
		g.beginLinearGradientStroke(["rgba(127,127,127,0.5)", "rgba(200,200,200,0.4)","rgba(255,255,255,0.3)", "rgba(200,200,200,0.4)", "rgba(127,127,127,0.5)"], [0, 0.1, 0.5, 0.9, 1], -this.beaker_width_px/2, 0, this.beaker_width_px/2, 0);
		g.drawRect(-this.beaker_width_px/2, 0, this.beaker_width_px, this.beaker_height_px);
		g.endFill();
		// draw left side wall
		g.beginLinearGradientFill(["rgba(127,127,127,0.4)", "rgba(200,200,200,0.4)","rgba(225,225,255,0.5)", "rgba(200,200,200,0.4)", "rgba(127,127,127,0.4)"], [0, 0.1, 0.5, 0.9, 1], -this.beaker_width_px/2-this.width_from_depth, 0, -this.beaker_width_px/2, 0);
		g.moveTo(-this.beaker_width_px/2, 0);
		g.lineTo(-this.beaker_width_px/2 - this.width_from_depth, this.height_from_depth);
		g.lineTo(-this.beaker_width_px/2 - this.width_from_depth, this.beaker_height_px+this.height_from_depth);
		g.lineTo(-this.beaker_width_px/2, this.beaker_height_px);
		g.lineTo(-this.beaker_width_px/2, 0);
		g.endFill();
		g.endStroke();
		
		// draw liquid line, actually half the top suface
		g = this.frontWaterLineGraphics;
		//g.setStrokeStyle(1);
		//g.beginLinearGradientFill(["rgba(100,100,255,0.6)", "rgba(150,150,255,0.6)","rgba(175,175,255,0.6)", "rgba(150,150,255,0.6)", "rgba(100,100,255,0.6)"], [0, 0.1, 0.5, 0.9, 1], -this.beaker_width_px/2+this.width_from_depth*1/4, 0, this.beaker_width_px/2+this.width_from_depth*1/4, 0);
		g.beginFill(this.liquid_stroke_color);
		g.moveTo(-this.beaker_width_px/2, 0);
		g.lineTo(this.beaker_width_px/2, 0);
		g.lineTo(this.beaker_width_px/2 + this.width_from_depth/4, -this.height_from_depth/4);
		g.lineTo(-this.beaker_width_px/2 + this.width_from_depth/4, -this.height_from_depth/4);
		g.lineTo(-this.beaker_width_px/2, 0)
		g.endFill();

		// initial drawing
		var g = this.frontGraphics;
		g.clear();
		// rim
		//g.setStrokeStyle(1);
		//g.beginLinearGradientFill(["rgba(56,56,56,0.6)", "rgba(100,100,100,0.4)","rgba(127,127,127,0.2)", "rgba(100,100,100,0.4)", "rgba(56,56,56,0.6)"], [0, 0.1, 0.5, 0.9, 1], 0, -this.height_px/8-10, 0, -this.height_px/8);
		//g.drawRoundRect(-this.beaker_width_px/2-4, this.height_px-this.beaker_bottom_dy - this.beaker_height_px, this.beaker_width_px+8, 4, 4);
		//g.drawEllipse(-this.beaker_width_px/2-4, this.height_px-this.beaker_height_px-8-10, this.beaker_width_px+8, 16);
		//g.endFill();
		// cylinder
		g.setStrokeStyle(this.BEAKER_WALL_THICKNESS);
		g.beginLinearGradientFill(["rgba(127,127,127,0.2)", "rgba(200,200,200,0.2)","rgba(225,225,255,0.3)", "rgba(200,200,200,0.2)", "rgba(127,127,127,0.2)"], [0, 0.1, 0.5, 0.9, 1], -this.beaker_width_px/2, 0, this.beaker_width_px/2, 0);
		g.beginLinearGradientStroke(["rgba(127,127,127,0.5)", "rgba(200,200,200,0.4)","rgba(255,255,255,0.3)", "rgba(200,200,200,0.4)", "rgba(127,127,127,0.5)"], [0, 0.1, 0.5, 0.9, 1], -this.beaker_width_px/2, 0, this.beaker_width_px/2, 0);
		g.drawRect(-this.beaker_width_px/2, 0, this.beaker_width_px, this.beaker_height_px);
		g.endFill();
		// right side wall
		g.beginLinearGradientFill(["rgba(127,127,127,0.2)", "rgba(200,200,200,0.2)","rgba(225,225,255,0.3)", "rgba(200,200,200,0.2)", "rgba(127,127,127,0.2)"], [0, 0.1, 0.5, 0.9, 1], this.beaker_width_px/2, 0, this.beaker_width_px/2 + this.width_from_depth, 0);
		g.moveTo(this.beaker_width_px/2, 0);
		g.lineTo(this.beaker_width_px/2 + this.width_from_depth, -this.height_from_depth);
		g.lineTo(this.beaker_width_px/2 + this.width_from_depth, this.beaker_height_px-this.height_from_depth);
		g.lineTo(this.beaker_width_px/2, this.beaker_height_px);
		g.lineTo(this.beaker_width_px/2, 0);
		
		g.endFill();
		g.endStroke();
		
		// draw a ruler
		g = this.rulerGraphics;
		g.clear();
		g.setStrokeStyle(1);
		//g.beginLinearGradientStroke(["rgba(56,56,56,0.6)", "rgba(100,100,100,0.4)","rgba(127,127,127,0.2)", "rgba(100,100,100,0.4)", "rgba(56,56,56,0.6)"], [0, 0.1, 0.5, 0.9, 1], -this.beaker_width_px/2, 0, this.beaker_width_px/2, 0);
	 	g.beginStroke("rgba(50, 50, 50, 1.0)")
	 	var text;
	 	var vstr;
		for (var i=0; i < this.NUM_RULER_TICKS; i++)
		{
			var ry = this.height_px - this.beaker_bottom_dy - this.beaker_height_px*i/this.NUM_RULER_TICKS
			g.moveTo(0, ry);
			g.lineTo(10, ry);
			vstr = Math.round(((this.height_px - this.beaker_bottom_dy) - ry) / GLOBAL_PARAMETERS.SCALE);
			text = new Text(vstr, "1.0em Bold Arial", "#888");
			text.x = this.beaker_x - this.beaker_width_px/2 - 33;
			text.y = ry + 4; 
			this.addChild(text);
		}
		this.addChild(this.pointerShape);
		this.addChild(this.pointerText);

		
		// draw pointer to liquid line
		g = this.pointerGraphics;
		g.setStrokeStyle(1);
		g.beginStroke("rgba(100, 100, 100, 1)");
		g.beginFill("rgba(255,255,255, 1.0)");
		g.moveTo(0, 0);
		g.lineTo(-8, -10);
		g.lineTo(-36, -10);
		g.lineTo(-36, 10);
		g.lineTo(-8, 10);
		g.lineTo(0, 0);
		g.endFill();
		g.endStroke();		
		
		//////////////////////////// b2 ////////////////////////////////
		//////////////////////////// b2 ////////////////////////////////
		//////////////////////////// b2 ////////////////////////////////
		// 
		var vecs, vec;
		
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
		floorFixture.shape.SetAsBox(this.width_px / 2 / GLOBAL_PARAMETERS.SCALE, this.WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE);
		var floorBodyDef = new b2BodyDef;
		floorBodyDef.type = b2Body.b2_staticBody;
		floorBodyDef.position.x = (this.world_dx + (this.width_px) / 2 ) / GLOBAL_PARAMETERS.SCALE;
		floorBodyDef.position.y = (this.world_dy + this.height_px + this.WALL_THICKNESS / 2 ) / GLOBAL_PARAMETERS.SCALE;
		var floor = this.floor = this.b2world.CreateBody(floorBodyDef);
		floor.CreateFixture(floorFixture);

		//ceiling
		/*
		var ceilingFixture = new b2FixtureDef;
		ceilingFixture.density = 1;
		ceilingFixture.restitution = 0.2;
		ceilingFixture.filter.categoryBits = 2;
		ceilingFixture.filter.maskBits = 3;
		ceilingFixture.shape = new b2PolygonShape;
		ceilingFixture.shape.SetAsBox(this.width_px / 2 / GLOBAL_PARAMETERS.SCALE, this.WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE);
		var ceilingBodyDef = new b2BodyDef;
		ceilingBodyDef.type = b2Body.b2_staticBody;
		ceilingBodyDef.position.x = (this.world_dx + (this.width_px) / 2 ) / GLOBAL_PARAMETERS.SCALE;
		ceilingBodyDef.position.y = (this.world_dy - ( this.WALL_THICKNESS ) / 2 ) / GLOBAL_PARAMETERS.SCALE;
		var ceiling = this.b2world.CreateBody(ceilingBodyDef);
		ceiling.CreateFixture(ceilingFixture);
		*/

		var leftWallFixture = new b2FixtureDef;
		leftWallFixture.density = 1;
		leftWallFixture.restitution = 0.2;
		leftWallFixture.filter.categoryBits = 2;
		leftWallFixture.filter.maskBits = 3;
		leftWallFixture.shape = new b2PolygonShape;
		leftWallFixture.shape.SetAsBox(this.WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE, this.height_px / 2 / GLOBAL_PARAMETERS.SCALE);
		var leftWallBodyDef = new b2BodyDef;
		leftWallBodyDef.type = b2Body.b2_staticBody;
		leftWallBodyDef.position.x = (this.world_dx + (this.WALL_THICKNESS / 2) ) / GLOBAL_PARAMETERS.SCALE;
		leftWallBodyDef.position.y = (this.world_dy + (this.height_px) / 2 ) / GLOBAL_PARAMETERS.SCALE;
		var leftWall = this.leftWall = this.b2world.CreateBody(leftWallBodyDef);
		leftWall.CreateFixture(leftWallFixture);

		var rightWallFixture = new b2FixtureDef;
		rightWallFixture.density = 1;
		rightWallFixture.restitution = 0.2;
		rightWallFixture.filter.categoryBits = 2;
		rightWallFixture.filter.maskBits = 2;
		rightWallFixture.shape = new b2PolygonShape;
		rightWallFixture.shape.SetAsBox(this.WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE, this.height_px / 2 / GLOBAL_PARAMETERS.SCALE);
		var rightWallBodyDef = new b2BodyDef;
		rightWallBodyDef.type = b2Body.b2_staticBody;
		rightWallBodyDef.position.x = (this.world_dx + this.width_px - (this.WALL_THICKNESS / 2) ) / GLOBAL_PARAMETERS.SCALE;
		rightWallBodyDef.position.y = (this.world_dy + (this.height_px) / 2 ) / GLOBAL_PARAMETERS.SCALE;
		var rightWall = this.rightWall = this.b2world.CreateBody(rightWallBodyDef);
		rightWall.CreateFixture(rightWallFixture);

		// beaker
		var beakerFloorFixture = new b2FixtureDef;
		beakerFloorFixture.density = 1.0;
		beakerFloorFixture.filter.categoryBits = 2;
		beakerFloorFixture.filter.maskBits = 3;
		beakerFloorFixture.friction = 0.5;
		beakerFloorFixture.shape = new b2PolygonShape;
		beakerFloorFixture.shape.SetAsBox(this.beaker_width_px / 2 / GLOBAL_PARAMETERS.SCALE, this.BEAKER_WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE);
		var beakerFloorBodyDef = new b2BodyDef;
		beakerFloorBodyDef.type = b2Body.b2_staticBody;
		beakerFloorBodyDef.position.x = (this.world_dx + this.beaker_x) / GLOBAL_PARAMETERS.SCALE;
		beakerFloorBodyDef.position.y = (this.world_dy + this.height_px - this.beaker_bottom_dy + this.BEAKER_WALL_THICKNESS / 2) / GLOBAL_PARAMETERS.SCALE;
		var beakerFloor = this.beakerFloor = this.b2world.CreateBody(beakerFloorBodyDef);
		beakerFloor.CreateFixture(beakerFloorFixture);

		var beakerLeftWallFixture = new b2FixtureDef;
		beakerLeftWallFixture.density = 1.0;
		beakerLeftWallFixture.filter.categoryBits = 2;
		beakerLeftWallFixture.filter.maskBits = 3;
		beakerLeftWallFixture.friction = 0.0;
		beakerLeftWallFixture.shape = new b2PolygonShape;
		beakerLeftWallFixture.shape.SetAsBox(this.BEAKER_WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE, this.beaker_height_px / 2 / GLOBAL_PARAMETERS.SCALE);
		var beakerLeftWallBodyDef = new b2BodyDef;
		beakerLeftWallBodyDef.type = b2Body.b2_staticBody;
		beakerLeftWallBodyDef.position.x = (this.world_dx + this.beaker_x - this.beaker_width_px / 2 - 2*this.BEAKER_WALL_THICKNESS) / GLOBAL_PARAMETERS.SCALE;
		beakerLeftWallBodyDef.position.y = (this.world_dy + this.height_px - this.beaker_bottom_dy - this.beaker_height_px / 2) / GLOBAL_PARAMETERS.SCALE;
		var beakerLeftWall = this.beakerLeftWall = this.b2world.CreateBody(beakerLeftWallBodyDef); 
		beakerLeftWall.CreateFixture(beakerLeftWallFixture); 

		var beakerRightWallFixture = new b2FixtureDef;
		beakerRightWallFixture.density = 1.0;
		beakerRightWallFixture.filter.categoryBits = 2;
		beakerRightWallFixture.filter.maskBits = 3;
		beakerRightWallFixture.friction = 0.0;
		beakerRightWallFixture.shape = new b2PolygonShape;
		beakerRightWallFixture.shape.SetAsBox(this.BEAKER_WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE, this.beaker_height_px / 2 / GLOBAL_PARAMETERS.SCALE);
		var beakerRightWallBodyDef = new b2BodyDef;
		beakerRightWallBodyDef.type = b2Body.b2_staticBody;
		beakerRightWallBodyDef.position.x = (this.world_dx + this.beaker_x + this.beaker_width_px / 2 + 2*this.BEAKER_WALL_THICKNESS) / GLOBAL_PARAMETERS.SCALE;
		beakerRightWallBodyDef.position.y = (this.world_dy + this.height_px - this.beaker_bottom_dy - this.beaker_height_px / 2) / GLOBAL_PARAMETERS.SCALE;
		var beakerRightWall = this.beakerRightWall = this.b2world.CreateBody(beakerRightWallBodyDef);
		beakerRightWall.CreateFixture(beakerRightWallFixture);

		// draw spout first time
		this.drawSpout();
		this.drawReleaseButton();

		// buoyancy controller
		var controller = this.controller = this.b2world.AddController(new Myb2BuoyancyController());
		controller.density = this.liquid.density;
		var normal = new b2Vec2(); normal.Set(0, -1);
		controller.normal = normal;
		var offset = -(this.world_dy + this.height_px - this.beaker_bottom_dy - this.beaker_height_px + this.liquid_y) / GLOBAL_PARAMETERS.SCALE;
		controller.SetInitialOffset(offset);
		controller.surfaceArea = this.beaker_width_px / GLOBAL_PARAMETERS.SCALE * this.beaker_depth_px / GLOBAL_PARAMETERS.SCALE;
		
		// contact listener
		var contactListener = new b2ContactListener;
		contactListener.BeginContact = this.BeginContact.bind(this);
		this.b2world.SetContactListener(contactListener);
		
		this.justAddedActor = null;
		this.justAddedActorToBuoyancy = null;
		
		if (GLOBAL_PARAMETERS.DEBUG)
		{
			var debugDraw = this.debugDraw = new b2DebugDraw;
			debugDraw.SetSprite(document.getElementById("debugcanvas2").getContext("2d"));
			debugDraw.SetDrawScale(GLOBAL_PARAMETERS.SCALE);
			debugDraw.SetFillAlpha(1.0);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_controllerBit);
			this.b2world.SetDebugDraw(debugDraw);
		}

		this.actors = new Array();
	}

	/**
	*
	*/
	p.drawRefillButton = function ()
	{
		if (!this.refill_button_drawn && this.liquid_y > (this.init_liquid_y+.01))
		{
			$('#beaker-button-holder').append('<input type="submit" id="refill-button" value="Refill" style="font-size:14px; position:absolute"/>');
			var htmlElement = $('#refill-button').button().bind('click', {parent: this}, this.refillBeaker);
			var element = new DOMElement(htmlElement[0]);
			this.addChild(element);
			element.x = this.beaker_x - 20;
			element.y = 30;
			this.refill_button_drawn = true;
		}
	}
		/* Refills beaker to inital liquid level.  Removes the button */
		p.refillBeaker = function (evt)
		{
			if (!evt.data.parent.draining)
			{
				eventLogger.addEvent("button_press", "beaker-refill");
				var liquid_dy = evt.data.parent.init_liquid_y - evt.data.parent.liquid_y;
				evt.data.parent.liquid_volume = evt.data.parent.init_liquid_volume;
				evt.data.parent.controller.ChangeOffset(-liquid_dy/GLOBAL_PARAMETERS.SCALE);
							
				// remove refill button
				evt.data.parent.refill_button_drawn = false;
				evt.data.parent.removeChild(evt.target);
				$('#refill-button').remove();
			}
		}

	/**
	*
	*/
	p.drawReleaseButton = function ()
	{
		if (!this.refill_button_drawn && (this.beaker_height_px - this.liquid_y) - this.spilloff_volume_perc * this.beaker_height_px  > 0.01)
		{
			$('#beaker-button-holder').append('<input type="submit" id="release-button" value="Release" style="font-size:14px; position:absolute"/>');
			var htmlElement = $('#beaker-button-holder').find("input[id='release-button']").button().bind('click', {parent: this}, this.releaseSpout);
			var element = new DOMElement(htmlElement[0]);
			this.addChild(element);
			element.x = this.beaker_x + this.beaker_width_px/2 + 20;
			element.y = this.height_px / 2;
			this.release_button_drawn = true;
		}
	}

		/** When user clicks the release text, the spout opens and water drains */
		p.releaseSpout = function (evt)
		{
			if (!evt.data.parent.draining)
			{
				var obj = {};
				obj.volume_above_spout = Math.round(1000*((evt.data.parent.beaker_height_px - evt.data.parent.liquid_y) - evt.data.parent.spilloff_volume_perc * evt.data.parent.beaker_height_px)/GLOBAL_PARAMETERS.SCALE * evt.data.parent.beaker_depth_px/GLOBAL_PARAMETERS.SCALE * evt.data.parent.beaker_width_px/GLOBAL_PARAMETERS.SCALE)/1000;
				obj.available_volume_in_spilloff_container = evt.data.parent.spilloffContainer == null ? -1 : Math.round(1000*evt.data.parent.spilloffContainer.skin.available_volume)/1000;
				if (obj.volume_above_spout > 0)
				{
					if (typeof evt.data.parent.spilloffContainer != "undefined" && evt.data.parent.spilloffContainer != null) {
						eventLogger.addEvent("button_press", "beaker-spout", [obj], [evt.data.parent.spilloffContainer.skin.savedObject]);
					} else{
						eventLogger.addEvent("button_press", "beaker-spout", [obj]);
					}

					evt.data.parent.spout_change = true;
					
				}
			}
		}
	
	p.drawSpout = function ()
	{
		// if the spillof level is below the top of the rim, place a "hole" on the side
		if (this.spilloff_volume_perc < 1 )
		{
			var spoutDiameter = 10;
			var p1, p2, p3, p4, p5, p6;
			p1 = new Point(0, 0);
			if (this.spilloffContainer != null)
			{
				// attach to top of spilloff container
				p3 = new Point( this.spilloffContainer.x + this.spilloffContainer.skin.width_px_right/2 - this.spoutShape.x, this.spilloffContainer.y - + this.spilloffContainer.skin.height_px_above/2 - this.spoutShape.y);
			} else
			{
				p3 = new Point (50, 50);
			}
			
			var spoutIncline = Math.atan((p3.y-p1.y)/(p3.x-p1.x));
			var spoutWidth = p3.x - p1.x; var spoutHeight = p3.y - p1.y;
			var spoutLength = Math.sqrt((p3.y-p1.y)*(p3.y-p1.y) + (p3.x-p1.x)*(p3.x-p1.x));
			//p2 = new Point (p1.x + spoutWidth/2 - spoutDiameter/2*Math.sin(spoutIncline), p1.y + spoutHeight/4 + spoutDiameter/2*Math.cos(spoutIncline));
			//p5 = new Point (p1.x + spoutWidth/2 + spoutDiameter/2*Math.sin(spoutIncline), p1.y + spoutHeight/4 - spoutDiameter/2*Math.cos(spoutIncline));
			p4 = new Point(p3.x + spoutDiameter * Math.sin(spoutIncline), p3.y - spoutDiameter * Math.cos(spoutIncline));
			p6 = new Point(0, -spoutDiameter/Math.cos(spoutIncline));
			
			var g = this.spoutGraphics;
			g.clear();
			g.setStrokeStyle(0.5);
			g.beginStroke("rgba(100, 100, 100, 1.0)");	
			g.beginLinearGradientFill(["rgba(127,127,127,1.0)", "rgba(200,200,200,1.0)","rgba(225,225,255,1.0)", "rgba(200,200,200,1.0)", "rgba(127,127,127,1.0)"], [0, 0.1, 0.5, 0.9, 1], p1.x, p1.y, p1.x + spoutDiameter*Math.sin(spoutIncline), p1.y - spoutDiameter*Math.cos(spoutIncline));
			g.moveTo(p1.x, p1.y); g.lineTo(p3.x, p3.y); g.lineTo(p4.x, p4.y); g.lineTo(p6.x, p6.y); g.curveTo(p1.x-4, (p1.y-p6.y)/2 + p6.y, p1.x, p1.y);
			g.endFill();
			g.endStroke();

			var mp = new Point ((p3.x + p4.x)/2, (p3.y + p4.y)/2);
			g.setStrokeStyle(1);
			g.beginStroke("rgba(160, 160, 160, 1.0)"); 		
			g.beginFill("rgba(200,200, 200, 1.0)");
			g.drawEllipse(mp.x-spoutDiameter/2*Math.sin(spoutIncline), mp.y-spoutDiameter/2*Math.cos(spoutIncline), spoutDiameter*Math.sin(spoutIncline), spoutDiameter*Math.cos(spoutIncline));
			g.endStroke();
			g.endFill();

			this.spout_point = new Point (this.spoutShape.x + mp.x, this.spoutShape.y + mp.y);
		}
	}

	/** This is not working right now, but in the future may use this so that we can place the object in the world while dragging*/
	p.placeObject = function (o, x, y)
	{
		if (this.hitTestObject(o))
		{
			//var gp = o.parent.localToGlobal(x, y);
			var lp = this.globalToLocal(x, y);
			//console.log(x, y, lp.x, lp.y);
			if (typeof(o.placed) == "undefined" || !o.placed)
			{
				o.parent.removeChild(o);
				this.addActor(o, lp.x, lp.y);
				o.placed = true;
			}
			var wp = new b2Vec2(); wp.Set((this.x + lp.x) / GLOBAL_PARAMETERS.SCALE, (this.y + lp.y) / GLOBAL_PARAMETERS.SCALE);
			o.body.SetPosition(wp);
		}
	}
	

	/** This works for objecs where the width_px_left, height_px_above, width_px_right, width_px_below are defined
	    i.e., there is no assumption of where 0,0 is relative to the object.
	    Both objects must be on the stage, i.e. must have parents */
	p.hitTestObject = function (o)
	{
		if (typeof(o.width_px_left) != "undefined" && typeof(o.width_px_right) != "undefined" && typeof(o.height_px_above) != "undefined" && typeof(o.height_px_below) != "undefined")
		{
			if (typeof(o.parent) != "undefined" && this.parent != "undefined")
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

	/** Place an actor object in this world */
	p.addActor = function (actor, x, y)
	{
		eventLogger.addEvent("place", "beaker-world", [actor.skin.savedObject]);

		actor.x = x;
		actor.y = y;
		actor.bodyDef.position.x = (this.x + x) / GLOBAL_PARAMETERS.SCALE;
		actor.bodyDef.position.y = (this.y + y) / GLOBAL_PARAMETERS.SCALE;
		
		actor.world = this;
		this.addChildAt(actor, this.NUM_BACK_OBJECTS + this.actors.length);
		this.actors.push(actor);

		this.createActorsBody(actor);
		
		this.justAddedActor = actor;
		this.addToBuoyancyControllerWithinDomain(actor);
	}

	p.createActorsBody = function (actor)
	{
		// first destroy any current body on actor
		if (actor.body != null) this.b2world.DestroyBody(actor.body);

		var bodyDef = actor.bodyDef;
		var body = actor.body = this.b2world.CreateBody(bodyDef);

		
		var area = 0;
		var volume = 0;
		for (i = 0; i < actor.fixDefs.length; i++)
		{
			var fixDef = actor.fixDefs[i];
			var f = body.CreateFixture(fixDef);
			f.materialDensity = fixDef.materialDensity;
			f.totalSpaces = fixDef.totalSpaces;
			f.materialSpaces = fixDef.materialSpaces;
			f.exteriorSpaces = fixDef.exteriorSpaces;
			if (typeof(fixDef.interiorSpaces) != "undefined"){f.interiorSpaces = fixDef.interiorSpaces;}else{f.interiorSpaces = 0;}
			if (typeof(fixDef.protectedSpaces) != "undefined"){f.protectedSpaces = fixDef.protectedSpaces;}else{f.protectedSpaces = 0;}
			// set density for the length of the entire depth
			f.SetDensity(f.materialDensity * f.materialSpaces);

			volume += f.materialSpaces + f.protectedSpaces + f.interiorSpaces;

			var lowerBound = f.GetAABB().lowerBound;
			var upperBound = f.GetAABB().upperBound;
			area += Math.abs((upperBound.x - lowerBound.x) * (upperBound.y - lowerBound.y));
			if (typeof(f.emptySpaces) != "undefined") body.emptySpaces += f.emptySpaces;
		}
		
		// put aabb, i.e. upper and lower limit onto the body and area
		body.local_width_right = actor.width_px_right / GLOBAL_PARAMETERS.SCALE;
		body.local_height_below = actor.height_px_below / GLOBAL_PARAMETERS.SCALE;
		body.area = area;
		body.volume = volume;
		body.fullySubmerged = false;
		body.fullyEmerged = true;
		body.soaked = false;
		body.is_container = actor.is_container;
		if (typeof(bodyDef.IsFixedRotation) != "undefined" && bodyDef.IsFixedRotation) body.SetFixedRotation(true);
		//body.SetSleepingAllowed(false);
		body.ResetMassData();
	}

	p.addToBuoyancyControllerWithinDomain = function (actor)
	{
		//let's not be redundant;
		if (typeof(actor.controlledByBuoyancy) == "undefined" || !actor.controlledByBuoyancy )
		{
			var body = actor.body;
			// add only if within confines of beaker
			if (body.GetPosition().x >= this.beakerLeftWall.GetPosition().x - this.WALL_THICKNESS/2/GLOBAL_PARAMETERS.SCALE && body.GetPosition().x + body.local_width_right <= this.beakerRightWall.GetPosition().x + this.WALL_THICKNESS/2/GLOBAL_PARAMETERS.SCALE)
			{
				eventLogger.addEvent("place", "beaker", [actor.skin.savedObject]);
				this.controller.AddBody(body);
				// set a reference so we can look for initial contact with this object
				this.justAddedActorToBuoyancy = actor;
				actor.controlledByBuoyancy = true;
			} else
			{
				actor.controlledByBuoyancy = false;
			}
		}
	}

	/** Returns Boolean, is a container in the x-position under the spout? */ 
	p.setAsSpilloffContainerWithinDomain = function (actor)
	{
		if (actor.is_container)
		{
			var body = actor.body;
			// is on space to the right of the beaker?
			if (body.GetPosition().x >= this.beakerRightWall.GetPosition().x + this.WALL_THICKNESS/2/GLOBAL_PARAMETERS.SCALE && body.GetPosition().x + body.local_width_right <= this.rightWall.GetPosition().x - this.WALL_THICKNESS/2/GLOBAL_PARAMETERS.SCALE)
			{
				eventLogger.addEvent("place", "beaker-spilloff", [actor.skin.savedObject]);
				this.spilloffContainer = actor;
				this.drawSpout();
				return true;
			}else
			{
				if (typeof(this.spilloffContainer) == "undefined") this.spilloffContainer = null;
				return false;
			}
		} else
		{
			if (typeof(this.spilloffContainer) == "undefined") this.spilloffContainer = null;
			return false;
		}
	}

	p.removeActor = function (actor)
	{
		eventLogger.addEvent("remove", "beaker-world", [actor.skin.savedObject]);
		if (actor == this.spilloffContainer) this.spilloffContainer = null;
		this.removeChild(actor);
		this.actors.splice(this.actors.indexOf(this), 1);
		this.b2world.DestroyBody(actor.body);
		actor.body = null;
		actor.world = null;	
		actor.controlledByBuoyancy = false;
	}


	p.BeginContact = function (contact)
	{
		//console.log("here");
		// When the object just added makes contact, wake up anything it makes contact with
		{
			if (contact.GetFixtureA().m_body == this.justAddedActorToBuoyancy)
			{	
				contact.GetFixtureB().m_body.SetAwake(true);
			} else if (contact.GetFixtureB().m_body == this.justAddedActorToBuoyancy)
			{
				contact.GetFixtureA().m_body.SetAwake(true);
			} 
			

		}
	}

	/** Tick function called on every step, if update, redraw */
	p._tick = function ()
	{
		this.Container_tick();
		
		if (this.spout_change || this.draining != this.spout_open)
		{
			if (!this.spout_open)
			{
				this.spout_open = true;
				this.draining = true;
			} else
			{
				this.spout_open = false;
				this.draining = false;
			}
			this.spout_change = false;
		}

		// if a newly added body is asleep see if we should "hook up" the spilloff spout
		if (this.justAddedActor != null )
		{
			if (!this.justAddedActor.body.IsAwake())
			{
				this.setAsSpilloffContainerWithinDomain(this.justAddedActor);
				this.justAddedActor = null;
			}
		}

		var liquid_diff_y, liquid_dy, offset;
		var g;
		if (this.draining)
		{
			if (this.liquid_y < this.min_liquid_y)
			{
				liquid_diff_y = this.min_liquid_y - this.liquid_y;
				if (liquid_diff_y > this.DRAINING_PER_SECOND/Ticker.getFPS())
				{
					liquid_dy = this.DRAINING_PER_SECOND/Ticker.getFPS();
					this.controller.ChangeOffset(-liquid_dy/GLOBAL_PARAMETERS.SCALE);
					if (this.spilloffContainer != null && !this.spilloffContainer.skin.overflowing)
					{
						this.spilloffContainer.skin.fillWithVolume(liquid_dy/GLOBAL_PARAMETERS.SCALE*this.beaker_width_px/GLOBAL_PARAMETERS.SCALE*this.beaker_depth_px/GLOBAL_PARAMETERS.SCALE);
					} else
					{
						g = this.puddleGraphics;
						this.puddle_width += liquid_dy;
						g.clear();
						g.beginFill(this.liquid.fill_color);
						g.drawRect(this.spout_point.x, this.spout_point.y, Math.min(2, this.puddle_width), this.height_px - this.beaker_bottom_dy - this.height_from_depth/2 - this.spout_point.y);
						g.endFill();
						g.beginFill(this.liquid.fill_color);
						g.drawEllipse(this.spout_point.x - 10*this.puddle_width*Math.cos(GLOBAL_PARAMETERS.view_topAngle), this.height_px - this.beaker_bottom_dy - this.height_from_depth/2 - Math.min(this.height_from_depth, 20*this.puddle_width*Math.sin(GLOBAL_PARAMETERS.view_topAngle))/2, 20*this.puddle_width*Math.cos(GLOBAL_PARAMETERS.view_topAngle), Math.min(this.height_from_depth, 20*this.puddle_width*Math.sin(GLOBAL_PARAMETERS.view_topAngle)));
						g.endFill();
					}
				} else
				{  // we are done
					liquid_dy = this.min_liquid_y - this.liquid_y;
					this.liquid_volume = this.volume_under_spout;
					this.controller.ChangeOffset(-liquid_dy/GLOBAL_PARAMETERS.SCALE);
					if (this.spilloffContainer != null )
					{
						if (!this.spilloffContainer.skin.overflowing)
						{
							this.spilloffContainer.skin.fillWithVolume(liquid_dy/GLOBAL_PARAMETERS.SCALE*this.beaker_width_px/GLOBAL_PARAMETERS.SCALE*this.beaker_depth_px/GLOBAL_PARAMETERS.SCALE);
						}
						var wp = this.spilloffContainer.body.GetPosition();
						this.spilloffContainer.constructFixtures();
						this.createActorsBody(this.spilloffContainer);
						this.spilloffContainer.body.SetPosition(wp);
					} else
					{
						g = this.puddleGraphics;
						this.puddle_width += liquid_dy;
						g.clear();
						g.beginFill(this.liquid.fill_color);
						g.drawEllipse(this.spout_point.x - 10*this.puddle_width*Math.cos(GLOBAL_PARAMETERS.view_topAngle), this.height_px - this.beaker_bottom_dy - this.height_from_depth/2 - Math.min(this.height_from_depth, 20*this.puddle_width*Math.sin(GLOBAL_PARAMETERS.view_topAngle))/2, 20*this.puddle_width*Math.cos(GLOBAL_PARAMETERS.view_topAngle), Math.min(this.height_from_depth, 20*this.puddle_width*Math.sin(GLOBAL_PARAMETERS.view_topAngle)));
						g.endFill();
					}
					
					this.draining = false;	
					// remove release button
					if (this.release_button_drawn)
					{
						this.release_button_drawn = false;
						this.removeChild($('#release-button')[0]);
						$('#release-button').remove();	
					}		
				}
				
			}
		}


		var a = new b2Vec2(); a.Set(this.beakerLeftWall.GetWorldCenter().x + this.BEAKER_WALL_THICKNESS / 2 / GLOBAL_PARAMETERS.SCALE, this.beakerFloor.GetWorldCenter().y + ( -this.beaker_height_px + this.liquid_y) / GLOBAL_PARAMETERS.SCALE);
		for(var i = 0; i < this.actors.length; i++)
		{

			// update b2
			this.actors[i].update();
			
			var body = this.actors[i].body;
			
			// did we get fully submerged?
			if (this.ALLOW_FILL_INTERIOR)
			{
				if (body.GetPosition().y > a.y)
				{
					if (!body.soaked)
					{
						// change density of each fixture to include mass of liquid
						for (f = body.GetFixtureList(); f; f = f.GetNext())
						{
							f.SetDensity(f.materialDensity * f.materialSpaces + (f.interiorSpaces) * this.liquid_density);
						}
						body.soaked = true; // A permanent flag if the object is ever fully submerged
					}
					body.ResetMassData();
					body.fullySubmerged = true;	
				}
			}
		}	

		// convert the buoyant controller's offset to pixels
		this.liquid_y = -this.controller.offset * GLOBAL_PARAMETERS.SCALE - this.world_dy - this.height_px + this.beaker_bottom_dy + this.beaker_height_px;
		if (!this.refill_button_drawn && this.liquid_y > (this.init_liquid_y+0.01)) this.drawRefillButton();
		if (!this.release_button_drawn && this.spilloff_volume_perc < 1.0 && (this.beaker_height_px - this.liquid_y) - this.spilloff_volume_perc * this.beaker_height_px > 0.01 ) this.drawReleaseButton();

		this.b2world.Step(1/Ticker.getFPS(), 10, 10);
		this.redraw();
		if (GLOBAL_PARAMETERS.DEBUG) this.b2world.DrawDebugData();
		//console.log(this, this.getNumChildren());
		this.b2world.ClearForces();
	}

	p.redraw = function ()
	{
		// draw liquid
		var g = this.backWaterGraphics;
		g.clear();
		g.beginFill(this.liquid_color);
		//g.beginLinearGradientFill(["rgba(100,100,255,0.3)", "rgba(150,150,255,0.3)","rgba(200,200,255,0.3)", "rgba(150,150,255,0.3)", "rgba(100,100,255,0.3)"], [0, 0.1, 0.5, 0.9, 1], -this.beaker_width_px/2, 0, this.beaker_width_px/2, 0);
		g.drawRect(-this.beaker_width_px/2, this.liquid_y, this.beaker_width_px, this.beaker_height_px  - this.liquid_y);
		g.endFill();
		//g.beginLinearGradientFill(["rgba(100,100,255,0.3)", "rgba(150,150,255,0.3)","rgba(200,200,255,0.3)", "rgba(150,150,255,0.3)", "rgba(100,100,255,0.3)"], [0, 0.1, 0.5, 0.9, 1], -this.beaker_width_px/2-this.width_from_depth, 0, -this.beaker_width_px/2, 0);
		g.beginFill(this.liquid_color);
		g.moveTo(-this.beaker_width_px/2, this.liquid_y);
		g.lineTo(-this.beaker_width_px/2-this.width_from_depth, this.liquid_y + this.height_from_depth);
		g.lineTo(-this.beaker_width_px/2-this.width_from_depth, this.beaker_height_px + this.height_from_depth);
		g.lineTo(-this.beaker_width_px/2, this.beaker_height_px);
		g.endFill();
		

		var g = this.frontWaterGraphics;
		g.clear();
		//g.beginLinearGradientFill(["rgba(100,100,255,0.4)", "rgba(150,150,255,0.4)","rgba(200,200,255,0.4)", "rgba(150,150,255,0.4)", "rgba(100,100,255,0.4)"], [0, 0.1, 0.5, 0.9, 1], -this.beaker_width_px/2, 0, this.beaker_width_px/2, 0);
		g.beginFill(this.liquid_color);
		g.drawRect(-this.beaker_width_px/2, this.liquid_y, this.beaker_width_px, this.beaker_height_px - this.liquid_y);
		g.endFill();
		//g.beginLinearGradientFill(["rgba(100,100,255,0.5)", "rgba(150,150,255,0.5)","rgba(175,175,255,0.5)", "rgba(175,175,255,0.5)", "rgba(100,100,255,0.5)"], [0, 0.1, 0.5, 0.9, 1], this.beaker_width_px/2, 0, this.beaker_width_px/2+this.width_from_depth, 0);
		g.beginFill(this.liquid_color);
		g.moveTo(this.beaker_width_px/2, this.liquid_y);
		g.lineTo(this.beaker_width_px/2+this.width_from_depth, this.liquid_y - this.height_from_depth);
		g.lineTo(this.beaker_width_px/2+this.width_from_depth, this.beaker_height_px- this.height_from_depth);
		g.lineTo(this.beaker_width_px/2, this.beaker_height_px);
		g.endFill();
		//this.backWaterLineShape.x = 0;
		this.backWaterLineShape.y = -this.height_from_depth + this.height_px - this.beaker_bottom_dy  - this.beaker_height_px + this.liquid_y;
		this.frontWaterLineShape.y = this.height_px - this.beaker_bottom_dy  - this.beaker_height_px + this.liquid_y;

		// draw a pointer to the current position 
		//this.pointerShape.x = this.beaker_width_px/2+2;
		this.pointerShape.y = this.frontWaterLineShape.y;
		this.pointerText.text = Math.round( (this.beaker_height_px - this.liquid_y) / GLOBAL_PARAMETERS.SCALE * 100) / 100;
		
		this.pointerText.y = this.pointerShape.y + 5;
	}
	
	
	window.Beakerb2World = Beakerb2World;
}(window));