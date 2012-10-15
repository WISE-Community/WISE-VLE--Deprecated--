/**
 * When dealing with computer file sizes, it is common to append a post fix such as 
 * KB, MB or GB to a string in order to easily denote the order of magnitude of the 
 * file size. This plug-in allows sorting to take these indicates of size into account.
 * 
 * @author anjibman
 */

jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "file-size-pre": function ( a ) {
        var x = a.substring(0,a.length - 2);
             
        var x_unit = (a.substring(a.length - 2, a.length) == "MB" ?
            1000 : (a.substring(a.length - 2, a.length) == "GB" ? 1000000 : 1));
          
        return parseInt( x * x_unit, 10 );
    },
 
    "file-size-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },
 
    "file-size-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
} );


/**
 * Detect "file size" type columns automatically. Commonly used for computer file sizes, this 
 * can allow sorting to take the order of magnitude indicated by the label (GB etc) into account.
 * 
 * @author anjibman
 */

jQuery.fn.dataTableExt.aTypes.unshift(
    function ( sData )
    {
        var sValidChars = "0123456789";
        var Char;
  
        /* Check the numeric part */
        for ( i=0 ; i<(sData.length - 3) ; i++ )
        {
            Char = sData.charAt(i);
            if (sValidChars.indexOf(Char) == -1)
            {
                return null;
            }
        }
  
        /* Check for size unit KB, MB or GB */
        if ( sData.substring(sData.length - 2, sData.length) == "KB"
            || sData.substring(sData.length - 2, sData.length) == "MB"
            || sData.substring(sData.length - 2, sData.length) == "GB" )
        {
            return 'file-size';
        }
        return null;
    }
);

/** Create an array with the values of all the checkboxes in a column 
 * From: http://datatables.net/examples/plug-ins/dom_sort.html
 **/
$.fn.dataTableExt.afnSortData['dom-checkbox'] = function  ( oSettings, iColumn )
{
	var aData = [];
	$( 'td:eq('+iColumn+') input', oSettings.oApi._fnGetTrNodes(oSettings) ).each( function () {
		aData.push( this.checked==true ? "1" : "0" );
	} );
	return aData;
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/jquery/jquery-dataTables/media/js/dataTables.util.js');
}