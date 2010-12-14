/**
 * 
 */
package vle.domain.work;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.json.JSONObject;


/**
 * This is a template Domain Object that developers can use to create new
 * step types.
 *
 * TODO: Copy this file and rename it to
 * 
 * StepWork<new step type>.java
 * e.g. for example if you are creating a quiz step type it would look
 * something like StepWorkQuiz.java
 * 
 * TODO: rename the table name that the student data will be stored in for
 * your new step type in the line @Table(name="stepwork_template")
 * replace template with the name of your new step type
 * 
 * @Table(name="stepwork_<new step type>")
 * e.g. for example if you are creating a quiz step type it would look
 * something like @Table(name="stepwork_quiz")
 * 
 * TODO: rename the class to reflect the new step type you are making
 * 
 * StepWork<new step type>
 * e.g. for example if you are creating a quiz step type it would look
 * something like StepWorkQuiz
 * 
 */
@Entity
@Table(name="stepwork_template")
public class StepWorkTemplate extends StepWork {

	@Column(name="data", length=1024)
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

