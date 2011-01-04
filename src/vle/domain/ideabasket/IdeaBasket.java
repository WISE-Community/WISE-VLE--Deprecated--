package vle.domain.ideabasket;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.Session;
import org.hibernate.annotations.IndexColumn;
import org.hibernate.criterion.Restrictions;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import vle.domain.PersistableDomain;
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
	
	/*
	 * contains the ideas in the basket when they are not in the trash
	 */
	@OneToMany(fetch = FetchType.EAGER)
	@JoinColumn(name="ideaBasket_id")
	@IndexColumn(name="basketPosition", base=1, nullable=true)
	private List<Idea> ideas = new ArrayList<Idea>();
	
	/*
	 * contains the ideas in the basket that have been placed in the trash
	 */
	@OneToMany(fetch = FetchType.EAGER)
	@JoinColumn(name="ideaBasketTrash_id")
	@IndexColumn(name="trashPosition", base=1, nullable=true)
	private List<Idea> trash = new ArrayList<Idea>();

	/**
	 * the no args constructor
	 */
	public IdeaBasket() {
		
	}
	
	/**
	 * constructor that populates the values
	 * @param runId the id of the run
	 * @param projectId the id of the project
	 * @param workgroupId the id of the workgroup
	 */
	public IdeaBasket(long runId, long projectId, long workgroupId) {
		this.runId = runId;
		this.projectId = projectId;
		this.workgroupId = workgroupId;
	}
	
	/**
	 * add an Idea to the basket
	 * @param idea the Idea object to add
	 */
	public void addIdea(Idea idea) {
		idea.setIdeaBasket(this);
		ideas.add(idea);
		idea.saveOrUpdate();
	}
	
	/**
	 * move an idea to the trash of this basket
	 * @param idea the Idea to move to the trash
	 */
	public void trashIdea(Idea idea) {
		//get the position the idea is in
		Long basketPosition = idea.getBasketPosition();
		
		if(basketPosition != null) {
			//get the position of the idea within the ideas array
			int ideaPosition = (int) (basketPosition - 1);
			
			//remove the idea
			ideas.remove(ideaPosition);
			
			/*
			 * set the basket to null, we will set it back when we call
			 * setIdeaBasketTrash() below
			 */
			idea.setIdeaBasket(null);
		}
		
		//add the idea to the trash array
		trash.add(idea);
		
		//set the basket
		idea.setIdeaBasketTrash(this);
		
		//set the trash flag to true
		idea.setTrash(true);

		//save changes back to the db
		saveOrUpdate();
	}
	
	/**
	 * move the idea from the trash and back to the ideas array
	 * @param idea the idea to remove from the trash
	 */
	public void unTrashIdea(Idea idea) {
		//get the position in the trash
		Long trashPosition = idea.getTrashPosition();
		
		if(trashPosition != null) {
			//get the position of the idea in the trash array
			int ideaPosition = (int) (trashPosition - 1);
			
			//remove the idea
			trash.remove(ideaPosition);
			
			/*
			 * set the basket to null, we will set it back when we call
			 * setIdeaBasket() below
			 */
			idea.setIdeaBasketTrash(null);
		}
		
		//add the idea to the ideas array
		ideas.add(idea);
		
		//set the basket
		idea.setIdeaBasket(this);
		
		//set the trash flag to false
		idea.setTrash(false);

		//save changes back to the db
		saveOrUpdate();
	}
	
	/**
	 * re orders the ideas according to the JSONArray
	 * @param basketOrder a JSONArray containing the ids of the
	 * Ideas in the order that we want them
	 */
	public void reOrderBasket(JSONArray basketOrder) {
		reOrder(basketOrder, "ideas");
	}
	
	/**
	 * re orders the trash according to the JSONArray
	 * @param trashOrder a JSONArray containing the ids of the
	 * Ideas in the order that we want them
	 */
	public void reOrderTrash(JSONArray trashOrder) {
		reOrder(trashOrder, "trash");
	}
	
	/**
	 * re order the array
	 * @param order the JSONArray containing the new order that we want
	 * @param listType the list we are re ordering ("ideas" or "trash")
	 */
	private void reOrder(JSONArray order, String listType) {
		//a new List to contain the new order
		List<Idea> ideas = new ArrayList<Idea>();
		
		//loop through the array that contains the new order
		for(int x=0; x<order.length(); x++) {
			try {
				//get the idea id
				long ideaId = order.getLong(x);

				//get the Idea
				Idea idea = Idea.getIdeaById(ideaId);

				boolean isTrash = idea.isTrash();
				
				//make sure the idea is really in ideas or trash to maintain data consistency
				if((!isTrash && listType.equals("ideas")) || (isTrash && listType.equals("trash"))) {
					//add the Idea to our new List
					ideas.add(idea);	
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		
		if(listType == null) {
			//error
		} else if(listType.equals("ideas")) {
			//we are re ordering the ideas
			setIdeas(ideas);
		} else if(listType.equals("trash")) {
			//we are re ordering the trash
			setTrash(ideas);
		}
		
		//save the changes back to the db
		saveOrUpdate();
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public List<Idea> getIdeas() {
		return ideas;
	}

	public void setIdeas(List<Idea> ideas) {
		this.ideas = ideas;
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

	public List<Idea> getTrash() {
		return trash;
	}

	public void setTrash(List<Idea> trash) {
		this.trash = trash;
	}
	
	@Override
	protected Class<?> getObjectClass() {
		return IdeaBasket.class;
	}

	/**
	 * get the JSON object representation of the IdeaBasket
	 * @return a JSONObject representing the IdeaBasket
	 */
	public JSONObject toJSONObject() {
		JSONObject jsonObject = new JSONObject();
		
		try {
			//set the fields
			jsonObject.put("id", getId());
			jsonObject.put("runId", getRunId());
			jsonObject.put("workgroupId", getWorkgroupId());
			jsonObject.put("projectId", getProjectId());
			
			//create the JSONArray that will contain the ideas
			JSONArray ideasJSONArray = new JSONArray();
			List<Idea> ideas = getIdeas();
			
			//loop through all the ideas
			for(int x=0; x<ideas.size(); x++) {
				Idea idea = ideas.get(x);
				JSONObject ideaJSONObject = idea.toJSONObject();
				ideasJSONArray.put(ideaJSONObject);
			}
			
			jsonObject.put("ideas", ideasJSONArray);
			
			//create the JSONArray that will contain the trash
			JSONArray trashJSONArray = new JSONArray();
			List<Idea> trash = getTrash();
			
			//loop through all the trash
			for(int x=0; x<trash.size(); x++) {
				Idea idea = trash.get(x);
				JSONObject ideaJSONObject = idea.toJSONObject();
				trashJSONArray.put(ideaJSONObject);
			}
			
			jsonObject.put("trash", trashJSONArray);
			
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return jsonObject;
	}

	/**
	 * Get the JSON string representation of the IdeaBasket
	 * @return
	 */
	public String toJSONString() {
		String jsonString = "";
		JSONObject jsonObject = this.toJSONObject();
		
		if(jsonObject != null) {
			try {
				//get the JSONString representation with indentation using 3 spaces
				jsonString = jsonObject.toString(3);
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		
		return jsonString;
	}
	
	/**
	 * Get the IdeaBasket with the given run id and workgroup id
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
        				Restrictions.eq("workgroupId", workgroupId)).list();
        session.getTransaction().commit();
        
        IdeaBasket ideaBasket = null;
        if(result.size() > 0) {
        	//get the IdeaBasket fromt he result list
        	ideaBasket = result.get(0);
        }
        return ideaBasket;
	}
}
