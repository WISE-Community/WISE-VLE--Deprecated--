function starmap() {

  // public variables with default settings
  var margin = {top: 50, right: 50, bottom: 50, left: 50},
      width = 1024, // default height
      height = 600, // default width
      fluid = true, // default for fluid layout (if true, layout scales according to parent DOM element's size; if false, width and height are static
      title = '',
      stepTerm = '',
  	  editable = false, // default for whether project nodes (positions, etc.) can be edited (authoring mode)
  	  backgroundImg = '', // optional background image path
  	  backgroundCss = '', // optional background CSS
  	  view = {}, // object to hold WISE view object (provides access to WISE project and its nodes)
      complete = function(){}; // optional callback function to execute once map has finished loading
  
  // private variables
  var start,
  	  g,
  	  nodeAttributes = {};

  function chart(selection) {
    selection.each(function(data) {
      
      var map = $(this);
      
      // get the start sequence, step term
      start = data.startPoint;
      var stepTerm = data.stepTerm;
      
      var k = 3,  // zoom (scale level) when viewing an activity
  	  	  r = 6; // radius for step node circles
      
      // get the activities and steps
      var seqs = data.sequences,
      	  steps = data.nodes;
      
      // get the project metadata
      var projectMeta = view.getProjectMetadata(),
      	  theme = view.theme,
      	  navMode = view.navMode;
      
      // create map of node ids and node settings (position, etc.) if settings exist
      if(projectMeta.settings && projectMeta.settings.navSettings) {
    	  var navSettings = projectMeta.settings.navSettings;
    	  if(navSettings){
    		  for(var i=navSettings.length; i>0; --i){
    			  if(navSettings.activeTheme === theme && navSettings.activeNavMode === navMode && navSettings.nodeSettings){
    				  var nodeSettings = navSettings.nodeSettings;
    				  for(var a=nodeSettings.length; a>0; --a){
    					  var current = nodeSettings[a];
    					  nodeAttributes[current.nodeId] = current.settings;
    				  }
    			  }
    		  }
    	  }
      }
      
      // iterate through sequences (starting with master sequence) and create hierarchy object
      var master;
      $.each(seqs, function(i,d){
    	 if(d.identifier === start){
    		 master = d;
    	 }
      });
	  
	  // iterate through nodes in the master sequence to build full hierarchy
	  projectFull = getItem(master.identifier, seqs, steps, true);
	  
	  var fullNodes = flatten(projectFull);
	  // remove root node
	  fullNodes.forEach(function(o,i){
		 if(o.identifier === start){
			 fullNodes.splice(i,1);
		 }
	  });
	  
	  // create force layout of used nodes
	  var links = d3.layout.tree().links(fullNodes);
	  var force = d3.layout.force()
	  	  .nodes(fullNodes)
		  //.charge(-320)
		  .gravity(.2)
		  .friction(.6)
		  .size([width, height])
		  .start();
	  
	  // build groups of nodes from project based on sequence membership
	  var groups = d3.nest().key(function(d) { return d.group; }).entries(force.nodes().filter(function(d,i){ return d.type === 'sequence' ? null : this }));
      
	  // Select the svg, g elements, if they exists
      var svg = d3.select(this).select("svg#chart");
      g = d3.select("g#wrap");

      // Otherwise, create the map and inner wrap element    	
      if (svg.empty()) {
    	  svg = d3.select(this).append("svg:svg")
    	  	  .attr('id','chart');
    	  
    	  // zoom layer
    	  svg.append('svg:g')
    	     //.call(d3.behavior.zoom().on("zoom", redraw))
    	   .append('svg:g')
    	     .attr('id', 'wrap');
    	  g = d3.select('g#wrap');
    	  g.append('svg:rect')
	         .attr('width', width)
	         .attr('height', height)
	         .attr('id','mapBg')
	         .attr('fill', 'transparent');
	      g.append('svg:image')
	         .attr('id', 'mapBgImg')
	         .attr('xlink:xlink:href', backgroundImg)
	         .attr('x',0)
	         .attr('y',0)
	         .attr('width',width)
	         .attr('height',height);
      }

      // Update the outer dimensions
      if(fluid){
    	  svg.attr({
	    	"viewBox": "0 0 " + width + " " + height,
	    	"preserveAspectRatio": "xMidYMid meet",
	    	'height': '100%',
	    	'width': '100%',
	    	'pointer-events': 'all'
	      });
      } else {
    	  svg.attr({
    		 'width': width,
    		 'height': height
    	  });
      }

      // Update the inner dimensions with padding
      // g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
	  // function to build a group's hull path
	  var groupPath = function(d) {
		  return "M" + d3.geom.hull(d.values.map(function(i) {return [i.x, i.y];})).join("L") + "Z";
      };
      
      var getIcon = function(d) {
    	  var project = view.getProject(),
    	  	  metadata = view.getProjectMetadata();
    	  var node = project.getNodeById(d.identifier),
    	  	  isValid = false,
    	  	  nodeClass = '';
    	  var nodeIconPath = '';
    	  if(node.getNodeClass() && node.getNodeClass()!=='null' && node.getNodeClass()!==''){
			nodeClass = node.getNodeClass();
			for(var a=0;a<view.nodeClasses[node.type].length;a++){
				if(view.nodeClasses[node.type][a].nodeClass === nodeClass){
					isValid = true;
					nodeIconPath = view.nodeClasses[node.type][a].icon;
					break;
				}
			}
	      }
    	  
    	  if(!isValid){
    		  nodeClass = view.nodeClasses[node.type][0].nodeClass;
    		  nodeIconPath = view.nodeClasses[node.type][0].icon;
		  }
		  return nodeIconPath;
      };
	  
	  // add links between activities and steps to links array
	  projectFull.children.forEach(function(o,i) {
		  if(i<projectFull.children.length-1){
			  var next = projectFull.children[i+1];
			  o.next = next;
			  links.push({source: o.index, target: next.index, type: 'sequence'});
		  }
		  if(i>0){
			  var prev = projectFull.children[i-1];
			  o.prev = prev;
		  }
		  o.children.forEach(function(n,a){
			  if(a<o.children.length-1){
				  var source = 0,
				  	  target = 0,
				  	  group = '';
				  force.nodes().forEach(function(u,x){
					  if(o.children[a].identifier === u.identifier){
						  source = u.index;
						  group = u.group;
					  }
					  if(o.children[a+1].identifier === u.identifier){
						  target = u.index;
					  }
				  });
				  links.push({source: source, target: target, type: 'path', group: group});
				  //links.push({source: o.index, target: target, type: 'seqToPath', group: group});
			  }
		  });
	  });
	  
	  // add links to force layout
	  force.links(links)
	  	  .linkDistance(function(d) { 
	  		  if(d.type === 'path'){
	  			  return 30;
	  		  } else if(d.type === 'sequence'){
	  			  return 60;
	  		  //} else if(d.type === 'seqToPath'){
	  			 // return 50;
	  		  } else {
	  			  return 1;
	  		  }
	  	  })
	  	  .charge(function(d) { return d.type === 'sequence' ? -500 : -500 });
	  
	  function sDragStart(d,i) {
		  forceSeq.each(function(s) { s.fixed = true; }); // set all activities to fixed position
	      force.stop() // stops the force auto positioning before you start dragging
	  }
	
	  function sDragMove(elem,i) {
		  var group = elem.group;
		  d3.selectAll('.item').each(function(d){ 
			  if(d.group === group && (d.type === 'sequence' || !d3.select(this).classed('active'))){
				  d.px += d3.event.dx;
			      d.py += d3.event.dy;
			      d.x += d3.event.dx;
			      d.y += d3.event.dy;
			      d3.select(this).attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			  }
		  });
	      force.tick(); // this is the key to make it work together with updating both px,py,x,y on d !
	      force.resume();
	  }
	
	  function sDragEnd(d,i) {
	      d.fixed = true; // set the node to fixed so the force doesn't include the node in its auto positioning stuff
	      force.stop();
	  }
	  
	  var sDrag = d3.behavior.drag()
	  	  .on("dragstart",sDragStart)
	  	  .on("drag",sDragMove)
	  	  .on("dragend",sDragEnd);
	  
	  /*function redraw() {
		  console.log("here", d3.event.translate, d3.event.scale);
		  var scale = d3.transform(g.attr('transform')).scale;
		  g.attr("transform",
		      "scale(" + scale + ") "
		      + "translate(" + d3.event.translate + ")");
	  }*/
	  
	  function renderNode(d){
		  var nodePosition = view.getProject().getPositionById(d.identifier);
	      //go to the node position that was clicked if it is available
	      view.goToNodePosition(nodePosition);
	  };
	  
	  function svgZoom(elem, d){
		  //console.log("here", d3.event.x, d3.event.y);
		  forceSeq.each(function(s) { s.fixed = true; }); // set all activities to fixed position
		  var x = 0,
		      y = 0;
		  
		  //var group = d.dataset.group,
		  var group = elem.getAttribute('data-group');
		  	  //current = {};
		  
		  /*d3.selectAll('.item, .link, .target, .hull')
	  	  	.classed('active',function(d){ return this.getAttribute('data-group') === group; });
  
		  d3.selectAll('.item, .link, .hull')
		  	  .classed('inactive',function(d){ return this.getAttribute('data-group') !== group; });*/
		  
		  if(elem.classList.contains('seq')){
			  /*d3.selectAll('.node.active').each(function(n,i){
				  if(i===0){
					  n.current = true;
				  }
				  if(n.current === true){
					  x = n.x;
					  y = n.y;
				  }
			  });*/
			  
			  x = d.x;
			  y = d.y;
			  
			  d3.select(elem).each(function(n){
				  $('#currentAct').html("<span class='pos'>#" + (n.position+1) + ":</span> " + n.title); 
			  });
			  
			  // hide activity info displays
			  d3.select("#" + elem.id + "_info")
	    	  	  .transition()
		    	  	  .duration(125)
		    	  	  .style("opacity",0);
	    	  d3.select("#" + elem.id + "_radial")
	    	  	  .transition()
		    		  .attr("width", 0)
				  	  .attr("height", 0)
				  	  .attr("x", 0)
				      .attr("y", 0)
		    		  .duration(100)
		    		  .delay(200).
		    		  each("end", function(){
		    			  setTimeout(function(){
		    				  d3.selectAll('.item, .link, .target, .hull')
			    		  	  	.classed('active',function(d){ return this.getAttribute('data-group') === group; });
			    	  
			    			  d3.selectAll('.item, .link, .hull')
			    			  	  .classed('inactive',function(d){ return this.getAttribute('data-group') !== group; });
			    			  
			    			  d3.select('#mapBgImg').classed('zoom',true);
			    			  $('#activityControls').fadeIn(750);
		    			  }, 200);
		    		  });
	    	  
	    	  // set next and previous link actions
	    	  // TODO: move html element creation inside starmap
	    	  var prevAct = d.prev,
	    	  	  nextAct = d.next;
	    	  $('#prevAct, #nextAct').off('click');
	    	  if(prevAct){
	    		  $('#prevAct').on('click', function(){
	    			  svgZoom(d3.select('#' + prevAct.identifier)[0][0], prevAct);
	    		  });
	    		  $('#prevAct').show();
	    	  } else {
	    		  $('#prevAct').hide();
	    	  }
	    	  if(nextAct){
	    		  $('#nextAct').on('click', function(){
	    			  svgZoom(d3.select('#' + nextAct.identifier)[0][0], nextAct);
	    		  });
	    		  $('#nextAct').show();
	    	  } else {
	    		  $('#nextAct').hide();
	    	  }
			  
			  /*var bbox = d.getBBox();
			  var centroid = [bbox.x + bbox.width/2.0, bbox.y + bbox.height/2.0];
			  //x = -centroid[0] + margin.left*2/k + margin.left;
			  //y = -centroid[1] + margin.top*2/k + 20;
			  x = -centroid[0] + $(map).width()/(2*k);
			  y = -centroid[1] + $(map).height()/(2*k);
			  
			  g.transition()
  	  	  	  	  .duration(1000)
  	  	  	  	  .attr("transform", "scale(" + k + ") translate(" + x + "," + y + ")");*/
			  
		  /*} else if(d.classList.contains('node')){
			  var circle = $(document.getElementById("anchor_" + d.id));
			  //force.stop();
			  target = d3.select('#' + group + '-target');
			  d3.selectAll('.node.active').classed('current',false)
			  	  .attr("r",r)
			  	  .each(function(n){ n.current = false; });
			  d3.select(d).classed('current',true)
			  	  .each(function(n){
					  n.current = true;
					  x = n.x;
					  y = n.y;
				  });
			  //force.tick();
			  //force.resume();
			  //force.stop();*/
			  
			  /*x = -current.x + $(map).width()/(2*k) - 300/k;
			  y = -current.y + $(map).height()/(2*k);
			  g.transition()
          	  	  .duration(1000)
          	  	  .attr("transform", "scale(" + k + ")translate(" + x + "," + y + ")");*/
			  
			  //x = -current.x + margin.left*2/k + margin.left;
			  //y = -current.y + margin.top*2/k;
			  
			  /*var neighbors = d3.select(d).data()[0].neighbors;
			  var offset = $(map).offset(),
			  	  adjust = [0,0],
			  	  bounds = {
					  "left": (offset.left + 50),
					  "top": (offset.top + 50),
					  "right": ($(map).width() + offset.left - 200),
					  "bottom": ($(map).height() + offset.top - 200)
			  	  };
			  neighbors.forEach(function(n,i){
				  var nPos = document.getElementById(n.identifier).getBoundingClientRect(),
				  	  doAdjust = false;
				  if(nPos.left < bounds.left || nPos.top < bounds.top ||
						  nPos.right > bounds.right || nPos.bottom > bounds.bottom){
					  doAdjust = true;
				  }
				  if(doAdjust){
					  // adjust position if current node and/or surrounding are off viewport
					  x = -current.x + $(map).width()/(2*k) - 300/k;
					  y = -current.y + $(map).height()/(2*k);
					  g.transition()
		          	  	  .duration(1000)
		          	  	  .attr("transform", "scale(" + k + ")translate(" + x + "," + y + ")");
				  }
			  });*/
		  }
		  x = -x + $(map).width()/(2*k) - 90/k;
		  y = -y + $(map).height()/(2*k) - 50/k;
		  g.transition()
  	  	  	  .duration(750)
  	  	  	  .delay(600)
  	  	  	  .ease("cubic-out")
  	  	  	  .attr("transform", "scale(" + k + ") translate(" + x + "," + y + ")");
  	  	  	  /*.each("end", function(){
		  	  	  if(elem.classList.contains('node')){
		  	  		  //$(document.getElementById("anchor_" + d.id)).powerTip('show');
		  		  }
  	  	  	  });*/
	  };
	  
	  function zoom(d) {
		  //if($('#powerTipStarmap').is(':visible')){
			  //$('.current.node').off('powerTipClose');
			  //$('.current.node').on('powerTipClose', function(){
				  //svgZoom(d);
			  //});
			  //$.powerTip.hide();
		  //} else {
			  svgZoom(d);
		  //}
	  };
	  var loaded = false;
	  
	  function draw(){
		  // add loading message
		  var svgLoading = svg.append("text")
		      .attr("x", width / 2)
		      .attr("y", height / 2)
		      .attr("dy", ".35em")
		      .attr("text-anchor", "middle")
		      .text("Loading...");
		  
		  // Use a timeout to allow the rest of the page to load first.
		  setTimeout(function() {
	
		      // Run the layout a fixed number of times.
		      // The ideal number of times scales with graph complexity.
		      // Of course, don't run too longÑyou'll hang the page!
		      force.start();
		      var n = 20;
		      for (var i = n * n; i > 0; --i) force.tick();
		      force.stop();
		  
			  // Update the step items
			  forceNode = g.selectAll("g.item")
				  .data(force.nodes().filter(function(d) { return d.type !== "sequence" }))
				.enter().append("svg:g")
				  .attr("class", function(d){ return d.current === true ? "item node current" : "item node"; })
				  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
				  .attr("data-group", function(d){ return d.group; })
				  .attr("id", function(d){ return d.identifier })
				  .on("click", function(d){ renderNode(d); })
				  .on("touchstart", function(d){ renderNode(d); })
				  //.on("click", function(){ zoom(this); })
				  //.on("touchstart", function(){ zoom(this); })
				  /*.on("mouseover", function(d){ 
			  		  d3.select(this).select("circle.main")
			  		  	  .filter(function(d){ return !d.current; })
			  		  	  .transition()
			  		  	  	.duration(100)
			  		  	  	.attr("r",r+2)
			  		  	  	.attr("class","mouseover main");
			  	  })
				  .on("mouseout", function(d){ 
			  		  d3.select(this).select("circle.main")
			  		  	  .transition()
			  		  	  	.duration(100)
			  		  	  	.attr("r",r)
			  		  	  	.attr("class","main");
			  	  })*/
				  .call(force.drag);
			  /*forceCircle = forceNode.append("svg:circle")
			  	  .attr("id",function(d){ return "anchor_" + d.identifier; })
			  	  .attr("class","main")
			  	  .attr("r", r);*/
			  forceCircle = forceNode.append("svg:image")
			  	  .attr("id",function(d){ return "anchor_" + d.identifier; })
			  	  .attr("xlink:xlink:href",getIcon)
			  	  .attr("x", -15)
			      .attr("y", -15)
			      .attr("width", 30)
			      .attr("height", 30);
			  /*forceNode.append("svg:circle")
			  	  .attr("class","detail")
		  	  	  .attr("r", 3.5)
			  	  .attr("cx",5)
			  	  .attr("cy",5);
			  forceNode.append("svg:text")
			  	  .text(function(d){ return "" + (d.position+1) + ""; })
			  	  .attr("class","detail")
			  	  .attr("text-anchor", "middle")
			  	  .attr('x',5)
			  	  .attr("y",7);*/
			  
			  // add neighboring nodes to each node
			  /*links.filter(function(d){ return d.type === "path"; }).forEach(function(link) {
			    var source = force.nodes()[link.source], target = force.nodes()[link.target];
			    if(source && target){
			    	(source.neighbors || (source.neighbors = [])).push(target);
				    (target.neighbors || (target.neighbors = [])).push(source);
			    }
			  });*/
			  
			  // update the activity items
			  forceSeq = g.selectAll("g.seq")
				  .data(force.nodes().filter(function(d) { return d.type === "sequence"; }))
				.enter().append("svg:g")
				  .attr("class", "item seq")
				  .attr("transform", function(d) {
					  // constrain sequences to map bounds
					  d.x = Math.max(margin.left, Math.min(width - margin.left - 20, d.x));
					  d.y = Math.max(margin.top, Math.min(height - margin.top - 20, d.y));
					  return "translate(" + d.x + "," + d.y + ")";
				   })
				  .attr("data-group", function(d){ return d.group; })
				  .attr('id', function(d){ return d.identifier })
			      .on("click", function(d){ svgZoom(this, d); })
			  	  .on("touchstart", function(d){ svgZoom(this, d); })
				  .call(sDrag);
			  
			  forceSeq.append("svg:image")
			  	  .attr("xlink:xlink:href","themes/starmap/navigation/map/images/menu-radial.png")
			  	  .attr("width", 0)
			  	  .attr("height", 0)
			  	  .attr("x", 0)
			      .attr("y", 0)
			      .attr("id", function(d){ return d.identifier + "_radial"; })
			      .attr("class", "radial");
			  
			  forceSeq.append("svg:image")
			  	  .attr("id",function(d){ return "anchor_" + d.identifier; })
			  	  .attr("xlink:xlink:href","themes/starmap/navigation/map/images/star-bronze.png")
			  	  .attr("x", -18)
			      .attr("y", -18)
			      .attr("width", 36)
			      .attr("height", 36)
			      .on("mouseover", function(d){
			    	  this.parentNode.parentNode.appendChild(this.parentNode);
			    	  if(!d3.select("#" + d.identifier).classed("active")){
			    		  d3.select("#" + d.identifier + "_radial")
				    	  	  .transition()
				    		  .attr("width", 80)
						  	  .attr("height", 80)
						  	  .attr("x", -40)
						      .attr("y", -40)
				    		  .duration(125);
				    	  d3.select("#" + d.identifier + "_info")
				    	  	  .transition()
				    	  	  .style("opacity",1)
				    	  	  .duration(100)
				    	  	  .delay(200);
			    	  }
			      })
			      .on("mouseout", function(d){
			    	  d3.select("#" + d.identifier + "_info")
			    	  	  .transition()
			    	  	  .duration(125)
			    	  	  .style("opacity",0);
			    	  d3.select("#" + d.identifier + "_radial")
			    	  	  .transition()
			    		  .attr("width", 0)
					  	  .attr("height", 0)
					  	  .attr("x", 0)
					      .attr("y", 0)
			    		  .duration(100)
			    		  .delay(200);
			      })
			      .attr("class", "icon");
			  
			  var forceSeqInfo = forceSeq.append("svg:g")
			  	  .attr("class","seqInfo")
			  	  .attr("id", function(d){ return d.identifier + "_info"; });
			  
			  forceSeqInfo.append("svg:image")
			  	  .attr("xlink:xlink:href","themes/starmap/navigation/map/images/menu-header-blank.png")
			  	  .attr("width", 199)
			  	  .attr("height", 36)
			  	  .attr("x", 12)
			  	  .attr("y", -30)
			  	  .attr("class", "titleBg");
			  
			  var forceSeqText = forceSeqInfo.append("svg:text")
			  	  .attr("x", 26)
			  	  .attr("y", -7)
			  	  .attr("class", "title");
			  
			  forceSeqText.append("svg:tspan")
				  .text(function(d){ return "#" + (d.position+1) + ""; })
				  .attr("class", "pos");
			  
			  forceSeqText.append("svg:tspan")
			  	  .text(function(d){ return  "" + (d.title) + ""; })
			  	  .attr("class", "name")
			  	  .attr("dx", 4);
			  
			  // Update the links
			  g.selectAll("path.link")
			      .data(force.links().filter(function(d){ return d.type; }))
			    .enter().insert("path", ".node")
			      .attr("class", function(d){
			    	  if(d.type==="path"){
			    		  return "link path";
			    	  } else if(d.type==="sequence"){
			    		  return "link seq";
			    	  }
			      })
			      .attr("d",function(d){ return "M" + d.source.x + " " + d.source.y + " L" + d.target.x + " " + d.target.y; })
			      .attr("data-group", function(d){ return d.group; })
			      .style("stroke-dasharray", ("2, 2"));
			  
			  // update the hulls
			  /*g.selectAll("path.hull")
			    .data(groups)
			      .attr("d", groupPath)
			    .enter().insert("path",".node")
			      .attr("class", "hull")
			      .attr("id", function(d){ return d.key + "-wrap"; })
			      .attr('data-group', function(d){ return d.key })
			      .style("stroke-linejoin", "round")
			      .attr("d", groupPath)
			      .attr('stroke-width',40);*/
			  
			  /*g.selectAll("path.target")
			    .data(groups)
			      .attr("d", groupPath)
			    .enter().insert("path",".seq")
			      .attr("class", "target")
			      .attr("id", function(d){ return d.key + "-target"; })
			      .attr('data-group', function(d){ return d.key })
			      .style("stroke-linejoin", "round")
			      .attr("d", groupPath)
			      .attr('stroke-width',40)
			      .on("click", function(){ zoom(this); })
			  	  .on("touchstart", function(){ zoom(this); });*/
			  
			  // run layout a fixed number of times again to finish convergence
		      force.start();
		      n = 5;
		      for (var i = n * n; i > 0; --i) force.tick();
		      //force.stop();
		      
		      // add info tooltips to each step node
		      forceCircle.each(function(d,i){
		    	  //$(this).powerTip({
		    		  //popupId: "powerTipStarmap",
		    		  //mouseOnToPopup: true,
		    		  //placement: 'e',
		    		  //manual:true
		    	  //});
		      });
		      
		      force.stop();
			  g.selectAll('.node, .seq').each(function(d){
				 d.fixed = true; 
			  });
		      loaded = true;
		      complete();
		      
		      // remove loading message
		      svgLoading.remove();
		      
		      //we are done loading the navigation panel for the first time
		      eventManager.fire('navigationLoadingCompleted');
		  }, 10);
	  }
	  
	  function redraw(){
		  //g.selectAll("circle.item")
		    //  .attr("cx", function(d) { return d.x; })
		    //  .attr("cy", function(d) { return d.y; });
		  
		  /*g.selectAll("g.item").attr("transform", function(d) { 
			  //var zoom = d.current ? "1.25" : "1";
			  //return "translate(" + d.x + "," + d.y + ")scale(" + zoom + "," + zoom + ")"; 
			  return "translate(" + d.x + "," + d.y + ")scale(1,1)";
		  });*/
		  
		  /*g.selectAll("g.item circle.main").attr("r", function(d){
			  return (d3.select(this).classed('mouseover') || d.current) ? r+2 : r;
		  });*/
		  
		  g.selectAll("g.item").attr("transform", function(d) { 
			  return "translate(" + d.x + "," + d.y + ")scale(1,1)";
		  });
		  
		  // constrain sequences to map bounds
		  g.selectAll("g.seq").each(function(d) { 
			  d.x = Math.max(margin.left, Math.min(width - margin.left, d.x));
			  d.y = Math.max(margin.top, Math.min(height - margin.top, d.y)); 
		  });
		  
		  g.selectAll("g.seq").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	      	  //.attr("d", function(d) { return "M" + calculateStarPoints(d.x, d.y, 5, 12, 5) + "z"; });
		  
		  g.selectAll("path.link").attr("d",function(d){ return "M" + d.source.x + " " + d.source.y + " L" + d.target.x + " " + d.target.y; });
		  
		  //g.selectAll("path.hull").attr("d", groupPath);
		  
		  //g.selectAll("path.target").attr("d", groupPath);
	  };
		  
	  force.on("tick", function(e) {
		  redraw();
	  });
	  
	  draw();
	  
	  /*$('#toggleView').on('click',function(){
		  if(canEdit){
			  canEdit = false;
			  force.stop();
			  g.selectAll('.node, .seq').each(function(d){
				 d.fixed = true; 
			  });
			  $(this).text('Student View');
		  } else {
			  canEdit = true;
			  force.resume();
			  g.selectAll('.node, .seq').each(function(d){
				 d.fixed = false; 
			  });
			  $(this).text('Author View');
		  }
	  });*/
	  
    });
  };
  
  //Returns a list of all nodes under the root.
  function flatten(root) {
    var nodes = [], a = 0, s = 0;

    function recurse(node,id) {
      if (node.children) {
    	  node.group = node.identifier;
    	  var x = 100+20*s;
    	  //var y = Math.random()*height;
    	  var y = height/2;
    	  //var x = 10*(s%10);
    	  node.x = x;
    	  node.y = y;
    	  for(var i=0; i<node.children.length; i++){
    		  node.children[i].position = i;
    		  var e = 10*i;
    		  node.children[i].x = x+e;
    		  node.children[i].y = y+e;
    		  recurse(node.children[i],node.identifier);
    	  }
    	  ++s;
    	  //node.children.forEach(recurse);
      } else {
    	  node.group = id;
      }
      ++a;
      if (!node.id) node.id = a;
      nodes.push(node);
    };

    recurse(root);
    return nodes;
  };
  
  function getChildren(d,seqs,steps,full){
	  if(d.hasOwnProperty('refs')){
		  d.children = [];
		  var refs = d.refs;
		  for(var i=0;i<refs.length;i++){
			  var id = refs[i];
			  var item = getItem(id,seqs,steps,full);
			  d.children.push(item);
		  }
	  }
	  return d;
  };
  
  function getItem(id,seqs,steps,full){
	  var item;
	  $.each(seqs, function(i,d){
		  if(d.identifier === id){
			  if(id === start){
				  item = getChildren(d,seqs,steps);
			  }
			  // item is a sequence, get children and return seq object
			  if(full){
				  item = getChildren(d,seqs,steps,full);
			  } else {
				  item = d;  
			  }
		  }
	  });
	  $.each(steps, function(i,d){
		  if(d.identifier === id){
			  if(d.position===0){
				  d.current = true;
			  }
			  // item is a step, return step object
			  item = d;
		  }
	  });
	  
	  // add any stored node attribute values
	  if(nodeAttributes.hasOwnProperty(id)){
		  var attrs = nodeAttributes[id];
		  for(var i=attrs.length; i>0; --i){
			  var attr = attrs[i];
			  for(var key in attr) {
			        if (attr.hasOwnProperty(key)) {
			            item[key] = attr[key];
			        }
			    }
		  }
	  }
	  
	  return item;
  };

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };
  
  chart.title = function(_) {
	  if(!arguments.length) return title;
	  title = _;
	  return chart;
  };
  
  chart.stepTerm = function(_) {
	  if(!arguments.length) return stepTerm;
	  stepTerm = _;
	  return chart;
  };
  
  chart.fluid = function(_) {
	  if(!arguments.length) return fluid;
	  fluid = _;
	  return chart;
  };
  
  chart.editable = function(_) {
	  if(!arguments.length) return editable;
	  editable = _;
	  return chart;
  };
  
  chart.backgroundImg = function(_) {
	  if(!arguments.length) return backgroundImg;
	  backgroundImg = _;
	  return chart;
  };
  
  chart.view = function(_) {
	  if(!arguments.length) return view;
	  view = _;
	  return chart;
  };
  
  chart.complete = function(_) {
	  if(!arguments.length) return complete;
	  complete = _;
	  return chart;
  };
  
  chart.reset = function() {
	  $('#activityControls').fadeOut(750);
	  d3.select('#mapBgImg').classed('zoom',false);
	  g.transition()
  	  	  .duration(400)
  	  	  .ease("cubic-out")
  	  	  .attr("transform", "scale(1) translate(1)");
	  
	  d3.selectAll('.item, .link, .target, .hull')
  	  	  .classed('active',false);

	  d3.selectAll('.item, .link, .hull')
	  	  .classed('inactive',false);
	  
	  return chart;
  };

  return chart;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/themes/starmap/navigation/map/js/starmap.js');
}