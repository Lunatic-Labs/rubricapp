from models.rubric import create_rubric
from models.category import create_category
from models.observable_characteristics import create_observable_characteristic
from models.suggestions import create_suggestion
from models.rubric_categories import create_rubric_category
from models.ratings_numbers import *

def load_existing_rubrics():
    rubrics = [
        # (Latest update is June 7, 2022) Critical Thinking
        ["Critical Thinking", "Forming an argument or reaching a conclusion supported with evidence by evaluating, analyzing, and/or synthesizing relevant information."],
        # (Latest update is November, 2022) Formal Communication
        ["Formal Communication", "Conveying information and understanding to an intended audience through a formal communication effort*, either written or oral."],
        # (Latest update is December 29, 2021) Information Processing
        ["Information Processing", "Evaluating, interpreting, and manipulating or transforming information."],
        # (Latest update is July 5, 2022) Interpersonal Communication
        ["Interpersonal Communication", "Exchanging information and idea through speaking, listening, responding, and non-verbal behaviors."],
        # (Latest update is April 24, 2023) Management
        ["Management", "Planning, organizing, coordinating, and monitoring one's own and others' efforts to accomplish a goal."],
        # (Latest update is September 16, 2022) Problem Solving
        ["Problem Solving", "Analyzing a complex problem or situation, developing a viable strategy to address it, and executing that strategy (when appropriate)."],
        # (Latest update is July 19, 2022) Teamwork
        ["Teamwork", "Interacting with others and buliding on each other's individual strengths and skills, working toward a common goal."]
    ]
    for rubric in rubrics:
        r = {} 
        r["rubric_name"] = rubric[0]
        r["rubric_description"] = rubric[1]
        r["owner"] = 1
        create_rubric(r)

def load_existing_categories():
    categories = [
        # (Latest update is June 7, 2022) Critical Thinking Categories 1-6
        [1,"Identifying the Goal", "Determined the purpose/context of the argument or conclusion that needed to be made", completely],
        [1,"Evaluating", "Determined the relevance and reliability of information that might be used to support the conclusion or argument", extensively],
        [1,"Analyzing", "Interpreted information to determine meaning and to extract relevant evidence", accurately],
        [1,"Synthesizing", "Connected or integrated information to support an argument or reach a conclusion", accurately],
        [1,"Forming Arguments (Structure)", "Made an argument that includes a claim (a position), supporting information, and reasoning.", completely],
        [1,"Forming Arguments (Validity)", "The claim, evidence, and reasoning were logical and consistent with broadly accepted principles.", fully],
        # (Latest update is November, 2022) Formal Communication Categories 1-7
        [2, "Intent", "Clearly conveys the purpose, and the content is well-aligned towards this intent", completely],
        [2, "Audience", "Uses language and delivery style that is consistent with the norms of the subject area and suitable for the audience", consistently],
        [2, "Organization", "Presents ideas in a logical and cohesive manner", consistently],
        [2, "Visual Representations", "Constructs and uses visual representations effectively and appropriately", consistently],
        [2, "Format and Style", "Selects a format and style that enhances the effectiveness of the communication", consistently],
        [2, "Mechanics (written words)", "Uses expected writing conventions for the form of communication", consistently],
        [2, "Delivery (oral)", "Uses voice and body language to convey the intended message in a clear and engaging manner", consistently],
        # (Latest update is December 29, 2021) Information Processing Categories 1-4
        [3, "Evaluating", "Determined the significance or relevance of information/data needed for the task.", completely],
        [3, "Interpreting", "Provided meaning to data, made inferences and predictions from data, or extracted patterns from data.", accurately],
        [3, "Manipulating or Transforming (Extent)","Converted information/data from one form to another.", completely],
        [3, "Manipulating or Transforming (Accuracy)", "Converted information/data from one form to another.", accurately],
        # (Latest update is July 5, 2022) Interpersonal Communication 1-3
        [4, "Speaking", "Expressed information and ideas to others in an effective manner", consistently],
        [4, "Listening", "Paid attention to the speaker as information and ideas were communicated", consistently],
        [4, "Responding", "Replied or reacted to the communicated information and ideas", consistently],
        # (Latest update is April 24, 2023) Management Categories 1-4
        [5, "Planning", "Laid out the course of action required to accomplish a goal", completely],
        [5, "Organizing", "Prepared and/or gathered the materials, tools, and information needed to progress toward the goal", completely],
        [5, "Coordinating", "Optimized and communicated the distribution of tasks among team members", consistently],
        [5, "Overseeing", "Monitored ongoing progress, assessed resources, and adjusted plans as needed", consistently],
        # (Latest update is September 16, 2022) Problem Solving Categories 1-5
        [6, "Analyzing the situation", "Determined the scope and complexity of the problem", completely],
        [6, "Identifying", "Determined the information, tools, and resources necessary to solve the problem", completely],
        [6, "Strategizing", "Developed a process (series of steps) to arrive at a solution", completely],
        [6, "Validating", "Judged the reasonableness and completeness of the proposed strategy or solution", completely],
        [6, "Executing", "Implemented the strategy effectively", completely],
        # (Latest update is July 19, 2022) Teamwork Categories 1-4
        [7, "Interacting", "Communicated with each other and worked together", consistently],
        [7, "Contributing", "Considered the contributions, strengths and skills of all team members", consistently],
        [7, "Progressing", "Moved forward towards a common goal", consistently],
        [7, "Building Community", "Acted as a cohesive unit that supported and included all team members.", consistently],
    ]
    for category in categories:
        c = {} 
        c["name"]= category[1]
        c["description"] = category[2]
        c["rating_json"] = category[3]
        c = create_category(c)

        rc = {} 
        rc["rubric_id"] = category[0]
        rc["category_id"] = c.category_id
        create_rubric_category(rc)
        
