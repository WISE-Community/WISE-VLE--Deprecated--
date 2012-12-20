(function (window)
{

	function Emptyb2World (width_px, height_px, world_dx, world_dy, SCALE)
	{
		this.initialize (width_px, height_px, world_dx, world_dy, SCALE);
	}

	var p = Emptyb2World.prototype = new createjs.Container();
	// public properties
	p.mouseEventsEnabled = true;
	p.Container_initialize = p.initialize;
	p.Container_tick = p._tick;


	p.initialize = function (width_px, height_px, world_dx, world_dy, SCALE)
	{
		this.Container_initialize();
		this.width_px = width_px;
		this.height_px = height_px;
		this.world_dx = world_dx;
		this.world_dy = world_dy;
		this.SCALE = SCALE;

		var g = this.g = new createjs.Graphics();
		this.shape = new createjs.Shape(g);
		this.addChild(this.shape);

		g.beginFill("rgba(200, 200, 255, 1.0)");
		//g.drawRect(-this.width_px/2, -this.height_px/2, this.width_px, this.height_px);
		g.drawRect(0, 0, this.width_px, this.height_px);
		g.endFill();
		//draw floor
		g.beginFill("rgba(200, 200, 150, 1.0)");
		//g.drawRect(-this.width_px/2, this.height_px/2-10, this.width_px, 10);
		g.drawRect(0, this.height_px-100, this.width_px, 100);
		g.endFill();

		this.b2world = new b2World(new b2Vec2(0, 10), true);
		var floorFixture = new b2FixtureDef;
		floorFixture.density = 1;
		floorFixture.restitution = 0.2;
		floorFixture.shape = new b2PolygonShape;
		floorFixture.shape.SetAsBox(this.width_px / 2 / this.SCALE, 10 / 2 / this.SCALE);
		var floorBodyDef = new b2BodyDef;
		floorBodyDef.type = b2Body.b2_staticBody;
		floorBodyDef.position.x = (this.world_dx + (this.width_px) / 2 ) / this.SCALE;
		floorBodyDef.position.y = (this.world_dy + this.height_px - ( 10 ) / 2 ) / this.SCALE;
		var floor = this.b2world.CreateBody(floorBodyDef);
		floor.CreateFixture(floorFixture);

		if (DEBUG)
		{
			var debugDraw = this.debugDraw = new b2DebugDraw;
			debugDraw.SetSprite(document.getElementById("debugcanvas").getContext("2d"));
			debugDraw.SetDrawScale(this.SCALE);
			debugDraw.SetFillAlpha(1.0);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			this.b2world.SetDebugDraw(debugDraw);
		}

		this.actors = new Array();
	}
	/** Tick function called on every step, if update, redraw */
	p._tick = function ()
	{
		this.Container_tick();
		var i;
		for(i = 0; i < this.actors.length; i++)
		{
			this.actors[i].update();
		}
		this.b2world.Step(1/Ticker.getFPS(), 10, 10);
		if (DEBUG) this.b2world.DrawDebugData();
	}
	
	
	window.Emptyb2World = Emptyb2World;
}(window));
