<MatchSequence>
		<assessmentItem xmlns='http://www.imsglobal.org/xsd/imsqti_v2p0' xmlns:ns3='http://www.w3.org/1998/Math/MathML' xmlns:ns2='http://www.w3.org/1999/xlink' timeDependent='false' adaptive='false'>
			<responseDeclaration identifier='MATCH_ASSMT_1'>
				<correctResponse>
					<value isDefault="false" isCorrect="true" choiceIdentifier="line1" fieldIdentifier="lonelyBucket" order="1">This belongs here!</value>
					<value isDefault="false" isCorrect="true" choiceIdentifier="line2" fieldIdentifier="lonelyBucket" order="3">This belongs here!</value>
					<value isDefault="false" isCorrect="true" choiceIdentifier="line3" fieldIdentifier="lonelyBucket" order="0">This belongs here!</value>
					<value isDefault="false" isCorrect="true" choiceIdentifier="line4" fieldIdentifier="lonelyBucket" order="2">This belongs here!</value>
					<value isDefault="false" isCorrect="true" choiceIdentifier="line5" fieldIdentifier="lonelyBucket" order="4">This belongs here!</value>
					<value isDefault='true' isCorrect='false' fieldIdentifier='lonelyBucket'>&lt;html&gt;&lt;body  class='feedback'&gt;this is the defualt&lt;/body&gt;&lt;/html&gt;</value>
				</correctResponse>
				<mapping defaultValue='0.0'>
					<mapEntry mappedValue='1.0' mapKey='gapTextType' />
				</mapping>
			</responseDeclaration>
			<itemBody>
				<gapMatchInteraction hasInlineFeedback='true' responseIdentifier='MATCH_ASSMT_1' shuffle='true' ordered="true">
					<prompt>&lt;html&gt;&lt;body  class='matchprompt' style='font-size:14px; font-family:Verdana, Arial,Helvetica; width:550px; margin:20px 0 10px 0 ; color:#0000FF; line-height:120%;'&gt;Construct a method doMath that takes a number and returns that number multiplied by 3 and then incremented by 1. Place your answers in the box on the right in the correct order, then click 'Check Answers' to check your choices.&lt;/body&gt;&lt;/html&gt;</prompt>
					<gapText identifier='line1' matchMax='1'>&lt;html&gt;&lt;body class='choice'&gt;num=num*3;&lt;/body&gt;&lt;/html&gt;</gapText>
					<gapText identifier='line2' matchMax='1'>&lt;html&gt;&lt;body class='choice'&gt;return num;&lt;/body&gt;&lt;/html&gt;</gapText>
					<gapText identifier='line3' matchMax='1'>&lt;html&gt;&lt;body class='choice'&gt;public int doMath(int num)&lt;/body&gt;&lt;/html&gt;</gapText>
					<gapText identifier='line4' matchMax='1'>&lt;html&gt;&lt;body class='choice'&gt;num=num+1;&lt;/body&gt;&lt;/html&gt;</gapText>
					<gapText identifier='line5' matchMax='1'>&lt;html&gt;&lt;body class='choice'&gt;}&lt;/body&gt;&lt;/html&gt;</gapText>
					<gapMultiple identifier='lonelyBucket' ordinal='false' numberOfEntries='0'>&lt;html&gt;&lt;body class='slot'&gt;Place the lines on the left in the correct order:&lt;/body&gt;&lt;/html&gt;</gapMultiple>
				</gapMatchInteraction>
			</itemBody>
		</assessmentItem>
		<customCheck><![CDATA[var correctOrder = new Array('line3', 'line1', 'line4', 'line2', 'line5');
var almostCorrectOrder = new Array('line3', 'line4', 'line1', 'line2', 'line5');
var bucket = state.buckets[0];
var choices = bucket.choices;


function CustomFeedback(){
	this.success = null;
	this.message = null;
};

CustomFeedback.prototype.setSuccess = function(success){
	this.success = success;
};

CustomFeedback.prototype.getSuccess = function(){
	return this.success;
};

CustomFeedback.prototype.setMessage = function(message){
	this.message = message;
};

CustomFeedback.prototype.getMessage = function(){
	return this.message;
};

var feedback = new CustomFeedback();

var correct = function(order, choices){
	var same = true;
	for(var index=0;index<choices.length;index++){
		if(choices[index].identifier!=order[index]){
			same=false;
		};
	};
	return same;
};

var oneOff = function(order, choices){
	for(var index=0;index<choices.length;index++){
		var copiedOrder = order.slice();
		var copiedChoices = choices.slice();
		copiedOrder.splice(copiedOrder.indexOf(choices[index].identifier),1);
		copiedChoices.splice(copiedChoices.indexOf(choices[index]), 1);
		if(correct(copiedOrder, copiedChoices)){
			return true;
		};
	};
	return false;
};

var rightAndWrong = function(order, choices){
	var numCorrect = 0;
	var numWrong = 0;
	for(var index=0;index<choices.length;index++){
		if(choices[index].identifier==order[index]){
			numCorrect += 1;		
		} else {
			numWrong += 1;
		};
	};
	var correctString = '<br>';
	var incorrrectString = '';
	if(numCorrect==1){
		correctString = correctString + '1 is in the correct place and ';
	} else {
		correctString = correctString + numCorrect + ' are in the correct places and ';
	};
	if(numWrong==1){
		incorrectString = '1 is in the wrong place.';
	} else {
		incorrectString = numWrong + ' are in wrong places.';
	};
 
	return correctString + incorrectString;
};

if (state.sourceBucket.choices.length > 0){
	feedback.setSuccess(false);
	feedback.setMessage('Each choice on the left must be used!');
	return feedback;
} else {
	if(correct(correctOrder, choices)){
		feedback.setSuccess(true);
		feedback.setMessage('Good job!' + rightAndWrong(correctOrder, choices));
		return feedback;
	} else if(correct(almostCorrectOrder, choices)){
		feedback.setSuccess(false);
		feedback.setMessage('incorrect, this will actually return a bigger number' + rightAndWrong(correctOrder, choices));
		return feedback;
	} else if(oneOff(correctOrder, choices)){
		feedback.setSuccess(false);
		feedback.setMessage('Only one item needs to be moved');
		return feedback;
	} else {
		feedback.setSuccess(false);
		feedback.setMessage('incorrect, try again' + rightAndWrong(correctOrder, choices));
		return feedback;
	};
};]]></customCheck>
</MatchSequence>