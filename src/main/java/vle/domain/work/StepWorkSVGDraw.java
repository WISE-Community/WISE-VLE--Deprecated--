package vle.domain.work;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import vle.domain.node.Node;
import vle.domain.user.UserInfo;
import vle.hibernate.HibernateUtil;

/**
 * Domain Object for storing SVGDraw step data
 * @author hirokiterashima
 */
@Entity
@Table(name="stepwork_svgdraw")
public class StepWorkSVGDraw extends StepWork {

	@Column(name="data", columnDefinition="TEXT")
	private String data;
	
	@Override
	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}
	
	// returns the first nodeState
	public String getSVGString() {
		try {
			JSONObject data = new JSONObject(this.data);
			Object svgString = data.getJSONArray("nodeStates").getJSONObject(0).getJSONObject("data").get("svgString");
			//return (String) svgString;
			return svgString.toString();
		} catch (JSONException e) {
			e.printStackTrace();
			return "";
		}		
	}

	@Override
	public void populateData(String nodeVisit) {
		this.data = nodeVisit;
	}
	
	@Override
	public void populateData(JSONObject nodeVisitJSON) {
		this.data = nodeVisitJSON.toString();
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		
		if (args[0].equals("store")) {
			StepWork env = new StepWorkSVGDraw();
			env.saveOrUpdate();
		}
		else if (args[0].equals("list")) {
			List<StepWorkSVGDraw> envs = (List<StepWorkSVGDraw>) StepWorkMC.getList(StepWorkSVGDraw.class);
			for (StepWorkSVGDraw env : envs) {
				System.out.println("StepWorkSVGDraw: " + env.getId());
			}
		}

	}
	
	/**
	 * Returns the latest StepWork done by the specified workgroup with the specified id and specified node
	 * or null if no such StepWork exists.
	 * @param id
	 * @param clazz 
	 * @return 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static StepWork getLatestStepWorkSVGDrawByUserInfoAndNodeWithState(UserInfo userInfo,Node node) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        List<StepWork> list = session.createCriteria(StepWork.class).add(Restrictions.eq("userInfo", userInfo))
        	.add(Restrictions.eq("node",node)).addOrder(Order.desc("postTime")).list();
        StepWork result = null;
        
        //loop through all the StepWorkSVGDraw objects
        for(int x=0; x<list.size(); x++) {
        	//get an StepWorkSVGDraw object
        	StepWork stepWork = list.get(x);
        	
        	//get the JSON data string
        	String data = stepWork.getData();
        	
        	try {
        		//create a JSONObject from the data string
				JSONObject dataJSONObj = new JSONObject(data);
				
				//get the nodeStates JSON array
				JSONArray nodeStates = dataJSONObj.getJSONArray("nodeStates");
				
				//check if the array is empty
				if(nodeStates.length() > 0) {
					/*
					 * array is not empty so we have found the latest 
					 * StepWorkSVGDraw that has work and will return it
					 */
					result = stepWork;
					break;
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
        }
        
        session.getTransaction().commit();
        return result;
	}
}
