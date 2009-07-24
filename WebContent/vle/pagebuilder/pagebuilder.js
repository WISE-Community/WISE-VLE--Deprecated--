/**
 * Copyright (c) 2009 Regents of the University of California (Regents). Created
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
 *
 * @author: patrick lawler
 */
var pageBuilder = {
	pages: {
		fillin: function(doc){
			var centered = createElement(doc, 'div', {id: "centeredDiv"});
			var questionCount = createElement(doc, 'div', {id: "questionCountBox", 'class': "BG7"});
			var reminder = createElement(doc, 'div', {'class': "instructionsReminder"});
			reminder.innerHTML = "For instructions click <a href=\"node/fillin/FillBlankInfoBox.html\" onclick=\"popUp(this.href,'console',450,720);return false;\" target=\"_blank\">&nbsp;&nbsp;&nbsp;&nbsp;</a>";
			var questionCount = createElement(doc, 'div', {id: "questionCountBox", 'class': "BG7"});
			var reminder = createElement(doc, 'table', {'class': "instructionsReminder"});
			var trInstruct = createElement(doc, 'tr');
			var td1Instruct = createElement(doc, 'td');
			var td2Instruct = createElement(doc, 'td');
			var td1Div = createElement(doc, 'div', {id: "helpIcon"});
			
			var table = createElement(doc, 'table', {id: "questionTable"});
			var tr = createElement(doc, 'tr');
			var td2 = createElement(doc, 'td', {id: "questionType"});
		
			td2.innerHTML = 'Fill In The Blank';
		
			tr.appendChild(td2);
			table.appendChild(tr);
		
			var d = createElement(doc, 'div');
			var promptDiv = createElement(doc, 'div', {'class': "color1 introPhrase"});
			promptDiv.innerHTML = 'Fill each blank with the correct word or short phrase.';
		
			d.appendChild(promptDiv);
		
			var currentFillP = createElement(doc, 'div', {id: "currentFillBlankParagraph"});
			var leftCol = createElement(doc, 'div', {id: "leftColumn", 'class': "BG8"});
			var noninteractive = createElement(doc, 'div', {id: "nonInteractiveDiv"});
			var interactive = createElement(doc, 'div', {id: "interactiveDiv"});
			var rightCol = createElement(doc, 'div', {id: "rightColumn", 'class': "BG2"});
			rightCol.innerHTML = "<img src=\"images/fill_blanks.png\" alt=\"Robot Art Fill the Blanks\" width=\"100\" height=\"250\" border=\"0\" />";

			leftCol.appendChild(noninteractive);
			leftCol.appendChild(interactive);
		
			currentFillP.appendChild(leftCol);
			currentFillP.appendChild(rightCol);
		
			var clear = createElement(doc, 'div', {id: 'clearBoth'});
			var buttonDiv = createElement(doc, 'div', {id: "buttonDiv"});
			var table2 = createElement(doc, 'table', {id: "buttonTable"});
			var tr2 = createElement(doc, 'tr');
			var buttTd = createElement(doc, 'td');
			var buttTd2 = createElement(doc, 'td');
			var buttTd3 = createElement(doc, 'td');
			var feedbackDiv = createElement(doc, 'div', {id: "feedbackDiv"});
		
			buttTd.innerHTML = "<a href=\"#\" id=\"checkAnswerButton\" onClick=\"javascript:checkAnswer();\" >Check Answer</a>";
			buttTd2.innerHTML = "<a href=\"#\" id=\"tryAgainButton\" onClick=\"javascript:tryAgain();\" >Try Again</a>";
			buttTd3.innerHTML = "<a href=\"#\" id=\"nextButton\" onClick=\"javascript:next();\" >Next Blank</a>";
		
			tr2.appendChild(buttTd);
			tr2.appendChild(buttTd2);
			tr2.appendChild(buttTd3);
		
			table2.appendChild(tr2);
			buttonDiv.appendChild(table2);
		
			questionCount.appendChild(reminder);
			questionCount.appendChild(table);
			reminder.appendChild(trInstruct);
			trInstruct.appendChild(td1Instruct);
			trInstruct.appendChild(td2Instruct);
            td1Instruct.appendChild(td1Div);
            td1Div.innerHTML = "<a href=\"./node/fillin/FillBlankInfoBox.html\" onclick=\"popUp(this.href,'console',800,800);return false;\" target=\"_blank\">&nbsp&nbsp&nbsp</a>";
            td2Instruct.innerHTML = "<a id=\"helpTextLink\" href=\"./node/fillin/FillBlankInfoBox.html\" onclick=\"popUp(this.href,'console',800,800);return false;\" target=\"_blank\">instructions</a>";
			centered.appendChild(questionCount);
			centered.appendChild(d);
			centered.appendChild(currentFillP);
			centered.appendChild(clear);
			centered.appendChild(buttonDiv);
			centered.appendChild(feedbackDiv);
			doc.getElementsByTagName('body')[0].appendChild(centered);
		},
		multiplechoice: function(doc){
			var centered = createElement(doc, 'div', {id: "centeredDiv"});
			var questionCount = createElement(doc, 'div', {id: 'questionCountBox', 'class': 'bg7'});
			var table = createElement(doc, 'table', {'class': 'instructionsReminder'});
			var tbody = createElement(doc, 'tbody');
			var tr = createElement(doc, 'tr');
			var td1 = createElement(doc, 'td');
			var td2 = createElement(doc, 'td');
			var helpDiv = createElement(doc, 'div', {id: 'helpIcon'});
			var a = createElement(doc, 'a', {href: 'node/multiplechoice/MultipleChoiceInfoBox.html', onclick: "popUp(this.href,'console',800,800);return false;", target: '_blank'});
			var a2 = createElement(doc, 'a', {id: 'helpTextLink', href: 'node/multiplechoice/MultipleChoiceInfoBox.html', onclick: "popUp(this.href,'console',800,800);return false;", target: '_blank'});
			var qTableDiv = createElement(doc, 'div', {id: 'questionTable'});
			var qTypeDiv = createElement(doc, 'div', {id: 'questionType'});
			
			doc.getElementsByTagName('body')[0].appendChild(centered);

			centered.appendChild(questionCount);
			questionCount.appendChild(table);
			table.appendChild(tbody);
			tbody.appendChild(tr);
			tr.appendChild(td1);
			tr.appendChild(td2);
			td1.appendChild(helpDiv);
			helpDiv.appendChild(a);
			a.innerHTML = '&nbsp&nbsp&nbsp';
			td2.appendChild(a2);
			a2.innerHTML = 'instructions';
			questionCount.appendChild(qTableDiv);
			qTableDiv.appendChild(qTypeDiv);
			qTypeDiv.innerHTML = 'Multiple Choice';
			
			var currentQDiv = createElement(doc, 'div', {id: 'currentQuestionBox'});
			var leftCDiv = createElement(doc, 'div', {id: 'leftColumn', 'class': 'bg8'});
			var rightCDiv = createElement(doc, 'div', {id: 'rightColumn', 'class': 'bg2'});
			var clear = createElement(doc, 'div', {id: 'clearBoth'});
			var statusDiv = createElement(doc, 'div', {id: 'statusMessages'});
			var buttonDiv = createElement(doc, 'div', {id: 'buttonDiv'});
			
			centered.appendChild(currentQDiv);
			currentQDiv.appendChild(leftCDiv);
			currentQDiv.appendChild(rightCDiv);
			currentQDiv.appendChild(clear);
			currentQDiv.appendChild(statusDiv);
			currentQDiv.appendChild(buttonDiv);
			
			var labelDiv = createElement(doc, 'div', {'class': 'itemLabel color1'});
			var promptDiv = createElement(doc, 'div', {id: 'promptDiv'});
			var answersDiv = createElement(doc, 'div', {'class': 'itemLabel color1'});
			var radioDiv = createElement(doc, 'div', {id: 'radiobuttondiv'});
			var feedbackDiv = createElement(doc, 'div', {id: 'feedbackdiv'});
			
			leftCDiv.appendChild(labelDiv);
			leftCDiv.appendChild(promptDiv);
			leftCDiv.appendChild(answersDiv);
			leftCDiv.appendChild(radioDiv);
			leftCDiv.appendChild(feedbackDiv);
			
			labelDiv.innerHTML = 'question';
			promptDiv.innerHTML = 'Prompt goes here. This text will automatically be replaced by actual prompt.';
			answersDiv.innerHTML = 'answers';
			
			var img = createElement(doc, 'img', {src: 'images/robots/multi_choice.png', alt: 'Robot Art Open Response', width: '100', height: '250', border: '0'});
			var numAttemptsDiv = createElement(doc, 'div', {id: 'numberAttemptsDiv'});
			var lastAttemptDiv = createElement(doc, 'div', {id: 'lastAttemptDiv'});
			
			rightCDiv.appendChild(img);
			statusDiv.appendChild(numAttemptsDiv);
			statusDiv.appendChild(lastAttemptDiv);
			
			var table2 = createElement(doc, 'table', {id: 'buttonTable'});
			var tbody2 = createElement(doc, 'tbody');
			var tr2 = createElement(doc, 'tr');
			var td3 = createElement(doc, 'td');
			var td4 = createElement(doc, 'td');
			var a1 = createElement(doc, 'a', {href: "#", id: "checkAnswerButton", onclick: "javascript:checkAnswer();"});
			var a2 = createElement(doc, 'a', {href: "#", id: "tryAgainButton", onclick: "javascript:tryAgain();", 'class': "disabledLink"});
			var a1Text = doc.createTextNode('Check Answer');
			var a2Text = doc.createTextNode('Try Again');
			
			buttonDiv.appendChild(table2);
			table2.appendChild(tbody2);
			tbody2.appendChild(tr2);
			tr2.appendChild(td3);
			tr2.appendChild(td4);
			td3.appendChild(a1);
			td4.appendChild(a2);
			a1.appendChild(a1Text);
			a2.appendChild(a2Text);
		},
		brainstorm: function(doc){
			var parent = doc.getElementsByTagName('body')[0];
			var frameDiv = createElement(doc, 'div', {id: 'frameDiv'});
			parent.appendChild(frameDiv);
	
			var frame = createElement(doc, 'iframe', {id: 'brainstormFrame', name: 'brainstormFrame', width: '100%', height: '100%', frameborder: '0'});		
			frameDiv.appendChild(frame);
		},
		brainlite: function(doc){
			var parent = doc.getElementsByTagName('body')[0];
			parent.setAttribute('class', "yui-skin-sam");
			
			var mainDiv = createElement(doc, 'div', {id: 'main'});
			var qCountDiv = createElement(doc, 'div', {id: 'questionCountBox', 'class': 'bg3'});
			var iTable = createElement(doc, 'table', {'class': 'instructionsReminder'});
			var tr = createElement(doc, 'tr');
			var td1 = createElement(doc, 'td');
			var td2 = createElement(doc, 'td');
			var td1Div = createElement(doc, 'div', {id: 'helpIcon'});
			var qTableDiv = createElement(doc, 'div', {id: 'questionTable'});
			var qTypeDiv = createElement(doc, 'div', {id: 'questionType'});
			
			parent.appendChild(mainDiv);
			mainDiv.appendChild(qCountDiv);
			qCountDiv.appendChild(iTable);
			qCountDiv.appendChild(qTableDiv);
			iTable.appendChild(tr);
			tr.appendChild(td1);
			tr.appendChild(td2);
			td1.appendChild(td1Div);
			td1Div.innerHTML = '<a href="node/brainstorm/BrainstormLiteInfoBox.html" onclick="popUp(this.href,\'console\',800,800);return false;" target="_blank">&nbsp&nbsp&nbsp</a>';
			td2.innerHTML = '<a id="helpTextLink" href="node/brainstorm/BrainstormLiteInfoBox.html" onclick="popUp(this.href,\'console\',800,800);return false;" target="_blank">instructions</a>';
			qTableDiv.appendChild(qTypeDiv);
			qTypeDiv.innerHTML = 'Student Brainstorm: Self-Guided';
			
			var qPromptDiv = createElement(doc, 'div', {id: "questionPrompt"});
			var qResponseDiv = createElement(doc, 'div', {id: 'studentResponseDiv', 'class': 'header'});
			var otherRDiv = createElement(doc, 'div', {'class': 'header2'});
			var responses = createElement(doc, 'div', {id: 'responses'});
			var responseDiv = createElement(doc, 'div', {'class': "header1"});
			var text = createElement(doc, 'textarea', {id: 'studentResponse', rows: '5', cols: '80'});
			var butt = createElement(doc, 'input', {type: 'button', id: 'button', value: 'save', onclick: 'save()'});
			var msgDiv = createElement(doc, 'div', {id: 'saveMsg'});
			
			mainDiv.appendChild(qPromptDiv);
			mainDiv.appendChild(qResponseDiv);
			mainDiv.appendChild(createBreak());
			mainDiv.appendChild(otherRDiv);
			mainDiv.appendChild(responses);
			qResponseDiv.appendChild(createBreak());
			qResponseDiv.appendChild(responseDiv);
			qResponseDiv.appendChild(text);
			qResponseDiv.appendChild(butt);
			qResponseDiv.appendChild(msgDiv);
		},
		brainfull: function(doc){
			var parent = doc.getElementsByTagName('body')[0];
			parent.setAttribute('class', "yui-skin-sam");
			
			var mainDiv = createElement(doc, 'div', {id: 'main'});
			var titleDiv = createElement(doc, 'div', {id: 'brain_title'});
			var par = createElement(doc, 'p');
			var qDiv = createElement(doc, 'div', {id: 'questionPrompt'});
			var rDiv = createElement(doc, 'div', {id: 'studentResponseDiv'});
			var rText = doc.createTextNode('Other Student Responses:');
			var responsesDiv = createElement(doc, 'div', {id: 'responses'});
			
			parent.appendChild(mainDiv);
			mainDiv.appendChild(titleDiv);
			mainDiv.appendChild(par);
			mainDiv.appendChild(qDiv);
			mainDiv.appendChild(rDiv);
			mainDiv.appendChild(createBreak());
			mainDiv.appendChild(rText);
			mainDiv.appendChild(createBreak());
			mainDiv.appendChild(responsesDiv);
			
			titleDiv.innerHTML = 'Student Brainstorm: Server Based';
			par.innerHTML = 'Read the brainstorm topic below, then write your response in the blank box.<br/>Click <em>Save</em> to save your work and review responses from other students.';
			
			var text = doc.createTextNode('My Response:');
			var tArea = createElement(doc, 'textarea', {id: 'studentResponse', cols: '80', rows: '5'});
			var inP = createElement(doc, 'input', {id: 'butt', type: 'button', value: 'save', onclick: 'save()'});
			var saveDiv = createElement(doc, 'div', {id: 'saveMsg'});
			
			rDiv.appendChild(createBreak());
			rDiv.appendChild(text);
			rDiv.appendChild(createBreak());
			rDiv.appendChild(tArea);
			rDiv.appendChild(inP);
			rDiv.appendChild(saveDiv);
		}
	},
	count: 0,
	fun: null,
	build: function(doc, type, fun){
		this.count = 0;
		this.fun = fun;
		if (arguments.length > 4) {
			this.contentbaseurl = arguments[4];
		}
		if(this.pages[type]){
			if(doc){
				this._createHTML(doc);
				this._copyright(doc);
				var scriptloader = createElement(doc, 'script', {type: 'text/javascript', src: "util/scriptloader.js"});
				doc.getElementsByTagName('head')[0].appendChild(scriptloader);
				this.pages[type](doc);
				//console.log(doc.implementation);
				//var nDom = doc.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
				//nDom.documentElement.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:lang', 'en');
				
				if(doc.addEventListener){
					doc.addEventListener("DOMContentLoaded", function(){pageBuilder.listener();}, false);
				} else {//pray that this works, it's ie
					this.listener();
				};
			} else {
				notificationManager.notify('Given document is undefined.', 3);
			};
		} else {
			notificationManager.notify('Cannot build page of type: ' + type + ', this type is unknown.', 3);
		};
	},
	listener: function(){
		this.count ++; 
		if(this.count==2 && this.fun){
			this.fun();
		};
	},
	_createHTML: function(doc){
		while(doc.firstChild){
			doc.removeChild(doc.firstChild);
		};
		
		var h = createElement(doc, 'html');
		var he = createElement(doc, 'head');
		var b = createElement(doc, 'body');
		
		doc.appendChild(h);
		h.appendChild(he);
		h.appendChild(b);
	},
	_copyright: function(doc){
		var copyright = doc.createComment("\n" +
 			" Copyright (c) 2009 Regents of the University of California (Regents). Created\n" +
 			" by TELS, Graduate School of Education, University of California at Berkeley.\n" +
 			" \n" +
 			" This software is distributed under the GNU Lesser General Public License, v2.\n" +
 			" \n" +
 			" Permission is hereby granted, without written agreement and without license\n" +
 			" or royalty fees, to use, copy, modify, and distribute this software and its\n" +
 			" documentation for any purpose, provided that the above copyright notice and\n" +
 			" the following two paragraphs appear in all copies of this software.\n" +
 			" \n" +
 			" REGENTS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO,\n" +
 			" THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR\n" +
 			" PURPOSE. THE SOFTWAREAND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED\n" +
 			" HEREUNDER IS PROVIDED \"AS IS\". REGENTS HAS NO OBLIGATION TO PROVIDE\n" +
 			" MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.\n" +
 			" \n" +
 			" IN NO EVENT SHALL REGENTS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT,\n" +
 			" SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS,\n" +
 			" ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF\n" +
 			" REGENTS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n" +
 			" */\n");
 		doc.getElementsByTagName('html')[0].insertBefore(copyright, doc.getElementsByTagName('head')[0]);
	}
};

//used to notify scriptloader that this script has finished loading
if(scriptloader){
	scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/pagebuilder/pagebuilder.js");
};