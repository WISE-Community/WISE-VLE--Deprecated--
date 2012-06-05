package vle.web;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.Vector;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import utils.FileManager;
import vle.VLEServlet;
import vle.domain.node.Node;
import vle.domain.user.UserInfo;
import vle.domain.work.StepWork;

public class VLEGetSpecialExport extends VLEServlet {

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
	private String nodeId = "";
	
	//holds all the teacher workgroup ids
	private List<String> teacherWorkgroupIds = null;
	
	//the custom steps to export
	List<String> customSteps = null;
	
	//the number of columns to width auto size
	int numColumnsToAutoSize = 0;
	
	//the project meta data
	private JSONObject projectMetaData = null;
	
	private static long debugStartTime = 0;
	
	//the type of export "latestStudentWork" or "allStudentWork"
	private String exportType = "";
	
	private static Properties vleProperties = null;
	
	{
		try {
			//get the vle.properties file
			vleProperties = new Properties();
			vleProperties.load(getClass().getClassLoader().getResourceAsStream("vle.properties"));
		} catch (Exception e) {
			System.err.println("VLEGetSpecialExport could not read in vleProperties file");
			e.printStackTrace();
		}
	}
	
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
		nodeId = "";
		
		//holds all the teacher workgroup ids
		teacherWorkgroupIds = null;
		
		//holds the custom steps to export data for
		customSteps = new Vector<String>();
		
		//reset the number of columns to width auto size
		numColumnsToAutoSize = 0;
		
		//reset the project meta data
		projectMetaData = null;
		
		//holds the export type
		exportType = "";
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
	@SuppressWarnings("unused")
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
		
		//get the path of the project file on the server
		String projectPath = (String) request.getAttribute("projectPath");
		
		//get the path of the project meta data
		String projectMetaDataJSONString = (String) request.getAttribute("projectMetaData");

		//get the path of the vlewrapper base dir
		String vlewrapperBaseDir = vleProperties.getProperty("vlewrapperBaseDir");
		
		try {
			//get the project meta data JSON object
			projectMetaData = new JSONObject(projectMetaDataJSONString);
		} catch (JSONException e2) {
			e2.printStackTrace();
		}
		
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
		nodeId = request.getParameter("nodeId");
		
		//the export type "latestStudentWork" or "allStudentWork"
		exportType = request.getParameter("exportType");
		
		JSONArray customStepsArray = new JSONArray();
		
