
BEGIN;
CREATE TABLE IF NOT EXISTS "Role" (
	role_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	role_name VARCHAR(100) NOT NULL
);
INSERT INTO Role VALUES(1,'Researcher');
INSERT INTO Role VALUES(2,'SuperAdmin');
INSERT INTO Role VALUES(3,'Admin');
INSERT INTO Role VALUES(4,'TA/Instructor');
INSERT INTO Role VALUES(5,'Student');
CREATE TABLE IF NOT EXISTS "Rubric" (
	rubric_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	rubric_name VARCHAR(100), 
	rubric_desc VARCHAR(100)
);
INSERT INTO Rubric VALUES(1,'Critical Thinking','Forming an argument or reaching a conclusion supported with evidence by evaluating, analyzing, and/or synthesizing relevant information.');
INSERT INTO Rubric VALUES(2,'Formal Communication','Conveying information and understanding to an intended audience through a formal communication effort*, either written or oral.');
INSERT INTO Rubric VALUES(3,'Informal Processing','Evaluating, interpreting, and manipulating or transforming information.');
INSERT INTO Rubric VALUES(4,'Interpersonal Communication','Exchanging information and idea through speaking, listening, responding, and non-verbal behaviors.');
INSERT INTO Rubric VALUES(5,'Management','Planning, organizing, coordinating, and monitoring one''s own and others'' efforts to accomplish a goal.');
INSERT INTO Rubric VALUES(6,'Problem Solving','Analyzing a complex problem or situation, developing a viable strategy to address it, and executing that strategy (when appropriate).');
INSERT INTO Rubric VALUES(7,'Teamwork','Interacting with others and buliding on each other''s individual strengths and skills, working toward a common goal.');
CREATE TABLE IF NOT EXISTS "Category" (
	category_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	rubric_id INTEGER NOT NULL, 
	name VARCHAR(30) NOT NULL, 
	ratings INTEGER NOT NULL, 
	FOREIGN KEY(rubric_id) REFERENCES "Rubric" (rubric_id)
);
INSERT INTO Category VALUES(1,1,'Identifying the Goal',0);
INSERT INTO Category VALUES(2,1,'Evaluating',0);
INSERT INTO Category VALUES(3,1,'Analyzing',0);
INSERT INTO Category VALUES(4,1,'Sythesizing',0);
INSERT INTO Category VALUES(5,1,'Forming Arguments (Structure)',0);
INSERT INTO Category VALUES(6,1,'Forming Arguments (Validity)',0);
INSERT INTO Category VALUES(7,2,'Intent',0);
INSERT INTO Category VALUES(8,2,'Audience',0);
INSERT INTO Category VALUES(9,2,'Organization',0);
INSERT INTO Category VALUES(10,2,'Visual Representations',0);
INSERT INTO Category VALUES(11,2,'Format and Style',0);
INSERT INTO Category VALUES(12,2,'Mechanics (written words)',0);
INSERT INTO Category VALUES(13,2,'Delivery (oral)',0);
INSERT INTO Category VALUES(14,3,'Evaluating',0);
INSERT INTO Category VALUES(15,3,'Interpreting',0);
INSERT INTO Category VALUES(16,3,'Manipulating or Transforming (Extent)',0);
INSERT INTO Category VALUES(17,3,'Manipulating or Transforming (Accuracy)',0);
INSERT INTO Category VALUES(18,4,'Speaking',0);
INSERT INTO Category VALUES(19,4,'Listening',0);
INSERT INTO Category VALUES(20,4,'Responding',0);
INSERT INTO Category VALUES(21,5,'Planning',0);
INSERT INTO Category VALUES(22,5,'Organizing',0);
INSERT INTO Category VALUES(23,5,'Coordinating',0);
INSERT INTO Category VALUES(24,5,'Overseeing',0);
INSERT INTO Category VALUES(25,6,'Analyzing the situation',0);
INSERT INTO Category VALUES(26,6,'Identifying',0);
INSERT INTO Category VALUES(27,6,'Strategizing',0);
INSERT INTO Category VALUES(28,6,'Validating',0);
INSERT INTO Category VALUES(29,6,'Executing',0);
INSERT INTO Category VALUES(30,7,'Interacting',0);
INSERT INTO Category VALUES(31,7,'Contributing',0);
INSERT INTO Category VALUES(32,7,'Progressing',0);
INSERT INTO Category VALUES(33,7,'Building Community',0);
CREATE TABLE IF NOT EXISTS "Users" (
	user_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	first_name VARCHAR(30) NOT NULL, 
	last_name VARCHAR(30) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	password VARCHAR(80) NOT NULL, 
	role_id INTEGER NOT NULL, 
	lms_id INTEGER, 
	consent BOOLEAN, 
	owner_id INTEGER, 
	UNIQUE (email), 
	FOREIGN KEY(role_id) REFERENCES "Role" (role_id), 
	UNIQUE (lms_id), 
	FOREIGN KEY(owner_id) REFERENCES "Users" (user_id)
);
INSERT INTO Users VALUES(1,'Super Admin','User','superadminuser93@skillbuilder.edu','pbkdf2:sha256:600000$dZu8aNqdumuKOGLM$e17d597fba3f77184d38a32c08eb79b17eb5a437dcb203f9dd240f1770aa9eca',2,0,NULL,1);
CREATE TABLE IF NOT EXISTS "Course" (
	course_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	course_number VARCHAR(10) NOT NULL, 
	course_name VARCHAR(50) NOT NULL, 
	year INTEGER NOT NULL, 
	term VARCHAR(50) NOT NULL, 
	active BOOLEAN NOT NULL, 
	admin_id INTEGER NOT NULL, 
	use_tas BOOLEAN NOT NULL, 
	FOREIGN KEY(admin_id) REFERENCES "Users" (user_id)
);
INSERT INTO Course VALUES(1,'SAU001','Super Admin Course',2023,'Summer',1,1,1);
CREATE TABLE IF NOT EXISTS "ObservableCharacteristics" (
	oc_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	rubric_id INTEGER NOT NULL, 
	category_id INTEGER NOT NULL, 
	oc_text VARCHAR(10000) NOT NULL, 
	FOREIGN KEY(rubric_id) REFERENCES "Rubric" (rubric_id), 
	FOREIGN KEY(category_id) REFERENCES "Category" (category_id)
);
INSERT INTO ObservableCharacteristics VALUES(1,1,1,'Identified the question that needed to be answered or the situation that needed to be addressed');
INSERT INTO ObservableCharacteristics VALUES(2,1,1,'Identified any situational factors that may be important to addressing the question or situation');
INSERT INTO ObservableCharacteristics VALUES(3,1,1,'Identified the general types of data or information needed to address the question');
INSERT INTO ObservableCharacteristics VALUES(4,1,2,'Indicated what information is likely to be most relevant');
INSERT INTO ObservableCharacteristics VALUES(5,1,2,'Determined the reliability of the source of information');
INSERT INTO ObservableCharacteristics VALUES(6,1,2,'Determined the quality and accuracy of the information itself');
INSERT INTO ObservableCharacteristics VALUES(7,1,3,'Discussed information and explored possible meanings');
INSERT INTO ObservableCharacteristics VALUES(8,1,3,'Identified general trends or patterns in the data/information that could be used as evidence');
INSERT INTO ObservableCharacteristics VALUES(9,1,3,'Processed and/or transformed data/information to put it in forms that could be used as evidence');
INSERT INTO ObservableCharacteristics VALUES(10,1,4,'Identified the relationships between different pieces of information or concepts');
INSERT INTO ObservableCharacteristics VALUES(11,1,4,'Compared or contrasted what could be determined from different pieces of information');
INSERT INTO ObservableCharacteristics VALUES(12,1,4,'Combined multiple pieces of information or ideas in valid ways to generate a new insight ir conclusion');
INSERT INTO ObservableCharacteristics VALUES(13,1,5,'Stated the conclusion or the claim of the argument');
INSERT INTO ObservableCharacteristics VALUES(14,1,5,'Listed the evidence used to support the argument');
INSERT INTO ObservableCharacteristics VALUES(15,1,5,'Linked the claim/conclusion to the evidence with focused and organized reasoning');
INSERT INTO ObservableCharacteristics VALUES(16,1,5,'Linked the claim/conclusion to the evidence with focused and organized reasoning');
INSERT INTO ObservableCharacteristics VALUES(17,1,5,'Stated any qualifiers that limit the conditions for which the argument is true');
INSERT INTO ObservableCharacteristics VALUES(18,1,6,'The most relevant evidence was used appropriately to support the claim');
INSERT INTO ObservableCharacteristics VALUES(19,1,6,'Reasoning was logical and effectively connected the data to the claim');
INSERT INTO ObservableCharacteristics VALUES(20,1,6,'The argument was aligned with disciplinary/community concepts or practices');
INSERT INTO ObservableCharacteristics VALUES(21,1,6,'Considered alternative or counter claims');
INSERT INTO ObservableCharacteristics VALUES(22,1,6,'Considered evidence that could be used to refute or challenge the claim');
INSERT INTO ObservableCharacteristics VALUES(23,2,7,'Clearly stated what the audience should gain from the communication');
INSERT INTO ObservableCharacteristics VALUES(24,2,7,'Used each part of the communication to convey or support the main message');
INSERT INTO ObservableCharacteristics VALUES(25,2,7,'Concluded by summarizing what was to be learned');
INSERT INTO ObservableCharacteristics VALUES(26,2,8,'Communicated to the full range of the audience, including novices and those with expertise');
INSERT INTO ObservableCharacteristics VALUES(27,2,8,'Aligned the communication with the interests and background of the particular audience');
INSERT INTO ObservableCharacteristics VALUES(28,2,8,'Used vocabulary that aligned with the discipline and was understood by the audience');
INSERT INTO ObservableCharacteristics VALUES(29,2,9,'There was a clear story arc that moved the communication forward');
INSERT INTO ObservableCharacteristics VALUES(30,2,9,'Organizational cues and transitions clearly indicated the structure of the communication');
INSERT INTO ObservableCharacteristics VALUES(31,2,9,'Sequence of ideas flowed in an order that was easy to follow');
INSERT INTO ObservableCharacteristics VALUES(32,2,10,'Each figure conveyed a clear message');
INSERT INTO ObservableCharacteristics VALUES(33,2,10,'Details of the visual representation were easily interpreted by the audience');
INSERT INTO ObservableCharacteristics VALUES(34,2,10,'The use of the visual enhanced understanding by the audience');
INSERT INTO ObservableCharacteristics VALUES(35,2,11,'Stylistic elements were aesthetically pleasing and did not distract from the message');
INSERT INTO ObservableCharacteristics VALUES(36,2,11,'Stylistic elements were designed to make the communication accessbile to the audience (size, colors, contrasts, etc.)');
INSERT INTO ObservableCharacteristics VALUES(37,2,11,'The level of formality of the communication aligns with the setting, context, and purpose');
INSERT INTO ObservableCharacteristics VALUES(38,2,12,'Writing contained correct spelling, word choice, punctuation, and capitalization');
INSERT INTO ObservableCharacteristics VALUES(39,2,12,'All phrases and sentences were grammatically correct');
INSERT INTO ObservableCharacteristics VALUES(40,2,12,'All paragraphs (or slides) were well constructed around a central idea');
INSERT INTO ObservableCharacteristics VALUES(41,2,12,'All figures and tables were called out in the narrative, and sources were correctly cited');
INSERT INTO ObservableCharacteristics VALUES(42,2,13,'Spoke loudly and clearly with a tone that indicated confidence and interest in the subject');
INSERT INTO ObservableCharacteristics VALUES(43,2,13,'Vocal tone and pacing helped maintain audience interest');
INSERT INTO ObservableCharacteristics VALUES(44,2,13,'Gestures and visual cues further oriented the audience to focus on particular items or messages');
INSERT INTO ObservableCharacteristics VALUES(45,2,13,'Body language directed the delivery toward the audience and indicated the speaker was open to engagement');
INSERT INTO ObservableCharacteristics VALUES(46,3,14,'Established what needs to be accomplished with this information');
INSERT INTO ObservableCharacteristics VALUES(47,3,14,'Identified what information is provided in the materials');
INSERT INTO ObservableCharacteristics VALUES(48,3,14,'Indicated what information is relevant');
INSERT INTO ObservableCharacteristics VALUES(49,3,14,'Indicated what information is NOT relevant');
INSERT INTO ObservableCharacteristics VALUES(50,3,14,'Indicated why certain information is relevant or not');
INSERT INTO ObservableCharacteristics VALUES(51,3,15,'Labeled or assigned correct meaning to information (text, tables, symbols, diagrams)');
INSERT INTO ObservableCharacteristics VALUES(52,3,15,'Extracted specific details from information');
INSERT INTO ObservableCharacteristics VALUES(53,3,15,'Rephrased information in own words');
INSERT INTO ObservableCharacteristics VALUES(54,3,15,'Identified patterns in information and derived meaning from them');
INSERT INTO ObservableCharacteristics VALUES(55,3,16,'Determined what information needs to be converted to accomplish the task');
INSERT INTO ObservableCharacteristics VALUES(56,3,16,'Described the process used to generate the transformation');
INSERT INTO ObservableCharacteristics VALUES(57,3,16,'Converted all relevant information into a different representation of format');
INSERT INTO ObservableCharacteristics VALUES(58,3,17,'Conveyed the correct or intended meaning of the information in the new representation or format.');
INSERT INTO ObservableCharacteristics VALUES(59,3,17,'All relevant features of the original information/data are presented in the new representation of format');
INSERT INTO ObservableCharacteristics VALUES(60,3,17,'Performed the transformation without errors');
INSERT INTO ObservableCharacteristics VALUES(61,4,18,'Spoke clear and loudly enough for all team members to hear');
INSERT INTO ObservableCharacteristics VALUES(62,4,18,'Used a tone that invited other people to respond');
INSERT INTO ObservableCharacteristics VALUES(63,4,18,'Used language that was suitable for the listeners and context');
INSERT INTO ObservableCharacteristics VALUES(64,4,18,'Spoke for a reasonable length of time for the situation');
INSERT INTO ObservableCharacteristics VALUES(65,4,19,'Patiently listened without interrupting the speaker');
INSERT INTO ObservableCharacteristics VALUES(66,4,19,'Referenced others'' ideas to indicate listening and understanding');
INSERT INTO ObservableCharacteristics VALUES(67,4,19,'Presented nonverbal cues to indicate attentiveness');
INSERT INTO ObservableCharacteristics VALUES(68,4,19,'Avoided engagine in activities that diverted attention');
INSERT INTO ObservableCharacteristics VALUES(69,4,20,'Acknowledged other members for their ideas or contributions');
INSERT INTO ObservableCharacteristics VALUES(70,4,20,'Rephrased or referred to what other group members have said');
INSERT INTO ObservableCharacteristics VALUES(71,4,20,'Asked other group members to futher explain a concept');
INSERT INTO ObservableCharacteristics VALUES(72,4,20,'Elaborated or extended on someone else''s idea(s)');
INSERT INTO ObservableCharacteristics VALUES(73,5,21,'Generated a summary of the starting and ending points');
INSERT INTO ObservableCharacteristics VALUES(74,5,21,'Generated a sequence of steps or tasks to reach the desired goal');
INSERT INTO ObservableCharacteristics VALUES(75,5,21,'Discussed a timeline or time frame for completing project tasks');
INSERT INTO ObservableCharacteristics VALUES(76,5,21,'Decided on a strategy to share information, updates and progress with all team members');
INSERT INTO ObservableCharacteristics VALUES(77,5,22,'Decided upon the necessary resources and tools');
INSERT INTO ObservableCharacteristics VALUES(78,5,22,'Identified the availability of resources, tools or information');
INSERT INTO ObservableCharacteristics VALUES(79,5,22,'Gathered necessary information and tools');
INSERT INTO ObservableCharacteristics VALUES(80,5,23,'Determined if tasks need to be delegated or completed by the team as a whole');
INSERT INTO ObservableCharacteristics VALUES(81,5,23,'Tailored the tasks toward strengths and availability of team members');
INSERT INTO ObservableCharacteristics VALUES(82,5,23,'Assigned specific tasks and responsibilities to team members');
INSERT INTO ObservableCharacteristics VALUES(83,5,23,'Established effective communication strategies and productive interactions among team members');
INSERT INTO ObservableCharacteristics VALUES(84,5,24,'Reinforced responsibilities and refocused team members toward completing project tasks');
INSERT INTO ObservableCharacteristics VALUES(85,5,24,'Communicated status, next steps, and reiterated general plan to accomplish goals');
INSERT INTO ObservableCharacteristics VALUES(86,5,24,'Sought and valued input from team members and provided them with constructive feedback');
INSERT INTO ObservableCharacteristics VALUES(87,5,24,'Kept track of remaining materials, team and person hours');
INSERT INTO ObservableCharacteristics VALUES(88,5,24,'Updated or adapted the tasks or plans as needed');
INSERT INTO ObservableCharacteristics VALUES(89,6,25,'Described the problem that needed to be solved or the decisions that needed to be made');
INSERT INTO ObservableCharacteristics VALUES(90,6,25,'Listed complicating factors or constraints that may be important to consider when developing a solution');
INSERT INTO ObservableCharacteristics VALUES(91,6,25,'Identified the potential consequences to stakeholders or surrounding');
INSERT INTO ObservableCharacteristics VALUES(92,6,26,'Reviewed the organized the necessary information and resources');
INSERT INTO ObservableCharacteristics VALUES(93,6,26,'Evaluated which available information and resources are critical to solving the problem');
INSERT INTO ObservableCharacteristics VALUES(94,6,26,'Determined the limitations of the tools or information that was given or gathered');
INSERT INTO ObservableCharacteristics VALUES(95,6,26,'Identified reliable sources that may provide additional needed information, tools, or resources');
INSERT INTO ObservableCharacteristics VALUES(96,6,27,'Identified potential starting and ending points for the strategy');
INSERT INTO ObservableCharacteristics VALUES(97,6,27,'Determined general steps needed to get from starting point to ending point');
INSERT INTO ObservableCharacteristics VALUES(98,6,27,'Sequenced or mapped actions in a logical progression');
INSERT INTO ObservableCharacteristics VALUES(99,6,28,'Reviewed strategy with respect to the identified scope');
INSERT INTO ObservableCharacteristics VALUES(100,6,28,'Provided rationale as to how steps within the process were properly sequenced');
INSERT INTO ObservableCharacteristics VALUES(101,6,28,'Identified ways the process or stragey could be futher improved or optimized');
INSERT INTO ObservableCharacteristics VALUES(102,6,28,'Evaluated the practicality of the overall strategy');
INSERT INTO ObservableCharacteristics VALUES(103,6,29,'Used data and information correctly');
INSERT INTO ObservableCharacteristics VALUES(104,6,29,'Made assumptions about the use of data and information that are justifiable');
INSERT INTO ObservableCharacteristics VALUES(105,6,29,'Determined that each step is being done in the order and the manner that was planned.');
INSERT INTO ObservableCharacteristics VALUES(106,6,29,'Verified that each step in the process was providing the desired outcome.');
INSERT INTO ObservableCharacteristics VALUES(107,7,30,'All team members communicated ideas related to a common goal');
INSERT INTO ObservableCharacteristics VALUES(108,7,30,'Team members responded to each other verbally or nonverbally');
INSERT INTO ObservableCharacteristics VALUES(109,7,30,'Directed each other to tasks and information');
INSERT INTO ObservableCharacteristics VALUES(110,7,31,'Acknowledged the value of the statements of other team members');
INSERT INTO ObservableCharacteristics VALUES(111,7,31,'Invited other team members to participate in the conversation, particulary if they had not contributed in a while');
INSERT INTO ObservableCharacteristics VALUES(112,7,31,'Expanded on statements of other team members');
INSERT INTO ObservableCharacteristics VALUES(113,7,31,'Asked follow-up questions to clarify team members'' thoughts');
INSERT INTO ObservableCharacteristics VALUES(114,7,32,'Stayed on task, focused on the assignment with only brief interruptions');
INSERT INTO ObservableCharacteristics VALUES(115,7,32,'Refocused team members to make more effective progress towards the goal');
INSERT INTO ObservableCharacteristics VALUES(116,7,32,'Worked simultaneously as single unit on the common goal');
INSERT INTO ObservableCharacteristics VALUES(117,7,32,'Checked time to monitor progress on task.');
INSERT INTO ObservableCharacteristics VALUES(118,7,33,'Created a sense of belonging to the team for all team members');
INSERT INTO ObservableCharacteristics VALUES(119,7,33,'Acted as a single unit that did not break up into smaller, gragmented units for the entire task');
INSERT INTO ObservableCharacteristics VALUES(120,7,33,'Openly and respectfully discussed questions and disagreements between team members');
INSERT INTO ObservableCharacteristics VALUES(121,7,33,'Listened carefully to people, and gave weight and respect to their contributions');
INSERT INTO ObservableCharacteristics VALUES(122,7,33,'Welcomed and valued the individual identity and experiences of each team member');
CREATE TABLE IF NOT EXISTS "SuggestionsForImprovement" (
	sfi_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	rubric_id INTEGER NOT NULL, 
	category_id INTEGER NOT NULL, 
	sfi_text JSON NOT NULL, 
	FOREIGN KEY(rubric_id) REFERENCES "Rubric" (rubric_id), 
	FOREIGN KEY(category_id) REFERENCES "Category" (category_id)
);
INSERT INTO SuggestionsForImprovement VALUES(1,1,1,'"Review the instructions or general goal of the task."');
INSERT INTO SuggestionsForImprovement VALUES(2,1,1,'"Highlight or clearly state the question to be addressed or type of conclusion that must be reached."');
INSERT INTO SuggestionsForImprovement VALUES(3,1,1,'"List the factors (if any) that may limit the feasibility of some possible conclusions."');
INSERT INTO SuggestionsForImprovement VALUES(4,1,1,'"Write down the information you think is needed to address the situation."');
INSERT INTO SuggestionsForImprovement VALUES(5,1,2,'"Review provided material and circle, highlight, or otherwise indicate information that may be used as evidence in reaching a conclusion."');
INSERT INTO SuggestionsForImprovement VALUES(6,1,2,'"Write down the other information (prior knowledge) that might be useful to lead to/support a possible conclusion."');
INSERT INTO SuggestionsForImprovement VALUES(7,1,2,'"Set aside any information, patterns, or insights that seem less relevant to addressing the situation at hand."');
INSERT INTO SuggestionsForImprovement VALUES(8,1,2,'"Consider whether the information was obtained from a reliable source (textbook, literature, instructor, websites with credible authors)"');
INSERT INTO SuggestionsForImprovement VALUES(9,1,2,'"Determine the quality of the information and whether it is sufficient to answer the question."');
INSERT INTO SuggestionsForImprovement VALUES(10,1,3,'"Interpret and label key pieces of information in text, tables, graphs, diagrams."');
INSERT INTO SuggestionsForImprovement VALUES(11,1,3,'"State in your own words what information represents or means."');
INSERT INTO SuggestionsForImprovement VALUES(12,1,3,'"Identify general trends in information, and note any information that doesn''t fit the pattern."');
INSERT INTO SuggestionsForImprovement VALUES(13,1,3,'"Check your understanding of information with others and discuss any differences in understanding."');
INSERT INTO SuggestionsForImprovement VALUES(14,1,3,'"State how each piece of information, pattern, or insight can be used to reach a conclusion or support your claim."');
INSERT INTO SuggestionsForImprovement VALUES(15,1,4,'"Look for two or more pieces or types of information that can be connected and state how they can be related to each other."');
INSERT INTO SuggestionsForImprovement VALUES(16,1,4,'"Write out the aspects that are similar and different in various pieces of information."');
INSERT INTO SuggestionsForImprovement VALUES(17,1,4,'"Map out how the information and/or concepts can be combined to support an argument or reach a conclusion."');
INSERT INTO SuggestionsForImprovement VALUES(18,1,4,'"Write a statement that summarizes the integration of the information and conveys a new understanding."');
INSERT INTO SuggestionsForImprovement VALUES(19,1,4,'"List the ways in which synthesized information could be used as evidence."');
INSERT INTO SuggestionsForImprovement VALUES(20,1,4,'"Review the original goal - what question were you trying to answer?"');
INSERT INTO SuggestionsForImprovement VALUES(21,1,4,'"Clearly state your answer to the question (your claim or conclusion)."');
INSERT INTO SuggestionsForImprovement VALUES(22,1,4,'"Review the information you previously evaluated, analyzed and/or synthesized and decide what evidence supports your claim."');
INSERT INTO SuggestionsForImprovement VALUES(23,1,4,'"List each piece of evidence that you are using to support your argument."');
INSERT INTO SuggestionsForImprovement VALUES(24,1,4,'"Explain how each piece of information links to and supports your answer."');
INSERT INTO SuggestionsForImprovement VALUES(25,1,4,'"Make sure your answer includes the claim, information and reasoning."');
INSERT INTO SuggestionsForImprovement VALUES(26,1,4,'"Make sure the claim or conclusion answers the question."');
INSERT INTO SuggestionsForImprovement VALUES(27,1,5,'"Provide a clear statement that articulates why the evidence you chose leads to the claim or conclusion."');
INSERT INTO SuggestionsForImprovement VALUES(28,1,5,'"Check to make sure that your reasoning is consistent with what is accepted in the discipline or context."');
INSERT INTO SuggestionsForImprovement VALUES(29,1,5,'"Test your ideas with others, and ask them to judge the quality of the argument or indicate how the argument could be made more convincing."');
INSERT INTO SuggestionsForImprovement VALUES(30,1,5,'"Ask yourself (and others) if there is evidence or data that doesn''t suport your conclusion or might contradict your claim."');
INSERT INTO SuggestionsForImprovement VALUES(31,1,5,'"Consider if there are alternative explanations for the data you are considering."');
INSERT INTO SuggestionsForImprovement VALUES(32,2,6,'"Decide if your main purpose is to inform, to persuade, to argue, to summarize, to entertain, to inspire, etc."');
INSERT INTO SuggestionsForImprovement VALUES(33,2,6,'"Write out the intent of the communication you are creating and refer back to it as you generate your material."');
INSERT INTO SuggestionsForImprovement VALUES(34,2,6,'"Make sure the purpose of the communication is presented early to orient your audience to the focus of the communication."');
INSERT INTO SuggestionsForImprovement VALUES(35,2,6,'"Check that the focus of each segment is clearly linked to the main message or intent of the communication."');
INSERT INTO SuggestionsForImprovement VALUES(36,2,6,'"Summarize the main ideas to wrap up the presentation (refer back to the initial statement(s) of what was to be learned)."');
INSERT INTO SuggestionsForImprovement VALUES(37,2,7,'"Identify the range and level of expertise and interest your audience has for the topic and design your communication to have aspects that will engage all members of the audience."');
INSERT INTO SuggestionsForImprovement VALUES(38,2,7,'"Identify what the audience needs to know to understand the narrative."');
INSERT INTO SuggestionsForImprovement VALUES(39,2,7,'"Plan how you will interpret key data or details in a meaningful way for non-experts."');
INSERT INTO SuggestionsForImprovement VALUES(40,2,7,'"Only use jargon when it is understood readily by most members of your audience, and it makes the communication more effective and succinct."');
INSERT INTO SuggestionsForImprovement VALUES(41,2,7,'"Check that the vocabulary, sentence structure, and tone used in your communication is aligned with the level of your audience."');
INSERT INTO SuggestionsForImprovement VALUES(42,2,7,'"Collect feedback from others on drafts to make sure the core message of the communication is easily understood."');
INSERT INTO SuggestionsForImprovement VALUES(43,2,8,'"Consider the ''story'' that you want to tell. Ask yourself what''s the main message you want the audience to leave with."');
INSERT INTO SuggestionsForImprovement VALUES(44,2,8,'"Identify the critical points for the story (do this before you prepare the actual communication) and map out the key points."');
INSERT INTO SuggestionsForImprovement VALUES(45,2,8,'"Summarize sections before transitioning to the next topic."');
INSERT INTO SuggestionsForImprovement VALUES(46,2,8,'"Repeat key ideas to ensure the audience can follow the main idea."');
INSERT INTO SuggestionsForImprovement VALUES(47,2,8,'"Make sure that you introduce prerequisite information early in the communication."');
INSERT INTO SuggestionsForImprovement VALUES(48,2,8,'"Try more than one order for the topics, to see if overall flow is improved."');
INSERT INTO SuggestionsForImprovement VALUES(49,2,9,'"Plan what types of figures are needed to support the narrative - consider writing out a figure description before you construct it."');
INSERT INTO SuggestionsForImprovement VALUES(50,2,9,'"Avoid including unnecessary details that detract from the intended message."');
INSERT INTO SuggestionsForImprovement VALUES(51,2,9,'"Consider how many messages each visual is trying to convey and divide up if the complexity or density is overwhelming."');
INSERT INTO SuggestionsForImprovement VALUES(52,2,9,'"Be sure labels, text, and small details can be easily read."');
INSERT INTO SuggestionsForImprovement VALUES(53,2,9,'"Provide a caption that helps interpret the key aspects of the visual."');
INSERT INTO SuggestionsForImprovement VALUES(54,2,9,'"Seek feedback on visuals to gauge initial reaction and ease of interpretation."');
INSERT INTO SuggestionsForImprovement VALUES(55,2,10,'"Use titles (headers) and subtitles (subheaders) to orient the audience and help them follow the narrative."');
INSERT INTO SuggestionsForImprovement VALUES(56,2,10,'"Look at pages or slides as a whole for an easy-to-read layout, such as white space, headers, line spacing, etc."');
INSERT INTO SuggestionsForImprovement VALUES(57,2,10,'"Use emphases where needed to direct audience attention to important aspects."');
INSERT INTO SuggestionsForImprovement VALUES(58,2,10,'"Use colors to carefully highlight or call attention to key elements to enhance your narrative without distracting from your message."');
INSERT INTO SuggestionsForImprovement VALUES(59,2,10,'"Make sure that text, figures, and colors are readable and accessible for all."');
INSERT INTO SuggestionsForImprovement VALUES(60,2,10,'"Seek feedback to confirm that the language, tone, and style of your communication match the level of formality needed for your context and purpose."');
INSERT INTO SuggestionsForImprovement VALUES(61,2,11,'"Proofread your writing for spelling errors, punctuation, autocorrects, etc."');
INSERT INTO SuggestionsForImprovement VALUES(62,2,11,'"Review sentence structure for subject-verb agreement, consistent tense, run on sentences, and other structural problems."');
INSERT INTO SuggestionsForImprovement VALUES(63,2,11,'"Verify that items in lists are parallel."');
INSERT INTO SuggestionsForImprovement VALUES(64,2,11,'"List the themes of each paragraph (or slide).  If there are more than 2, consider starting a new paragraph (or slide)."');
INSERT INTO SuggestionsForImprovement VALUES(65,2,11,'"Confirm that each figure, table, etc has been numbered consecutively and has been called out and discussed further in the narrative."');
INSERT INTO SuggestionsForImprovement VALUES(66,2,11,'"Confirm that all work that has been published elsewhere or ideas/data that were not generated by the author(s) has been properly cited using appropriate conventions."');
INSERT INTO SuggestionsForImprovement VALUES(67,2,11,'"Ask someone else to review and provide feedback on your work."');
INSERT INTO SuggestionsForImprovement VALUES(68,2,12,'"Practice for others or record your talk; i. be sure that your voice can be heard, and your word pronunciations are clear. ii. listen for \u201cums\u201d, \u201clike\u201d, or other verbal tics/filler words that can detract from your message. iii. observe your natural body language, gestures, and stance in front of the audience to be sure that they express confidence and enhance your message."');
INSERT INTO SuggestionsForImprovement VALUES(69,2,12,'"Add variety to your speed or vocal tone to emphasize key points or transitions."');
INSERT INTO SuggestionsForImprovement VALUES(70,2,12,'"Try to communicate/engage as if telling a story or having a conversation with the audience."');
INSERT INTO SuggestionsForImprovement VALUES(71,2,12,'"Face the audience and do not look continuously at the screen or notes."');
INSERT INTO SuggestionsForImprovement VALUES(72,2,12,'"Make eye contact with multiple members of the audience."');
INSERT INTO SuggestionsForImprovement VALUES(73,3,13,'"Restate in your own words the task or question that you are trying to address with this information."');
INSERT INTO SuggestionsForImprovement VALUES(74,3,13,'"Summarize the pieces of information that you have been given, and check with others to be sure that none has been overlooked."');
INSERT INTO SuggestionsForImprovement VALUES(75,3,13,'"Add your own notes to information as you determine what it is."');
INSERT INTO SuggestionsForImprovement VALUES(76,3,13,'"Write down/circle/highlight the information that is needed to complete the task."');
INSERT INTO SuggestionsForImprovement VALUES(77,3,13,'"Put a line through info that you believe is not needed for the task"');
INSERT INTO SuggestionsForImprovement VALUES(78,3,13,'"Describe in what ways a particular piece of information may (or may not) be useful (or required) in completing the task"');
INSERT INTO SuggestionsForImprovement VALUES(79,3,14,'"Add notes or subtitles to key pieces of information found in text, tables, graphs, diagrams to describe its meaning."');
INSERT INTO SuggestionsForImprovement VALUES(80,3,14,'"State in your own words what information represents or means."');
INSERT INTO SuggestionsForImprovement VALUES(81,3,14,'"Summarize the ideas or relationships the information might convey."');
INSERT INTO SuggestionsForImprovement VALUES(82,3,14,'"Determine general trends in information and note any information that doesn''t fit the trend"');
INSERT INTO SuggestionsForImprovement VALUES(83,3,14,'"Check your understanding of information with others"');
INSERT INTO SuggestionsForImprovement VALUES(84,3,15,'"Identify how the new format of the information differs from the provided format."');
INSERT INTO SuggestionsForImprovement VALUES(85,3,15,'"Identify what information needs to be transformed and make notations to ensure that all relevant information has been included."');
INSERT INTO SuggestionsForImprovement VALUES(86,3,15,'"Review the new representation or format to be sure all relevant information has been included."');
INSERT INTO SuggestionsForImprovement VALUES(87,3,15,'"Consider what information was not included in the new representation or format and make sure it was not necessary."');
INSERT INTO SuggestionsForImprovement VALUES(88,3,15,'"Check with peers to see if there is agreement on the method of transformation and final result."');
INSERT INTO SuggestionsForImprovement VALUES(89,3,16,'"Write down the features that need to be included in the new form."');
INSERT INTO SuggestionsForImprovement VALUES(90,3,16,'"Be sure that you have carefully interpreted the original information and translated that to the new form."');
INSERT INTO SuggestionsForImprovement VALUES(91,3,16,'"Carefully check to ensure that the original information is correctly represented in the new form."');
INSERT INTO SuggestionsForImprovement VALUES(92,3,16,'"Verify the accuracy of the transformation with others."');
INSERT INTO SuggestionsForImprovement VALUES(93,4,17,'"Direct your voice towards the listeners and ask if you can be heard."');
INSERT INTO SuggestionsForImprovement VALUES(94,4,17,'"Use a tone that is respectful and encouraging rather than confromtational or harsh."');
INSERT INTO SuggestionsForImprovement VALUES(95,4,17,'"Choose language that doesn''t make others uncomfortable; don''t make the environment uninviting."');
INSERT INTO SuggestionsForImprovement VALUES(96,4,17,'"Carefully choose your words to align with the nature of the topic and the audience."');
INSERT INTO SuggestionsForImprovement VALUES(97,4,17,'"Speak for a length of time that allows frequent back and forth conversation."');
INSERT INTO SuggestionsForImprovement VALUES(98,4,17,'"Provide a level of detail appropriate to convey your main idea."');
INSERT INTO SuggestionsForImprovement VALUES(99,4,18,'"Allow team members to finish their contribution."');
INSERT INTO SuggestionsForImprovement VALUES(100,4,18,'"Indicate if you can''t hear someone''s spoken words."');
INSERT INTO SuggestionsForImprovement VALUES(101,4,18,'"Restate or write down what was communicated."');
INSERT INTO SuggestionsForImprovement VALUES(102,4,18,'"Give credit and acknowledge people by name."');
INSERT INTO SuggestionsForImprovement VALUES(103,4,18,'"Face the team member that is speaking and make eye contact."');
INSERT INTO SuggestionsForImprovement VALUES(104,4,18,'"Use active-listening body language or facial expressions that indicate attentiveness."');
INSERT INTO SuggestionsForImprovement VALUES(105,4,18,'"Remove distractions and direct your attention to the speaker."');
INSERT INTO SuggestionsForImprovement VALUES(106,4,19,'"Let team members know when they make a productive contribution."');
INSERT INTO SuggestionsForImprovement VALUES(107,4,19,'"State what others have said in your own words and confirm understanding."');
INSERT INTO SuggestionsForImprovement VALUES(108,4,19,'"Ask a follow-up question or ask for clarification."');
INSERT INTO SuggestionsForImprovement VALUES(109,4,19,'"Reference what others have said when you build on their ideas."');
INSERT INTO SuggestionsForImprovement VALUES(110,4,19,'"Offer an altenative to what a team member said."');
INSERT INTO SuggestionsForImprovement VALUES(111,5,20,'"Write down the general starting point and starting conditions."');
INSERT INTO SuggestionsForImprovement VALUES(112,5,20,'"Make sure that you understand the final goal or desired product - seek clarity when the goals are not well defined."');
INSERT INTO SuggestionsForImprovement VALUES(113,5,20,'"Sketch out a diagram or flowchart that shows the general steps in the process."');
INSERT INTO SuggestionsForImprovement VALUES(114,5,20,'"Double check to make sure that steps are sequenced sensibly."');
INSERT INTO SuggestionsForImprovement VALUES(115,5,20,'"Identify time needed for particular steps or other time constraints."');
INSERT INTO SuggestionsForImprovement VALUES(116,5,20,'"Make a regular plan to update progress."');
INSERT INTO SuggestionsForImprovement VALUES(117,5,21,'"List the tools, resources, or information that the group needs to obtain."');
INSERT INTO SuggestionsForImprovement VALUES(118,5,21,'"List the location of the tools, resources, or information at the group''s disposal."');
INSERT INTO SuggestionsForImprovement VALUES(119,5,21,'"Strategize about how to obtain the additional/needed tools, resources, or information."');
INSERT INTO SuggestionsForImprovement VALUES(120,5,22,'"Review the number of people you  have addressing each task, and be sure that it is right-sized to make progress."');
INSERT INTO SuggestionsForImprovement VALUES(121,5,22,'"Analyze each task for likelihood of success, and be sure you have it staffed appropriately."');
INSERT INTO SuggestionsForImprovement VALUES(122,5,22,'"Discuss strengths, availability,  and areas for contribution with each team member."');
INSERT INTO SuggestionsForImprovement VALUES(123,5,22,'"Check to make sure that each team member knows and understands their assigned roles/tasks."');
INSERT INTO SuggestionsForImprovement VALUES(124,5,22,'"Delegate tasks outside the team if necessary, especially if the task is too large to complete in the given time."');
INSERT INTO SuggestionsForImprovement VALUES(125,5,22,'"Establish a mechanism to share status and work products."');
INSERT INTO SuggestionsForImprovement VALUES(126,5,22,'"Set up meetings to discuss challenges and progress."');
INSERT INTO SuggestionsForImprovement VALUES(127,5,23,'"Check in regularly with each team member to review their progress on tasks."');
INSERT INTO SuggestionsForImprovement VALUES(128,5,23,'"Provide a list of steps towards accomplishing the goal that all can refer to and check off each step when completed."');
INSERT INTO SuggestionsForImprovement VALUES(129,5,23,'"Set up a time to listen to and respond to concerns of each team member and give feedback/support on their progress and strategies."');
INSERT INTO SuggestionsForImprovement VALUES(130,5,23,'"Create and maintain inventory lists of needed resources, noting ones that are more likely to run short."');
INSERT INTO SuggestionsForImprovement VALUES(131,5,23,'"Develop a strategy to make up for any shortfalls of materials."');
INSERT INTO SuggestionsForImprovement VALUES(132,5,23,'"Reassign team members to activities that need more attention or person hours as other steps are completed."');
INSERT INTO SuggestionsForImprovement VALUES(133,5,23,'"Evaluate whether team members should be reassigned to tasks that better align with their skill sets."');
INSERT INTO SuggestionsForImprovement VALUES(134,5,23,'"Check to see if the original plan for project completion is still feasible; make changes if necessary."');
INSERT INTO SuggestionsForImprovement VALUES(135,6,24,'"Read closely, and write down short summaries as you read through the entire context of the problem"');
INSERT INTO SuggestionsForImprovement VALUES(136,6,24,'"Draw a schematic or diagram that shows how aspects of the problem relate to one another"');
INSERT INTO SuggestionsForImprovement VALUES(137,6,24,'"Brainstorm or identify possible factors or constraints that are inherent or may be related to the stated problem or given situation"');
INSERT INTO SuggestionsForImprovement VALUES(138,6,24,'"Prioritize the complicating factors from most to least important"');
INSERT INTO SuggestionsForImprovement VALUES(139,6,24,'"List anything that will be significantly impacted by your decision (such as conditions, objects, or people)"');
INSERT INTO SuggestionsForImprovement VALUES(140,6,24,'"Deliberate on the consequences of generating a wrong strategy or solution"');
INSERT INTO SuggestionsForImprovement VALUES(141,6,25,'"Highlight or annotate the provided information that may be needed to solve the problem."');
INSERT INTO SuggestionsForImprovement VALUES(142,6,25,'"List information or principles that you already know that can help you solve the problem."');
INSERT INTO SuggestionsForImprovement VALUES(143,6,25,'"Sort the given and gathered information/resources as ''useful'' or ''not useful.''"');
INSERT INTO SuggestionsForImprovement VALUES(144,6,25,'"List the particular limitations of the provided information or tools."');
INSERT INTO SuggestionsForImprovement VALUES(145,6,25,'"Identify ways to access any additional reliable information, tools or resources that you might need."');
INSERT INTO SuggestionsForImprovement VALUES(146,6,26,'"Write down a reasonable place to start and add a reasonable end goal"');
INSERT INTO SuggestionsForImprovement VALUES(147,6,26,'"Align any two steps in the order or sequence that they must happen. Then, add a third step and so on."');
INSERT INTO SuggestionsForImprovement VALUES(148,6,26,'"Consider starting at the end goal and working backwards"');
INSERT INTO SuggestionsForImprovement VALUES(149,6,26,'"Sketch a flowchart indicating some general steps from start to finish."');
INSERT INTO SuggestionsForImprovement VALUES(150,6,26,'"Add links/actions, or processes that connect the steps"');
INSERT INTO SuggestionsForImprovement VALUES(151,6,27,'"Summarize the problem succinctly - does your strategy address each aspect of the problem?"');
INSERT INTO SuggestionsForImprovement VALUES(152,6,27,'"Identify any steps that must occur in a specific order and verify that they do."');
INSERT INTO SuggestionsForImprovement VALUES(153,6,27,'"Check each step in your strategy. Is each step necessary? Can it be shortened or optimized in some way?"');
INSERT INTO SuggestionsForImprovement VALUES(154,6,27,'"Check each step in your strategy. Is each step feasible? What evidence supports this?"');
INSERT INTO SuggestionsForImprovement VALUES(155,6,27,'"Check to see if you have access to necessary resources, and if not, propose substitutes."');
INSERT INTO SuggestionsForImprovement VALUES(156,6,27,'"Check that your strategy is practical and functional, with respect to time, cost, safety, personnel, regulations, etc."');
INSERT INTO SuggestionsForImprovement VALUES(157,6,27,'"Take time to continuously assess your strategy throughout the process."');
INSERT INTO SuggestionsForImprovement VALUES(158,6,28,'"Use authentic values and reasonable estimates for information needed to solve the problem"');
INSERT INTO SuggestionsForImprovement VALUES(159,6,28,'"Make sure that the information you are using applies to the conditions of the problem."');
INSERT INTO SuggestionsForImprovement VALUES(160,6,28,'"List the assumptions that you are making and provide a reason for why those are valid assumptions."');
INSERT INTO SuggestionsForImprovement VALUES(161,6,28,'"Double check that you are following all the steps in your strategy."');
INSERT INTO SuggestionsForImprovement VALUES(162,6,28,'"List any barriers that you are encountering in executing the steps"');
INSERT INTO SuggestionsForImprovement VALUES(163,6,28,'"Identify ways to overcome barriers in implementation steps of the strategy"');
INSERT INTO SuggestionsForImprovement VALUES(164,6,28,'"Check the outcome of each step of the strategy for effectiveness."');
INSERT INTO SuggestionsForImprovement VALUES(165,7,29,'"Speak up and share your ideas/insights with team members."');
INSERT INTO SuggestionsForImprovement VALUES(166,7,29,'"Listen to other team members who are sharing their ideas or insights and do not interrupt their communications."');
INSERT INTO SuggestionsForImprovement VALUES(167,7,29,'"Be sure that others can hear you speak and can see you face, so they can read your facial expressions and body language."');
INSERT INTO SuggestionsForImprovement VALUES(168,7,29,'"Explicitly react (nod, speak out loud, write a note, etc.) to contributions from other team members to indicate that you are engaged."');
INSERT INTO SuggestionsForImprovement VALUES(169,7,29,'"Restate the prompt to make sure everyone is at the same place on the task."');
INSERT INTO SuggestionsForImprovement VALUES(170,7,29,'"Have all members of the team consider the same task at the same time rather than working independently"');
INSERT INTO SuggestionsForImprovement VALUES(171,7,30,'"Acknowledge or point out particularly effective contributions."');
INSERT INTO SuggestionsForImprovement VALUES(172,7,30,'"Initiate discussions of agreement or disagreement with statements made by team members."');
INSERT INTO SuggestionsForImprovement VALUES(173,7,30,'"Contribute your insights and reasoning if you disagree with another member of the team."');
INSERT INTO SuggestionsForImprovement VALUES(174,7,30,'"Regularly ask members of the team to share their ideas or explain their reasoning."');
INSERT INTO SuggestionsForImprovement VALUES(175,7,30,'"Add information or reasoning to contributions from other team members."');
INSERT INTO SuggestionsForImprovement VALUES(176,7,30,'"Ask for clarification or rephrase statements of other team members to ensure understanding."');
INSERT INTO SuggestionsForImprovement VALUES(177,7,31,'"Minimize distractions and focus on the assignment (close unrelated websites or messaging on phone or computer, turn off music, put away unrelated materials)."');
INSERT INTO SuggestionsForImprovement VALUES(178,7,31,'"Redirect team members to current task."');
INSERT INTO SuggestionsForImprovement VALUES(179,7,31,'"Ask other team members for their input on a task to move discussion forward."');
INSERT INTO SuggestionsForImprovement VALUES(180,7,31,'"Ask for assistance if your team is stuck on a task and making little progress."');
INSERT INTO SuggestionsForImprovement VALUES(181,7,31,'"Compare progress on task to the time remaining on assignment."');
INSERT INTO SuggestionsForImprovement VALUES(182,7,31,'"Communicate to team members that you need to move on."');
INSERT INTO SuggestionsForImprovement VALUES(183,7,31,'"As a team, list tasks to be done and agree on order for these tasks."');
INSERT INTO SuggestionsForImprovement VALUES(184,7,32,'"Address team members by name."');
INSERT INTO SuggestionsForImprovement VALUES(185,7,32,'"Use inclusive (collective) team cues that draw all team members together."');
INSERT INTO SuggestionsForImprovement VALUES(186,7,32,'"Encourage every team member to contribute toward the goal."');
INSERT INTO SuggestionsForImprovement VALUES(187,7,32,'"Make sure everyone feels ready to begin the task."');
INSERT INTO SuggestionsForImprovement VALUES(188,7,32,'"Check that all team members are ready to move on to the next step in the task."');
INSERT INTO SuggestionsForImprovement VALUES(189,7,32,'"Encourage all team members to work together on the same tasks at the same time, as needed."');
INSERT INTO SuggestionsForImprovement VALUES(190,7,32,'"Celebrate team successes and persistence through roadblocks."');
INSERT INTO SuggestionsForImprovement VALUES(191,7,32,'"Invite other team members to provide alternative views and reasoning."');
CREATE TABLE IF NOT EXISTS "Team" (
	team_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	team_name VARCHAR(25) NOT NULL, 
	observer_id INTEGER NOT NULL, 
	date DATE NOT NULL, 
	FOREIGN KEY(observer_id) REFERENCES "Users" (user_id)
);
CREATE TABLE IF NOT EXISTS "AssessmentTask" (
	at_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	at_name VARCHAR(100), 
	course_id INTEGER, 
	rubric_id INTEGER, 
	role_id INTEGER, 
	due_date DATETIME DEFAULT (CURRENT_TIMESTAMP), 
	suggestions BOOLEAN NOT NULL, 
	FOREIGN KEY(course_id) REFERENCES "Course" (course_id), 
	FOREIGN KEY(rubric_id) REFERENCES "Rubric" (rubric_id), 
	FOREIGN KEY(role_id) REFERENCES "Role" (role_id)
);
INSERT INTO AssessmentTask VALUES(1,'Super Admin Assessment Task',1,1,2,'2023-05-18 17:21:32',1);
CREATE TABLE IF NOT EXISTS "TeamUser" (
	tu_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	team_id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	FOREIGN KEY(team_id) REFERENCES "Team" (team_id), 
	FOREIGN KEY(user_id) REFERENCES "Users" (user_id)
);
CREATE TABLE IF NOT EXISTS "UserCourse" (
	uc_id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	course_id INTEGER NOT NULL, 
	PRIMARY KEY (uc_id), 
	FOREIGN KEY(user_id) REFERENCES "Users" (user_id), 
	FOREIGN KEY(course_id) REFERENCES "Course" (course_id)
);
CREATE TABLE IF NOT EXISTS "InstructorTaCourse" (
	itc_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	owner_id INTEGER NOT NULL, 
	ta_id INTEGER NOT NULL, 
	course_id INTEGER NOT NULL, 
	FOREIGN KEY(owner_id) REFERENCES "Users" (user_id), 
	FOREIGN KEY(ta_id) REFERENCES "Users" (user_id), 
	FOREIGN KEY(course_id) REFERENCES "Course" (course_id)
);
CREATE TABLE IF NOT EXISTS "Completed_Rubric" (
	cr_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	at_id INTEGER, 
	by_role INTEGER, 
	team_or_user BOOLEAN NOT NULL, 
	team_id INTEGER, 
	user_id INTEGER, 
	initial_time DATETIME DEFAULT (CURRENT_TIMESTAMP), 
	last_update DATETIME, 
	rating INTEGER, 
	FOREIGN KEY(at_id) REFERENCES "AssessmentTask" (at_id), 
	FOREIGN KEY(by_role) REFERENCES "Users" (user_id), 
	FOREIGN KEY(team_id) REFERENCES "Team" (team_id), 
	FOREIGN KEY(user_id) REFERENCES "Users" (user_id)
);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('Rubric',7);
INSERT INTO sqlite_sequence VALUES('Category',33);
INSERT INTO sqlite_sequence VALUES('ObservableCharacteristics',122);
INSERT INTO sqlite_sequence VALUES('SuggestionsForImprovement',191);
INSERT INTO sqlite_sequence VALUES('Role',7);
INSERT INTO sqlite_sequence VALUES('Users',1);
INSERT INTO sqlite_sequence VALUES('Course',1);
INSERT INTO sqlite_sequence VALUES('AssessmentTask',1);
COMMIT;
