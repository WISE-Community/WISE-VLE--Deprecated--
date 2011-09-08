/**
 * 
 */
package vle.domain.work;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.json.JSONObject;


/**
 * Domain Object for storing Sensor step data
 * @author geoffreykwan
 */
@Entity
@Table(name="stepwork_sensor")
public class StepWorkSensor extends StepWork {

	@Column(name="data", columnDefinition="TEXT")
	private String data;
	
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

	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		
	}
}

