(function (window)
{

	function Liquidb2Actor (skin)
	{
		this.initialize (skin);
	}

	var p = Liquidb2Actor.prototype = new Container();
	// public properties
	p.mouseEventsEnabled = true;
	p.Container_initialize = p.initialize;
	p.Container_tick = p._tick;


	p.initialize = function (skin)
	{
		this.Container_initialize();
		this.skin = skin;

		this.addChild(this.skin);
		this.width_px_left = skin.width_px_left;
		this.width_px_right = skin.width_px_right;
		this.height_px_above = skin.height_px_above;
		this.height_px_below = skin.height_px_below;

		this.world = null;
		this.body = null;
		// create an array of Fixture Definitions and Body Definitions and put them in relative space from each other
		this.fixDefs = new Array();
		
		var bodyDef = this.bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.angularDamping = 0.9;
		bodyDef.position.x = 0;
		bodyDef.position.y = 0;
		bodyDef.userData = {"actor":this}
		bodyDef.IsFixedRotation = true;

		this.viewing_rotation = 0;

		this.constructFixtures();
		
	}
	p.constructFixtures = function ()
	{
		var i, j;
		var skin = this.skin;
		// go from bottom up.
		for (j = 0; j < skin.array2d[0].length; j++)
		{
			for (i = 0; i < skin.array2d.length; i++)
			{
				if (skin.array2d[i][j].mass > 0)
				{
					var fixDef = new b2FixtureDef;
					fixDef.density = skin.array2d[i][j].mass*1;
					fixDef.friction = 0.5;
					fixDef.restitution = 0.0;
					fixDef.filter.categoryBits = 1;
					fixDef.filter.maskBits = 3;
					var vec = new b2Vec2();
					vec.Set (((i+0.5)*skin.unit_width_px)/GLOBAL_PARAMETERS.SCALE, ((-j-1+0.5)*skin.unit_width_px)/GLOBAL_PARAMETERS.SCALE);
					fixDef.shape = new b2PolygonShape;
					fixDef.shape.SetAsOrientedBox(skin.unit_width_px/2/GLOBAL_PARAMETERS.SCALE, (skin.unit_height_px/2/GLOBAL_PARAMETERS.SCALE), vec, 0.0);
					// we need information about how many open spaces are in this fixture
					fixDef.totalSpaces = skin.array2d[i][j].totalSpaces;
					fixDef.materialSpaces = skin.array2d[i][j].materialSpaces;
					fixDef.exteriorSpaces = skin.array2d[i][j].exteriorSpaces;
					fixDef.materialDensity = (skin.array2d[i][j].mass / skin.unit_volume) / skin.array2d[i][j].materialSpaces;
					this.fixDefs.push(fixDef);	
				}						
			}
		}
	}
	
	p.update = function ()
	{
		if (this.body != null && typeof(this.body) != "undefined" && typeof(this.parent) != "undefined" && this.parent != null)
		{
			this.x = (this.body.GetPosition().x) * GLOBAL_PARAMETERS.SCALE  - this.parent.x;
			this.y = (this.body.GetPosition().y ) * GLOBAL_PARAMETERS.SCALE - this.parent.y;
			this.rotation = this.body.GetAngle() * (180 / Math.PI);
			if (Math.abs (this.viewing_rotation - this.rotation) > 10)
			{
				this.viewing_rotation = Math.round(this.rotation/10) * 10;
				this.skin.redraw(this.viewing_rotation);
			}
		} else
		{
			this.viewing_rotation = 0;
			this.skin.redraw();
		}
	}
	/** Tick function called on every step, if update, redraw */
	p._tick = function ()
	{
		this.Container_tick();
	}
	
	
	window.Liquidb2Actor = Liquidb2Actor;
}(window));
