package vle.web;

import java.io.IOException;
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
					//data is not the same so we will save a new row
					ideaBasket = new IdeaBasket(new Long(runId), new Long(projectId), new Long(workgroupId), data);
					ideaBasket.saveOrUpdate();
				}
			} else {
				//the idea basket was never created before so we will save a new row
				ideaBasket = new IdeaBasket(new Long(runId), new Long(projectId), new Long(workgroupId), data);
				ideaBasket.saveOrUpdate();
			}
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
			
			JSONArray ideaBaskets = new JSONArray();
			
			//loop through all the idea baskets
			for(int x=0; x<latestIdeaBasketsForRunId.size(); x++) {
				//get an idea basket
				IdeaBasket ideaBasket = latestIdeaBasketsForRunId.get(x);
				
				try {
					//add the idea basket to our JSONArray
					JSONObject ideaBasketJSONObj = new JSONObject(ideaBasket.toJSONString());
					ideaBaskets.put(ideaBasketJSONObj);
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
			
			//return the JSONArray of idea baskets as a string
			String ideaBasketsJSONString = ideaBaskets.toString();
			response.getWriter().print(ideaBasketsJSONString);
		}
	}
}
