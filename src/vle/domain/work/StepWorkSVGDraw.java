package vle.domain.work;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Domain Object for storing SVGDraw step data
 * @author hirokiterashima
 */
@Entity
@Table(name="stepwork_svgdraw")
public class StepWorkSVGDraw extends StepWork {

	@Column(name="data", length=1024)
	private String data;
	
	@Override
	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}
	
	// returns the first nodeState
	public String getSVGString() {
		try {
			JSONObject data = new JSONObject(this.data);
			Object svgString = data.getJSONArray("nodeStates").getJSONObject(0).getJSONObject("data").get("svgString");
			//return (String) svgString;
			return svgString.toString();
		} catch (JSONException e) {
			e.printStackTrace();
			return "";
		}		
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
			StepWork env = new StepWorkSVGDraw();
			env.saveOrUpdate();
		}
		else if (args[0].equals("list")) {
			List<StepWorkSVGDraw> envs = (List<StepWorkSVGDraw>) StepWorkMC.getList(StepWorkSVGDraw.class);
			for (StepWorkSVGDraw env : envs) {
				System.out.println("StepWorkSVGDraw: " + env.getId());
			}
		}

	}
}