		//gather the custom steps if the teacher is requesting a custom export
		if(exportType.equals("customLatestStudentWork") || exportType.equals("customAllStudentWork")) {
			String customStepsArrayJSONString = request.getParameter("customStepsArray");
			
			try {
				customStepsArray = new JSONArray(customStepsArrayJSONString);
				
				//loop through all the node ids
				for(int x=0; x<customStepsArray.length(); x++) {
					//add the node id to our list of custom steps
					String nodeId = customStepsArray.getString(x);
					customSteps.add(nodeId);
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		
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
						 * get the student logins, this is a single string with the logins
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
	    
	    if(exportType.equals("specialExport")) {

	    	String nodeTitleWithPosition = nodeIdToNodeTitlesWithPosition.get(nodeId);
	    	String fileName = projectName + "-" + runId + "-" + nodeTitleWithPosition;
	    	fileName = fileName.replaceAll(" ", "_");
	    	
	    	/*
	    	 * we will return a zipped folder that contains all the necessary
	    	 * files to view the student work
	    	 */
	    	response.setContentType("application/zip");
			response.addHeader("Content-Disposition", "attachment;filename=\"" + fileName + ".zip" + "\"");
			
			//create a folder that will contain all the files and will then be zipped
			File zipFolder = new File(fileName);
			zipFolder.mkdir();
			
			//create the file that will contain all the student data in a JSON array
			File studentDataFile = new File(zipFolder, "studentData.js");
			JSONArray studentDataArray = new JSONArray();
			
			String nodeType = "";
			
			//get the step content
			JSONObject nodeContent = nodeIdToNodeContent.get(nodeId);
			
			if(nodeContent != null) {
				try {
					//get the node type e.g. SVGDraw or mysystem2
					nodeType = nodeContent.getString("type");
					
					if(nodeType != null) {
						//make the node type lower case for easy comparison later
						nodeType = nodeType.toLowerCase();
					}
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
			
			if(nodeType == null) {
				
			} else if(nodeType.equals("svgdraw")) {
				if(vlewrapperBaseDir != null && vlewrapperBaseDir != "") {
					//get the lz77.js file from the server
					File sourcelz77File = new File(vlewrapperBaseDir + "/vle/node/draw/svg-edit/lz77.js");
					
					//create a lz77.js file in the folder we are creating
					File newlz77File = new File(zipFolder, "lz77.js");
					
					//copy the contents of the lz77.js file into our new file
					FileUtils.copyFile(sourcelz77File, newlz77File);					
				}
			} else if(nodeType.equals("mysystem2")) {
				if(vlewrapperBaseDir != null && vlewrapperBaseDir != "") {
					//get the lz77.js file from the server
					File sourcelz77File = new File(vlewrapperBaseDir + "/vle/node/mysystem2/authoring/js/libs/lz77.js");

					//create a lz77.js file in the folder we are creating
					File newlz77File = new File(zipFolder, "lz77.js");
					
					//copy the contents of the lz77.js file into our new file
					FileUtils.copyFile(sourcelz77File, newlz77File);					
				}
			}
			
			//loop through the workgroup ids
			for(int x=0; x<workgroupIds.size(); x++) {
				//get a workgroup id
				String userId = workgroupIds.get(x);
				Long userIdLong = Long.parseLong(userId);
				
				//get the UserInfo object for the workgroup id
				UserInfo userInfo = UserInfo.getByWorkgroupId(userIdLong);

				//get all the work for a workgroup id
				List<StepWork> stepWorksForWorkgroupId = StepWork.getByUserInfo(userInfo);
				
				//get all the step works for this node id
				List<StepWork> stepWorksForNodeId = getStepWorksForNodeId(stepWorksForWorkgroupId, nodeId);
				
				//get the latest step work that contains a response
				StepWork latestStepWorkWithResponse = getLatestStepWorkWithResponse(stepWorksForNodeId);
				
				Long stepWorkId = null;
				String studentData = "";
				
				if(latestStepWorkWithResponse != null) {
					//get the step work id
					stepWorkId = latestStepWorkWithResponse.getId();
					
					//get the student data
					studentData = getStudentData(latestStepWorkWithResponse);
				}
				
				JSONObject studentObject = new JSONObject();
				try {
					//put the workgroup id into the JSON object
					studentObject.put("workgroupId", userIdLong);
					
					//put the student data into the JSON object
					studentObject.put("data", studentData);
					
					//put the step work id into the JSON Object
					if(stepWorkId == null) {
						studentObject.put("stepWorkId", "");
					} else {
						studentObject.put("stepWorkId", stepWorkId);						
					}
				} catch (JSONException e) {
					e.printStackTrace();
				}
				
				//add the student object into the array
				studentDataArray.put(studentObject);
			}
			
			/*
			 * turn the student data array into a javascript declaration
			 * e.g.
			 * from
			 * []
			 * to
			 * var studentData = [];
			 */
			String javascriptArrayString = getJavascriptArrayText("studentData", studentDataArray);
			
			//write the student data to the studentData.js file
			FileUtils.writeStringToFile(studentDataFile, javascriptArrayString);
			
			//create an html file that users will use to view the student data
			File htmlFile = new File(zipFolder, "viewStudentWork.html");
			
			//write the html to the display.html file
			FileUtils.writeStringToFile(htmlFile, getHtmlDisplayFileText(nodeType));
			
			//get the response output stream
			ServletOutputStream outputStream = response.getOutputStream();
			
			//create ZipOutputStream object
			ZipOutputStream out = new ZipOutputStream(
					new BufferedOutputStream(outputStream));
			
			//get path prefix so that the zip file does not contain the whole path
			// eg. if folder to be zipped is /home/lalit/test
			// the zip file when opened will have test folder and not home/lalit/test folder
			int len = zipFolder.getAbsolutePath().lastIndexOf(File.separator);
			String baseName = zipFolder.getAbsolutePath().substring(0,len+1);
			
			//add the folder to the zip file
			addFolderToZip(zipFolder, out, baseName);
			
			//close the zip output stream
			out.close();
			
			//delete the folder that has been created on the server
			FileUtils.deleteDirectory(zipFolder);
	    }
		
	    //perform cleanup
		clearVariables();
	}
	
	/**
	 * Get the html that we will put into the display.html file
	 * @param nodeType the step type (make sure it is all lowercase) e.g. svgdraw or mysystem2
	 * @return the html text that we will put into the display.html file
	 */
	private String getHtmlDisplayFileText(String nodeType) {
		//used to accumulate the html text
		StringBuffer html = new StringBuffer();
		
		html.append("<html>\n");
		
		html.append("<head>\n");
		
		//add the import of studentData.js
		html.append("<script type='text/javascript' src='studentData.js'></script>\n");
		
		//import any other necessary .js files
		if(nodeType == null) {
			
		} else if(nodeType.equals("svgdraw")) {
			html.append("<script type='text/javascript' src='lz77.js'></script>\n");
		} else if(nodeType.equals("mysystem2")) {
			html.append("<script type='text/javascript' src='lz77.js'></script>\n");
		}
		
		html.append("<script>\n");
		
		//create any necessary global variables
		if(nodeType == null) {
			
		} else if(nodeType.equals("svgdraw")) {
			html.append("var lz77 = new LZ77();\n\n");
		} else if(nodeType.equals("mysystem2")) {
			html.append("var lz77 = new LZ77();\n\n");
		}
		
		//create the function that will load the student data
		html.append("function loadStudentData() {\n");
		html.append("	for(var x=0; x<studentData.length; x++) {\n");
		html.append("		var tempStudentData = studentData[x];\n");
		
		if(nodeType == null) {
			
		} else if(nodeType.equals("svgdraw")) {
			/*
			 * perform the necessary processing to retrieve the SVG string.
			 * the student data from svgdraw steps must be lz77 decompressed.
			 */
			html.append("		document.getElementById('studentDataDiv').innerHTML += 'Workgroup Id:' + tempStudentData.workgroupId + '<br>';\n");
			html.append("		document.getElementById('studentDataDiv').innerHTML += 'Step Work Id:' + tempStudentData.stepWorkId + '<br>';\n");
			html.append("\n");
			html.append("		var data = tempStudentData.data;\n");
			html.append("		var svgString = '';\n\n");
			html.append("		if(data != null && data != '') {\n");
			html.append("			data = data.replace(/^--lz77--/,'');\n");
			html.append("			data = JSON.parse(lz77.decompress(data));\n");
			html.append("			svgString = data.svgString;\n");
			html.append("		}\n\n");
			html.append("		document.getElementById('studentDataDiv').innerHTML += 'Student Data:<br>' + svgString + '<br>';\n");
		} else if(nodeType.equals("mysystem2")) {
			/*
			 * perform the necessary processing to retrieve the SVG string.
			 * the student data from mysystem2 steps must be unescaped and
			 * then lz77 decompressed.
			 */
			html.append("		document.getElementById('studentDataDiv').innerHTML += 'Workgroup Id:' + tempStudentData.workgroupId + '<br>';\n");
			html.append("		document.getElementById('studentDataDiv').innerHTML += 'Step Work Id:' + tempStudentData.stepWorkId + '<br>';\n");
			html.append("\n");
			html.append("		var data = tempStudentData.data;\n");
			html.append("		var svgString = '';\n\n");
			html.append("		if(data != null && data != '') {\n");
			html.append("			data = unescape(data);\n");
			html.append("			svgString = lz77.decompress(data);\n");
			html.append("		}\n\n");
			html.append("		document.getElementById('studentDataDiv').innerHTML += 'Student Data:<br>' + svgString + '<br>';\n");
		}
		
		html.append("		document.getElementById('studentDataDiv').innerHTML += '<br>';\n");
		html.append("	}\n");
		html.append("}\n");
		
		html.append("</script>\n");
		html.append("</head>\n");
		
		//set the body onload to load the student data
		html.append("<body onload='loadStudentData()'>\n");
		
		//the div that will display all the student data
		html.append("<div id='studentDataDiv'></div>\n");
		
		html.append("</body>\n");
		
		html.append("</html>\n");
		
		return html.toString();
	}
	
	/**
	 * Turn the JSONArray into a javascript array declaration in
	 * the form of a string.
	 * e.g.
	 * before
	 * []
	 * after
	 * var studentData = [];
	 * @param jsVariableName the javascript variable name that we will use
	 * @param jsonArray a JSONArray
	 * @return a string containing the javascript array declaration
	 */
	private String getJavascriptArrayText(String jsVariableName, JSONArray jsonArray) {
		StringBuffer result = new StringBuffer();
		
		if(jsonArray != null) {
			String jsonArrayString = "";
			try {
				/*
				 * get the string representation of the JSONArray with
				 * proper indentation (using 3 spaces per tab) so it 
				 * will be easy for a human to read 
				 */
				jsonArrayString = jsonArray.toString(3);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			
			if(jsonArrayString != null && !jsonArrayString.equals("")) {
				//make the array declaration string
				result.append("var " + jsVariableName + " = ");
				result.append(jsonArrayString);
				result.append(";");			
			}
		}

		return result.toString();
	}
	
	/**
	 * Get the student data from the step work
	 * @param stepWork the step work object
	 * @return a string containing the student data. the
	 * contents of the string depend on the step type
	 * that the work was for.
	 */
	private String getStudentData(StepWork stepWork) {
		String studentData = "";
		
		String nodeType = "";
		Node node = null;

		//get the node type
		if(stepWork != null) {
			node = stepWork.getNode();
			
			if(node != null && node.getNodeType() != null) {
				//get the node type from the node object e.g. "OpenResponseNode"
				nodeType = node.getNodeType();
			}
		}
		
		if(stepWork != null) {
			//get the step work data
			String stepWorkData = stepWork.getData();
			
			if(stepWorkData != null) {
				try {
					//create a JSONObject from the data
					JSONObject dataJSONObject = new JSONObject(stepWorkData);
					
					if(dataJSONObject.has("nodeStates")) {
						//get the node states
						JSONArray nodeStates = dataJSONObject.getJSONArray("nodeStates");
						
						if(nodeStates != null) {
							if(nodeStates.length() > 0) {
								//get the latest node state
								JSONObject latestNodeState = nodeStates.getJSONObject(nodeStates.length() - 1);
								
								if(latestNodeState != null) {
									if(nodeType == null || nodeType.equals("")) {
										
									} else if(nodeType.equals("SVGDrawNode")) {
										
										if(latestNodeState.has("data")) {
											//get the data
											studentData = latestNodeState.getString("data");											
										}
									} else if(nodeType.equals("Mysystem2Node")) {
										//get the svg string that is embedded inside the response
										
										if(latestNodeState.has("response")) {
											//get the response
											String response = latestNodeState.getString("response");
											
											if(response != null && !response.equals("")) {
												//get the response as a JSONObject
												JSONObject responseJSONObject = new JSONObject(response);
												
												if(responseJSONObject != null && responseJSONObject.has("MySystem.GraphicPreview")) {
													//get the MySystem.GraphicPreview JSONObject
													JSONObject graphicPreview = responseJSONObject.getJSONObject("MySystem.GraphicPreview");
													
													if(graphicPreview != null && graphicPreview.has("LAST_GRAPHIC_PREVIEW")) {
														//get the LAST_GRAPHIC_PREVIEW JSONObject
														JSONObject lastGraphicPreview = graphicPreview.getJSONObject("LAST_GRAPHIC_PREVIEW");
														
														if(lastGraphicPreview != null && lastGraphicPreview.has("svg")) {
															//get the svg string
															String svg = lastGraphicPreview.getString("svg");
															studentData = svg;
														}
													}
												}
											}
										}
									}
								}								
							}
						}
					}
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
		}
		
		return studentData;
	}
	
	/**
	 * Get the student work from the step work
	 * @param stepWork the step work object
	 * @return the student work as a string
	 */
	private String getStepWorkResponse(StepWork stepWork) {
		String stepWorkResponse = "";
		
		//get the student work
		stepWorkResponse = getStudentData(stepWork);
		
		return stepWorkResponse;
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
			StepWork tempStepWork = stepWorks.get(z);
			
			//retrieve the student work from the step work, if any
			stepWorkResponse = getStepWorkResponse(tempStepWork);
			
			/*
			 * if the step work is not empty, we are done looking
			 * for the latest work
			 */
			if(!stepWorkResponse.equals("")) {
				stepWork = tempStepWork;
				break;
			}
		}
		
		return stepWork;
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
	
	private static void addFolderToZip(File folder, ZipOutputStream zip, String baseName) throws IOException {
		File[] files = folder.listFiles();
		for (File file : files) {
			if (file.isDirectory()) {
				// add folder to zip
				String name = file.getAbsolutePath().substring(baseName.length());
				ZipEntry zipEntry = new ZipEntry(name+"/");
				zip.putNextEntry(zipEntry);
				zip.closeEntry();
				addFolderToZip(file, zip, baseName);
			} else {
				// it's a file.				
				String name = file.getAbsolutePath().substring(baseName.length());
				ZipEntry zipEntry = new ZipEntry(name);
				zip.putNextEntry(zipEntry);
				IOUtils.copy(new FileInputStream(file), zip);
				zip.closeEntry();
			}
		}
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
				
				//whether to include the data for this step in the export
				boolean exportStep = true;
				
				if(customSteps.size() != 0) {
					//the teacher has provided a list of custom steps
					
					if(!customSteps.contains(identifier)) {
						//the current node id is not listed in the custom steps so we will not export the data for it
						exportStep = false;
					}
				}
				
				if(exportStep) {
					//we will export the data for this step
					
					//add the identifier to our list of nodes
					nodeIdList.add(identifier);
					
					//obtain the title of the node
					String nodeTitle = nodeIdToNodeTitles.get(identifier);
					
					//add the pre-pend the position to the title
					String nodeTitleWithPosition = positionSoFar + nodePosition + " " + nodeTitle;
					
					//add the title with position to the map
					nodeIdToNodeTitlesWithPosition.put(identifier, nodeTitleWithPosition);					
				}
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
}
