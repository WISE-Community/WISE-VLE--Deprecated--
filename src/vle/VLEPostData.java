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
            stmt.execute("create table vledata (id bigint auto_increment, data longtext, primary key(id))");
            stmt.close();
        }
        catch (SQLException sqlExcept)
        {
            sqlExcept.printStackTrace();
        }
    }
    private static void postData(HttpServletRequest request,
			HttpServletResponse response) {
    	String idStr = request.getParameter("dataId");
    	String postDataStr = request.getParameter("data");
    	if (idStr == null || postDataStr == null ||
    			idStr == "") {
    		System.out.println("no need to save data");
    		return;
    	}
    	   try
           {
    		   stmt = conn.createStatement();

    		   //check if the id already has an entry in the table
    		   ResultSet results = stmt.executeQuery("select * from vledata where dataId=" + idStr);
    		   
    		   if(results.next()) {
    			   //the id already exists so just update that row
    			   System.out.println("update vledata set data='" + postDataStr + "' where dataId=" + idStr);
    			   stmt.execute("update vledata set data='" + postDataStr + "' where dataId=" + idStr);
               } else {
            	   //the id does not exist so we will create a new row
            	   System.out.println("insert into vledata (data, dataId) values ('" + postDataStr + "', '" + idStr + "')");
            	   stmt.execute("insert into vledata (data, dataId) values ('" + postDataStr + "', '" + idStr + "')");
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
    

    private static void shutdown()
    {
    	 try
         {
             stmt = conn.createStatement();
             stmt.execute("SHUTDOWN");
             stmt.close();
         }
         catch (SQLException sqlExcept)
         {
             sqlExcept.printStackTrace();
         }    	
        try
        {
            if (stmt != null)
            {
                stmt.close();
            }
            if (conn != null)
            {
                conn.close();
            }           
        }
        catch (SQLException sqlExcept)
        {
            
        }

    }
}
