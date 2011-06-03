package background.jobs;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.Date;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.quartz.*;
import org.slf4j.*;

public class HourlyJob implements Job {
	private static final String USERNAME = "sailuser";
	private static final String PASSWORD = "sailpass";
	
	public void execute(JobExecutionContext context) throws JobExecutionException {
		try {
			//create a connection to the mysql db
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/vle_database", USERNAME, PASSWORD);
	    	
			//create a statement to run db queries
			Statement statement = conn.createStatement();
			
			//the JSONObject that we will store all the statistics in and then store in the db
			JSONObject vleStatistics = new JSONObject();
			
			//gather the StepWork statistics
			gatherStepWorkStatistics(statement, vleStatistics);
			
			//gather the Node statistics
			gatherNodeStatistics(statement, vleStatistics);
			
			//gather the Annotation statistics
			gatherAnnotationStastics(statement, vleStatistics);
			
			//gather the Hint statistics
			gatherHintStatistics(statement, vleStatistics);
			
			//prepare the statement to store the statistics into the db 
	    	PreparedStatement pstmt = conn.prepareStatement("insert into vle_statistics(timestamp, data) values(?,?)");
	    	
	    	//get the current timestamp
	    	Date date = new Date();
	    	Timestamp timestamp = new Timestamp(date.getTime());
	    	
	    	//set the values in the insert query
	    	pstmt.setTimestamp(1, timestamp);
	    	pstmt.setString(2, vleStatistics.toString());
	    	
	    	//execute the insert query
	    	pstmt.execute();
		} catch (Exception ex) {
			LoggerFactory.getLogger(getClass()).error(ex.getMessage());
		}
	}
	
