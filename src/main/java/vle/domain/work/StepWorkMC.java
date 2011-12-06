package vle.domain.work;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.json.JSONObject;

/**
 * Domain Object for storing MC step data
 * @author hirokiterashima
 */
@Entity
@Table(name="stepwork_mc")
public class StepWorkMC extends StepWork {

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

	/**
	 * @param args
	 */
	@SuppressWarnings("unchecked")
	public static void main(String[] args) {
		
		if (args[0].equals("store")) {
			StepWork env = new StepWorkMC();
			env.saveOrUpdate();
		}
		else if (args[0].equals("list")) {
			List<StepWorkMC> envs = (List<StepWorkMC>) StepWorkMC.getList(StepWorkMC.class);
			for (StepWorkMC env : envs) {
				System.out.println("StepWorkMC: " + env.getId());
			}
		}

	}
}
