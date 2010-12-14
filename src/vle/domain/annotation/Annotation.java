/**
 * 
 */
package vle.domain.annotation;

import java.sql.Timestamp;
import java.util.List;
import java.util.Vector;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import utils.VLEDataUtils;
import vle.domain.PersistableDomain;
import vle.domain.user.UserInfo;
import vle.domain.work.StepWork;
import vle.hibernate.HibernateUtil;

/**
 * Domain representing Annotation.
 * Annotations are what users annotate on other
 * user's work, such as Comments, Scores, Flags.
 * @author hirokiterashima
 */
@Entity
@Table(name="annotation")
@Inheritance(strategy=InheritanceType.JOINED)
public class Annotation extends PersistableDomain {

	protected static String fromQuery = "from Annotation";
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id = null;

	@ManyToOne(cascade = {CascadeType.PERSIST})
	private UserInfo userInfo;  // who created this annotation

	@ManyToOne(cascade = {CascadeType.PERSIST})
	private StepWork stepWork;   // the work that is being annotated

	@Column(name="annotateTime")
	private Timestamp annotateTime;  // when the work was actually annotated

	@Column(name="postTime")
	private Timestamp postTime;  // when this annotation was saved

	@Column(name="runId")
	private Long runId = null;

	public Long getId() {
        return id;
    }

    @SuppressWarnings("unused")
	private void setId(Long id) {
        this.id = id;
    }

	/**
	 * @return the userInfo
	 */
	public UserInfo getUserInfo() {
		return userInfo;
	}

	/**
	 * @param userInfo the userInfo to set
	 */
	public void setUserInfo(UserInfo userInfo) {
		this.userInfo = userInfo;
	}

	/**
	 * @return the stepWork
	 */
	public StepWork getStepWork() {
		return stepWork;
	}

	/**
	 * @param stepWork the stepWork to set
	 */
	public void setStepWork(StepWork stepWork) {
		this.stepWork = stepWork;
	}

	/**
	 * @return the annotateTime
	 */
	public Timestamp getAnnotateTime() {
		return annotateTime;
	}

	/**
	 * @param annotateTime the annotateTime to set
	 */
	public void setAnnotateTime(Timestamp annotateTime) {
		this.annotateTime = annotateTime;
	}

	/**
	 * @return the postTime
	 */
	public Timestamp getPostTime() {
		return postTime;
	}

	/**
	 * @param postTime the postTime to set
	 */
	public void setPostTime(Timestamp postTime) {
		this.postTime = postTime;
	}
	
	/**
	 * @return the id of the run
	 */
    public Long getRunId() {
		return runId;
	}

    /**
     * @param runId the id of the run
     */
	public void setRunId(Long runId) {
		this.runId = runId;
	}

	/**
	 * @see vle.domain.PersistableDomain#getObjectClass()
	 */
	@Override
	protected Class<?> getObjectClass() {
		return Annotation.class;
	}

	/**
	 * populates the data of the annotation
	 * @param nodeVisit
	 */
	public void setData(String annotation) {
		// to be overridden by subclass.
	}
	
	/**
	 * Returns the data associated with this stepWork
	 * @return
	 */
	public String getData() {
		return "";
	}
	
	/**
	 * Returns a list of Annotation that were made from
	 * the specified workgroup to the specified workgroup.
	 * If either workgroup is null, handle for all workgroup.
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static List<Annotation> getByFromWorkgroupAndToWorkgroup(UserInfo fromWorkgroup, UserInfo toWorkgroup, Class clazz) {
		// first get all the work done by the toWorkgroup.
		List<StepWork> workByToWorkgroup = StepWork.getByUserInfo(toWorkgroup);

		Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();

        List<Annotation> result = 
        	session.createCriteria(clazz)
        		.add( Restrictions.eq("userInfo", fromWorkgroup))
        		.add( Restrictions.in("stepWork", workByToWorkgroup))
        		.list();
        session.getTransaction().commit();
        return result;
	}
	
	
	/**
	 * Get a list of Annotation objects given a list of fromWorkgroups and a toWorkgroup
	 * @param fromWorkgroups a list of from workroups
	 * @param toWorkgroup a to workgroup
	 * @param clazz
	 * @return a list of Annotation objects that match the toWorkgroup and any fromWorkgroup
	 * in the list of fromWorkgroups
	 */
	public static List<Annotation> getByFromWorkgroupsAndToWorkgroup(List<UserInfo> fromWorkgroups, UserInfo toWorkgroup, Class clazz) {
		// first get all the work done by the toWorkgroup.
		List<StepWork> workByToWorkgroup = StepWork.getByUserInfo(toWorkgroup);

		List<Annotation> result = new Vector<Annotation>();
		
		//check if there was any work
		if(workByToWorkgroup.size() != 0) {
			Session session = HibernateUtil.getSessionFactory().getCurrentSession();
	        session.beginTransaction();

	        result = 
	        	session.createCriteria(clazz)
	        		.add( Restrictions.in("userInfo", fromWorkgroups))
	        		.add( Restrictions.in("stepWork", workByToWorkgroup))
	        		.list();
	        session.getTransaction().commit();
		}

        return result;
	}
	
	/**
	 * Returns a list of Annotation that are for the specified run id
	 * @param runId the id of the run we want annotations for
	 * @param clazz this Annotation.class
	 * @return a list of Annotation
	 */
	public static List<? extends Annotation> getByRunId(Long runId, Class clazz) {
		Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();

        List<Annotation> result = 
        	session.createCriteria(clazz)
        		.add( Restrictions.eq("runId", runId))
        		.list();
        session.getTransaction().commit();
        return result;
	}
	
	/**
	 * @param userInfo User who did the annotation
	 * @param stepWork stepWork that was annotated
	 * @param clazz Which Annotation class {Annotation, AnnotationScore, AnnotationComment, AnnotationFlag}
	 * @return
	 */
	public static Annotation getByUserInfoAndStepWork(UserInfo userInfo, StepWork stepWork, Class clazz) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();

        Annotation result = 
        	(Annotation) session.createCriteria(clazz)
        		.add( Restrictions.eq("userInfo", userInfo))
        		.add( Restrictions.eq("stepWork", stepWork))
        		.uniqueResult();
        session.getTransaction().commit();
        return result;
	}
	
	/**
	 * Get all the annotations that are from any of the users in the fromWorkgroups list
	 * and to the specific step work
	 * @param fromWorkgroups a list of UserInfo objects
	 * @param stepWork a StepWork object
	 * @param clazz
	 * @return a list of annotations that are from anyone in the fromWorkgroups list
	 * to the specific step work
	 */
	public static List<Annotation> getByFromWorkgroupsAndStepWork(List<UserInfo> fromWorkgroups, StepWork stepWork, Class clazz) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();

        List<Annotation> results = 
        	(List<Annotation>) session.createCriteria(clazz)
        		.add( Restrictions.in("userInfo", fromWorkgroups))
        		.add( Restrictions.eq("stepWork", stepWork))
        		.list();
        session.getTransaction().commit();
        return results;
	}
	
	/**
	 * Get all the annotations for the given stepwork
	 * @param stepWork
	 * @param clazz
	 * @return a list of annotations that are for a given stepwork
	 */
	public static List<Annotation> getByStepWork(StepWork stepWork, Class clazz) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();

        List<Annotation> results = 
        	(List<Annotation>) session.createCriteria(clazz)
        		.add( Restrictions.eq("stepWork", stepWork))
        		.list();
        session.getTransaction().commit();
        return results;
	}
}
