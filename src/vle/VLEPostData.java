package vle;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.Vector;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet for handling POSTed vle data
 * @author hirokiterashima
 * @author geoffreykwan
 * @author patricklawler
 */
public class VLEPostData extends VLEServlet {

	private static final long serialVersionUID = 1L;
	
	public void doPost(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
        createConnection();
        postData(request, response);
        shutdown();
	}

    private static void postData(HttpServletRequest request,
			HttpServletResponse response) {
    	String userId = request.getParameter("userId");
    	String data = request.getParameter("data");
    	
    	/**
    	 * if no data or userId was passed in there's no need to insert anything into
    	 * the table
    	 */
    	if(data == null || userId == null) {
    		response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    		return;
    	} else {
    		try {
    			//the vector to hold the node visit strings
    	    	Vector<String> nodeVisits = new Vector<String>();
    	    	int currentPos = 0;
    	    	int startPos = 0;
    	    	int endPos = 0;
    	    	
    	    	//parse the node states into a vector of node states
    	    	while(currentPos != -1) {
    	    		//find the next node_state start tag
    	    		startPos = data.indexOf("<node_visit>", currentPos);
    	    		
    	    		//jump out of the loop if nothing was found
    	    		if(startPos == -1) {
    	    			break;
    	    		}
    	    		
    	    		//find the next node_state end tag
    	    		endPos = data.indexOf("</node_visit>", startPos);
    	    		
    	    		//jump out of the loop if nothing was found
    	    		if(endPos == -1) {
    	    			break;
    	    		}
    	    		
    	    		//obtain the node state including start and end tags
    	    		String nodeVisit = data.substring(startPos, endPos + "</node_visit>".length());
    	    		
    	    		//add the nodeVisit to the vector so we can loop through them later
    	    		nodeVisits.add(nodeVisit);
    	    		
    	    		//update the position where to start looking for the next tag
    	    		currentPos = endPos;
    	    	}
    	    	
    	    	stmt = conn.createStatement();
    	    	ResultSet results = null;

    	    	Iterator<String> nodeVisitsIter = nodeVisits.iterator();

    	    	//loop through all the node visits
    	    	while(nodeVisitsIter.hasNext()) {
    	    		String nodeVisit = nodeVisitsIter.next();

    	    		//obtain the fields
    	    		String nodeId = getNodeId(nodeVisit);
    	    		String nodeType = getNodeType(nodeVisit);
    	    		String visitStartTime = getVisitStartTime(nodeVisit);
    	    		String visitEndTime = getVisitEndTime(nodeVisit);
    	    		String nodeStates = getNodeStates(nodeVisit);

    	    		/*
    	    		 * this will be passed in to the mysql function str_to_date
    	    		 * so mysql knows how to parse the timestamp we send it
    	    		 * 
    	    		 * e.g. Wed, 06 May 2009 00:41:59 GMT
    	    		 */
    	    		String timeStampFormat = "%a, %e %b %Y %H:%i:%S GMT";

    	    		//check if the row already exists in the db
    	    		String selectStmt = "select * from vle_visits where userId='" + userId + "' and nodeId='" + nodeId + "' and nodeType='" + nodeType + "' and startTime=str_to_date('" + visitStartTime + "', '" + timeStampFormat + "') and endTime=str_to_date('" + visitEndTime + "', '" + timeStampFormat + "');";
    	    		System.out.println(selectStmt);
    	    		results = stmt.executeQuery(selectStmt);

    	    		if(results.first() == false) {
    	    			//if the row does not exist, we will insert it
    	    			String insertStmt = "insert into vle_visits(userId, nodeId, nodeType, startTime, endTime, nodeStates) values(" + userId + ", '" + nodeId + "', '" + nodeType + "', str_to_date('" + visitStartTime + "', '" + timeStampFormat + "'), str_to_date('" + visitEndTime + "', '" + timeStampFormat + "'), '" + nodeStates + "')";
    	    			System.out.println(insertStmt);
    	    			stmt.execute(insertStmt);
    	    		}
    	    	}
	    			
			} catch (SQLException e) {
				e.printStackTrace();
			}
    	}
    	
    }
    
    /**
     * Obtains the value inbetween two xml tags
     * @param nodeVisit the xml
     * @param startTag the start tag
     * @param endTag the end tag
     * @return the value inbetween the start and end tag
     */
    private static String getValueInbetweenTag(String nodeVisit, String startTag, String endTag) {
    	String value = "";
    	
    	//look for the start tag
    	int startPos = nodeVisit.indexOf(startTag);
    	if(startPos == -1) {
    		//if start tag is not found, we will exit
    		return null;
    	}
    	
    	//look for the end tag
    	int endPos = nodeVisit.indexOf(endTag);
    	if(endPos == -1) {
    		//if the end tag is not found, we will exit
    		return null;
    	}
    	
    	//obtain the value inbetween the tags
    	value = nodeVisit.substring(startPos + startTag.length(), endPos);
    	
    	return value;
    }
    
    /**
     * Obtain the value between the type tags
     * @param nodeVisit the xml
     * @return the value inbetween the two tags
     */
    private static String getNodeType(String nodeVisit) {
    	return getValueInbetweenTag(nodeVisit, "<type>", "</type>");
    }
    
    /**
     * Obtain the value between the id tags
     * @param nodeVisit the xml
     * @return the value inbetween the two tags
     */
    private static String getNodeId(String nodeVisit) {
    	return getValueInbetweenTag(nodeVisit, "<id>", "</id>");
    }
    
    /**
     * Obtain the value between the visitStartTime tags without the time zone
     * @param nodeVisit the xml
     * @return the value inbetween the two tags
     */
    private static String getVisitStartTime(String nodeVisit) {
    	String visitStartTime = getValueInbetweenTag(nodeVisit, "<visitStartTime>", "</visitStartTime>");
    	
    	return visitStartTime;
    }
    
    /**
     * Obtain the value between the visitEndTime tags without the time zone
     * @param nodeVisit the xml
     * @return the value inbetween the two tags
     */
    private static String getVisitEndTime(String nodeVisit) {
    	String visitEndTime = getValueInbetweenTag(nodeVisit, "<visitEndTime>", "</visitEndTime>");
    	
    	return visitEndTime;
    }
    
    /**
     * Obtain the value between the nodeStates tags. The nodeStates will
     * be what we store in the data column of the vle_visits table.
     * @param nodeVisit the xml
     * @return the value inbetween the two tags
     */
    private static String getNodeStates(String nodeVisit) {
    	return getValueInbetweenTag(nodeVisit, "<nodeStates>", "</nodeStates>");
    }
}
