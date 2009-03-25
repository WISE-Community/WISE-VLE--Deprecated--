/**
 * 
 */
package vle;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet to Create, Retrieve, Update, and Delete Nodes.
 * @author hirokiterashima
 *
 */
public class NodeCRUD extends HttpServlet {

private static final long serialVersionUID = 1L;
	
	private static final String DATA1 = "data1";

	private static final String DATA2 = "data2";

	private static final String ACTION = "action";   // can be create, retrieve, update, delete
	
	public void doPost(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
		String action = request.getParameter(ACTION);
		
		if (action.equals("create")) {
			String nodeType = request.getParameter(DATA1);
			String absolutePath = createNewNode(nodeType);
			response.getWriter().write(absolutePath);
		} else if (action.equals("delete")) {
			
		} else {
			// don't know how to do these actions yet.
		}
		//response.setContentType("text/plain");
		//response.setHeader("Content-Disposition", "attachment; filename=\"" + name + ".txt\"");
		//response.getWriter().print(request.getParameter(DATA));
	}
	
	private String createNewNode(String nodeType) {
		String fileNameExtension = "";
		if (nodeType.equals("HtmlNode")) {
			fileNameExtension = ".html";
		} else if (nodeType.equals("MultipleChoiceNode")) {
			fileNameExtension = ".mc";
		}
		int i=0;
		while (true) {  // keep trying to create a file until successful
		  try {
			 String fileName = new String(i + fileNameExtension);
		        File file = new File(fileName);
		        // Create file if it does not exist
		        boolean success = file.createNewFile();
		        if (success) {
		            // File did not exist and was created
		        	return fileName;
		        } else {
		            // File already exists
		        	i++;
		        }
		    } catch (IOException e) {
		    }
		}
	}
}
