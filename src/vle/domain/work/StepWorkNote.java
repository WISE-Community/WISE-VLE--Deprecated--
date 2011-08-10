/**
 * 
 */
package vle.domain.work;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.json.JSONObject;

/**
 * Domain Object for storing Note step data
 * @author hirokiterashima
 */
@Entity
@Table(name="stepwork_note")
public class StepWorkNote extends StepWork {

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
		
		if (args[0].equals("store")) {
			StepWork env = new StepWorkNote();
			env.saveOrUpdate();
		}
		else if (args[0].equals("list")) {
			List<StepWorkNote> envs = (List<StepWorkNote>) StepWorkNote.getList(StepWorkNote.class);
			for (StepWorkNote env : envs) {
				System.out.println("StepWorkNote: " + env.getId());
			}
		}

	}
}

