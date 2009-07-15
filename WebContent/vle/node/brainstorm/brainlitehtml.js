var brainstorm = parent.brainstorm;
var richTextEditor;
            
            function save(){
            	if(richTextEditor != null) {
					/*
					 * if we are using the rich text editor, save the text written
					 * in the rich text editor to the textarea
					 */ 
					richTextEditor.saveHTML();
				}	
	
                brainstorm.save(document);
            };
            
            function afterScriptsLoaded(){
                brainstorm.brainliteLoaded(document);
                
                //check if we want to use the rich text editor
				if(brainstorm.isRichTextEditorAllowed == "true") {
					/*
					 * create the editor by passing in the id of the textarea
					 * that we will be replacing with the rich text editor
					 */
					richTextEditor = new YAHOO.widget.Editor('studentResponse', {
						height: '200px',
						width: '600px',
						dompath: true,
						animate: true
					});
					//render and display the rich text editor
					richTextEditor.render();
				}
            };
            
//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/brainstorm/brainlitehtml.js");