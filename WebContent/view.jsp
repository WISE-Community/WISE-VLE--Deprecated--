<html>
<head>
<title>Loading Sample PAS Project to Virtual Learning Environment</title>

	<script type="text/javascript">
		function topiframeOnLoad() {

		}

		function scriptsLoaded() {
			var vleConfigUrl = '<%= request.getAttribute("vleconfig_url") %>'; 
			window.frames["topifrm"].initializeVLEFromVLEConfig(vleConfigUrl);			
		}
		
		/*
		var runId = 4; //"${runId}";
		var workgroupId = 3;  //"${workgroup.id}";
		var userInfoUrl = null; //= 'script/getUserInfo.php?runId=65';  // "${userInfoUrl}";

		var getDataUrl = 'script/getVisits.php?users=146'; //"${getDataUrl}";
        var postDataUrl = null; //"../postVisits.php"; //'script/postVisits.php?user=146'; 

        var contentBaseUrl = '<%= request.getAttribute("contentBaseUrl") %>';
        var contentUrl = '<%= request.getAttribute("contentUrl") %>';
        //alert('view.php \ncontentBaseUrl:' + contentBaseUrl + '\npostDataUrl:' + postDataUrl + '\ncontentUrl:' + contentUrl);
		window.frames["topifrm"].load(contentUrl, userInfoUrl, getDataUrl, contentBaseUrl, postDataUrl);
		*/
	</script>





</head>
<body class=" yui-skin-sam">
<div id="wait"></div> 
<iframe id="topifrm" src="vle/vle.html" onload="topiframeOnLoad();" name="topifrm" scrolling="auto"
 width="100%" height="100%" frameborder="0">
 [Content for browsers that don't support iframes goes here.]
</iframe>

</body>
</html>
