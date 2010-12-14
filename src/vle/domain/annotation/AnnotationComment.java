/**
 * 
 */
package vle.domain.annotation;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Domain representing a user's comment on other user's work.
 * For example, teacher giving comment to the work while grading.
 * 
 * @author hirokiterashima
 */
@Entity
@Table(name="annotation_comment")
public class AnnotationComment extends Annotation {
	
	@Column(name="data", length=512)
	private String data;

	@Override
	public String getData() {
		return data;
	}

	@Override
	public void setData(String data) {
		this.data = data;
	}

}
