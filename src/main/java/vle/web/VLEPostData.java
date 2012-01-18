package vle.web;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Calendar;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import utils.VLEDataUtils;
import vle.VLEServlet;
import vle.domain.cRater.CRaterRequest;
import vle.domain.node.Node;
import vle.domain.peerreview.PeerReviewGate;
import vle.domain.peerreview.PeerReviewWork;
import vle.domain.user.UserInfo;
import vle.domain.work.StepWork;

/**
 * Servlet for handling POSTed vle data
 * @author hirokiterashima
 * @author geoffreykwan
 * @author patricklawler
 */
public class VLEPostData extends VLEServlet {

	private static final long serialVersionUID = 1L;
	
	public void doPost(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
		String runId = request.getParameter("runId");
		String userId = request.getParameter("userId");
		String periodId = request.getParameter("periodId");
		String data = request.getParameter("data");
		
		//obtain the id the represents the id in the step work table
		String stepWorkId = request.getParameter("id");
		
		
		if (runId == null || userId == null || data == null) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "post data: parameter(s) missing.");
			return;
		}
		
		Long runIdLong = null;
		if(runId != null) {
			runIdLong = new Long(runId);
		}
		
		Long periodIdLong = null;
		if(periodId != null) {
			periodIdLong = new Long(periodId);
		}
		
		UserInfo userInfo = (UserInfo) UserInfo.getOrCreateByWorkgroupId(new Long(userId));

		JSONObject nodeVisitJSON = null;
		try {
			nodeVisitJSON = new JSONObject(data);

			Calendar now = Calendar.getInstance();
			Timestamp postTime = new Timestamp(now.getTimeInMillis());

			String nodeId = VLEDataUtils.getNodeId(nodeVisitJSON);
			Timestamp startTime = new Timestamp(new Long(VLEDataUtils.getVisitStartTime(nodeVisitJSON)));
			
			String duplicateId = VLEDataUtils.getDuplicateId(nodeVisitJSON);
			
			//get the end time
			String visitEndTime = VLEDataUtils.getVisitEndTime(nodeVisitJSON);
			Timestamp endTime = null;
			
			//check that a non null end time was given to us
			if(visitEndTime != null && !visitEndTime.equals("null") && !visitEndTime.equals("")) {
				//create the timestamp
				endTime = new Timestamp(new Long(visitEndTime));
			}

			//obtain the node type from the json node visit
			String nodeType = VLEDataUtils.getNodeType(nodeVisitJSON);
			
			if (nodeType.equals("SVGDrawNode")) {
				if (request.getContentLength() > (1024*250)) {  // posted data must not exceed 250K
					response.sendError(HttpServletResponse.SC_BAD_REQUEST, "post data: too large (>250k)");
					return;
				}
			} else {
				if (request.getContentLength() > (1024*50)) {  // posted data must not exceed 50K
					response.sendError(HttpServletResponse.SC_BAD_REQUEST, "post data: too large (>50k)");
					return;
				}
			}

			StepWork stepWork = null;
			
			// check to see if student has already saved this nodevisit.
			stepWork = StepWork.getByUserIdAndData(userInfo,nodeVisitJSON.toString());
			if (stepWork != null) {
				// this node visit has already been saved. return id and postTime and exit.
				//create a JSONObject to contain the step work id and post time
				JSONObject jsonResponse = new JSONObject();
				jsonResponse.put("id", stepWork.getId());
				if(endTime != null) {
					//end time is set so we can send back a post time
					if (stepWork.getPostTime() != null) {
						jsonResponse.put("visitPostTime", stepWork.getPostTime().getTime());
					}
				}
				//send back the json string with step work id and post time
				response.getWriter().print(jsonResponse.toString());
				return;
			}
				
			//check if the step work id was passed in. if it was, then it's an update to a nodevisit.
			if(stepWorkId != null && !stepWorkId.equals("") && !stepWorkId.equals("undefined")) {
				//step work id was passed in so we will obtain the id in long format
				long stepWorkIdLong = Long.parseLong(stepWorkId);
				
				//obtain the StepWork with the given id
				stepWork = (StepWork) StepWork.getById(stepWorkIdLong, StepWork.class);
			} else if(nodeType != null && nodeType !=""){
				//step work id was not passed in so we will create a new StepWork object
				stepWork = new StepWork();
			}

			Node node = getOrCreateNode(runId, nodeId, nodeType);
			
			if (stepWork != null && userInfo != null && node != null) {
				// set the fields of StepWork
				stepWork.setUserInfo(userInfo);
				stepWork.populateData(nodeVisitJSON);
				stepWork.setNode(node);
				stepWork.setPostTime(postTime);
				stepWork.setStartTime(startTime);
				stepWork.setEndTime(endTime);
				stepWork.setDuplicateId(duplicateId);
				stepWork.saveOrUpdate();
				
				//get the step work id so we can send it back to the client
				long newStepWorkId = stepWork.getId();
				
				//get the post time so we can send it back to the client
				long newPostTime = postTime.getTime();
				
				//create a JSONObject to contain the step work id and post time
				JSONObject jsonResponse = new JSONObject();
				jsonResponse.put("id", newStepWorkId);
				
				/*
				 * if the endtime is null it means this post was an intermediate
				 * post such as the ones brainstorm performs so we do not want
				 * to send back a post time in that case. when we send back a
				 * post time, it means the node visit is completed but if this
				 * is just an intermediate post we do not want to complete
				 * the visit because the user has not exited the step.
				 */
				if(endTime != null) {
					//end time is set so we can send back a post time
					jsonResponse.put("visitPostTime", newPostTime);
				}
				
				//get the first cRaterItemId if it exists in the POSTed NodeState
				String cRaterItemId = null;
				try {
					if (nodeVisitJSON != null) {
						JSONArray nodeStateArray = nodeVisitJSON.getJSONArray("nodeStates");
						if (nodeStateArray != null) {
							for (int i=0; i<nodeStateArray.length(); i++) {
								JSONObject nodeStateObj = nodeStateArray.getJSONObject(i);
								
								if(nodeStateObj.has("cRaterItemId")) {
									cRaterItemId = nodeStateObj.getString("cRaterItemId");
									break;
								}
							}
						}
					}
				} catch (JSONException e) {
					e.printStackTrace();
				}
				
				if(cRaterItemId != null) {
					//send back the cRater item id to the student in the response
					//student VLE would get this cRaterItemId and make a GET to
					//VLEAnnotationController to get the CRater Annotation
					jsonResponse.put("cRaterItemId", cRaterItemId);
					long lastNodeStateTimestamp = stepWork.getLastNodeStateTimestamp();
					// also save a CRaterRequest in db for tracking
					try {
						CRaterRequest cRR = new CRaterRequest(cRaterItemId, stepWork, new Long(lastNodeStateTimestamp), runIdLong);
						cRR.saveOrUpdate();
					} catch (Exception cre) {
						// do nothing if there was an error, let continue
						cre.printStackTrace();
					}
				}
				
				try {
					//if this post is a peerReviewSubmit, add an entry into the peerreviewwork table
					if(VLEDataUtils.isSubmitForPeerReview(nodeVisitJSON)) {
						PeerReviewWork peerReviewWork = null;

						//see if the user has already submitted peer review work for this step
						peerReviewWork = PeerReviewWork.getPeerReviewWorkByRunPeriodNodeWorkerUserInfo(runIdLong, periodIdLong, node, userInfo);
						
						if(peerReviewWork == null) {
							/*
							 * the user has not submitted peer review work for thie step yet
							 * so we will create it
							 */
							peerReviewWork = new PeerReviewWork();
							peerReviewWork.setNode(node);
							peerReviewWork.setRunId(new Long(runId));
							peerReviewWork.setUserInfo(userInfo);
							peerReviewWork.setStepWork(stepWork);
							peerReviewWork.setPeriodId(periodIdLong);
							peerReviewWork.saveOrUpdate();
						}
						
						//create an entry for the peerreviewgate table if one does not exist already
						PeerReviewGate.getOrCreateByRunIdPeriodIdNodeId(runIdLong, periodIdLong, node);
					}
				} catch(JSONException e) {
					e.printStackTrace();
				}
				//send back the json string with step work id and post time
				response.getWriter().print(jsonResponse.toString());
			} else {
				response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Error saving: " + nodeVisitJSON.toString());
			}
		} catch (JSONException e) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "malformed data");
			e.printStackTrace();
			return;
		}
	}

	/**
	 * Synchronized node creation/retrieval
	 * @param runId
	 * @param nodeId
	 * @param nodeType
	 * @return created/retrieved Node, or null
	 */
	private synchronized Node getOrCreateNode(String runId, String nodeId, String nodeType) {
		Node node = Node.getByNodeIdAndRunId(nodeId, runId);
		if (node == null && nodeId != null && runId != null && nodeType != null) {
			node = new Node();
			node.setNodeId(nodeId);
			node.setRunId(runId);
			node.setNodeType(nodeType);
			node.saveOrUpdate();
		}
		return node;
	}
}
