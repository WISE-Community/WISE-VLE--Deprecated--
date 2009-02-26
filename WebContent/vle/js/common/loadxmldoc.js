function loadXMLDoc(dname) 
{
try //Internet Explorer
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  }
catch(e)
  {
  try //Firefox, Mozilla, Opera, etc.
    {
    xmlDoc=document.implementation.createDocument("","",null);
    }
  catch(e) {alert(e.message)}
  }
try 
  {
  xmlDoc.async=false;
  xmlDoc.load(dname);
  return(xmlDoc);
  }
catch(e) {alert(e.message)}
return(null);
}

function LoadXMLDocObj(){
	this.xmlDoc = null;
	this.loadedEvent = new YAHOO.util.CustomEvent("loadedEvent", this);
}

LoadXMLDocObj.prototype.load = function(dname) {
		
try //Internet Explorer
  {
  this.xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  }
catch(e)
  {
  try //Firefox, Mozilla, Opera, etc.
    {
    this.xmlDoc=document.implementation.createDocument("","",null);
    }
  catch(e) {alert(e.message)}
  }
try 
  {
  this.xmlDoc.async=false;
  this.xmlDoc.load(dname);
  //alert('done loading!');
  this.loadedEvent.fire(null);
  }
catch(e) {alert(e.message)}
}


LoadXMLDocObj.prototype.loadString = function(txt){
	try //Internet Explorer
	{
		this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		this.xmlDoc.async = "false";
		this.xmlDoc.loadXML(txt);
		//return (this.xmlDoc);
	} 
	catch (e) {
		try //Firefox, Mozilla, Opera, etc.
		{
			parser = new DOMParser();
			this.xmlDoc = parser.parseFromString(txt, "text/xml");
 	 		//alert('done loading!');
  			this.loadedEvent.fire(null);
			//return (xmlDoc);
		} 
		catch (e) {
			alert(e.message)
		}
	}
	return (null);
}		

function loadXMLString(txt) 
{
try //Internet Explorer
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  xmlDoc.async="false";
  xmlDoc.loadXML(txt);
  return(xmlDoc); 
  }
catch(e)
  {
  try //Firefox, Mozilla, Opera, etc.
    {
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(txt,"text/xml");
    return(xmlDoc);
    }
  catch(e) {alert(e.message)}
  }
return(null);
}

function loadXMLDocFromString(txt) 
{
try //Internet Explorer
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  xmlDoc.async="false";
  xmlDoc.loadXML(txt);
  return(xmlDoc); 
  }
catch(e)
  {
  try //Firefox, Mozilla, Opera, etc.
    {
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(txt,"text/xml");
    return(xmlDoc);
    }
  catch(e) {alert(e.message)}
  }
return(null);
}
