<jaxbXML><assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p0" xmlns:ns3="http://www.w3.org/1998/Math/MathML" xmlns:ns2="http://www.w3.org/1999/xlink" timeDependent="false" adaptive="false">
                      <responseDeclaration identifier="CHOICE_SELF_CHECK_ID">
                        <correctResponse interpretation="choice 3" />
                      </responseDeclaration>
                      <itemBody>
                        <choiceInteraction hasInlineFeedback="true" responseIdentifier="CHOICE_SELF_CHECK_ID" maxChoices="1" shuffle="false">
                          <prompt>&lt;html&gt;&lt;body&gt;
&lt;p&gt;What would the value of the virtual pet's &lt;tt&gt;hunger&lt;/tt&gt;
variable be if, immediately after the pet was created, she invoked
the following behaviors in order:&lt;/p&gt;
&lt;ol&gt;
&lt;li&gt;Sleep!!&lt;/li&gt;
&lt;li&gt;Feed&lt;/li&gt;
&lt;li&gt;Feed&lt;/li&gt;
&lt;li&gt;Exercise&lt;/li&gt;
&lt;li&gt;Sleep&lt;/li&gt;
&lt;li&gt;Exercise&lt;/li&gt;
&lt;/ol&gt;
&lt;/body&gt;&lt;/html&gt;</prompt>
                          <simpleChoice fixed="true" identifier="choice 1"><feedbackInline identifier="choice 1" showHide="show" >&lt;br&gt;Nope. The first statement after each method changes the hunger variable.</feedbackInline>0</simpleChoice>
                          <simpleChoice fixed="true" identifier="choice 2"><feedbackInline identifier="choice 2" showHide="show">Nope, this isn't right</feedbackInline>3</simpleChoice>
                          <simpleChoice fixed="true" identifier="choice 3"><feedbackInline identifier="choice 3" showHide="show" >&lt;br&gt;Yes!</feedbackInline>7</simpleChoice>
                          <simpleChoice fixed="true" identifier="choice 4"><feedbackInline identifier="choice 4" showHide="show" >&lt;br&gt;Nope. Remember, when the feed behavior is invoked, hunger either gets set to 0 or is reduced by 10.</feedbackInline>8</simpleChoice>
                          <simpleChoice fixed="true" identifier="SIMPLE_CHOICE_ID5">We cannot know.</simpleChoice>
                        </choiceInteraction>
                      </itemBody>
  </assessmentItem></jaxbXML>