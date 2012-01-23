/**
 * 
 */
package vle.domain.webservice.crater;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * Controller for using the CRater scoring servlet via HTTP
 * 
 * @author hirokiterashima
 * @author geoffreykwan
 */
public class CRaterHttpClient extends HttpClient {

	
	/**
	 * Handles POSTing a CRater Request to the CRater Servlet and returns the 
	 * CRater response string.
	 * 
	 * @param cRaterUrl
	 * @param cRaterClientId
	 * @param itemId
	 * @param responseId
	 * @param studentData
	 * @return responseBody as a String, or null if there was an error during the request to CRater.
	 */
	public static String post(String cRaterUrl, String cRaterClientId, String itemId, String responseId, String studentData) {
		String responseString = null;
		
		if(cRaterUrl != null) {
			HttpClient client = new HttpClient();

			// Create a method instance.
			PostMethod method = new PostMethod(cRaterUrl);

			// Provide custom retry handler is necessary
			method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, 
					new DefaultHttpMethodRetryHandler(3, false));

			String bodyData = "<crater-request includeRNS='N'><client id='" + cRaterClientId + "'/><items><item id='" + itemId + "'>"
						+"<responses><response id='" + responseId + "'><![CDATA["+studentData+"]]></response></responses></item></items></crater-request>";
			System.out.println("crater request bodyData:" + bodyData);
			try {
				method.setRequestEntity(new StringRequestEntity(bodyData, "text/xml", "utf8"));
			} catch (UnsupportedEncodingException e1) {
				e1.printStackTrace();
			}
			
			byte[] responseBody = null;
			try {
				// Execute the method.
				int statusCode = client.executeMethod(method);

				if (statusCode != HttpStatus.SC_OK) {
					System.err.println("Method failed: " + method.getStatusLine());
				}

				// Read the response body.
				responseBody = method.getResponseBody();

				// Deal with the response.
				// Use caution: ensure correct character encoding and is not binary data
			} catch (HttpException e) {
				System.err.println("Fatal protocol violation: " + e.getMessage());
				e.printStackTrace();
			} catch (IOException e) {
				System.err.println("Fatal transport error: " + e.getMessage());
				e.printStackTrace();
			} finally {
				// Release the connection.
				method.releaseConnection();
			}  
			
			if (responseBody != null) {
				responseString = new String(responseBody);
			}			
		}
		
		return responseString;
	}
	
	/**
	 * Gets and Returns the Score from the CRater response XML string,
	 * or -1 if it does not exist.
	 * @param cRaterResponseXML response XML from the CRater. Looks like this:
	 * <crater-results>
	 *   <tracking id="1013701"/>
	 *   <client id="WISETEST"/>
	 *   <items>
	 *     <item id="Photo_Sun">
	 *     <responses>
	 *       <response id="testID" score="4" concepts="1,2,3,4,5"/>
	 *     </responses>
	 *   </item>
	 * </items>
	 * 
	 * @return integer score returned from the CRater. In the case above, this mehtod will return 4.
	 */
	public static int getScore(String cRaterResponseXML) {
		try {
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db;
			db = dbf.newDocumentBuilder();
			Document doc = db.parse(new ByteArrayInputStream(cRaterResponseXML.getBytes()));
			NodeList responseList = doc.getElementsByTagName("response");
			Node response = responseList.item(0);
			String score = response.getAttributes().getNamedItem("score").getNodeValue();
			return Integer.valueOf(score);
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return -1;
	}
}
