package vle.web;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
		
		//get the IdeaBasket
		IdeaBasket ideaBasket = IdeaBasket.getIdeaBasketByRunIdWorkgroupId(new Long(runId), new Long(workgroupId));
		
		if(ideaBasket == null) {
			//make the IdeaBasket if it does not exist
			ideaBasket = new IdeaBasket(new Long(runId), new Long(projectId), new Long(workgroupId));
			ideaBasket.saveOrUpdate();
		}
		
		if(action.equals("getIdeaBasket")) {
			//get the IdeaBasket JSONString
			String ideaBasketJSONString = ideaBasket.toJSONString();
			response.getWriter().print(ideaBasketJSONString);
		}
	}
}
