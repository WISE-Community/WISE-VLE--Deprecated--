(function (window)
{

	var RectLiquidShape = function(unit_width_px, unit_height_px, unit_depth_px, width_units, height_units, depth_units, useCompleteDepth, useCompleteWidth)
	{
		this.initialize(unit_width_px, unit_height_px, unit_depth_px, width_units, height_units, depth_units, useCompleteDepth, useCompleteWidth);
	}
	var p = RectLiquidShape.prototype = new Container();
	
	// public properties
	p.mouseEventsEnabled = true;
	p.Container_initialize = p.initialize;
	p.Container_tick = p._tick;

	/**
	*	This liquid shape can either use a material_name to space out each cube or not.  Separator width defines the size of this spacing between cubes.
	*   If separators are used they can either appear in complete rows (on depth dimension) or full width x depth.
	*/	
	p.initialize = function(unit_width_px, unit_height_px, unit_depth_px, width_units, height_units, depth_units, useCompleteDepth, useCompleteWidth)
	{
		this.Container_initialize();

		this.liquid_unit_width_px = unit_width_px;
		this.liquid_unit_height_px = unit_height_px;
		this.liquid_unit_depth_px = unit_depth_px;
		this.width_units = width_units;
		this.depth_units = depth_units;
		this.height_units = height_units;
		// separation separates the cubes of liquid from each other, zero means that the liquid is adjacent
		this.separation_rgba_fill = "rgba(255,255,255,1.0)";
		this.separation_rgba_stroke = "rgba(155,155,155,1.0)";
		this.unit_width_px = unit_width_px + 2*GLOBAL_PARAMETERS.separation_width;
		this.unit_height_px = unit_height_px + 1*GLOBAL_PARAMETERS.separation_width;
		this.unit_depth_px = unit_depth_px + 2*GLOBAL_PARAMETERS.separation_width;
		
		if (typeof(useCompleteDepth) == "undefined"){ this.useCompleteDepth = false;} else {this.useCompleteDepth = useCompleteDepth;} 
		if (typeof(useCompleteWidth) == "undefined"){ this.useCompleteWidth = false;} else {this.useCompleteWidth = useCompleteWidth;}

		var g = this.g = new Graphics();
		this.shape = new Shape(g);
		this.addChild(this.shape);

		this.unit_volume = this.unit_width_px/GLOBAL_PARAMETERS.SCALE * this.unit_depth_px/GLOBAL_PARAMETERS.SCALE * this.unit_height_px/GLOBAL_PARAMETERS.SCALE;
		this.liquid_unit_volume = this.liquid_unit_width_px/GLOBAL_PARAMETERS.SCALE * this.liquid_unit_depth_px/GLOBAL_PARAMETERS.SCALE * this.liquid_unit_height_px/GLOBAL_PARAMETERS.SCALE;

		this.x_index = 0;
		this.y_index = 0;
		if (this.fillDepthFromMiddle) {this.z_index = Math.floor(this.depth_units/2);}
		else {this.z_index = this.depth_units-1;}

		this.max_x_index = 0;
		this.max_y_index = 0;

		this.height_px_above = 0;
		this.height_px_below = 0;
		this.width_px_left = 0;
		this.width_px_right = 0;

		this.fillDepthFromMiddle = false;

		this.volumeArray3d = []
		for (var i = 0; i < width_units; i++)
		{
			this.volumeArray3d[i] = [];
			for (var j = 0; j < height_units; j++)
			{
				this.volumeArray3d[i][j] = [];
				for (var k = 0; k < depth_units; k++)
				{
					this.volumeArray3d[i][j][k] = 0;
				}
			}
		}

		// this array summarizes what happens along the objects depth, calculates a total mass for use with b2
		this.array2d = [];
		for (i = 0; i < width_units; i++)
		{
			this.array2d[i] = [];
			for (j = 0; j < height_units; j++)
			{
				this.array2d[i][j] = {"mass":0, "totalSpaces":0, "materialSpaces":0, "exteriorSpaces":0}
			}
		}	
	}

	/** Fill the unit cube with the current index with the given volume, if filled move to the next */
	p.fillWithVolume = function (volume)
	{
		var volume_distributed = 0;
		var volume_remaining = volume;
		var cur_liquid_unit_volume = this.volumeArray3d[this.x_index][this.y_index][this.z_index];
		var go_to_next = false;

		while (volume_distributed < volume)
		{

			if (cur_liquid_unit_volume < this.liquid_unit_volume)
			{
				var liquid_unit_volume_remaining = this.liquid_unit_volume - cur_liquid_unit_volume;
				if (volume_remaining <= liquid_unit_volume_remaining)
				{
					this.volumeArray3d[this.x_index][this.y_index][this.z_index] += volume_remaining;
					volume_distributed = volume;
					volume_remaining = 0;
				} else
				{
					this.volumeArray3d[this.x_index][this.y_index][this.z_index] = this.liquid_unit_volume;
					volume_distributed += liquid_unit_volume_remaining;
					volume_remaining -= liquid_unit_volume_remaining;
					go_to_next = true;
				}
			} else
			{	// already filled
				go_to_next = true;
			}

			if (go_to_next && volume_remaining > 0.0001)
			{
				// rules for next index, start in middle of depth, iterate from front to back until furthest back unit is filled, then move to right, once plane is done move up
				if (this.z_index > 0)
				{
					if (this.fillDepthFromMiddle)
					{
						var dist_from_middle = this.z_index - Math.floor(this.depth_units/2);
						if (dist_from_middle <= 0)
						{
							this.z_index = Math.floor(this.depth_units/2) + Math.abs(dist_from_middle) + 1;
						} else
						{
							this.z_index = Math.floor(this.depth_units/2) - dist_from_middle;
						}
					} else
					{
						this.z_index--;
					}
				} else 
				{
					if (this.x_index < this.width_units - 1)
					{
						if (this.fillDepthFromMiddle) {this.z_index = Math.floor(this.depth_units/2);}
						else {this.z_index = this.depth_units-1;}
						this.x_index++;
						if (this.x_index > this.max_x_index)
						{
							this.max_x_index = this.x_index;
						}

					} else
					{
						if (this.z_index < this.height_units -1)
						{
							if (this.fillDepthFromMiddle) {this.z_index = Math.floor(this.depth_units/2);}
							else {this.z_index = this.depth_units-1;}
							this.x_index = 0;
							this.y_index++;
							if (this.y_index > this.max_y_index)
							{
								this.max_y_index = this.y_index;
							}
						} else
						{
							this.redraw();
							return;
						}
					}
				}

				cur_liquid_unit_volume = 0;
				go_to_next = false;
			}
		}
		// calculate height above, below, left, and right of (0,0)
		this.width_px_left = 0;	
		this.width_px_right = (this.max_x_index + 1) *(this.unit_width_px);
		this.height_px_below = 0;
		this.height_px_above = (this.max_y_index + 1) *(this.unit_height_px);
		this.update_array2d();
		this.redraw();
	}

	p.update_array2d = function()
	{
		for (var i = 0; i < this.width_units; i++)
		{
			for (var j = 0; j < this.height_units; j++)
			{
				var mass = 0;
				var materialSpaces = 0;
				for (var k = 0; k < this.depth_units; k++)
				{
					if (this.volumeArray3d[i][j][k] > 0)
					{
						materialSpaces ++;
						mass += this.volumeArray3d[i][j][k] * GLOBAL_PARAMETERS.fluid_density;
						// add in mass for separators, left, right, front, back, below
						mass += 2 * (this.liquid_unit_width_px+GLOBAL_PARAMETERS.separation_width)/GLOBAL_PARAMETERS.SCALE * (this.liquid_unit_height_px)/GLOBAL_PARAMETERS.SCALE * GLOBAL_PARAMETERS.separation_width/GLOBAL_PARAMETERS.SCALE * GLOBAL_PARAMETERS.separation_density;
						mass += 2 * (this.liquid_unit_depth_px+GLOBAL_PARAMETERS.separation_width)/GLOBAL_PARAMETERS.SCALE * (this.liquid_unit_height_px)/GLOBAL_PARAMETERS.SCALE * GLOBAL_PARAMETERS.separation_width/GLOBAL_PARAMETERS.SCALE * GLOBAL_PARAMETERS.separation_density;
						mass += (this.liquid_unit_width_px+2*GLOBAL_PARAMETERS.separation_width)/GLOBAL_PARAMETERS.SCALE * (this.liquid_unit_depth_px+2*GLOBAL_PARAMETERS.separation_width)/GLOBAL_PARAMETERS.SCALE * GLOBAL_PARAMETERS.separation_width/GLOBAL_PARAMETERS.SCALE * GLOBAL_PARAMETERS.separation_density;
						
					}
				}
				this.array2d[i][j].mass = mass;
				this.array2d[i][j].totalSpaces = this.depth_units;
				this.array2d[i][j].materialSpaces = materialSpaces;
				this.array2d[i][j].exteriorSpaces = this.depth_units - materialSpaces;
			}
		}	
	}

	/** Draw only filled cubes, from bottom to top, back to front, bottom to top */
	p.redraw = function (r)
	{
		var rotation;
		if (typeof(r) != "undefined") {rotation = r} else {rotation = 0}
		rotation = (rotation + 360 * 10) % 360;
		var view_sideAngle = GLOBAL_PARAMETERS.view_sideAngle * Math.cos(rotation * Math.PI / 180) - GLOBAL_PARAMETERS.view_topAngle * Math.sin(rotation * Math.PI / 180);
		var view_topAngle = GLOBAL_PARAMETERS.view_topAngle * Math.cos(rotation * Math.PI / 180) +  GLOBAL_PARAMETERS.view_sideAngle * Math.sin(rotation * Math.PI / 180);
		
		var btr_x, btr_y, btl_x, btl_y, bb_r, ftr_x, ftr_y, ftl_x, ftl_y, fbr_x, fbr_y, fbl_x, fbl_y;
		
		var g = this.g;
		g.clear();
		// unlike other object this is constructed so 0 y-index is at bottom
		for (var k = this.depth_units-1; k >= 0; k--)
		{
			for (var i = 0; i < this.width_units; i++)
			{
				for (var j = 0; j < this.height_units; j ++)
				{
					//if (this.volumeArray3d[i][j][k] == 0) console.log("for x index", i, "compare", j, "to", this.max_y_index, (this.useCompleteWidth && j <= this.max_y_index));
					if (this.volumeArray3d[i][j][k] > 0 || ((this.useCompleteDepth && i <= this.max_x_index && j <= this.max_y_index) || (this.useCompleteWidth && j <= this.max_y_index)))
					{
						fbl_x = i*(this.unit_width_px) + GLOBAL_PARAMETERS.separation_width + k * this.unit_depth_px * Math.sin(view_sideAngle);
						fbl_y = -j*this.unit_height_px - GLOBAL_PARAMETERS.separation_width - k * this.unit_depth_px * Math.sin(view_topAngle);
						bbl_x = fbl_x + this.liquid_unit_depth_px*Math.sin(view_sideAngle);
						bbl_y = fbl_y - this.liquid_unit_depth_px*Math.sin(view_topAngle);

						fbr_x = fbl_x + this.liquid_unit_width_px;
						fbr_y = fbl_y;
						bbr_x = fbr_x + this.liquid_unit_depth_px*Math.sin(view_sideAngle);
						bbr_y = fbr_y - this.liquid_unit_depth_px*Math.sin(view_topAngle);
						
						ftl_x = fbl_x;
						ftl_y = fbl_y - this.liquid_unit_height_px*this.volumeArray3d[i][j][k]/this.liquid_unit_volume;
						btl_x = ftl_x + this.liquid_unit_depth_px*Math.sin(view_sideAngle);
						btl_y = ftl_y - this.liquid_unit_depth_px*Math.sin(view_topAngle);

						ftr_x = ftl_x + this.liquid_unit_width_px;
						ftr_y = ftl_y;
						btr_x = ftr_x + this.liquid_unit_depth_px*Math.sin(view_sideAngle);
						btr_y = ftr_y - this.liquid_unit_depth_px*Math.sin(view_topAngle);

						// for the material_names of liquid		
						c_fbl_x = i*(this.unit_width_px) + k * this.unit_depth_px * Math.sin(view_sideAngle);
						c_fbl_y = -j*this.unit_height_px - k * this.unit_depth_px * Math.sin(view_topAngle);
						c_ftl_x = c_fbl_x;
						c_ftl_y = c_fbl_y - this.unit_height_px;


						c_ftr_x = c_ftl_x + this.unit_width_px;
						c_ftr_y = c_ftl_y;
						c_fbr_x = c_ftr_x;
						c_fbr_y = c_ftr_y + this.unit_height_px;

						c_btl_x = c_ftl_x + this.unit_depth_px*Math.sin(view_sideAngle);
						c_btl_y = c_ftl_y - this.unit_depth_px*Math.sin(view_topAngle);
						c_bbl_x = c_btl_x;
						c_bbl_y = c_btl_y + this.unit_height_px;

						c_btr_x = c_btl_x + this.unit_width_px;
						c_btr_y = c_btl_y;
						c_bbr_x = c_btr_x;
						c_bbr_y = c_btr_y + this.unit_height_px;	

						
						if (view_topAngle < 0)
						{
							// draw bottom							
							g.setStrokeStyle(1);
							g.beginStroke(GLOBAL_PARAMETERS.fluid_stroke_color);
							g.beginFill(GLOBAL_PARAMETERS.fluid_color);
							g.moveTo(bbr_x, bbr_y);
							g.lineTo(bbl_x, bbl_y);
							g.lineTo(fbl_x, fbl_y);
							g.lineTo(fbr_x, fbr_y);
							g.lineTo(bbr_x, bbr_y);
							g.endStroke();
							g.endFill();

							if (GLOBAL_PARAMETERS.separation_width > 0)
							{
								g.setStrokeStyle(1);
								g.beginStroke(this.separation_rgba_stroke);
								g.beginFill(this.separation_rgba_fill);
								g.moveTo(c_bbr_x, c_bbr_y);
								g.lineTo(c_bbl_x, c_bbl_y);
								g.lineTo(c_fbl_x, c_fbl_y);
								g.lineTo(c_fbr_x, c_fbr_y);
								g.lineTo(c_bbr_x, c_bbr_y);							
								g.endFill();
								g.endStroke();
							}		
						} else
						{
							// draw top
							
							g.setStrokeStyle(1);
							g.beginStroke(GLOBAL_PARAMETERS.fluid_stroke_color);
							g.beginFill(GLOBAL_PARAMETERS.fluid_color);
							g.moveTo(btr_x, btr_y);
							g.lineTo(btl_x, btl_y);
							g.lineTo(ftl_x, ftl_y);
							g.lineTo(ftr_x, ftr_y);
							g.lineTo(btr_x, btr_y);
							g.endStroke();
							g.endFill();
							
							if (GLOBAL_PARAMETERS.separation_width > 0)
							{
								// draw top of material_name in four trapezoids
								g.setStrokeStyle(1);
								g.beginStroke(this.separation_rgba_stroke);
								g.beginFill(this.separation_rgba_fill);
								g.moveTo(c_btr_x, c_btr_y);
								g.lineTo(btr_x, btr_y);
								g.lineTo(btl_x, btl_y);
								g.lineTo(c_btl_x, c_btl_y);
								g.lineTo(c_btr_x, c_btr_y);
								
								g.moveTo(c_ftr_x, c_ftr_y);
								g.lineTo(ftr_x, ftr_y);
								g.lineTo(btr_x, btr_y);
								g.lineTo(c_btr_x, c_btr_y);
								g.lineTo(c_ftr_x, c_ftr_y);

								g.moveTo(c_ftl_x, c_ftl_y);
								g.lineTo(ftl_x, ftl_y);
								g.lineTo(ftr_x, ftr_y);
								g.lineTo(c_ftr_x, c_ftr_y);
								g.lineTo(c_ftl_x, c_ftl_y);

								g.moveTo(c_btl_x, c_btl_y);
								g.lineTo(btl_x, btl_y);
								g.lineTo(ftl_x, ftl_y);
								g.lineTo(c_ftl_x, c_ftl_y);
								g.lineTo(c_btl_x, c_btl_y);
							}							
						}
						
						if (view_sideAngle < 0)
						{
							// draw left
							g.setStrokeStyle(1);
							g.beginStroke(GLOBAL_PARAMETERS.fluid_stroke_color);
							g.beginFill(GLOBAL_PARAMETERS.fluid_color);
							g.moveTo(btl_x, btl_y);
							g.lineTo(ftl_x, ftl_y);
							g.lineTo(fbl_x, fbl_y);
							g.lineTo(bbl_x, bbl_y);
							g.lineTo(btl_x, btl_y);
							g.endStroke();
							g.endFill();

							if (GLOBAL_PARAMETERS.separation_width > 0)
							{
								g.setStrokeStyle(1);
								g.beginStroke(this.separation_rgba_stroke);
								g.beginFill(this.separation_rgba_fill);
								g.moveTo(c_btl_x, c_btl_y);
								g.lineTo(c_ftl_x, c_ftl_y);
								g.lineTo(c_fbl_x, c_fbl_y);
								g.lineTo(c_bbl_x, c_bbl_y);
								g.lineTo(c_btl_x, c_btl_y);
								g.endFill();
							}
							
						}

						else 
						{
							// draw right
							g.setStrokeStyle(1);
							g.beginStroke(GLOBAL_PARAMETERS.fluid_stroke_color);
							g.beginFill(GLOBAL_PARAMETERS.fluid_color);
							g.moveTo(btr_x, btr_y);
							g.lineTo(ftr_x, ftr_y);
							g.lineTo(fbr_x, fbr_y);
							g.lineTo(bbr_x, bbr_y);
							g.lineTo(btr_x, btr_y);
							g.endFill();
							g.endStroke();
							
							if (GLOBAL_PARAMETERS.separation_width > 0)
							{
								g.setStrokeStyle(1);
								g.beginStroke(this.separation_rgba_stroke);
								g.beginFill(this.separation_rgba_fill);
								g.moveTo(c_btr_x, c_btr_y);
								g.lineTo(c_ftr_x, c_ftr_y);
								g.lineTo(c_fbr_x, c_fbr_y);
								g.lineTo(c_bbr_x, c_bbr_y);
								g.lineTo(c_btr_x, c_btr_y);
								g.endFill();
								g.endStroke();
							}
							
						}
						
						
							
						if (view_sideAngle < 0 )
						{
							// draw back, but only if next block's volume is less than this
								if (GLOBAL_PARAMETERS.separation_width > 0 || k == this.depth_units - 1 || this.volumeArray3d[i][j][k+1] <= this.volumeArray3d[i][j][k])
								{
								// draw back
								g.setStrokeStyle(1);
								g.beginStroke(GLOBAL_PARAMETERS.fluid_stroke_color);
								g.beginFill(GLOBAL_PARAMETERS.fluid_color);
								g.moveTo(btr_x, btr_y);
								g.lineTo(btl_x, btl_y);
								g.lineTo(bbl_x, bbl_y);
								g.lineTo(bbr_x, bbr_y);
								g.lineTo(btr_x, btr_y);
								g.endFill();

								if (GLOBAL_PARAMETERS.separation_width > 0)
								{
									g.setStrokeStyle(1);
									g.beginStroke(this.separation_rgba_stroke);
									g.beginFill(this.separation_rgba_fill);
									g.moveTo(c_btr_x, c_btr_y);
									g.lineTo(c_btl_x, c_btl_y);
									g.lineTo(c_bbl_x, c_bbl_y);
									g.lineTo(c_bbr_x, c_bbr_y);
									g.lineTo(c_btr_x, c_btr_y);
									g.endFill();
									g.endStroke();
								}
							}	
						
						} else if (view_sideAngle >= 0)
						{
							// draw back, but only if next block's volume is less than this
							
							if (GLOBAL_PARAMETERS.separation_width > 0 || k == 0 || this.volumeArray3d[i][j][k-1] <= this.volumeArray3d[i][j][k])
							{	
								// draw front
								
								g.setStrokeStyle(1);
								g.beginStroke(GLOBAL_PARAMETERS.fluid_stroke_color);
								g.beginFill(GLOBAL_PARAMETERS.fluid_color);
								g.moveTo(ftr_x, ftr_y);
								g.lineTo(ftl_x, ftl_y);
								g.lineTo(fbl_x, fbl_y);
								g.lineTo(fbr_x, fbr_y);
								g.lineTo(ftr_x, ftr_y);
								g.endStroke();
								g.endFill();
								
								if (GLOBAL_PARAMETERS.separation_width > 0)
								{
									g.setStrokeStyle(1);
									g.beginStroke(this.separation_rgba_stroke);
									g.beginFill(this.separation_rgba_fill);
									g.moveTo(c_ftr_x, c_ftr_y);
									g.lineTo(c_ftl_x, c_ftl_y);
									g.lineTo(c_fbl_x, c_fbl_y);
									g.lineTo(c_fbr_x, c_fbr_y);
									g.lineTo(c_ftr_x, c_ftr_y);
									g.endFill();
									g.endStroke();
								}
							}			
						}				
					}
				}
			}
		}
	}

	window.RectLiquidShape = RectLiquidShape;
}(window));
	