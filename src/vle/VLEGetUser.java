package vle;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class VLEGetUser
 */
public class VLEGetUser extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public VLEGetUser() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String userInfoString = 
			"<userInfo><myUserInfo><workgroupId>146</workgroupId><userName>preview user</userName></myUserInfo><myClassInfo><classmateUserInfo><workgroupId>147</workgroupId><userName> bb11</userName></classmateUserInfo><teacherUserInfo><workgroupId>137</workgroupId><userName>aa</userName></teacherUserInfo></myClassInfo></userInfo>";
		response.getWriter().print(userInfoString);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
