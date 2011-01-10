package vle.domain.ideabasket;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.json.JSONException;
import org.json.JSONObject;

import vle.domain.PersistableDomain;
import vle.hibernate.HibernateUtil;

@Entity
@Table(name="idea")
public class Idea extends PersistableDomain implements Serializable {

	private static final long serialVersionUID = 1L;
	
	//the unique id of the Idea
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id = null;

	/*
	 * the basket this idea is in. when the idea is in the basket
	 * and not in the trash this field will be not null. when it
	 * is placed in the trash, this field will become null and
	 * we will set ideaBasketTrash to be not null. at all times
	 * either one of ideaBasket or ideaBasketTrash will be null
	 * and the other not null.
	 */
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name="ideaBasket_id", insertable=false, updatable=false)
	private IdeaBasket ideaBasket = null;
	
	/*
	 * the basket this idea is in. when the idea is in the basket
	 * trash, this field will not be null. when it is removed from
	 * the trash this field will become null and we will set 
	 * ideaBasket to be not null. at all times either one of 
	 * ideaBasket or ideaBasketTrash will be null and the other not null.
	 * 
	 * this is required because hibernate complains when trashPosition
	 * is null. when an Idea is in the IdeaBasket.ideas array or
	 * IdeaBasket.trash array, it requires that the JoinColumn be
	 * not null which is why I needed to create the two columns, 
	 * ideaBasket_id and ideaBasketTrash_id instead of just one.
	 * so that when the Idea is in the ideas array, the ideaBasket_id 
	 * will be not null and when the Idea is in the trash array, 
	 * the ideaBasketTrash_id will be not null.
	 */
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name="ideaBasketTrash_id", insertable=false, updatable=false)
	private IdeaBasket ideaBasketTrash = null;

	//the position this idea is in the basket to maintain order in the basket
	@Column(name="basketPosition", nullable=true)
	private Long basketPosition = null;
	
	//the position this idea is in the basket trash to maintain order in the trash
	@Column(name="trashPosition", nullable=true)
	private Long trashPosition = null;

	//the type of idea
	@Column(name="type")
	private String type;

	//the text the student has written for this idea
	@Column(name="text")
	private String text;
	
	//the generic source of the idea chosen by the student
	@Column(name="source")
	private String source;

	//the id of the node in the project
	@Column(name="nodeId")
	private String nodeId;
	
	//the name of the node in the project (e.g. the step name)
	@Column(name="nodeName")
	private String nodeName;
	
	//a basic tag to specify what this idea is related to (e.g. tires or plastic)
	@Column(name="tag")
	private String tag;
	
	//question mark, exclamation, check, or star
	@Column(name="flag")
	private String flag;
	
	//whether this idea is in the trash of the basket
	@Column(name="trash")
	private boolean trash = false;
	
	/**
	 * the no args constructor
	 */
	public Idea() {
		
	}
	
	/**
	 * constructor that sets the text
	 * @param text the text for the idea that the student wrote
	 * @param nodeId the id of the node in the project
	 * @param nodeName the name of the node in the project (e.g. the step name)
	 * @param tag a basic tag to specify what this idea is related to (e.g. tires or plastic)
	 * @param flag question mark, exclamation, check, or star
	 */
	public Idea(String text, String source, String nodeId, String nodeName, String tag, String flag) {
		this.text = text;
		this.source = source;
		this.nodeId = nodeId;
		this.nodeName = nodeName;
		this.tag = tag;
		this.flag = flag;
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public IdeaBasket getIdeaBasket() {
		return ideaBasket;
	}

	public void setIdeaBasket(IdeaBasket ideaBasket) {
		this.ideaBasket = ideaBasket;
	}
	
	public Long getBasketPosition() {
		return basketPosition;
	}

	public void setBasketPosition(Long basketPosition) {
		this.basketPosition = basketPosition;
	}
	
	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
	
	public String getType() {
		return type;
	}
	
	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}

	public String getNodeName() {
		return nodeName;
	}

	public void setNodeName(String nodeName) {
		this.nodeName = nodeName;
	}

	public String getTag() {
		return tag;
	}

	public void setTag(String tag) {
		this.tag = tag;
	}

	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

	public boolean isTrash() {
		return trash;
	}

	public void setTrash(boolean trash) {
		this.trash = trash;
	}
	
	public Long getTrashPosition() {
		return trashPosition;
	}

	public void setTrashPosition(Long trashPosition) {
		this.trashPosition = trashPosition;
	}
	
	public IdeaBasket getIdeaBasketTrash() {
		return ideaBasketTrash;
	}

	public void setIdeaBasketTrash(IdeaBasket ideaBasketTrash) {
		this.ideaBasketTrash = ideaBasketTrash;
	}
	
	/**
	 * get the id of the basket this idea is in
	 */
	public Long getIdeaBasketId() {
		Long ideaBasketId = null;
		
		if(this.ideaBasket != null) {
			//the idea is not in the trash section
			ideaBasketId = this.ideaBasket.getId();
		} else if(this.ideaBasketTrash != null) {
			//the idea is in the trash
			ideaBasketId = this.ideaBasketTrash.getId();
		}
		
		return ideaBasketId;
	}
	
	public void editIdea(String text, String source, String nodeId, String nodeName, String tag, String flag) {
		this.text = text;
		this.source = source;
		this.nodeId = nodeId;
		this.nodeName = nodeName;
		this.tag = tag;
		this.flag = flag;
	}
	
	@Override
	protected Class<?> getObjectClass() {
		return Idea.class;
	}
	
	/**
	 * Get the JSON object representation of this idea
	 * @return a JSONObject representing the Idea
	 */
	public JSONObject toJSONObject() {
		JSONObject jsonObject = new JSONObject();
		
		try {
			jsonObject.put("id", getId());
			jsonObject.put("ideaBasketId", getIdeaBasketId());
			jsonObject.put("type", getType());
			jsonObject.put("text", getText());
			jsonObject.put("source", getSource());
			jsonObject.put("nodeId", getNodeId());
			jsonObject.put("nodeName", getNodeName());
			jsonObject.put("tag", getTag());
			jsonObject.put("flag", getFlag());
			jsonObject.put("trash", isTrash());
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return jsonObject;
	}
	
	/**
	 * get the JSON string representation of the idea
	 * @return a JSON string representing the Idea
	 */
	public String toJSONString() {
		String jsonString = "";
		JSONObject jsonObject = this.toJSONObject();
		
		if(jsonObject != null) {
			try {
				//get the JSON string with indentation using 3 spaces
				jsonString = jsonObject.toString(3);
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		
		return jsonString;
	}
	
	/**
	 * Get the Idea object given the id
	 * @param id
	 * @return
	 */
	public static Idea getIdeaById(long id) {
		Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        
        //find all the Idea objects with the given id (there should only be one)
        List<Idea> result =  session.createCriteria(Idea.class).add(Restrictions.eq("id", id)).list();
        session.getTransaction().commit();
        
        Idea idea = null;
        if(result.size() > 0) {
        	//get the Idea from the result list
        	idea = result.get(0);
        }
        return idea;
	}
}
