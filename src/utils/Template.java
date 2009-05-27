/**
 * Copyright (c) 2008 Regents of the University of California (Regents). Created
 * by TELS, Graduate School of Education, University of California at Berkeley.
 *
 * This software is distributed under the GNU Lesser General Public License, v2.
 *
 * Permission is hereby granted, without written agreement and without license
 * or royalty fees, to use, copy, modify, and distribute this software and its
 * documentation for any purpose, provided that the above copyright notice and
 * the following two paragraphs appear in all copies of this software.
 *
 * REGENTS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE. THE SOFTWAREAND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED
 * HEREUNDER IS PROVIDED "AS IS". REGENTS HAS NO OBLIGATION TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 *
 * IN NO EVENT SHALL REGENTS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT,
 * SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS,
 * ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * REGENTS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package utils;

/**
 * @author patrick lawler
 *
 */
public final class Template {
	
	public final static String NL = System.getProperty("line.separator");

	public static String getProjectTemplate(){
		return "<project autoStep=\"true\">" + NL + 
			"<nodes>" + NL +
			"</nodes>" + NL +
			"<sequences>" + NL +
			getSequenceTemplate("master") + NL +
			"</sequences>" + NL +
			"<method>" + NL +
			"<startpoint>" + NL +
			"<sequence-ref ref=\"master\"/>" + NL +
			"</startpoint>" + NL +
			"</method>" + NL +
			"</project>";
	}
	
	public static String getProjectNodeTemplate(String node, String name, String title, String ext){
		return "<" + node + " identifier=\"" + name + "\" title=\"" + title + "\">" + NL +
			"<ref filename=\"" + name + ext + "\"/>" + NL + 
			"</" + node + ">" + NL;
	}
	
	public static String getSequenceTemplate(String name){
		return "<sequence identifier=\"" + name + "\">" + NL + "</sequence>";
	}
	
	public static String getNodeTemplate(String type){
		if(type.equals("BrainstormNode")){
			return getBrainstormTemplate();
		} else if(type.equals("FillinNode")){
			return getFillinTemplate();
		} else if(type.equals("HtmlNode")){
			return getHtmlTemplate();
		} else if(type.equals("MatchSequenceNode")){
			return getMatchSequenceTemplate();
		} else if(type.equals("MultipleChoiceNode")){
			return getMultipleChoiceTemplate();
		} else if(type.equals("NoteNode")){
			return getNoteTemplate();
		} else if(type.equals("JournalEntryNode")){
			return getJournalEntryTemplate();
		} else if(type.equals("OutsideUrlNode")){
			return getOutsideUrlTemplate();
		} else if(type.equals("GlueNode")){
			return getGlueTemplate();
		} else if(type.equals("OpenResponseNode")){
			return getOpenResponseTemplate();
		} else {
			return "";
		}
	}

	/**
	 * Returns an Outside URL Template
	 * @return
	 */
	private static String getOutsideUrlTemplate() {
		return "<OutsideUrl>" + NL + "<url></url>" + NL + "</OutsideUrl>";
	}
	
	/**
	 * Returns an Open Response Template
	 */
	private static String getOpenResponseTemplate(){
		return "<OpenResponse>" + NL + 
			"<assessmentItem xmlns=\"http://www.imsglobal.org/xsd/imsqti_v2p0\" xmlns:ns3=\"http://www.w3.org/1998/Math/MathML\" xmlns:ns2=\"http://www.w3.org/1999/xlink\" timeDependent=\"false\" adaptive=\"false\" identifier=\"Entry\">" + NL +
			"<responseDeclaration baseType=\"string\" cardinality=\"single\" identifier=\"JournalEntry\"/>" + NL +
			"<itemBody>" + NL +
			"<extendedTextInteraction hasInlineFeedback=\"false\" placeholderText=\"\" responseIdentifier=\"JournalEntry\" expectedLines=\"0\">" + NL +
			"<prompt></prompt>" + NL +
			"</extendedTextInteraction>" + NL +
			"</itemBody>" + NL +
			"</assessmentItem>" + NL +
			"</OpenResponse>";
	}

	/**
	 * Returns a Journal Entry Template
	 * @return
	 */
	private static String getJournalEntryTemplate() {
		return "<JournalEntry>" + NL + "<jaxbXML>" + NL +
			"<assessmentItem xmlns=\"http://www.imsglobal.org/xsd/imsqti_v2p0\" xmlns:ns3=\"http://www.w3.org/1998/Math/MathML\" xmlns:ns2=\"http://www.w3.org/1999/xlink\" timeDependent=\"false\" adaptive=\"false\" identifier=\"Entry\">" + NL +
			"<responseDeclaration baseType=\"string\" cardinality=\"single\" identifier=\"JournalEntry\"/>" + NL +
			"<itemBody>" + NL +
			"<extendedTextInteraction hasInlineFeedback=\"false\" placeholderText=\"\" responseIdentifier=\"JournalEntry\" expectedLines=\"0\">" + NL +
			"<prompt></prompt>" + NL +
			"</extendedTextInteraction>" + NL +
			"</itemBody>" + NL +
			"</assessmentItem>" + NL +
			"</jaxbXML>" + NL +
			"</JournalEntry>";
	}

