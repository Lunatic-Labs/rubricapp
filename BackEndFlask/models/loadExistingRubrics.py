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
        ["Teamwork", "Interacting with others and buliding on each other's individual strengths and skills, working toward a common goal."],
        # (Latest update is November 21, 2024) Metacognition
        ["Metacognition", "Being able to regulate one's thinking and learning through planning, monitoring, and evaluating one's efforts."],
        # (Latest update is May 28, 2025) Questions
        ["Questions", "Questioning aspects of the world around us that can be tested through observation or experimentation (empirical testing)."],        
        # Experimenting
        ["Experimenting", "Planning and carrying out systematic investigations to test a hypothesis or answer a question that provides evidence in the form of data."],
        # Mathematical
        ["Mathematical thinking", "Usage of mathematics and computation for establishing qualitative and quantitative relationships among variables."],
        # Modeling
        ["Modeling", "Usage and construction of models such as diagrams, drawings, physical replicas, mathematical representations, analogies, and computer simulations for representing ideas that have predictive and explanatory powers."],
        # Analyzing data
        ["Analyzing data", "Usage of tools such as tabulation, graphs, visualization, and statistical analysis to analyze and interpret patterns in data to derive meaning."],
        # Explaining phenomena
        ["Explaining phenomena", "Explaining a phenomenon of interest with multiple lines of empirical evidence"],
        # Arguing
        ["Arguing", "Engaging in argumentation by listening to, comparing, critiquing and evaluating competing ideas and claims and making evidence-based conclusions based on the merits of those arguments."],
        # Disseminating findings
        ["Disseminating findings", "Obtaining and evaluating information critically. Communicating generated ideas/explanations/conclusions clearly and persuasively."]
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
        # (Latest update is November 21, 2024) Metacognition Categories 1-4
        [8, "Planning", "Set learning goals and made plans for achieving them", completely],
        [8, "Monitoring", "Paid attention to progress on learning and understanding", completely],
        [8, "Evaluating", "Reviewed learning gains and/or performance and determined strengths and areas to improve", completely],
        [8, "Realistic Self-assessment", "Produced a self-assessment based on previous and current behaviors and circumstances, using reasonable judgment in future planning", completely],
        # (Latest update is May 28, 2025) Questions Categories 1-3
        [9, "Generating questions", "Generated a question(s) which, upon answering, explains a phenomenon.", completely],
        [9, "Generating sub-questions", "Broke down the previously asked question into sub-questions", completely],
        [9, "Generating hypothesis", "Generated a predictive/explanatory statement (hypothesis) that can be empirically tested.", completely],
        # Experimenting Categories 1-8
        [10, "Developing a scientifically sound plan", "Used scientific ideas and theories to plan an investigation to test a hypothesis or answer a question", completely],
        [10, "Planning for data collection", "Identified the data to be collected.", completely],
        [10, "Developing a safe plan", "Took all the safety protocols into consideration while planning the investigation.", completely],
        [10, "Developing an executable plan", "Took practical aspects and limitations into consideration in the planning of the investigation.", completely],
        [10, "Executing the plan safely", "Carried out the planned investigation in a way that ensures the safety of everyone present in the laboratory.", completely],
        [10, "Executing the plan", "Carried out the investigation in a systematic way and generated data that can act as evidence to support a claim or explanation.", completely],
        [10, "Documenting the investigation", "Documented all aspects of investigation such as observations, measurements, calculations, etc. clearly and legibly in a laboratory notebook.", completely],
        [10, "Planning a future investigation", "Planned a new experiment (or a future iteration of the current experiment) based on the results of the current investigation.", completely],
        # Mathematical thinking Categories 1-3
        [10, "Mathematical thinking", "Used any number of mathematical tools such as constructing and solving equations for establishing relationships among variables."],
        [10, "Preparing for computation", "Identified the problem that can be solved using computation and developed a plan for solving it.", completely],
        [10, "Preparing computation", "Used any number of computational tools, such as programming, simulation, etc., for modeling data or solving a problem.", completely],
        # Modeling Categories 1-3
        [11, "Evaluating models", "Evaluated a set of models for their relevancy before using.", completely],
        [11, "Using models", "Used existing models to make sense of the observations made or measurements taken.", completely],
        [11, "Developing models", "Developed new models or revised existing models to make sense of the observations made or measurements taken.", completely],
        # Analyzing data Categories 1-3
        [12, "Preparing for data analysis", "Prepared for data analysis by identifying relevant data and method(s)", completely],
        [12, "Analyzing the data", "Used any number of scientifically accepted tools such as graphs, statistics, etc., and analyzed the generated (or given) data to identify significant patterns and trends.", completely],
        [12, "Interpreting the data", "Interpreted the analyzed data to derive meaning/construct explanations/answer questions/know implications.", completely],
        # Explaining phenomena Categories 1-2
        [13, "Presenting evidence", "Listed the evidence required to support the explanation", ],
        [13, "Constructing explanations", "Constructed a logically sound explanation to provide explanatory accounts of the phenomenon of interest.", completely],
        # Arguing Categories 1-5
        [14, "Making claims", "Made the claim of the argument", completely],
        [14, "Presenting evidence", "Listed the evidence required to support the claim.", completely],
        [14, "Forming an argument from evidence", "Constructed a logically sound argument with reasoning that explains how the evidence supports the claim.", completely],
        [14, "Critiquing arguments", "Engaged in argumentation by critically evaluating competing arguments.", completely],
        [14, "Engaging in diabolical argumentation", "Engaged in verbal argumentation by articulating one’s argument and questioning competing ones.", completely],
        # (Latest update is June 17, 2025) Disseminating findings Categories 1-10
        [15, "Obtaining information", "Collected relevant information from multiple sources of scientific knowledge such as books, journal articles, technical databases, etc.", completely],
        [15, "Evaluating information", "Critically evaluated the reliability of the obtained information.", completely],
        [15, "Synthesing information", "Combined information obtained from different sources to suit the purpose of the current investigation.", completely],
        [15, "Intent", "Clearly conveys the purpose, and the content is well-aligned towards this intent", completely],
        [15, "Audience", "Uses language and delivery style that is consistent with the norms of the subject area and suitable for the audience", consistently],
        [15, "Organization", "Presents ideas in a logical and cohesive manner", consistently],
        [15, "Visual Representations", "Constructs and uses visual representations effectively and appropriately", consistently],
        [15, "Format and Style", "Selects a format and style that enhances the effectiveness of the communication", consistently],
        [15, "Mechanics (written words)", "Uses expected writing conventions for the form of communication", consistently],
        [15, "Delivery (oral)", "Uses voice and body language to convey the intended message in a clear and engaging manner", consistently]
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
        [1, "None"],
        # Evaluating Observable Characteristics 1-3
        [2, "Indicated what information is likely to be most relevant"],
        [2, "Determined the reliability of the source of information"],
        [2, "Determined the quality and accuracy of the information itself"],
        [2, "None"],
        # Analyzing Observable Characteristics 1-3
        [3, "Discussed information and explored possible meanings"],
        [3, "Identified general trends or patterns in the data/information that could be used as evidence"],
        [3, "Processed and/or transformed data/information to put it in forms that could be used as evidence"],
        [3, "None"],
        # Synthesizing Observable Characteristics 1-3
        [4, "Identified the relationships between different pieces of information or concepts"],
        [4, "Compared or contrasted what could be determined from different pieces of information"],
        [4, "Combined multiple pieces of information or ideas in valid ways to generate a new insight in conclusion"],
        [4, "None"],
        # Forming Arguments Structure Observable Characteristics 1-4
        [5, "Stated the conclusion or the claim of the argument"],
        [5, "Listed the evidence used to support the argument"],
        [5, "Linked the claim/conclusion to the evidence with focused and organized reasoning"],
        [5, "Stated any qualifiers that limit the conditions for which the argument is true"],
        [5, "None"],
        # Forming Arguments Validity Observable Characteristics 1-5
        [6, "The most relevant evidence was used appropriately to support the claim"],
        [6, "Reasoning was logical and effectively connected the data to the claim"],
        [6, "The argument was aligned with disciplinary/community concepts or practices"],
        [6, "Considered alternative or counter claims"],
        [6, "Considered evidence that could be used to refute or challenge the claim"],
        [6, "None"],
        # (Latest update is November, 2022) Formal Communication
        # Intent Observable Characteristics 1-3
        [7, "Clearly stated what the audience should gain from the communication"],
        [7, "Used each part of the communication to convey or support the main message"],
        [7, "Concluded by summarizing what was to be learned"],
        [7, "None"],
        # Audience Observable Characteristic 1-3
        [8, "Communicated to the full range of the audience, including novices and those with expertise"],
        [8, "Aligned the communication with the interests and background of the particular audience"],
        [8, "Used vocabulary that aligned with the discipline and was understood by the audience"],
        [8, "None"],
        # Organization Observable Characteristics 1-3
        [9, "There was a clear story arc that moved the communication forward"],
        [9, "Organizational cues and transitions clearly indicated the structure of the communication"],
        [9, "Sequence of ideas flowed in an order that was easy to follow"],
        [9, "None"],
        # Visual Representations Observable Characteristics 1-3
        [10, "Each figure conveyed a clear message"],
        [10, "Details of the visual representation were easily interpreted by the audience"],
        [10, "The use of the visual enhanced understanding by the audience"],
        [10, "None"],
        # Format and Style Observable Characteristics 1-3
        [11, "Stylistic elements were aesthetically pleasing and did not distract from the message"],
        [11, "Stylistic elements were designed to make the communication accessbile to the audience (size, colors, contrasts, etc.)"],
        [11, "The level of formality of the communication aligns with the setting, context, and purpose"],
        [11, "None"],
        # Mechanics Written Word Observable Characteristics 1-4
        [12, "Writing contained correct spelling, word choice, punctuation, and capitalization"],
        [12, "All phrases and sentences were grammatically correct"],
        [12, "All paragraphs (or slides) were well constructed around a central idea"],
        [12, "All figures and tables were called out in the narrative, and sources were correctly cited"],
        [12, "None"],
        # Delivery Oral Observable Characteristics 1-4
        [13, "Spoke loudly and clearly with a tone that indicated confidence and interest in the subject"],
        [13, "Vocal tone and pacing helped maintain audience interest"],
        [13, "Gestures and visual cues further oriented the audience to focus on particular items or messages"],
        [13, "Body language directed the delivery toward the audience and indicated the speaker was open to engagement"],
        [13, "None"],
        # (Latest update is December 29, 2021) Information Processing
        # Evaluating Observable Characteristics 1-5
        [14, "Established what needs to be accomplished with this information"],
        [14, "Identified what information is provided in the materials"],
        [14, "Indicated what information is relevant"],
        [14, "Indicated what information is NOT relevant"],
        [14, "Indicated why certain information is relevant or not"],
        [14, "None"],
        # Interpreting Observable Characteristics 1-4
        [15, "Labeled or assigned correct meaning to information (text, tables, symbols, diagrams)"],
        [15, "Extracted specific details from information"],
        [15, "Rephrased information in own words"],
        [15, "Identified patterns in information and derived meaning from them"],
        [15, "None"],
        # Manipulating or Transforming Extent Observable Characteristics 1-3
        [16, "Determined what information needs to be converted to accomplish the task"],
        [16, "Described the process used to generate the transformation"],
        [16, "Converted all relevant information into a different representation of format"],
        [16, "None"],
        # Manipulating or Transforming Accuracy Observable Characteristics 1-3
        [17, "Conveyed the correct or intended meaning of the information in the new representation or format."],
        [17, "All relevant features of the original information/data are presented in the new representation of format"],
        [17, "Performed the transformation without errors"],
        [17, "None"],
        # (Latest update is July 5, 2022) Interpersonal Communication
        # Speaking Observable Characteristics 1-4
        [18, "Spoke clear and loudly enough for all team members to hear"],
        [18, "Used a tone that invited other people to respond"],
        [18, "Used language that was suitable for the listeners and context"],
        [18, "Spoke for a reasonable length of time for the situation"],
        [18, "None"],
        # Listening Observable Characteristics 1-4
        [19, "Patiently listened without interrupting the speaker"],
        [19, "Referenced others' ideas to indicate listening and understanding"],
        [19, "Presented nonverbal cues to indicate attentiveness"],
        [19, "Avoided engaging in activities that diverted attention"],
        [19, "None"],
        # Responding Observable Characteristics 1-4
        [20, "Acknowledged other members for their ideas or contributions"],
        [20, "Rephrased or referred to what other group members have said"],
        [20, "Asked other group members to futher explain a concept"],
        [20, "Elaborated or extended on someone else's idea(s)"],
        [20, "None"],
        # (Latest update is April 24, 2023) Management
        # Planning Observable Characteristics 1-4
        [21, "Generated a summary of the starting and ending points"],
        [21, "Generated a sequence of steps or tasks to reach the desired goal"],
        [21, "Discussed a timeline or time frame for completing project tasks"],
        [21, "Decided on a strategy to share information, updates and progress with all team members"],
        [21, "None"],
        # Organizing Observable Characteristics 1-3
        [22, "Decided upon the necessary resources and tools"],
        [22, "Identified the availability of resources, tools or information"],
        [22, "Gathered necessary information and tools"],
        [22, "None"],
        # Coordinating Observable Characteristics 1-4
        [23, "Determined if tasks need to be delegated or completed by the team as a whole"],
        [23, "Tailored the tasks toward strengths and availability of team members"],
        [23, "Assigned specific tasks and responsibilities to team members"],
        [23, "Established effective communication strategies and productive interactions among team members"],
        [23, "None"],
        # Overseeing Observable Characteristics 1-5
        [24, "Reinforced responsibilities and refocused team members toward completing project tasks"],
        [24, "Communicated status, next steps, and reiterated general plan to accomplish goals"],
        [24, "Sought and valued input from team members and provided them with constructive feedback"],
        [24, "Kept track of remaining materials, team and person hours"],
        [24, "Updated or adapted the tasks or plans as needed"],
        [24, "None"],
        # (Latest update is September 16, 2022) Problem Solving
        # Analyzing the Situation Observable Characteristics 1-3
        [25, "Described the problem that needed to be solved or the decisions that needed to be made"],
        [25, "Listed complicating factors or constraints that may be important to consider when developing a solution"],
        [25, "Identified the potential consequences to stakeholders or surrounding"],
        [25, "None"],
        # Identifying Observable Characteristics 1-4
        [26, "Reviewed the organized the necessary information and resources"],
        [26, "Evaluated which available information and resources are critical to solving the problem"],
        [26, "Determined the limitations of the tools or information that was given or gathered"],
        [26, "Identified reliable sources that may provide additional needed information, tools, or resources"],
        [26, "None"],
        # Strategizing Observable Characteristics 1-3
        [27, "Identified potential starting and ending points for the strategy"],
        [27, "Determined general steps needed to get from starting point to ending point"],
        [27, "Sequenced or mapped actions in a logical progression"],
        [27, "None"],
        # Validating Observable Characteristics 1-4
        [28, "Reviewed strategy with respect to the identified scope"],
        [28, "Provided rationale as to how steps within the process were properly sequenced"],
        [28, "Identified ways the process or stragey could be futher improved or optimized"],
        [28, "Evaluated the practicality of the overall strategy"],
        [28, "None"],
        # Executing Observable Characteristics 1-4
        [29, "Used data and information correctly"],
        [29, "Made assumptions about the use of data and information that are justifiable"],
        [29, "Determined that each step is being done in the order and the manner that was planned."],
        [29, "Verified that each step in the process was providing the desired outcome."],
        [29, "None"],
        # (Latest update is July 19, 2022) Teamwork
        # Interacting Observable Characteristics 1-3
        [30, "All team members communicated ideas related to a common goal"],
        [30, "Team members responded to each other verbally or nonverbally"],
        [30, "Directed each other to tasks and information"],
        [30, "None"],
        # Constributing Observable Characteristics 1-4
        [31, "Acknowledged the value of the statements of other team members"],
        [31, "Invited other team members to participate in the conversation, particulary if they had not contributed in a while"],
        [31, "Expanded on statements of other team members"],
        [31, "Asked follow-up questions to clarify team members' thoughts"],
        [31, "None"],
        # Progressing Observable Characteristics 1-4
        [32, "Stayed on task, focused on the assignment with only brief interruptions"],
        [32, "Refocused team members to make more effective progress towards the goal"],
        [32, "Worked simultaneously as single unit on the common goal"],
        [32, "Checked time to monitor progress on task."],
        [32, "None"],
        # Building Community Observable Characteristics 1-5
        [33, "Created a sense of belonging to the team for all team members"],
        [33, "Acted as a single unit that did not break up into smaller, fragmented units for the entire task"],
        [33, "Openly and respectfully discussed questions and disagreements between team members"],
        [33, "Listened carefully to people, and gave weight and respect to their contributions"],
        [33, "Welcomed and valued the individual identity and experiences of each team member"],
        [33, "None"],
        # (Latest update is November 20) Metacognition
        # Planning Observable Characteristics 1-3
        [34, "Decided on a goal for the task"],
        [34, "Determined a strategy, including needed resources, to  use in the learning effort"],
        [34, "Estimated the time interval needed to reach the goal of the task"],
        [34, "None"],
        # Monitoring Observable Characteristics 1-4
        [35, "Checked understanding of things to be learned, noting which areas were challenging"],
        [35, "Assessed if strategies were effective, and adjusted strategies as needed"],
        [35, "Considered if additional resources or assistance would be helpful"],
        [35, "Kept track of overall progress on completing the task"],
        [35, "None"],
        # Evaluating Observable Characteristics 1-3
        [36, "Compared outcomes to personal goals and expectations"],
        [36, "Compared performance to external standard or feedback"],
        [36, "Identified which strategies were successful and which could be improved"],
        [36, "None"],
        # Realistic Self-assessment Observable Characteristics 1-4
        [37, "Focused the reflection on the skill or effort that was targeted"],
        [37, "Provided specific evidence from past or recent performances in the reflection"],
        [37, "Identified how circumstances supported or limited the completion of the task"],
        [37, "Made realistic plans (based on previous and current behaviors and circumstances) to improve future performance"],
        [37, "None"],
        # (Latest update is May 29) Questioning
        # Generating questions Observable characteristics 1-4
        [38, "Asked a question that seeks an explanatory account for a phenomenon of interest."],
        [38, "The question can be answered empirically."],
        [38, "The question is specific and limited in scope."],
        [38, "The question can be investigated within the scope of the college laboratory."],
        [38, "None"],
        # Generating sub-questions Observable characteristics 1-3
        [39, "Framed sub-questions that are easier to reliably answer compared to directly answering the question of interest."],
        [39, "Each sub-question explores the effect of varying one independent variable on one dependent variable."],
        [39, "If all the sub-questions are answered, they can meaningfully answer the question of interest."],
        [39, "None"],
        # Generating hypothesis Observable characteristics 1-4
        [40, "Generated an empirically testable hypothesis about a phenomenon of interest."],
        [40, "Justified the rationale behind the hypothesis that is consistent with scientific models/theories."],
        [40, "The hypothesis is testable within the scope of the college laboratory."],
        [40, "The hypothesis is specific and limited in scope."],
        [40, "None"],
        # Experimenting
        # Developing a scientifically sound plan Observable characteristics 1-4
        [41, "Clearly and concisely stated the objective of the investigation."],
        [41, "Determined if small-scale trial experiments are necessary."],
        [41, "Described the rationale/theory behind the experimental design."],
        [41, "Predicted the outcomes of the planned investigation."],
        [41, "None"],
        # Planning for data collection Observable characteristics 1-2
        [42, "Listed the data needed for the small-scale trial study or to answer the research question."],
        [42, "Prepared data tables that included a title, labeled rows and columns, units of measurement, etc."],
        [42, "None"],
        # Developing a safe plan Observable characteristics 1-4
        [43, "Described the various types of chemical hazards (health, explosion, etc.) and physical hazards (broken glass, hot plate, etc.) associated with the investigation."],
        [43, "Described the risks associated with chemical (respiratory distress, nausea, etc.) and physical hazards (laceration, skin burns, etc.)"],
        [43, "Described ways to minimize risks (isolating people from hazards, wearing PPE, etc.) associated with the hazards."],
        [43, "Described ways to act (using a fire extinguisher, cleaning a chemical spill, etc.) in case of a lab accident/chemical spill."],
        [43, "None"],
        # Developing an executable plan Observable characteristics 1-3
        [44, "Identified the appropriate glassware, reagents, instruments, etc. required for performing the experiment."],
        [44, "Described the experimental procedure in a comprehensive manner."],
        [44, "Detailed possible sources of errors and ways to mitigate them."],
        [44, "None"],
        # Executing the plan safely Observable characteristics 1-5
        [45, "Wore all the required PPE during the course of the investigation."],
        [45, "Followed safe handling of chemicals to minimize risks associated with chemical hazards."],
        [45, "Followed safe handling of glassware, heavy items etc. to minimize risks associated with physical hazards."],
        [45, "Correctly disposed of hazardous and non-hazardous materials following lab guidelines"],
        [45, "In case of an accident/chemical spill, acted following the safety protocols."],
        [45, "None"],
        # Executing the plan Observable characteristics 1-3
        [46, "Executed the investigation systematically by performing the adequate number of trials."],
        [46, "Used glassware and equipment appropriately such that measurement errors would be minimal."],
        [46, "Managed time effectively in the laboratory."],
        [46, "None"],
        # Documenting the investigation Observable characteristics 1-2
        [47, "Noted the observations (expected and unexpected), measurements, and outcomes carefully."],
        [47, "Organized the collected data clearly and systematically."],
        [47, "None"],
        # Planning a future investigation Observable characteristics 1-3
        [48, "Compared the predicted outcome with the actual outcome of the investigation."],
        [48, "Commented on the significance of the results obtained."],
        [48, "Developed a new experimental plan informed by the results of the current investigation."],
        [48, "None"],
        # Mathematical thinking
        # Mathematical thinking Observable characteristics 1-4
        [49, "Constructed equations or appropriate graphs to establish relationships among variables or model data."],
        [49, "Solved equations correctly to find solutions."],
        [49, "Used mathematically consistent representations and notations."],
        [49, "Used units and performed unit conversions accurately."],
        [49, "None"],
        # Preparing for computation Observable characteristics 1-2
        [50, "Broke down a complex problem into smaller, more manageable parts."],
        [50, "Wrote a meaningful plan that acts as a blueprint for the solution (algorithm)."],
        [50, "None"],
        # Performing computation Observable characteristics 1-3
        [51, "Wrote an executable computer code (program) to model data or solve a problem."],
        [51, "Modeled a chemical system using computer simulation software with reasonable accuracy."],
        [51, "Debugged the computational tool when it did not work as intended."],
        [51, "None"],
        # Modeling
        # Evaluating models Observable characteristics 1-3
        [52, "Considered the assumptions that can limit the usefulness of existing models."],
        [52, "Evaluated existing models for their utility and limitations."],
        [52, "Justified the choice of model based on the evaluation."],
        [52, "None"],
        # Using models Observable characteristics 1-4
        [53, "Used models to make predictions."],
        [53, "Used models to construct explanations or communicate ideas."],
        [53, "Used models to find the needed information."],
        [53, "Used models to provide a mechanistic account of the phenomenon under study."],
        [53, "None"],
        # Developing models Observable characteristics 1-4
        [54, "Stated what the developed or revised model needs to accomplish."],
        [54, "Listed the assumptions made to develop/revise the model."],
        [54, "Developed a representation/relationship among variables to predict and/or explain phenomena of interest."],
        [54, "Listed the utility/limitations of the model."],
        [54, "None"],
        # Analyzing data
        # Preparing for data analysis Observable characteristics 1-4
        [55, "Identified the information required to achieve the objective of the investigation."],
        [55, "Identified the relevant data for analysis."],
        [55, "Identified the appropriate method(s) for data analysis."],
        [55, "Justified the chosen method of data analysis as to why it is useful in the current context."],
        [55, "None"],
        # Analyzing the data Observable characteristics 1-3
        [56, "Plotted an appropriate graph or showed work for a statistical test or performed calculations correctly."],
        [56, "Extracted useful information in the form of a pattern or a numerical value for data interpretation."],
        [56, "Highlighted limitations of the analyzed data."],
        [56, "None"],
        # Interpreting the data Observable characteristics 1-4
        [57, "Assigned correct meaning to the results of a graphical plot, statistical test, or calculation."],
        [57, "Drew relevant implications based on the analyzed data."],
        [57, "Referenced pieces of analyzed and external data that can act as evidence to justify the derived meaning."],
        [57, "Commented on the robustness or the trustworthiness of the conclusion."],
        [57, "None"],
        # Explaining phenomena
        # Presenting evidence Observable characteristics 1-3
        [58, "Listed valid and reliable evidence to support the claim."],
        [58, "The evidence listed is necessary."],
        [58, "The evidence listed is sufficient."],
        [58, "None"],
        # Constructing explanations Observable characteristics 1-3
        [59, "Identified the phenomenon that warrants an explanation."],
        [59, "Constructed an explanation that gives a causal account of the phenomenon at a sub-microscopic level."],
        [59, "Combined multiple ideas in valid ways to construct the explanation."],
        [59, "None"],
        # Arguing
        # Making claims Observable characteristics 1-3
        [60, "Stated the claim or the conclusion of the argument."],
        [60, "Stated possible alternative claims."],
        [60, "Stated the conditions under which the claim holds true."],
        [60, "None"],
        # Presenting evidence Observable characteristics 1-3
        [61, "Listed valid and reliable evidence to support the claim."],
        [61, "The evidence listed is necessary."],
        [61, "The evidence listed is sufficient."],
        [61, "None"],
        # Forming an argument from evidence Observable characteristics 1-2
        [62, "Linked the claim to the evidence with logically sound reasoning rooted in scientific ideas/theories."],
        [62, "Used multiple pieces of evidence coherently to support the claim."],
        [62, "None"],
        # Critiquing arguments Observable characteristics 1-3
        [63, "Critically evaluated the merits and limitations of competing arguments (usually from peers)."],
        [63, "Refined one’s own argument in the light of contradictory evidence (usually from peers)."],
        [63, "Reached an evidence-based conclusion based on the merits of all the arguments presented."],
        [63, "None"],
        # Engaging in diabolical argumentation Observable characteristics 1-5
        [64, "Articulated logically sound argument to justify one’s claims."],
        [64, "Clarified their argument when requested."],
        [64, "Responded adequately to the questions and challenges posed."],
        [64, "Listened to all the arguments made by peers."],
        [64, "Supported or challenged competing arguments in a meaningful way."],
        [64, "None"],
        # Disseminating findings 
        # Obtaining information Observable characteristics 1-3
        [65, "Identified source(s) of the information needed for the current investigation/study undertaken."],
        [65, "Extracted relevant and necessary information from the referenced source(s)."],
        [65, "Cited the source of information in any of the formats accepted by the scientific community."],
        [65, "None"],
        # Evaluating information Observable characteristics 1-2
        [66, "Obtained information from trustworthy sources."],
        [66, "Determined the quality and accuracy of the information itself."],
        [66, "None"],
        # Synthesing information Observable characteristics 1-2
        [67, "Combined multiple pieces of information in valid ways."],
        [67, "Paraphrased the information without copying verbatim from the source."],
        [67, "None"],
        # Communicating information Observable characteristics# Intent Observable Characteristics 1-3
        [68, "Clearly stated what the audience should gain from the communication"],
        [68, "Used each part of the communication to convey or support the main message"],
        [68, "Concluded by summarizing what was to be learned"],
        [68, "None"],
        # Audience Observable Characteristic 1-3
        [69, "Communicated to the full range of the audience, including novices and those with expertise"],
        [69, "Aligned the communication with the interests and background of the particular audience"],
        [69, "Used vocabulary that aligned with the discipline and was understood by the audience"],
        [69, "None"],
        # Organization Observable Characteristics 1-3
        [70, "There was a clear story arc that moved the communication forward"],
        [70, "Organizational cues and transitions clearly indicated the structure of the communication"],
        [70, "Sequence of ideas flowed in an order that was easy to follow"],
        [70, "None"],
        # Visual Representations Observable Characteristics 1-3
        [71, "Each figure conveyed a clear message"],
        [71, "Details of the visual representation were easily interpreted by the audience"],
        [71, "The use of the visual enhanced understanding by the audience"],
        [71, "None"],
        # Format and Style Observable Characteristics 1-3
        [72, "Stylistic elements were aesthetically pleasing and did not distract from the message"],
        [72, "Stylistic elements were designed to make the communication accessbile to the audience (size, colors, contrasts, etc.)"],
        [72, "The level of formality of the communication aligns with the setting, context, and purpose"],
        [72, "None"],
        # Mechanics Written Word Observable Characteristics 1-4
        [73, "Writing contained correct spelling, word choice, punctuation, and capitalization"],
        [73, "All phrases and sentences were grammatically correct"],
        [73, "All paragraphs (or slides) were well constructed around a central idea"],
        [73, "All figures and tables were called out in the narrative, and sources were correctly cited"],
        [73, "None"],
        # Delivery Oral Observable Characteristics 1-4
        [74, "Spoke loudly and clearly with a tone that indicated confidence and interest in the subject"],
        [74, "Vocal tone and pacing helped maintain audience interest"],
        [74, "Gestures and visual cues further oriented the audience to focus on particular items or messages"],
        [74, "Body language directed the delivery toward the audience and indicated the speaker was open to engagement"],
        [74, "None"],
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
        [1, "Nothing specific at this time"],
        # Evaluating Suggestions 1-5
        [2, "Review provided material and circle, highlight, or otherwise indicate information that may be used as evidence in reaching a conclusion."],
        [2, "Write down the other information (prior knowledge) that might be useful to lead to/support a possible conclusion."],
        [2, "Set aside any information, patterns, or insights that seem less relevant to addressing the situation at hand."],
        [2, "Consider whether the information was obtained from a reliable source (textbook, literature, instructor, websites with credible authors)"],
        [2, "Determine the quality of the information and whether it is sufficient to answer the question."],
        [2, "Nothing specific at this time"],
        # Analyzing Suggestions 1-5
        [3, "Interpret and label key pieces of information in text, tables, graphs, diagrams."],
        [3, "State in your own words what information represents or means."],
        [3, "Identify general trends in information, and note any information that doesn't fit the pattern."],
        [3, "Check your understanding of information with others and discuss any differences in understanding."],
        [3, "State how each piece of information, pattern, or insight can be used to reach a conclusion or support your claim."],
        [3, "Nothing specific at this time"],
        # Synthesizing Suggestions 1-5
        [4, "Look for two or more pieces or types of information that can be connected and state how they can be related to each other."],
        [4, "Write out the aspects that are similar and different in various pieces of information."],
        [4, "Map out how the information and/or concepts can be combined to support an argument or reach a conclusion."],
        [4, "Write a statement that summarizes the integration of the information and conveys a new understanding."],
        [4, "List the ways in which synthesized information could be used as evidence."],
        [4, "Nothing specific at this time"],
        # Forming Arguments Structure Suggestions 1-7
        [5, "Review the original goal - what question were you trying to answer?"],
        [5, "Clearly state your answer to the question (your claim or conclusion)."],
        [5, "Review the information you previously evaluated, analyzed and/or synthesized and decide what evidence supports your claim."],
        [5, "List each piece of evidence that you are using to support your argument."],
        [5, "Explain how each piece of information links to and supports your answer."],
        [5, "Make sure your answer includes the claim, information and reasoning."],
        [5, "Make sure the claim or conclusion answers the question."],
        [5, "Nothing specific at this time"],
        # Forming Arguments Validity Suggestions 1-5
        [6, "Provide a clear statement that articulates why the evidence you chose leads to the claim or conclusion."],
        [6, "Check to make sure that your reasoning is consistent with what is accepted in the discipline or context."],
        [6, "Test your ideas with others, and ask them to judge the quality of the argument or indicate how the argument could be made more convincing."],
        [6, "Ask yourself (and others) if there is evidence or data that doesn't suport your conclusion or might contradict your claim."],
        [6, "Consider if there are alternative explanations for the data you are considering."],
        [6, "Nothing specific at this time"],
        # (Latest update is November, 2022) Formal Communication
        # Intent Suggestions 1-5
        [7, "Decide if your main purpose is to inform, to persuade, to argue, to summarize, to entertain, to inspire, etc."],
        [7, "Write out the intent of the communication you are creating and refer back to it as you generate your material."],
        [7, "Make sure the purpose of the communication is presented early to orient your audience to the focus of the communication."],
        [7, "Check that the focus of each segment is clearly linked to the main message or intent of the communication."],
        [7, "Summarize the main ideas to wrap up the presentation (refer back to the initial statement(s) of what was to be learned)."],
        [7, "Nothing specific at this time"],
        # Audience Suggestions 1-6
        [8, "Identify the range and level of expertise and interest your audience has for the topic and design your communication to have aspects that will engage all members of the audience."],
        [8, "Identify what the audience needs to know to understand the narrative."],
        [8, "Plan how you will interpret key data or details in a meaningful way for non-experts."],
        [8, "Only use jargon when it is understood readily by most members of your audience, and it makes the communication more effective and succinct."],
        [8, "Check that the vocabulary, sentence structure, and tone used in your communication is aligned with the level of your audience."],
        [8, "Collect feedback from others on drafts to make sure the core message of the communication is easily understood."],
        [8, "Nothing specific at this time"],
        # Organization Suggestions 1-6
        [9, "Consider the 'story' that you want to tell. Ask yourself what's the main message you want the audience to leave with."],
        [9, "Identify the critical points for the story (do this before you prepare the actual communication) and map out the key points."],
        [9, "Summarize sections before transitioning to the next topic."],
        [9, "Repeat key ideas to ensure the audience can follow the main idea."],
        [9, "Make sure that you introduce prerequisite information early in the communication."],
        [9, "Try more than one order for the topics, to see if overall flow is improved."],
        [9, "Nothing specific at this time"],
        # Visual Representations Suggestions 1-6
        [10, "Plan what types of figures are needed to support the narrative - consider writing out a figure description before you construct it."],
        [10, "Avoid including unnecessary details that detract from the intended message."],
        [10, "Consider how many messages each visual is trying to convey and divide up if the complexity or density is overwhelming."],
        [10, "Be sure labels, text, and small details can be easily read."],
        [10, "Provide a caption that helps interpret the key aspects of the visual."],
        [10, "Seek feedback on visuals to gauge initial reaction and ease of interpretation."],
        [10, "Nothing specific at this time"],
        # Format Style Suggestions 1-6
        [11, "Use titles (headers) and subtitles (subheaders) to orient the audience and help them follow the narrative."],
        [11, "Look at pages or slides as a whole for an easy-to-read layout, such as white space, headers, line spacing, etc."],
        [11, "Use emphases where needed to direct audience attention to important aspects."],
        [11, "Use colors to carefully highlight or call attention to key elements to enhance your narrative without distracting from your message."],
        [11, "Make sure that text, figures, and colors are readable and accessible for all."],
        [11, "Seek feedback to confirm that the language, tone, and style of your communication match the level of formality needed for your context and purpose."],
        [11, "Nothing specific at this time"],
        # Mechanics Written Words Suggestions 1-7
        [12, "Proofread your writing for spelling errors, punctuation, autocorrects, etc."],
        [12, "Review sentence structure for subject-verb agreement, consistent tense, run on sentences, and other structural problems."],
        [12, "Verify that items in lists are parallel."],
        [12, "List the themes of each paragraph (or slide).  If there are more than 2, consider starting a new paragraph (or slide)."],
        [12, "Confirm that each figure, table, etc has been numbered consecutively and has been called out and discussed further in the narrative."],
        [12, "Confirm that all work that has been published elsewhere or ideas/data that were not generated by the author(s) has been properly cited using appropriate conventions."],
        [12, "Ask someone else to review and provide feedback on your work."],
        [12, "Nothing specific at this time"],
        # Delivery Oral Suggestions 1-5
        [13, "Practice for others or record your talk; i. be sure that your voice can be heard, and your word pronunciations are clear. ii. listen for “ums”, “like”, or other verbal tics/filler words that can detract from your message. iii. observe your natural body language, gestures, and stance in front of the audience to be sure that they express confidence and enhance your message."],
        [13, "Add variety to your speed or vocal tone to emphasize key points or transitions."],
        [13, "Try to communicate/engage as if telling a story or having a conversation with the audience."],
        [13, "Face the audience and do not look continuously at the screen or notes."],
        [13, "Make eye contact with multiple members of the audience."],
        [13, "Nothing specific at this time"],
        # (Latest update is December 29, 2021) Information Processing
        # Evaluating Suggestions 1-6
        [14, "Restate in your own words the task or question that you are trying to address with this information."],
        [14, "Summarize the pieces of information that you have been given, and check with others to be sure that none has been overlooked."],
        [14, "Add your own notes to information as you determine what it is."],
        [14, "Write down/circle/highlight the information that is needed to complete the task."],
        [14, "Put a line through info that you believe is not needed for the task"],
        [14, "Describe in what ways a particular piece of information may (or may not) be useful (or required) in completing the task"],
        [14, "Nothing specific at this time"],
        # Interpreting Suggestions 1-5
        [15, "Add notes or subtitles to key pieces of information found in text, tables, graphs, diagrams to describe its meaning."],
        [15, "State in your own words what information represents or means."],
        [15, "Summarize the ideas or relationships the information might convey."],
        [15, "Determine general trends in information and note any information that doesn't fit the trend"],
        [15, "Check your understanding of information with others"],
        [15, "Nothing specific at this time"],
        # Manipulating or Transforming Extent Suggestions 1-5
        [16, "Identify how the new format of the information differs from the provided format."],
        [16, "Identify what information needs to be transformed and make notations to ensure that all relevant information has been included."],
        [16, "Review the new representation or format to be sure all relevant information has been included."],
        [16, "Consider what information was not included in the new representation or format and make sure it was not necessary."],
        [16, "Check with peers to see if there is agreement on the method of transformation and final result."],
        [16, "Nothing specific at this time"],
        # Manipulating or Transforming Accuracy Suggestions 1-4
        [17, "Write down the features that need to be included in the new form."],
        [17, "Be sure that you have carefully interpreted the original information and translated that to the new form."],
        [17, "Carefully check to ensure that the original information is correctly represented in the new form."],
        [17, "Verify the accuracy of the transformation with others."],
        [17, "Nothing specific at this time"],
        # (Latest update is July 5, 2022) Interpersonal Communication
        # Speaking Suggestions 1-6
        [18, "Direct your voice towards the listeners and ask if you can be heard."],
        [18, "Use a tone that is respectful and encouraging rather than confromtational or harsh."],
        [18, "Choose language that doesn't make others uncomfortable; don't make the environment uninviting."],
        [18, "Carefully choose your words to align with the nature of the topic and the audience."],
        [18, "Speak for a length of time that allows frequent back and forth conversation."],
        [18, "Provide a level of detail appropriate to convey your main idea."],
        [18, "Nothing specific at this time"],
        # Listening Suggestions 1-7
        [19, "Allow team members to finish their contribution."],
        [19, "Indicate if you can't hear someone's spoken words."],
        [19, "Restate or write down what was communicated."],
        [19, "Give credit and acknowledge people by name."],
        [19, "Face the team member that is speaking and make eye contact."],
        [19, "Use active-listening body language or facial expressions that indicate attentiveness."],
        [19, "Remove distractions and direct your attention to the speaker."],
        [19, "Nothing specific at this time"],
        # Responding Suggestions 1-5
        [20, "Let team members know when they make a productive contribution."],
        [20, "State what others have said in your own words and confirm understanding."],
        [20, "Ask a follow-up question or ask for clarification."],
        [20, "Reference what others have said when you build on their ideas."],
        [20, "Offer an altenative to what a team member said."],
        [20, "Nothing specific at this time"],
        # (Latest update is April 24, 2023) Management
        # Planning Suggestions 1-6
        [21, "Write down the general starting point and starting conditions."],
        [21, "Make sure that you understand the final goal or desired product - seek clarity when the goals are not well defined."],
        [21, "Sketch out a diagram or flowchart that shows the general steps in the process."],
        [21, "Double check to make sure that steps are sequenced sensibly."],
        [21, "Identify time needed for particular steps or other time constraints."],
        [21, "Make a regular plan to update progress."],
        [21, "Nothing specific at this time"],
        # Organizing Suggestions 1-3
        [22, "List the tools, resources, or information that the group needs to obtain."],
        [22, "List the location of the tools, resources, or information at the group's disposal."],
        [22, "Strategize about how to obtain the additional/needed tools, resources, or information."],
        [22, "Nothing specific at this time"],
        # Coordinating Suggestions 1-7
        [23, "Review the number of people you  have addressing each task, and be sure that it is right-sized to make progress."],
        [23, "Analyze each task for likelihood of success, and be sure you have it staffed appropriately."],
        [23, "Discuss strengths, availability,  and areas for contribution with each team member."],
        [23, "Check to make sure that each team member knows and understands their assigned roles/tasks."],
        [23, "Delegate tasks outside the team if necessary, especially if the task is too large to complete in the given time."],
        [23, "Establish a mechanism to share status and work products."],
        [23, "Set up meetings to discuss challenges and progress."],
        [23, "Nothing specific at this time"],
        # Overseeing Suggestions 1-8
        [24, "Check in regularly with each team member to review their progress on tasks."],
        [24, "Provide a list of steps towards accomplishing the goal that all can refer to and check off each step when completed."],
        [24, "Set up a time to listen to and respond to concerns of each team member and give feedback/support on their progress and strategies."],
        [24, "Create and maintain inventory lists of needed resources, noting ones that are more likely to run short."],
        [24, "Develop a strategy to make up for any shortfalls of materials."],
        [24, "Reassign team members to activities that need more attention or person hours as other steps are completed."],
        [24, "Evaluate whether team members should be reassigned to tasks that better align with their skill sets."],
        [24, "Check to see if the original plan for project completion is still feasible; make changes if necessary."],
        [24, "Nothing specific at this time"],
        # (Latest update is September 16, 2022) Problem Solving
        # Analyzing The Situation Suggestions 1-6
        [25, "Read closely, and write down short summaries as you read through the entire context of the problem"],
        [25, "Draw a schematic or diagram that shows how aspects of the problem relate to one another"],
        [25, "Brainstorm or identify possible factors or constraints that are inherent or may be related to the stated problem or given situation"],
        [25, "Prioritize the complicating factors from most to least important"],
        [25, "List anything that will be significantly impacted by your decision (such as conditions, objects, or people)"],
        [25, "Deliberate on the consequences of generating a wrong strategy or solution"],
        [25, "Nothing specific at this time"],
        # Identifying Suggestions 1-5
        [26, "Highlight or annotate the provided information that may be needed to solve the problem."],
        [26, "List information or principles that you already know that can help you solve the problem."],
        [26, "Sort the given and gathered information/resources as 'useful' or 'not useful.'"],
        [26, "List the particular limitations of the provided information or tools."],
        [26, "Identify ways to access any additional reliable information, tools or resources that you might need."],
        [26, "Nothing specific at this time"],
        # Strategizing Suggestions 1-5
        [27, "Write down a reasonable place to start and add a reasonable end goal"],
        [27, "Align any two steps in the order or sequence that they must happen. Then, add a third step and so on."],
        [27, "Consider starting at the end goal and working backwards"],
        [27, "Sketch a flowchart indicating some general steps from start to finish."],
        [27, "Add links/actions, or processes that connect the steps"],
        [27, "Nothing specific at this time"],
        # Validating Suggestions 1-7
        [28, "Summarize the problem succinctly - does your strategy address each aspect of the problem?"],
        [28, "Identify any steps that must occur in a specific order and verify that they do."],
        [28, "Check each step in your strategy. Is each step necessary? Can it be shortened or optimized in some way?"],
        [28, "Check each step in your strategy. Is each step feasible? What evidence supports this?"],
        [28, "Check to see if you have access to necessary resources, and if not, propose substitutes."],
        [28, "Check that your strategy is practical and functional, with respect to time, cost, safety, personnel, regulations, etc."],
        [28, "Take time to continuously assess your strategy throughout the process."],
        [28, "Nothing specific at this time"],
        # Executing Suggestions 1-7
        [29, "Use authentic values and reasonable estimates for information needed to solve the problem"],
        [29, "Make sure that the information you are using applies to the conditions of the problem."],
        [29, "List the assumptions that you are making and provide a reason for why those are valid assumptions."],
        [29, "Double check that you are following all the steps in your strategy."],
        [29, "List any barriers that you are encountering in executing the steps"],
        [29, "Identify ways to overcome barriers in implementation steps of the strategy"],
        [29, "Check the outcome of each step of the strategy for effectiveness."],
        [29, "Nothing specific at this time"],
        # (Latest update is July 19, 2022) Teamwork
        # Interacting Suggestions 1-6
        [30, "Speak up and share your ideas/insights with team members."],
        [30, "Listen to other team members who are sharing their ideas or insights and do not interrupt their communications."],
        [30, "Be sure that others can hear you speak and can see you face, so they can read your facial expressions and body language."],
        [30, "Explicitly react (nod, speak out loud, write a note, etc.) to contributions from other team members to indicate that you are engaged."],
        [30, "Restate the prompt to make sure everyone is at the same place on the task."],
        [30, "Have all members of the team consider the same task at the same time rather than working independently"],
        [30, "Nothing specific at this time"],
        # Contributing Suggestions 1-6
        [31, "Acknowledge or point out particularly effective contributions."],
        [31, "Initiate discussions of agreement or disagreement with statements made by team members."],
        [31, "Contribute your insights and reasoning if you disagree with another member of the team."],
        [31, "Regularly ask members of the team to share their ideas or explain their reasoning."],
        [31, "Add information or reasoning to contributions from other team members."],
        [31, "Ask for clarification or rephrase statements of other team members to ensure understanding."],
        [31, "Nothing specific at this time"],
        # Progressing Suggestions 1-7
        [32, "Minimize distractions and focus on the assignment (close unrelated websites or messaging on phone or computer, turn off music, put away unrelated materials)."],
        [32, "Redirect team members to current task."],
        [32, "Ask other team members for their input on a task to move discussion forward."],
        [32, "Ask for assistance if your team is stuck on a task and making little progress."],
        [32, "Compare progress on task to the time remaining on assignment."],
        [32, "Communicate to team members that you need to move on."],
        [32, "As a team, list tasks to be done and agree on order for these tasks."],
        [32, "Nothing specific at this time"],
        # Building Community Suggestions 1-8
        [33, "Address team members by name."],
        [33, "Use inclusive (collective) team cues that draw all team members together."],
        [33, "Encourage every team member to contribute toward the goal."],
        [33, "Make sure everyone feels ready to begin the task."],
        [33, "Check that all team members are ready to move on to the next step in the task."],
        [33, "Encourage all team members to work together on the same tasks at the same time, as needed."],
        [33, "Celebrate team successes and persistence through roadblocks."],
        [33, "Invite other team members to provide alternative views and reasoning."],
        [33, "Nothing specific at this time"],
        # (Latest update is November 20, 2024) Metacognition
        # Planning Suggestions 1-7
        [34, "Describe three or four ways this learning task connects to other topics and components in the course."],
        [34, "Identify 2-3 ways that this learning task will help you meet the intended learning goals."],
        [34, "Skim the assignment to get a sense of what is involved and to see what resources you will need to support your work."],
        [34, "List the things that need to be completed for this assignment or task to be considered successful."],
        [34, "Make a detailed plan for how you will complete the assignment."],
        [34, "Decide if it makes sense to break the overall assignment into working segments, and figure out how long each would take."],
        [34, "Estimate the total amount of time that you will need to complete the task."],
        [34, "Nothing specific at this time"],
        # Monitoring Suggestions 1-5
        [35, "Read the reflection prompt and objectives before you start and decide what skills or processes you should monitor during the task."],
        [35, "Review objectives frequently while completing a task to check your understanding of important concepts."],
        [35, "Survey your environment and mindset for distractions that block you from enacting your strategies and making progress (devices, noise, people, physical needs)."],
        [35, "Pay attention to where in a process or strategy you are getting stuck, and identify what resources or support would help you to get past that point."],
        [35, "Periodically pause and determine the percentage of work that you finished and compare it to the total time available to complete the work."],
        [35, "Nothing specific at this time"],
        # Evaluating Suggestions 1-7
        [36, "Compare how you actually performed to your initial expectations. Identify which expectations were met and where you fell short."],
        [36, "For areas where you met your initial expectations, list your top three effective strategies or activities."],
        [36, "For areas where you did not meet your initial expectations, decide if your goals were realistic."],
        [36, "If your initial expectations were not realistic, make a list of issues you didn’t account for in your goal setting."],
        [36, "For areas where your expectations were realistic but not met, identify what factors made you fall short of your target."],
        [36, "Compare how you performed to an external standard or external feedback on your performance. Identify which criteria were met and which require additional work."],
        [36, "For areas where you met the criteria, list your top three effective strategies or activities.Describe three or four ways this learning task connects to other topics and components in the course."],
        [36, "For areas where you did not meet the criteria, list at least two areas or strategies where you need further work."],
        [36, "Determine if you planned your time well by comparing the number of hours you allocated to the number of hours you actually needed to meet your goals."],
        [36, "Decide if you were motivated or engaged in this task, and describe how that impacted your efforts."],
        [36, "If you weren’t very motivated for this task, generate some ideas for how you could better motivate yourself.  Identify 2-3 ways that this learning task will help you meet the intended learning goals."],
        [36, "Nothing specific at this time"],
        # Realistic Self-assessment Suggestions 1-7
        [37, "Before you start the reflection, review the prompt for the reflection or your goals for the reflection and make sure you are focusing on the intended skill or process (e.g. don’t comment on teamwork if asked to reflect on critical thinking)."],
        [37, "List the specific actions that you took in completing this task, including planning and monitoring actions in addition to the task itself.  Which are similar to past approaches?  Which are different?"],
        [37, "Considering the actions listed above and your typical approaches; rank them in terms of most productive to least productive."],
        [37, "Identify the unproductive behavior or work habit you should change to most positively impact your performance and determine a strategy for how to change it."],
        [37, "Consider the contextual factors (physical surroundings, time constraints, life circumstances) that affected your performance; note how your strategies need to be altered to account for them to improve future performance."],
        [37, "Summarize 2-3 specific strategies you’ve identified to improve your performance on future tasks."],
        [37, "Ask someone who knows you or your work well to review your self-assessment. Ask them if you accurately summarized your past efforts and if they think your future strategies are realistic for you."],
        [37, "Nothing specific at this time"],
        # (Latest update is May 29, 2025) Questioning
        # Generating questions Suggestions 1-4
        [38, "Be curious, observant, and skeptical since these traits are often the basis for generating scientific questions."],
        [38, "Reflect on whether the question you ask can be answered by collecting evidence through observation or experimentation."],
        [38, "Have a narrow and specific goal for your question, since a broad question is difficult to answer."],
        [38, "Reflect on the feasibility of answering the question using the materials and technical support available in the college laboratory."],
        # Generating sub-questions Suggestions 1-4
        [39, "Reflect on the scope of the question and identify all the variables at play."],
        [39, "Divide the question into sub-questions, each of which tackles a part of the question."],
        [39, "Frame questions that seek a relationship between one dependent and one independent variable while keeping the rest constant."],
        [39, "Reflect on whether answering the sub-questions establishes relationships between various variables in the question of interest."],
        # Generating hypothesis Suggestions 1-4
        [40, "Frame your hypothesis such that it can be tested by collecting data through observation and experimentation."],
        [40, "Identify the factors that guided your process of hypothesizing such as results from previous work, your observations, etc."],
        [40, "Reflect on the feasibility of testing the hypothesis using the materials and technical support available in the college laboratory."],
        [40, "Generate a hypothesis that has a specific goal and is narrow in scope since a generic hypothesis is difficult to test."],
        # Experimenting
        # Developing a scientifically sound plan Suggestions 1-6
        [41, "Reflect on the investigation's purpose."],
        [41, "State whether you are planning to answer a question, conduct an exploratory experiment, or test a hypothesis."],
        [41, "Identify a few mock trials to perform that give you a sense of the actual investigation, such as feasibility, possible issues, etc."],
        [41, "Describe what scientific ideas (theories/equations/relationships/concepts) are related to your aim/objective/question."],
        [41, "Identify all the possible outcomes based on your theoretical and practical understanding of the investigation."],
        [41, "Identify the more probable outcomes based on the scientific concepts at work in the investigation."],
        # Planning for data colleciton Suggestions 1-7
        [42, "Identify the variables (dependent and independent) and the controls."],
        [42, "Justify why the data to be collected can be considered as evidence for the investigation."],
        [42, "Identify the limitations of the instruments/method to be used (e.g. precision of instruments, number of trials)."],
        [42, "Ensure you have separate tables for each type or phase of the experiment."],
        [42, "Write a brief description for each table, stating what is being recorded in it."],
        [42, "Identify what information will be needed such as dependent and independent variables, controls, observations, etc."],
        [42, "Make enough columns to record all the information and enough rows to record all the trials."],
        # Developing a safe plan Suggestions 1-7
        [43, "Familiarize yourself with the RAMP (Recognize hazards, Assess risks, Minimize risks, Prepare for emergencies) framework."],
        [43, "Identify the chemicals being used and locate SDS (safety data sheet) for them."],
        [43, "Familiarize yourself with different notations (GHS hazard pictograms, NFPA ratings, etc.) in the SDS."],
        [43, "Familiarize yourself with different sections (toxicological information, accidental release measures, etc.) in the SDS."],
        [43, "Identify the tools, instruments, glassware, etc. being used as a part of the investigation."],
        [43, "Identify the hazards, risks, and ways to minimize those risks associated with the tools, instruments, glassware, etc. being used."],
        [43, "Consider taking additional training such as fume hood training, chemical spill training, etc. to plan experiments in a safe way."],
        # Developing an executable plan Suggestions 1-8
        [44, "Identify all the requirements for the current investigation by reflecting on how to collect the data you plan to collect."],
        [44, "Consider the precision of the data required while selecting the instruments, since not all instruments are equally precise."],
        [44, "Consider factors such as the volume and number of glassware items, as well as the concentration and quantity of reagents required"],
        [44, "Describe every step of the procedure with details such as the duration of each step, data, and observations to be noted, etc."],
        [44, "Detail the steps of the experiment in a format that is easy to follow, such as bullet points, flowcharts, etc."],
        [44, "Identify sources of random errors such as inconsistency in measurements between trials, variation in lab conditions over time, etc."],
        [44, "Identify sources of systematic errors such as incorrect calibration of instruments, incorrect concentration of chemicals, etc."],
        [44, "Incorporate strategies to mitigate the errors such as taking repeated measurements, routinely calibrating equipment, etc."],
        # Executing the plan safely Suggestions 1-7
        [45, "Keep PPE in designated cubbies if allotted. If not, keep them in sealed Ziplock covers in your bag so you don’t forget to get them."],
        [45, "Learn about proper and improper ways to use PPE."],
        [45, "Take short breaks during lab if PPE becomes uncomfortable."],
        [45, "Familiarize yourself with the proper ways to use every chemical, glassware, etc. that is needed for the investigation."],
        [45, "Call the TA or the instructor if you are uncertain about how to safely operate in the lab."],
        [45, "Locate correct disposal locations before the lab such as sharps bin, biohazard bin, liquid waste, etc."],
        [45, "Know how to access eye wash stations, safety showers, chemical spill kit, first aid kit, etc. before the lab."],
        # Executing the plan Suggestions 1-8
        [46, "Come in prepared and ready to execute the plan you have developed."],
        [46, "Monitor the way you are executing is in line with the developed plan."],
        [46, "Assess the quality of the data as you go – are the values consistent? do they fall within reasonable limits of expected values?"],
        [46, "Perform more trials if some of your trials must be discarded owing to mistakes during experimentation."],
        [46, "For efficient use of glassware/instruments, learn about their usage, calibration, precision, and limitations before the lab."],
        [46, "Create a timeline with checkpoints to complete the experiment within the stipulated time."],
        [46, "In the case of group work, use strategies like collaborative work, division of labor, etc."],
        [46, "Stay on task. Take short breaks when you need to refocus on the investigation."],
        # Documenting the investigation 1-8
        [47, "Note down the date(s) on which the investigation was carried out."],
        [47, "Record everything as soon as you measure. Keeping it later results in missing some details."],
        [47, "Look for any observables and record them such as bubbles, smoke, color change, etc."],
        [47, "Note all observations/measurements/outcomes with fidelity even if they are unexpected or undesirable."],
        [47, "Make note of any questions you have during the investigation and try to get them answered with the help of the TA/Instructor."],
        [47, "Organize the information legibly and neatly so others can read and understand."],
        [47, "Use different types of representations for organizing data such as tables, figures, graphs, etc."],
        [47, "Record the file name of your investigation and the location of storage for easy access later."],
        # Planning a future investigation Suggestions 1-7
        [48, "For comparison, look for any discrepancy between the predicted and observed outcomes."],
        [48, "When the actual and predicted outcomes matched, comment on what worked and the key takeaways from the investigation."],
        [48, "When the actual and predicted outcomes did not match, reflect on why the discrepancy could have arisen. The answer could lie in your theoretical understanding or the execution (inconsistent trials, human error, etc.) of the investigation."],
        [48, "Planning the next steps: Did your results lead you to come up with a new question? How could you answer it?"],
        [48, "Planning the next steps: Is there anything that might limit the validity of your data? How to address it?"],
        [48, "Planning the next steps: What data is missing to answer your overarching question? How can you obtain it?"],
        # Mathematical thinking
        # Mathematical thinking Suggestions 1-6
        [49, "Identify patterns in data that suggest relationships among variables."],
        [49, "Express the identified relationship in a useful form such as a graph or an equation."],
        [49, "Identify the nature of your equation such as linear, quadratic, differential etc. and review strategies for solving them."],
        [49, "Interpret the physical meaning (what do these numbers indicate about the system under consideration?) of the solutions."],
        [49, "Reflect on the notations (brackets, differential sign, etc.) you have used and ensure they convey the intended meaning."],
        [49, "Reflect on the units you have used (M/s, mol, K, etc.) and ensure they represent the intended quantities."],
        # Preparing for computation Suggestions 1-3
        [50, "Divide the complex problem into smaller problems, each of which tackles a part of the original problem."],
        [50, "Reflect on whether the solution to the smaller problems addresses every aspect of the original problem in a meaningful way."],
        [50, "Make a plan that outlines the steps for solving the problem preferably using a pictorial representation such as a flowchart."],
        # Performing computation Suggestions 1-6
        [51, "List the programming languages (Java, Python, etc.) that can be used to solve your problem."],
        [51, "Identify the best-suited language by considering the availability of the language, ease of learning, simplicity of the syntax, etc."],
        [51, "Write a program for the algorithm that you have developed to accomplish the task at hand."],
        [51, "List the simulation softwares (phET, ChemCompute, etc.) that can be used to model the chemical system of interest."],
        [51, "Identify the software that has the required tools to model the system you are interested in."],
        [51, "Identify the underlying issues and solve them by focusing on the critical issues instead of tackling each bug individually."],
        # Modeling
        # Evalutating models Suggestions 1-5
        [52, "Identify the various types of models available for predicting outcomes or explaining the phenomenon of interest."],
        [52, "Identify the assumptions, and approximations behind the models that can limit their predictive/explanatory powers."],
        [52, "Compare and contrast the utility and limitations of the models with a focus on what needs to be accomplished with the model."],
        [52, "Choose the model whose utility aids in achieving your objective while the limitations do not significantly hamper it."],
        [52, "Explain your choice based on the utility and limitations of the model, and the effect they have on achieving your objective."],
        # Using models Suggestions 1-4
        [53, "Analyze the experiment's course through the lens of the chosen model and predict what would happen."],
        [53, "Use the utility of the model to construct explanations for the data collected or observations made as a part of the investigation."],
        [53, "Use the model to find the necessary information to meet your objective, such as a slope from a graph or a value from an equation."],
        [53, "Use the utility of the model to explain how the phenomenon has occurred (mechanistic explanation)."],
        # Developing models Suggestions 1-5
        [54, "Articulate what your developed model is going to achieve by reflecting on the shortcomings of the existing models."],
        [54, "Explain the assumptions you have made to develop/revise the model by reflecting on why you needed to make them."],
        [54, "List the various forms models can take, such as analogies, representations, physical replicas, computer simulations, etc."],
        [54, "Choose the form that is best suited for the model you are developing by reflecting on the objective it needs to meet."],
        [54, "List the utility of the developed model by reflecting on the conditions under which it is useful or reliable."],
        # Analyzing data
        # Preparing for data analysis Suggestions 1-4
        [55, "Reflect on the investigation's purpose and identify the necessary information to achieve that."],
        [55, "Organize data such that it reveals any trends or patterns."],
        [55, "Reflect on all the methods available for data analysis and choose the one that could help answer the question of interest."],
        [55, "Justify how the chosen method of analysis helps answer the question of interest or test the hypothesis."],
        # Analyzing the data Suggestions 1-4
        [56, "Subject the relevant data to the chosen method of analysis."],
        [56, "Analyze the data with fidelity, as it is not good practice to manipulate the data to obtain the desired results."],
        [56, "Reflect on whether the data analysis yielded the required information to achieve the investigation’s purpose."],
        [56, "Explain the limitations of your analysis, if any, which could be due to inadequate number of data points, propagation of errors, etc."],
        # Interpreting the data Suggestions 1-7
        [57, "State in your own words what the analyzed data conveys."],
        [57, "Draw conclusions that logically follow from the analyzed data."],
        [57, "Identify all the pieces of evidence that emerge from your data analysis."],
        [57, "Identify relevant data from valid external sources."],
        [57, "State how these pieces of evidence and external data are interconnected."],
        [57, "Map out how these interconnected pieces of evidence can be used to justify the derived meaning."],
        [57, "Refer to aspects of your data analysis such as error margins, limitations, and infer how they affect your conclusion."],
        # Explaining phenomena
        # Presenting evidence Suggestions 1-5
        [58, "Reflect on whether the evidence you presented supports what it is supposed to support (validity)"],
        [58, "Reflect on whether the evidence you presented can be consistently reproduced under the same conditions (reliability)"],
        [58, "Present evidence that is obtained by empirical means only (either from your investigation or from previous work)."],
        [58, "Do not list a particular piece of data if you can adequately support the claim without using it."],
        [58, "Do not omit any evidence without which the argument is incomplete or has flaws."],
        # Constructing explanations Suggestions 1-4
        [59, "Identify the phenomenon that is observable and takes place at the macroscopic level."],
        [59, "Explain the phenomenon at a descriptive level (what happens)"],
        [59, "Identify all the interactions (usually intermolecular) at play at the sub-microscopic level required to explain the phenomenon."],
        [59, "Link the ideas coherently such that it gives a causal (why it happens) mechanistic (how it happens) account for the phenomenon."],
        # Arguing
        # Making claims Suggestions 1-4
        [60, "Reflect on the investigation's purpose and determine whether you answered the question of interest or tested the hypothesis."],
        [60, "State the result obtained from your investigation as a claim statement in your own words."],
        [60, "State alternate claim(s) if you inferred more than one conclusion from your investigation."],
        [60, "Identify the conditions that could limit the validity of your claim such as temperature, concentration, etc."],
        # Presenting evidence Suggestions 1-5
        [61, "Reflect on whether the evidence you presented supports what it is supposed to support (validity)"],
        [61, "Reflect on whether the evidence you presented can be consistently reproduced under the same conditions (reliability)"],
        [61, "Present evidence that is obtained by empirical means only (either from your investigation or from previous work)."],
        [61, "Do not list a particular piece of data if you can adequately support the claim without using it."],
        [61, "Do not omit any evidence without which the argument is incomplete or has flaws."],
        # Forming an argument from evidence Suggestions 1-4
        [62, "Do not merely list the evidence."],
        [62, "Demonstrate how the evidence supports the claim based on scientifically sound reasoning."],
        [62, "Familiarize yourself with the CER (Claim-Evidence-Reasoning) approach of argumentation."],
        [62, "Identify how each piece of evidence supports aspects of your reasoning to form a coherent argument."],
        # Critiquing arguments Suggestions 1-5
        [63, "Evaluate competing arguments through the same measures mentioned in the component ‘forming an argument from evidence’."],
        [63, "Do not stick to your argument in the light of contradictory evidence."],
        [63, "If the newly presented piece of evidence is valid and reliable, add that to your list of evidence."],
        [63, "Form a coherent argument with the new list of evidence as mentioned in the component ‘forming an argument from evidence’."],
        [63, "After evaluating all the arguments presented, choose the most compelling one based on the reasoning provided."],
        # Engaging in dialogical arguemntation Suggestions 1-6
        [64, "Think through each of the components of your argument and order them such that you can articulate in a comprehensible way."],
        [64, "Try to adopt the CER approach of argumentation."],
        [64, "When requested, provide clarifications about your argument either by restating or summarizing."],
        [64, "Respond to questions and challenges in an impersonal way by basing your arguments on scientific ideas and evidence."],
        [64, "Listen carefully and make notes of key points of others’ arguments so that you can support or challenge competing ideas."],
        [64, "When you challenge others’ arguments, make your points in an impersonal way based on scientific ideas and evidence."],
        # Disseminating findings
        # Obtaining information Suggestions 1-5
        [65, "Explore various sources of information such as textbooks, reference books, research articles from Scopus, Web of Science, etc."],
        [65, "Shortlist the sources that have the required information for your study."],
        [65, "Extract information from the shortlisted sources to set the context for the current study or justify the relevance of your work."],
        [65, "Reference the information obtained from various sources by using accepted formats such as ACS, APA, etc."],
        [65, "Use reference manager software such as Zotero, Microsoft end note, etc. for referencing extracted information."],
        # Evaluating information Suggestions 1-7
        [66, "Vet the sources by considering whether: The author is an expert in the field or not."],
        [66, "Vet the sources by considering whether: It was published in a reputable peer-reviewed journal such as JACS, Nature, etc."],
        [66, "Vet the sources by considering whether: It was published by a reputable publishing company such as ACS, RSC, etc."],
        [66, "Assess the quality of the information by considering whether: The experimental technique used was appropriate to achieve the intended objective."],
        [66, "Assess the quality of the information by considering whether: There was any bias in the study such as researcher bias, sampling bias, confirmation bias, etc."],
        [66, "Assess the quality of the information by considering whether: There were unethical practices performed such as data dredging (p-hacking), cherry-picking data, etc. in the analysis."],
        [66, "Assess the quality of the information by considering whether: The funding sources have a vested interest in the results of the study."],
        # Synthesizing information Suggestions 1-4
        [67, "State how the different pieces of information are connected."],
        [67, "Write out a statement or a paragraph that summarizes the integration of information."],
        [67, "Map out how the combined information can suit the current investigation's purpose."],
        [67, "Paraphrase the information in simpler but accurate terms by linking the previous works to the current investigation."],
        # Intent Suggestions 1-5
        [68, "Decide if your main purpose is to inform, to persuade, to argue, to summarize, to entertain, to inspire, etc."],
        [68, "Write out the intent of the communication you are creating and refer back to it as you generate your material."],
        [68, "Make sure the purpose of the communication is presented early to orient your audience to the focus of the communication."],
        [68, "Check that the focus of each segment is clearly linked to the main message or intent of the communication."],
        [68, "Summarize the main ideas to wrap up the presentation (refer back to the initial statement(s) of what was to be learned)."],
        [68, "Nothing specific at this time"],
        # Audience Suggestions 1-6
        [69, "Identify the range and level of expertise and interest your audience has for the topic and design your communication to have aspects that will engage all members of the audience."],
        [69, "Identify what the audience needs to know to understand the narrative."],
        [69, "Plan how you will interpret key data or details in a meaningful way for non-experts."],
        [69, "Only use jargon when it is understood readily by most members of your audience, and it makes the communication more effective and succinct."],
        [69, "Check that the vocabulary, sentence structure, and tone used in your communication is aligned with the level of your audience."],
        [69, "Collect feedback from others on drafts to make sure the core message of the communication is easily understood."],
        [69, "Nothing specific at this time"],
        # Organization Suggestions 1-6
        [70, "Consider the 'story' that you want to tell. Ask yourself what's the main message you want the audience to leave with."],
        [70, "Identify the critical points for the story (do this before you prepare the actual communication) and map out the key points."],
        [70, "Summarize sections before transitioning to the next topic."],
        [70, "Repeat key ideas to ensure the audience can follow the main idea."],
        [70, "Make sure that you introduce prerequisite information early in the communication."],
        [70, "Try more than one order for the topics, to see if overall flow is improved."],
        [70, "Nothing specific at this time"],
        # Visual Representations Suggestions 1-6
        [71, "Plan what types of figures are needed to support the narrative - consider writing out a figure description before you construct it."],
        [71, "Avoid including unnecessary details that detract from the intended message."],
        [71, "Consider how many messages each visual is trying to convey and divide up if the complexity or density is overwhelming."],
        [71, "Be sure labels, text, and small details can be easily read."],
        [71, "Provide a caption that helps interpret the key aspects of the visual."],
        [71, "Seek feedback on visuals to gauge initial reaction and ease of interpretation."],
        [71, "Nothing specific at this time"],
        # Format Style Suggestions 1-6
        [72, "Use titles (headers) and subtitles (subheaders) to orient the audience and help them follow the narrative."],
        [72, "Look at pages or slides as a whole for an easy-to-read layout, such as white space, headers, line spacing, etc."],
        [72, "Use emphases where needed to direct audience attention to important aspects."],
        [72, "Use colors to carefully highlight or call attention to key elements to enhance your narrative without distracting from your message."],
        [72, "Make sure that text, figures, and colors are readable and accessible for all."],
        [72, "Seek feedback to confirm that the language, tone, and style of your communication match the level of formality needed for your context and purpose."],
        [72, "Nothing specific at this time"],
        # Mechanics Written Words Suggestions 1-7
        [73, "Proofread your writing for spelling errors, punctuation, autocorrects, etc."],
        [73, "Review sentence structure for subject-verb agreement, consistent tense, run on sentences, and other structural problems."],
        [73, "Verify that items in lists are parallel."],
        [73, "List the themes of each paragraph (or slide).  If there are more than 2, consider starting a new paragraph (or slide)."],
        [73, "Confirm that each figure, table, etc has been numbered consecutively and has been called out and discussed further in the narrative."],
        [73, "Confirm that all work that has been published elsewhere or ideas/data that were not generated by the author(s) has been properly cited using appropriate conventions."],
        [73, "Ask someone else to review and provide feedback on your work."],
        [73, "Nothing specific at this time"],
        # Delivery Oral Suggestions 1-5
        [74, "Practice for others or record your talk; i. be sure that your voice can be heard, and your word pronunciations are clear. ii. listen for “ums”, “like”, or other verbal tics/filler words that can detract from your message. iii. observe your natural body language, gestures, and stance in front of the audience to be sure that they express confidence and enhance your message."],
        [74, "Add variety to your speed or vocal tone to emphasize key points or transitions."],
        [74, "Try to communicate/engage as if telling a story or having a conversation with the audience."],
        [74, "Face the audience and do not look continuously at the screen or notes."],
        [74, "Make eye contact with multiple members of the audience."],
        [74, "Nothing specific at this time"],        
        ]
    for suggestion in suggestions:
        create_suggestion(suggestion)