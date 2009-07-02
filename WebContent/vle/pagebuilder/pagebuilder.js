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
			var questionCount = createElement(doc, 'div', {id: "questionCountBox", class: "BG7"});
			var reminder = createElement(doc, 'div', {class: "instructionsReminder"});
			reminder.innerHTML = "For instructions click <a href=\"node/fillin/FillBlankInfoBox.html\" onclick=\"popUp(this.href,'console',450,720);return false;\" target=\"_blank\">&nbsp;&nbsp;&nbsp;&nbsp;</a>";
			var table = createElement(doc, 'table', {id: "questionTable"});
			var tr = createElement(doc, 'tr');
			var td1 = createElement(doc, 'td', {id: "questionNumber"});
			var td2 = createElement(doc, 'td', {id: "questionType"});
			var td3 = createElement(doc, 'td', {id: "questionHelp"});
		
			td1.innerHTML = 'Question X of Y:';
			td2.innerHTML = 'Fill In The Blank';
			td3.innerHTML = "<a href=\"node/fillin/FillBlankInfoBox.html\" onclick=\"popUp(this.href,'console',700,720);return false;\" target=\"_blank\">&nbsp;&nbsp;&nbsp;</a>";
		
			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			table.appendChild(tr);
		
			var d = createElement(doc, 'div');
			var promptDiv = createElement(doc, 'div', {class: "Color1"});
			promptDiv.innerHTML = 'Fill each blank with the correct word or short phrase.';
		
			d.appendChild(promptDiv);
		
			var currentFillP = createElement(doc, 'div', {id: "currentFillBlankParagraph"});
			var leftCol = createElement(doc, 'div', {id: "leftColumn", class: "BG8"});
			var noninteractive = createElement(doc, 'div', {id: "nonInteractiveDiv"});
			var interactive = createElement(doc, 'div', {id: "interactiveDiv"});
			var rightCol = createElement(doc, 'div', {id: "rightColumn", class: "BG2"});
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
			var questionCount = createElement(doc, 'div', {id: 'questionCountBox', class: 'bg7'});
			var table = createElement(doc, 'table', {class: 'instructionsReminder'});
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
			table.appendChild(tr);
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
			var leftCDiv = createElement(doc, 'div', {id: 'leftColumn', class: 'bg8'});
			var rightCDiv = createElement(doc, 'div', {id: 'rightColumn', class: 'bg2'});
			var clear = createElement(doc, 'div', {id: 'clearBoth'});
			var statusDiv = createElement(doc, 'div', {id: 'statusMessages'});
			var buttonDiv = createElement(doc, 'div', {id: 'buttonDiv'});
			
			centered.appendChild(currentQDiv);
			currentQDiv.appendChild(leftCDiv);
			currentQDiv.appendChild(rightCDiv);
			currentQDiv.appendChild(clear);
			currentQDiv.appendChild(statusDiv);
			currentQDiv.appendChild(buttonDiv);
			
			var labelDiv = createElement(doc, 'div', {class: 'itemLabel color1'});
			var promptDiv = createElement(doc, 'div', {id: 'promptDiv'});
			var answersDiv = createElement(doc, 'div', {class: 'itemLabel color1'});
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
			var tr2 = createElement(doc, 'tr');
			var td3 = createElement(doc, 'td');
			var td4 = createElement(doc, 'td');
			var a1 = createElement(doc, 'a', {href: "#", id: "checkAnswerButton", onclick: "javascript:checkAnswer();"});
			var a2 = createElement(doc, 'a', {href: "#", id: "tryAgainButton", onclick: "javascript:tryAgain();", class: "disabledLink"});
			var a1Text = doc.createTextNode('Check Answer');
			var a2Text = doc.createTextNode('Try Again');
			
			buttonDiv.appendChild(table2);
			table2.appendChild(tr2);
			tr2.appendChild(td3);
			tr2.appendChild(td4);
			td3.appendChild(a1);
			td4.appendChild(a2);
			a1.appendChild(a1Text);
			a2.appendChild(a2Text);
		}
	},
	build: function(doc, type, fun, obj){
		if(this.pages[type]){
			if(doc){
				this.cleanHtml(doc);
				this.pages[type](doc);
				doc.addEventListener("DOMContentLoaded", fun, false);
				if(obj){ //called from vle, otherwise, probably called from authoring tool
					doc.addEventListener("DOMContentLoaded",function(){obj.renderComplete=true;vle.eventManager.fire('nodeRenderComplete_' + obj.id);}, false);
				};
			} else {
				notificationManager.notify('Given document is undefined.', 3);
			};
		} else {
			notificationManager.notify('Cannot build page of type: ' + type + ', this type is unknown.', 3);
		};
	},
	strip: function(doc){
		while(doc.firstChild){
			doc.removeChild(doc.firstChild);
		};
	},
	emptyStructure: function(doc){
		var html = createElement(doc, 'html');
		var head = createElement(doc, 'head');
		var body = createElement(doc, 'body');
		
		doc.appendChild(html);
		html.appendChild(head);
		html.appendChild(body);
	},
	cleanHtml: function(doc){
		this.strip(doc);
		this.emptyStructure(doc);
		this.copyright(doc);
		var scriptloader = createElement(doc, 'script', {type: 'text/javascript', src: "util/scriptloader.js"});
		doc.getElementsByTagName('head')[0].appendChild(scriptloader);
	},
	copyright: function(doc){
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
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/pagebuilder/pagebuilder.js");