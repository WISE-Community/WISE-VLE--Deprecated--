$.fn.dataTableExt.oApi.fnGetFilteredNodes = function ( oSettings )
{
	var anRows = [];
	for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
	{
		var nRow = oSettings.aoData[ oSettings.aiDisplay[i] ].nTr;
		anRows.push( nRow );
	}
	return anRows;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/jquery/jquery-dataTables/media/js/dataTables.fnGetFilteredNodes.js');
}