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
        	String annotation = request.getParameter("annotation");
        	
        	stmt = conn.createStatement();
        	ResultSet results = null;
        	
        	if(annotation == null || annotation.equals("")) {
        		//if no annotation was provided, do nothing and return
        		return;
        	} else {
        		//the query to see if the row already exists in the table
        		String selectStmt = "select * from annotations where runId=" + runId + " and nodeId='" + nodeId + "' and toWorkgroup='" + toWorkgroup + "' and fromWorkgroup='" + fromWorkgroup + "' and type='" + type + "' and annotation='" + annotation + "'";
        		System.out.println(selectStmt);
        		results = stmt.executeQuery(selectStmt);
        		
        		//check if the row already exists
        		if(results.first() == false) {
        			//the row does not exist so we will insert it
        			String insertStmt = "insert into annotations(runId, nodeId, toWorkgroup, fromWorkgroup, type, annotation) values(" + runId + ", '" + nodeId + "', " + toWorkgroup + ", " + fromWorkgroup + ", '" + type + "', '" + annotation + "')";
        			System.out.println(insertStmt);
        			stmt.execute(insertStmt);
        		}
        	}
    	} catch (SQLException e) {
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
