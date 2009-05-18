package vle;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class VLEPostAnnotations extends HttpServlet {
    private static Connection conn = null;
    private static Statement stmt = null;
	
	public void doPost(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
        createConnection();
        postData(request, response);
        shutdown();
	}
	
	public void doGet(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
        createConnection();
        postData(request, response);
        shutdown();
	}
	
    private static void createConnection()
    {
        try
        {
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
    
    private static void postData(HttpServletRequest request,
			HttpServletResponse response) {
    	try {
    		//obtain the parameters
        	String runId = request.getParameter("runId");
        	String nodeId = request.getParameter("nodeId");
        	String toWorkgroup = request.getParameter("toWorkgroup");
        	String fromWorkgroup = request.getParameter("fromWorkgroup");
        	String type = request.getParameter("type");
        	String value = request.getParameter("value");
        	
        	stmt = conn.createStatement();
        	ResultSet results = null;
        	
        	if(value == null || value.equals("")) {
        		//if no annotation was provided, do nothing and return
        		return;
        	} else {
        		StringBuffer annotationEntry = new StringBuffer();
        		annotationEntry.append("<annotationEntry>");
        		annotationEntry.append("<runId>" + runId + "</runId>");
        		annotationEntry.append("<nodeId>" + nodeId + "</nodeId>");
        		annotationEntry.append("<toWorkgroup>" + toWorkgroup + "</toWorkgroup>");
        		annotationEntry.append("<fromWorkgroup>" + fromWorkgroup + "</fromWorkgroup>");
        		annotationEntry.append("<type>" + type + "</type>");
        		annotationEntry.append("<value>" + value + "</value>");
        		//annotationBundle.append("<postTime>" +  + "</postTime>");
        		annotationEntry.append("</annotationEntry>");
        		
        		//the query to see if the row already exists in the table
        		String selectStmt = "select * from annotations where runId=" + runId + " and nodeId='" + nodeId + "' and toWorkgroup='" + toWorkgroup + "' and fromWorkgroup='" + fromWorkgroup + "' and type='" + type + "' and value='" + annotationEntry + "'";
        		System.out.println(selectStmt);
        		results = stmt.executeQuery(selectStmt);
        		
        		//check if the row already exists
        		if(results.first() == false) {
        			//the row does not exist so we will insert it
        			String insertStmt = "insert into annotations(runId, nodeId, toWorkgroup, fromWorkgroup, type, value) values(" + runId + ", '" + nodeId + "', " + toWorkgroup + ", " + fromWorkgroup + ", '" + type + "', '" + annotationEntry + "')";
        			System.out.println(insertStmt);
        			stmt.execute(insertStmt);
        		}
        		
        		//send the annotationEntry xml to the response so the user can get the xml
        		response.getWriter().write(annotationEntry.toString());
        	}
    	} catch (SQLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

    }
    
    private static void shutdown() {
    	try {
    		conn.close();
    	} catch(SQLException sqlExcept) {
    		sqlExcept.printStackTrace();
    	}
    }
}