	/**
	 * Returns a Note Template
	 * @return
	 */
	private static String getNoteTemplate() {
		return "<Note>" + NL + "<jaxbXML>" + NL +
		"<assessmentItem xmlns=\"http://www.imsglobal.org/xsd/imsqti_v2p0\" xmlns:ns3=\"http://www.w3.org/1998/Math/MathML\" xmlns:ns2=\"http://www.w3.org/1999/xlink\" timeDependent=\"false\" adaptive=\"false\" identifier=\"Note\">" + NL +
		"<responseDeclaration baseType=\"string\" cardinality=\"single\" identifier=\"Note\"/>" + NL +
		"<itemBody>" + NL +
		"<extendedTextInteraction hasInlineFeedback=\"false\" placeholderText=\"\" responseIdentifier=\"Note\" expectedLines=\"0\">" + NL +
		"<prompt></prompt>" + NL +
		"</extendedTextInteraction>" + NL +
		"</itemBody>" + NL +
		"</assessmentItem>" + NL +
		"</jaxbXML>" + NL +
		"</Note>";
	}

	private static String getMultipleChoiceTemplate() {
		return "<jaxbXML>" + NL + 
			"<assessmentItem xmlns=\"http://www.imsglobal.org/xsd/imsqti_v2p0\" xmlns:ns3=\"http://www.w3.org/1998/Math/MathML\" xmlns:ns2=\"http://www.w3.org/1999/xlink\" timeDependent=\"false\" adaptive=\"false\">" + NL +
			"<responseDeclaration identifier=\"SINGLE_CHOICE\">" + NL +
			"<correctResponse interpretation=\"\"/>" + NL +
			"</responseDeclaration>" + NL +
			"<itemBody>" + NL +
			"<choiceInteraction hasInlineFeedback=\"false\" responseIdentifier=\"SINGLE_CHOICE\" maxChoices=\"1\" shuffle=\"false\">" + NL +
			"<prompt></prompt>" + NL +
			"</choiceInteraction>" + NL +
			"</itemBody>" + NL +
			"</assessmentItem>" + NL +
			"</jaxbXML>";
	}

	private static String getMatchSequenceTemplate() {
		return "<MatchSequence>" + NL +
			"<assessmentItem xmlns=\"http://www.imsglobal.org/xsd/imsqti_v2p0\" xmlns:ns3=\"http://www.w3.org/1998/Math/MathML\" xmlns:ns2=\"http://www.w3.org/1999/xlink\" timeDependent=\"false\" adaptive=\"false\">" + NL +
			"<responseDeclaration identifier=\"MATCH_SEQUENCE\">" + NL +
			"<correctResponse></correctResponse>" + NL +
			"<mapping defaultValue=\"0.0\">" + NL +
			"<mapEntry mappedValue=\"1.0\" mapKey=\"gapTextType\"/>" + NL +
			"</mapping>" + NL +
			"</responseDeclaration>" + NL +
			"<itemBody>" + NL +
			"<gapMatchInteraction hasInlineFeedback=\"true\" responseIdentifier=\"MATCH_SEQUENCE\" shuffle=\"false\" ordered=\"false\">" + NL +
			"<prompt></prompt>" + NL +
			"</gapMatchInteraction>" + NL +
			"</itemBody>" + NL +
			"</assessmentItem>" + NL +
			"</MatchSequence>";
	}

	private static String getHtmlTemplate() {
		return "<html>" + NL + "<head>" + NL + "</head>" + NL + "<body>" + NL + "</body>" + NL + "</html>";
	}

	private static String getFillinTemplate() {
		return "<assessmentItem xmlns=\"http://www.imsglobal.org/xsd/imsqti_v2p0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.imsglobal.org/xsd/imsqti_v2p0 imsqti_v2p0.xsd\" identifier=\"FILLIN\" adaptive=\"false\" timeDependent=\"false\">" + NL +
			"<outcomeDeclaration identifier=\"SCORE\" cardinality=\"single\" baseType=\"float\"/>" + NL +
			"<itemBody>" + NL +
			"</itemBody>" + NL +
			"<responseProcessing template=\"http://www.imsglobal.org/question/qti_v2p0/rptemplates/map_response\"/>" + NL +
			"</assessmentItem>";
	}

	private static String getBrainstormTemplate() {
		return "<Brainstorm title=\"\" isGated=\"true\" displayName=\"0\" isRichTextEditorAllowed=\"true\" isPollEnded=\"false\" isInstantPollActive=\"false\">" + NL +
			"<assessmentItem xmlns=\"http://www.imsglobal.org/xsd/imsqti_v2p0\" xmlns:ns3=\"http://www.w3.org/1998/Math/MathML\" xmlns:ns2=\"http://www.w3.org/1999/xlink\" timeDependent=\"false\" adaptive=\"false\">" + NL +
			"<itemBody>" + NL +
			"<extendedTextInteraction responseIdentifier=\"BRAINSTORM\" expectedLines=\"0\">" + NL +
			"<prompt></prompt>" + NL +
			"</extendedTextInteraction>" + NL +
			"</itemBody>" + NL +
			"</assessmentItem>" + NL +
			"<cannedResponses>" + NL +
			"</cannedResponses>" + NL +
			"</Brainstorm>";
	}
	
	private static String getGlueTemplate(){
		return "<Glue>" + NL + "<prompt></prompt>" + NL + "<children></children>" + NL + "</Glue>";
	}
}
