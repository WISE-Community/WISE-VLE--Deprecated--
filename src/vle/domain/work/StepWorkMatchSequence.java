/**
 * 
 */
package vle.domain.work;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.json.JSONObject;

/**
 * Domain for storing match sequence step data
 * @author hirokiterashima
 */
@Entity
@Table(name="stepwork_matchsequence")
public class StepWorkMatchSequence extends StepWork {

	@Column(name="data", length=1024)
	private String data;
	
	@Override
	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	@Override
	public void populateData(String nodeVisit) {
		this.data = nodeVisit;
	}
	
	@Override
	public void populateData(JSONObject nodeVisitJSON) {
		this.data = nodeVisitJSON.toString();
	}

}