	/**
	 * Gather the StepWork statistics. This includes the total number of StepWork
	 * rows as well as how many StepWork rows for each step type.
	 * @param statement the object to execute queries
	 * @param vleStatistics the JSONObject to store the statistics in
	 */
	private void gatherStepWorkStatistics(Statement statement, JSONObject vleStatistics) {
		try {
			//counter for total step work rows
			long stepWorkCount = 0;
			
			//array to hold the counts for each node type
			JSONArray stepWorkNodeTypeCounts = new JSONArray();
			
			/*
			 * the query to get the total step work rows for each node type
			 * e.g.
			 * 
			 * nodeType           | count(*)
			 * ------------------------------
			 * AssessmentListNode | 331053
			 * BrainstormNode     | 10936
			 * CarGraphNode       | 9
			 * etc.
			 * 
			 */
			ResultSet stepWorkNodeTypeCountQuery = statement.executeQuery("select node.nodeType, count(*) from stepwork, node where stepwork.node_id=node.id group by nodeType");
			
			//loop through all the rows from the query
			while(stepWorkNodeTypeCountQuery.next()) {
				//get the nodeType
				String nodeType = stepWorkNodeTypeCountQuery.getString(1);
				
				//get the count
				long nodeTypeCount = stepWorkNodeTypeCountQuery.getLong(2);
				
				try {
					if(nodeType != null && !nodeType.toLowerCase().equals("null")) {
						//create the object that will store the nodeType and count
						JSONObject stepWorkNodeTypeObject = new JSONObject();
						stepWorkNodeTypeObject.put("nodeType", nodeTypeCount);
						stepWorkNodeTypeObject.put("count", nodeType);
						
						//put the object into our array
						stepWorkNodeTypeCounts.put(stepWorkNodeTypeObject);
						
						//update the total count
						stepWorkCount += nodeTypeCount;
					}
				} catch(JSONException e) {
					e.printStackTrace();
				}
			}
			
			//add the step work statistics to the vleStatistics object
			vleStatistics.put("individualStepWorkNodeTypeCounts", stepWorkNodeTypeCounts);
			vleStatistics.put("totalStepWorkCount", stepWorkCount);
		} catch(SQLException e) {
			e.printStackTrace();
		} catch(JSONException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * Gather the Annotation statistics. This includes the total number of Annotation
	 * rows as well as how many Annotation nodes for each annotation type.
	 * @param statement the object to execute queries
	 * @param vleStatistics the JSONObject to store the statistics in
	 */
	private void gatherAnnotationStastics(Statement statement, JSONObject vleStatistics) {
		try {
			//get the total number of annotations
			ResultSet annotationCountQuery = statement.executeQuery("select count(*) from annotation");
			
			if(annotationCountQuery.first()) {
				long annotationCount = annotationCountQuery.getLong(1);
				
				try {
					//add the total annotation count to the vle statistics
					vleStatistics.put("totalAnnotationCount", annotationCount);
				} catch(JSONException e) {
					e.printStackTrace();
				}
			}
			
			//the array to store the counts for each annotation type
			JSONArray annotationCounts = new JSONArray();
			
			//get the total number of comment annotations
			ResultSet annotationCommentCountQuery = statement.executeQuery("select count(*) from annotation_comment");
			
			if(annotationCommentCountQuery.first()) {
				long annotationCommentCount = annotationCommentCountQuery.getLong(1);
				
				try {
					//create an object to store the type and count in
					JSONObject annotationCommentObject = new JSONObject();
					annotationCommentObject.put("annotationType", "comment");
					annotationCommentObject.put("count", annotationCommentCount);
					
					annotationCounts.put(annotationCommentObject);
				} catch(JSONException e) {
					e.printStackTrace();
				}
			}
			
			//get the total number of flag annotations
			ResultSet annotationFlagCountQuery = statement.executeQuery("select count(*) from annotation_flag");
			
			if(annotationFlagCountQuery.first()) {
				long annotationFlagCount = annotationFlagCountQuery.getLong(1);
				
				try {
					//create an object to store the type and count in
					JSONObject annotationFlagObject = new JSONObject();
					annotationFlagObject.put("annotationType", "flag");
					annotationFlagObject.put("count", annotationFlagCount);
					
					annotationCounts.put(annotationFlagObject);
				} catch(JSONException e) {
					e.printStackTrace();
				}
			}
			
			//get the total number of score annotations
			ResultSet annotationScoreCountQuery = statement.executeQuery("select count(*) from annotation_score");
			
			if(annotationScoreCountQuery.first()) {
				long annotationScoreCount = annotationScoreCountQuery.getLong(1);
				
				try {
					//create an object to store the type and count in
					JSONObject annotationScoreObject = new JSONObject();
					annotationScoreObject.put("annotationType", "score");
					annotationScoreObject.put("count", annotationScoreCount);
					
					annotationCounts.put(annotationScoreObject);	
				} catch(JSONException e) {
					e.printStackTrace();
				}
			}
			
			//add the annotation statistics to the vle statistics
			vleStatistics.put("individualAnnotationCounts", annotationCounts);			
		} catch(SQLException e) {
			e.printStackTrace();
		} catch(JSONException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * Get the node statistics. This includes the total number of step nodes as well
	 * as how many step nodes for each node type.
	 * @param statement the object to execute queries
	 * @param vleStatistics the JSONObject to store the statistics in
	 */
	private void gatherNodeStatistics(Statement statement, JSONObject vleStatistics) {
		try {
			//counter for the total number of nodes
			long nodeCount = 0;
			
			//array to hold all the counts for each node type
			JSONArray nodeTypeCounts = new JSONArray();
			
			/*
			 * the query to get the total number of nodes for each node type
			 * e.g.
			 * 
			 * nodeType           | count(*)
			 * ------------------------------
			 * AssessmentListNode | 3408
			 * BrainstormNode     | 98
			 * CarGraphNode       | 9
			 * etc.
			 * 
			 */ 
			ResultSet nodeTypeCountQuery = statement.executeQuery("select nodeType, count(*) from node group by nodeType");
			
			//loop through all the rows
			while(nodeTypeCountQuery.next()) {
				//get a node type and the count
				String nodeType = nodeTypeCountQuery.getString(1);
				long nodeTypeCount = nodeTypeCountQuery.getLong(2);
				
				if(nodeType != null && !nodeType.toLowerCase().equals("null")) {
					try {
						//create an object to hold the node type and count
						JSONObject nodeTypeObject = new JSONObject();
						nodeTypeObject.put("nodeType", nodeType);
						nodeTypeObject.put("count", nodeTypeCount);
						
						//add the object to our array
						nodeTypeCounts.put(nodeTypeObject);
						
						//update the total count
						nodeCount += nodeTypeCount;
					} catch(JSONException e) {
						e.printStackTrace();
					}
				}
			}
			
			//add the counts to the vle statistics
			vleStatistics.put("individualNodeTypeCounts", nodeTypeCounts);
			vleStatistics.put("totalNodeCount", nodeCount);			
		} catch(SQLException e) {
			e.printStackTrace();
		} catch(JSONException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * Get the number of times hints were viewed by a student
	 * @param statement the object to execute queries
	 * @param vleStatistics the JSONObject to store the statistics in
	 */
	private void gatherHintStatistics(Statement statement, JSONObject vleStatistics) {
		try {
			//get the total number of times a hint was viewed by a student
			ResultSet hintCountQuery = statement.executeQuery("select count(*) from stepwork where data like '%hintStates\":[{%]%'");
			
			if(hintCountQuery.first()) {
				//add the count to the vle statistics
				long hintCount = hintCountQuery.getLong(1);
				vleStatistics.put("totalHintViewCount", hintCount);
			}			
		} catch(SQLException e) {
			e.printStackTrace();
		} catch(JSONException e) {
			e.printStackTrace();
		}
	}
}