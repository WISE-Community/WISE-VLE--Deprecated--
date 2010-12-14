/**
 * 
 */
package vle.domain.work;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import vle.domain.PersistableDomain;
import vle.domain.user.UserInfo;
import vle.hibernate.HibernateUtil;

/**
 * A Cache for students' work, for quicker access.
 * @author hirokiterashima
 */
@Entity
@Table(name="stepwork_cache")
public class StepWorkCache extends PersistableDomain {

	protected static String fromQuery = "from StepWorkCache";

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id = null;
	
	@OneToOne(cascade = {CascadeType.PERSIST})
	private UserInfo userInfo;
	
	@Column(name="cacheTime")
	private Timestamp cacheTime;

	@Column(name="data", length=16777215)  // this makes the db mediumtext
	private String data;
	
	/**
	 * Returns the specified userInfo's StepWorkCache. If no cache is found,
	 * returns null
	 */
	public static StepWorkCache getByUserInfo(UserInfo userInfo) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        StepWorkCache result =  (StepWorkCache) session.createCriteria(StepWorkCache.class).add(Restrictions.eq("userInfo", userInfo)).uniqueResult();
        session.getTransaction().commit();
        return result;
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
	 * @return the cacheTime
	 */
	public Timestamp getCacheTime() {
		return cacheTime;
	}

	/**
	 * @param cacheTime the cacheTime to set
	 */
	public void setCacheTime(Timestamp cacheTime) {
		this.cacheTime = cacheTime;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}


	/**
	 * @see vle.domain.PersistableDomain#getObjectClass()
	 */
	@Override
	protected Class<?> getObjectClass() {
		return StepWorkCache.class;
	}

}
