(function (window)
{

	function Cylinderb2Actor (skin)
	{
		this.initialize (skin);
	}

	var p = Cylinderb2Actor.prototype = new createjs.Container();
	// public properties
	p.mouseEventsEnabled = true;
	p.Container_initialize = p.initialize;
	p.Container_tick = p._tick;


	p.initialize = function (skin)
	{
		this.Container_initialize();
		this.skin = skin;
		this.is_container = this.skin.is_container;

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
		bodyDef.angularDamping = 0.5;
		bodyDef.position.x = 0;
		bodyDef.position.y = 0;
		bodyDef.userData = {"actor":this}
		
		this.viewing_rotation = 0;

		this.constructFixtures();
		
	}
	p.constructFixtures = function ()
	{
		var i;
		var skin = this.skin;
		// go from bottom up.
		this.fixDefs = [];
		for (i= 0; i < skin.array2d.length; i++)
		{
			if (skin.array2d[i].mass > 0)
			{
				var fixDef = new b2FixtureDef;
				fixDef.x_index = 0;
				fixDef.y_index = i;
				fixDef.area = skin.array2d[i].area;
				fixDef.density = skin.array2d[i].mass/skin.array2d[i].area;
				fixDef.friction = 0.5;
				fixDef.restitution = 0.2;
				fixDef.filter.categoryBits = 1;
				fixDef.filter.maskBits = 3;
				var vec = new b2Vec2();
				vec.Set (skin.diameter_units/2, skin.array2d[i].y_offset + skin.array2d[i].height/2)
				fixDef.shape = new b2PolygonShape;
				fixDef.shape.SetAsOrientedBox(skin.array2d[i].width/2, skin.array2d[i].height/2, vec, 0.0);
				// we need information about how many open spaces are in this fixture
				fixDef.totalSpaces = skin.array2d[i].totalSpaces;
				fixDef.materialSpaces = skin.array2d[i].materialSpaces;
				fixDef.exteriorSpaces = skin.array2d[i].exteriorSpaces;
				fixDef.interiorSpaces = skin.array2d[i].interiorSpaces;
				fixDef.protectedSpaces = skin.array2d[i].protectedSpaces;
				fixDef.materialDensity = skin.array2d[i].mass / skin.array2d[i].materialSpaces;
				this.fixDefs.push(fixDef);	
			}	
		}
	}
	
	/** Update skin to reflect position of b2 body on screen */
	p.update = function ()
	{
		if (this.body != null && typeof(this.body) != "undefined" && typeof(this.parent) != "undefined" && this.parent != null)
		{
			this.x = (this.body.GetPosition().x) * GLOBAL_PARAMETERS.SCALE - this.parent.x;
			this.y = (this.body.GetPosition().y) * GLOBAL_PARAMETERS.SCALE - this.parent.y;
			this.rotation = this.body.GetAngle() * (180 / Math.PI);

			if (Math.abs (this.viewing_rotation - this.rotation) > 10 || (typeof this.body.percentSubmergedChangedFlag != "undefined" && this.body.percentSubmergedChangedFlag))
			{
				this.viewing_rotation = Math.round(this.rotation/10) * 10;
				this.skin.redraw(this.viewing_rotation, this.body.percentSubmerged2d);
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
	
	
	window.Cylinderb2Actor = Cylinderb2Actor;
}(window));
