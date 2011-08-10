/**
 * 
 */
package vle.domain.work;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.json.JSONObject;

/**
 * Domain Object for storing Html step data
 * @author hirokiterashima
 */
@Entity
@Table(name="stepwork_html")
public class StepWorkHtml extends StepWork {

	@Column(name="data", columnDefinition="TEXT")
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
