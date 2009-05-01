package vle;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class VLEView extends HttpServlet {

	public void doGet(HttpServletRequest request, HttpServletResponse response) {
		getData(request, response);
	}
	
	/**
	 * Retrieves the projectId parameter and returns the contentBaseUrl and
	 * contentUrl to the jsp. 
	 * @param request
	 * @param response
	 */
	private void getData(HttpServletRequest request,
			HttpServletResponse response) {
		
		//retrieve the projectId parameter
		String projectIdString = request.getParameter("projectId");
		int projectId = Integer.parseInt(projectIdString);
		
		String contentBaseUrl = "";
		String contentUrl = "";
		
		/*
		 * the mapping from projectId to content urls is hardcoded now until
		 * we get the database tables set up
		 */
		if(projectId == 1) {
			contentBaseUrl = "http://localhost:8080/vlewrapper/curriculum/unit9999/lesson9999";
			contentUrl = "http://localhost:8080/vlewrapper/curriculum/unit9999/lesson9999/lesson9999.xml";
		} else if(projectId == 2) {
			contentBaseUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-35510";
			contentUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-35510/wise4-35510.xml";
		} else if(projectId == 3) {
			contentBaseUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-35511";
			contentUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-35511/wise4-35511.xml";
		} else if(projectId == 4) {
			contentBaseUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-35512";
			contentUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-35512/wise4-35512.xml";
		} else if(projectId == 5) {
			contentBaseUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-35513";
			contentUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-35513/wise4-35513.xml";
		} else if(projectId == 6) {
			contentBaseUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-dep1";
			contentUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-dep1/wise4-dep1.xml";
		} else if(projectId == 7) {
			contentBaseUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-dep2";
			contentUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-dep2/wise4-dep2.xml";
		} else if(projectId == 8) {
			contentBaseUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-nos";
			contentUrl = "http://localhost:8080/vlewrapper/curriculum/wise4-nos/wise4-nos.xml";
		}
		
		//set the content urls in the request so the jsp can retrieve them
		request.setAttribute("contentBaseUrl", contentBaseUrl);
		request.setAttribute("contentUrl", contentUrl);
		
		RequestDispatcher dispatcher = getServletConfig().getServletContext().getRequestDispatcher("/view.jsp");
		try {
			//pass the request to the jsp page so it can retrieve the urls in the attributes
			dispatcher.include(request, response);
		} catch (ServletException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
