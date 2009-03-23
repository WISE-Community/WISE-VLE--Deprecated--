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
            stmt.execute("create table vledata (id bigint auto_increment, dataId bigint NOT NULL, data longtext, timestamp timestamp not null, primary key(id));");
            stmt.close();
            
            stmt = conn.createStatement();
            stmt.execute("create table username_to_dataid (id bigint auto_increment, userName varchar(20) UNIQUE NOT NULL, dataId bigint UNIQUE NOT NULL, primary key(id));");
            stmt.close();
        }
        catch (SQLException sqlExcept)
        {
            sqlExcept.printStackTrace();
        }
    }
    private static void postData(HttpServletRequest request,
			HttpServletResponse response) {
    	String userNameStr = request.getParameter("userName");
    	String idStr = request.getParameter("dataId");
    	String postDataStr = request.getParameter("data");
    	if (postDataStr == null) {
    		System.out.println("no need to save data");
    		return;
    	}
    	   try
           {
    		   stmt = conn.createStatement();
    		   ResultSet results = null;
    		   
    		   if(userNameStr != null && !userNameStr.equals("")) {
    			   //see if the username exists in the db
    			   results = stmt.executeQuery("select * from username_to_dataid where userName = '" + userNameStr + "'");
    			   
        		   if(results != null && results.next()) {
        			   //username exists in the db
        			   
        			   /*
        			    * get the corresponding dataId for the username
        			    * note: this may be different than the post parameter 
        			    * dataId due to user error, at this point we will
        			    * just ignore the dataId post parameter the user
        			    * has passed in
        			    */
        			   
        			   //retrieve the dataId column value
        			   String dataId = results.getString(3);
        			   
        			   //look for the dataId in the vledata table
        			   results = stmt.executeQuery("select * from vledata where dataId = '" + dataId + "'");
        			   
        			   //We will always create a new row in database for incoming queries
        				   stmt.execute("insert into vledata (dataId, data) values ('" + dataId + "', '" + postDataStr + "')");
        			  // }
        		   } else {
        			   //username does not exist in db
        			   
        			   if(idStr != null && !idStr.equals("")) {
        				   /*
        				    * dataId was passed in so we will create the new
        				    * row with the mapping of userName and dataId 
        				    */
        				   stmt.execute("insert into username_to_dataid (userName, dataId) values ('" + userNameStr + "', '" + idStr + "')");
        				   
        				   //look for the post parameter dataId in the vledata table
        				   results = stmt.executeQuery("select * from vledata where dataId = '" + idStr + "'");
        				   
        					//We will always create a new row in database for incoming queries 
        				   stmt.execute("insert into vledata (dataId, data) values ('" + idStr + "', '" + postDataStr + "')");
        				   //}
        			   }
        			   
        			   /*
        			    * if userName does not exist in db and dataId was not
        			    * passed in as an argument, no rows will be created
        			    * or changed because in order to create a new userName
        			    * row we also need a dataId
        			    */
        		   }
    		   } else if(idStr != null && !idStr.equals("")) {
    			   //username was not pass in but dataId was pass in
    			   
    			 //look for the post parameter dataId in the vledata table
    			   results = stmt.executeQuery("select dataId from vledata where dataId = '" + idStr + "'");
    			     			   
    			 //We will always create a new row in database for incoming queries
    			   stmt.execute("insert into vledata (dataId, data) values ('" + idStr + "', '" + postDataStr + "')");
        		  // }
    		   }
    		   
               stmt.close();
           }
           catch (SQLException sqlExcept)
           {
               sqlExcept.printStackTrace();
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
    

    private static void shutdown() {
    	try {
    		conn.close();
    	} catch(SQLException sqlExcept) {
    		sqlExcept.printStackTrace();
    	}
    }

}
