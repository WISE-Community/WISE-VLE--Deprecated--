/**
 * 
 */
package vle;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Iterator;
import java.util.Vector;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author hirokiterashima
 *
 */
public class VLEPostData extends HttpServlet {


	private static final long serialVersionUID = 1L;

	
	public void doPost(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
        createConnection();
        postData(request, response);
        shutdown();
	}
	
	/**
	 * Get is implemented for testing purposes so you can just enter
	 * arguments in the url to easily test.
	 */
	public void doGet(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
        createConnection();
        postData(request, response);
        shutdown();
	}
		

	private static String tableName = "restaurants";
    // jdbc Connection
    private static Connection conn = null;
    private static Statement stmt = null;

    public static void main(String[] args)
    {
        createConnection();
        createTable();
        shutdown();
    }
    
    private static void createConnection()
    {
        try
        {
//            //Class.forName("org.apache.derby.jdbc.ClientDriver").newInstance();
//            Class.forName("org.hsqldb.jdbcDriver").newInstance();
//            //Get a connection
//            //conn = DriverManager.getConnection(dbURL); 
//            conn = DriverManager.getConnection("jdbc:hsqldb:file:testdb", "sa", "");
        	
        	//create a connection to the mysql db
        	Class.forName("com.mysql.jdbc.Driver").newInstance();
        	conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/vle_database", "sailuser", "sailpass");
        	//conn = DriverManager.getConnection("jdbc:mysql://uccpdev.berkeley.edu:10086/vle_database", "uccp", "uccp!!!");
        }
        catch (Exception except)
        {
            except.printStackTrace();
        }
    }
    
    private static void createTable()
    {
        try
        {
            stmt = conn.createStatement();
            stmt.execute("CREATE TABLE vle_visits (id bigint(20) NOT NULL auto_increment, userId bigint(20) default NULL, courseId bigint(20) default NULL, location bigint(20) default NULL, nodeId varchar(20) default NULL, nodeType varchar(20) default NULL, postTime timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, startTime timestamp NOT NULL default '0000-00-00 00:00:00', endTime timestamp NOT NULL default '0000-00-00 00:00:00', data longtext, PRIMARY KEY (id)) ENGINE=MyISAM AUTO_INCREMENT=1571 DEFAULT CHARSET=utf8;");
            stmt.close();
        }
        catch (SQLException sqlExcept)
        {
            sqlExcept.printStackTrace();
        }
    }
    
