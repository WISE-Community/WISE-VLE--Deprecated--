(function (window)
{
	/** A space for displaying the names of materials, clickable/draggable materials
	and a grid space for putting them together */
	function ObjectBuildingPanel (width_px, height_px)
	{
		this.initialize(width_px, height_px);
	}
	var p = ObjectBuildingPanel.prototype = new Container();
	p.Container_initialize = ObjectBuildingPanel.prototype.initialize;
	p.Container_tick = p._tick;
	p.BACKGROUND_COLOR = "rgba(225,225,255,1.0)";
	p.TEXT_COLOR = "rgba(0, 0, 200, 1.0)";

	
	p.initialize = function(width_px, height_px)
	{
		this.Container_initialize();
		this.width_px = width_px;
		this.height_px = height_px;
		this.view_sideAngle = GLOBAL_PARAMETERS.view_sideAngle;
		this.view_topAngle = GLOBAL_PARAMETERS.view_topAngle;
		
		//background
		this.g = new Graphics();
		this.shape = new Shape(this.g);
		this.addChild(this.shape);

		// the list of material names
		this.materialsMenu = new MaterialsMenu(this.width_px/8, this.height_px);
		this.addChild(this.materialsMenu);
		
		this.vv = new VolumeViewer(GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.MAX_WIDTH_UNITS, GLOBAL_PARAMETERS.MAX_HEIGHT_UNITS, GLOBAL_PARAMETERS.MAX_DEPTH_UNITS);
		this.addChild(this.vv);
		this.vv.x = this.width_px * 3 / 4;
		this.vv.y = this.height_px / 2 - GLOBAL_PARAMETERS.PADDING;
		
		this.block_space_width = this.width_px/2 - this.materialsMenu.x - this.materialsMenu.width_px;
		this.block_space_height = this.height_px; 

		this.g.beginFill("rgba(225,225,255,1.0)");
		this.g.drawRect(0, 0, this.width_px, this.height_px);
		this.g.endFill();
		// draw something under the volume viewer
		this.g.setStrokeStyle(1);
		this.g.beginStroke("rgba(180,180,180,1.0)");
		this.g.beginFill("rgba(220,220,220,1.0)");
		this.g.drawRect(this.width_px / 2, GLOBAL_PARAMETERS.PADDING, this.width_px / 2 - GLOBAL_PARAMETERS.PADDING, this.height_px - 2 * GLOBAL_PARAMETERS.PADDING);
		this.g.endFill();
		this.g.endStroke();

		// a set of text to display the number of blocks that can be used
		this.blockTexts = [];
		var current_material_block_count = GLOBAL_PARAMETERS.materials[this.materialsMenu.current_material_name].block_max.length;
		for (i = 0; i < current_material_block_count; i++)
		{
			var text = new TextContainer("0", "20px Arial", this.BACKGROUND_COLOR, this.block_space_width / current_material_block_count, GLOBAL_PARAMETERS.SCALE, this.TEXT_COLOR, this.TEXT_COLOR, 0, "right", "center", -4, 0);
			text.x = this.materialsMenu.x + this.materialsMenu.width_px + i * this.block_space_width / current_material_block_count;
			text.y = GLOBAL_PARAMETERS.PADDING;
			this.addChild(text);
			this.blockTexts.push(text);
		}

		this.blocks = [];
		this.drawMaterial(this.materialsMenu.current_material_name);

		this.enabled = true;
		stage.ready_to_update = true;
	}

	/** Disable is primarilly to be used when the library is full */
	p.disableWithText = function (str){
		if (this.enabled){
			var g = new Graphics();
			this.screen = new Shape(this.g);
			this.addChild(this.screen);
			g.beginFill("rgba(255,255,255,0.5)");
			g.drawRect(0, 0, this.width_px, this.height_px);
			g.endFill();
			
			this.screenText = new Text(str, "20px Arial", "#444");
			this.screenText.x = (this.width_px - str.length*10)/2;
			this.screenText.y = (this.height_px - 20)/2;
			this.addChild(this.screenText);
			this.enabled = false;

		}
		
	}

	/** Reverses disableWithText function */
	p.enable = function (){
		if (!this.enabled){
			this.removeChild(this.screen);
			this.removeChild(this.screenText);
			this.enabled = true;
		}
	}

	////////////////////// CLASS SPECIFIC ////////////////////
	p.update_view_sideAngle = function (degrees)
	{
		this.view_sideAngle = degrees * Math.PI / 180;
		for (var i = 0; i < this.blocks.length; i++) 
		{
			if (this.blocks[i] != null) this.blocks[i].update_view_sideAngle(this.view_sideAngle);
		}
		this.vv.update_view_sideAngle(this.view_sideAngle);
	}

	p.update_view_topAngle = function (degrees)
	{
		this.view_topAngle = degrees * Math.PI / 180;
		for (var i = 0; i < this.blocks.length; i++) 
		{
			if (this.blocks[i] != null) this.blocks[i].update_view_topAngle(this.view_topAngle);
		}
		this.vv.update_view_topAngle(this.view_topAngle);
	}

	p.buttonClickHandler  = function(material_name)
	{
		this.drawMaterial(material_name);
	}

	p.drawMaterial = function (material_name)
	{
		var o, i;
		// if blocks array is not empty remove these from display
		if (this.blocks.length != 0)
		{
			for (i = 0; i < this.blocks.length; i++)
			{
				this.removeChild(this.blocks[i])
			}
			this.blocks = new Array();
		}
		for (i = 0; i < GLOBAL_PARAMETERS.materials[material_name].depth_arrays.length; i++)
		{
			o = this.newBlock(material_name, i);
			this.placeBlock(o, i);			
		}
		this.updateCountText(material_name);
		stage.ready_to_update = true;
	}
	p.newBlock = function (material_name, i)
	{
		if (GLOBAL_PARAMETERS.materials[material_name].block_count[i] < GLOBAL_PARAMETERS.materials[material_name].block_max[i])
		{
			var o = new RectBlockShape(GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE, GLOBAL_PARAMETERS.SCALE,GLOBAL_PARAMETERS.materials[material_name].depth_arrays[i], this.view_sideAngle, this.view_topAngle, material_name, GLOBAL_PARAMETERS.materials[material_name]);
			this.blocks[i] = o;
			o.onPress = this.blockPressHandler.bind(this);
			this.addChild(o);
			o.orig_parent = this;
			o.depth_array_index = i;
			this.updateCountText(material_name);
			return o;
		} else
		{
			this.blocks[i] = null;
			this.updateCountText(material_name);
			return null;
		}
	}
	// WORKING WITH OBJECTS
	p.placeBlock = function (o, i)
	{
		if (o != null)
		{	
			var material_block_count = GLOBAL_PARAMETERS.materials[o.material_name].block_max.length;
			o.x = this.materialsMenu.width_px + i * this.width_px/3/material_block_count + (o.width_px);
			o.y = i * this.height_px/2/material_block_count + 2 * GLOBAL_PARAMETERS.PADDING + 20;	
		}
	}
	p.updateCountText = function (material_name)
	{
		// update count
		for (i = 0; i < GLOBAL_PARAMETERS.materials[material_name].block_max.length; i++)
		{
			this.blockTexts[i].setText(GLOBAL_PARAMETERS.materials[material_name].block_max[i] - GLOBAL_PARAMETERS.materials[material_name].block_count[i]);
		}
	}
	/** When a block is pressed it should either be in the display area or on the volume viewer.
		In the case of the volume viewer there are special rules that allow or do not allow it to be removed.
	*/
	p.blockPressHandler = function (evt)
	{
		var offset = evt.target.globalToLocal(evt.stageX, evt.stageY);
		var source_parent = evt.target.parent;		
		
		if (source_parent instanceof VolumeViewer)
		{ // if this object is in the volume viewer remove it and place on this 	
			if (source_parent.clearBlock(evt.target)){
				this.addChild(evt.target);
				source_parent.placeBlock(evt.target);	
			} else {
				return;
			}			
		} else
		{ 
			var i = source_parent.blocks.indexOf(evt.target);
			source_parent.addChild(evt.target);
		}

		evt.onMouseMove = function (ev)
		{
			var parent = this.target.parent;
			var lpoint, newX, newY;
			lpoint = parent.globalToLocal(ev.stageX-offset.x, ev.stageY-offset.y);
			newX = lpoint.x;
			newY = lpoint.y;
			// place within bounds of this object
			if (parent instanceof ObjectBuildingPanel)
			{
				if (newX < 0){this.target.x = 0;
				} else if (newX > parent.width_px){ this.target.x = parent.width_px;
				} else { this.target.x = newX;
				}

				if (newY < 0){this.target.y = 0;
				} else if (newY > parent.height_py){this.target.y = parent.height_py;
				} else {this.target.y = newY;
				} 

				parent.vv.placeBlock(this.target);
			} else if (parent instanceof VolumeViewer)	
			{
				this.target.x = newX;
				this.target.y = newY;
				parent.placeBlock(this.target);
			}
			stage.needs_to_update = true;
		}
		evt.onMouseUp = function (ev)
		{
			var parent = this.target.parent;
			var o = this.target; 
			if (parent instanceof ObjectBuildingPanel)
			{
				// the source matters
				if (source_parent instanceof VolumeViewer)
				{
					// if this object is on the volume viewer, and already been replaced, then remove it from display
					GLOBAL_PARAMETERS.materials[o.material_name].block_count[o.depth_array_index]--;
					o.orig_parent.updateCountText(o.material_name);
					// if there is already an object in this spot we don't need to add a new one
					if (parent.blocks[o.depth_array_index] == null)
					{	
						//parent.addChild(o);
						parent.placeBlock(o, o.depth_array_index);
					} else
					{
						parent.removeChild(o);
					}
				} else if (source_parent instanceof ObjectBuildingPanel)
				{
					// place object back
					source_parent.placeBlock(o, o.depth_array_index);
				}
			} else if (parent instanceof VolumeViewer)	
			{
				if (source_parent instanceof VolumeViewer)
				{
					// move within volume viewer, is this move valid?
					if (parent.setBlock(o))
					{
						// yes, do nothing no change
					} else
					{
						// no, we need to add this object back to the ObjectBuildingPanel
						GLOBAL_PARAMETERS.materials[o.material_name].block_count[o.depth_array_index]++;
						var no = o.orig_parent.newBlock(o.material_name, o.depth_array_index);
						o.orig_parent.placeBlock(no, o.depth_array_index);
					}
				} else if (source_parent instanceof ObjectBuildingPanel)
				{
					// move from outside to inside of volume viewer
					// is the move valid
					if (parent.setBlock(o))
					{
						// yes, update count and create a new object
						var i = o.orig_parent.blocks.indexOf(o);
						if (i >= 0)
						{
							GLOBAL_PARAMETERS.materials[o.material_name].block_count[i]++;
							o.orig_parent.updateCountText(o.material_name);
							var no = o.orig_parent.newBlock(o.material_name, i);
							o.orig_parent.placeBlock(no, i);
						}
					} else
					{
						// not valid move, place back in ObjectBuildingPanel area
						o.redraw();
						o.orig_parent.addChild(o);
						o.orig_parent.placeBlock(o, o.depth_array_index);
					}
					
				}
			}		
		}
	}

	p.validObject = function ()
	{
		return (this.vv.getNumChildren() > 3);
	}

	/** This function is used to end the creation of a specific block */
	p.saveObject = function()
	{
		// go through the 2d array of volume viewer and replace objects with their depth arrays
		var savedObject = {};
		var blockArray3d = [];
		var blockArray2d = this.vv.blockArray2d;
		var i_rev, i, j, k, block_count=0;
		var is_container = true;

		for (i = 0; i < blockArray2d.length; i++)
		{
			i_rev = blockArray2d.length - 1 - i;
			blockArray3d[i_rev] = new Array();
			for (j = 0; j < blockArray2d[i].length; j++)
			{
				if (blockArray2d[i][j] != null)
				{
					blockArray3d[i_rev][j] = new Array();
					for (k = 0; k < blockArray2d[i][j].depth_array.length; k++)
					{
						if (blockArray2d[i][j].depth_array[k] == 1)
						{
							blockArray3d[i_rev][j][k] = blockArray2d[i][j].material_name;
							if (!GLOBAL_PARAMETERS.materials[blockArray2d[i][j].material_name].is_container) is_container = false;
						} else 
						{
							blockArray3d[i_rev][j][k] = "";
						}
					}
					block_count++;
				} else
				{
					blockArray3d[i_rev][j] = ["", "", "", "", ""];
				}
			}
		}
		savedObject.blockArray3d = blockArray3d;
		savedObject.is_container = is_container;
		// some other parameters of the object we'll fill in later, when the object is put together
		savedObject.max_height = 0;
		savedObject.max_width = 0;
		savedObject.max_depth = 0;
		savedObject.mass = 0;
		savedObject.volume = 0;
		savedObject.density = 0;
		savedObject.material_volume = 0;
		savedObject.interior_volume = 0;
		savedObject.liquid_mass = 0;
		savedObject.liquid_volume = 0;
		savedObject.liquid_perc_volume = 0;


		// clean up
		// reset counts of blocks, remove object on screen
		for (var key in GLOBAL_PARAMETERS.materials)
		{
			for (i = 0; i < GLOBAL_PARAMETERS.materials[key].block_max.length; i++)
			{
				GLOBAL_PARAMETERS.materials[key].block_count[i] = 0;
			}
		}
		this.drawMaterial(this.materialsMenu.current_material_name);

		this.vv.clearBlocks();
		//console.log(blockArray3d);
		return savedObject;
	}

	p._tick = function(){this.Container_tick();}

	p.redraw = function(){stage.ready_to_update = true;}

	

	window.ObjectBuildingPanel = ObjectBuildingPanel;
}(window));
