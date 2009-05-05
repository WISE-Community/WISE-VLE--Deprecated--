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
	
	private String getServletUrl(HttpServletRequest request) {
		return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
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
		
		String contentBaseUrl = "";
		String contentUrl = "";

		/*
		 * the mapping from projectId to content urls is hardcoded now until
		 * we get the database tables set up
		 */
		if(projectIdString.equals(1)) {
			contentBaseUrl = getServletUrl(request) + "/curriculum/unit9999/lesson9999";
			contentUrl = contentBaseUrl +  "/lesson9999.project.xml";
		} else if(projectIdString.equals(2)) {
			contentBaseUrl = getServletUrl(request) + "/curriculum/wise4-35510";
			contentUrl = contentBaseUrl +  "/wise4-35510.xml";
		} else if(projectIdString.equals(3)) {
			contentBaseUrl = getServletUrl(request) + "/curriculum/wise4-35511";
			contentUrl = contentBaseUrl +  "/wise4-35511.xml";
		} else if(projectIdString.equals(4)) {
			contentBaseUrl = getServletUrl(request) + "/curriculum/wise4-35512";
			contentUrl = contentBaseUrl +  "/wise4-35512.xml";
		} else if(projectIdString.equals(5)) {
			contentBaseUrl = getServletUrl(request) + "/curriculum/wise4-35513";
			contentUrl = contentBaseUrl +  "/wise4-35513.xml";
		} else if(projectIdString.equals(6)) {
			contentBaseUrl = getServletUrl(request) + "/curriculum/wise4-dep1";
			contentUrl = contentBaseUrl +  "/wise4-dep1.xml";
		} else if(projectIdString.equals(7)) {
			contentBaseUrl = getServletUrl(request) + "/curriculum/wise4-dep2";
			contentUrl = contentBaseUrl +  "/wise4-dep2.xml";
		} else if(projectIdString.equals(8)) {
			contentBaseUrl = getServletUrl(request) + "/curriculum/wise4-nos";
			contentUrl = contentBaseUrl + "/wise4-nos.xml";
		} else if(projectIdString.equals(-1)) {
			contentBaseUrl = getServletUrl(request) + "/curriculum/unit3/lesson1";
			contentUrl = contentBaseUrl +  "/lesson1.xml";
		} else if(projectIdString.equals("asu_demo1")) {
			contentBaseUrl = getServletUrl(request) + "/curriculum/asu/demo1";
			contentUrl = contentBaseUrl +  "/asu_demo1.project.xml";
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
