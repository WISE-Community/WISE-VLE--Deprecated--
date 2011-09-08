/**
 * 
 */
package vle.domain.annotation;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import vle.domain.node.Node;
import vle.domain.work.StepWork;
import vle.hibernate.HibernateUtil;

/**
 * An AnnotationFlag is a Domain object to represent
 * that a students' work has been flagged, or identified
 * as something worth looking at.
 * @author hirokiterashima
 */
@Entity
@Table(name="annotation_flag")
public class AnnotationFlag extends Annotation {

	@Column(name="data", length=512)
	private String data;

	@Override
	public String getData() {
		return data;
	}

	@Override
	public void setData(String data) {
		this.data = data;
	}

	/**
	 * Returns a list of Annotation based on the request parameters
	 * @param map
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static List<AnnotationFlag> getByParamMap(Map<String, String[]> map) {
		//obtain the parameters
    	String runId = null;
    	String nodeId = null;
    	List<AnnotationFlag> result = new ArrayList<AnnotationFlag>();
    	if (map.containsKey("runId") && map.containsKey("nodeId")) {
    		// get all the flagged items for the specified runId and nodeId
    		runId = map.get("runId")[0];
    		nodeId = map.get("nodeId")[0];
        	Node node = Node.getByNodeIdAndRunId(nodeId, runId, true);
        	List<StepWork> stepWorkList = StepWork.getByNodeId(node.getId());
        	result = getByStepWorkList(stepWorkList);
    	} else if (map.containsKey("runId")) {
    		// get all the flagged items for all of the nodes for the specified runId
    		runId = map.get("runId")[0];
    		result = (List<AnnotationFlag>) getByRunId(Long.parseLong(runId), AnnotationFlag.class);
    		
    		/*
    		List<Node> nodeList = Node.getByRunId(runId);
    		List<StepWork> stepWorkList = new ArrayList<StepWork>();
    		for (Node node: nodeList) {
    			stepWorkList.addAll(StepWork.getByNodeId(node.getId()));
    		}
        	result = getByStepWorkList(stepWorkList);
        	*/
    	}
		return result;
	}
	
	/**
	 * Given a list of StepWork, returns all annotation flags that were made on
	 * them. If the stepWorkList is empty, return an empty AnnotationList.
	 * @param stepWorkList
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static List<AnnotationFlag> getByStepWorkList(List<StepWork> stepWorkList) {
		List<AnnotationFlag> result = new ArrayList<AnnotationFlag>();
		if (!stepWorkList.isEmpty()) {
			Session session = HibernateUtil.getSessionFactory().getCurrentSession();
			session.beginTransaction();

			result = 
				session.createCriteria(AnnotationFlag.class).add( Restrictions.in("stepWork", stepWorkList)).list();
			session.getTransaction().commit();
		}
		return result;
	}
}
