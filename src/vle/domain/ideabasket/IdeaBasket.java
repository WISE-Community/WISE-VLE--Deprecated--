package vle.domain.ideabasket;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.json.JSONException;
import org.json.JSONObject;

import vle.domain.PersistableDomain;
import vle.domain.work.StepWork;
import vle.hibernate.HibernateUtil;

@Entity
@Table(name="ideaBasket")
public class IdeaBasket extends PersistableDomain implements Serializable {

	private static final long serialVersionUID = 1L;

	//the unique id of the IdeaBasket
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id = null;

	//the id of the run
	@Column(name="runId")
	private Long runId = null;
	
	//the id of the workgroup
	@Column(name="workgroupId")
	private Long workgroupId = null;
	
	//the id of the project
	@Column(name="projectId")
	private Long projectId = null;
	
	//the JSON string for the idea basket
	@Column(name="data", length=1024)
	private String data = null;
	
	//the time the idea basket was posted
	@Column(name="postTime")
	private Timestamp postTime;

	/**
	 * the no args constructor
	 */
	public IdeaBasket() {
		
	}
	
	/**
	 * Constructor that does not populate the data field
	 * @param runId
	 * @param projectId
	 * @param workgroupId
	 */
	public IdeaBasket(long runId, long projectId, long workgroupId) {
		this.runId = runId;
		this.projectId = projectId;
		this.workgroupId = workgroupId;
		Calendar now = Calendar.getInstance();
		this.postTime = new Timestamp(now.getTimeInMillis());
	}
	
	/**
	 * Constructor that populates the values
	 * @param runId the id of the run
	 * @param projectId the id of the project
	 * @param workgroupId the id of the workgroup
	 * @param data the idea basket JSON
	 */
	public IdeaBasket(long runId, long projectId, long workgroupId, String data) {
		this.runId = runId;
		this.projectId = projectId;
		this.workgroupId = workgroupId;
		Calendar now = Calendar.getInstance();
		this.postTime = new Timestamp(now.getTimeInMillis());
		this.data = data;
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public Long getRunId() {
		return runId;
	}

	public void setRunId(Long runId) {
		this.runId = runId;
	}

	public Long getWorkgroupId() {
		return workgroupId;
	}

	public void setWorkgroupId(Long workgroupId) {
		this.workgroupId = workgroupId;
	}

	public Long getProjectId() {
		return projectId;
	}

	public void setProjectId(Long projectId) {
		this.projectId = projectId;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}
	
	public Timestamp getPostTime() {
		return postTime;
	}

	public void setPostTime(Timestamp postTime) {
		this.postTime = postTime;
	}
	
	@Override
	protected Class<?> getObjectClass() {
		return IdeaBasket.class;
	}

	/**
	 * Get the JSON string representation of the IdeaBasket
	 * @return
	 */
	public String toJSONString() {
		String jsonString = "";
		
		jsonString = getData();
		
		if(jsonString == null) {
			try {
				JSONObject jsonObject = new JSONObject();
				jsonObject = new JSONObject();
				jsonObject.put("id", getId());
				jsonObject.put("runId", getRunId());
				jsonObject.put("workgroupId", getWorkgroupId());
				jsonObject.put("projectId", getProjectId());
				jsonString = jsonObject.toString(3);
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		
		return jsonString;
	}
	
	/**
	 * Get the latest IdeaBasket with the given run id and workgroup id
	 * @param runId the id of the run
	 * @param workgroupId the id of the workgroup
	 * @return the IdeaBasket with the matching runId and workgroupId
	 */
	public static IdeaBasket getIdeaBasketByRunIdWorkgroupId(long runId, long workgroupId) {
		Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        
        //find all the IdeaBasket objects that match
        List<IdeaBasket> result =  session.createCriteria(IdeaBasket.class).add(
        		Restrictions.eq("runId", runId)).add(
        				Restrictions.eq("workgroupId", workgroupId)).addOrder(Order.desc("postTime")).list();
        session.getTransaction().commit();
        
        IdeaBasket ideaBasket = null;
        if(result.size() > 0) {
        	/*
        	 * get the first IdeaBasket from the result list since 
        	 * that will be the latest revision of that idea basket
        	 */
        	ideaBasket = result.get(0);
        }
        return ideaBasket;
	}
	
	/**
	 * Get all the latest IdeaBaskets with the given run id
	 * 
	 * we will basically be performing this query
	 * select * from vle_database.ideaBasket i where id in(SELECT max(id) FROM vle_database.ideaBasket i where runid=<insert runId> group by workgroupid)
	 * 
	 * @param runId the id of the run
	 * @return all the latest IdeaBaskets for a run id
	 */
	@SuppressWarnings("unchecked")
	public static List<IdeaBasket> getLatestIdeaBasketsForRunId(long runId) {
		Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        
        /*
         * create a projection that will give us the latest idea basket id
         * for each workgroup id in the run. the projection will return 
         * an array of array objects that will look like [id, workgroupId].
         * each workgroup id will only appear once.
         */
        ProjectionList projectionList = Projections.projectionList();
        projectionList.add(Projections.max("id"));
        projectionList.add(Projections.groupProperty("workgroupId"));
        
        //this first query will filter on the runId and the projection
        List latestIdeaBasketIdsProjection =  session.createCriteria(IdeaBasket.class).add(
        		Restrictions.eq("runId", runId)).setProjection(projectionList).list();
        
        //the list that will contain all the idea basket ids we want
        List<Long> ideaBasketIds = new ArrayList<Long>();
        
        //loop through all the results from our first query
        for(int x=0; x<latestIdeaBasketIdsProjection.size(); x++) {
        	//get the idea basket id
        	Object[] projection = (Object[]) latestIdeaBasketIdsProjection.get(x);
        	Long ideaBasketId = (Long) projection[0];
        	ideaBasketIds.add(ideaBasketId);
        }
        
        List<IdeaBasket> result = new ArrayList<IdeaBasket>();
        
        if(ideaBasketIds.size() > 0) {
        	//this second query will retrieve all the idea basket ids we retrieved from the first query
        	result = session.createCriteria(IdeaBasket.class).add(StepWork.createIdOrCriterion(ideaBasketIds, 0)).list();        	
        }
        
        session.getTransaction().commit();
        
        return result;
	}
}
