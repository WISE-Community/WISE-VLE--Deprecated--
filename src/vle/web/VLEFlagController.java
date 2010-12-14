/**
 * 
 */
package vle.web;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import vle.VLEServlet;
import vle.domain.PersistableDomain;
import vle.domain.annotation.Annotation;
import vle.domain.annotation.AnnotationFlag;
import vle.domain.user.UserInfo;
import vle.domain.work.StepWork;

/**
 * @author hirokiterashima
 *
 */
public class VLEFlagController extends VLEServlet {

	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
		getData(request, response);
	}

	public void doPost(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
        postData(request, response);
	}
	
	 private static void getData(HttpServletRequest request,
				HttpServletResponse response) {
	    	try {
		    	List<AnnotationFlag> annotationFlagList = AnnotationFlag.getByParamMap(request.getParameterMap());
		    	
		    	//wrap all the individual annotation tags in a parent annotations tag
		    	response.getWriter().write("<flags>");
		    	
		    	for (AnnotationFlag annotationFlag : annotationFlagList) {
		    		response.getWriter().println(annotationFlag.getData());
		    	}
		    	response.getWriter().write("</flags>");
			} catch (IOException e) {
				e.printStackTrace();
			}
	 }	

    private static void postData(HttpServletRequest request,
			HttpServletResponse response) {
    	//obtain the parameters
		String runId = request.getParameter("runId");
		String nodeId = request.getParameter("nodeId");
		String toWorkgroup = request.getParameter("toWorkgroup");
		String fromWorkgroup = request.getParameter("fromWorkgroup");
		String stepWorkId = request.getParameter("stepWorkId");
		String action = request.getParameter("action");
		
		StringBuffer flagEntry = new StringBuffer();
		flagEntry.append("<annotationEntry>");
		flagEntry.append("<runId>" + runId + "</runId>");
		flagEntry.append("<nodeId>" + nodeId + "</nodeId>");
		flagEntry.append("<toWorkgroup>" + toWorkgroup + "</toWorkgroup>");
		flagEntry.append("<fromWorkgroup>" + fromWorkgroup + "</fromWorkgroup>");
		flagEntry.append("<stepWorkId>" + stepWorkId + "</stepWorkId>");
		flagEntry.append("<type>flag</type>");
		flagEntry.append("</annotationEntry>");
		
		StepWork stepWork = (StepWork) StepWork.getById(new Long(stepWorkId), StepWork.class);
		UserInfo userInfo = UserInfo.getOrCreateByWorkgroupId(new Long(fromWorkgroup));
		
		if(action != null && action.equals("unflag")) {
			Annotation annotationFlag = AnnotationFlag.getByUserInfoAndStepWork(userInfo, stepWork, AnnotationFlag.class);
			annotationFlag.delete();
		} else {
			Calendar now = Calendar.getInstance();
			Timestamp postTime = new Timestamp(now.getTimeInMillis());

			AnnotationFlag annotationFlag = new AnnotationFlag();
			annotationFlag.setPostTime(postTime);
			annotationFlag.setStepWork(stepWork);
			annotationFlag.setUserInfo(userInfo);
			annotationFlag.setData(flagEntry.toString());
			annotationFlag.saveOrUpdate();
		}    
    }
}