package vle;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.Vector;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet for handling POSTed journal data
 * @author geoffreykwan
 */
public class VLEPostJournalData extends VLEJournalServlet {

	private static final long serialVersionUID = 1L;
	
	public void doPost(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException {
        createConnection();
        postData(request, response);
        shutdown();
	}
	
	public void doGet(HttpServletRequest request,
			HttpServletResponse response) {
        createConnection();
        postData(request, response);
        shutdown();
	}

    private static void createTable()
    {
        try
        {
            stmt = conn.createStatement();
            stmt.execute("create table journaldata (id bigint(11) not null auto_increment, workgroupId bigint(11) default '0', journalPageId bigint(11) default '0', deleted boolean default false, pageCreatedTime timestamp NOT NULL default '0000-00-00 00:00:00', pageLastEditedTime timestamp NOT NULL default CURRENT_TIMESTAMP, location int, nodeId varchar(20), data longtext not null, primary key(id));");
            stmt.close();
        }
        catch (SQLException sqlExcept)
        {
            sqlExcept.printStackTrace();
        }
    }
    
    /**
     * Takes in data for a journal page and inserts it into the db
     * @param request
     * @param response
     */
    private static void postData(HttpServletRequest request,
			HttpServletResponse response) {
    	//get the journal page data
    	String workgroupId = request.getParameter("workgroupId");
    	String journalPageId = request.getParameter("journalPageId");
    	String data = request.getParameter("data");
    	String delete = request.getParameter("delete");
    	String nodeId = request.getParameter("nodeId");
    	
    	try {
			stmt = conn.createStatement();
		} catch (SQLException e) {
			e.printStackTrace();
		}
    	
		if(workgroupId != null && journalPageId != null && delete != null) {
			//delete was passed as an argument so we will set the delete flag to true for this journal page
			String updateStmt = "update journaldata set deleted=true where workgroupid=" + workgroupId + " and journalpageid=" + journalPageId;
			debugPrint(updateStmt);
			try {
				stmt.execute(updateStmt);
				return;
			} catch (SQLException e) {
				e.printStackTrace();
			}
		} else if(workgroupId == null || data == null) {
			//insufficient arguments
    		response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    		return;
    	} else {
    		//we will create a new row in the db and then return that new journal page
    		debugPrint(data);
    		
    		//need to check if journalPageId was passed
    		if(journalPageId == null) {
    			//if no id was given, we will just use the next available id
    			journalPageId = getNextJournalPageId(workgroupId);
    		}
    		
    		if(nodeId == null) {
    			nodeId = "";
    		}
    		
    		/*
    		 * get the time the first revision was created, all revisions of a
    		 * journal page will have the same creation time
    		 */
    		String pageCreatedTime = getPageCreatedTime(workgroupId, journalPageId);
    		
    		//set the creation time
    		if(pageCreatedTime == null) {
    			/*
    			 * there were no previous page revisions so this is a new page 
    			 * and will get a new timestamp of now()
    			 */
    			pageCreatedTime = "now()";
    		} else {
    			//use the timestamp from the first revision
    			pageCreatedTime = "'" + pageCreatedTime + "'";
    		}
    		
    		//the insert statement to put the revision into the db
    		String insertStmt = "insert into journaldata(workgroupId, journalPageId, data, nodeId, pageCreatedTime) values(" + workgroupId + ", " + journalPageId + ", '" + data + "', '" + nodeId + "', " + pageCreatedTime + ")";
    		debugPrint(insertStmt);
    		
    		try {
    			//run the insert statement
				stmt.execute(insertStmt);
				
				//retrieve the row that we just inserted
				String dateFormat = "%a, %b %e, %Y %r";
				String selectQuery = "select id, workgroupId, journalPageId, deleted, date_format(pageCreatedTime, '" + dateFormat + "'), date_format(pageLastEditedTime, '" + dateFormat + "'), location, nodeId, data from journaldata where workgroupid=" + workgroupId + " and journalpageid=" + journalPageId + " and deleted=false order by id desc limit 1";
				debugPrint(selectQuery);
				
				//run the select query
				ResultSet results = stmt.executeQuery(selectQuery);
				
				//create the journal xml for the row
				String journalXML = createJournalXML(results);
				
				//write the journal xml to the response
				response.getWriter().write(journalXML);
				
				results.close();
			} catch (SQLException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
    	}
		
		try {
			stmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
    }
    
    /**
     * Get the timestamp for the first revision of the page
     * @param workgroupId the id of the workgroup
     * @param journalPageId the id of the journal page
     * @return the timestamp of the first revision of the page or empty string
     * 		if there are no previous revisions
     */
    private static String getPageCreatedTime(String workgroupId, String journalPageId) {
    	String createdTime = "";
    	
    	//select the earliest timestamp of all the revisions of this page
    	String selectStmt = "select min(pageCreatedTime) from journaldata where workgroupId=" + workgroupId + " and journalPageId=" + journalPageId;
    	debugPrint(selectStmt);
		
		try {
			//run the select query
			ResultSet results = stmt.executeQuery(selectStmt);
			if(results.first()) {
				//get the timestamp value
				createdTime = results.getString(1);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}

		//return the timestamp value
		return createdTime;
    }
    
}
