
package vle.domain.work;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.json.JSONObject;

/**
 * Domain for saving Challenge data.
 * 
 * @author patrick lawler
 */

@Entity
@Table(name="stepwork_challenge")
public class StepWorkChallenge extends StepWork{
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
