		var b2Vec2 = Box2D.Common.Math.b2Vec2
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
	       	"INCLUDE_BUILDER": false,
	       	"INCLUDE_CYLINDER_BUILDER":false,
  			"INCLUDE_RECTPRISM_BUILDER":false,
  			"INCLUDE_LIBRARY":true,
  			"ALLOW_REVISION":true,
  			"SHOW_VALUES_SLIDER_BUILDER":true,
			"INCREMENT_UNITS_SLIDER_BUILDER":true,
  			"INCLUDE_EMPTY": false,
			"INCLUDE_BALANCE": false,
			"INCLUDE_SCALE": true,
			"INCLUDE_BEAKER": true,
			"SCALE" : 25,
	        "PADDING" : 10,
	        "view_sideAngle" : 10*Math.PI/180,
			"view_topAngle" : 20*Math.PI/180,
			"liquid_volume_perc" : 0.50,
			"total_objects_made" : 0,
			"total_objects_made_in_world" : 0,
			"total_beakers_made" : 0,
			"total_scales_made" : 0,
			"total_balances_made" : 0,
			"materials_available":[],
			"materials": {},
			"premades_available":[],
			"premades_in_world":[],
			"beakers_in_world":[],
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
		var builder = null;
		var labWorld;
		
		function init(wiseData, makePremades, forceDensityValue){
			var key;
			$(document).ready( function (){
				GLOBAL_PARAMETERS.STAGE_WIDTH = $("#canvas").width();
				GLOBAL_PARAMETERS.LAB_HEIGHT = $("#canvas").height();
				// load from WISE
				if (typeof wiseData !== "undefined"){
					for (var key in wiseData){ GLOBAL_PARAMETERS[key] = wiseData[key];}	
				} else {
					$.getJSON('box2dModelTemplate.b2m', function(data) {
						for (var key in data) { GLOBAL_PARAMETERS[key] = data[key]; }
					});
				}
				// can't manually change stage height, only lab height
				GLOBAL_PARAMETERS.STAGE_HEIGHT = $("#canvas").height();
				
				if (GLOBAL_PARAMETERS.INCLUDE_BUILDER || GLOBAL_PARAMETERS.INCLUDE_RECTPRISM_BUILDER || GLOBAL_PARAMETERS.INCLUDE_CYLINDER_BUILDER){
					 GLOBAL_PARAMETERS.BUILDER_HEIGHT = GLOBAL_PARAMETERS.SCALE * 3 * 5;
				} else {
					 GLOBAL_PARAMETERS.BUILDER_HEIGHT = 0;
				}
				GLOBAL_PARAMETERS.STAGE_HEIGHT = GLOBAL_PARAMETERS.BUILDER_HEIGHT + GLOBAL_PARAMETERS.STAGE_HEIGHT;

				// did we change size?
				if (GLOBAL_PARAMETERS.STAGE_WIDTH != $("#canvas").width()) $("#canvas").attr('width',GLOBAL_PARAMETERS.STAGE_WIDTH);	
				if (GLOBAL_PARAMETERS.STAGE_HEIGHT != $("#canvas").height()) $("#canvas").attr('height',GLOBAL_PARAMETERS.STAGE_HEIGHT);	
				
				// are wed debugging if so, append a debug canvase
				if (GLOBAL_PARAMETERS.DEBUG){
					$("#canvas-holder").append('<canvas width='+GLOBAL_PARAMETERS.STAGE_WIDTH+' height='+GLOBAL_PARAMETERS.STAGE_HEIGHT+' id="debugcanvas" ></canvas>');
				}

				if (typeof GLOBAL_PARAMETERS.view_sideAngle_degrees != "undefined") GLOBAL_PARAMETERS.view_sideAngle = GLOBAL_PARAMETERS.view_sideAngle_degrees * Math.PI / 180;
				if (typeof GLOBAL_PARAMETERS.view_topAngle_degrees != "undefined") GLOBAL_PARAMETERS.view_topAngle = GLOBAL_PARAMETERS.view_topAngle_degrees * Math.PI / 180;
				GLOBAL_PARAMETERS.MATERIAL_COUNT = GLOBAL_PARAMETERS.materials_available.length;
				
				GLOBAL_PARAMETERS.TESTER_HEIGHT = GLOBAL_PARAMETERS.STAGE_HEIGHT - GLOBAL_PARAMETERS.BUILDER_HEIGHT;
				GLOBAL_PARAMETERS.ALLOW_REVISION = GLOBAL_PARAMETERS.INCLUDE_BUILDER || GLOBAL_PARAMETERS.INCLUDE_CYLINDER_BUILDER || GLOBAL_PARAMETERS.INCLUDE_RECTPRISM_BUILDER ? GLOBAL_PARAMETERS.ALLOW_REVISION : false; 
				GLOBAL_PARAMETERS.INCLUDE_LIBRARY = !GLOBAL_PARAMETERS.INCLUDE_BUILDER && !GLOBAL_PARAMETERS.INCLUDE_CYLINDER_BUILDER && !GLOBAL_PARAMETERS.INCLUDE_RECTPRISM_BUILDER ? GLOBAL_PARAMETERS.INCLUDE_LIBRARY : true; 
				if (typeof forceDensityValue != "undefined" && forceDensityValue > 0){
					for (var key in GLOBAL_PARAMETERS.materials){
						GLOBAL_PARAMETERS.materials[key].density = forceDensityValue;
					}
				}
				if(typeof GLOBAL_PARAMETERS.materials["Pyrex"] === "undefined"){
					GLOBAL_PARAMETERS.materials["Pyrex"] = 
					{
						"display_name":"Pyrex",
						"density":2.21,
						"fill_colors":["rgba(127,127,127,0.4)", "rgba(200,200,200,0.4)","rgba(225,225,255,0.4)", "rgba(200,200,200,0.4)", "rgba(127,127,127,0.4)"],
						"fill_ratios":[0, 0.1, 0.4, 0.9, 1],
						"fill_colors_shadow":["rgba(127,127,127,0.4)", "rgba(200,200,200,0.4)","rgba(225,225,255,0.4)", "rgba(200,200,200,0.4)", "rgba(127,127,127,0.4)"],
						"fill_ratios_shadow":[0, 0.1, 0.4, 0.9, 1],
						"stroke_colors":["rgba(56,56,56,0.4)", "rgba(56,56,56,0.4)"],
						"stroke_ratios":[0, 1],
						"depth_arrays":[[1, 1, 1, 1, 1], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0]],
						"block_max":[10, 10, 10],
						"block_count":[0, 0, 0],
						"is_container":true,
						"container_thickness":1				
					};	
				}
				if (GLOBAL_PARAMETERS.beakers_in_world.length > 0 || GLOBAL_PARAMETERS.INCLUDE_BEAKER){
					GLOBAL_PARAMETERS.INCLUDE_BEAKER = true;
					if (GLOBAL_PARAMETERS.beakers_in_world.length == 0){
						var beaker_in_world = {
							"x":5,
							"y":0,
							"material":"Pyrex",
							"liquid":"Water",
							"width":5,
							"height":8,
							"depth":5,
							"init_liquid_volume_perc":0.75,
							"spilloff_volume_perc": 0,
							"type": "dynamic"
						};
						GLOBAL_PARAMETERS.beakers_in_world.push(beaker_in_world);
					}
				}
				start();
			});
		}

		function start(){
			canvas = document.getElementById("canvas");
			stage = new createjs.Stage(canvas);
			stage.mouseEventsEnabled = true;
			stage.enableMouseOver();
			createjs.Touch.enable(stage);
			stage.needs_to_update = true;
				
			// setup builder
			var labWorld_y;
			var wall_width_units = 0.3;
			if (GLOBAL_PARAMETERS.INCLUDE_BUILDER)
			{
				builder = new BlockCompBuildingPanel(GLOBAL_PARAMETERS.STAGE_WIDTH, GLOBAL_PARAMETERS.BUILDER_HEIGHT, wall_width_units*GLOBAL_PARAMETERS.SCALE);
				labWorld_y = builder.height_px;	
			} else if (GLOBAL_PARAMETERS.INCLUDE_CYLINDER_BUILDER){
				builder = new CylinderBuildingPanel(GLOBAL_PARAMETERS.STAGE_WIDTH, GLOBAL_PARAMETERS.BUILDER_HEIGHT, wall_width_units*GLOBAL_PARAMETERS.SCALE);
				labWorld_y = builder.height_px;	
			}else if (GLOBAL_PARAMETERS.INCLUDE_RECTPRISM_BUILDER){
				builder = new RectPrismBuildingPanel(GLOBAL_PARAMETERS.STAGE_WIDTH, GLOBAL_PARAMETERS.BUILDER_HEIGHT, wall_width_units*GLOBAL_PARAMETERS.SCALE);
				labWorld_y = builder.height_px;	
			} else
			{
				labWorld_y = 0;	
			}
			var world_width_units = GLOBAL_PARAMETERS.STAGE_WIDTH / GLOBAL_PARAMETERS.SCALE;
			var world_height_units = GLOBAL_PARAMETERS.TESTER_HEIGHT / GLOBAL_PARAMETERS.SCALE
			var labWorld = this.labWorld = new Labb2World(world_width_units , world_height_units , 7, wall_width_units, 0, labWorld_y / GLOBAL_PARAMETERS.SCALE) ;
			stage.addChild(labWorld);
			labWorld.y = labWorld_y;
			if (builder != null) stage.addChild(builder);

			// make scale or balance
			if (GLOBAL_PARAMETERS.INCLUDE_SCALE) {
				labWorld.createScaleInWorld(world_width_units * 2/3, 0, 5, "dynamic");
			} else if (GLOBAL_PARAMETERS.INCLUDE_BALANCE) {
				labWorld.createBalanceInWorld(world_width_units * 2/3, 0, 10, 5, "dynamic");
			}	
			// make beakers
			for (var i = 0; i < GLOBAL_PARAMETERS.beakers_in_world.length; i++){
				var premade = GLOBAL_PARAMETERS.beakers_in_world[i];
				var px = typeof premade.x != "undefined" ? premade.x : 0;
				var py = typeof premade.y != "undefined" ? premade.y : 0; 
				var ptype = typeof premade.type != "undefined" ? premade.type : "dynamic"; 
				labWorld.createBeakerInWorld(premade, px, py, ptype);
			}

			// make premades in world
			if (GLOBAL_PARAMETERS.premades_available.length > 0){
				for (var i = 0; i < GLOBAL_PARAMETERS.premades_available.length; i++){
					var premade_in_world = {};
					premade_in_world.premade = GLOBAL_PARAMETERS.premades_available[i];
					premade_in_world.x = 0;
					premade_in_world.y = -1;
					GLOBAL_PARAMETERS.premades_in_world.push(premade_in_world);
				}		
			}
			
			for (i = 0; i < GLOBAL_PARAMETERS.premades_in_world.length; i++){
				var premade = GLOBAL_PARAMETERS.premades_in_world[i];
				if(typeof premade.premade !== "undefined" && GLOBAL_PARAMETERS.premades[premade.premade] !== "undefined"){
					var px = typeof premade.x !== "undefined" ? premade.x : 0;
					var py = typeof premade.y !== "undefined" ? premade.y : -1; 
					var protation = typeof premade.rotation !== "undefined" ? premade.rotation : 0; 
					var ptype = typeof premade.type !== "undefined" ? premade.type : "dynamic"; 
					labWorld.createObjectInWorld(GLOBAL_PARAMETERS.premades[premade.premade], px, py, protation, ptype);
				} 
			}

			createjs.Ticker.setFPS(24);
			createjs.Ticker.addListener(window);
		}


		function tick() { 

			if (labWorld != null) labWorld._tick();
			if (stage != null && stage.needs_to_update)
			{
				stage.update();
			}
		}





