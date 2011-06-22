package vle.web;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Vector;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import utils.FileManager;
import vle.VLEServlet;
import vle.domain.annotation.Annotation;
import vle.domain.annotation.AnnotationComment;
import vle.domain.annotation.AnnotationScore;
import vle.domain.ideabasket.IdeaBasket;
import vle.domain.node.Node;
import vle.domain.peerreview.PeerReviewWork;
import vle.domain.user.UserInfo;
import vle.domain.work.StepWork;
import vle.domain.work.StepWorkAssessmentList;
import vle.domain.work.StepWorkBS;
import vle.domain.work.StepWorkFillin;
import vle.domain.work.StepWorkHtml;
import vle.domain.work.StepWorkMC;
import vle.domain.work.StepWorkMatchSequence;
import vle.domain.work.StepWorkNote;
import vle.domain.work.StepWorkOR;

public class VLEGetXLS extends VLEServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	//the max number of step work columns we need, only used for "allStudentWork"
	private int maxNumberOfStepWorkParts = 1;
	
	private HashMap<String, JSONObject> nodeIdToNodeContent = new HashMap<String, JSONObject>();
	
	private HashMap<String, JSONObject> nodeIdToNode = new HashMap<String, JSONObject>();

	private HashMap<String, String> nodeIdToNodeTitles = new HashMap<String, String>();
	
	private HashMap<String, String> nodeIdToNodeTitlesWithPosition = new HashMap<String, String>();
	
	private HashMap<Integer, String> workgroupIdToPeriodName = new HashMap<Integer, String>();
	
	private HashMap<Integer, String> workgroupIdToStudentLogins = new HashMap<Integer, String>();
	
	private HashMap<Long, JSONArray> workgroupIdToStudentAttendance = new HashMap<Long, JSONArray>();
	
	private List<String> nodeIdList = new Vector<String>();
	
	//the start time of the run (when the run was created)
	private String startTime = "N/A";
	
	//the end time of the run (when the run was archived)
	private String endTime = "N/A";
	
	//holds the teacher's username and workgroupid
	private JSONObject teacherUserInfoJSONObject;
	
	//run and project attributes
	private String runId = "";
	private String runName = "";
	private String projectId = "";
	private String parentProjectId = "";
	private String projectName = "";
	
	//holds all the teacher workgroup ids
	private List<String> teacherWorkgroupIds = null;
	
	private static long debugStartTime = 0;
	
	/**
	 * Clear the instance variables because only one instance of a servlet
	 * is ever created
	 */
	private void clearVariables() {
		//the max number of step work columns we need, only used for "allStudentWork"
		maxNumberOfStepWorkParts = 1;
		
		//mappings for the project and user
		nodeIdToNodeContent = new HashMap<String, JSONObject>();
		nodeIdToNode = new HashMap<String, JSONObject>();
		nodeIdToNodeTitles = new HashMap<String, String>();
		nodeIdToNodeTitlesWithPosition = new HashMap<String, String>();
		workgroupIdToPeriodName = new HashMap<Integer, String>();
		workgroupIdToStudentLogins = new HashMap<Integer, String>();
		workgroupIdToStudentAttendance = new HashMap<Long, JSONArray>();
		
		//the list of node ids in the project
		nodeIdList = new Vector<String>();
		
		//the start time of the run (when the run was created)
		startTime = "N/A";
		
		//the end time of the run (when the run was archived)
		endTime = "N/A";
		
		//holds the teacher's username and workgroupid
		teacherUserInfoJSONObject = null;
		
		//run and project attributes
		runId = "";
		runName = "";
		projectId = "";
		parentProjectId = "";
		projectName = "";
		
		//holds all the teacher workgroup ids
		teacherWorkgroupIds = null;
	}
	
	/**
	 * Compare two different millisecond times
	 * @param time1 the earlier time (smaller)
	 * @param time2 the later time (larger)
	 * @return the difference between the times in seconds
	 */
	private long getDifferenceInSeconds(long time1, long time2) {
		return (time2 - time1) / 1000;
	}
	
	/**
	 * Display the difference between the current time and the
	 * start time
	 * @param label the label to display with the time difference
	 */
	private void displayCurrentTimeDifference(String label) {
		long currentTime = new Date().getTime();
		System.out.println(label + ": " + getDifferenceInSeconds(debugStartTime, currentTime));
	}
	
	/**
	 * Generates and returns an excel xls of exported student data.
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		/*
		 * clear the instance variables because only one instance of a servlet
		 * is ever created
		 */
		clearVariables();
		
		//obtain the start time for debugging purposes
		debugStartTime = new Date().getTime();

		//holds the workgroup ids and period ids of the students
		String classmateUserInfos = (String) request.getAttribute("classmateUserInfos");

		//holds the workgroup id of the teacher
		String teacherUserInfo = (String) request.getAttribute("teacherUserInfo");
		
		//holds the workgroup ids of the shared teachers
		String sharedTeacherUserInfos = (String) request.getAttribute("sharedTeacherUserInfos");
		
		//holds the run info
		String runInfo = (String) request.getAttribute("runInfo");
		
		try {
			JSONObject runInfoJSONObject = new JSONObject(runInfo);
			
			if(runInfoJSONObject.has("startTime")) {
				//get the start time as a string
				String startTimeString = runInfoJSONObject.getString("startTime");
				
				if(startTimeString != null && !startTimeString.equals("null") && !startTimeString.equals("")) {
					long startTimeLong = Long.parseLong(startTimeString);
					
					Timestamp startTimeTimestamp = new Timestamp(startTimeLong);
					
					//get the date the run was created
					startTime = timestampToFormattedString(startTimeTimestamp);					
				}
			}
			
			if(runInfoJSONObject.has("endTime")) {
				//get the end time as a string
				String endTimeString = runInfoJSONObject.getString("endTime");
				
				if(endTimeString != null && !endTimeString.equals("null") && !endTimeString.equals("")) {
					long endTimeLong = Long.parseLong(endTimeString);
					
					Timestamp endTimeTimestamp = new Timestamp(endTimeLong);
					
					//get the date the run was archived
					endTime = timestampToFormattedString(endTimeTimestamp);
				}
			}
		} catch (JSONException e1) {
			e1.printStackTrace();
		}
		
		//get the student attendance data which is a JSONArray string
		String studentAttendanceString = (String) request.getAttribute("studentAttendance");
		
		JSONArray studentAttendanceArray = new JSONArray();
		try {
			//create the JSONArray from the student attendance data
			studentAttendanceArray = new JSONArray(studentAttendanceString);
		} catch (JSONException e1) {
			e1.printStackTrace();
		}
		
		//parse the student attendance data so we can query it later
		parseStudentAttendance(studentAttendanceArray);
		
		//the List that will hold all the workgroup ids
		Vector<String> workgroupIds = new Vector<String>();
		
		//get the run and project attributes
		runId = request.getParameter("runId");
		runName = request.getParameter("runName");
		projectId = request.getParameter("projectId");
		projectName = request.getParameter("projectName");
		parentProjectId = request.getParameter("parentProjectId");
		
		//the export type "latestStudentWork" or "allStudentWork"
		String exportType = request.getParameter("exportType");
		
		//get the path of the project file on the server
		String projectPath = request.getParameter("projectPath");
		
		//create a file handle to the project file
		File projectFile = new File(projectPath);
		FileManager fileManager = new FileManager();
		
		//the hash map to store workgroup id to period id
		HashMap<Integer, Integer> workgroupIdToPeriodId = new HashMap<Integer, Integer>();
		
		String teacherWorkgroupId = "";
		
		//create an array to hold all the teacher workgroup ids
		teacherWorkgroupIds = new ArrayList<String>();
		
		JSONObject project = null;
		
		try {
			//get the project JSON object
			project = new JSONObject(fileManager.getFileText(projectFile));
			
			//create the map of node ids to node titles
			makeNodeIdToNodeTitleAndNodeMap(project);
			
			/*
			 * create the list of node ids in the order they appear in the project.
			 * this also creates the map of node ides to node titles with positions
			 */
			makeNodeIdList(project);
			
			//get the nodes
			JSONArray nodes = project.getJSONArray("nodes");
			
			//loop through all the nodes
			for(int x = 0; x < nodes.length(); x++){
				//get a node
				JSONObject node = nodes.getJSONObject(x);
				
				try {
					//get the text from the file
					String fileText = fileManager.getFileText(new File(projectFile.getParentFile(), node.getString("ref")));
					
					//get the content for the node
					JSONObject nodeContent = new JSONObject(fileText);
					
					//put an entry into the hashmap with key as node id and value as JSON node content
					nodeIdToNodeContent.put(node.getString("identifier"), nodeContent);
				} catch(IOException e) {
					e.printStackTrace();
				} catch(JSONException e) {
					e.printStackTrace();
				}
			}
			
			//get the array of classmates
			JSONArray classmateUserInfosJSONArray = new JSONArray(classmateUserInfos);
			
			//get the teacher user info
			teacherUserInfoJSONObject = new JSONObject(teacherUserInfo);
			
			//get the owner teacher workgroup id
			teacherWorkgroupId = teacherUserInfoJSONObject.getString("workgroupId");
			
			//add the owner teacher
			teacherWorkgroupIds.add(teacherWorkgroupId);
			
			//get the shared teacher user infos
			JSONArray sharedTeacherUserInfosJSONArray = new JSONArray(sharedTeacherUserInfos);
			
			//loop through all the shared teacher user infos
			for(int z=0; z<sharedTeacherUserInfosJSONArray.length(); z++) {
				//get a shared teacher
				JSONObject sharedTeacherJSONObject = (JSONObject) sharedTeacherUserInfosJSONArray.get(z);
				
				if(sharedTeacherJSONObject != null) {
					if(sharedTeacherJSONObject.has("workgroupId")) {
						//get the shared teacher workgroup id
						String sharedTeacherWorkgroupId = sharedTeacherJSONObject.getString("workgroupId");
						
						//add the shared teacher workgroup id to the array
						teacherWorkgroupIds.add(sharedTeacherWorkgroupId);
					}
				}
			}
			
			
			//loop through all the classmates
			for(int y=0; y<classmateUserInfosJSONArray.length(); y++) {
				//get a classmate
				JSONObject classmate = classmateUserInfosJSONArray.getJSONObject(y);
				
				//make sure workgroupId and periodId exist and are not null
				if(classmate.has("workgroupId") && !classmate.isNull("workgroupId")) {
					//get the workgroup id for the classmate
					int workgroupId = classmate.getInt("workgroupId");
					
					if(classmate.has("periodId") && !classmate.isNull("periodId")) {
						//get the period id for the classmate
						int periodId = classmate.getInt("periodId");
						
						//put an entry into the hashmap with key as workgroup id and value as period id
						workgroupIdToPeriodId.put(workgroupId, periodId);
					}
					
					if(classmate.has("periodName") && !classmate.isNull("periodName")) {
						//get the period name such as 1, 2, 3, or 4, etc.
						String periodName = classmate.getString("periodName");
						workgroupIdToPeriodName.put(workgroupId, periodName);
					}
					
					if(classmate.has("studentLogins") && !classmate.isNull("studentLogins")) {
						/*
						 * get the student logins, this is a singls string with the logins
						 * separated by ':'
						 */
						String studentLogins = classmate.getString("studentLogins");
						workgroupIdToStudentLogins.put(workgroupId, studentLogins);
					}
					
					if(classmate.has("periodId") && !classmate.isNull("periodId") &&
							classmate.has("periodName") && !classmate.isNull("periodName") &&
							classmate.has("studentLogins") && !classmate.isNull("studentLogins")) {

						//add the workgroup id string to the List of workgroup ids
						workgroupIds.add(workgroupId + "");
					}
				}
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		//the variable that will hold the excel document object
		Workbook wb = null;
		
		if(exportType == null) {
			
		} else if(exportType.equals("latestStudentWork")) {
			wb = getLatestStudentWorkXLSExport(nodeIdToNodeTitlesWithPosition, workgroupIds, nodeIdList, runId, nodeIdToNode, nodeIdToNodeContent, workgroupIdToPeriodId, teacherWorkgroupIds);
		} else if(exportType.equals("allStudentWork")) {
			wb = getAllStudentWorkXLSExport(nodeIdToNodeTitlesWithPosition, workgroupIds, runId, nodeIdToNode, nodeIdToNodeContent, workgroupIdToPeriodId, teacherWorkgroupIds);
		} else if(exportType.equals("ideaBaskets")) {
			wb = getIdeaBasketsExcelExport(nodeIdToNodeTitlesWithPosition, workgroupIds, runId, nodeIdToNode, nodeIdToNodeContent, workgroupIdToPeriodId, teacherWorkgroupIds);
		} else if(exportType.equals("explanationBuilderWork")) {
			wb = getExplanationBuilderWorkExcelExport(nodeIdToNodeTitlesWithPosition, workgroupIds, runId, nodeIdToNode, nodeIdToNodeContent, workgroupIdToPeriodId, teacherWorkgroupIds);
		}
		
		/*
		 * set the content type to an excel xls so the user is prompted to save
		 * the file as an excel xls
		 */
	    response.setContentType("application/vnd.ms-excel");
	    
	    if(exportType == null) {
	    	response.setHeader("Content-Disposition", "attachment; filename=\"" + projectName + "-" + runId + ".xls\"");
	    } else if(exportType.equals("latestStudentWork")) {
	    	response.setHeader("Content-Disposition", "attachment; filename=\"" + projectName + "-" + runId + "-latest-student-work.xls\"");
	    } else if(exportType.equals("allStudentWork")) {
	    	response.setHeader("Content-Disposition", "attachment; filename=\"" + projectName + "-" + runId + "-all-student-work.xls\"");
	    } else if(exportType.equals("ideaBaskets")) {
	    	response.setHeader("Content-Disposition", "attachment; filename=\"" + projectName + "-" + runId + "-idea-baskets.xls\"");
	    } else if(exportType.equals("explanationBuilderWork")) {
	    	response.setHeader("Content-Disposition", "attachment; filename=\"" + projectName + "-" + runId + "-explanation-builder-work.xls\"");
	    } else {
	    	response.setHeader("Content-Disposition", "attachment; filename=\"" + projectName + "-" + runId + ".xls\"");	
	    }
		
		//get the response output stream
		ServletOutputStream outputStream = response.getOutputStream();
		
		if(wb != null) {
			//write the excel xls to the output stream
			wb.write(outputStream);
		}
	}

	/**
	 * Make the list of node ids
	 * 
	 * Note: makeNodeIdToNodeTitlesMap() must be called before this function
	 * 
	 * @param project the project JSON object
	 */
	private void makeNodeIdList(JSONObject project) {
		//make a new Vector and set it to the global list object
		nodeIdList = new Vector<String>();
		
		try {
			//get the sequences
			JSONArray sequences = project.getJSONArray("sequences");
			
			//get the start point of the project
			String startPoint = project.getString("startPoint");
			
			//pass startsequence to recursive function that traverses activities and steps
			traverseNodeIdsToMakeNodeIdList(sequences, startPoint, "", 1, startPoint);
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * Retrieves the JSONObject for a sequence with the given sequenceId
	 * @param sequences a JSONArray of sequence JSONObjects
	 * @param sequenceId the identifier of the sequence we want
	 * @return the sequence JSONObject or null if we did not find it
	 */
	private JSONObject getProjectSequence(JSONArray sequences, String sequenceId) {
		//loop through all the sequences
		for(int x=0; x<sequences.length(); x++) {
			try {
				//get a sequence
				JSONObject sequence = sequences.getJSONObject(x);
				
				if(sequence != null) {
					//check if the identifier of the sequence is the one we want
					if(sequence.getString("identifier").equals(sequenceId)) {
						//return the sequence since we have found it
						return sequence;
					}
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		
		//we did not find the sequence we wanted
		return null;
	}
	
	/**
	 * Traverses the sequences in the project file to create a list of nodes in 
	 * the order that they appear in the project and at the same time determining
	 * the position of each node (e.g. 1.1, 1.2, 2.1, 2.2, etc.)
	 * 
	 * @param sequences the JSONArray of sequences
	 * @param identifier the id of the sequence or node we are currently on
	 * @param positionSoFar the position we have traversed down to so far
	 * e.g. if we are on Activity 2
	 * positionSoFar will be "2."
	 * @param nodePosition the position within the current sequence
	 * e.g. if we are on Activity 2, Step 3
	 * @param startPoint the id of the start point sequence of the project
	 * nodePosition will be 3
	 */
	private void traverseNodeIdsToMakeNodeIdList(JSONArray sequences, String identifier, String positionSoFar, int nodePosition, String startPoint) {
		try {
			//try to get the project sequence with the given identifier
			JSONObject projectSequence = getProjectSequence(sequences, identifier);
			
			if(projectSequence == null) {
				//the identifier actually points to a node, this is our base case
				
				//add the identifier to our list of nodes
				nodeIdList.add(identifier);
				
				//obtain the title of the node
				String nodeTitle = nodeIdToNodeTitles.get(identifier);
				
				//add the pre-pend the position to the title
				String nodeTitleWithPosition = positionSoFar + nodePosition + " " + nodeTitle;
				
				//add the title with position to the map
				nodeIdToNodeTitlesWithPosition.put(identifier, nodeTitleWithPosition);
			} else {
				//the identifier points to a sequence so we need to loop through its refs
				JSONArray refs = projectSequence.getJSONArray("refs");
				
				if(!identifier.equals(startPoint)) {
					/*
					 * only do this for sequences that are not the startsequence otherwise
					 * all the positions would start with "1."
					 * so instead of Activity 2, Step 5 being 1.2.5 we really just want 2.5
					 */
					positionSoFar = positionSoFar + nodePosition + ".";
				}
				
				//loop through all the refs
				for(int x=0; x<refs.length(); x++) {
					//get the identifier for a ref
					String refIdentifier = refs.getString(x);
					
					//recursively call the traverse function on the refs
					traverseNodeIdsToMakeNodeIdList(sequences, refIdentifier, positionSoFar, x + 1, startPoint);
				}
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * Create a map of node id to node titles by looping through the array
	 * of nodes in the project file and creating an entry in the map
	 * for each node
	 * @param project the project JSON object
	 * @return a map of node id to node titles
	 */
	private void makeNodeIdToNodeTitleAndNodeMap(JSONObject project) {
		nodeIdToNodeTitles = new HashMap<String, String>();
		nodeIdToNode = new HashMap<String, JSONObject>();
		
		try {
			//get the array of nodes defined in the project
			JSONArray nodesJSONArray = project.getJSONArray("nodes");
			
			//loop through all the nodes
			for(int x=0; x<nodesJSONArray.length(); x++) {
				//get a node
				JSONObject node = nodesJSONArray.getJSONObject(x);
				
				if(node != null) {
					//obtain the id and title
					String nodeId = node.getString("identifier");
					String title = node.getString("title");
					
					if(nodeId != null && title != null) {
						//put the id and title into the map
						nodeIdToNodeTitles.put(nodeId, title);
					}
					
					if(nodeId != null) {
						nodeIdToNode.put(nodeId, node);
					}
				}
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	
	/**
	 * Obtain the node type for the step work
	 * @param stepWork a StepWork object
	 * @return the node type for the StepWork
	 */
	private String getNodeTypeFromStepWork(StepWork stepWork) {
		//try to get the node type from the step work
		String nodeType = stepWork.getNode().getNodeType();
		
		//check if the StepWork object already has the node type set
		if(nodeType != null) {
			//return the node type from the StepWork
			
			/*
			 * remove the "Node" portion of the node type
			 * e.g. NoteNode just becomes Note
			 */
			nodeType = nodeType.replace("Node", "");
			
			return nodeType;
		} else {
			/*
			 * check what type of StepWork object it really is and
			 * return the appropriate node type
			 */
			if(stepWork instanceof StepWorkOR) {
				return "OpenResponse";
	    	} else if(stepWork instanceof StepWorkBS) {
	    		return "Brainstorm";
	    	} else if(stepWork instanceof StepWorkFillin) {
	    		return "Fillin";
	    	} else if(stepWork instanceof StepWorkHtml) {
	    		return "Html";
	    	} else if(stepWork instanceof StepWorkMatchSequence) {
	    		return "MatchSequence";
	    	} else if(stepWork instanceof StepWorkMC) {
	    		return "MultipleChoice";
	    	} else if(stepWork instanceof StepWorkNote) {
	    		return "Note";
	    	} else {
	    		return "";
	    	}
		}
	}
	
	/**
	 * Get the step works only for a specific node id
	 * @param stepWorks a list of StepWork objects
	 * @param nodeId the node id we want student work for
	 * @return a list of StepWork objects that are filtered
	 * for a node id
	 */
	private List<StepWork> getStepWorksForNodeId(List<StepWork> stepWorks, String nodeId) {
		//the list of StepWorks that will contain the StepWorks we want
		List<StepWork> filteredStepWorks = new Vector<StepWork>();
		
		//iterator for the list of StepWorks we will filter
		Iterator<StepWork> stepWorksIterator = stepWorks.iterator();
		
		//loop through all the StepWorks
		while(stepWorksIterator.hasNext()) {
			//get a StepWork
			StepWork stepWork = stepWorksIterator.next();
			
			//get the node id for the StepWork
			String stepWorkNodeId = stepWork.getNode().getNodeId();
			
			//see if the node id matches the node id we are looking for
			if(stepWorkNodeId != null && stepWorkNodeId.equals(nodeId)) {
				/*
				 * add the StepWork to our list of StepWorks that have the
				 * node id we want
				 */
				filteredStepWorks.add(stepWork);
			}
		}
		
		//return the list of StepWorks that are for the node id we want
		return filteredStepWorks;
	}
	
	/**
	 * Creates an excel workbook that contains student navigation data
	 * Each sheet represents one student's work. The rows in each
	 * sheet are sequential so the earliest navigation data is at
	 * the top and the latest navigation data is at the bottom
	 * @param nodeIdToNodeTitlesMap a HashMap that contains nodeId to
	 * nodeTitle mappings
	 * @param workgroupIdsArray a String array containing workgroupIds
	 * @return an excel workbook that contains the student navigation
	 */
	private XSSFWorkbook getAllStudentWorkXLSExport(
			HashMap<String, String> nodeIdToNodeTitlesMap,
			Vector<String> workgroupIds, 
			String runId,
			HashMap<String, JSONObject> nodeIdToNode,
			HashMap<String, JSONObject> nodeIdToNodeContent,
			HashMap<Integer, Integer> workgroupIdToPeriodId,
			List<String> teacherWorkgroupIds) {

		XSSFWorkbook wb = new XSSFWorkbook();
		
		//create an object to help create values to that we'll put in cells
		CreationHelper createHelper = wb.getCreationHelper();
		
		//loop through all the workgroup ids
		for(int x=0; x<workgroupIds.size(); x++) {
			//get a workgroup id
			String userId = workgroupIds.get(x);
			
			//get the UserInfo object for the workgroup id
			UserInfo userInfo = UserInfo.getByWorkgroupId(Long.parseLong(userId));
			
			if(userInfo != null) {
				//get the workgroup id
				Long workgroupId = userInfo.getWorkgroupId();

				//get all the work for that workgroup id
				List<StepWork> stepWorks = StepWork.getByUserInfo(userInfo);
				
				//create a sheet in the excel for this workgroup id
				Sheet userIdSheet = wb.createSheet(userId);
				
				int rowCounter = 0;
				
				/*
				 * create the row that will display the user data headers such as workgroup id,
				 * student login, teacher login, period name, etc.
				 */
				Row userDataHeaderRow = userIdSheet.createRow(rowCounter++);
				createUserDataHeaderRow(userDataHeaderRow, true, true);
				
				/*
				 * create the row that will display the user data such as the actual values
				 * for workgroup id, student login, teacher login, period name, etc.
				 */
				Row userDataRow = userIdSheet.createRow(rowCounter++);
				createUserDataRow(userDataRow, userId, true, true);
				
				//create a blank row for spacing
				rowCounter++;
				
				//counter for the header column cells
				int headerColumn = 0;
				
				//create the first row which will contain the headers
		    	Row headerRow = userIdSheet.createRow(rowCounter++);
		    	
		    	//the header column to just keep track of each row (which represents a step visit)
		    	headerRow.createCell(headerColumn).setCellValue("#");
		    	headerColumn++;
		    	
		    	//the header column for the first logged in student
		    	headerRow.createCell(headerColumn).setCellValue("Wise id 1");
		    	headerColumn++;
		    	
		    	//the header column for the second logged in student
		    	headerRow.createCell(headerColumn).setCellValue("Wise id 2");
		    	headerColumn++;
		    	
		    	//the header column for the third logged in student
		    	headerRow.createCell(headerColumn).setCellValue("Wise id 3");
		    	headerColumn++;

		    	//header step title column which already includes numbering
		    	headerRow.createCell(headerColumn).setCellValue("Step Title");
		    	headerColumn++;
		    	
		    	//header step type column
		    	headerRow.createCell(headerColumn).setCellValue("Step Type");
		    	headerColumn++;
		    	
		    	//header step prompt column
		    	headerRow.createCell(headerColumn).setCellValue("Step Prompt");
		    	headerColumn++;
		    	
		    	//header node id column
		    	headerRow.createCell(headerColumn).setCellValue("Node Id");
		    	headerColumn++;
		    	
		    	//header start time column
		    	headerRow.createCell(headerColumn).setCellValue("Start Time");
		    	headerColumn++;
		    	
		    	//header end time column
		    	headerRow.createCell(headerColumn).setCellValue("End Time");
		    	headerColumn++;
		    	
		    	//header time the student spent on the step in seconds column
		    	headerRow.createCell(headerColumn).setCellValue("Time Spent (Seconds)");
		    	headerColumn++;
		    	
		    	//header time the student spent on the step in seconds column
		    	headerRow.createCell(headerColumn).setCellValue("Teacher Score Timestamp");
		    	headerColumn++;
		    	
		    	//header time the student spent on the step in seconds column
		    	headerRow.createCell(headerColumn).setCellValue("Teacher Score");
		    	headerColumn++;
		    	
		    	//header time the student spent on the step in seconds column
		    	headerRow.createCell(headerColumn).setCellValue("Teacher Comment Timestamp");
		    	headerColumn++;
		    	
		    	//header time the student spent on the step in seconds column
		    	headerRow.createCell(headerColumn).setCellValue("Teacher Comment");
		    	headerColumn++;
		    	
		    	//header classmate id for review type steps
		    	headerRow.createCell(headerColumn).setCellValue("Classmate Id");
		    	headerColumn++;
		    	
		    	//header receiving text for review type steps
		    	headerRow.createCell(headerColumn).setCellValue("Receiving Text");
		    	headerColumn++;
		    	
		    	//header student work column
		    	headerRow.createCell(headerColumn).setCellValue("Student Work");

				//get all the work for a workgroup id
				List<StepWork> stepWorksForWorkgroupId = StepWork.getByUserInfo(userInfo);
				
		    	/*
		    	 * loop through all the work for the current student, this will
		    	 * already be ordered chronologically
		    	 */
		    	for(int y=0; y<stepWorks.size(); y++) {
					/*
					 * get a student work row which represents the work they
					 * performed for a single step visit
					 */
			    	StepWork stepWork = stepWorks.get(y);
			    	
			    	//get the start and end time
			    	Timestamp startTime = stepWork.getStartTime();
			    	Timestamp endTime = stepWork.getEndTime();
			    	
			    	//get the node id
			    	String nodeId = stepWork.getNode().getNodeId();
			    	
			    	//get the node content
			    	JSONObject nodeContent = nodeIdToNodeContent.get(nodeId);
			    	//check to see if node exists. if not, node has been deleted, so ignore it
			    	if (nodeContent == null) {
			    		continue;
			    	}
			    	
			    	//get the node object
			    	JSONObject nodeJSONObject = nodeIdToNode.get(nodeId);
			    	
			    	//counter for the cell columns
			    	int tempColumn = 0;
			    	
			    	//create a new row for this step work
			    	Row tempRow = userIdSheet.createRow(rowCounter++);
			    	
			    	//set the step work/visit number
			    	tempRow.createCell(tempColumn).setCellValue(y + 1);
			    	
			    	String wiseId1 = "";
					String wiseId2 = "";
					String wiseId3 = "";
					
					//get the start time in milliseconds
			    	long timestamp = startTime.getTime();
			    	
			    	/*
			    	 * get the student attendance that is relevant to the step work. we will
			    	 * look for the first student attendance entry for this workgroup id
			    	 * that has a login timestamp before the start time of this step work
			    	 */
			    	JSONObject studentAttendanceForWorkgroupIdTimestamp = getStudentAttendanceForWorkgroupIdTimestamp(workgroupId, timestamp);
			    	
			    	if(studentAttendanceForWorkgroupIdTimestamp == null) {
			    		/*
			    		 * we could not find a student attendance entry so this probably
			    		 * means this step work was created before we started logging 
			    		 * student absences. we will just display all the student ids for
			    		 * the workgroup in this case.
			    		 */
			    		
			    		//get all the user ids for this workgroup
			    		String studentLogins = workgroupIdToStudentLogins.get(Integer.parseInt(workgroupId + ""));
			    		
						//the user ids string is delimited by ':'
						String[] studentLoginsArray = studentLogins.split(":");
						
						//sort the user ids numerically and put them into a list
						ArrayList<Long> studentLoginsList = sortStudentLoginsArray(studentLoginsArray);
						
						//loop through all the user ids in this workgroup
						for(int z=0; z<studentLoginsList.size(); z++) {
							//get a user id
							Long studentLoginId = studentLoginsList.get(z);
							
							//set the appropriate wise id
							if(z == 0) {
								wiseId1 = studentLoginId + "";
							} else if(z == 1) {
								wiseId2 = studentLoginId + "";
							} else if(z == 2) {
								wiseId3 = studentLoginId + "";
							}
						}
			    	} else {
				    	try {
				    		//get the present and absent user ids
							JSONArray presentUserIds = studentAttendanceForWorkgroupIdTimestamp.getJSONArray("presentUserIds");
							JSONArray absentUserIds = studentAttendanceForWorkgroupIdTimestamp.getJSONArray("absentUserIds");
							
							HashMap<Long, String> studentAttendanceMap = new HashMap<Long, String>();
							ArrayList<Long> userIds = new ArrayList<Long>();
							
							//loop through all the present user ids
							for(int a=0; a<presentUserIds.length(); a++) {
								long presentUserId = presentUserIds.getLong(a);
								studentAttendanceMap.put(presentUserId, "Present");
								userIds.add(presentUserId);
							}
							
							//loop through all the absent user ids
							for(int b=0; b<absentUserIds.length(); b++) {
								long absentUserId = absentUserIds.getLong(b);
								studentAttendanceMap.put(absentUserId, "Absent");
								userIds.add(absentUserId);
							}
							
							//sort the user ids numerically
							Collections.sort(userIds);
							
							//loop through all the user ids
							for(int c=0; c<userIds.size(); c++) {
								//get a user id
								Long tempUserId = userIds.get(c);
								
								//get whether the stuent was "Present" or "Absent"
								String studentAttendanceStatus = studentAttendanceMap.get(tempUserId);
								
								String studentAttendanceStatusSuffix = "";
								
								if(studentAttendanceStatus != null && studentAttendanceStatus.equals("Absent")) {
									//the student was absent
									studentAttendanceStatusSuffix = " Absent";
								}
								
								//set the appropriate wise id
								if(c == 0) {
									wiseId1 = tempUserId + studentAttendanceStatusSuffix;
								} else if(c == 1) {
									wiseId2 = tempUserId + studentAttendanceStatusSuffix;
								} else if(c == 2) {
									wiseId3 = tempUserId + studentAttendanceStatusSuffix;
								}
							}
						} catch (JSONException e) {
							e.printStackTrace();
						}		    		
			    	}
			    	
					//set the wise id 1
			    	tempColumn++;
			    	tempRow.createCell(tempColumn).setCellValue(wiseId1);
			    	
			    	//set the wise id 2
			    	tempColumn++;
			    	tempRow.createCell(tempColumn).setCellValue(wiseId2);
			    	
			    	//set the wise id 3
			    	tempColumn++;
			    	tempRow.createCell(tempColumn).setCellValue(wiseId3);
			    	
			    	//set the title
			    	tempColumn++;
			    	tempRow.createCell(tempColumn).setCellValue(nodeIdToNodeTitlesMap.get(nodeId));
			    	
			    	//set the node type
			    	tempColumn++;
			    	tempRow.createCell(tempColumn).setCellValue(getNodeTypeFromStepWork(stepWork));
			    	
			    	//set the prompt
			    	tempColumn++;
			    	tempRow.createCell(tempColumn).setCellValue(getPromptFromNodeContent(nodeContent));
			    	
			    	//set the node id
			    	tempColumn++;
			    	tempRow.createCell(tempColumn).setCellValue(stepWork.getNode().getNodeId());
			    	
			    	//set the start time
			    	tempColumn++;
			    	tempRow.createCell(tempColumn).setCellValue(timestampToFormattedString(startTime));

			    	tempColumn++;
			    	
			    	/*
			    	 * check if the end time is null which may occur if the student is
			    	 * currently working on that step, or if there was some kind of
			    	 * bug/error
			    	 */
			    	if(endTime != null) {
			    		//set the end time
			    		tempRow.createCell(tempColumn).setCellValue(timestampToFormattedString(endTime));	
			    	} else {
			    		//there was no end time so we will leave it blank
			    		tempRow.createCell(tempColumn).setCellValue("");
			    	}
			    	
			    	long timeSpentOnStep = 0;
			    	
			    	//calculate the time the student spent on the step
			    	if(endTime == null || startTime == null) {
			    		//set to -1 if either start or end was null so we can set the cell to N/A later
			    		timeSpentOnStep = -1;
			    	} else {
			    		/*
			    		 * find the difference between start and end and divide by
			    		 * 1000 to obtain the value in seconds
			    		 */
			    		timeSpentOnStep = (stepWork.getEndTime().getTime() - stepWork.getStartTime().getTime()) / 1000;	
			    	}
			    	
			    	tempColumn++;
			    	
			    	//set the time spent on the step
			    	if(timeSpentOnStep == -1) {
			    		tempRow.createCell(tempColumn).setCellValue("N/A");
			    	} else {
			    		tempRow.createCell(tempColumn).setCellValue(timeSpentOnStep);	
			    	}
			    	
			    	tempColumn++;
			    	
			    	//create a list to add the StepWork to
			    	List<StepWork> stepWorkList = new ArrayList<StepWork>();
			    	stepWorkList.add(stepWork);
			    	
			    	//set the latest annotation score and timestamp
			    	tempColumn = setLatestAnnotationScoreAndTimestamp(stepWorkList, tempRow, tempColumn);
			    	
			    	//set the latest annotation comment and timestamp
			    	tempColumn = setLatestAnnotationCommentAndTimestamp(stepWorkList, tempRow, tempColumn);
			    	
					int periodId = workgroupIdToPeriodId.get(Integer.parseInt(userId));
					
					/*
					 * set the review cells, if the current step does not utilize any review
					 * functionality, it will simply fill the cells with "N/A"
					 */
			    	tempColumn = setGetLatestStudentWorkReviewCells(teacherWorkgroupIds, stepWorksForWorkgroupId, runId, periodId, userInfo, nodeJSONObject, nodeContent, tempRow, tempColumn, "allStudentWork");
			    	
			    	//set the work into the cells
			    	tempColumn = setStepWorkResponse(tempRow, tempColumn, stepWork, nodeId);
			    }
		    	
		    	/*
		    	 * check if we need to add more Student Work header cells. this value
		    	 * is set when a step requires multiple cells to display the data
		    	 * such as assessment list steps which can have multiple parts
		    	 * and require multiple cells.
		    	 */
		    	if(maxNumberOfStepWorkParts > 1) {
		    		//we need to add more Student Work header cells
		    		
		    		/*
		    		 * set the necessary number of header cells, the first one will
		    		 * overwrite the previous header cell set above, changing it from
		    		 * "Student Work" to "Student Work Part 1"
		    		 */
		    		for(int stepWorkCounter=0; stepWorkCounter<maxNumberOfStepWorkParts; stepWorkCounter++) {
		    			String stepWorkHeader = "Student Work Part " + (stepWorkCounter + 1);
		    			
		    			if(stepWorkCounter > 1) {
		    				stepWorkHeader += " (if applicable)";
		    			}
		    			
		    			//set the value in the cell "Student Work Part #"
		    			headerRow.createCell(headerColumn).setCellValue(stepWorkHeader);
		    			headerColumn++;
		    		}
		    	}
			}
		}

		return wb;
	}
	
	/**
	 * Creates an excel workbook that contains student work data
	 * All student work will be displayed on a single sheet.
	 * The top row contains the node titles and the left column
	 * contains the workgroup ids. Each x, y cell contains the latest
	 * student work for that node, workgroup.
	 * @param nodeIdToNodeTitlesMap a HashMap that contains nodeId to
	 * nodeTitle mappings
	 * @param workgroupIdsArray a String array containing workgroupIds
	 * @param nodeIdList a list of ordered node ids
	 * @param runId the id of the run
	 * @return an excel workbook that contains student work data
	 */
	private XSSFWorkbook getLatestStudentWorkXLSExport(HashMap<String, String> nodeIdToNodeTitlesMap,
			Vector<String> workgroupIds,
			List<String> nodeIdList,
			String runId,
			HashMap<String, JSONObject> nodeIdToNode,
			HashMap<String, JSONObject> nodeIdToNodeContent,
			HashMap<Integer, Integer> workgroupIdToPeriodId,
			List<String> teacherWorkgroupIds) {
		//create the excel workbook
		XSSFWorkbook wb = new XSSFWorkbook();
		
		//create the sheet that will contain all the data
		Sheet mainSheet = wb.createSheet("Latest Work For All Students");

		/*
		 * set the header rows in the sheet
		 * Step Title
		 * Step Type
		 * Step Prompt
		 * Node Id
		 * Step Extra
		 */
		setGetLatestStudentWorkHeaderRows(wb, nodeIdList, nodeIdToNodeTitlesMap, nodeIdToNodeContent);
		
		//set the student work
		setGetLatestStudentWorkStudentRows(wb, nodeIdToNodeTitlesMap, workgroupIds, nodeIdList, runId, nodeIdToNode, nodeIdToNodeContent, workgroupIdToPeriodId, teacherWorkgroupIds);
		
		return wb;
	}
	
	/**
	 * Set all the student data, each row represents one workgroup
	 * @param workbook
	 * @param nodeIdToNodeTitlesMap
	 * @param workgroupIdsArray
	 * @param nodeIdList
	 * @param runId
	 * @param nodeIdToNodeContent
	 * @param workgroupIdToPeriodId
	 * @param teacherWorkgroupIds
	 */
	private void setGetLatestStudentWorkStudentRows(XSSFWorkbook workbook,
			HashMap<String, String> nodeIdToNodeTitlesMap,
			Vector<String> workgroupIds,
			List<String> nodeIdList,
			String runId,
			HashMap<String, JSONObject> nodeIdToNode,
			HashMap<String, JSONObject> nodeIdToNodeContent,
			HashMap<Integer, Integer> workgroupIdToPeriodId,
			List<String> teacherWorkgroupIds) {
		
		XSSFSheet mainSheet = workbook.getSheetAt(0);
		
		//get the next empty row
		int rowCounter = mainSheet.getLastRowNum() + 1;

		//loop through the workgroup ids
		for(int x=0; x<workgroupIds.size(); x++) {
			//create a row for this workgroup
			Row rowForWorkgroupId = mainSheet.createRow(x + rowCounter);
			
			int workgroupColumnCounter = 0;
			
			//get a workgroup id
			String userId = workgroupIds.get(x);
			
			int periodId = workgroupIdToPeriodId.get(Integer.parseInt(userId));
			
			/*
			 * create the row that will display the user data such as the actual values
			 * for workgroup id, student login, teacher login, period name, etc.
			 */
			workgroupColumnCounter = createUserDataRow(rowForWorkgroupId, userId, true, false);
			
			/*
			 * increment the column counter to create an empty column under the header column
			 * that contains Step Title, Step Type, Step Prompt, Node Id, Step Extra
			 */
			workgroupColumnCounter++;
			
			//get the UserInfo object for the workgroup id
			UserInfo userInfo = UserInfo.getByWorkgroupId(Long.parseLong(userId));

			//get all the work for a workgroup id
			List<StepWork> stepWorksForWorkgroupId = StepWork.getByUserInfo(userInfo);
			
			//loop through all the node ids which are ordered
			for(int y=0; y<nodeIdList.size(); y++) {
				//get a node id
				String nodeId = nodeIdList.get(y);
				
				//get the content for the node
				JSONObject nodeContent = nodeIdToNodeContent.get(nodeId);
				
				JSONObject nodeJSONObject = nodeIdToNode.get(nodeId);
				
				/*
				 * set the review cells if applicable to this step, this means filling in the
				 * cells that specify the associated workgroup id and associated work and only
				 * applies for review type steps. if the current step/node is not a review cell
				 * this function call will not need to do much besides fill in N/A values
				 * or nothing at all depending on whether we are getting "latestStudentWork"
				 * or "allStudentWork"
				 */
				workgroupColumnCounter = setGetLatestStudentWorkReviewCells(teacherWorkgroupIds, stepWorksForWorkgroupId, runId, periodId, userInfo, nodeJSONObject, nodeContent, rowForWorkgroupId, workgroupColumnCounter, "latestStudentWork");

				//get all the step works for this node id
				List<StepWork> stepWorksForNodeId = getStepWorksForNodeId(stepWorksForWorkgroupId, nodeId);
				
				//get the latest step work that contains a response
				StepWork latestStepWorkWithResponse = getLatestStepWorkWithResponse(stepWorksForNodeId);
				
				//set the step work data into the row in the given column
				workgroupColumnCounter = setStepWorkResponse(rowForWorkgroupId, workgroupColumnCounter, latestStepWorkWithResponse, nodeId);

				//set the latest annotation score and timestamp from any of the teachers
				workgroupColumnCounter = setLatestAnnotationScoreAndTimestamp(stepWorksForNodeId, rowForWorkgroupId, workgroupColumnCounter);
				
				//set the latest annotation comment and timestamp from any of the teachers
				workgroupColumnCounter = setLatestAnnotationCommentAndTimestamp(stepWorksForNodeId, rowForWorkgroupId, workgroupColumnCounter);
			}
		}
	}
	
	/**
	 * Set the extra cells for the review step 
	 * @param teacherWorkgroupIds
	 * @param stepWorksForWorkgroupId
	 * @param runId
	 * @param periodId
	 * @param userInfo
	 * @param nodeContent
	 * @param rowForWorkgroupId
	 * @param reviewType
	 * @param workgroupColumnCounter
	 * @param exportType
	 * @return the updated column position
	 */
	private int setGetLatestStudentWorkReviewCells(List<String> teacherWorkgroupIds, 
			List<StepWork> stepWorksForWorkgroupId, 
			String runId, int periodId, 
			UserInfo userInfo, 
			JSONObject nodeJSONObject,
			JSONObject nodeContent, 
			Row rowForWorkgroupId,
			int workgroupColumnCounter,
			String exportType) {
		
		String reviewType = "";
		
		try {
			//try to see if the step is a review type of step
			if(nodeJSONObject == null) {
				//do nothing, this function will assume this step is not a review type
			} else if(nodeJSONObject.has("peerReview")) {
				reviewType = nodeJSONObject.getString("peerReview");
			} else if(nodeJSONObject.has("teacherReview")) {
				reviewType = nodeJSONObject.getString("teacherReview");
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		boolean addedReviewColumns = false;
		
		if(reviewType.equals("annotate")) {
			/*
			 * this is a step where the student reads work from their classmate and
			 * writes feedback/annotates it
			 */
			
			try {
				if(nodeJSONObject.has("peerReview")) {
					/*
					 * this is when the student receives classmate work to view and
					 * write a peer review
					 */
					
					//get the start/original node
					String associatedStartNodeId = nodeJSONObject.getString("associatedStartNode");
					Node node = Node.getByNodeIdAndRunId(associatedStartNodeId, runId);
					
					//get the PeerReviewWork row that contains the classmate matching
					PeerReviewWork peerReviewWork = PeerReviewWork.getPeerReviewWorkByRunPeriodNodeReviewerUserInfo(new Long(runId), new Long(periodId), node, userInfo);
					
					if(peerReviewWork != null) {
						//get the owner of the work
						UserInfo userInfoReviewed = peerReviewWork.getUserInfo();
						
						//get the workgroup id of the owner of the work
						Long workgroupIdReviewed = userInfoReviewed.getWorkgroupId();
						
						//get the StepWork
						StepWork peerReviewStepWork = peerReviewWork.getStepWork();
						
						//get the actual work from the classmate
						String reviewedWork = getStepWorkResponse(peerReviewStepWork);
						
						if(workgroupIdReviewed == -2) {
							//the student received the canned response
							rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue("Canned Response");
							
							//get the work that the student read
							String authoredWork = nodeContent.getString("authoredWork");
							
							//set the canned work
							rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue(authoredWork);
						} else {
							//set the workgroup id of their classmate
							rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue(workgroupIdReviewed);
							
							//set the work from their classmate
							rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue(reviewedWork);
						}
						
						addedReviewColumns = true;
					}
				} else if(nodeJSONObject.has("teacherReview")) {
					/*
					 * this is when the student receives the pre-written/canned work
					 * to view and write a peer review
					 */
					
					//get the pre-written/canned work
					String authoredWork = nodeContent.getString("authoredWork");
					
					//set the workgroup id of their classmate
					rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue("Teacher Response");
					
					//set the work from their classmate
					rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue(authoredWork);
					
					addedReviewColumns = true;
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
			
			//check if we incremented the columns
			if(!addedReviewColumns) {
				//the columns need to be incremented even if there was no data
				workgroupColumnCounter += 2;
			}
		} else if(reviewType.equals("revise")) {
			/*
			 * this is a step where the student reads an annotation from their classmate
			 * and revises their work based on it
			 */
			
			try {
				if(nodeJSONObject.has("peerReview")) {
					//get the start/original node
					String associatedStartNodeId = nodeJSONObject.getString("associatedStartNode");
					Node node = Node.getByNodeIdAndRunId(associatedStartNodeId, runId);
					
					//get the PeerReviewWork entry that contains the classmate matching
					PeerReviewWork peerReviewWork = PeerReviewWork.getPeerReviewWorkByRunPeriodNodeWorkerUserInfo(new Long(runId), new Long(periodId), node, userInfo);
					
					if(peerReviewWork != null) {
						//get the person who reviewed me
						UserInfo reviewerUserInfo = peerReviewWork.getReviewerUserInfo();
						
						if(reviewerUserInfo != null) {
							//get the workgroup id of the reviewer
							Long reviewerWorkgroupId = reviewerUserInfo.getWorkgroupId();
							
							//get the annotation from the reviewer
							Annotation annotation = peerReviewWork.getAnnotation();
							
							if(annotation != null) {
								//get the annotation text the reviewer wrote
								String annotationData = annotation.getData();
								JSONObject annotationDataJSONObject = new JSONObject(annotationData);
								String annotationValue = annotationDataJSONObject.getString("value");
								
								//set the workgroup id of their classmate
								rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue(reviewerWorkgroupId);
								
								//set the annotation from their classmate
								rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue(annotationValue);
								
								addedReviewColumns = true;
							} else {
								if(reviewerWorkgroupId == -2) {
									//the student saw the canned review
									String authoredReview = nodeContent.getString("authoredReview");
									
									//set the workgroup id of their classmate
									rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue("Canned Response");
									
									//set the review the student received
									rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue(authoredReview);
									
									addedReviewColumns = true;
								}
							}
						}
					}
				} else if(nodeJSONObject.has("teacherReview")) {
					//get the start/original node
					String associatedStartNodeId = nodeJSONObject.getString("associatedStartNode");
					
					//get the work for this node
					List<StepWork> stepWorksForNodeId = getStepWorksForNodeId(stepWorksForWorkgroupId, associatedStartNodeId);
					
					//get the latest work that contains a non-empty response
					StepWork latestStepWorkForNodeId = getLatestStepWorkWithResponse(stepWorksForNodeId);
					
					//get the teacher user infos
					List<UserInfo> fromWorkgroups = UserInfo.getByWorkgroupIds(teacherWorkgroupIds);
					
					//get all annotation comments from all the teachers for this step work
					List<Annotation> annotations = Annotation.getByFromWorkgroupsAndStepWork(fromWorkgroups, latestStepWorkForNodeId, AnnotationComment.class);
					
					Annotation latestAnnotation = null;
					
					//loop through all the annotations we found to look for the latest one
					for(int x=0; x<annotations.size(); x++) {
						//get an annotation
						Annotation tempAnnotation = annotations.get(x);
						
						if(latestAnnotation == null) {
							//this is the first annotation we've found so we will set it as the latest
							latestAnnotation = tempAnnotation;
						} else {
							//check if the annotation we are on is later than our current latest
							if(tempAnnotation.getPostTime().getTime() > latestAnnotation.getPostTime().getTime()) {
								//set the annotation we are on as the latest
								latestAnnotation = tempAnnotation;
							}
						}
					}
					
					if(latestAnnotation != null) {
						//get the annotation text the teacher wrote
						String annotationData = latestAnnotation.getData();
						JSONObject annotationJSONObject = new JSONObject(annotationData);
						
						//set the workgroup id of their teacher
						rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue("Teacher Response");
						
						//set the annotation from their teacher
						rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue(annotationJSONObject.getString("value"));
						
						addedReviewColumns = true;
					}
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
			
			//check if we incremented the columns
			if(!addedReviewColumns) {
				//the columns need to be incremented even if there was no data
				workgroupColumnCounter += 2;
			}
		} else {
			
			if(exportType.equals("allStudentWork")) {
				/*
				 * if this is for the all student work excel export, we will always need
				 * to fill the review cells
				 */
				rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue("N/A");
				rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue("N/A");
				addedReviewColumns = true;	
			} else if(exportType.equals("latestStudentWork")) {
				/*
				 * if this is for the latest student work excel export, we will not
				 * need to fill the review cells
				 */
			}
		}

		return workgroupColumnCounter;
	}
	
	/**
	 * Create the header rows in the sheet
	 * Step Title
	 * Step Type
	 * Step Prompt
	 * Node Id
	 * Step Extra
	 * @param workbook the excel work book
	 * @param nodeIdList a list of nodeIds in the order they appear in the project
	 * @param nodeIdToNodeTitlesMap a map of node id to node titles
	 * @param nodeIdToNodeContent a map of node id to node content
	 */
	private void setGetLatestStudentWorkHeaderRows(
			XSSFWorkbook workbook, 
			List<String> nodeIdList, 
			HashMap<String, String> nodeIdToNodeTitlesMap,
			HashMap<String, JSONObject> nodeIdToNodeContent) {
		XSSFSheet mainSheet = workbook.getSheetAt(0);
		
		int rowCounter = 0;
		
		//create the row that will display the metadata column headers
		Row metaDataHeaderRow = mainSheet.createRow(rowCounter++);
		createUserDataHeaderRow(metaDataHeaderRow, false, true);
		
		//create the row that will display the metadata column values
		Row metaDataRow = mainSheet.createRow(rowCounter++);
		createUserDataRow(metaDataRow, "", false, true);
		
		//create a blank row
		rowCounter++;
		
		//start on column 5 because the first 5 columns are for the user data columns
		int columnCounter = 5;
		
		//create the step title row
		Row stepTitleRow = mainSheet.createRow(rowCounter++);
		stepTitleRow.createCell(columnCounter).setCellValue("Step Title");
		
		//create the step type row
		Row stepTypeRow = mainSheet.createRow(rowCounter++);
		stepTypeRow.createCell(columnCounter).setCellValue("Step Type");
		
		//create the step prompt row
		Row stepPromptRow = mainSheet.createRow(rowCounter++);
		stepPromptRow.createCell(columnCounter).setCellValue("Step Prompt");
		
		//create the node id row
		Row nodeIdRow = mainSheet.createRow(rowCounter++);
		nodeIdRow.createCell(columnCounter).setCellValue("Node Id");

		//create the step type row
		Row stepExtraRow = mainSheet.createRow(rowCounter++);
		stepExtraRow.createCell(columnCounter).setCellValue("Step Extra");
		
		/*
		 * create and populate the row that contains the user data headers such as
		 * WorkgroupId, Student Login 1, Student Login 2, etc.
		 */
		Row userDataHeaderRow = mainSheet.createRow(rowCounter++);
		createUserDataHeaderRow(userDataHeaderRow, true, false);
		
		/*
		 * increment the column counter so the student work begins on the next column
		 * and not underneath the column that contains the cells above that contain
		 * "Step Title", "Step Type", etc.
		 */
		columnCounter++;
		
		/*
		 * loop through the node ids to set the step titles, step types,
		 * step prompts, node ids, and step extras
		 */
		for(int nodeIndex=0; nodeIndex<nodeIdList.size(); nodeIndex++) {
			//get the node id
			String nodeId = nodeIdList.get(nodeIndex);
			
			//set the header columns for getLatestWork
			columnCounter = setGetLatestStudentWorkHeaderColumn(
					stepTitleRow, stepTypeRow, stepPromptRow, nodeIdRow, stepExtraRow, 
					columnCounter, workbook, nodeIdToNodeTitlesMap, nodeIdToNodeContent, nodeId);
		}
	}
	
	/**
	 * Get the header columns for getLatestStudentWork
	 * @param stepTitleRow
	 * @param stepTypeRow
	 * @param stepPromptRow
	 * @param nodeIdRow
	 * @param stepExtraRow
	 * @param columnCounter
	 * @param workbook
	 * @param nodeIdToNodeTitlesMap
	 * @param nodeIdToNodeContent
	 * @param nodeId
	 * @return the updated column position
	 */
	private int setGetLatestStudentWorkHeaderColumn(
			Row stepTitleRow,
			Row stepTypeRow,
			Row stepPromptRow,
			Row nodeIdRow,
			Row stepExtraRow,
			int columnCounter,
			XSSFWorkbook workbook, 
			HashMap<String, String> nodeIdToNodeTitlesMap, 
			HashMap<String, JSONObject> nodeIdToNodeContent, 
			String nodeId) {

		
		//get the node title for the node id
		String nodeTitle = nodeIdToNodeTitlesMap.get(nodeId);
		
		JSONObject nodeJSONObject = nodeIdToNode.get(nodeId);
		
		//get the content for the node
		JSONObject nodeContent = nodeIdToNodeContent.get(nodeId);
		
		 if(isReviewType(nodeJSONObject)) {
			//the column is for a review type so we may need to allocate multiple columns
			columnCounter = setGetLatestStudentWorkReviewHeaderCells(
					stepTitleRow, stepTypeRow, stepPromptRow, nodeIdRow, stepExtraRow, 
					columnCounter, nodeId, nodeTitle, nodeJSONObject, nodeContent);
		} else if(isAssessmentListType(nodeContent)) {
			//the step is AssessmentList so we may need to allocate multiple columns 
			columnCounter = setGetLatestStudentWorkAssessmentListHeaderCells(
					stepTitleRow, stepTypeRow, stepPromptRow, nodeIdRow, stepExtraRow, 
					columnCounter, nodeId, nodeTitle, nodeContent);
		} else {
			//the column is for all other step types
			columnCounter = setGetLatestStudentWorkRegularHeaderCells(
					stepTitleRow, stepTypeRow, stepPromptRow, nodeIdRow, stepExtraRow, 
					columnCounter, nodeId, nodeTitle, nodeContent);
		}
		
		String nodeType = "";
		try {
			if(nodeContent != null) {
				//get the node type
				nodeType = nodeContent.getString("type");
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		//get the prompt
		String nodePrompt = getPromptFromNodeContent(nodeContent);
		
		//set the step extra so the researcher knows this column is for the teacher score
		String stepExtra = "teacher score timestamp";
		
		//set the step extra cell
		columnCounter = setGetLatestStepWorkHeaderCells(
				columnCounter, 
				stepTitleRow, stepTypeRow, stepPromptRow, nodeIdRow, stepExtraRow, 
				nodeTitle, nodeType, nodePrompt, nodeId, stepExtra);
		
		stepExtra = "teacher score";
		
		//set the step extra cell
		columnCounter = setGetLatestStepWorkHeaderCells(
				columnCounter, 
				stepTitleRow, stepTypeRow, stepPromptRow, nodeIdRow, stepExtraRow, 
				nodeTitle, nodeType, nodePrompt, nodeId, stepExtra);
		
		stepExtra = "teacher comment timestamp";
		
		//set the step extra cell
		columnCounter = setGetLatestStepWorkHeaderCells(
				columnCounter, 
				stepTitleRow, stepTypeRow, stepPromptRow, nodeIdRow, stepExtraRow, 
				nodeTitle, nodeType, nodePrompt, nodeId, stepExtra);
		
		//set the step extra so the researcher knows this column is for the teacher comment
		stepExtra = "teacher comment";
		
		//set the step extra cell
		columnCounter = setGetLatestStepWorkHeaderCells(
				columnCounter, 
				stepTitleRow, stepTypeRow, stepPromptRow, nodeIdRow, stepExtraRow, 
				nodeTitle, nodeType, nodePrompt, nodeId, stepExtra);
		
		
		return columnCounter;
	}
	
	/**
	 * Get the review type from the content
	 * @param nodeJSONObject
	 * @return the review type "start", "annotate", or "revise"
	 */
	private String getReviewType(JSONObject nodeJSONObject) {
		String reviewType = "";
		
		try {
			//check if the node is a review type
			if(nodeJSONObject == null) {
				//do nothing
			} else if(nodeJSONObject.has("peerReview")) {
				reviewType = nodeJSONObject.getString("peerReview");
			} else if(nodeJSONObject.has("teacherReview")) {
				reviewType = nodeJSONObject.getString("teacherReview");
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return reviewType;
	}
	
	/**
	 * Check if the node is an AssessmentList
	 * @param nodeContent
	 * @return whether the node is an assessment list type
	 */
	private boolean isAssessmentListType(JSONObject nodeContent) {
		if(nodeContent == null) {
			return false;
		}
		
		String type = null;
		try {
			type = nodeContent.getString("type");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		if(type == null) {
			return false;
		} else if(type.equals("AssessmentList")) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Check if the node is a review type
	 * @param nodeJSONObject
	 * @return whether the node is a review type
	 */
	private boolean isReviewType(JSONObject nodeJSONObject) {
		if(nodeJSONObject == null) {
			return false;
		} else if(nodeJSONObject.has("peerReview") || nodeJSONObject.has("teacherReview")) {
			return true;
		} else {
			return false;			
		}
	}

	/**
	 * Check if the node is a peer review
	 * @param nodeJSONObject
	 * @return whether the node is a peer review
	 */
	private boolean isPeerReview(JSONObject nodeJSONObject) {
		if(nodeJSONObject == null) {
			return false;
		} else if(nodeJSONObject.has("peerReview")) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Check if the node is a teacher review
	 * @param nodeJSONObject
	 * @return whether the node is a teacher review
	 */
	private boolean isTeacherReview(JSONObject nodeJSONObject) {
		if(nodeJSONObject == null) {
			return false;
		} else if(nodeJSONObject.has("teacherReview")) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Check if the review type is "annotate"
	 * @param nodeJSONObject
	 * @return whether the node is an annotate review type
	 */
	private boolean isAnnotateReviewType(JSONObject nodeJSONObject) {
		if(nodeJSONObject == null) {
			return false;
		} else {
			String reviewType = getReviewType(nodeJSONObject);
			
			return reviewType.equals("annotate");			
		}
	}
	
	/**
	 * Check if the review type is "revise"
	 * @param nodeJSONObject
	 * @return whether the node is a revise review type
	 */
	private boolean isReviseReviewType(JSONObject nodeJSONObject) {
		if(nodeJSONObject == null) {
			return false;
		} else {
			String reviewType = getReviewType(nodeJSONObject);
			
			return reviewType.equals("revise");			
		}
	}

	/**
	 * Check if the node is "annotate" or "revise" type
	 * @param nodeJSONObject
	 * @return whether the node is an annotate or revise review type
	 */
	private boolean isAnnotateOrReviseReviewType(JSONObject nodeJSONObject) {
		if(nodeJSONObject == null) {
			return false;
		}
		
		String reviewType = "";
		
		try {
			//check if the node is a review type
			if(nodeJSONObject.has("peerReview")) {
				reviewType = nodeJSONObject.getString("peerReview");
			} else if(nodeJSONObject.has("teacherReview")) {
				reviewType = nodeJSONObject.getString("teacherReview");
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		if(reviewType.equals("annotate") || reviewType.equals("revise")) {
			return true;
		} else {
			return false;			
		}
	}
	
	/**
	 * Set the header cells for getLatestStudentWork for a review type node
	 * which may require multiple columns
	 * @param stepTitleRow
	 * @param stepTypeRow
	 * @param stepPromptRow
	 * @param nodeIdRow
	 * @param stepExtraRow
	 * @param columnCounter
	 * @param nodeId
	 * @param nodeTitle
	 * @param nodeContent
	 * @return the updated column position
	 */
	private int setGetLatestStudentWorkReviewHeaderCells(
			Row stepTitleRow,
			Row stepTypeRow,
			Row stepPromptRow,
			Row nodeIdRow,
			Row stepExtraRow,
			int columnCounter, 
			String nodeId,
			String nodeTitle,
			JSONObject nodeJSONObject,
			JSONObject nodeContent) {
		
		//the default number of columns we need to fill for a node
		int columns = 1;
		
		if(isAnnotateOrReviseReviewType(nodeJSONObject)) {
			columns = 3;
		}

		//loop through the columns we need to fill for the current node
		for(int columnCount=0; columnCount<columns; columnCount++) {
			/*
			 * whether to set the cell value, usually this will stay true
			 * except when the cell value becomes set when we call another
			 * function that sets it for us
			 */
			boolean setCells = true;
			
			String nodeType = "";
			try {
				//get the node type
				nodeType = nodeContent.getString("type");
			} catch (JSONException e) {
				e.printStackTrace();
			}
			
			//get the node prompt
			String nodePrompt = getPromptFromNodeContent(nodeContent);
			
			//this is used for nodes that have sub parts
			String stepExtra = "";
			
			if(columns == 3) {
				if(columnCount == 0) {
					//cell 1/3
					
					//set the step extra to help researchers identify what this column represents
					if(isAnnotateReviewType(nodeJSONObject)) {
						stepExtra = "Workgroup I am writing feedback to";
					} else if(isReviseReviewType(nodeJSONObject)) {
						stepExtra = "Workgroup that is writing feedback to me";
					}
				} else if(columnCount == 1) {
					//cell 2/3
					
					//set the step extra to help researchers identify what this column represents
					if(isAnnotateReviewType(nodeJSONObject)) {
						stepExtra = "Work from other workgroup";
					} else if(isReviseReviewType(nodeJSONObject)) {
						stepExtra = "Feedback from workgroup";
					}
				} else if(columnCount == 2) {
					//cell 3/3
					
					if(isAssessmentListType(nodeContent)) {
						/*
						 * this is an assessment list step so we need to create a column for each assessment part.
						 * this function sets the cells so we don't have to
						 */
						columnCounter = setGetLatestStudentWorkAssessmentListHeaderCells(stepTitleRow, stepTypeRow, stepPromptRow, nodeIdRow, stepExtraRow, columnCounter, nodeId, nodeTitle, nodeContent);
						
						//make sure we don't create the cells again below
						setCells = false;
					} else {
						//set the step extra to help researchers identify what this column represents
						if(isAnnotateReviewType(nodeJSONObject)) {
							stepExtra = "Feedback written to other workgroup";
						} else if(isReviseReviewType(nodeJSONObject)) {
							stepExtra = "Work that I have revised based on feedback";
						}
					}
				}
			}
			
			if(setCells) {
				//set the cells
				columnCounter = setGetLatestStepWorkHeaderCells(columnCounter, 
						stepTitleRow, stepTypeRow, stepPromptRow, nodeIdRow, stepExtraRow, 
						nodeTitle, nodeType, nodePrompt, nodeId, stepExtra);
			}
		}
		
		return columnCounter;
	}
	
	/**
	 * Set the header cells for getLatestStudentWork for an assessment list type node
	 * which may require multiple columns
	 * @param stepTitleRow
	 * @param stepTypeRow
	 * @param stepPromptRow
	 * @param nodeIdRow
	 * @param stepExtraRow
	 * @param columnCounter
	 * @param nodeId
	 * @param nodeTitle
	 * @param nodeContent
	 * @return the updated column position
	 */
	private int setGetLatestStudentWorkAssessmentListHeaderCells(
			Row stepTitleRow,
			Row stepTypeRow,
			Row stepPromptRow,
			Row nodeIdRow,
			Row stepExtraRow,
			int columnCounter, 
			String nodeId,
			String nodeTitle, 
			JSONObject nodeContent) {
		
		JSONArray assessmentParts = null;
		try {
			//get the parts of the assessment
			assessmentParts = nodeContent.getJSONArray("assessments");
		} catch (JSONException e1) {
			e1.printStackTrace();
		}
		
		String nodeType = "";
		try {
			//get the node type
			nodeType = nodeContent.getString("type");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		//get the prompt
		String nodePrompt = getPromptFromNodeContent(nodeContent);
		
		String stepExtra = "";
		
		//loop through each part in the assessment
		for(int x=0; x<assessmentParts.length(); x++) {
			try {
				stepExtra = "";
				
				//get an assessment part
				JSONObject assessmentPart = assessmentParts.getJSONObject(x);
				
				if(assessmentPart != null) {
					//get the prompt for the part
					String partPrompt = assessmentPart.getString("prompt");
					
					stepExtra = partPrompt;
					
					//set the header cells for the column
					columnCounter = setGetLatestStepWorkHeaderCells(columnCounter, 
							stepTitleRow, stepTypeRow, stepPromptRow, nodeIdRow, stepExtraRow, 
							nodeTitle, nodeType, nodePrompt, nodeId, stepExtra);
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		
		return columnCounter;
	}
	
	/**
	 * Set the header cells for a regular node that only requires one column
	 * @param stepTitleRow
	 * @param stepTypeRow
	 * @param stepPromptRow
	 * @param nodeIdRow
	 * @param stepExtraRow
	 * @param columnCounter
	 * @param nodeId
	 * @param nodeTitle
	 * @param nodeContent
	 * @return the updated column position
	 */
	private int setGetLatestStudentWorkRegularHeaderCells(
			Row stepTitleRow,
			Row stepTypeRow,
			Row stepPromptRow,
			Row nodeIdRow,
			Row stepExtraRow,
			int columnCounter, 
			String nodeId,
			String nodeTitle, 
			JSONObject nodeContent) {
		
		String nodeType = "";
		try {
			if(nodeContent != null) {
				//get the node type
				nodeType = nodeContent.getString("type");
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		//get the prompt
		String nodePrompt = getPromptFromNodeContent(nodeContent);
		
		String stepExtra = "";
		
		//set the header cells
		columnCounter = setGetLatestStepWorkHeaderCells(columnCounter, 
				stepTitleRow, stepTypeRow, stepPromptRow, nodeIdRow, stepExtraRow, 
				nodeTitle, nodeType, nodePrompt, nodeId, stepExtra);
		
		return columnCounter;
	}
	
	/**
	 * Set the header values for a single header column
	 * @param columnCounter
	 * @param stepTitleRow
	 * @param stepTypeRow
	 * @param stepPromptRow
	 * @param nodeIdRow
	 * @param stepExtraRow
	 * @param stepTitle
	 * @param stepType
	 * @param stepPrompt
	 * @param nodeId
	 * @param stepExtra
	 * @return the updated column position
	 */
	private int setGetLatestStepWorkHeaderCells(
			int columnCounter,
			Row stepTitleRow,
			Row stepTypeRow,
			Row stepPromptRow,
			Row nodeIdRow,
			Row stepExtraRow,
			String stepTitle,
			String stepType,
			String stepPrompt,
			String nodeId,
			String stepExtra) {
		
		//set the step title
		stepTitleRow.createCell(columnCounter).setCellValue(stepTitle);
		
		//set the step type
		stepTypeRow.createCell(columnCounter).setCellValue(stepType);
		
		//set the step prompt
		stepPromptRow.createCell(columnCounter).setCellValue(stepPrompt);
		
		//set the node id
		nodeIdRow.createCell(columnCounter).setCellValue(nodeId);
		
		//set the step extra
		stepExtraRow.createCell(columnCounter).setCellValue(stepExtra);
		
		//increment the column counter
		return columnCounter + 1;
	}
	
	/**
	 * Get the latest StepWork that has a non-empty response
	 * @param stepWorks a list of StepWork objects
	 * @return a String containing the latest response
	 */
	private StepWork getLatestStepWorkWithResponse(List<StepWork> stepWorks) {
		String stepWorkResponse = "";
		StepWork stepWork = null;
		
		/*
		 * loop through all the stepworks for the node id and find
		 * the latest work
		 */
		for(int z=stepWorks.size() - 1; z>=0; z--) {
			//get a step work
			stepWork = stepWorks.get(z);
			
			//retrieve the student work from the step work, if any
			stepWorkResponse = getStepWorkResponse(stepWork);
			
			/*
			 * if the step work is not empty, we are done looking
			 * for the latest work
			 */
			if(!stepWorkResponse.equals("")) {
				break;
			}
		}
		
		return stepWork;
	}
	
	/**
	 * Get the latest step work that has a non-empty response and return that response
	 * @param stepWorks a list of StepWork objects
	 * @return a String containing the latest response
	 */
	private String getLatestStepWorkResponseWithResponse(List<StepWork> stepWorks) {
		StepWork latestStepWorkWithResponse = getLatestStepWorkWithResponse(stepWorks);
		
		if(latestStepWorkWithResponse != null) {
			return getStepWorkResponse(latestStepWorkWithResponse);
		} else {
			return "";
		}
	}
	
	/**
	 * Get the prompt from the node content
	 * @param nodeContent the node content JSON
	 * @return a string containing the prompt for the node, if nodeContent
	 * is null, we will just return ""
	 */
	private String getPromptFromNodeContent(JSONObject nodeContent) {
		String prompt = "";
		try {
			if(nodeContent != null) {
				String nodeType = nodeContent.getString("type");
				
				if(nodeType == null) {
					
				} else if(nodeType.equals("AssessmentList")) {
					prompt = nodeContent.getString("prompt");
				} else if(nodeType.equals("DataGraph")) {
					
				} else if(nodeType.equals("Draw")) {
					
				} else if(nodeType.equals("Fillin")) {
					
				} else if(nodeType.equals("Flash")) {
					
				} else if(nodeType.equals("Html")) {
					prompt = "N/A";
				} else if(nodeType.equals("MySystem")) {
					
				} else if(nodeType.equals("Brainstorm") || 
						nodeType.equals("MatchSequence") || 
						nodeType.equals("MultipleChoice") || 
						nodeType.equals("Note") || 
						nodeType.equals("OpenResponse")) {
					JSONObject assessmentItem = (JSONObject) nodeContent.get("assessmentItem");
					JSONObject interaction = (JSONObject) assessmentItem.get("interaction");
					prompt = interaction.getString("prompt");
				} else if(nodeType.equals("OutsideUrl")) {
					prompt = "N/A";
				} else if(nodeType.equals("SVGDraw")) {
					
				} else {
					
				}
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return prompt;
	}
	
	/**
	 * Set the step work responses into the row. Depending on the step, this may
	 * require setting multiple cells such as review type steps or assessment list
	 * type steps which require multiple cells for a single step.
	 * 
	 * @param rowForWorkgroupId
	 * @param columnCounter
	 * @param stepWorksForNodeId
	 * @param nodeId the id of the node
	 * @return the updated column position
	 */
	private int setStepWorkResponse(Row rowForWorkgroupId, int columnCounter, StepWork stepWork, String nodeId) {
		//obtain the number of answer fields for this step
		int numberOfAnswerFields = getNumberOfAnswerFields(nodeId);
		
		if(stepWork == null) {
			/*
			 * the student did not provide any answers but we still need to shift
			 * the column counter the appropriate number of cells 
			 */
			
			//increment the column counter
			columnCounter += numberOfAnswerFields;
		} else if(stepTypeContainsMultipleAnswerFields(stepWork)) {
			//the step type contains multiple answer fields
			
			//get the step work JSON data
			String stepWorkData = stepWork.getData();
			try {
				//get the step work data JSON object
				JSONObject stepWorkDataJSON = new JSONObject(stepWorkData);
				
				//get the node states
				JSONArray nodeStatesJSON = stepWorkDataJSON.getJSONArray("nodeStates");

				if(nodeStatesJSON.length() != 0) {
					//get the last state
					JSONObject lastState = nodeStatesJSON.getJSONObject(nodeStatesJSON.length() - 1);
					if(lastState != null) {
						String nodeType = stepWorkDataJSON.getString("nodeType");
						if(nodeType == null) {
							//error, this should never happen
						} else if(nodeType.equals("AssessmentListNode")) {
							
							//get the assessments array that contains the students answers for each part
							JSONArray assessments = lastState.getJSONArray("assessments");
							
							/*
							 * loop through each part but only look up to the number of fields that
							 * are in the step currently. for example this is in case the step originally
							 * had 3 parts when the student answered it, and after that the author
							 * changed the step to only have 2 parts. then in that case we only want
							 * to display the student work for those 2 parts.
							 */
							for(int x=0; x<assessments.length() && x<numberOfAnswerFields; x++) {
								//get a part
								JSONObject assessmentPart = assessments.getJSONObject(x);

								//check if the response is null
								if(!assessmentPart.isNull("response")) {
									//get the response
									JSONObject responseObject = assessmentPart.getJSONObject("response");
									
									//get the response text
									String responseText = responseObject.getString("text");
									
									//set the response text into the cell and increment the counter
									rowForWorkgroupId.createCell(columnCounter).setCellValue(responseText);
								}
								
								columnCounter++;
							}
							
							//set the max number of step work parts if necessary
							if(assessments.length() > maxNumberOfStepWorkParts) {
								maxNumberOfStepWorkParts = assessments.length();
							}
						}
					}
				} else {
					/*
					 * the student did not provide any answers but we still need to shift
					 * the column counter the appropriate number of cells 
					 */
					
					//increment the column counter
					columnCounter += numberOfAnswerFields;
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
		} else {
			//this is a regular step type which only uses one cell
			
			//get the step work response
			String stepWorkResponse = getStepWorkResponse(stepWork);
			
			if(stepWorkResponse != null) {
				//set the response into the cell and increment the counter
				rowForWorkgroupId.createCell(columnCounter++).setCellValue(stepWorkResponse);				
			} else {
				//there was no work so we will leave the cell blank and increment the counter
				columnCounter++;
			}
		}
		
		//return the updated position
		return columnCounter;
	}
	
	/**
	 * Determines whether the step type contains multiple answer fields
	 * e.g.
	 * AssessmentListNode
	 * @param stepWork the step work to check
	 * @return whether the step type contains multiple answer fields
	 */
	private boolean stepTypeContainsMultipleAnswerFields(StepWork stepWork) {
		//get the step work data
		String stepWorkData = stepWork.getData();
		
		if(stepWorkData == null) {
			return false;
		} else {
			try {
				//get the data JSON object
				JSONObject stepWorkDataJSON = new JSONObject(stepWorkData);
				
				//get the node type
				String nodeType = stepWorkDataJSON.getString("nodeType");
				
				//get the node id
				String nodeId = stepWorkDataJSON.getString("nodeId");
				
				//get the node content
				JSONObject nodeContent = nodeIdToNodeContent.get(nodeId);
				
				if(nodeContent == null) {
					/*
					 * the node content is null so even if the step work data
					 * contains multiple parts, we can't allow the step
					 * to use up multiple cells because the header cells
					 * will not match up since there was no node content
					 * to figure out the appropriate number of cells for
					 * the header to use up when we were setting the
					 * header cells.
					 */
					return false;
				} else if(nodeType == null) {
					return false;
				} else if(nodeType.equals("AssessmentListNode")) {
					return true;
				} else {
					return false;
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		
		return false;
	}
	
	/**
	 * Get the number of answer fields for the given step/node
	 * @param nodeId the id of the node
	 * @return the number of answer fields for the given step/node
	 */
	private int getNumberOfAnswerFields(String nodeId) {
		//the default number of answer fields
		int numAnswerFields = 1;
		
		//get the node content
		JSONObject nodeContent = nodeIdToNodeContent.get(nodeId);
		String nodeType = null;
		
		try {
			//get the node type
			nodeType = nodeContent.getString("type");
			
			if(nodeType == null) {
				
			} else if(nodeType.equals("AssessmentList")) {
				//get the number of assessments
				JSONArray assessmentParts = nodeContent.getJSONArray("assessments");
				
				//the number of assessments will be the same as the number of answers
				numAnswerFields = assessmentParts.length();
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return numAnswerFields;
	}
	
	/**
	 * Obtains the student work/response for the StepWork
	 * @param stepWork a StepWork object
	 * @return a String containing the student work/response
	 * note: HtmlNodes will return "N/A"
	 */
	private String getStepWorkResponse(StepWork stepWork) {
		String stepWorkResponse = "";
		String nodeType = "";
		
		//get the node type
		if(stepWork != null) {
			Node node = stepWork.getNode();
			
			if(node != null) {
				if(node.getNodeType() != null) {
					nodeType = node.getNodeType();					
				}
			}
		}
		
    	//obtain the student work from the json data
    	if(stepWork instanceof StepWorkOR || stepWork instanceof StepWorkNote || 
    			stepWork instanceof StepWorkBS || stepWork instanceof StepWorkFillin ||
    				stepWork instanceof StepWorkMC || stepWork instanceof StepWorkMatchSequence ||
    				stepWork instanceof StepWorkAssessmentList || nodeType.equals("SensorNode")
    				|| nodeType.equals("ExplanationBuilderNode")) {
    		try {
    			//obtain the json string
    			String data = stepWork.getData();
    			
    			//parse the json string into a json object
				JSONObject jsonData = new JSONObject(data);
				
				//obtain the node states array json object
				JSONArray jsonNodeStatesArray = jsonData.getJSONArray("nodeStates");
				
				if(stepWork instanceof StepWorkMC || stepWork instanceof StepWorkFillin || 
						stepWork instanceof StepWorkMatchSequence || stepWork instanceof StepWorkAssessmentList) {
					/*
					 * if the stepwork is for multiple choice or fillin, we will display
					 * all node states so that researchers can see how many times
					 * the student submitted an answer within this step work visit
					 */
					
					//string buffer to maintain all the answers for this step work visit
					StringBuffer responses = new StringBuffer();
					
					//loop through all the node states
					for(int z=0; z<jsonNodeStatesArray.length(); z++) {
						Object nodeStateObject = jsonNodeStatesArray.get(z);
						if(nodeStateObject == null || nodeStateObject.toString().equals("null")) {
							//node state is null so we will skip it
						} else {
							//obtain a node state
							JSONObject nodeState = (JSONObject) nodeStateObject;
							
							if(stepWork instanceof StepWorkMC || stepWork instanceof StepWorkFillin) {
								if(nodeState.has("response")) {
									//this case handles mc and fillin
									
									//obtain the response
									Object jsonResponse = nodeState.get("response");
									
									String currentResponse = "";
									
									if(jsonResponse instanceof JSONArray) {
										//if the object is an array obtain the first element
										JSONArray lastResponseArray = (JSONArray) jsonResponse;
										
										//check if there are any elements in the array
										if(lastResponseArray.length() > 0) {
											currentResponse = (String) lastResponseArray.get(0);										
										}
									} else if(jsonResponse instanceof String) {
										//if the object is a string just use the string
										currentResponse = (String) jsonResponse;
									}
									
									//separate answers with a comma
									if(responses.length() != 0) {
										responses.append(", ");
									}
									
									if(stepWork instanceof StepWorkFillin) {
										//for fillin we will obtain the text entry index
										Object blankNumber = nodeState.get("textEntryInteractionIndex");
										
										if(blankNumber instanceof Integer) {
											//display the response as Blank{blank number} [submit attempt]: {student response}
											responses.append("{Blank" + (((Integer) blankNumber) + 1) + "[" + (z+1) + "]: " + currentResponse + "}");
										}
									} else if(stepWork instanceof StepWorkMC) {
										//display the response as Answer[{attempt number}]: {student response}
										responses.append("{Answer[" + (z+1) + "]: " + currentResponse + "}");	
									}
								}
							} else if(stepWork instanceof StepWorkMatchSequence) {
								//get the array of buckets
								JSONArray buckets = (JSONArray) nodeState.get("buckets");

								//each state will be wrapped in {}
								responses.append("{");
								
								//loop through all the buckets
								for(int bucketCounter=0; bucketCounter<buckets.length(); bucketCounter++) {
									//get a bucket
									JSONObject bucket = (JSONObject) buckets.get(bucketCounter);
									
									//get the text for the bucket
									String bucketText = bucket.getString("text");
									
									//represents the beginning of a bucket
									responses.append("(");
									
									//add the bucket text to the response
									responses.append("[" + bucketText + "]: ");
									
									//get the choices in the current bucket
									JSONArray choices = (JSONArray) bucket.get("choices");
									
									StringBuffer choiceResponses = new StringBuffer();
									
									//loop through the choices
									for(int choiceCounter=0; choiceCounter<choices.length(); choiceCounter++) {
										//get a choice
										JSONObject choice = (JSONObject) choices.get(choiceCounter);
										
										//get the text for the choice
										String choiceText = choice.getString("text");
										
										/*
										 * if this is not the first choice we will need to separate
										 * the choice with a comma ,
										 */
										if(choiceResponses.length() != 0) {
											choiceResponses.append(", ");
										}
										
										//add the choice to the temporary choice text
										choiceResponses.append(choiceText);
									}
									
									//add the choice text
									responses.append(choiceResponses);
									
									//close the bucket
									responses.append(")");
								}
								
								/*
								 * close the state and add some new lines in case researcher
								 * wants to view the response in their browser
								 */
								responses.append("}<br><br>");
							} else if(stepWork instanceof StepWorkAssessmentList) {
								//wrap each node state with braces {}
								responses.append("{");
								
								if(nodeState.has("assessments")) {
									//get the array of assessment answers
									JSONArray assessments = nodeState.getJSONArray("assessments");
									
									//a string buffer to hold the accumulated responses for the node state
									StringBuffer tempResponses = new StringBuffer();
									
									//loop through all the assessment responses
									for(int assessmentCounter=0; assessmentCounter<assessments.length(); assessmentCounter++) {
										//get an assessment
										JSONObject assessment = assessments.getJSONObject(assessmentCounter);
										
										//check if the response is null
										if(!assessment.isNull("response")) {
											//get the assessment response
											JSONObject assessmentResponse = assessment.getJSONObject("response");
											
											//get the assessment response text
											String responseText = assessmentResponse.getString("text");
											
											//separate the assessment response texts with ,
											if(tempResponses.length() != 0) {
												tempResponses.append(", ");
											}
											
											//add the text to the temp container
											tempResponses.append(responseText);
										}
									}
									
									//put the responses for the assessments into the all encompassing string buffer
									responses.append(tempResponses);
								}
								
								//close the brace
								responses.append("}");
							}
						}
					}

					stepWorkResponse = responses.toString();
				} else {
					//check if there are any elements in the node states array
					if(jsonNodeStatesArray != null && jsonNodeStatesArray.length() > 0) {
						//obtain the last element in the node states
						Object nodeStateObject = jsonNodeStatesArray.get(jsonNodeStatesArray.length() - 1);
						
						if(nodeStateObject == null || nodeStateObject.toString().equals("null")) {
							//node state is null so we will skip it
						} else {
							JSONObject lastState = (JSONObject) nodeStateObject;
							
							if(nodeType.equals("ExplanationBuilderNode")) {
								if(lastState != null) {
									//just return the JSON as a string
									stepWorkResponse = lastState.toString();									
								}
							} else if(lastState.has("response")) {
								//obtain the response
								Object object = lastState.get("response");
								
								String lastResponse = "";
								
								if(object instanceof JSONArray) {
									//if the object is an array obtain the first element
									JSONArray lastResponseArray = (JSONArray) lastState.get("response");
									lastResponse = (String) lastResponseArray.get(0);
								} else if(object instanceof String) {
									//if the object is a string just use the string
									lastResponse = (String) lastState.get("response");
								}
								
						    	stepWorkResponse = lastResponse.toString();
							}
						}
					}
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
    	} else if(stepWork instanceof StepWorkHtml) {
	    	stepWorkResponse = "N/A";
    	} else {
    		//do nothing
    	}
    	
    	return stepWorkResponse;
	}
	
	/**
	 * Create the row that contains the user data headers, we will assume there
	 * will be at most 3 students in a single workgroup
	 * @param userDataHeaderRow the excel Row object to populate
	 * @param includeUserDataCells whether to output the user data cells such
	 * as workgroup id, wise id 1, wise id 2, wise id 3, class period
	 * @param includeMetaDataCells whether to output the metadata cells such
	 * as teacher login, project id, project name, etc.
	 */
	private int createUserDataHeaderRow(Row userDataHeaderRow, boolean includeUserDataCells, boolean includeMetaDataCells) {
		int userDataHeaderRowColumnCounter = 0;

		if(includeUserDataCells) {
			//output the user data header cells
			userDataHeaderRow.createCell(userDataHeaderRowColumnCounter++).setCellValue("Workgroup Id");
			userDataHeaderRow.createCell(userDataHeaderRowColumnCounter++).setCellValue("Wise Id 1");
			userDataHeaderRow.createCell(userDataHeaderRowColumnCounter++).setCellValue("Wise Id 2");
			userDataHeaderRow.createCell(userDataHeaderRowColumnCounter++).setCellValue("Wise Id 3");
			userDataHeaderRow.createCell(userDataHeaderRowColumnCounter++).setCellValue("Class Period");
		}
		
		if(includeMetaDataCells) {
			//output the meta data header cells
			userDataHeaderRow.createCell(userDataHeaderRowColumnCounter++).setCellValue("Teacher Login");
			userDataHeaderRow.createCell(userDataHeaderRowColumnCounter++).setCellValue("Project Id");
			userDataHeaderRow.createCell(userDataHeaderRowColumnCounter++).setCellValue("Parent Project Id");
			userDataHeaderRow.createCell(userDataHeaderRowColumnCounter++).setCellValue("Project Name");
			userDataHeaderRow.createCell(userDataHeaderRowColumnCounter++).setCellValue("Run Id");
			userDataHeaderRow.createCell(userDataHeaderRowColumnCounter++).setCellValue("Run Name");
			userDataHeaderRow.createCell(userDataHeaderRowColumnCounter++).setCellValue("Start Date");
			userDataHeaderRow.createCell(userDataHeaderRowColumnCounter++).setCellValue("End Date");			
		}
		
		return userDataHeaderRowColumnCounter;
	}
	
	/**
	 * Create the row that contains the user data such as the student
	 * logins, teacher login, period name, etc.
	 * we will assume there will be at most 3 students in a single workgroup
	 * @param userDataRow the excel Row object to populate
	 * @param workgroupId the workgroupId to obtain user data for
	 * @param includeUserDataCells whether to output the user data cells such
	 * as workgroup id, wise id 1, wise id 2, wise id 3, class period
	 * @param includeMetaDataCells whether to output the metadata cells such
	 * as teacher login, project id, project name, etc.
	 */
	private int createUserDataRow(Row userDataRow, String workgroupId, boolean includeUserDataCells, boolean includeMetaDataCells) {
		//the column counter
		int workgroupColumnCounter = 0;
		
		if(includeUserDataCells) {
			//output the user data cells
			
			//set the first column to be the workgroup id
			workgroupColumnCounter = setCellValue(userDataRow, workgroupColumnCounter, workgroupId);
			
			//get the student logins for the given workgroup id
			String studentLogins = workgroupIdToStudentLogins.get(Integer.parseInt(workgroupId));
			
			if(studentLogins != null) {
				//we found student logins
				
				//the user ids string is delimited by ':'
				String[] studentLoginsArray = studentLogins.split(":");
				
				//sort the user ids numerically
				ArrayList<Long> studentLoginsList = sortStudentLoginsArray(studentLoginsArray);
				
				//loop through all the user ids in this workgroup
				for(int z=0; z<studentLoginsList.size(); z++) {
					//get a user id
					Long studentLoginLong = studentLoginsList.get(z);
					
					//put the user id into the cell
					workgroupColumnCounter = setCellValue(userDataRow, workgroupColumnCounter, studentLoginLong + "");
				}
				
				/*
				 * we will assume there will be at most 3 students in a workgroup so we need
				 * to increment the column counter if necessary
				 */
				int numColumnsToAdd = 3 - studentLoginsList.size();
				workgroupColumnCounter += numColumnsToAdd;
				
				//get the period name such as 1, 2, 3, 4, etc.
				String periodName = workgroupIdToPeriodName.get(Integer.parseInt(workgroupId));
				
				//populate the cell with the period name
				workgroupColumnCounter = setCellValue(userDataRow, workgroupColumnCounter, periodName);
			} else {
				/*
				 * we did not find any student logins so we will just increment the column
				 * counter by 3 since we provide 3 columns for the student logins and 1
				 * for the period
				 */
				workgroupColumnCounter += 4;
			}
		}
		
		if(includeMetaDataCells) {
			//output the meta data cells
			
			String teacherLogin = "";
			try {
				//get the teacher login
				teacherLogin = teacherUserInfoJSONObject.getString("userName");
			} catch (JSONException e) {
				e.printStackTrace();
			}
			
			//populate the cell with the teacher login
			userDataRow.createCell(workgroupColumnCounter++).setCellValue(teacherLogin);
			
			//set the run and project attributes
			workgroupColumnCounter = setCellValue(userDataRow, workgroupColumnCounter, projectId);
			workgroupColumnCounter = setCellValue(userDataRow, workgroupColumnCounter, parentProjectId);
			userDataRow.createCell(workgroupColumnCounter++).setCellValue(projectName);
			workgroupColumnCounter = setCellValue(userDataRow, workgroupColumnCounter, runId);
			userDataRow.createCell(workgroupColumnCounter++).setCellValue(runName);
			
			//populate the cell with the date the run was created
			userDataRow.createCell(workgroupColumnCounter++).setCellValue(startTime);
			
			//populate the cell with the date the run was archived
			userDataRow.createCell(workgroupColumnCounter++).setCellValue(endTime);			
		}
		
		return workgroupColumnCounter;
	}
	
	/**
	 * Get the explanation builder work excel export. We will generate a row 
	 * for each idea used in an explanation builder step. The order of
	 * the explanation builder steps will be chronological from oldest to newest.
	 * @param nodeIdToNodeTitlesMap
	 * @param workgroupIds
	 * @param runId
	 * @param nodeIdToNode
	 * @param nodeIdToNodeContent
	 * @param workgroupIdToPeriodId
	 * @param teacherWorkgroupIds
	 * @return
	 */
	private XSSFWorkbook getExplanationBuilderWorkExcelExport(HashMap<String, String> nodeIdToNodeTitlesMap,
			Vector<String> workgroupIds, 
			String runId,
			HashMap<String, JSONObject> nodeIdToNode,
			HashMap<String, JSONObject> nodeIdToNodeContent,
			HashMap<Integer, Integer> workgroupIdToPeriodId,
			List<String> teacherWorkgroupIds) {
		
		//the excel workbook
		XSSFWorkbook wb = new XSSFWorkbook();
		
		//loop through all the workgroups
		for(int x=0; x<workgroupIds.size(); x++) {
			String workgroupId = workgroupIds.get(x);
			UserInfo userInfo = UserInfo.getByWorkgroupId(Long.parseLong(workgroupId));

			//create a sheet for the workgroup
			Sheet userIdSheet = wb.createSheet(workgroupId);
			
			int rowCounter = 0;
			
			/*
			 * create the row that will display the user data headers such as workgroup id,
			 * student login, teacher login, period name, etc.
			 */
			Row userDataHeaderRow = userIdSheet.createRow(rowCounter++);
			createUserDataHeaderRow(userDataHeaderRow, true, true);
			
			/*
			 * create the row that will display the user data such as the actual values
			 * for workgroup id, student login, teacher login, period name, etc.
			 */
			Row userDataRow = userIdSheet.createRow(rowCounter++);
			createUserDataRow(userDataRow, workgroupId, true, true);
			
			//create a blank row for spacing
			rowCounter++;
			
			//counter for the header column cells
			int headerColumn = 0;
			
			//create the first row which will contain the headers
	    	Row headerRow = userIdSheet.createRow(rowCounter++);
	    	
	    	//vector that contains all the header column names
	    	Vector<String> headerColumnNames = new Vector<String>();
	    	headerColumnNames.add("Step Work Id");
	    	headerColumnNames.add("Step Title");
	    	headerColumnNames.add("Node Id");
	    	headerColumnNames.add("Start Time");
	    	headerColumnNames.add("End Time");
	    	headerColumnNames.add("Time Spent (in seconds)");
	    	headerColumnNames.add("Answer");
	    	headerColumnNames.add("Idea Id");
	    	headerColumnNames.add("Idea Text");
	    	headerColumnNames.add("Idea X Position");
	    	headerColumnNames.add("Idea Y Position");
	    	headerColumnNames.add("Idea Color");
	    	
	    	//add all the header column names to the row
	    	for(int y=0; y<headerColumnNames.size(); y++) {
		    	headerRow.createCell(headerColumn).setCellValue(headerColumnNames.get(y));
		    	headerColumn++;	    		
	    	}
	    	
	    	//get all the work from the workgroup
	    	List<StepWork> stepWorks = StepWork.getByUserInfo(userInfo);
	    	
	    	//loop through all the work
	    	for(int z=0; z<stepWorks.size(); z++) {
	    		StepWork stepWork = stepWorks.get(z);
	    		
	    		//get the node and node type
	    		Node node = stepWork.getNode();
	    		String nodeType = node.getNodeType();
	    		
	    		if(nodeType != null && nodeType.equals("ExplanationBuilderNode")) {
	    			//the work is for an explanation builder step
	    			
	    			//get the student work
	    			String data = stepWork.getData();
	    			
	    			try {
	    				//get the JSONObject representation of the student work
						JSONObject dataJSONObject = new JSONObject(data);
						
						//get the node states from the student work
						JSONArray nodeStates = dataJSONObject.getJSONArray("nodeStates");
						
						if(nodeStates != null && nodeStates.length() > 0) {
							//get the last node state
							JSONObject nodeState = nodeStates.getJSONObject(nodeStates.length() - 1);
							
							//get the answer the student typed in the text area
							String answer = nodeState.getString("answer");
							
							//get all the ideas used in this step
							JSONArray explanationIdeas = nodeState.getJSONArray("explanationIdeas");
							
							if(explanationIdeas != null && explanationIdeas.length() > 0) {
								//loop through all the ideas used in this step
								for(int i=0; i<explanationIdeas.length(); i++) {
									//get one of the ideas that was used
									JSONObject explanationIdea = explanationIdeas.getJSONObject(i);
									
									//create a row for this idea
					    			Row ideaRow = userIdSheet.createRow(rowCounter++);
					    			
					    			int columnCounter = 0;
					    			
					    			//get the step work id and node id
					    			Long stepWorkId = stepWork.getId();
					    			String nodeId = node.getNodeId();
					    			
					    			//get the title of the step
					    			String title = nodeIdToNodeTitlesMap.get(nodeId);
									
					    			//get the start and end time for the student visit
									Timestamp startTime = stepWork.getStartTime();
									Timestamp endTime = stepWork.getEndTime();
									
							    	long timeSpentOnStep = 0;
							    	
							    	//calculate the time the student spent on the step
							    	if(endTime == null || startTime == null) {
							    		//set to -1 if either start or end was null so we can set the cell to N/A later
							    		timeSpentOnStep = -1;
							    	} else {
							    		/*
							    		 * find the difference between start and end and divide by
							    		 * 1000 to obtain the value in seconds
							    		 */
							    		timeSpentOnStep = (endTime.getTime() - startTime.getTime()) / 1000;	
							    	}
							    	
									ideaRow.createCell(columnCounter++).setCellValue(stepWorkId);
									ideaRow.createCell(columnCounter++).setCellValue(title);
									ideaRow.createCell(columnCounter++).setCellValue(nodeId);
									ideaRow.createCell(columnCounter++).setCellValue(timestampToFormattedString(startTime));
									
									if(endTime != null) {
										ideaRow.createCell(columnCounter++).setCellValue(timestampToFormattedString(endTime));
									} else {
										ideaRow.createCell(columnCounter++).setCellValue("");						
									}
									
									//set the time spent on the step
							    	if(timeSpentOnStep == -1) {
							    		ideaRow.createCell(columnCounter++).setCellValue("N/A");
							    	} else {
							    		ideaRow.createCell(columnCounter++).setCellValue(timeSpentOnStep);	
							    	}
							    	
							    	ideaRow.createCell(columnCounter++).setCellValue(answer);
							    	ideaRow.createCell(columnCounter++).setCellValue(explanationIdea.getLong("id"));
							    	ideaRow.createCell(columnCounter++).setCellValue(explanationIdea.getString("lastAcceptedText"));
							    	ideaRow.createCell(columnCounter++).setCellValue(explanationIdea.getLong("xpos"));
							    	ideaRow.createCell(columnCounter++).setCellValue(explanationIdea.getLong("ypos"));
							    	ideaRow.createCell(columnCounter++).setCellValue(getColorNameFromRBGString(explanationIdea.getString("color")));
								}
							}
						}
					} catch (JSONException e) {
						e.printStackTrace();
					}
	    		}
	    	}
		}
		
		return wb;
	}
	
	/**
	 * Get the color name given the rgb string
	 * @param rbgString e.g. "rgb(38, 84, 207)"
	 * @return a string with the color name
	 */
	private String getColorNameFromRBGString(String rbgString) {
		String color = "";
		
		if(rbgString == null) {
			//do nothing
		} else if(rbgString.equals("rgb(38, 84, 207)")) {
			color = "blue";
		} else if(rbgString.equals("rgb(0, 153, 51)")) {
			color = "green";
		} else if(rbgString.equals("rgb(204, 51, 51)")) {
			color = "red";
		} else if(rbgString.equals("rgb(204, 102, 0)")) {
			color = "orange";
		} else if(rbgString.equals("rgb(153, 102, 255)")) {
			color = "purple";
		} else if(rbgString.equals("rgb(153, 51, 51)")) {
			color = "brown";
		}
		
		return color;
	}
	
	/**
	 * Creates an excel workbook that contains student navigation data
	 * Each sheet represents one student's work. The rows in each
	 * sheet are sequential so the earliest navigation data is at
	 * the top and the latest navigation data is at the bottom
	 * @param nodeIdToNodeTitlesMap a HashMap that contains nodeId to
	 * nodeTitle mappings
	 * @param workgroupIds a String array containing workgroupIds
	 * @param runId
	 * @param nodeIdToNode
	 * @param nodeIdToNodeContent
	 * @param workgroupIdToPeriodId
	 * @param teacherWorkgroupIds
	 * @return an excel workbook that contains the student navigation
	 */
	private XSSFWorkbook getIdeaBasketsExcelExport(
			HashMap<String, String> nodeIdToNodeTitlesMap,
			Vector<String> workgroupIds, 
			String runId,
			HashMap<String, JSONObject> nodeIdToNode,
			HashMap<String, JSONObject> nodeIdToNodeContent,
			HashMap<Integer, Integer> workgroupIdToPeriodId,
			List<String> teacherWorkgroupIds) {
	
		//the excel workbook
		XSSFWorkbook wb = new XSSFWorkbook();
		
		//this export will only contain one sheet
		Sheet mainSheet = wb.createSheet();
		
		int rowCounter = 0;
		int columnCounter = 0;
		
		//create all the header fields
		Vector<String> headerFields = new Vector<String>();
		headerFields.add("Basket Revision");
		headerFields.add("Idea #");
		headerFields.add("Idea Text");
		headerFields.add("Flag");
		headerFields.add("Tags");
		headerFields.add("Source");
		headerFields.add("Node Type");
		headerFields.add("Node Id Created On");
		headerFields.add("Node Name Created On");
		headerFields.add("Steps Used In Count");
		headerFields.add("Steps Used In");
		headerFields.add("Trash");
		headerFields.add("Timestamp Basket Saved");
		headerFields.add("Timestamp Idea Created");
		headerFields.add("Timestamp Idea Last Edited");
		headerFields.add("New");
		headerFields.add("Revised");
		headerFields.add("Repositioned");
		headerFields.add("Steps Used In Changed");
		headerFields.add("Deleted In This Revision");

		//output the meta data header cells
		Row metaDataHeaderRow = mainSheet.createRow(rowCounter++);
		createUserDataHeaderRow(metaDataHeaderRow, false, true);
		
		//output the meta data cells
		Row metaDataRow = mainSheet.createRow(rowCounter++);
		createUserDataRow(metaDataRow, "", false, true);
		
		//create a blank row
		rowCounter++;
		
		//output the user header rows such as workgroup id, wise id 1, etc.
		Row headerRow = mainSheet.createRow(rowCounter++);
		columnCounter = createUserDataHeaderRow(headerRow, true, false);

		//loop through all the header fields to add them to the excel
		for(int x=0; x<headerFields.size(); x++) {
	    	//the header column to just keep track of each row (which represents a step visit)
	    	headerRow.createCell(columnCounter++).setCellValue(headerFields.get(x));
		}
		
		/*
		 * get all the idea basket revisions for this run. all the revisions
		 * for a workgroup are ordered chronologically and all the basket
		 * revisions for a workgroup are grouped together
		 * e.g.
		 * 
		 * list[0] = workgroup1, basket revision 1
		 * list[1] = workgroup1, basket revision 2
		 * list[2] = workgroup1, basket revision 3
		 * list[3] = workgroup2, basket revision 1
		 * list[4] = workgroup2, basket revision 2
		 * etc.
		 */
		List<IdeaBasket> ideaBasketRevisions = IdeaBasket.getIdeaBasketsForRunId(new Long(runId));
		
		/*
		 * used for comparing basket revisions. we need to make sure we are
		 * comparing a basket revision for the same workgroup since these
		 * idea basket revisions are all in the list one after the other
		 */
		long previousWorkgroupId = -1L;
		
		//counter for the basket revision for a workgroup
		int basketRevision = 1;
		
		//variable that will hold the previous basket revision
		JSONObject previousIdeaBasketJSON = null;
		
		//object to format timestamps
		DateFormat dateTimeInstance = DateFormat.getDateTimeInstance();
		
		//loop through all the basket revisions
		for(int x=0; x<ideaBasketRevisions.size(); x++) {
			
			//get the IdeaBasket java object
			IdeaBasket ideaBasket = ideaBasketRevisions.get(x);
			
			//get the workgroup id
			long workgroupId = ideaBasket.getWorkgroupId();

			if(workgroupId == previousWorkgroupId) {
				/*
				 * previous basket revision was for the same workgroup so
				 * we will increment the basket revision counter
				 */
				basketRevision++;
			} else {
				/*
				 * previous basket revision was for a different workgroup
				 * so we will reset these values
				 */
				previousWorkgroupId = -1L;
				basketRevision = 1;
				previousIdeaBasketJSON = null;
			}
			
			//get the JSON for the basket revision
			String data = ideaBasket.getData();
			
			if(data != null) {
				JSONObject ideaBasketJSON = new JSONObject();
				try {
					//create a JSON object from the basket revision
					ideaBasketJSON = new JSONObject(data);
				} catch (JSONException e1) {
					e1.printStackTrace();
				}
				
				//get the number of ideas in this revision
				int numberOfIdeas = getNumberOfIdeas(ideaBasketJSON);
				
				//loop through all the ideas in the current revision
				for(int y=1; y<=numberOfIdeas; y++) {
					//each idea gets its own row so we will start at column 0
					columnCounter = 0;
					
					try {
						//get the idea
						JSONObject idea = getIdeaById(ideaBasketJSON, y);
						int ideaId = idea.getInt("id");
						
						if(idea != null) {
							Row ideaBasketRow = mainSheet.createRow(rowCounter++);
							
							//WorkgrupId, Wise Id 1, Wise Id 2, Wise Id 3, Class Period
							columnCounter = createUserDataRow(ideaBasketRow, workgroupId + "", true, false);
							
							//Basket Revision
							ideaBasketRow.createCell(columnCounter++).setCellValue(basketRevision);
							
							//Idea #
							ideaBasketRow.createCell(columnCounter++).setCellValue(ideaId);
							
							//Idea Text
							ideaBasketRow.createCell(columnCounter++).setCellValue(idea.getString("text"));
							
							//Flag
							ideaBasketRow.createCell(columnCounter++).setCellValue(idea.getString("flag"));
							
							//Tags
							ideaBasketRow.createCell(columnCounter++).setCellValue(idea.getString("tags"));
							
							//Source
							ideaBasketRow.createCell(columnCounter++).setCellValue(idea.getString("source"));
							
							//Node Type
							ideaBasketRow.createCell(columnCounter++).setCellValue(getNodeTypeFromIdea(idea, nodeIdToNodeContent));
							
							//Node Id Created On
							ideaBasketRow.createCell(columnCounter++).setCellValue(idea.getString("nodeId"));
							
							//Node Name Created On
							ideaBasketRow.createCell(columnCounter++).setCellValue(idea.getString("nodeName"));
							
							//Steps Used In Count
							ideaBasketRow.createCell(columnCounter++).setCellValue(getStepsUsedInCount(idea));
							
							//Steps Used In
							ideaBasketRow.createCell(columnCounter++).setCellValue(getStepsUsedIn(idea, nodeIdToNodeTitlesMap));
							
							//Trash
							boolean ideaInTrash = isIdeaInTrash(ideaBasketJSON, ideaId);
							ideaBasketRow.createCell(columnCounter++).setCellValue(getIntFromBoolean(ideaInTrash));
							
							//Timestamp Basket Saved
							Timestamp postTime = ideaBasket.getPostTime();
							long time = postTime.getTime();
							Date dateBasketSaved = new Date(time);
							String timestampBasketSaved = dateTimeInstance.format(dateBasketSaved);
							ideaBasketRow.createCell(columnCounter++).setCellValue(timestampBasketSaved);
							
							//Timestamp Idea Created
							long timeCreated = idea.getLong("timeCreated");
							Date dateCreated = new Date(timeCreated);
							String timestampIdeaCreated = dateTimeInstance.format(dateCreated);
							ideaBasketRow.createCell(columnCounter++).setCellValue(timestampIdeaCreated);
							
							//Timestamp Idea Last Edited
							long timeLastEdited = idea.getLong("timeLastEdited");
							Date dateLastEdited = new Date(timeLastEdited);
							String timestampIdeaLastEdited = dateTimeInstance.format(dateLastEdited);
							ideaBasketRow.createCell(columnCounter++).setCellValue(timestampIdeaLastEdited);
							
							//New
							boolean ideaNew = isIdeaNew(idea, previousIdeaBasketJSON);
							ideaBasketRow.createCell(columnCounter++).setCellValue(getIntFromBoolean(ideaNew));
							
							//Revised
							boolean ideaRevised = isIdeaRevised(idea, previousIdeaBasketJSON);
							ideaBasketRow.createCell(columnCounter++).setCellValue(getIntFromBoolean(ideaRevised));
							
							//Repositioned
							boolean ideaPositionChanged = isIdeaPositionChanged(ideaId, ideaBasketJSON, previousIdeaBasketJSON);
							ideaBasketRow.createCell(columnCounter++).setCellValue(getIntFromBoolean(ideaPositionChanged));
							
							//Steps Used In Changed
							boolean stepsUsedInChanged = isStepsUsedInChanged(idea, previousIdeaBasketJSON, nodeIdToNodeTitlesMap);
							ideaBasketRow.createCell(columnCounter++).setCellValue(getIntFromBoolean(stepsUsedInChanged));
							
							//Deleted In This Revision
							boolean ideaDeletedInThisRevision = isIdeaDeletedInThisRevision(ideaId, ideaBasketJSON, previousIdeaBasketJSON);
							ideaBasketRow.createCell(columnCounter++).setCellValue(getIntFromBoolean(ideaDeletedInThisRevision));
						}
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
				
				/*
				 * remember the workgroupid and basket so we can 
				 * compare them to the next revision
				 */
				previousWorkgroupId = workgroupId;
				previousIdeaBasketJSON = ideaBasketJSON;				
			}
		}
		
		return wb;
	}
	
	/**
	 * Get the idea from a basket revision by idea id
	 * @param ideaBasketJSON the basket revision
	 * @param ideaId the id of the idea we want
	 * @return the idea in JSONObject form
	 */
	private JSONObject getIdeaById(JSONObject ideaBasketJSON, int ideaId) {
		JSONObject idea = null;
		boolean ideaFound = false;
		
		try {
			//get the ideas
			JSONArray ideas = ideaBasketJSON.getJSONArray("ideas");
			JSONArray deleted = ideaBasketJSON.getJSONArray("deleted");
			
			//loop through the active ideas
			for(int x=0; x<ideas.length(); x++) {
				JSONObject activeIdea = ideas.getJSONObject(x);
				
				if(activeIdea != null && activeIdea.getInt("id") == ideaId) {
					//we have found the idea we want so we will stop searching
					idea = activeIdea;
					ideaFound = true;
					break;
				}
			}
			
			if(!ideaFound) {
				//we have not found the idea yet so we will search the trash
				for(int y=0; y<deleted.length(); y++) {
					JSONObject deletedIdea = deleted.getJSONObject(y);
					
					if(deletedIdea != null && deletedIdea.getInt("id") == ideaId) {
						idea = deletedIdea;
						ideaFound = true;
						break;
					}
				}				
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return idea;
	}
	
	/**
	 * Get the number of ideas in this basket revision
	 * @param ideaBasketJSON the basket revision
	 * @return the number of ideas in the basket revision
	 */
	private int getNumberOfIdeas(JSONObject ideaBasketJSON) {
		int numberOfIdeas = 0;
		
		try {
			//get the ideas
			JSONArray ideas = ideaBasketJSON.getJSONArray("ideas");
			JSONArray deleted = ideaBasketJSON.getJSONArray("deleted");
			
			if(ideas != null) {
				//add the active ideas count
				numberOfIdeas += ideas.length();	
			}
			
			if(deleted != null) {
				//add the trash ideas count
				numberOfIdeas += deleted.length();
			}
			
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return numberOfIdeas;
	}
	
	/**
	 * Determine if an idea is in the trash
	 * @param ideaBasketJSON the basket revision
	 * @param ideaId the id of the idea
	 * @return whether the idea is in the trash or not
	 */
	private boolean isIdeaInTrash(JSONObject ideaBasketJSON, int ideaId) {
		boolean ideaInTrash = false;
		
		try {
			if(ideaBasketJSON != null) {
				//get the deleted ideas from the basket revision
				JSONArray deleted = ideaBasketJSON.getJSONArray("deleted");
				
				//loop through all the ideas in the trash
				for(int x=0; x<deleted.length(); x++) {
					JSONObject deletedIdea = deleted.getJSONObject(x);
					
					if(deletedIdea != null) {
						//get the id of the idea in the trash
						int deletedIdeaId = deletedIdea.getInt("id");
						
						if(deletedIdeaId == ideaId) {
							//the id matches so the idea is in the trash
							ideaInTrash = true;
							break;
						}
					}
				}				
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return ideaInTrash;
	}
	
	/**
	 * Determine if the idea is new and added in the current revision
	 * @param idea the idea
	 * @param previousIdeaBasket the previous basket revision
	 * @return
	 */
	private boolean isIdeaNew(JSONObject idea, JSONObject previousIdeaBasket) {
		boolean ideaNew = false;
		try {
			if(previousIdeaBasket == null) {
				//if there was no previous basket revision, the idea is new
				ideaNew = true;
			} else {
				//get the id
				int ideaId = idea.getInt("id");
				
				//try to get the idea from the previous basket revision
				JSONObject previousIdeaRevision = getIdeaById(previousIdeaBasket, ideaId);
				
				if(previousIdeaRevision == null) {
					/*
					 * we did not find the idea in the previous basket revision
					 * so the idea is new
					 */
					ideaNew = true;
				}				
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return ideaNew;
	}
	
	/**
	 * Determine if the idea was revised
	 * @param idea the idea
	 * @param previousIdeaBasket the previous basket revision
	 * @return whether the ideas was revised or not
	 */
	private boolean isIdeaRevised(JSONObject idea, JSONObject previousIdeaBasket) {
		boolean ideaRevised = false;
		try {
			if(previousIdeaBasket != null) {
				//get the id of the idea
				int ideaId = idea.getInt("id");
				
				//get the idea from the previous basket revision
				JSONObject previousIdeaRevision = getIdeaById(previousIdeaBasket, ideaId);
				
				if(previousIdeaRevision != null) {
					//get the time last edited timestamps
					long timeLastEdited = idea.getLong("timeLastEdited");
					long previousTimeLastEdited = previousIdeaRevision.getLong("timeLastEdited");

					//compare the time last edited timestamps
					if(timeLastEdited != previousTimeLastEdited) {
						ideaRevised = true;					
					}
					
					//get the text
					String text = idea.getString("text");
					String previousText = previousIdeaRevision.getString("text");
					
					//compare the text
					if(text != null && !text.equals(previousText)) {
						ideaRevised = true;
					}
					
					//get the flags
					String flag = idea.getString("flag");
					String previousFlag = previousIdeaRevision.getString("flag");
					
					//compare the flags
					if(flag != null && !flag.equals(previousFlag)) {
						ideaRevised = true;
					}
					
					//get the tags
					String tags = idea.getString("tags");
					String previousTags = previousIdeaRevision.getString("tags");
					
					//compare the tags
					if(tags != null && !tags.equals(previousTags)) {
						ideaRevised = true;
					}
					
					//get the source
					String source = idea.getString("source");
					String previousSource = previousIdeaRevision.getString("source");
					
					//compare the source
					if(source != null && !source.equals(previousSource)) {
						ideaRevised = true;
					}
				}	
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return ideaRevised;
	}
	
	/**
	 * Determine whether the position of an idea has changed
	 * @param ideaId the id of the idea
	 * @param currentIdeaBasket the current basket revision
	 * @param previousIdeaBasket the previous basket revision
	 * @return whether the position of the idea has changed
	 */
	private boolean isIdeaPositionChanged(int ideaId, JSONObject currentIdeaBasket, JSONObject previousIdeaBasket) {
		boolean ideaPositionChanged = false;
		
		int currentPositionInIdeas = -1;
		int currentPositionInDeleted = -1;
		
		int previousPositionInIdeas = -1;
		int previousPositionInDeleted = -1;
		
		//try to find the idea in the ideas array or deleted array of the previous basket revision
		previousPositionInIdeas = getPositionInIdeas(ideaId, previousIdeaBasket);
		previousPositionInDeleted = getPositionInDeleted(ideaId, previousIdeaBasket);
		
		
		if(previousPositionInIdeas == -1 && previousPositionInDeleted == -1) {
			/*
			 * idea was not in previous revision of idea basket which means
			 * it is new in the current revision. in this case we will return
			 * position changed as false
			 */
		} else {
			//try to find the position of the idea in the ideas array of the current basket revision
			currentPositionInIdeas = getPositionInIdeas(ideaId, currentIdeaBasket);
			
			if(currentPositionInIdeas == -1) {
				//we did not find it in the ideas array so we will look in the deleted array
				currentPositionInDeleted = getPositionInDeleted(ideaId, currentIdeaBasket);				
			}
			
			if(currentPositionInIdeas != -1 && previousPositionInIdeas != -1) {
				//the idea is in the ideas array of current and previous basket revisions
				
				if(currentPositionInIdeas != previousPositionInIdeas) {
					ideaPositionChanged = true;
				}
			} else if(currentPositionInDeleted != -1 && previousPositionInDeleted != -1) {
				//the idea is in the deleted array of current and previous basket revisions
				
				if(currentPositionInDeleted != previousPositionInDeleted) {
					ideaPositionChanged = true;
				}
			} else if(currentPositionInIdeas != -1 && previousPositionInDeleted != -1) {
				/*
				 * the idea is in the ideas array of the current basket revision 
				 * and in the deleted array of the previous basket revision
				 */
				ideaPositionChanged = true;
			} else if(currentPositionInDeleted != -1 && previousPositionInIdeas != -1) {
				/*
				 * the idea is in the deleted array of the current basket revision
				 * and in the ideas array of the previous basket revision
				 */
				ideaPositionChanged = true;
			}
		}
		
		return ideaPositionChanged;
	}
	
	/**
	 * Determine whether the idea was put into the trash in this revision
	 * @param ideaId the id of the idea
	 * @param currentIdeaBasket the current basket revision
	 * @param previousIdeaBasket the previous basket revision
	 * @return whether the idea was put into the trash in this revision
	 */
	private boolean isIdeaDeletedInThisRevision(int ideaId, JSONObject currentIdeaBasket, JSONObject previousIdeaBasket) {
		boolean ideaDeleted = false;
		
		//determine if the idea is in the trash in the current revision
		boolean ideaInCurrentTrash = isIdeaInTrash(currentIdeaBasket, ideaId);
		
		//determine if the idea is in the trash in the previous revision
		boolean ideaInPreviousTrash = isIdeaInTrash(previousIdeaBasket, ideaId);
		
		if(!ideaInPreviousTrash && ideaInCurrentTrash) {
			//the idea was not previously in the trash but now is in the trash
			ideaDeleted = true;
		}
		
		return ideaDeleted;
	}
	
	/**
	 * Get the position in the ideas array
	 * @param ideaId the id of the idea
	 * @param ideaBasket the basket revision
	 * @return the position of the idea in the ideas array, first position is 1,
	 * if the idea is not found it will return -1
	 */
	private int getPositionInIdeas(int ideaId, JSONObject ideaBasket) {
		return getPosition(ideaId, ideaBasket, "ideas");
	}
	
	/**
	 * Get the position in the deleted array
	 * @param ideaId the id of the idea
	 * @param ideaBasket the basket revision
	 * @return the position of the idea in the deleted array, first position is 1,
	 * if the idea is not found it will return -1
	 */
	private int getPositionInDeleted(int ideaId, JSONObject ideaBasket) {
		return getPosition(ideaId, ideaBasket, "deleted");
	}
	
	/**
	 * Get the position in the given array
	 * @param ideaId the id of the idea
	 * @param ideaBasket the basket revision
	 * @param arrayName the name of the array to look in ("ideas" or "deleted")
	 * @return the position of the idea in the given array, first position is 1,
	 * if the idea is not found it will return -1
	 */
	private int getPosition(int ideaId, JSONObject ideaBasket, String arrayName) {
		int position = -1;
		
		try {
			if(ideaBasket != null) {
				JSONArray ideaArray = ideaBasket.getJSONArray(arrayName);
				
				if(ideaArray != null) {
					//loop through all the ideas in the array
					for(int x=0; x<ideaArray.length(); x++) {
						//get an idea
						JSONObject idea = ideaArray.getJSONObject(x);
						
						//get the id of the idea
						int id = idea.getInt("id");
						
						if(ideaId == id) {
							//the id matches the one we want so we will return nthe position
							position = x + 1;
							break;
						}
					}
				}				
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return position;
	}
	
	/**
	 * Get the steps that this idea is used in
	 * @param idea the idea
	 * @param nodeIdToNodeTitlesMap a map of nodeId to nodeTitle
	 * @return a String containing the steps that the idea is used in
	 * e.g.
	 * node_1.ht:Introduction,node_3.or:Explain your ideas
	 */
	private String getStepsUsedIn(JSONObject idea, HashMap<String, String> nodeIdToNodeTitlesMap) {
		StringBuffer stepsUsedIn = new StringBuffer();
		
		try {
			JSONArray stepsUsedInJSONArray = idea.getJSONArray("stepsUsedIn");
			
			if(stepsUsedInJSONArray != null) {
				//loop through all the steps used in
				for(int x=0; x<stepsUsedInJSONArray.length(); x++) {
					//get the node id of the step used in
					String nodeId = stepsUsedInJSONArray.getString(x);
					
					//get the step name from the map
					String nodeName = nodeIdToNodeTitlesMap.get(nodeId);
					
					if(stepsUsedIn.length() != 0) {
						//separate multiple steps with ,
						stepsUsedIn.append(",");
					}
					
					//separate the node id and the node title with :
					stepsUsedIn.append(nodeId + ":" + nodeName);
				}
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return stepsUsedIn.toString();
	}
	
	/**
	 * Get the number of steps the idea is used in
	 * @param idea the idea JSONObject
	 * @return a count of the number of steps this idea is used in
	 */
	private int getStepsUsedInCount(JSONObject idea) {
		int count = 0;
		
		try {
			JSONArray stepsUsedInJSONArray = idea.getJSONArray("stepsUsedIn");
			
			if(stepsUsedInJSONArray != null) {
				//get the length of the array
				count = stepsUsedInJSONArray.length();
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return count;
	}
	
	/**
	 * Determine whether the steps used in changed
	 * @param idea the idea JSONObject
	 * @param previousIdeaBasket the previous basket revision
	 * @param nodeIdToNodeTitlesMap the map of node id to node title
	 * @return whether the steps used in changed for the idea
	 */
	private boolean isStepsUsedInChanged(JSONObject idea, JSONObject previousIdeaBasket, HashMap<String, String> nodeIdToNodeTitlesMap) {
		boolean stepsUsedInChanged = false;
		
		try {
			if(previousIdeaBasket != null) {
				int ideaId = idea.getInt("id");
				
				//get the idea from the previous revision
				JSONObject previousIdeaRevision = getIdeaById(previousIdeaBasket, ideaId);
				
				if(previousIdeaRevision != null) {
					//the idea existed in the previous basket revision
					
					//get the steps used in for the idea from the  current basket revision
					String currentStepsUsedIn = getStepsUsedIn(idea, nodeIdToNodeTitlesMap);
					
					//get the steps used in for the idea from the previous basket revision
					String previousStepsUsedIn = getStepsUsedIn(previousIdeaRevision, nodeIdToNodeTitlesMap);
					
					if(currentStepsUsedIn != null && previousStepsUsedIn != null && !currentStepsUsedIn.equals(previousStepsUsedIn)) {
						//the steps used in has changed
						stepsUsedInChanged = true;
					}							
				}
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return stepsUsedInChanged;
	}
	
	/**
	 * Convert a boolean into an int value
	 * @param boolValue true of false
	 * @return 0 or 1
	 */
	private int getIntFromBoolean(boolean boolValue) {
		int intValue = 0;
		
		if(boolValue) {
			intValue = 1;
		}
		
		return intValue;
	}
	
	/**
	 * Get the node type of the step that the idea was created on
	 * @param idea the idea JSONObject
	 * @param nodeIdToNodeContent map of node id to node content
	 * @return the node type the idea was created on
	 */
	private String getNodeTypeFromIdea(JSONObject idea, HashMap<String, JSONObject> nodeIdToNodeContent) {
		String nodeType = "";
		
		try {
			String nodeId = idea.getString("nodeId");
			
			//get the content for the node
			JSONObject nodeContent = nodeIdToNodeContent.get(nodeId);
			
			//get the node type
			nodeType = nodeContent.getString("type");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return nodeType;
	}
	
	/**
	 * Get the latest annotation score value
	 * @param stepWorksForNodeId the StepWork objects to look at annotations for
	 * @param teacherWorkgroupIds the teacher workgroup ids we want an annotation from
	 * @return the latest annotation score object associated with any of the StepWork
	 * objects in the list and has a fromWorkgroup from any of the workgroup ids in the
	 * teacherWorkgroupIds list
	 */
	private String getLatestAnnotationScoreByStepWork(List<StepWork> stepWorksForNodeId, List<String> teacherWorkgroupIds) {
		//get the latest annotation score with the given parameters
		AnnotationScore latestAnnotationScoreByStepWork = Annotation.getLatestAnnotationScoreByStepWork(stepWorksForNodeId, teacherWorkgroupIds);
		String score = "";
		
		if(latestAnnotationScoreByStepWork != null) {
			try {
				//get the annotation data
				String data = latestAnnotationScoreByStepWork.getData();
				JSONObject annotation = new JSONObject(data);
				
				//get the score value
				score = annotation.getString("value");
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		
		return score;
	}
	
	/**
	 * Get the latest annotation comment value
	 * @param stepWorksForNodeId the StepWork objects to look at annotations for
	 * @param teacherWorkgroupIds the teacher workgroup ids we want an annotation from
	 * @return the latest annotation comment object associated with any of the StepWork
	 * objects in the list and has a fromWorkgroup from any of the workgroup ids in the
	 * teacherWorkgroupIds list
	 */
	private String getLatestAnnotationCommentByStepWork(List<StepWork> stepWorksForNodeId, List<String> teacherWorkgroupIds) {
		//get the latest annotation comment with the given parameters
		AnnotationComment latestAnnotationCommentByStepWork = Annotation.getLatestAnnotationCommentByStepWork(stepWorksForNodeId, teacherWorkgroupIds);
		String comment = ""; 
		
		if(latestAnnotationCommentByStepWork != null) {
			try {
				//get the annotation data
				String data = latestAnnotationCommentByStepWork.getData();
				JSONObject annotation = new JSONObject(data);
				
				//get the score value
				comment = annotation.getString("value");
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		
		return comment;
	}
	
	/**
	 * Get the latest annotation score and timestamp and set it into the row
	 * @param stepWorksForNodeId the StepWork objects we want to look at
	 * for the associated annotation
	 * @param rowForWorkgroupId the row
	 * @param workgroupColumnCounter the column index
	 * @return the updated column counter pointing to the next empty column
	 */
	private int setLatestAnnotationScoreAndTimestamp(List<StepWork> stepWorksForNodeId, Row rowForWorkgroupId, int workgroupColumnCounter) {
		/*
		 * get the latest annotation associated with any of the StepWork objects
		 * and have fromWorkgroup as any of the workgroup ids in teacherWorkgroupIds
		 */
		AnnotationScore latestAnnotationScoreByStepWork = Annotation.getLatestAnnotationScoreByStepWork(stepWorksForNodeId, teacherWorkgroupIds);
		
		if(latestAnnotationScoreByStepWork != null) {
			try {
				//get the annotation data
				String data = latestAnnotationScoreByStepWork.getData();
				JSONObject annotation = new JSONObject(data);
				
				//get the score value
				String score = annotation.getString("value");

				//get the timestamp for the annotation
				Timestamp postTime = latestAnnotationScoreByStepWork.getPostTime();
				
				//get the timestamp as a string
				String timestampAnnotationPostTime = timestampToFormattedString(postTime);
				
				//set the timestamp
				rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue(timestampAnnotationPostTime);
				
				//set the score
				workgroupColumnCounter = setCellValue(rowForWorkgroupId, workgroupColumnCounter, score);
			} catch (JSONException e) {
				e.printStackTrace();
			}
		} else {
			//there is no annotation so we will just increment the column counter
			workgroupColumnCounter += 2;
		}
		
		return workgroupColumnCounter;
	}
	
	/**
	 * Get the latest annotation comment and timestamp and set it into the row
	 * @param stepWorksForNodeId the StepWork objects we want to look at
	 * for the associated annotation
	 * @param rowForWorkgroupId the row
	 * @param workgroupColumnCounter the column index
	 * @return the updated column counter pointing to the next empty column
	 */
	private int setLatestAnnotationCommentAndTimestamp(List<StepWork> stepWorksForNodeId, Row rowForWorkgroupId, int workgroupColumnCounter) {
		/*
		 * get the latest annotation associated with any of the StepWork objects
		 * and have fromWorkgroup as any of the workgroup ids in teacherWorkgroupIds
		 */
		AnnotationComment latestAnnotationCommentByStepWork = Annotation.getLatestAnnotationCommentByStepWork(stepWorksForNodeId, teacherWorkgroupIds);
		
		if(latestAnnotationCommentByStepWork != null) {
			try {
				//get the annotation data
				String data = latestAnnotationCommentByStepWork.getData();
				JSONObject annotation = new JSONObject(data);
				
				//get the score value
				String comment = annotation.getString("value");
				
				//get the timestamp for the annotation
				Timestamp postTime = latestAnnotationCommentByStepWork.getPostTime();
				
				//get the timestamp as a string
				String timestampAnnotationPostTime = timestampToFormattedString(postTime);
				
				//set the timestamp
				rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue(timestampAnnotationPostTime);
				
				//set the comment
				rowForWorkgroupId.createCell(workgroupColumnCounter++).setCellValue(comment);
			} catch (JSONException e) {
				e.printStackTrace();
			}
		} else {
			//there is no annotation so we will just increment the column counter
			workgroupColumnCounter += 2;
		}
		
		return workgroupColumnCounter;
	}
	
	/**
	 * Set the value in the row at the given column. if the string can be
	 * converted to a number we will do so. this makes a difference in the
	 * excel because strings are left aligned and numbers are right aligned.
	 * @param row the row
	 * @param columnCounter the column index
	 * @param value the value to set in the cell
	 * @return the next empty column
	 */
	private int setCellValue(Row row, int columnCounter, String value) {
		if(value != null && !value.equals("")) {
			try {
				//try to conver the value to a number and then set the value into the cell
				row.createCell(columnCounter).setCellValue(Long.parseLong(value));
			} catch(NumberFormatException e) {
				e.printStackTrace();
				//set the string value into the cell
				row.createCell(columnCounter).setCellValue(value);
			}
		} else {
			//set the value into the cell
			row.createCell(columnCounter).setCellValue(value);				
		}
		
		//increment the column counter
		columnCounter++;
		
		return columnCounter;
	}
	
	/**
	 * Get the timestamp as a string
	 * @param timestamp the timestamp object
	 * @return the timstamp as a string
	 * e.g.
	 * Mar 9, 2011 8:50:47 PM
	 */
	private String timestampToFormattedString(Timestamp timestamp) {
		String timestampString = "";
		
		if(timestamp != null) {
			//get the object to format timestamps
			DateFormat dateTimeInstance = DateFormat.getDateTimeInstance();
			
			//get the timestamp for the annotation
			long time = timestamp.getTime();
			Date timestampDate = new Date(time);
			timestampString = dateTimeInstance.format(timestampDate);			
		}
		
		return timestampString;
	}
	
	/**
	 * Parse the student attendance data and put it into the workgroupIdToStudentAttendance HashMap
	 * @param studentAttendanceArray a JSONArray containing all the student attendance rows
	 */
	private void parseStudentAttendance(JSONArray studentAttendanceArray) {
		//loop through all the stuent attendance rows
		for(int x=0; x<studentAttendanceArray.length(); x++) {
			try {
				//get a student attendence row
				JSONObject studentAttendanceEntry = studentAttendanceArray.getJSONObject(x);
				
				//get the workgroup id
				long workgroupId = studentAttendanceEntry.getLong("workgroupId");
				
				//get the JSONArray that holds all the student attendence entries for this workgroup id
				JSONArray workgroupIdStudentAttendance = workgroupIdToStudentAttendance.get(workgroupId);
				
				if(workgroupIdStudentAttendance == null) {
					//the JSONArray does not exist so we will create it
					workgroupIdStudentAttendance = new JSONArray();
					workgroupIdToStudentAttendance.put(workgroupId, workgroupIdStudentAttendance);
				}
				
				//add the student attendence entry to the JSONArray
				workgroupIdStudentAttendance.put(studentAttendanceEntry);
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * Get the first student attendence object before the given timestamp for a given workgroup id.
	 * We basically want the student attendance at the time of the given timestamp.
	 * @param workgroupId the id of the workgroup we are looking for
	 * @param timestamp the time we want the student attendence to be before
	 * @return the student attendance JSONObject
	 */
	private JSONObject getStudentAttendanceForWorkgroupIdTimestamp(long workgroupId, long timestamp) {
		JSONObject studentAttendanceEntry = null;
		
		//get the JSONArray that stores all the student attendence objects for this workgroup id
		JSONArray workgroupIdStudentAttendance = workgroupIdToStudentAttendance.get(workgroupId);
		
		if(workgroupIdStudentAttendance != null) {
			
			/*
			 * loop through all the student attendance objects in the array.
			 * the array is ordered from newer to older. so the first 
			 * student attendance object with a loginTimestamp before
			 * the function argument timestamp is the student attendance
			 * object we want.
			 */
			for(int x=0; x<workgroupIdStudentAttendance.length(); x++) {
				try {
					//get a student attendance object
					JSONObject tempStudentAttendanceEntry = workgroupIdStudentAttendance.getJSONObject(x);
					
					if(tempStudentAttendanceEntry != null) {
						//get the login timestamp
						long loginTimestamp = tempStudentAttendanceEntry.getLong("loginTimestamp");
						
						if(loginTimestamp < timestamp) {
							/*
							 * the login timestamp is before the timestamp we are looking for
							 * so we have found the student attendance object we want
							 */
							studentAttendanceEntry = tempStudentAttendanceEntry;
							break;
						}
					}
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
		}
		
		return studentAttendanceEntry;
	}
	
	/**
	 * Sort the student user ids array
	 * @param studentLoginsArray a String array containing student user ids that are
	 * numbers
	 * @return an ArrayList of Long objects sorted numerically
	 */
	private ArrayList<Long> sortStudentLoginsArray(String[] studentLoginsArray) {
		
		ArrayList<Long> studentLoginsList = new ArrayList<Long>();
		
		//loop through all the student user ids
		for(int x=0; x<studentLoginsArray.length; x++) {
			//get a student user id
			String studentLogin = studentLoginsArray[x];
			
			try {
				//add the long to the list
				studentLoginsList.add(Long.parseLong(studentLogin));
			} catch(NumberFormatException e) {
				e.printStackTrace();
			}
		}
		
		//sort the list
		Collections.sort(studentLoginsList);
		
		return studentLoginsList;
	}
}
