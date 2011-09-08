/**
 * 
 */
package vle.domain.annotation;

/**
 * Factory pattern for instantiating Annotation objects.
 * 
 * @author hirokiterashima
 */
public class AnnotationFactory {

	/**
	 * Instantiates an Annotation according to the provided
	 * Annotation Type
	 * @param annotation
	 * @return
	 */
	public static Annotation createAnnotation(String annotationType) {
		Annotation annotation = null;
		if (annotationType.equals("comment")) {
			annotation = new AnnotationComment();
		} else if (annotationType.equals("score")) {
			annotation = new AnnotationScore();
		} else if (annotationType.equals("flag")) {
			annotation = new AnnotationFlag();
		}
		
		return annotation;
	}
}
