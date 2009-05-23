package utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;
import java.text.SimpleDateFormat;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.output.DeferredFileOutputStream;

/**
 * Servlet implementation class for Servlet: FileManager
 * 
 * @author patrick lawler
 */
 public class FileManager extends HttpServlet implements Servlet{
   static final long serialVersionUID = 1L;
   
   private final static String COMMAND = "command";
   
   private final static String PARAM1 = "param1";
   
   private final static String PARAM2 = "param2";
   
   private final static String PARAM3 = "param3";
   
   private final static String PARAM4 = "param4";
   
   private final static String PROJECT_PATHS = "projectPaths";
   
   private final static String ZIP_DIRECTORY = "zipped_projects";
   
	/* (non-Java-doc)
	 * @see javax.servlet.http.HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String command = request.getParameter(COMMAND);
		if(command.equals("retrieveFile")){
			response.getWriter().write(this.retrieveFile(request));
		}
	}  	
	
	/* (non-Java-doc)
	 * @see javax.servlet.http.HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String command = request.getParameter(COMMAND);
		
		if(command!=null){
			if(command.equals("createProject")){
				response.getWriter().write(this.createProject(request));
			} else if(command.equals("projectList")){
				response.getWriter().write(this.getProjectList(request));
			} else if(command.equals("retrieveFile")){
				response.getWriter().write(this.retrieveFile(request));
			} else if(command.equals("updateFile")){
				response.getWriter().write(this.updateFile(request));
			} else if(command.equals("createNode")){
				response.getWriter().write(this.createNode(request));
			} else if(command.equals("createSequence")){
				response.getWriter().write(this.createSequence(request));
			} else if(command.equals("exportProject")){
				this.exportProject(request, response);
			} else {
				throw new ServletException("This servlet does not understand this command: " + command);
			}
		} else if(ServletFileUpload.isMultipartContent(request)){
			response.setContentType("text/html; charset=UTF-8");
			try{
				this.importProject(request);
				response.getWriter().print("success");
			} catch(Exception e){
				e.printStackTrace();
				response.getWriter().write("failed");
			}
		} else {
			throw new ServletException("No command has been provided, unable to do anything.");
		}
	}

	/**
	 * Returns true if project directory exists, if not returns whether the
	 * creation of the project directory was successful
	 * 
	 * @return boolean
	 */
	private boolean ensureProjectPath(File file){
		if(file.isDirectory()){
			return true;
		} else {
			return file.mkdir();
		}
	}
	
	/**
	 * Given the request for this post, extracts the new Project name, creates
	 * the project folder and creates a template project file in that folder
	 * 
	 * @param request
	 * @return int
	 * @throws IOException
	 */
	private String createProject(HttpServletRequest request) throws IOException{
		String name = request.getParameter(PARAM1);
		String path = request.getParameter(PARAM2);
		File parent = new File(path);
		
		this.ensureProjectPath(parent);
		
		File newDir = this.createNewprojectPath(parent);
		
		File newFile = new File(newDir, name + ".project.xml");
		boolean	success = newFile.createNewFile();
		if(success){
			FileOutputStream fop = new FileOutputStream(newFile);
			fop.write(Template.getProjectTemplate().getBytes());
			fop.flush();
			fop.close();
			return newFile.getCanonicalPath();
		} else {
			throw new IOException("Unable to create project file.");
		}
	}
	
	/**
	 * Given a parent directory, attempts to generate and return
	 * a unique project directory
	 * 
	 * @param parent
	 * @return
	 */
	private File createNewprojectPath(File parent){
		Integer counter = 1;
		
		while(true){
			File tryMe = new File(parent, String.valueOf(counter));
			if(!tryMe.exists()){
				tryMe.mkdir();
				return tryMe;
			}
			counter++;
		}
	}
	
	/**
	 * Returns a '|' delimited String of all projects, returns an empty
	 * String if no projects exist
	 * 
	 * @return String
	 */
	private String getProjectList(HttpServletRequest request)throws IOException{
		String rawPaths = request.getParameter(PROJECT_PATHS);
		String[] paths = rawPaths.split("~");
		List<String> visited = new ArrayList<String>();
		List<String> projects = new ArrayList<String>();
		String projectList = "";
		
		if(paths!=null && paths.length>0){
			for(int p=0;p<paths.length;p++){
				File f = new File(paths[p]);
				getProjectFiles(f, projects, visited);
			}
			for(int q=0;q<projects.size();q++){
				projectList += projects.get(q);
				if(q!=projects.size()-1){
					projectList += "|";
				}
			}
			return projectList;
		} else {
			return "";
		}
	}
	
	/**
	 * Given a file, a List of projects, and a list of visited directories, 
	 * recursively adds any project files to the list of projects that are
	 * in any subdirectories (n-deep).
	 * 
	 * @param f
	 * @param projects
	 * @param visited
	 * @throws IOException
	 */
	private void getProjectFiles(File f, List<String> projects, List<String> visited) throws IOException{
		if(f.exists() && (!visited(visited, f.getCanonicalPath()))){
			if(f.isFile()){
				if(f.getName().contains(".project.xml")){
					projects.add(f.getAbsolutePath());
				} else {
					return;
				}
			} else if(f.isDirectory()){
				visited.add(f.getCanonicalPath());
				String children[] = f.list();
				for(int y=0;y<children.length;y++){
					File child = new File(f, children[y]);
					getProjectFiles(child, projects, visited);
				}
			} else {
				throw new IOException("Not a file and not a directory. I don't know what it is.");
			}
		} else {
			return;
		}
	}
	
	/**
	 * Given a list of visited paths and a path, returns true
	 * if the path has been visited, false otherwise
	 * 
	 * @param visited
	 * @param path
	 * @return
	 */
	private boolean visited(List<String> visited, String path){
		if(visited.contains(path)){
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Given the request for this post, extracts the project path and the 
	 * filename, reads the data from the file and returns a string of the data
	 * 
	 * @param request
	 * @return String
	 * @throws IOException
	 */
	private String retrieveFile(HttpServletRequest request) throws IOException{
		String path = request.getParameter(PARAM1);

		File file = new File(path);
		if(file.exists()){
			String out = "";
			String current;
			BufferedReader br = new BufferedReader(new FileReader(file));
			while((current = br.readLine()) != null){
				out += current + Template.NL;
			}
			br.close();
			return out;
		} else {
			throw new FileNotFoundException("Unable to locate file: " + file.getAbsolutePath());
		}
	}
	
	/**
	 * Given a request, extracts the project name, file name and the data
	 * to be written to the file and writes it to the specified file
	 * 
	 * @param request
	 * @return String
	 * @throws IOException
	 */
	private String updateFile(HttpServletRequest request) throws IOException{
		String projectPath = request.getParameter(PARAM1);
		String filename = request.getParameter(PARAM2);
		String data = this.decode(request.getParameter(PARAM3));
		
		File dir = new File(projectPath);
		if(dir.exists()){
			File file = new File(dir, filename);
			if(file.exists()){
				BufferedWriter bw = new BufferedWriter(new FileWriter(file));
				String[] pieces = data.split("\n");
				for(int y = 0;y < pieces.length;y++){
					bw.write(pieces[y]);
					bw.newLine();
				}
				bw.close();
				return "success";
			} else {
				throw new FileNotFoundException("Unable to locate file");
			}
		} else {
			throw new IOException("Unable to find the project");
		}
	}
	
	/**
	 * Decodes a UTF-8 string 
	 * 
	 * @param text
	 * @return String
	 */
	private String decode(String text) {
		URLDecoder decoder = new URLDecoder();
		try{
			return decoder.decode(text, "utf-8");
		} catch(Exception e){
			System.out.println(e.getMessage());
			return null;
		} 
	}
	
	/**
	 * Given a request, extracts the project name, the file name
	 * and the node type to be created and creates the node and
	 * adds it to the associated project.
	 * 
	 * @param request
	 * @return String
	 */
	private String createNode(HttpServletRequest request) throws IOException, ServletException{
		String projectPath = request.getParameter(PARAM1);
		String filename = request.getParameter(PARAM2);
		String title = request.getParameter(PARAM3);
		String type = request.getParameter(PARAM4);
		
		File dir = new File(projectPath).getParentFile();
		if(dir.exists()){
			File file = new File(dir, filename + this.getExtension(type));
			if(file.exists()){
				return "exists";
			} else {
				boolean success = file.createNewFile();
				if(success){
					FileOutputStream fop = new FileOutputStream(file);
					fop.write(Template.getNodeTemplate(type).getBytes());
					fop.flush();
					fop.close();
					File parent = new File(projectPath);
					if(this.addNodeToProject(parent, Template.getProjectNodeTemplate(type, filename, title, this.getExtension(type)))){
						return "success";
					} else {
						return "nodeNotProject";
					}
				} else {
					throw new IOException("Unable to create new Node");
				}
			}
		} else {
			throw new IOException("Unable to find project");
		}
	}
	
	/**
	 * Given a project name and a node template, returns true if it
	 * inserts the template as the last node, otherwise returns false.
	 * Throws IOException if the project file does not exist.
	 * 
	 * @param project
	 * @param template
	 * @return
	 * @throws IOException
	 */
	private boolean addNodeToProject(File parent, String template) throws IOException{
		if(parent.exists()){
			int line = 1;
			BufferedReader br = new BufferedReader(new FileReader(parent));
			String current = br.readLine();
			while(current != null){
				current = current.trim();
				if(current.equals("</nodes>")){
					br.close();
					return this.insertTemplateBefore(parent, template, line);
				}
				current = br.readLine();
				line ++;
			}
			br.close();
			return false;
		} else {
			throw new IOException("Unable to locate project file");
		}
	}
	
	/**
	 * Given a node type, returns the associated file extension, if the
	 * node type is unknown, throws Servlet Exception
	 * 
	 * @param type
	 * @return String
	 * @throws ServletException
	 */
	private String getExtension(String type) throws ServletException {
		if(type.equals("BrainstormNode")){
			return ".bs";
		} else if(type.equals("FillinNode")){
			return ".fi";
		} else if(type.equals("HtmlNode")){
			return ".html";
		} else if(type.equals("MatchSequenceNode")){
			return ".ms";
		} else if(type.equals("MultipleChoiceNode")){
			return ".mc";
		} else if(type.equals("NoteNode") || type.equals("JournalEntryNode") || type.equals("OpenResponseNode")){
			return ".or";
		} else if(type.equals("OutsideUrlNode")){
			return ".ou";
		} else if(type.equals("GlueNode")){
			return ".glue";
		} else {
			throw new ServletException("I don't know how to handle nodes of type: " + type);
		}
	}
	
	/**
	 * Given a file, a String Template and the line number, inserts the template before the
	 * number specified in the file. Returns true if successful, otherwise, throws Exception
	 * 
	 * @param file
	 * @param template
	 * @param line
	 * @return boolean
	 * @throws IOException
	 */
	private boolean insertTemplateBefore(File file, String template, int line) throws IOException{
		File parent = file.getParentFile();
		File temp = new File(parent, "project.tmp");
		boolean success = temp.createNewFile();
		
		if(success){
			BufferedReader br = new BufferedReader(new FileReader(file));
			BufferedWriter bw = new BufferedWriter(new FileWriter(temp));
			String current = "";
			int z=1;
			while((current = br.readLine()) != null){
				if(z==line){
					bw.write(template);
					bw.newLine();
				}
				bw.write(current);
				bw.newLine();
				z++;
			}
			bw.flush();
			bw.close();
			br.close();
			if(file.delete()){
				temp.renameTo(file);
				temp.delete();
				return true;
			} else {;
				temp.delete();
				throw new IOException("Problems deleting old project file and copying temporary file.");
			}
		} else {
			throw new IOException("Unable to create temporary file on system");
		}
	}
	
	/**
	 * Given a request, extracts the project name and sequence name and creates
	 * a new sequence with the given name in the project. Throws IOException if
	 * the file could not be found and if the servlet is unable to insert it into
	 * the project file.
	 * 
	 * @param request
	 * @return String
	 * @throws IOException
	 */
	private String createSequence(HttpServletRequest request) throws IOException{
		String projectPath = request.getParameter(PARAM1);
		String name = request.getParameter(PARAM2);
				
		File file = new File(projectPath);
		
		if(file.exists()){
			int line = 1;
			BufferedReader br = new BufferedReader(new FileReader(file));
			String current = br.readLine();
			while(current != null){
				current = current.trim();
				if(current.equals("</sequences>")){
					br.close();
					if(this.insertTemplateBefore(file, Template.getSequenceTemplate(name), line)){
						return "success";
					} else {
						throw new IOException("Unable to insert sequence in project file.");
					}
				}
				current = br.readLine();
				line ++;
			}
			br.close();
			throw new IOException("Could not insert new sequence in project file.");
		} else {
			throw new IOException("Unable to locate project file.");
		}
	}
	
	private void exportProject(HttpServletRequest request, HttpServletResponse response) throws IOException{
		SimpleDateFormat sdf = new SimpleDateFormat("MM.dd.yyyy_kk.mm.ss");
		ensureZipDir();
		File zipParent = new File(ZIP_DIRECTORY);
		File dir = new File(request.getParameter(PARAM1));
		File zipFile = new File(zipParent, dir.getName() + "_" + sdf.format(new Date()) + ".zip");
		
		if(dir.exists()){
			if(dir.isDirectory()){
				if(zipFile.exists()){
					zipFile.delete();
				}
				ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFile));
				this.zipIt(dir, zos);
				zos.close();
				
				response.setContentType("application/zip");
				response.setContentLength((int)zipFile.length());
				response.setHeader("Content-Disposition", "attachment; filename=\"" + zipFile.getName() + "\"");
				
				byte[] buffer = new byte[4096];
				DataInputStream dis = new DataInputStream(new FileInputStream(zipFile));
				ServletOutputStream sop = response.getOutputStream();
				int length = 0;
				while((dis != null) && (length = dis.read(buffer)) != -1){
					sop.write(buffer, 0, length);
				}
			} else {
				throw new IOException("The specified location is not a directory.");
			}
		} else {
			throw new IOException("Unable to find the project directory.");
		}
	}
	
	private void zipIt(File dir, ZipOutputStream zos) throws IOException{
		String list[] = dir.list();
		byte buffer[] = new byte[4096];
		int in = 0;
		
		for(int x=0;x<list.length;x++){
			File file = new File(dir, list[x]);
			File zipNamed = new File(dir.getName(), list[x]);
			FileInputStream fis = new FileInputStream(file);
			ZipEntry entry = new ZipEntry(zipNamed.getPath());
			zos.putNextEntry(entry);
			while((in = fis.read(buffer)) != - 1){
				zos.write(buffer, 0, in);
			}
			fis.close();
		}
	}
	
	private boolean ensureZipDir(){
		File file = new File(ZIP_DIRECTORY);
		if(file.isDirectory()){
			return true;
		} else {
			return file.mkdir();
		}
	}
	
	private boolean importProject(HttpServletRequest request) throws IOException, FileUploadException, Exception{
		DiskFileItemFactory factory = new DiskFileItemFactory();
		ServletFileUpload upload = new ServletFileUpload(factory);
		File temp = new File("temp");
		
		if(!temp.exists()){
			temp.mkdir();
		};
		
		factory.setRepository(temp);
		if(ServletFileUpload.isMultipartContent(request)){
			List items = upload.parseRequest(request);
			Iterator iter = items.iterator();
			String path = null;
			while(iter.hasNext()){
				FileItem item = (FileItem) iter.next();
				if(item.isFormField()){
					if(item.getFieldName().equals(PARAM1)){
						path = item.getString();
					} else {
						throw new IOException("I was not expecting field name of: " + item.getFieldName());
					}
				} else {
					if(path!=null){
						File parentDir = new File(path);
						if(!parentDir.exists()){
							parentDir.mkdir();
						}
						File newFile = new File(temp, "tempZipFile");
						item.write(newFile);
						ZipFile zf = new ZipFile(newFile);
						Enumeration entries = zf.entries();
						
						while(entries.hasMoreElements()){
							ZipEntry entry = (ZipEntry)entries.nextElement();
							if(!entry.isDirectory()){
								BufferedInputStream bis = new BufferedInputStream(zf.getInputStream(entry));
							    int size;
							    byte[] buffer = new byte[4096];
							    File file = new File(path, entry.getName());
							    if(file.getParentFile()!=null && !file.getParentFile().exists()){
							    	file.getParentFile().mkdirs();
							    }
							    BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file), buffer.length);
							    while ((size = bis.read(buffer, 0, buffer.length)) != -1) {
							    	bos.write(buffer, 0, size);
							    }
							    bos.flush();
							    bos.close();
							    bis.close();
							} else {
								File file = new File(path, entry.getName());
								if(!file.exists()){
									file.mkdir();
								}
							}
						}
					} else {
						throw new IOException("Unable to determine path to unzip files to");
					}
				}
			}
			return true;
		} else {
			throw new IOException("The request does not contain multipart content, cannot upload file.");
		}
	}
}