<html>
<head>
<title>Loading Sample PAS Project to Virtual Learning Environment</title>

<% if (request.getAttribute("vleconfig_url") == null) { %>
    <script type="text/javascript">
    	function bodyOnload() {
			var projectsJSON = '<%= request.getAttribute("projectsJSONString") %>'; 
			var projects = eval('(' + projectsJSON + ')');
			var link = "";
			for (var i=0; i < projects.length; i++) {
				var projectId = projects[i].id;
				link += "<h5><a href='/vlewrapper/view.html?projectId="+projectId+"'>"+projects[i].name+"</a></h5>";
			}
			document.getElementById("projectListDiv").innerHTML = link;
    	}
    </script>
</head>
<body onload="bodyOnload()">

<div id="projectListDiv"></div>
<div id="wait"></div> 
</body>
</html>
<% } else { %>
	<script type="text/javascript">
		function startWithConfig() {
			var vleConfigUrl =  '<%= request.getAttribute("vleconfig_url") %>'; 
			window.frames['topifrm'].view.startVLEFromConfig(vleConfigUrl);
		}
	</script>
</head>
<body>

<div id="projectListDiv"></div>
<div id="wait"></div> 
<iframe id="topifrm" src="vle/vle.html" name="topifrm" scrolling="auto"
 width="100%" height="100%" frameborder="0">
 [Content for browsers that don't support iframes goes here.]
</iframe>
</body>
</html>
<% } %>
