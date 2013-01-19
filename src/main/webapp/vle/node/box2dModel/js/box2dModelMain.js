var   b2Vec2 = Box2D.Common.Math.b2Vec2
        , b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2Fixture = Box2D.Dynamics.b2Fixture
        , b2World = Box2D.Dynamics.b2World
        , b2MassData = Box2D.Collision.Shapes.b2MassData
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
        , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
        , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
        , b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
        , b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef
        , b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef
        , b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef
        , b2ContactListener = Box2D.Dynamics.b2ContactListener
        , b2BuoyancyController = Box2D.Dynamics.Controllers.b2BuoyancyController;
        ;

          // GLOBAL VARIABLES, with default values
        var b2m;
        var GLOBAL_PARAMETERS =
        {
       		"DEBUG" : true,
	       	"INCLUDE_BUILDER": true,
	       	"INCLUDE_CYLINDER_BUILDER":false,
  			"INCLUDE_RECTPRISM_BUILDER":false,
			"INCLUDE_BALANCE": false,
			"INCLUDE_SCALE": true,
			"INCLUDE_BEAKER": true,
			"SCALE" : 20,
	        "PADDING" : 10,
	        "STAGE_WIDTH" : 810,
			"STAGE_HEIGHT" : 730,
			"PADDING" : 8,
			"view_sideAngle" : 10*Math.PI/180,
			"view_topAngle" : 20*Math.PI/180,
			"liquid_volume_perc" : 0.50,
			"fill_spilloff_by_height": true,
			"spilloff_volume_perc" : 0.50,
			"total_objects_made" : 0,
			"materials_available":[],
			"materials": {},
			"premades_available":[],
			"premades":{},
			"objectLibrary":[],
			"MAX_OBJECTS_IN_LIBRARY":100,
			"feedbackEvents":[],
			"ModelDataDescription":
			{
				"DataSeriesDescription":[],
				"ComputationalInputs":
				[
					{"label":"object1-id", "units":"", "min":0, "max":1000},
					{"label":"object1-location", "units":"", "min":"", "max":""},
					{"label":"object1-mass", "units":"g", "min":0, "max":100000},
					{"label":"object1-volume", "units":"cm^3", "min":0, "max":100000},
					{"label":"object1-material-volume", "units":"cm^3", "min":0, "max":100000},
					{"label":"object1-interior-volume", "units":"cm^3", "min":0, "max":100000},
					{"label":"object1-liquid-volume", "units":"cm^3", "min":0, "max":100000},
					{"label":"object1-liquid-perc-filled", "units":"%", "min":0, "max":1},
					{"label":"object2-id", "units":"", "min":0, "max":1000},
					{"label":"object2-location", "units":"", "min":"", "max":""},
					{"label":"object2-mass", "units":"g", "min":0, "max":100000},
					{"label":"object2-volume", "units":"cm^3", "min":0, "max":100000},
					{"label":"object2-material-volume", "units":"cm^3", "min":0, "max":100000},
					{"label":"object2-interior-volume", "units":"cm^3", "min":0, "max":100000},
					{"label":"object2-liquid-volume", "units":"cm^3", "min":0, "max":100000},
					{"label":"object2-liquid-perc-filled", "units":"%", "min":0, "max":1}
				],
				"ComputationalOutputs":
				[
					{"label":"balance-state", "units":"", "min":-1, "max":1},
					{"label":"balance-mass-difference", "units":"g", "min":-1000, "max":1000},
					{"label":"beaker-liquid-height", "units":"cm", "min":0, "max":100},
					{"label":"beaker-liquid-volume", "units":"cm^3", "min":0, "max":10000},
					{"label":"spilloff-liquid-volume", "units":"cm^3", "min":0, "max":10000},
					{"label":"spilloff-perc-filled", "units":"%", "min":0, "max":1}
				],
			}
        }	
		
		// GLOBAL OBJECTS			
		var canvas;
		var stage;
		var builder;
		var tester;
		
		function init(wiseData, makePremades)
		{
			if (typeof wiseData === "undefined")
			{
				// load parameters file to overwrite defaults
				$(document).ready( function (){
					$.getJSON('box2dModelTemplate.b2m', function(data) {
						for (var key in data)
						{
							GLOBAL_PARAMETERS[key] = data[key];
						}
						if (typeof GLOBAL_PARAMETERS.view_sideAngle_degrees != "undefined") GLOBAL_PARAMETERS.view_sideAngle = GLOBAL_PARAMETERS.view_sideAngle_degrees * Math.PI / 180;
						if (typeof GLOBAL_PARAMETERS.view_topAngle_degrees != "undefined") GLOBAL_PARAMETERS.view_topAngle = GLOBAL_PARAMETERS.view_topAngle_degrees * Math.PI / 180;
						GLOBAL_PARAMETERS.MATERIAL_COUNT = GLOBAL_PARAMETERS.materials_available.length;
						start();
					});     
				});
			} else
			{
				// load from WISE
				for (var key in wiseData)
				{
					GLOBAL_PARAMETERS[key] = wiseData[key];
				}
				if (typeof GLOBAL_PARAMETERS.view_sideAngle_degrees != "undefined") GLOBAL_PARAMETERS.view_sideAngle = GLOBAL_PARAMETERS.view_sideAngle_degrees * Math.PI / 180;
				if (typeof GLOBAL_PARAMETERS.view_topAngle_degrees != "undefined") GLOBAL_PARAMETERS.view_topAngle = GLOBAL_PARAMETERS.view_topAngle_degrees * Math.PI / 180;
				GLOBAL_PARAMETERS.MATERIAL_COUNT = GLOBAL_PARAMETERS.materials_available.length;
				start(typeof makePremades=="undefined"? true:makePremades);
			}	
		}

		function start(makePremades)
		{
			canvas = document.getElementById("canvas");
			stage = new createjs.Stage(canvas);
			stage.mouseEventsEnabled = true;
			stage.enableMouseOver();
			stage.needs_to_update = true;
				
			// setup builder
			var tester_y;
			if (GLOBAL_PARAMETERS.INCLUDE_BUILDER)
			{
				builder = new BlockCompBuildingPanel(GLOBAL_PARAMETERS.STAGE_WIDTH, 250);
				stage.addChild(builder);
				tester_y = builder.height_px + 20;	
			} else if (GLOBAL_PARAMETERS.INCLUDE_CYLINDER_BUILDER){
				builder = new CylinderBuildingPanel(GLOBAL_PARAMETERS.STAGE_WIDTH, 250);
				stage.addChild(builder);
				tester_y = builder.height_px + 20;	
			}else if (GLOBAL_PARAMETERS.INCLUDE_RECTPRISM_BUILDER){
				builder = new RectPrismBuildingPanel(GLOBAL_PARAMETERS.STAGE_WIDTH, 250);
				stage.addChild(builder);
				tester_y = builder.height_px + 20;	
			} else
			{
				tester_y = GLOBAL_PARAMETERS.PADDING;	
			}
			tester = new ObjectTestingPanel(GLOBAL_PARAMETERS.STAGE_WIDTH, GLOBAL_PARAMETERS.STAGE_HEIGHT-tester_y);
			stage.addChild(tester);
			tester.y = tester_y;

			var premade = GLOBAL_PARAMETERS.premades['1x1x1_DWood'];
			
			// make all objects given in parameters
			if (makePremades){
				for (var i = 0; i < GLOBAL_PARAMETERS.premades_available.length; i++)
				{
					var obj = GLOBAL_PARAMETERS.premades_available[i];
					if (typeof obj == "object" && obj.length != "undefined" && obj.length > 0){
						// is an array, pick one of array, replace original
						GLOBAL_PARAMETERS.premades_available[i] = obj[Math.floor(Math.random()*obj.length)];
						if (typeof GLOBAL_PARAMETERS.premades[GLOBAL_PARAMETERS.premades_available[i]] != "undefined"){
							createObject(GLOBAL_PARAMETERS.premades[GLOBAL_PARAMETERS.premades_available[i]]);
						}
					} else if (typeof obj == "string" && typeof GLOBAL_PARAMETERS.premades[obj] != "undefined"){
						createObject(GLOBAL_PARAMETERS.premades[obj]);
					}						
				}
			}
			GLOBAL_PARAMETERS.num_initial_objects = GLOBAL_PARAMETERS.premades_available.length;

			// get maximum number of library objects, create computational inputs for each
			GLOBAL_PARAMETERS.MAX_OBJECTS_IN_LIBRARY = tester.library.MAX_OBJECTS_IN_LIBRARY;


			createjs.Ticker.setFPS(24);
			createjs.Ticker.addListener(window);
		}

		function tick() 
		{ 

			if (tester != null) tester._tick();
			if (stage != null && stage.needs_to_update)
			{
				stage.update();
			}
		}

		

		function createObject(savedObject, already_in_globals)
		{
			var compShape;
			if (typeof savedObject.blockArray3d != "undefined"){
				if (savedObject.is_container){
					compShape = new ContainerCompShape(GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, savedObject);
				} else{
					compShape = new BlockCompShape(GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, savedObject);
				} 
			} else if (typeof savedObject.cylinderArrays != "undefined"){
				compShape = new CylinderCompShape(GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, savedObject);
			} else if (typeof savedObject.rectPrismArrays != "undefined"){
				compShape = new RectPrismCompShape(GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, savedObject);
			}
			
			savedObject.id = GLOBAL_PARAMETERS.total_objects_made;
			if (tester.createObjectForLibrary(compShape)){
				GLOBAL_PARAMETERS.total_objects_made++;
				if (typeof already_in_globals === "undefined" || !already_in_globals)
					GLOBAL_PARAMETERS.objectLibrary.push(savedObject);	
				eventManager.fire("make-model", [savedObject]);
			} else {} // too mancy shapes already			
		}






