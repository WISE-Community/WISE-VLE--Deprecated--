package vle.web;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;

import vle.domain.ideabasket.Idea;
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
		String ideaId = request.getParameter("ideaId");
		String text = request.getParameter("text");
		String type = request.getParameter("type");
		String nodeId = request.getParameter("nodeId");
		String nodeName = request.getParameter("nodeName");
		String tag = request.getParameter("tag");
		String flag = request.getParameter("flag");
		String basketOrder = request.getParameter("basketOrder");
		String trashOrder = request.getParameter("trashOrder");
		String projectId = (String) request.getAttribute("projectId");
		
		//get the IdeaBasket
		IdeaBasket ideaBasket = IdeaBasket.getIdeaBasketByRunIdWorkgroupId(new Long(runId), new Long(workgroupId));
		
		if(ideaBasket == null) {
			//make the IdeaBasket if it does not exist
			ideaBasket = new IdeaBasket(new Long(runId), new Long(projectId), new Long(workgroupId));
			ideaBasket.saveOrUpdate();
		}
		
		if(action == null) {
			
		} else if(action.equals("addIdea")) {
			//add an idea to the basket
			Idea idea = new Idea(text, nodeId, nodeName, tag, flag);
			idea.saveOrUpdate();
			
			ideaBasket.addIdea(idea);
			ideaBasket.saveOrUpdate();
		} else if(action.equals("reOrderBasket")) {
			//re-order the basket
			if(basketOrder != null) {
				try {
					JSONArray basketOrderJSONArray = new JSONArray(basketOrder);
					ideaBasket.reOrderBasket(basketOrderJSONArray);
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
		} else if(action.equals("reOrderTrash")) {
			//re-order the trash
			if(trashOrder != null) {
				try {
					JSONArray trashOrderJSONArray = new JSONArray(trashOrder);
					ideaBasket.reOrderTrash(trashOrderJSONArray);
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
		} else if(action.equals("updateType")) {
			//update the idea type
			Idea idea = Idea.getIdeaById(new Long(ideaId));
			idea.setType(type);
			idea.saveOrUpdate();
		} else if(action.equals("updateText")) {
			//update the idea text
			Idea idea = Idea.getIdeaById(new Long(ideaId));
			idea.setText(text);
			idea.saveOrUpdate();
		} else if(action.equals("updateNodeId")) {
			//update the idea node id
			Idea idea = Idea.getIdeaById(new Long(ideaId));
			idea.setNodeId(nodeId);
			idea.saveOrUpdate();
		} else if(action.equals("updateNodeName")) {
			//update the idea node name
			Idea idea = Idea.getIdeaById(new Long(ideaId));
			idea.setNodeName(nodeName);
			idea.saveOrUpdate();
		} else if(action.equals("updateTag")) {
			//update the idea tag
			Idea idea = Idea.getIdeaById(new Long(ideaId));
			idea.setTag(tag);
			idea.saveOrUpdate();
		} else if(action.equals("updateFlag")) {
			//update the idea flag
			Idea idea = Idea.getIdeaById(new Long(ideaId));
			idea.setFlag(flag);
			idea.saveOrUpdate();
		} else if(action.equals("trashIdea")) {
			//put the idea into the trash
			Idea idea = Idea.getIdeaById(new Long(ideaId));
			ideaBasket.trashIdea(idea);
		} else if(action.equals("unTrashIdea")) {
			//take the idea out of the trash and back into the ideas array
			Idea idea = Idea.getIdeaById(new Long(ideaId));
			ideaBasket.unTrashIdea(idea);
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
