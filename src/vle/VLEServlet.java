/**
 * 
 */
package vle;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.http.HttpServlet;

/**
 * Parent class of all servlets relating to VLE.
 * @author hirokiterashima
 *
 */
public class VLEServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	protected static Connection conn = null;
	protected static Statement stmt = null;

	protected static void createConnection()
	{
		try
		{
			//create a connection to the mysql db
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/vle_database", "sailuser", "sailpass");
		}
		catch (Exception except)
		{
			except.printStackTrace();
		}
	}

	protected static void shutdown() {
		try {
			conn.close();
		} catch(SQLException sqlExcept) {
			sqlExcept.printStackTrace();
		}
	}
	
    private static void createTable()
    {
        try
        {
            stmt = conn.createStatement();
            stmt.execute("CREATE TABLE vle_visits (id bigint(20) NOT NULL auto_increment, userId bigint(20) default NULL, courseId bigint(20) default NULL, location bigint(20) default NULL, nodeId varchar(20) default NULL, nodeType varchar(20) default NULL, postTime timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, startTime timestamp NOT NULL default '0000-00-00 00:00:00', endTime timestamp NOT NULL default '0000-00-00 00:00:00', nodeStates longtext, PRIMARY KEY (id)) ENGINE=MyISAM AUTO_INCREMENT=1571 DEFAULT CHARSET=utf8;");
            stmt.close();
        }
        catch (SQLException sqlExcept)
        {
            sqlExcept.printStackTrace();
        }
    }
	
	public static void main(String[] args)
	{
		createConnection();
		createTable();
		shutdown();
	}


}
