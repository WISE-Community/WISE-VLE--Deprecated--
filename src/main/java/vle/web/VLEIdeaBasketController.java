package vle.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import vle.domain.ideabasket.IdeaBasket;

public class VLEIdeaBasketController extends HttpServlet {

	private static final long serialVersionUID = 1L;
	
	public void doPost(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
		//get all the params
		String runId = request.getParameter("runId");
		String workgroupId = (String) request.getAttribute("workgroupId");
		String action = request.getParameter("action");
		String data = request.getParameter("data");
		String projectId = (String) request.getAttribute("projectId");
		boolean savedBasket = false;
		
		//get the latest revision of the IdeaBasket for this runId, workgroupId
		IdeaBasket ideaBasket = IdeaBasket.getIdeaBasketByRunIdWorkgroupId(new Long(runId), new Long(workgroupId));

		if(action == null) {
			
		} else if(action.equals("saveIdeaBasket")) {
			if(ideaBasket != null) {
				//the idea basket was created before
				
				//get the idea basket data
				String previousData = ideaBasket.getData();
				
				if(previousData != null && previousData.equals(data)) {
					//data is the same so we do not need to save
				} else {
					try {
						//create a JSON object from the data to make sure it is valid JSON
						JSONObject dataJSONObj = new JSONObject(data);
						
						//data is not the same so we will save a new row
						ideaBasket = new IdeaBasket(new Long(runId), new Long(projectId), new Long(workgroupId), data);
						ideaBasket.saveOrUpdate();
						savedBasket = true;
					} catch (JSONException e) {
						e.printStackTrace();
					} catch (NullPointerException e) {
						e.printStackTrace();
					}
				}
			} else {
				//the idea basket was never created before so we will save a new row
				ideaBasket = new IdeaBasket(new Long(runId), new Long(projectId), new Long(workgroupId), data);
				ideaBasket.saveOrUpdate();
				savedBasket = true;
			}
		}
		
		if(!savedBasket) {
			/*
			 * we failed to save the basket so we will retrieve the
			 * previous revision and send it back to the vle so they
			 * can reload the previous revision.
			 */
			ideaBasket = IdeaBasket.getIdeaBasketByRunIdWorkgroupId(new Long(runId), new Long(workgroupId));
			response.getWriter().print(ideaBasket.toJSONString());
		} else {
			/*
			 * we successfully saved the idea basket. we must send this
			 * message back in order to notify the vle that the idea basket
			 * was successfully saved otherwise it will assume it failed
			 * to save
			 */
			response.getWriter().print("Successfully saved Idea Basket");
		}
	}

	public void doGet(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
		//get all the params
		String runId = request.getParameter("runId");
		String workgroupId = (String) request.getAttribute("workgroupId");
		String action = request.getParameter("action");
		String projectId = (String) request.getAttribute("projectId");
		
		if(action.equals("getIdeaBasket")) {
			//get the IdeaBasket
			IdeaBasket ideaBasket = IdeaBasket.getIdeaBasketByRunIdWorkgroupId(new Long(runId), new Long(workgroupId));
			
			if(ideaBasket == null) {
				//make the IdeaBasket if it does not exist
				ideaBasket = new IdeaBasket(new Long(runId), new Long(projectId), new Long(workgroupId));
				ideaBasket.saveOrUpdate();
			}
			
			//get the IdeaBasket JSONString
			String ideaBasketJSONString = ideaBasket.toJSONString();
			response.getWriter().print(ideaBasketJSONString);
		} else if(action.equals("getAllIdeaBaskets")) {
			//get all the idea baskets for a run
			List<IdeaBasket> latestIdeaBasketsForRunId = IdeaBasket.getLatestIdeaBasketsForRunId(new Long(runId));
			
			//convert the list to a JSONArray
			JSONArray ideaBaskets = ideaBasketListToJSONArray(latestIdeaBasketsForRunId);
			
			//return the JSONArray of idea baskets as a string
			String ideaBasketsJSONString = ideaBaskets.toString();
			response.getWriter().print(ideaBasketsJSONString);
		} else if(action.equals("getIdeaBasketsByWorkgroupIds")) {
			//get the JSONArray of workgroup ids
			String workgroupIdsJSONArrayStr = request.getParameter("workgroupIds");
			
			try {
				JSONArray workgroupIdsJSONArray = new JSONArray(workgroupIdsJSONArrayStr);
				
				List<Long> workgroupIds = new ArrayList<Long>();
				
				//loop through all the workgroup ids
				for(int x=0; x<workgroupIdsJSONArray.length(); x++) {
					//add the workgroup id to the list
					long workgroupIdToGet = workgroupIdsJSONArray.getLong(x);
					workgroupIds.add(workgroupIdToGet);
				}
				
				List<IdeaBasket> latestIdeaBasketsForRunIdWorkgroupIds = new ArrayList<IdeaBasket>();
				
				if(workgroupIds.size() > 0) {
					//query for the baskets with the given run and workgroup ids
					latestIdeaBasketsForRunIdWorkgroupIds = IdeaBasket.getLatestIdeaBasketsForRunIdWorkgroupIds(new Long(runId), workgroupIds);					
				}
				
				//convert the list to a JSONArray
				JSONArray ideaBaskets = ideaBasketListToJSONArray(latestIdeaBasketsForRunIdWorkgroupIds);
				
				//return the JSONArray of idea baskets as a string
				String ideaBasketsJSONString = ideaBaskets.toString();
				response.getWriter().print(ideaBasketsJSONString);
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * Turns a list of IdeaBaskets into a JSONArray
	 * @param ideaBasketsList a list containing IdeaBaskets
	 * @return a JSONArray containing the idea baskets
	 */
	private JSONArray ideaBasketListToJSONArray(List<IdeaBasket> ideaBasketsList) {
		JSONArray ideaBaskets = new JSONArray();
		
		//loop through all the idea baskets
		for(int x=0; x<ideaBasketsList.size(); x++) {
			//get an idea basket
			IdeaBasket ideaBasket = ideaBasketsList.get(x);
			
			try {
				//add the idea basket to our JSONArray
				JSONObject ideaBasketJSONObj = new JSONObject(ideaBasket.toJSONString());
				ideaBaskets.put(ideaBasketJSONObj);
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		
		return ideaBaskets;
	}
}