def load_existing_observable_characteristics():
    observable_characteristics = [
        # (Latest update is June 7, 2022) Critical Thinking
        # Identifying The Goal Observable Characteristics 1-3
        [1, "Identified the question that needed to be answered or the situation that needed to be addressed"],
        [1, "Identified any situational factors that may be important to addressing the question or situation"],
        [1, "Identified the general types of data or information needed to address the question"],
        # Evaluating Observable Characteristics 1-3
        [2, "Indicated what information is likely to be most relevant"],
        [2, "Determined the reliability of the source of information"],
        [2, "Determined the quality and accuracy of the information itself"],
        # Analyzing Observable Characteristics 1-3
        [3, "Discussed information and explored possible meanings"],
        [3, "Identified general trends or patterns in the data/information that could be used as evidence"],
        [3, "Processed and/or transformed data/information to put it in forms that could be used as evidence"],
        # Synthesizing Observable Characteristics 1-3
        [4, "Identified the relationships between different pieces of information or concepts"],
        [4, "Compared or contrasted what could be determined from different pieces of information"],
        [4, "Combined multiple pieces of information or ideas in valid ways to generate a new insight in conclusion"],
        # Forming Arguments Structure Observable Characteristics 1-4
        [5, "Stated the conclusion or the claim of the argument"],
        [5, "Listed the evidence used to support the argument"],
        [5, "Linked the claim/conclusion to the evidence with focused and organized reasoning"],
        [5, "Stated any qualifiers that limit the conditions for which the argument is true"],
        # Forming Arguments Validity Observable Characteristics 1-5
        [6, "The most relevant evidence was used appropriately to support the claim"],
        [6, "Reasoning was logical and effectively connected the data to the claim"],
        [6, "The argument was aligned with disciplinary/community concepts or practices"],
        [6, "Considered alternative or counter claims"],
        [6, "Considered evidence that could be used to refute or challenge the claim"],
        # (Latest update is November, 2022) Formal Communication
        # Intent Observable Characteristics 1-3
        [7, "Clearly stated what the audience should gain from the communication"],
        [7, "Used each part of the communication to convey or support the main message"],
        [7, "Concluded by summarizing what was to be learned"],
        # Audience Observable Characteristic 1-3
        [8, "Communicated to the full range of the audience, including novices and those with expertise"],
        [8, "Aligned the communication with the interests and background of the particular audience"],
        [8, "Used vocabulary that aligned with the discipline and was understood by the audience"],
        # Organization Observable Characteristics 1-3
        [9, "There was a clear story arc that moved the communication forward"],
        [9, "Organizational cues and transitions clearly indicated the structure of the communication"],
        [9, "Sequence of ideas flowed in an order that was easy to follow"],
        # Visual Representations Observable Characteristics 1-3
        [10, "Each figure conveyed a clear message"],
        [10, "Details of the visual representation were easily interpreted by the audience"],
        [10, "The use of the visual enhanced understanding by the audience"],
        # Format and Style Observable Characteristics 1-3
        [11, "Stylistic elements were aesthetically pleasing and did not distract from the message"],
        [11, "Stylistic elements were designed to make the communication accessbile to the audience (size, colors, contrasts, etc.)"],
        [11, "The level of formality of the communication aligns with the setting, context, and purpose"],
        # Mechanics Written Word Observable Characteristics 1-4
        [12, "Writing contained correct spelling, word choice, punctuation, and capitalization"],
        [12, "All phrases and sentences were grammatically correct"],
        [12, "All paragraphs (or slides) were well constructed around a central idea"],
        [12, "All figures and tables were called out in the narrative, and sources were correctly cited"],
        # Delivery Oral Observable Characteristics 1-4
        [13, "Spoke loudly and clearly with a tone that indicated confidence and interest in the subject"],
        [13, "Vocal tone and pacing helped maintain audience interest"],
        [13, "Gestures and visual cues further oriented the audience to focus on particular items or messages"],
        [13, "Body language directed the delivery toward the audience and indicated the speaker was open to engagement"],
        # (Latest update is December 29, 2021) Information Processing
        # Evaluating Observable Characteristics 1-5
        [14, "Established what needs to be accomplished with this information"],
        [14, "Identified what information is provided in the materials"],
        [14, "Indicated what information is relevant"],
        [14, "Indicated what information is NOT relevant"],
        [14, "Indicated why certain information is relevant or not"],
        # Interpreting Observable Characteristics 1-4
        [15, "Labeled or assigned correct meaning to information (text, tables, symbols, diagrams)"],
        [15, "Extracted specific details from information"],
        [15, "Rephrased information in own words"],
        [15, "Identified patterns in information and derived meaning from them"],
        # Manipulating or Transforming Extent Observable Characteristics 1-3
        [16, "Determined what information needs to be converted to accomplish the task"],
        [16, "Described the process used to generate the transformation"],
        [16, "Converted all relevant information into a different representation of format"],
        # Manipulating or Transforming Accuracy Observable Characteristics 1-3
        [17, "Conveyed the correct or intended meaning of the information in the new representation or format."],
        [17, "All relevant features of the original information/data are presented in the new representation of format"],
        [17, "Performed the transformation without errors"],
        # (Latest update is July 5, 2022) Interpersonal Communication
        # Speaking Observable Characteristics 1-4
        [18, "Spoke clear and loudly enough for all team members to hear"],
        [18, "Used a tone that invited other people to respond"],
        [18, "Used language that was suitable for the listeners and context"],
        [18, "Spoke for a reasonable length of time for the situation"],
        # Listening Observable Characteristics 1-4
        [19, "Patiently listened without interrupting the speaker"],
        [19, "Referenced others' ideas to indicate listening and understanding"],
        [19, "Presented nonverbal cues to indicate attentiveness"],
        [19, "Avoided engagine in activities that diverted attention"],
        # Responding Observable Characteristics 1-4
        [20, "Acknowledged other members for their ideas or contributions"],
        [20, "Rephrased or referred to what other group members have said"],
        [20, "Asked other group members to futher explain a concept"],
        [20, "Elaborated or extended on someone else's idea(s)"],
        # (Latest update is April 24, 2023) Management
        # Planning Observable Characteristics 1-4
        [21, "Generated a summary of the starting and ending points"],
        [21, "Generated a sequence of steps or tasks to reach the desired goal"],
        [21, "Discussed a timeline or time frame for completing project tasks"],
        [21, "Decided on a strategy to share information, updates and progress with all team members"],
        # Organizing Observable Characteristics 1-3
        [22, "Decided upon the necessary resources and tools"],
        [22, "Identified the availability of resources, tools or information"],
        [22, "Gathered necessary information and tools"],
        # Coordinating Observable Characteristics 1-4
        [23, "Determined if tasks need to be delegated or completed by the team as a whole"],
        [23, "Tailored the tasks toward strengths and availability of team members"],
        [23, "Assigned specific tasks and responsibilities to team members"],
        [23, "Established effective communication strategies and productive interactions among team members"],
        # Overseeing Observable Characteristics 1-5
        [24, "Reinforced responsibilities and refocused team members toward completing project tasks"],
        [24, "Communicated status, next steps, and reiterated general plan to accomplish goals"],
        [24, "Sought and valued input from team members and provided them with constructive feedback"],
        [24, "Kept track of remaining materials, team and person hours"],
        [24, "Updated or adapted the tasks or plans as needed"],
        # (Latest update is September 16, 2022) Problem Solving
        # Analyzing the Situation Observable Characteristics 1-3
        [25, "Described the problem that needed to be solved or the decisions that needed to be made"],
        [25, "Listed complicating factors or constraints that may be important to consider when developing a solution"],
        [25, "Identified the potential consequences to stakeholders or surrounding"],
        # Identifying Observable Characteristics 1-4
        [26, "Reviewed the organized the necessary information and resources"],
        [26, "Evaluated which available information and resources are critical to solving the problem"],
        [26, "Determined the limitations of the tools or information that was given or gathered"],
        [26, "Identified reliable sources that may provide additional needed information, tools, or resources"],
        # Strategizing Observable Characteristics 1-3
        [27, "Identified potential starting and ending points for the strategy"],
        [27, "Determined general steps needed to get from starting point to ending point"],
        [27, "Sequenced or mapped actions in a logical progression"],
        # Validating Observable Characteristics 1-4
        [28, "Reviewed strategy with respect to the identified scope"],
        [28, "Provided rationale as to how steps within the process were properly sequenced"],
        [28, "Identified ways the process or stragey could be futher improved or optimized"],
        [28, "Evaluated the practicality of the overall strategy"],
        # Executing Observable Characteristics 1-4
        [29, "Used data and information correctly"],
        [29, "Made assumptions about the use of data and information that are justifiable"],
        [29, "Determined that each step is being done in the order and the manner that was planned."],
        [29, "Verified that each step in the process was providing the desired outcome."],
        # (Latest update is July 19, 2022) Teamwork
        # Interacting Observable Characteristics 1-3
        [30, "All team members communicated ideas related to a common goal"],
        [30, "Team members responded to each other verbally or nonverbally"],
        [30, "Directed each other to tasks and information"],
        # Constributing Observable Characteristics 1-4
        [31, "Acknowledged the value of the statements of other team members"],
        [31, "Invited other team members to participate in the conversation, particulary if they had not contributed in a while"],
        [31, "Expanded on statements of other team members"],
        [31, "Asked follow-up questions to clarify team members' thoughts"],
        # Progressing Observable Characteristics 1-4
        [32, "Stayed on task, focused on the assignment with only brief interruptions"],
        [32, "Refocused team members to make more effective progress towards the goal"],
        [32, "Worked simultaneously as single unit on the common goal"],
        [32, "Checked time to monitor progress on task."],
        # Building Community Observable Characteristics 1-5
        [33, "Created a sense of belonging to the team for all team members"],
        [33, "Acted as a single unit that did not break up into smaller, gragmented units for the entire task"],
        [33, "Openly and respectfully discussed questions and disagreements between team members"],
        [33, "Listened carefully to people, and gave weight and respect to their contributions"],
        [33, "Welcomed and valued the individual identity and experiences of each team member"],
    ]
    for observable in observable_characteristics:
        create_observable_characteristic(observable)