    private static void postData(HttpServletRequest request,
			HttpServletResponse response) {
    	String userId = request.getParameter("userId");
    	//String userId = "1";
    	
    	String data = request.getParameter("data");
    	//String data = "<vle_state><node_visit><node><type>OTIntroPage</type><id>0:0:0</id></node><nodeStates></nodeStates><visitStartTime>Wed Apr 22 2009 18:01:06</visitStartTime><visitEndTime>Wed Apr 22 2009 18:01:20</visitEndTime></node_visit><node_visit><node><type>OTQuiz</type><id>0:0:1</id></node><nodeStates></nodeStates><visitStartTime>Wed Apr 22 2009 18:01:20</visitStartTime><visitEndTime>Wed Apr 22 2009 18:01:27</visitEndTime></node_visit><node_visit><node><type>OTQuiz</type><id>0:0:2</id></node><nodeStates></nodeStates><visitStartTime>Wed Apr 22 2009 18:01:27</visitStartTime><visitEndTime>Wed Apr 22 2009 18:01:27</visitEndTime></node_visit><node_visit><node><type>OTQuizCheckBox</type><id>0:0:3</id></node><nodeStates></nodeStates><visitStartTime>Wed Apr 22 2009 18:01:27</visitStartTime><visitEndTime>Wed Apr 22 2009 18:01:28</visitEndTime></node_visit><node_visit><node><type>OTQuiz</type><id>0:0:4</id></node><nodeStates></nodeStates><visitStartTime>Wed Apr 22 2009 18:01:28</visitStartTime><visitEndTime>Wed Apr 22 2009 18:01:29</visitEndTime></node_visit><node_visit><node><type>OTQuizCheckBox</type><id>0:0:5</id></node><nodeStates></nodeStates><visitStartTime>Wed Apr 22 2009 18:01:29</visitStartTime><visitEndTime>Wed Apr 22 2009 18:01:37</visitEndTime></node_visit><node_visit><node><type>OTQuiz</type><id>0:0:6</id></node><nodeStates><state><choiceIdentifier>choice 3</choiceIdentifier><timestamp>1238076005393</timestamp></state></nodeStates><visitStartTime>Thu Mar 26 2009 09:59:06</visitStartTime><visitEndTime>Thu Mar 26 2009 10:00:38</visitEndTime></node_visit><node_visit><node><type>OTQuizCheckBox</type><id>0:0:7</id></node><nodeStates><state><choices><choice>choice 1</choice><choice>choice 4</choice></choices><timestamp>1238076092139</timestamp></state></nodeStates><visitStartTime>Thu Mar 26 2009 10:00:38</visitStartTime><visitEndTime>Thu Mar 26 2009 10:01:48</visitEndTime></node_visit><node_visit><node><type>OTQuiz</type><id>0:0:8</id></node><nodeStates><state><choiceIdentifier>choice 3</choiceIdentifier><timestamp>1238076147929</timestamp></state></nodeStates><visitStartTime>Thu Mar 26 2009 10:01:48</visitStartTime><visitEndTime>Thu Mar 26 2009 10:02:32</visitEndTime></node_visit><node_visit><node><type>OTQuizCheckBox</type><id>0:0:9</id></node><nodeStates><state><choices><choice>choice 1</choice><choice>choice 4</choice></choices><timestamp>1238076183949</timestamp></state></nodeStates><visitStartTime>Thu Mar 26 2009 10:02:32</visitStartTime><visitEndTime>Thu Mar 26 2009 10:03:10</visitEndTime></node_visit><node_visit><node><type>OTQuiz</type><id>0:0:10</id></node><nodeStates><state><choiceIdentifier>choice 2</choiceIdentifier><timestamp>1238076234925</timestamp></state><state><choiceIdentifier>choice 3</choiceIdentifier><timestamp>1238076234926</timestamp></state></nodeStates><visitStartTime>Thu Mar 26 2009 10:04:10</visitStartTime><visitEndTime>Thu Mar 26 2009 10:05:04</visitEndTime></node_visit><node_visit><node><type>OTQuiz</type><id>0:0:15</id></node><nodeStates></nodeStates><visitStartTime>Wed Apr 22 2009 18:01:49</visitStartTime><visitEndTime>Wed Apr 22 2009 18:01:51</visitEndTime></node_visit></vle_state>";
    	
    	//System.out.println("userId: " + userId + "\ndata: " + data);
    	
    	//String courseId = request.getParameter("courseId");
    	//String location = request.getParameter("location");
    	
    	/*
    	 * if no data was passed in there's no need to insert anything into
    	 * the table
    	 */
    	if(data == null) {
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
	    		
	    		//make sure we have a userId
	    		if(userId != null && !userId.equals("")) {
	    			
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
	    	    			String insertStmt = "insert into vle_visits(userId, nodeId, nodeType, startTime, endTime, data) values(" + userId + ", '" + nodeId + "', '" + nodeType + "', str_to_date('" + visitStartTime + "', '" + timeStampFormat + "'), str_to_date('" + visitEndTime + "', '" + timeStampFormat + "'), '" + nodeStates + "')";
	    	    			System.out.println(insertStmt);
	    	    			stmt.execute(insertStmt);
	    	    		}
	    			}
	    			
	    		}
			} catch (SQLException e) {
				e.printStackTrace();
			}
    	}
    	
    }
    
    
    private static void printData(HttpServletRequest request, HttpServletResponse response)
    {
        try
        {
            stmt = conn.createStatement();
            ResultSet results = stmt.executeQuery("select data from vledata");
            ResultSetMetaData rsmd = results.getMetaData();
            int numberCols = rsmd.getColumnCount();
            {
                //print Column Names
                //System.out.print(rsmd.getColumnLabel(i)+"\t\t");  
            }

            //System.out.println("\n-------------------------------------------------");

            while(results.next())
            {
            	response.getWriter().print(results.getString(1));
            }
            results.close();
            stmt.close();
        }
        catch (SQLException sqlExcept)
        {
            sqlExcept.printStackTrace();
        } catch (IOException e) {
        	System.err.println("could not write to response");
			e.printStackTrace();
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

    private static void shutdown() {
    	try {
    		conn.close();
    	} catch(SQLException sqlExcept) {
    		sqlExcept.printStackTrace();
    	}
    }

}
