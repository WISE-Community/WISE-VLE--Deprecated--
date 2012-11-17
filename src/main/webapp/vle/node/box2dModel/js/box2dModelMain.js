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
        var GLOBAL_PARAMETERS =
        {
       		"DEBUG" : true,
	       	"INCLUDE_BUILDER": true,
			"INCLUDE_BALANCE": true,
			"INCLUDE_BEAKER": true,
			"SCALE" : 20,
	        "PADDING" : 10,
	        "STAGE_WIDTH" : 810,
			"STAGE_HEIGHT" : 680,
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
		
		function init(wiseData)
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
				start();
			}
		}

		function start()
		{
			canvas = document.getElementById("canvas");
			stage = new Stage(canvas);
			stage.mouseEventsEnabled = true;
			stage.enableMouseOver();
			stage.needs_to_update = true;
				
			// setup builder
			if (GLOBAL_PARAMETERS.INCLUDE_BUILDER)
			{
				builder = new ObjectBuildingPanel(GLOBAL_PARAMETERS.STAGE_WIDTH, 200);
				stage.addChild(builder);
				
				var htmlText, htmlElement;
				// jquery ui
				if ($("#make-object").length == 0){
				 	htmlText = '<input type="submit" id="make-object" value="Create"/>';

			        //htmlElement = $( "input[id='make-object']" )
			        $("#builder-button-holder").append(htmlText);
			        $("#make-object")
			            .button()
			            .click(function( event ) {
			                event.preventDefault();
			                createObjectFromBuilder();
			            }).hide();  
			

				    htmlText = '<div id="slider-topAngle" style="height: 100px;"></div>';
				   //$( "#slider-topAngle" )
					$("#builder-button-holder").append(htmlText);
					$("#slider-topAngle")
					    .slider({
		                   orientation: "vertical",
		                   range: "min",
		                   min: 0,
		                   max: 90,
		                   value: 20,
		                   step: 10,
		                   slide: function( event, ui ) {
		                       $( "#amount" ).val( ui.value );
		                       builder.update_view_topAngle(ui.value);
		                   }
		               }).hide();
				     $("#slider-topAngle").load(function (){$( "#amount" ).val( $( "#slider-topAngle" ).slider( "value" ) );});

					 htmlText = '<div id="slider-sideAngle" style="width: 100px;"></div>';
				   //$( "#slider-topAngle" )
					$("#builder-button-holder").append(htmlText);
					$("#slider-sideAngle")
					    .slider({
					       orientation: "horizontal",	
		                   range: "min",
		                   min: 0,
		                   max: 90,
		                   value: 10,
		                   step: 10,
		                   slide: function( event, ui ) {
		                       $( "#amount" ).val( ui.value );
		                       builder.update_view_sideAngle(ui.value);
		                   }
		               }).hide();
				       $("#slider-sideAngle").load(function (){$( "#amount" ).val( $( "#slider-sideAngle" ).slider( "value" ) );});
		
			

					// setup buttons for volume viewer	
					var element = new DOMElement($("#make-object")[0]);
					stage.addChild(element);
					element.x = builder.x + builder.width_px / 2 + 2 * GLOBAL_PARAMETERS.PADDING;
					element.y = builder.y  + GLOBAL_PARAMETERS.PADDING * 2;

					element = new DOMElement($("#slider-sideAngle")[0]);
					stage.addChild(element);
					element.x = builder.x + builder.width_px / 2 + (builder.width_px / 2 - 100) / 2 ;
					element.y = builder.y + builder.height_px - 2 * GLOBAL_PARAMETERS.PADDING;
					
					element = new DOMElement($("#slider-topAngle")[0]);
					stage.addChild(element);
					element.x = builder.x + builder.width_px - 4 * GLOBAL_PARAMETERS.PADDING;
					element.y = builder.y + 4 * GLOBAL_PARAMETERS.PADDING;
					$("#make-object").show();
					$("#slider-sideAngle").show();
					$("#slider-topAngle").show();
				}

			}
			var tester_y;
			if (GLOBAL_PARAMETERS.INCLUDE_BUILDER)
			{
				tester_y = builder.height_px;	
			} else
			{
				tester_y = GLOBAL_PARAMETERS.PADDING;	
			}
			tester = new ObjectTestingPanel(GLOBAL_PARAMETERS.STAGE_WIDTH, GLOBAL_PARAMETERS.STAGE_HEIGHT-tester_y);
			stage.addChild(tester);
			tester.y = tester_y;

			
			// make all objects given in parameters
			for (var i = 0; i < GLOBAL_PARAMETERS.premades_available.length; i++)
			{
				if (typeof GLOBAL_PARAMETERS.premades[GLOBAL_PARAMETERS.premades_available[i]] != "undefined")
					createObject(GLOBAL_PARAMETERS.premades[GLOBAL_PARAMETERS.premades_available[i]]);
			}
			GLOBAL_PARAMETERS.num_initial_objects = GLOBAL_PARAMETERS.premades_available.length;

			// get maximum number of library objects, create computational inputs for each
			GLOBAL_PARAMETERS.MAX_OBJECTS_IN_LIBRARY = tester.library.MAX_OBJECTS_IN_LIBRARY;
					

			Ticker.setFPS(24);
			Ticker.addListener(window);
		}

		function tick() 
		{ 
			tester._tick();
			if (stage.needs_to_update)
			{
				stage.update();
			}
		}

		// BUTTON INTERACTION 
		function createObjectFromBuilder() 
		{
			if (builder.validObject())
			{
				var savedObject = builder.saveObject();
				
				// save to global parameters
				if(GLOBAL_PARAMETERS.DEBUG) console.log(JSON.stringify(savedObject));
				createObject(savedObject);
			} else 
			{
				console.log("no object to make");
			}
		}

		function createObject(savedObject, already_in_globals)
		{
			var compShape;
			if (savedObject.is_container)
			{
				compShape = new ContainerCompShape(GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, savedObject);
			} else
			{
				compShape = new BlockCompShape(GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, savedObject);
			}
			savedObject.id = GLOBAL_PARAMETERS.total_objects_made;
			tester.createObjectForLibrary(compShape);
			GLOBAL_PARAMETERS.total_objects_made++;
			if (typeof already_in_globals === "undefined" || !already_in_globals)
				GLOBAL_PARAMETERS.objectLibrary.push(savedObject);	

			eventManager.fire("make-model", [savedObject]);
		}