def load_existing_suggestions():
    suggestions = [
        # (Latest update is June 7, 2022) Critical Thinking
        # Identifying the Goal Suggestions 1-4
        [1, "Review the instructions or general goal of the task."],
        [1, "Highlight or clearly state the question to be addressed or type of conclusion that must be reached."],
        [1, "List the factors (if any) that may limit the feasibility of some possible conclusions."],
        [1, "Write down the information you think is needed to address the situation."],
        # Evaluating Suggestions 1-5
        [2, "Review provided material and circle, highlight, or otherwise indicate information that may be used as evidence in reaching a conclusion."],
        [2, "Write down the other information (prior knowledge) that might be useful to lead to/support a possible conclusion."],
        [2, "Set aside any information, patterns, or insights that seem less relevant to addressing the situation at hand."],
        [2, "Consider whether the information was obtained from a reliable source (textbook, literature, instructor, websites with credible authors)"],
        [2, "Determine the quality of the information and whether it is sufficient to answer the question."],
        # Analyzing Suggestions 1-5
        [3, "Interpret and label key pieces of information in text, tables, graphs, diagrams."],
        [3, "State in your own words what information represents or means."],
        [3, "Identify general trends in information, and note any information that doesn't fit the pattern."],
        [3, "Check your understanding of information with others and discuss any differences in understanding."],
        [3, "State how each piece of information, pattern, or insight can be used to reach a conclusion or support your claim."],
        # Synthesizing Suggestions 1-5
        [4, "Look for two or more pieces or types of information that can be connected and state how they can be related to each other."],
        [4, "Write out the aspects that are similar and different in various pieces of information."],
        [4, "Map out how the information and/or concepts can be combined to support an argument or reach a conclusion."],
        [4, "Write a statement that summarizes the integration of the information and conveys a new understanding."],
        [4, "List the ways in which synthesized information could be used as evidence."],
        # Forming Arguments Structure Suggestions 1-7
        [5, "Review the original goal - what question were you trying to answer?"],
        [5, "Clearly state your answer to the question (your claim or conclusion)."],
        [5, "Review the information you previously evaluated, analyzed and/or synthesized and decide what evidence supports your claim."],
        [5, "List each piece of evidence that you are using to support your argument."],
        [5, "Explain how each piece of information links to and supports your answer."],
        [5, "Make sure your answer includes the claim, information and reasoning."],
        [5, "Make sure the claim or conclusion answers the question."],
        # Forming Arguments Validity Suggestions 1-5
        [6, "Provide a clear statement that articulates why the evidence you chose leads to the claim or conclusion."],
        [6, "Check to make sure that your reasoning is consistent with what is accepted in the discipline or context."],
        [6, "Test your ideas with others, and ask them to judge the quality of the argument or indicate how the argument could be made more convincing."],
        [6, "Ask yourself (and others) if there is evidence or data that doesn't suport your conclusion or might contradict your claim."],
        [6, "Consider if there are alternative explanations for the data you are considering."],
        # (Latest update is November, 2022) Formal Communication
        # Intent Suggestions 1-5
        [7, "Decide if your main purpose is to inform, to persuade, to argue, to summarize, to entertain, to inspire, etc."],
        [7, "Write out the intent of the communication you are creating and refer back to it as you generate your material."],
        [7, "Make sure the purpose of the communication is presented early to orient your audience to the focus of the communication."],
        [7, "Check that the focus of each segment is clearly linked to the main message or intent of the communication."],
        [7, "Summarize the main ideas to wrap up the presentation (refer back to the initial statement(s) of what was to be learned)."],
        # Audience Suggestions 1-6
        [8, "Identify the range and level of expertise and interest your audience has for the topic and design your communication to have aspects that will engage all members of the audience."],
        [8, "Identify what the audience needs to know to understand the narrative."],
        [8, "Plan how you will interpret key data or details in a meaningful way for non-experts."],
        [8, "Only use jargon when it is understood readily by most members of your audience, and it makes the communication more effective and succinct."],
        [8, "Check that the vocabulary, sentence structure, and tone used in your communication is aligned with the level of your audience."],
        [8, "Collect feedback from others on drafts to make sure the core message of the communication is easily understood."],
        # Organization Suggestions 1-6
        [9, "Consider the 'story' that you want to tell. Ask yourself what's the main message you want the audience to leave with."],
        [9, "Identify the critical points for the story (do this before you prepare the actual communication) and map out the key points."],
        [9, "Summarize sections before transitioning to the next topic."],
        [9, "Repeat key ideas to ensure the audience can follow the main idea."],
        [9, "Make sure that you introduce prerequisite information early in the communication."],
        [9, "Try more than one order for the topics, to see if overall flow is improved."],
        # Visual Representations Suggestions 1-6
        [10, "Plan what types of figures are needed to support the narrative - consider writing out a figure description before you construct it."],
        [10, "Avoid including unnecessary details that detract from the intended message."],
        [10, "Consider how many messages each visual is trying to convey and divide up if the complexity or density is overwhelming."],
        [10, "Be sure labels, text, and small details can be easily read."],
        [10, "Provide a caption that helps interpret the key aspects of the visual."],
        [10, "Seek feedback on visuals to gauge initial reaction and ease of interpretation."],
        # Format Style Suggestions 1-6
        [11, "Use titles (headers) and subtitles (subheaders) to orient the audience and help them follow the narrative."],
        [11, "Look at pages or slides as a whole for an easy-to-read layout, such as white space, headers, line spacing, etc."],
        [11, "Use emphases where needed to direct audience attention to important aspects."],
        [11, "Use colors to carefully highlight or call attention to key elements to enhance your narrative without distracting from your message."],
        [11, "Make sure that text, figures, and colors are readable and accessible for all."],
        [11, "Seek feedback to confirm that the language, tone, and style of your communication match the level of formality needed for your context and purpose."],
        # Mechanics Written Words Suggestions 1-7
        [12, "Proofread your writing for spelling errors, punctuation, autocorrects, etc."],
        [12, "Review sentence structure for subject-verb agreement, consistent tense, run on sentences, and other structural problems."],
        [12, "Verify that items in lists are parallel."],
        [12, "List the themes of each paragraph (or slide).  If there are more than 2, consider starting a new paragraph (or slide)."],
        [12, "Confirm that each figure, table, etc has been numbered consecutively and has been called out and discussed further in the narrative."],
        [12, "Confirm that all work that has been published elsewhere or ideas/data that were not generated by the author(s) has been properly cited using appropriate conventions."],
        [12, "Ask someone else to review and provide feedback on your work."],
        # Delivery Oral Suggestions 1-5
        [13, "Practice for others or record your talk; i. be sure that your voice can be heard, and your word pronunciations are clear. ii. listen for “ums”, “like”, or other verbal tics/filler words that can detract from your message. iii. observe your natural body language, gestures, and stance in front of the audience to be sure that they express confidence and enhance your message."],
        [13, "Add variety to your speed or vocal tone to emphasize key points or transitions."],
        [13, "Try to communicate/engage as if telling a story or having a conversation with the audience."],
        [13, "Face the audience and do not look continuously at the screen or notes."],
        [13, "Make eye contact with multiple members of the audience."],
        # (Latest update is December 29, 2021) Information Processing
        # Evaluating Suggestions 1-6
        [14, "Restate in your own words the task or question that you are trying to address with this information."],
        [14, "Summarize the pieces of information that you have been given, and check with others to be sure that none has been overlooked."],
        [14, "Add your own notes to information as you determine what it is."],
        [14, "Write down/circle/highlight the information that is needed to complete the task."],
        [14, "Put a line through info that you believe is not needed for the task"],
        [14, "Describe in what ways a particular piece of information may (or may not) be useful (or required) in completing the task"],
        # Interpreting Suggestions 1-5
        [15, "Add notes or subtitles to key pieces of information found in text, tables, graphs, diagrams to describe its meaning."],
        [15, "State in your own words what information represents or means."],
        [15, "Summarize the ideas or relationships the information might convey."],
        [15, "Determine general trends in information and note any information that doesn't fit the trend"],
        [15, "Check your understanding of information with others"],
        # Manipulating or Transforming Extent Suggestions 1-5
        [16, "Identify how the new format of the information differs from the provided format."],
        [16, "Identify what information needs to be transformed and make notations to ensure that all relevant information has been included."],
        [16, "Review the new representation or format to be sure all relevant information has been included."],
        [16, "Consider what information was not included in the new representation or format and make sure it was not necessary."],
        [16, "Check with peers to see if there is agreement on the method of transformation and final result."],
        # Manipulating or Transforming Accuracy Suggestions 1-4
        [17, "Write down the features that need to be included in the new form."],
        [17, "Be sure that you have carefully interpreted the original information and translated that to the new form."],
        [17, "Carefully check to ensure that the original information is correctly represented in the new form."],
        [17, "Verify the accuracy of the transformation with others."],
        # (Latest update is July 5, 2022) Interpersonal Communication
        # Speaking Suggestions 1-6
        [18, "Direct your voice towards the listeners and ask if you can be heard."],
        [18, "Use a tone that is respectful and encouraging rather than confromtational or harsh."],
        [18, "Choose language that doesn't make others uncomfortable; don't make the environment uninviting."],
        [18, "Carefully choose your words to align with the nature of the topic and the audience."],
        [18, "Speak for a length of time that allows frequent back and forth conversation."],
        [18, "Provide a level of detail appropriate to convey your main idea."],
        # Listening Suggestions 1-7
        [19, "Allow team members to finish their contribution."],
        [19, "Indicate if you can't hear someone's spoken words."],
        [19, "Restate or write down what was communicated."],
        [19, "Give credit and acknowledge people by name."],
        [19, "Face the team member that is speaking and make eye contact."],
        [19, "Use active-listening body language or facial expressions that indicate attentiveness."],
        [19, "Remove distractions and direct your attention to the speaker."],
        # Responding Suggestions 1-5
        [20, "Let team members know when they make a productive contribution."],
        [20, "State what others have said in your own words and confirm understanding."],
        [20, "Ask a follow-up question or ask for clarification."],
        [20, "Reference what others have said when you build on their ideas."],
        [20, "Offer an altenative to what a team member said."],
        # (Latest update is April 24, 2023) Management
        # Planning Suggestions 1-6
        [21, "Write down the general starting point and starting conditions."],
        [21, "Make sure that you understand the final goal or desired product - seek clarity when the goals are not well defined."],
        [21, "Sketch out a diagram or flowchart that shows the general steps in the process."],
        [21, "Double check to make sure that steps are sequenced sensibly."],
        [21, "Identify time needed for particular steps or other time constraints."],
        [21, "Make a regular plan to update progress."],
        # Organizing Suggestions 1-3
        [22, "List the tools, resources, or information that the group needs to obtain."],
        [22, "List the location of the tools, resources, or information at the group's disposal."],
        [22, "Strategize about how to obtain the additional/needed tools, resources, or information."],
        # Coordinating Suggestions 1-7
        [23, "Review the number of people you  have addressing each task, and be sure that it is right-sized to make progress."],
        [23, "Analyze each task for likelihood of success, and be sure you have it staffed appropriately."],
        [23, "Discuss strengths, availability,  and areas for contribution with each team member."],
        [23, "Check to make sure that each team member knows and understands their assigned roles/tasks."],
        [23, "Delegate tasks outside the team if necessary, especially if the task is too large to complete in the given time."],
        [23, "Establish a mechanism to share status and work products."],
        [23, "Set up meetings to discuss challenges and progress."],
        # Overseeing Suggestions 1-8
        [24, "Check in regularly with each team member to review their progress on tasks."],
        [24, "Provide a list of steps towards accomplishing the goal that all can refer to and check off each step when completed."],
        [24, "Set up a time to listen to and respond to concerns of each team member and give feedback/support on their progress and strategies."],
        [24, "Create and maintain inventory lists of needed resources, noting ones that are more likely to run short."],
        [24, "Develop a strategy to make up for any shortfalls of materials."],
        [24, "Reassign team members to activities that need more attention or person hours as other steps are completed."],
        [24, "Evaluate whether team members should be reassigned to tasks that better align with their skill sets."],
        [24, "Check to see if the original plan for project completion is still feasible; make changes if necessary."],
        # (Latest update is September 16, 2022) Problem Solving
        # Analyzing The Situation Suggestions 1-6
        [25, "Read closely, and write down short summaries as you read through the entire context of the problem"],
        [25, "Draw a schematic or diagram that shows how aspects of the problem relate to one another"],
        [25, "Brainstorm or identify possible factors or constraints that are inherent or may be related to the stated problem or given situation"],
        [25, "Prioritize the complicating factors from most to least important"],
        [25, "List anything that will be significantly impacted by your decision (such as conditions, objects, or people)"],
        [25, "Deliberate on the consequences of generating a wrong strategy or solution"],
        # Identifying Suggestions 1-5
        [26, "Highlight or annotate the provided information that may be needed to solve the problem."],
        [26, "List information or principles that you already know that can help you solve the problem."],
        [26, "Sort the given and gathered information/resources as 'useful' or 'not useful.'"],
        [26, "List the particular limitations of the provided information or tools."],
        [26, "Identify ways to access any additional reliable information, tools or resources that you might need."],
        # Strategizing Suggestions 1-5
        [27, "Write down a reasonable place to start and add a reasonable end goal"],
        [27, "Align any two steps in the order or sequence that they must happen. Then, add a third step and so on."],
        [27, "Consider starting at the end goal and working backwards"],
        [27, "Sketch a flowchart indicating some general steps from start to finish."],
        [27, "Add links/actions, or processes that connect the steps"],
        # Validating Suggestions 1-7
        [28, "Summarize the problem succinctly - does your strategy address each aspect of the problem?"],
        [28, "Identify any steps that must occur in a specific order and verify that they do."],
        [28, "Check each step in your strategy. Is each step necessary? Can it be shortened or optimized in some way?"],
        [28, "Check each step in your strategy. Is each step feasible? What evidence supports this?"],
        [28, "Check to see if you have access to necessary resources, and if not, propose substitutes."],
        [28, "Check that your strategy is practical and functional, with respect to time, cost, safety, personnel, regulations, etc."],
        [28, "Take time to continuously assess your strategy throughout the process."],
        # Executing Suggestions 1-7
        [29, "Use authentic values and reasonable estimates for information needed to solve the problem"],
        [29, "Make sure that the information you are using applies to the conditions of the problem."],
        [29, "List the assumptions that you are making and provide a reason for why those are valid assumptions."],
        [29, "Double check that you are following all the steps in your strategy."],
        [29, "List any barriers that you are encountering in executing the steps"],
        [29, "Identify ways to overcome barriers in implementation steps of the strategy"],
        [29, "Check the outcome of each step of the strategy for effectiveness."],
        # (Latest update is July 19, 2022) Teamwork
        # Interacting Suggestions 1-6
        [30, "Speak up and share your ideas/insights with team members."],
        [30, "Listen to other team members who are sharing their ideas or insights and do not interrupt their communications."],
        [30, "Be sure that others can hear you speak and can see you face, so they can read your facial expressions and body language."],
        [30, "Explicitly react (nod, speak out loud, write a note, etc.) to contributions from other team members to indicate that you are engaged."],
        [30, "Restate the prompt to make sure everyone is at the same place on the task."],
        [30, "Have all members of the team consider the same task at the same time rather than working independently"],
        # Contributing Suggestions 1-6
        [31, "Acknowledge or point out particularly effective contributions."],
        [31, "Initiate discussions of agreement or disagreement with statements made by team members."],
        [31, "Contribute your insights and reasoning if you disagree with another member of the team."],
        [31, "Regularly ask members of the team to share their ideas or explain their reasoning."],
        [31, "Add information or reasoning to contributions from other team members."],
        [31, "Ask for clarification or rephrase statements of other team members to ensure understanding."],
        # Progressing Suggestions 1-7
        [32, "Minimize distractions and focus on the assignment (close unrelated websites or messaging on phone or computer, turn off music, put away unrelated materials)."],
        [32, "Redirect team members to current task."],
        [32, "Ask other team members for their input on a task to move discussion forward."],
        [32, "Ask for assistance if your team is stuck on a task and making little progress."],
        [32, "Compare progress on task to the time remaining on assignment."],
        [32, "Communicate to team members that you need to move on."],
        [32, "As a team, list tasks to be done and agree on order for these tasks."],
        # Building Community Suggestions 1-8
        [33, "Address team members by name."],
        [33, "Use inclusive (collective) team cues that draw all team members together."],
        [33, "Encourage every team member to contribute toward the goal."],
        [33, "Make sure everyone feels ready to begin the task."],
        [33, "Check that all team members are ready to move on to the next step in the task."],
        [33, "Encourage all team members to work together on the same tasks at the same time, as needed."],
        [33, "Celebrate team successes and persistence through roadblocks."],
        [33, "Invite other team members to provide alternative views and reasoning."],
    ]
    for suggestion in suggestions:
        create_suggestion(suggestion)