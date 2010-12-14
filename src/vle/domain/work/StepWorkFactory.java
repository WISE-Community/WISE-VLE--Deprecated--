/**
 * 
 */
package vle.domain.work;


/**
 * Factory pattern for instantiating StepWork objects.
 * 
 * @author hirokiterashima
 */
public class StepWorkFactory {
	
	/**
	 * Instantiates a StepWork according to the nodeVisit
	 * @param nodeVisit
	 * @return
	 */
	public static StepWork createStepWork(String nodeType) {
		StepWork stepWork = null;
		
		if (nodeType.equals("MultipleChoiceNode")) {
			stepWork = new StepWorkMC();
		} else if (nodeType.equals("OpenResponseNode")) {
			stepWork = new StepWorkOR();
		} else if (nodeType.equals("NoteNode")) {
			stepWork = new StepWorkNote();
		} else if (nodeType.equals("HtmlNode") 
				|| nodeType.equals("MySystemNode") 
				|| nodeType.equals("DrawNode")) {
			stepWork = new StepWorkHtml();
		} else if (nodeType.equals("FillinNode")) {
			stepWork = new StepWorkFillin();
		} else if (nodeType.equals("MatchSequenceNode")) {
			stepWork = new StepWorkMatchSequence();
		} else if (nodeType.equals("BrainstormNode")) {
			stepWork = new StepWorkBS();
		} else if (nodeType.equals("SVGDrawNode")) {
			stepWork = new StepWorkSVGDraw();
		} else if (nodeType.equals("AssessmentListNode")) {
			stepWork = new StepWorkAssessmentList();
		} else if (nodeType.equals("ChallengeNode")) {
			stepWork = new StepWorkChallenge();
		} else if (nodeType.equals("BranchNode")) {
			stepWork = new StepWorkBranch();
		} else if (nodeType.equals("SensorNode")) {
			stepWork = new StepWorkSensor();
		} else if (nodeType.equals("TemplateNode")) {
			/**
			 * if you are creating a new step, create a new else if
			 * case by copying this else if case and then renaming
			 * wherever it says Template to the name of your new
			 * step type
			 * 
			 * else if (nodeType.equals("<new step type>Node")){
			 *    stepWork = new StepWork<new step type>();
			 * }
			 * 
			 * e.g. for example if you are creating a quiz step type
			 * you would be adding something like
			 * 
			 * else if (nodeType.equals("QuizNode")){
			 *    stepWork = new StepWorkQuiz();
			 * }
			 */
			stepWork = new StepWorkTemplate();
		}
		return stepWork;
	}
	
}
