/**
 * 
 */
package vle.domain.annotation;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.json.JSONException;
import org.json.JSONObject;

import utils.VLEDataUtils;

/**
 * Domain representing a user's score on other user's work.
 * For example, teacher giving score to the student's work while grading.
 * 
 * @author hirokiterashima
 */
@Entity
@Table(name="annotation_score")
public class AnnotationScore extends Annotation {

	@Column(name="data")
	private String data;
	
	@Column(name="score")
	private float score;

	@Override
	public String getData() {
		return data;
	}

	@Override
	public void setData(String data) {
		this.data = data;
		
		//String score = VLEDataUtils.getValueInbetweenTag(data, "<value>", "</value>");
		/*
		try {
			JSONObject jsonObj = new JSONObject(data);
			String valueStr = (String) jsonObj.get("value");
			this.setScore(Float.parseFloat(valueStr));
		} catch (Exception e) {
			System.err.println("could not extract and save score");
			e.printStackTrace();
		}
		*/
	}

	/**
	 * @return the score
	 */
	public float getScore() {
		return score;
	}

	/**
	 * @param score the score to set
	 */
	public void setScore(float score) {
		this.score = score;
	}
}
