/**
 * 
 */
package vle.web;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Vector;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import utils.SecurityUtils;
import vle.domain.annotation.Annotation;
import vle.domain.annotation.AnnotationFactory;
import vle.domain.annotation.AnnotationFlag;
import vle.domain.node.Node;
import vle.domain.peerreview.PeerReviewWork;
import vle.domain.user.UserInfo;
import vle.domain.work.StepWork;

/**
 * Controllers for handling Annotation GET and POST 
 * @author hirokiterashima
 */
public class VLEAnnotationController extends HttpServlet {

	private static final long serialVersionUID = 1L;
	
	private boolean standAlone = true;
	
	private boolean modeRetrieved = false;

	public void doPost(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
		/* check to see if we are in portal mode */
		if(!this.modeRetrieved){
			this.standAlone = !SecurityUtils.isPortalMode(request);
			this.modeRetrieved = true;
		}
		
		/* make sure that this request is authenticated through the portal before proceeding */
		if(this.standAlone || SecurityUtils.isAuthenticated(request)){
			doPostJSON(request, response);
		} else {
			/* not authenticated send not authorized status */
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
		}
    }
	
	public void doGet(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
		/* check to see if we are in portal mode */
		if(!this.modeRetrieved){
			this.standAlone = !SecurityUtils.isPortalMode(request);
			this.modeRetrieved = true;
		}
		
		/* make sure that this request is authenticated through the portal before proceeding */
		if(this.standAlone || SecurityUtils.isAuthenticated(request)){
			doGetJSON(request, response);
		} else {
			/* not authenticated send not authorized status */
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
		}
    }
	
