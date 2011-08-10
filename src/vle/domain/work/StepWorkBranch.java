/**
 * 
 */
package vle.domain.work;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.json.JSONObject;

/**
 * Domain for saving Branch data
 * 
 * @author patrick lawler
 */
@Entity
@Table(name="stepwork_branch")
public class StepWorkBranch extends StepWork{
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
	public void populateData(String data) {
		this.data = data;
	}

	@Override
	public void populateData(JSONObject dataJSON) {
		this.data = dataJSON.toString();
	}
}
