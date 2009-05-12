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
import java.util.LinkedList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author hirokiterashima
 *
 */
public class VLEGetData extends HttpServlet {


	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
		createConnection();
		getData(request, response);
		shutdown();
	}


	/**
	 * Takes in userId(s) and returns xml that contains the student data
	 * for all of those userId(s)
	 * @param request should contain a parameter userId that is a colon
	 * 		delimited string of userIds
	 * @param response
	 */
	private static void getData(HttpServletRequest request,
			HttpServletResponse response) {
		//obtain the userId get parameter
		String idStr = request.getParameter("userId");

		//do nothing if no id(s) were passed in
		if(idStr==null || idStr == ""){
			return;
		}

		//the get request can be for multiple ids that are delimited by ':'
		String[] ids = idStr.split(":");

		if(ids != null && ids.length > 0){
			try {
				stmt = conn.createStatement();
				ResultSet results = null;

				//start the xml string
				response.getWriter().write("<vle_states>");

				//then retrieve data for each of the ids
				for(int x = 0; x < ids.length; x++) {
					try {
						//each student's data will be wrapped in workgroup tags
						StringBuffer vleState = new StringBuffer("<workgroup userId='" + ids[x] + "'>");

						//start this student's vle_state
						vleState.append("<vle_state>");

						//the format to parse the timestamp
						String dateFormat = "%a, %e %b %Y %H:%i:%S GMT";

						//the query to obtain all the data for a student
						String selectQuery = "select nodeId, nodeType, date_format(startTime, '" + dateFormat + "'), date_format(endTime, '" + dateFormat + "'), data from vle_visits where userId=" + ids[x];

						//run the query
						results = stmt.executeQuery(selectQuery);

						//loop through all the rows that were returned, each row is a node_visit
						while(results.next()) {
							//compile the xml that we will return
							vleState.append("<node_visit>");
							vleState.append("<node>");
							vleState.append("<type>" + results.getString("nodeType") + "</type>");
							vleState.append("<id>" + results.getString("nodeId") + "</id>");
							vleState.append("</node>");
							vleState.append("<nodeStates>" + results.getString("data") + "</nodeStates>");
							
							//the visitStartTime column is the 3rd in our selectQuery from above
							vleState.append("<visitStartTime>" + results.getString(3) + "</visitStartTime>");
							
							//the visitEndTime column is the 4th in our selectQuery from above
							vleState.append("<visitEndTime>" + results.getString(4) + "</visitEndTime>");
							
							vleState.append("</node_visit>");
						}

						//close this student's vle_state
						vleState.append("</vle_state>");

						//close this student's workgroup tag
						vleState.append("</workgroup>");

						response.getWriter().write(vleState.toString());
					} catch (SQLException sqlExcept){
						sqlExcept.printStackTrace();
					} catch (IOException e){
						e.printStackTrace();
					}
				}
				
				//close the xml string
				response.getWriter().write("</vle_states>");

				//close the mysql connections
				results.close();
				stmt.close();
			} catch (Exception e) {
				e.printStackTrace();
			}

		}
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
			stmt.execute("create table vledata (id bigint auto_increment, dataId bigint NOT NULL, data longtext, timestamp timestamp not null, primary key(id));");
			stmt.close();

			stmt = conn.createStatement();
			stmt.execute("create table username_to_dataid (id bigint auto_increment, userName varchar(20) NOT NULL, dataId bigint NOT NULL, primary key(id));");
			stmt.close();
		}
		catch (SQLException sqlExcept)
		{
			sqlExcept.printStackTrace();
		}
	}


	private static void printData(HttpServletRequest request, HttpServletResponse response)
	{
//		String userNameStr = request.getParameter("userName");
//		String idStr = request.getParameter("dataId");
//
//		try
//		{
//			stmt = conn.createStatement();
//			ResultSet results = null;
//
//			/*
//			 * We will try to look up the data for the userName but
//			 * if that was not passed as an argument we will look
//			 * up the data for the dataId  
//			 */
//			if(idStr != null && !idStr.equals("")) {
//				//user has requested data for a dataid
//				results = stmt.executeQuery("select data from vledata where dataId = '" + idStr + "'");
//			} else if(userNameStr != null && !userNameStr.equals("")) {
//				//user has requested data for a username
//				results = stmt.executeQuery("select vledata.data from username_to_dataid, vledata where username_to_dataid.dataId = vledata.dataId and username_to_dataid.userName = '" + userNameStr + "'");
//			}
//
//			if(results != null) {
//				while(results.next())
//				{
//					response.getWriter().print(results.getString(1));
//				}
//				results.close();
//			}
//
//			stmt.close();
//		}
//		catch (SQLException sqlExcept)
//		{
//			sqlExcept.printStackTrace();
//		} catch (IOException e) {
//			System.err.println("could not write to response");
//			e.printStackTrace();
//		}
	}


	private static void shutdown() {
		try {
			conn.close();
		} catch(SQLException sqlExcept) {
			sqlExcept.printStackTrace();
		}
	}

}
