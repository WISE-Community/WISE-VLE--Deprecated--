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
		/*
		 * obtain the get parameters. there are two use cases at the moment.
		 * 1. only userId is provided (multiple userIds can be delimited by :)
		 * 		e.g. 139:143:155
		 * 2. only runId and nodeId are provided
		 */
		String idStr = request.getParameter("userId");
		String runId = request.getParameter("runId");
		String nodeId = request.getParameter("nodeId");

		ResultSet results = null;
		try {
			stmt = conn.createStatement();
			
			//do nothing if no id(s) were passed in
			if(idStr==null || idStr.equals("")) {
				/*
				 * this case is when there is no userId passed as a GET
				 * argument but runId and nodeId are passed
				 */
				
				//the format to parse the timestamp
				String dateFormat = "%a, %e %b %Y %H:%i:%S GMT";

				//the query to obtain all the data for a nodeId for a specific runId
				String selectQuery = "select userId, courseId, nodeId, nodeType, date_format(postTime, '" + dateFormat + "'), date_format(startTime, '" + dateFormat + "'), date_format(endTime, '" + dateFormat + "'), data from vle_visits where courseId=" + runId + " and nodeId='" + nodeId + "'";

				System.out.println(selectQuery);

				//run the query
				results = stmt.executeQuery(selectQuery);

				/*
				 * we need to wrap all the workgroup tags in a workgroups tag
				 * in order for the xml to be proper
				 */
				response.getWriter().write("<workgroups>");
				while(results.next()) {
					//create the xml for the workgroup tag
					StringBuffer brainstormPost = new StringBuffer();
					brainstormPost.append("<workgroup userId='" + results.getString("userId") + "'>");
					brainstormPost.append("<runId>" + results.getString("courseId") + "</runId>");
					brainstormPost.append("<nodeId>" + results.getString("nodeId") + "</nodeId>");
					brainstormPost.append("<nodeType>" + results.getString("nodeType") + "</nodeType>");
					brainstormPost.append("<postTime>" + results.getString(5) + "</postTime>");
					brainstormPost.append("<startTime>" + results.getString(6) + "</startTime>");
					brainstormPost.append("<endTime>" + results.getString(7) + "</endTime>");
					brainstormPost.append("<data>" + results.getString("data") + "</data>");
					brainstormPost.append("</workgroup>");
					
					response.getWriter().write(brainstormPost.toString());
				}
				response.getWriter().write("</workgroups>");
				
				results.close();
				stmt.close();
			} else {
				//this case is when userId is passed in as a GET argument
				
				//the get request can be for multiple ids that are delimited by ':'
				String[] ids = idStr.split(":");

				if(ids != null && ids.length > 0){


					//start the xml string
					response.getWriter().write("<vle_state>");

					//then retrieve data for each of the ids
					for(int x = 0; x < ids.length; x++) {
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
					}

					//close the xml string
					response.getWriter().write("</vle_state>");

					
					results.close();
					stmt.close();
				}
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


	}
}