	@SuppressWarnings("unchecked")
	public void doGetJSON(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
		String requestedType = request.getParameter("type");
		String fromWorkgroupIdStr = request.getParameter("fromWorkgroup");
		String fromWorkgroupIdsStr = request.getParameter("fromWorkgroups");
		String toWorkgroupIdStr = request.getParameter("toWorkgroup");
		String runId = request.getParameter("runId");
		String stepWorkIdStr = request.getParameter("stepWorkId");
		String isStudentStr = request.getParameter("isStudent");
		
		//this is only used when students retrieve flags
		Vector<JSONObject> flaggedAnnotationsList = new Vector<JSONObject>();
		
		//used to hold classmate workgroup ids to period ids
		HashMap<Long, Long> classmateWorkgroupIdToPeriodIdMap = new HashMap<Long, Long>();
		
		Long periodId = null;
		
		Long longRunId = null;
		if(runId != null) {
			longRunId = Long.parseLong(runId);			
		}
		
		Long stepWorkId = null;
		if(stepWorkIdStr != null) {
			stepWorkId = Long.parseLong(stepWorkIdStr);
		}
		
		boolean isStudent = false;
		if(isStudentStr != null) {
			isStudent = Boolean.parseBoolean(isStudentStr);
		}
		
		/*
		 * retrieval of periods is only required when students request flagged work
		 * because we only want students to see flagged work from their own period
		 */
		if(requestedType.equals("flag") && isStudent) {
			try {
				//get the signed in student's user info and period id
				String myUserInfoString = (String) request.getAttribute("myUserInfo");
				JSONObject myUserInfo = new JSONObject(myUserInfoString);
				periodId = myUserInfo.getLong("periodId");
				
				//get the classmate user infos
				String classmateUserInfosString = (String) request.getAttribute("classmateUserInfos");
				JSONArray classmateUserInfos = new JSONArray(classmateUserInfosString);
				
				//loop through all the classmate user infos
				for(int x=0; x<classmateUserInfos.length(); x++) {
					//get a classmate user info
					JSONObject classmateUserInfo = classmateUserInfos.getJSONObject(x);
					
					//get the workgroup id and period id of the classmate
					long classmateWorkgroupId = classmateUserInfo.getLong("workgroupId");
					long classmatePeriodId = classmateUserInfo.getLong("periodId");
					
					//add the classmate workgroup id to period id entry into the map
					classmateWorkgroupIdToPeriodIdMap.put(classmateWorkgroupId, classmatePeriodId);
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		
		// if requestedType is null, return all annotations
		List<? extends Annotation> annotationList = null;
		Annotation annotation = null;
		if (requestedType == null || requestedType.equals("annotation")) {
			if(fromWorkgroupIdStr != null && stepWorkId != null) {
				//user is requesting an annotation they wrote themselves for a specific stepWork
				UserInfo fromWorkgroup = UserInfo.getByWorkgroupId(new Long(fromWorkgroupIdStr));
				StepWork stepWork = (StepWork) StepWork.getById(stepWorkId, StepWork.class);
				annotation = Annotation.getByUserInfoAndStepWork(fromWorkgroup, stepWork, Annotation.class);
			} else if(fromWorkgroupIdsStr != null && toWorkgroupIdStr != null) {
				/*
				 * user is requesting all annotations to toWorkgroup and from any fromWorkgroup
				 * in the list of fromWorkgroups
				 */
				UserInfo toWorkgroup = UserInfo.getOrCreateByWorkgroupId(new Long(toWorkgroupIdStr));
				
				//split the fromWorkgroups
				String[] split = fromWorkgroupIdsStr.split(",");
				
				//create a String List out of the fromWorkgroups
				List<String> fromWorkgroupIds = Arrays.asList(split);
				
				//get the UserInfo objects for the fromWorkgroups
				List<UserInfo> fromWorkgroups = UserInfo.getByWorkgroupIds(fromWorkgroupIds);
				
				//get all the annotations that match
				annotationList = Annotation.getByFromWorkgroupsAndToWorkgroup(fromWorkgroups, toWorkgroup, Annotation.class);
			} else if (fromWorkgroupIdStr != null || toWorkgroupIdStr != null) {
				UserInfo fromWorkgroup = null;
				UserInfo toWorkgroup = null;
				if (fromWorkgroupIdStr != null) {
					fromWorkgroup = UserInfo.getByWorkgroupId(new Long(fromWorkgroupIdStr));
				}
				if (toWorkgroupIdStr != null) {
					toWorkgroup = UserInfo.getByWorkgroupId(new Long(toWorkgroupIdStr));
				}
				annotationList = Annotation.getByFromWorkgroupAndToWorkgroup(fromWorkgroup, toWorkgroup, Annotation.class);
			} else if(runId != null) {
				//get all the annotations for the run id
				annotationList = (List<Annotation>) Annotation.getByRunId(longRunId, Annotation.class);
			} else {
				annotationList = (List<Annotation>) Annotation.getList(Annotation.class);
			}
		} else if (requestedType.equals("flag")) {
			/*
			 * get the flags based on the paremeters that were passed in the request.
			 * this will return the flag annotations ordered from oldest to newest
			 */
	    	annotationList = AnnotationFlag.getByParamMap(request.getParameterMap());
		}

		JSONObject annotationsJSONObj = null;
		if(annotationList != null) {
			//a list of annotations will be returned
			
			annotationsJSONObj = new JSONObject();  // all annotations
			
			/*
			 * loop through all the annotations, the annotations are ordered
			 * from oldest to newest
			 */
			for (Annotation annotationObj : annotationList) {
				try {
					//get an annotation
					JSONObject dataJSONObj = new JSONObject(annotationObj.getData());
					
					//add the postTime
					dataJSONObj.put("postTime", annotationObj.getPostTime().getTime());
					
					/*
					 * if this is a student making the request we will add the stepWork data
					 * to each of the flags so they can see the work that was flagged
					 */
					if(requestedType.equals("flag") && isStudent) {
						//get the stepWorkId of the work that was flagged
						String flagStepWorkId = dataJSONObj.getString("stepWorkId");
						
						//get the StepWork object
						StepWork flagStepWork = StepWork.getByStepWorkId(new Long(flagStepWorkId));
						
						//get the user info of the work that was flagged
						UserInfo flaggedWorkUserInfo = flagStepWork.getUserInfo();
						
						//get the workgroup id of the work that was flagged
						Long flaggedWorkgroupId = flaggedWorkUserInfo.getWorkgroupId();
						
						//get the period id of the work that was flagged
						Long flaggedPeriodId = classmateWorkgroupIdToPeriodIdMap.get(flaggedWorkgroupId);
						
						//check that the period of the flagged work is the same period that the signed in user is in
						if(periodId != null && flaggedPeriodId != null && periodId.equals(flaggedPeriodId)) {

							//get the data
							JSONObject flagStepWorkData = new JSONObject(flagStepWork.getData());
							
							//check if the flag value is set to "flagged" as opposed to "unflagged"
							if(dataJSONObj.has("value") && dataJSONObj.getString("value").equals("flagged")) {
								
								//add the data to the flag JSON object
								dataJSONObj.put("data", flagStepWorkData);
								
								//put the flag object into our list
								flaggedAnnotationsList.add(dataJSONObj);
							} else {
								//remove the flag from the list because it was unflagged

								/*
								 * loop through all the flagged annotations we have already obtained
								 * to remove the annotation that was unflagged
								 */
								Iterator<JSONObject> flaggedAnnotationsIterator = flaggedAnnotationsList.iterator();
								while(flaggedAnnotationsIterator.hasNext()) {
									//get an annotation
									JSONObject nextFlaggedAnnotation = flaggedAnnotationsIterator.next();
									
									//check if the annotation fields match
									if(nextFlaggedAnnotation.has("toWorkgroup") && dataJSONObj.has("toWorkgroup") && nextFlaggedAnnotation.getString("toWorkgroup").equals(dataJSONObj.getString("toWorkgroup")) &&
											nextFlaggedAnnotation.has("fromWorkgroup") && dataJSONObj.has("fromWorkgroup") && nextFlaggedAnnotation.getString("fromWorkgroup").equals(dataJSONObj.getString("fromWorkgroup")) &&
											nextFlaggedAnnotation.has("nodeId") && dataJSONObj.has("nodeId") && nextFlaggedAnnotation.getString("nodeId").equals(dataJSONObj.getString("nodeId")) &&
											nextFlaggedAnnotation.has("stepWorkId") && dataJSONObj.has("stepWorkId") && nextFlaggedAnnotation.getString("stepWorkId").equals(dataJSONObj.getString("stepWorkId")) &&
											nextFlaggedAnnotation.has("runId") && dataJSONObj.has("runId") && nextFlaggedAnnotation.getString("runId").equals(dataJSONObj.getString("runId"))) {
										flaggedAnnotationsIterator.remove();
									}
								}
							}
						}
					} else {
						//add the annotation to the JSON obj we will return
						annotationsJSONObj.append("annotationsArray", dataJSONObj);
					}
				} catch (JSONException e) {
					response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "error retrieving annotations");
					e.printStackTrace();
				}
			}
			
			/*
			 * the student is requesting the flags, we will now insert the json flag annotation
			 * objects into the annotationsJSONObj that will be returned as a response to the
			 * user
			 */
			if(requestedType.equals("flag") && isStudent) {
				//get all the stepwork ids that were flagged

				//loop through all the flag annotations
				for(JSONObject flagAnnotationDataJSONObj : flaggedAnnotationsList) {
					try {
						//get the run id, node id, and student id
						String flaggedRunId = flagAnnotationDataJSONObj.getString("runId");
						String flaggedNodeId = flagAnnotationDataJSONObj.getString("nodeId");
						String flaggedToWorkgroup = flagAnnotationDataJSONObj.getString("toWorkgroup");
						
						//get the Node and UserInfo objects
						Node node = Node.getByNodeIdAndRunId(flaggedNodeId, flaggedRunId);
						UserInfo studentWorkgroup = UserInfo.getByWorkgroupId(new Long(flaggedToWorkgroup));
						
						/*
						 * get the step works the student did for the node. the list will be
						 * ordered from newest to oldest
						 */
						List<StepWork> stepWorks = StepWork.getByUserInfoAndNode(studentWorkgroup, node);
						
						JSONObject latestStepWorkDataJSONObj = null;
						
						//loop through all the step works the student did
						for(int x=0; x<stepWorks.size(); x++) {
							//get a step work
							StepWork stepWork = stepWorks.get(x);
							
							//get the json data from the step work
							String stepWorkData = stepWork.getData();
							
							//remember the newest step work data
							latestStepWorkDataJSONObj = new JSONObject(stepWorkData);
							
							//get the node states
							JSONArray nodeStates = latestStepWorkDataJSONObj.getJSONArray("nodeStates");
							
							//check if the node states is empty
							if(nodeStates.length() > 0) {
								/*
								 * node states is not empty so we have found the newest
								 * step work that contains actual work  
								 */
								break;
							}
						}
						
						//check if we found any step work data
						if(latestStepWorkDataJSONObj != null) {
							//put the data into the flag annotation object
							flagAnnotationDataJSONObj.put("data", latestStepWorkDataJSONObj);
							
							//put the flag object into the annotations array
							annotationsJSONObj.append("annotationsArray", flagAnnotationDataJSONObj);						
						}
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			}
		} else if(annotation != null) { 
			try {
				//only one annotation will be returned
				annotationsJSONObj = new JSONObject(annotation.getData());
			} catch (JSONException e) {
				response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "error retrieving annotations");
				e.printStackTrace();
			}
		}

		if(annotationsJSONObj != null) {
			response.getWriter().write(annotationsJSONObj.toString());	
		}
    }

	/**
	 * Handles POST requests for annotations using JSON data storage
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	private void doPostJSON(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		//obtain the parameters
		String runId = request.getParameter("runId");
		String nodeId = request.getParameter("nodeId");
		String toWorkgroup = request.getParameter("toWorkgroup");
		String fromWorkgroup = request.getParameter("fromWorkgroup");
		String type = request.getParameter("annotationType");
		String value = request.getParameter("value");
		String stepWorkId = request.getParameter("stepWorkId");
		String action = request.getParameter("action");
		String periodId = request.getParameter("periodId");

		Calendar now = Calendar.getInstance();
		Timestamp postTime = new Timestamp(now.getTimeInMillis());
		StepWork stepWork = (StepWork) StepWork.getById(new Long(stepWorkId), StepWork.class);
		UserInfo userInfo = UserInfo.getOrCreateByWorkgroupId(new Long(fromWorkgroup));

		JSONObject annotationEntryJSONObj = new JSONObject();
		try {
			annotationEntryJSONObj.put("runId", runId);
			annotationEntryJSONObj.put("nodeId", nodeId);
			annotationEntryJSONObj.put("toWorkgroup", toWorkgroup);
			annotationEntryJSONObj.put("fromWorkgroup", fromWorkgroup);
			annotationEntryJSONObj.put("stepWorkId", stepWorkId);
			annotationEntryJSONObj.put("type", type);
			annotationEntryJSONObj.put("value", value);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		Annotation annotationType = AnnotationFactory.createAnnotation(type);
		Annotation annotation = Annotation.getByUserInfoAndStepWork(userInfo, stepWork, annotationType.getClass());

		if(annotation == null) {
			//the annotation was not found so we will create it
			annotation = AnnotationFactory.createAnnotation(type);
			annotation.setUserInfo(userInfo);
			annotation.setStepWork(stepWork);
		}
		
		//update the post time
		annotation.setPostTime(postTime);
		
		//update the data
		annotation.setData(annotationEntryJSONObj.toString());
		
		if(runId != null) {
			//set the run id
			annotation.setRunId(Long.parseLong(runId));
		}
		
		//propagate the row/object to the table
		annotation.saveOrUpdate();
		
		//check if this is a peer review annotation
		if(action != null && action.equals("peerReviewAnnotate")) {
			//set the annotation into the peerreviewwork table
			PeerReviewWork.setPeerReviewAnnotation(new Long(runId), new Long(periodId), stepWork.getNode(), stepWork, userInfo, annotation);
		}
		
		response.getWriter().print(postTime.getTime());
	}
}
