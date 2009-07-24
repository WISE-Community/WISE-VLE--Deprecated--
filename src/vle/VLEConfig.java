package vle;


import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class VLEConfig
 */
public class VLEConfig extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public VLEConfig() {
        super();
        // TODO Auto-generated constructor stub
    }

	private String getServletUrl(HttpServletRequest request) {
		return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
	}
	
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String vleConfigString = "<VLEConfig>";
		
		// for now, use the preview mode to disable polling
		vleConfigString += "<mode>run</mode>";

		String base_www = getServletUrl(request);
		String contentUrl = content_location(request.getParameter("location"));
		String contentBaseUrl = contentUrl.substring(0, contentUrl.lastIndexOf('/') + 1) + "/";  //.substring(0, contentUrl.lastIndexOf('/') + 1);
		String postDataUrl = base_www + "/script/postVisits.php";
		String getDataUrl = base_www + "/getdata.html";
		String userInfoUrl = "VLEGetUser";
		
		vleConfigString += "<runId>3</runId>";
		vleConfigString += "<getFlagsUrl>dummyflagsurl</getFlagsUrl>";
		vleConfigString += "<userInfoUrl>"+ userInfoUrl + "</userInfoUrl>";
		vleConfigString += "<contentUrl>"+ contentUrl +"</contentUrl>";
		vleConfigString += "<contentBaseUrl>"+ contentBaseUrl +"</contentBaseUrl>";
		vleConfigString += "<getDataUrl>"+ getDataUrl +"</getDataUrl>";
		vleConfigString += "<postDataUrl>"+ postDataUrl +"</postDataUrl>";
		vleConfigString += "<runInfoUrl>dummy</runInfoUrl>";
		vleConfigString += "<theme>WISE</theme>";
		vleConfigString += "<enableAudio>false</enableAudio>";
		vleConfigString += "<runInfoRequestInterval>-1</runInfoRequestInterval>";
		
		vleConfigString += "</VLEConfig>";
		
		response.getWriter().print(vleConfigString);
	}

	private String content_location(String parameter) {
		//return "http://localhost:8080/contentrepository/curriculum/unit0/lesson0_Welcome/lesson0.project.xml";
		return "http://localhost:8080/contentrepository/curriculum/unit9999/lesson9999/lesson9999.project.xml";
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
