/**
 * 
 */
package vle.web;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import vle.VLEServlet;
import vle.domain.work.StepWork;
import vle.domain.work.StepWorkHtml;
import vle.domain.work.StepWorkSVGDraw;

/**
 * @author hirokiterashima
 *
 */
public class VLEGetSVGDraw extends VLEServlet {

	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
		String type = request.getParameter("nodeType");
		String stepWorkId = request.getParameter("stepWorkId");
		String svgString = "Error. Please talk to WISE staff.";
		
		// for handing svg request
		if (type != null && type.equals("SVGDrawNode") && stepWorkId != null) {
			StepWorkSVGDraw stepWorkSVG = (StepWorkSVGDraw) StepWork.getById(new Long(stepWorkId), StepWorkSVGDraw.class);
			svgString = stepWorkSVG.getSVGString();
		} else if (type != null && type.equals("MySystemNode") && stepWorkId != null) {
			StepWorkHtml stepWork = (StepWorkHtml) StepWork.getById(new Long(stepWorkId), StepWorkHtml.class);
				try {
					JSONObject data = new JSONObject(stepWork.getData());
					svgString = (String) data.getJSONArray("nodeStates").getJSONObject(0).get("data");
				} catch (JSONException e) {
					svgString = "Error. Please talk to WISE staff.";
				}		
		}
		response.setContentType("text/xml");
		response.getWriter().print(svgString);
	}
}
