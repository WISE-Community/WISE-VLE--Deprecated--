/**
 * 
 */
package vle;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet for handling GETting of vle data
 * @author hirokiterashima
 * @author geoffreykwan
 * @author patricklawler
 */
public class VLEGetData extends VLEServlet {

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
    		response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return;
		}

		//the get request can be for multiple ids that are delimited by ':'
		String[] ids = idStr.split(":");

		if(ids != null && ids.length > 0){
			try {
				stmt = conn.createStatement();
				ResultSet results = null;

				//start the xml string
				response.getWriter().write("<vle_state>");

				//then retrieve data for each of the ids
				for(int x = 0; x < ids.length; x++) {
					try {
						//each student's data will be wrapped in workgroup tags
						StringBuffer vleState = new StringBuffer("<workgroup userName='" + ids[x] + "' userId='" + ids[x] + "'>");

						//start this student's vle_state
						vleState.append("<vle_state>");

						//the format to parse the timestamp
						String dateFormat = "%a, %e %b %Y %H:%i:%S GMT";

						//the query to obtain all the data for a student
						String selectQuery = "select nodeId, nodeType, date_format(startTime, '" + dateFormat + "'), date_format(endTime, '" + dateFormat + "'), data from vle_visits where userId=" + ids[x];
						//System.out.println(selectQuery);
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
				response.getWriter().write("</vle_state>");

				//close the mysql connections
				results.close();
				stmt.close();
			} catch (Exception e) {
				e.printStackTrace();
			}

		}
	}
}
