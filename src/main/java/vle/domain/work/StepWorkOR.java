package vle.domain.work;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.json.JSONObject;


/**
 * Domain Object for storing OpenResponse step data
 * @author hirokiterashima
 */
@Entity
@Table(name="stepwork_or")
public class StepWorkOR extends StepWork {

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
	@SuppressWarnings("unchecked")
	public static void main(String[] args) {
		
		if (args[0].equals("store")) {
			StepWork env = new StepWorkOR();
			env.saveOrUpdate();
		}
		else if (args[0].equals("list")) {
			List<StepWorkOR> envs = (List<StepWorkOR>) StepWorkOR.getList(StepWorkOR.class);
			for (StepWorkOR env : envs) {
				System.out.println("StepWorkMC: " + env.getId());
			}
		}

	}
}

