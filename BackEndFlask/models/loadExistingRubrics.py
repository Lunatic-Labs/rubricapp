from models.rubric import create_rubric
from models.category import create_category
from models.ratings import create_rating
from models.oc import create_OC
from models.suggestions import create_sfi
from models.ratings_numbers import *

def load_existing_rubrics():
    # (Latest update is June 7, 2022)
    critical_thinking = ["Critical Thinking", "Forming an argument or reaching a conclusion supported with evidence by evaluating, analyzing, and/or synthesizing relevant information."]
    # (Latest update is November, 2022)
    formal_communication = ["Formal Communication", "Conveying information and understanding to an intended audience through a formal communication effort*, either written or oral."]
    # (Latest update is December 29, 2021)
    information_processing = ["Informal Processing", "Evaluating, interpreting, and manipulating or transforming information."]
    # (Latest update is July 5, 2022)
    interpersonal_communication = ["Interpersonal Communication", "Exchanging information and idea through speaking, listening, responding, and non-verbal behaviors."]
    # (Latest update is April 24, 2023)
    management = ["Management", "Planning, organizing, coordinating, and monitoring one's own and others' efforts to accomplish a goal."]
    # (Latest update is September 16, 2022)
    problem_solving = ["Problem Solving", "Analyzing a complex problem or situation, developing a viable strategy to address it, and executing that strategy (when appropriate)."]
    # (Latest update is July 19, 2022)
    teamwork = ["Teamwork", "Interacting with others and buliding on each other's individual strengths and skills, working toward a common goal."]
    create_rubric(critical_thinking)
    create_rubric(formal_communication)
    create_rubric(information_processing)
    create_rubric(interpersonal_communication)
    create_rubric(management)
    create_rubric(problem_solving)
    create_rubric(teamwork)

def load_existing_categories():
    # (Latest update is June 7, 2022)
    critical_thinking_category_1 = [1,"Identifying the Goal", 0]
    critical_thinking_category_2 = [1,"Evaluating", 0]
    critical_thinking_category_3 = [1,"Analyzing", 0]
    critical_thinking_category_4 = [1,"Sythesizing", 0]
    critical_thinking_category_5 = [1,"Forming Arguments (Structure)", 0]
    critical_thinking_category_6 = [1,"Forming Arguments (Validity)", 0]
    # (Latest update is November, 2022)
    formal_communication_1 = [2, "Intent", 0]
    formal_communication_2 = [2, "Audience", 0]
    formal_communication_3 = [2, "Organization", 0]
    formal_communication_4 = [2, "Visual Representations", 0]
    formal_communication_5 = [2, "Format and Style", 0]
    formal_communication_6 = [2, "Mechanics (written words)", 0]
    formal_communication_7 = [2, "Delivery (oral)", 0]
    # (Latest update is December 29, 2021)
    information_processing_1 = [3, "Evaluating", 0]
    information_processing_2 = [3, "Interpreting", 0]
    information_processing_3 = [3, "Manipulating or Transforming (Extent)", 0]
    information_processing_4 = [3, "Manipulating or Transforming (Accuracy)", 0]
    # (Latest update is July 5, 2022)
    interpersonal_communication_1 = [4, "Speaking", 0]
    interpersonal_communication_2 = [4, "Listening", 0]
    interpersonal_communication_3 = [4, "Responding", 0]
    # (Latest update is April 24, 2023)
    management_1 = [5, "Planning", 0]
    management_2 = [5, "Organizing", 0]
    management_3 = [5, "Coordinating", 0]
    management_4 = [5, "Overseeing", 0]
    # (Latest update is September 16, 2022)
    problem_solving_1 = [6, "Analyzing the situation", 0]
    problem_solving_2 = [6, "Identifying", 0]
    problem_solving_3 = [6, "Strategizing", 0]
    problem_solving_4 = [6, "Validating", 0]
    problem_solving_5 = [6, "Executing", 0]
    # (Latest update is July 19, 2022)
    teamwork_1 = [7, "Interacting", 0]
    teamwork_2 = [7, "Contributing", 0]
    teamwork_3 = [7, "Progressing", 0]
    teamwork_4 = [7, "Building Community", 0]
    create_category(critical_thinking_category_1)
    create_category(critical_thinking_category_2)
    create_category(critical_thinking_category_3)
    create_category(critical_thinking_category_4)
    create_category(critical_thinking_category_5)
    create_category(critical_thinking_category_6)
    create_category(formal_communication_1)
    create_category(formal_communication_2)
    create_category(formal_communication_3)
    create_category(formal_communication_4)
    create_category(formal_communication_5)
    create_category(formal_communication_6)
    create_category(formal_communication_7)
    create_category(information_processing_1)
    create_category(information_processing_2)
    create_category(information_processing_3)
    create_category(information_processing_4)
    create_category(interpersonal_communication_1)
    create_category(interpersonal_communication_2)
    create_category(interpersonal_communication_3)
    create_category(management_1)
    create_category(management_2)
    create_category(management_3)
    create_category(management_4)
    create_category(problem_solving_1)
    create_category(problem_solving_2)
    create_category(problem_solving_3)
    create_category(problem_solving_4)
    create_category(problem_solving_5)
    create_category(teamwork_1)
    create_category(teamwork_2)
    create_category(teamwork_3)
    create_category(teamwork_4)
"""
    class Ratings(UserMixin, db.Model):
    __tablename__ = "Ratings"
    __table_args__ = {'sqlite_autoincrement': True}
    rating_id = db.Column(db.Integer, primary_key=True)
    rating_name = db.Column(db.String(225), nullable=False)
    rating_description = db.Column(db.String(255), nullable=False)
    rating_json = db.Column(db.JSON, nullable=False)
    category_id = db.Column(db.Integer, ForeignKey(Category.category_id), nullable=False)
"""

def load_existing_ratings():
    critical_thinking_ratings = ["Determined the purpose/context of the argument or conclusion that needed to be made", criticalThinkingA, 1]
    create_rating(critical_thinking_ratings)

def load_existing_observable_characteristics():
    # (Latest update is June 7, 2022)
    identifying_the_goal_observable_characteristic_1 = [1, 1, "Identified the question that needed to be answered or the situation that needed to be addressed"]
    identifying_the_goal_observable_characteristic_2 = [1, 1, "Identified any situational factors that may be important to addressing the question or situation"]
    identifying_the_goal_observable_characteristic_3 = [1, 1, "Identified the general types of data or information needed to address the question"]
    evaluating_observable_characteristic_1 = [1, 2, "Indicated what information is likely to be most relevant"]
    evaluating_observable_characteristic_2 = [1, 2, "Determined the reliability of the source of information"]
    evaluating_observable_characteristic_3 = [1, 2, "Determined the quality and accuracy of the information itself"]
    analyzing_observable_characteristic_1 = [1, 3, "Discussed information and explored possible meanings"]
    analyzing_observable_characteristic_2 = [1, 3, "Identified general trends or patterns in the data/information that could be used as evidence"]
    analyzing_observable_characteristic_3 = [1, 3, "Processed and/or transformed data/information to put it in forms that could be used as evidence"]
    sythesizing_observable_characteristic_1 = [1, 4, "Identified the relationships between different pieces of information or concepts"]
    sythesizing_observable_characteristic_2 = [1, 4, "Compared or contrasted what could be determined from different pieces of information"]
    sythesizing_observable_characteristic_3 = [1, 4, "Combined multiple pieces of information or ideas in valid ways to generate a new insight ir conclusion"]
    forming_arguments_structure_observable_characteristic_1 = [1, 5, "Stated the conclusion or the claim of the argument"]
    forming_arguments_structure_observable_characteristic_2 = [1, 5, "Listed the evidence used to support the argument"]
    forming_arguments_structure_observable_characteristic_3 = [1, 5, "Linked the claim/conclusion to the evidence with focused and organized reasoning"]
    forming_arguments_structure_observable_characteristic_4 = [1, 5, "Stated any qualifiers that limit the conditions for which the argument is true"]
    forming_arguments_validity_observable_characteristic_1 = [1, 6, "The most relevant evidence was used appropriately to support the claim"]
    forming_arguments_validity_observable_characteristic_2 = [1, 6, "Reasoning was logical and effectively connected the data to the claim"]
    forming_arguments_validity_observable_characteristic_3 = [1, 6, "The argument was aligned with disciplinary/community concepts or practices"]
    forming_arguments_validity_observable_characteristic_4 = [1, 6, "Considered alternative or counter claims"]
    forming_arguments_validity_observable_characteristic_5 = [1, 6, "Considered evidence that could be used to refute or challenge the claim"]
    # (Latest update is November, 2022)
    intent_observable_characteristic_1 = [2, 7, "Clearly stated what the audience should gain from the communication"]
    intent_observable_characteristic_2 = [2, 7, "Used each part of the communication to convey or support the main message"]
    intent_observable_characteristic_3 = [2, 7, "Concluded by summarizing what was to be learned"]
    audience_observable_characteristic_1 = [2, 8, "Communicated to the full range of the audience, including novices and those with expertise"]
    audience_observable_characteristic_2 = [2, 8, "Aligned the communication with the interests and background of the particular audience"]
    audience_observable_characteristic_3 = [2, 8, "Used vocabulary that aligned with the discipline and was understood by the audience"]
    organization_observable_characteristic_1 = [2, 9, "There was a clear story arc that moved the communication forward"]
    organization_observable_characteristic_2 = [2, 9, "Organizational cues and transitions clearly indicated the structure of the communication"]
    organization_observable_characteristic_3 = [2, 9, "Sequence of ideas flowed in an order that was easy to follow"]
    visual_representations_observable_characteristic_1 = [2, 10, "Each figure conveyed a clear message"]
    visual_representations_observable_characteristic_2 = [2, 10, "Details of the visual representation were easily interpreted by the audience"]
    visual_representations_observable_characteristic_3 = [2, 10, "The use of the visual enhanced understanding by the audience"]
    format_and_style_observable_characteristic_1 = [2, 11, "Stylistic elements were aesthetically pleasing and did not distract from the message"]
    format_and_style_observable_characteristic_2 = [2, 11, "Stylistic elements were designed to make the communication accessbile to the audience (size, colors, contrasts, etc.)"]
    format_and_style_observable_characteristic_3 = [2, 11, "The level of formality of the communication aligns with the setting, context, and purpose"]
    mechanics_written_word_observable_characteristic_1 = [2, 12, "Writing contained correct spelling, word choice, punctuation, and capitalization"]
    mechanics_written_word_observable_characteristic_2 = [2, 12, "All phrases and sentences were grammatically correct"]
    mechanics_written_word_observable_characteristic_3 = [2, 12, "All paragraphs (or slides) were well constructed around a central idea"]
    mechanics_written_word_observable_characteristic_4 = [2, 12, "All figures and tables were called out in the narrative, and sources were correctly cited"]
    delivery_oral_observable_characteristic_1 = [2, 13, "Spoke loudly and clearly with a tone that indicated confidence and interest in the subject"]
    delivery_oral_observable_characteristic_2 = [2, 13, "Vocal tone and pacing helped maintain audience interest"]
    delivery_oral_observable_characteristic_3 = [2, 13, "Gestures and visual cues further oriented the audience to focus on particular items or messages"]
    delivery_oral_observable_characteristic_4 = [2, 13, "Body language directed the delivery toward the audience and indicated the speaker was open to engagement"]
    # (Latest update is December 29, 2021)
    evaluating_observable_characteristic_4 = [3, 14, "Established what needs to be accomplished with this information"]
    evaluating_observable_characteristic_5 = [3, 14, "Identified what information is provided in the materials"]
    evaluating_observable_characteristic_6 = [3, 14, "Indicated what information is relevant"]
    evaluating_observable_characteristic_7 = [3, 14, "Indicated what information is NOT relevant"]
    evaluating_observable_characteristic_8 = [3, 14, "Indicated why certain information is relevant or not"]
    interpreting_observable_characteristic_1 = [3, 15, "Labeled or assigned correct meaning to information (text, tables, symbols, diagrams)"]
    interpreting_observable_characteristic_2 = [3, 15, "Extracted specific details from information"]
    interpreting_observable_characteristic_3 = [3, 15, "Rephrased information in own words"]
    interpreting_observable_characteristic_4 = [3, 15, "Identified patterns in information and derived meaning from them"]
    manipulating_or_transforming_extent_observable_characteristic_1 = [3, 16, "Determined what information needs to be converted to accomplish the task"]
    manipulating_or_transforming_extent_observable_characteristic_2 = [3, 16, "Described the process used to generate the transformation"]
    manipulating_or_transforming_extent_observable_characteristic_3 = [3, 16, "Converted all relevant information into a different representation of format"]
    manipulating_or_transforming_accuracy_observable_characteristic_1 = [3, 17, "Conveyed the correct or intended meaning of the information in the new representation or format."]
    manipulating_or_transforming_accuracy_observable_characteristic_2 = [3, 17, "All relevant features of the original information/data are presented in the new representation of format"]
    manipulating_or_transforming_accuracy_observable_characteristic_3 = [3, 17, "Performed the transformation without errors"]
    # (Latest update is July 5, 2022)
    speaking_observable_characteristic_1 = [4, 18, "Spoke clear and loudly enough for all team members to hear"]
    speaking_observable_characteristic_2 = [4, 18, "Used a tone that invited other people to respond"]
    speaking_observable_characteristic_3 = [4, 18, "Used language that was suitable for the listeners and context"]
    speaking_observable_characteristic_4 = [4, 18, "Spoke for a reasonable length of time for the situation"]
    listening_observable_characteristic_1 = [4, 19, "Patiently listened without interrupting the speaker"]
    listening_observable_characteristic_2 = [4, 19, "Referenced others' ideas to indicate listening and understanding"]
    listening_observable_characteristic_3 = [4, 19, "Presented nonverbal cues to indicate attentiveness"]
    listening_observable_characteristic_4 = [4, 19, "Avoided engagine in activities that diverted attention"]
    responding_observable_characteristic_1 = [4, 20, "Acknowledged other members for their ideas or contributions"]
    responding_observable_characteristic_2 = [4, 20, "Rephrased or referred to what other group members have said"]
    responding_observable_characteristic_3 = [4, 20, "Asked other group members to futher explain a concept"]
    responding_observable_characteristic_4 = [4, 20, "Elaborated or extended on someone else's idea(s)"]
    # (Latest update is April 24, 2023)
    planning_observable_characteristic_1 = [5, 21, "Generated a summary of the starting and ending points"]
    planning_observable_characteristic_2 = [5, 21, "Generated a sequence of steps or tasks to reach the desired goal"]
    planning_observable_characteristic_3 = [5, 21, "Discussed a timeline or time frame for completing project tasks"]
    planning_observable_characteristic_4 = [5, 21, "Decided on a strategy to share information, updates and progress with all team members"]
    organizing_observable_characteristic_1 = [5, 22, "Decided upon the necessary resources and tools"]
    organizing_observable_characteristic_2 = [5, 22, "Identified the availability of resources, tools or information"]
    organizing_observable_characteristic_3 = [5, 22, "Gathered necessary information and tools"]
    coordinating_observable_characteristic_1 = [5, 23, "Determined if tasks need to be delegated or completed by the team as a whole"]
    coordinating_observable_characteristic_2 = [5, 23, "Tailored the tasks toward strengths and availability of team members"]
    coordinating_observable_characteristic_3 = [5, 23, "Assigned specific tasks and responsibilities to team members"]
    coordinating_observable_characteristic_4 = [5, 23, "Established effective communication strategies and productive interactions among team members"]
    overseeing_observable_characteristic_1 = [5, 24, "Reinforced responsibilities and refocused team members toward completing project tasks"]
    overseeing_observable_characteristic_2 = [5, 24, "Communicated status, next steps, and reiterated general plan to accomplish goals"]
    overseeing_observable_characteristic_3 = [5, 24, "Sought and valued input from team members and provided them with constructive feedback"]
    overseeing_observable_characteristic_4 = [5, 24, "Kept track of remaining materials, team and person hours"]
    overseeing_observable_characteristic_5 = [5, 24, "Updated or adapted the tasks or plans as needed"]
    # (Latest update is September 16, 2022)
    analyzing_the_situation_observable_characteristic_1 = [6, 25, "Described the problem that needed to be solved or the decisions that needed to be made"]
    analyzing_the_situation_observable_characteristic_2 = [6, 25, "Listed complicating factors or constraints that may be important to consider when developing a solution"]
    analyzing_the_situation_observable_characteristic_3 = [6, 25, "Identified the potential consequences to stakeholders or surrounding"]
    identifying_observable_characteristic_1 = [6, 26, "Reviewed the organized the necessary information and resources"]
    identifying_observable_characteristic_2 = [6, 26, "Evaluated which available information and resources are critical to solving the problem"]
    identifying_observable_characteristic_3 = [6, 26, "Determined the limitations of the tools or information that was given or gathered"]
    identifying_observable_characteristic_4 = [6, 26, "Identified reliable sources that may provide additional needed information, tools, or resources"]
    strategizing_observable_characteristic_1 = [6, 27, "Identified potential starting and ending points for the strategy"]
    strategizing_observable_characteristic_2 = [6, 27, "Determined general steps needed to get from starting point to ending point"]
    strategizing_observable_characteristic_3 = [6, 27, "Sequenced or mapped actions in a logical progression"]
    validating_observable_characteristic_1 = [6, 28, "Reviewed strategy with respect to the identified scope"]
    validating_observable_characteristic_2 = [6, 28, "Provided rationale as to how steps within the process were properly sequenced"]
    validating_observable_characteristic_3 = [6, 28, "Identified ways the process or stragey could be futher improved or optimized"]
    validating_observable_characteristic_4 = [6, 28, "Evaluated the practicality of the overall strategy"]
    executing_observable_characteristic_1 = [6, 29, "Used data and information correctly"]
    executing_observable_characteristic_2 = [6, 29, "Made assumptions about the use of data and information that are justifiable"]
    executing_observable_characteristic_3 = [6, 29, "Determined that each step is being done in the order and the manner that was planned."]
    executing_observable_characteristic_4 = [6, 29, "Verified that each step in the process was providing the desired outcome."]
    # (Latest update is July 19, 2022)
    interacting_observable_characteristic_1 = [7, 30, "All team members communicated ideas related to a common goal"]
    interacting_observable_characteristic_2 = [7, 30, "Team members responded to each other verbally or nonverbally"]
    interacting_observable_characteristic_3 = [7, 30, "Directed each other to tasks and information"]
    contributing_observable_characteristic_1 = [7, 31, "Acknowledged the value of the statements of other team members"]
    contributing_observable_characteristic_2 = [7, 31, "Invited other team members to participate in the conversation, particulary if they had not contributed in a while"]
    contributing_observable_characteristic_3 = [7, 31, "Expanded on statements of other team members"]
    contributing_observable_characteristic_4 = [7, 31, "Asked follow-up questions to clarify team members' thoughts"]
    progressing_observable_characteristic_1 = [7, 32, "Stayed on task, focused on the assignment with only brief interruptions"]
    progressing_observable_characteristic_2 = [7, 32, "Refocused team members to make more effective progress towards the goal"]
    progressing_observable_characteristic_3 = [7, 32, "Worked simultaneously as single unit on the common goal"]
    progressing_observable_characteristic_4 = [7, 32, "Checked time to monitor progress on task."]
    building_community_observable_characteristic_1 = [7, 33, "Created a sense of belonging to the team for all team members"]
    building_community_observable_characteristic_2 = [7, 33, "Acted as a single unit that did not break up into smaller, gragmented units for the entire task"]
    building_community_observable_characteristic_3 = [7, 33, "Openly and respectfully discussed questions and disagreements between team members"]
    building_community_observable_characteristic_4 = [7, 33, "Listened carefully to people, and gave weight and respect to their contributions"]
    building_community_observable_characteristic_5 = [7, 33, "Welcomed and valued the individual identity and experiences of each team member"]
    # (Latest update is June 7, 2022)
    create_OC(identifying_the_goal_observable_characteristic_1)
    create_OC(identifying_the_goal_observable_characteristic_2)
    create_OC(identifying_the_goal_observable_characteristic_3)
    create_OC(evaluating_observable_characteristic_1)
    create_OC(evaluating_observable_characteristic_2)
    create_OC(evaluating_observable_characteristic_3)
    create_OC(analyzing_observable_characteristic_1)
    create_OC(analyzing_observable_characteristic_2)
    create_OC(analyzing_observable_characteristic_3)
    create_OC(sythesizing_observable_characteristic_1)
    create_OC(sythesizing_observable_characteristic_2)
    create_OC(sythesizing_observable_characteristic_3)
    create_OC(forming_arguments_structure_observable_characteristic_1)
    create_OC(forming_arguments_structure_observable_characteristic_2)
    create_OC(forming_arguments_structure_observable_characteristic_3)
    create_OC(forming_arguments_structure_observable_characteristic_3)
    create_OC(forming_arguments_structure_observable_characteristic_4)
    create_OC(forming_arguments_validity_observable_characteristic_1)
    create_OC(forming_arguments_validity_observable_characteristic_2)
    create_OC(forming_arguments_validity_observable_characteristic_3)
    create_OC(forming_arguments_validity_observable_characteristic_4)
    create_OC(forming_arguments_validity_observable_characteristic_5)
    # (Latest update is November, 2022)
    create_OC(intent_observable_characteristic_1)
    create_OC(intent_observable_characteristic_2)
    create_OC(intent_observable_characteristic_3)
    create_OC(audience_observable_characteristic_1)
    create_OC(audience_observable_characteristic_2)
    create_OC(audience_observable_characteristic_3)
    create_OC(organization_observable_characteristic_1)
    create_OC(organization_observable_characteristic_2)
    create_OC(organization_observable_characteristic_3)
    create_OC(visual_representations_observable_characteristic_1)
    create_OC(visual_representations_observable_characteristic_2)
    create_OC(visual_representations_observable_characteristic_3)
    create_OC(format_and_style_observable_characteristic_1)
    create_OC(format_and_style_observable_characteristic_2)
    create_OC(format_and_style_observable_characteristic_3)
    create_OC(mechanics_written_word_observable_characteristic_1)
    create_OC(mechanics_written_word_observable_characteristic_2)
    create_OC(mechanics_written_word_observable_characteristic_3)
    create_OC(mechanics_written_word_observable_characteristic_4)
    create_OC(delivery_oral_observable_characteristic_1)
    create_OC(delivery_oral_observable_characteristic_2)
    create_OC(delivery_oral_observable_characteristic_3)
    create_OC(delivery_oral_observable_characteristic_4)
    # (Latest update is December 29, 2021)
    create_OC(evaluating_observable_characteristic_4)
    create_OC(evaluating_observable_characteristic_5)
    create_OC(evaluating_observable_characteristic_6)
    create_OC(evaluating_observable_characteristic_7)
    create_OC(evaluating_observable_characteristic_8)
    create_OC(interpreting_observable_characteristic_1)
    create_OC(interpreting_observable_characteristic_2)
    create_OC(interpreting_observable_characteristic_3)
    create_OC(interpreting_observable_characteristic_4)
    create_OC(manipulating_or_transforming_extent_observable_characteristic_1)
    create_OC(manipulating_or_transforming_extent_observable_characteristic_2)
    create_OC(manipulating_or_transforming_extent_observable_characteristic_3)
    create_OC(manipulating_or_transforming_accuracy_observable_characteristic_1)
    create_OC(manipulating_or_transforming_accuracy_observable_characteristic_2)
    create_OC(manipulating_or_transforming_accuracy_observable_characteristic_3)
    # (Latest update is July 5, 2022)
    create_OC(speaking_observable_characteristic_1)
    create_OC(speaking_observable_characteristic_2)
    create_OC(speaking_observable_characteristic_3)
    create_OC(speaking_observable_characteristic_4)
    create_OC(listening_observable_characteristic_1)
    create_OC(listening_observable_characteristic_2)
    create_OC(listening_observable_characteristic_3)
    create_OC(listening_observable_characteristic_4)
    create_OC(responding_observable_characteristic_1)
    create_OC(responding_observable_characteristic_2)
    create_OC(responding_observable_characteristic_3)
    create_OC(responding_observable_characteristic_4)
    # (Latest update is April 24, 2023)
    create_OC(planning_observable_characteristic_1)
    create_OC(planning_observable_characteristic_2)
    create_OC(planning_observable_characteristic_3)
    create_OC(planning_observable_characteristic_4)
    create_OC(organizing_observable_characteristic_1)
    create_OC(organizing_observable_characteristic_2)
    create_OC(organizing_observable_characteristic_3)
    create_OC(coordinating_observable_characteristic_1)
    create_OC(coordinating_observable_characteristic_2)
    create_OC(coordinating_observable_characteristic_3)
    create_OC(coordinating_observable_characteristic_4)
    create_OC(overseeing_observable_characteristic_1)
    create_OC(overseeing_observable_characteristic_2)
    create_OC(overseeing_observable_characteristic_3)
    create_OC(overseeing_observable_characteristic_4)
    create_OC(overseeing_observable_characteristic_5)
    # (Latest update is September 16, 2022)
    create_OC(analyzing_the_situation_observable_characteristic_1)
    create_OC(analyzing_the_situation_observable_characteristic_2)
    create_OC(analyzing_the_situation_observable_characteristic_3)
    create_OC(identifying_observable_characteristic_1)
    create_OC(identifying_observable_characteristic_2)
    create_OC(identifying_observable_characteristic_3)
    create_OC(identifying_observable_characteristic_4)
    create_OC(strategizing_observable_characteristic_1)
    create_OC(strategizing_observable_characteristic_2)
    create_OC(strategizing_observable_characteristic_3)
    create_OC(validating_observable_characteristic_1)
    create_OC(validating_observable_characteristic_2)
    create_OC(validating_observable_characteristic_3)
    create_OC(validating_observable_characteristic_4)
    create_OC(executing_observable_characteristic_1)
    create_OC(executing_observable_characteristic_2)
    create_OC(executing_observable_characteristic_3)
    create_OC(executing_observable_characteristic_4)
    # (Latest update is July 19, 2022)
    create_OC(interacting_observable_characteristic_1)
    create_OC(interacting_observable_characteristic_2)
    create_OC(interacting_observable_characteristic_3)
    create_OC(contributing_observable_characteristic_1)
    create_OC(contributing_observable_characteristic_2)
    create_OC(contributing_observable_characteristic_3)
    create_OC(contributing_observable_characteristic_4)
    create_OC(progressing_observable_characteristic_1)
    create_OC(progressing_observable_characteristic_2)
    create_OC(progressing_observable_characteristic_3)
    create_OC(progressing_observable_characteristic_4)
    create_OC(building_community_observable_characteristic_1)
    create_OC(building_community_observable_characteristic_2)
    create_OC(building_community_observable_characteristic_3)
    create_OC(building_community_observable_characteristic_4)
    create_OC(building_community_observable_characteristic_5)

def load_existing_suggestions():
    # (Latest update is June 7, 2022)
    identifying_the_goal_suggestion_1 = [1, 1, "Review the instructions or general goal of the task."]
    identifying_the_goal_suggestion_2 = [1, 1, "Highlight or clearly state the question to be addressed or type of conclusion that must be reached."]
    identifying_the_goal_suggestion_3 = [1, 1, "List the factors (if any) that may limit the feasibility of some possible conclusions."]
    identifying_the_goal_suggestion_4 = [1, 1, "Write down the information you think is needed to address the situation."]
    evaluating_suggestion_1 = [1, 2, "Review provided material and circle, highlight, or otherwise indicate information that may be used as evidence in reaching a conclusion."]
    evaluating_suggestion_2 = [1, 2, "Write down the other information (prior knowledge) that might be useful to lead to/support a possible conclusion."]
    evaluating_suggestion_3 = [1, 2, "Set aside any information, patterns, or insights that seem less relevant to addressing the situation at hand."]
    evaluating_suggestion_4 = [1, 2, "Consider whether the information was obtained from a reliable source (textbook, literature, instructor, websites with credible authors)"]
    evaluating_suggestion_5 = [1, 2, "Determine the quality of the information and whether it is sufficient to answer the question."]
    analyzing_suggestion_1 = [1, 3, "Interpret and label key pieces of information in text, tables, graphs, diagrams."]
    analyzing_suggestion_2 = [1, 3, "State in your own words what information represents or means."]
    analyzing_suggestion_3 = [1, 3, "Identify general trends in information, and note any information that doesn't fit the pattern."]
    analyzing_suggestion_4 = [1, 3, "Check your understanding of information with others and discuss any differences in understanding."]
    analyzing_suggestion_5 = [1, 3, "State how each piece of information, pattern, or insight can be used to reach a conclusion or support your claim."]
    sythesizing_suggestion_1 = [1, 4, "Look for two or more pieces or types of information that can be connected and state how they can be related to each other."]
    sythesizing_suggestion_2 = [1, 4, "Write out the aspects that are similar and different in various pieces of information."]
    sythesizing_suggestion_3 = [1, 4, "Map out how the information and/or concepts can be combined to support an argument or reach a conclusion."]
    sythesizing_suggestion_4 = [1, 4, "Write a statement that summarizes the integration of the information and conveys a new understanding."]
    sythesizing_suggestion_5 = [1, 4, "List the ways in which synthesized information could be used as evidence."]
    forming_argmuents_structure_suggestion_1 = [1, 5, "Review the original goal - what question were you trying to answer?"]
    forming_argmuents_structure_suggestion_2 = [1, 5, "Clearly state your answer to the question (your claim or conclusion)."]
    forming_argmuents_structure_suggestion_3 = [1, 5, "Review the information you previously evaluated, analyzed and/or synthesized and decide what evidence supports your claim."]
    forming_argmuents_structure_suggestion_4 = [1, 5, "List each piece of evidence that you are using to support your argument."]
    forming_argmuents_structure_suggestion_5 = [1, 5, "Explain how each piece of information links to and supports your answer."]
    forming_argmuents_structure_suggestion_6 = [1, 5, "Make sure your answer includes the claim, information and reasoning."]
    forming_argmuents_structure_suggestion_7 = [1, 5, "Make sure the claim or conclusion answers the question."]
    forming_arguments_validity_1 = [1, 6, "Provide a clear statement that articulates why the evidence you chose leads to the claim or conclusion."]
    forming_arguments_validity_2 = [1, 6, "Check to make sure that your reasoning is consistent with what is accepted in the discipline or context."]
    forming_arguments_validity_3 = [1, 6, "Test your ideas with others, and ask them to judge the quality of the argument or indicate how the argument could be made more convincing."]
    forming_arguments_validity_4 = [1, 6, "Ask yourself (and others) if there is evidence or data that doesn't suport your conclusion or might contradict your claim."]
    forming_arguments_validity_5 = [1, 6, "Consider if there are alternative explanations for the data you are considering."]
    # (Latest update is November, 2022)
    intent_suggestion_1 = [2, 7, "Decide if your main purpose is to inform, to persuade, to argue, to summarize, to entertain, to inspire, etc."]
    intent_suggestion_2 = [2, 7, "Write out the intent of the communication you are creating and refer back to it as you generate your material."]
    intent_suggestion_3 = [2, 7, "Make sure the purpose of the communication is presented early to orient your audience to the focus of the communication."]
    intent_suggestion_4 = [2, 7, "Check that the focus of each segment is clearly linked to the main message or intent of the communication."]
    intent_suggestion_5 = [2, 7, "Summarize the main ideas to wrap up the presentation (refer back to the initial statement(s) of what was to be learned)."]
    audience_suggestion_1 = [2, 8, "Identify the range and level of expertise and interest your audience has for the topic and design your communication to have aspects that will engage all members of the audience."]
    audience_suggestion_2 = [2, 8, "Identify what the audience needs to know to understand the narrative."]
    audience_suggestion_3 = [2, 8, "Plan how you will interpret key data or details in a meaningful way for non-experts."]
    audience_suggestion_4 = [2, 8, "Only use jargon when it is understood readily by most members of your audience, and it makes the communication more effective and succinct."]
    audience_suggestion_5 = [2, 8, "Check that the vocabulary, sentence structure, and tone used in your communication is aligned with the level of your audience."]
    audience_suggestion_6 = [2, 8, "Collect feedback from others on drafts to make sure the core message of the communication is easily understood."]
    organization_suggestion_1 = [2, 9, "Consider the 'story' that you want to tell. Ask yourself what's the main message you want the audience to leave with."]
    organization_suggestion_2 = [2, 9, "Identify the critical points for the story (do this before you prepare the actual communication) and map out the key points."]
    organization_suggestion_3 = [2, 9, "Summarize sections before transitioning to the next topic."]
    organization_suggestion_4 = [2, 9, "Repeat key ideas to ensure the audience can follow the main idea."]
    organization_suggestion_5 = [2, 9, "Make sure that you introduce prerequisite information early in the communication."]
    organization_suggestion_6 = [2, 9, "Try more than one order for the topics, to see if overall flow is improved."]
    visual_representations_suggestion_1 = [2, 10, "Plan what types of figures are needed to support the narrative - consider writing out a figure description before you construct it."]
    visual_representations_suggestion_2 = [2, 10, "Avoid including unnecessary details that detract from the intended message."]
    visual_representations_suggestion_3 = [2, 10, "Consider how many messages each visual is trying to convey and divide up if the complexity or density is overwhelming."]
    visual_representations_suggestion_4 = [2, 10, "Be sure labels, text, and small details can be easily read."]
    visual_representations_suggestion_5 = [2, 10, "Provide a caption that helps interpret the key aspects of the visual."]
    visual_representations_suggestion_6 = [2, 10, "Seek feedback on visuals to gauge initial reaction and ease of interpretation."]
    format_style_suggestion_1 = [2, 11, "Use titles (headers) and subtitles (subheaders) to orient the audience and help them follow the narrative."]
    format_style_suggestion_2 = [2, 11, "Look at pages or slides as a whole for an easy-to-read layout, such as white space, headers, line spacing, etc."]
    format_style_suggestion_3 = [2, 11, "Use emphases where needed to direct audience attention to important aspects."]
    format_style_suggestion_4 = [2, 11, "Use colors to carefully highlight or call attention to key elements to enhance your narrative without distracting from your message."]
    format_style_suggestion_5 = [2, 11, "Make sure that text, figures, and colors are readable and accessible for all."]
    format_style_suggestion_6 = [2, 11, "Seek feedback to confirm that the language, tone, and style of your communication match the level of formality needed for your context and purpose."]
    mechanics_written_words_suggestion_1 = [2, 12, "Proofread your writing for spelling errors, punctuation, autocorrects, etc."]
    mechanics_written_words_suggestion_2 = [2, 12, "Review sentence structure for subject-verb agreement, consistent tense, run on sentences, and other structural problems."]
    mechanics_written_words_suggestion_3 = [2, 12, "Verify that items in lists are parallel."]
    mechanics_written_words_suggestion_4 = [2, 12, "List the themes of each paragraph (or slide).  If there are more than 2, consider starting a new paragraph (or slide)."]
    mechanics_written_words_suggestion_5 = [2, 12, "Confirm that each figure, table, etc has been numbered consecutively and has been called out and discussed further in the narrative."]
    mechanics_written_words_suggestion_6 = [2, 12, "Confirm that all work that has been published elsewhere or ideas/data that were not generated by the author(s) has been properly cited using appropriate conventions."]
    mechanics_written_words_suggestion_7 = [2, 12, "Ask someone else to review and provide feedback on your work."]
    delivery_oral_suggestion_1 = [2, 13, "Practice for others or record your talk; i. be sure that your voice can be heard, and your word pronunciations are clear. ii. listen for “ums”, “like”, or other verbal tics/filler words that can detract from your message. iii. observe your natural body language, gestures, and stance in front of the audience to be sure that they express confidence and enhance your message."]
    delivery_oral_suggestion_2 = [2, 13, "Add variety to your speed or vocal tone to emphasize key points or transitions."]
    delivery_oral_suggestion_3 = [2, 13, "Try to communicate/engage as if telling a story or having a conversation with the audience."]
    delivery_oral_suggestion_4 = [2, 13, "Face the audience and do not look continuously at the screen or notes."]
    delivery_oral_suggestion_5 = [2, 13, "Make eye contact with multiple members of the audience."]
    # (Latest update is December 29, 2021)
    evaluating_suggestion_6 = [3, 14, "Restate in your own words the task or question that you are trying to address with this information."]
    evaluating_suggestion_7 = [3, 14, "Summarize the pieces of information that you have been given, and check with others to be sure that none has been overlooked."]
    evaluating_suggestion_8 = [3, 14, "Add your own notes to information as you determine what it is."]
    evaluating_suggestion_9 = [3, 14, "Write down/circle/highlight the information that is needed to complete the task."]
    evaluating_suggestion_10 = [3, 14, "Put a line through info that you believe is not needed for the task"]
    evaluating_suggestion_11 = [3, 14, "Describe in what ways a particular piece of information may (or may not) be useful (or required) in completing the task"]
    interpreting_suggestion_1 = [3, 15, "Add notes or subtitles to key pieces of information found in text, tables, graphs, diagrams to describe its meaning."]
    interpreting_suggestion_2 = [3, 15, "State in your own words what information represents or means."]
    interpreting_suggestion_3 = [3, 15, "Summarize the ideas or relationships the information might convey."]
    interpreting_suggestion_4 = [3, 15, "Determine general trends in information and note any information that doesn't fit the trend"]
    interpreting_suggestion_5 = [3, 15, "Check your understanding of information with others"]
    manipulating_or_transforming_extent_suggestion_1 = [3, 16, "Identify how the new format of the information differs from the provided format."]
    manipulating_or_transforming_extent_suggestion_2 = [3, 16, "Identify what information needs to be transformed and make notations to ensure that all relevant information has been included."]
    manipulating_or_transforming_extent_suggestion_3 = [3, 16, "Review the new representation or format to be sure all relevant information has been included."]
    manipulating_or_transforming_extent_suggestion_4 = [3, 16, "Consider what information was not included in the new representation or format and make sure it was not necessary."]
    manipulating_or_transforming_extent_suggestion_5 = [3, 16, "Check with peers to see if there is agreement on the method of transformation and final result."]
    manipulating_or_transforming_accuracy_suggestion_1 = [3, 17, "Write down the features that need to be included in the new form."]
    manipulating_or_transforming_accuracy_suggestion_2 = [3, 17, "Be sure that you have carefully interpreted the original information and translated that to the new form."]
    manipulating_or_transforming_accuracy_suggestion_3 = [3, 17, "Carefully check to ensure that the original information is correctly represented in the new form."]
    manipulating_or_transforming_accuracy_suggestion_4 = [3, 17, "Verify the accuracy of the transformation with others."]
    # (Latest update is July 5, 2022)
    speaking_suggestion_1 = [4, 18, "Direct your voice towards the listeners and ask if you can be heard."]
    speaking_suggestion_2 = [4, 18, "Use a tone that is respectful and encouraging rather than confromtational or harsh."]
    speaking_suggestion_3 = [4, 18, "Choose language that doesn't make others uncomfortable; don't make the environment uninviting."]
    speaking_suggestion_4 = [4, 18, "Carefully choose your words to align with the nature of the topic and the audience."]
    speaking_suggestion_5 = [4, 18, "Speak for a length of time that allows frequent back and forth conversation."]
    speaking_suggestion_6 = [4, 18, "Provide a level of detail appropriate to convey your main idea."]
    listening_suggestion_1 = [4, 19, "Allow team members to finish their contribution."]
    listening_suggestion_2 = [4, 19, "Indicate if you can't hear someone's spoken words."]
    listening_suggestion_3 = [4, 19, "Restate or write down what was communicated."]
    listening_suggestion_4 = [4, 19, "Give credit and acknowledge people by name."]
    listening_suggestion_5 = [4, 19, "Face the team member that is speaking and make eye contact."]
    listening_suggestion_6 = [4, 19, "Use active-listening body language or facial expressions that indicate attentiveness."]
    listening_suggestion_7 = [4, 19, "Remove distractions and direct your attention to the speaker."]
    responding_suggestion_1 = [4, 20, "Let team members know when they make a productive contribution."]
    responding_suggestion_2 = [4, 20, "State what others have said in your own words and confirm understanding."]
    responding_suggestion_3 = [4, 20, "Ask a follow-up question or ask for clarification."]
    responding_suggestion_4 = [4, 20, "Reference what others have said when you build on their ideas."]
    responding_suggestion_5 = [4, 20, "Offer an altenative to what a team member said."]
    # (Latest update is April 24, 2023)
    planning_suggestion_1 = [5, 21, "Write down the general starting point and starting conditions."]
    planning_suggestion_2 = [5, 21, "Make sure that you understand the final goal or desired product - seek clarity when the goals are not well defined."]
    planning_suggestion_3 = [5, 21, "Sketch out a diagram or flowchart that shows the general steps in the process."]
    planning_suggestion_4 = [5, 21, "Double check to make sure that steps are sequenced sensibly."]
    planning_suggestion_5 = [5, 21, "Identify time needed for particular steps or other time constraints."]
    planning_suggestion_6 = [5, 21, "Make a regular plan to update progress."]
    organizing_suggestion_1 = [5, 22, "List the tools, resources, or information that the group needs to obtain."]
    organizing_suggestion_2 = [5, 22, "List the location of the tools, resources, or information at the group's disposal."]
    organizing_suggestion_3 = [5, 22, "Strategize about how to obtain the additional/needed tools, resources, or information."]
    coordinating_suggestion_1 = [5, 23, "Review the number of people you  have addressing each task, and be sure that it is right-sized to make progress."]
    coordinating_suggestion_2 = [5, 23, "Analyze each task for likelihood of success, and be sure you have it staffed appropriately."]
    coordinating_suggestion_3 = [5, 23, "Discuss strengths, availability,  and areas for contribution with each team member."]
    coordinating_suggestion_4 = [5, 23, "Check to make sure that each team member knows and understands their assigned roles/tasks."]
    coordinating_suggestion_5 = [5, 23, "Delegate tasks outside the team if necessary, especially if the task is too large to complete in the given time."]
    coordinating_suggestion_6 = [5, 23, "Establish a mechanism to share status and work products."]
    coordinating_suggestion_7 = [5, 23, "Set up meetings to discuss challenges and progress."]
    overseeing_suggestion_1 = [5, 24, "Check in regularly with each team member to review their progress on tasks."]
    overseeing_suggestion_2 = [5, 24, "Provide a list of steps towards accomplishing the goal that all can refer to and check off each step when completed."]
    overseeing_suggestion_3 = [5, 24, "Set up a time to listen to and respond to concerns of each team member and give feedback/support on their progress and strategies."]
    overseeing_suggestion_4 = [5, 24, "Create and maintain inventory lists of needed resources, noting ones that are more likely to run short."]
    overseeing_suggestion_5 = [5, 24, "Develop a strategy to make up for any shortfalls of materials."]
    overseeing_suggestion_6 = [5, 24, "Reassign team members to activities that need more attention or person hours as other steps are completed."]
    overseeing_suggestion_7 = [5, 24, "Evaluate whether team members should be reassigned to tasks that better align with their skill sets."]
    overseeing_suggestion_8 = [5, 24, "Check to see if the original plan for project completion is still feasible; make changes if necessary."]
    # (Latest update is September 16, 2022)
    analyzing_the_situation_suggestion_1 = [6, 25, "Read closely, and write down short summaries as you read through the entire context of the problem"]
    analyzing_the_situation_suggestion_2 = [6, 25, "Draw a schematic or diagram that shows how aspects of the problem relate to one another"]
    analyzing_the_situation_suggestion_3 = [6, 25, "Brainstorm or identify possible factors or constraints that are inherent or may be related to the stated problem or given situation"]
    analyzing_the_situation_suggestion_4 = [6, 25, "Prioritize the complicating factors from most to least important"]
    analyzing_the_situation_suggestion_5 = [6, 25, "List anything that will be significantly impacted by your decision (such as conditions, objects, or people)"]
    analyzing_the_situation_suggestion_6 = [6, 25, "Deliberate on the consequences of generating a wrong strategy or solution"]
    identifying_suggestion_1 = [6, 26, "Highlight or annotate the provided information that may be needed to solve the problem."]
    identifying_suggestion_2 = [6, 26, "List information or principles that you already know that can help you solve the problem."]
    identifying_suggestion_3 = [6, 26, "Sort the given and gathered information/resources as 'useful' or 'not useful.'"]
    identifying_suggestion_4 = [6, 26, "List the particular limitations of the provided information or tools."]
    identifying_suggestion_5 = [6, 26, "Identify ways to access any additional reliable information, tools or resources that you might need."]
    strategizing_suggestion_1 = [6, 27, "Write down a reasonable place to start and add a reasonable end goal"]
    strategizing_suggestion_2 = [6, 27, "Align any two steps in the order or sequence that they must happen. Then, add a third step and so on."]
    strategizing_suggestion_3 = [6, 27, "Consider starting at the end goal and working backwards"]
    strategizing_suggestion_4 = [6, 27, "Sketch a flowchart indicating some general steps from start to finish."]
    strategizing_suggestion_5 = [6, 27, "Add links/actions, or processes that connect the steps"]
    validating_suggestion_1 = [6, 28, "Summarize the problem succinctly - does your strategy address each aspect of the problem?"]
    validating_suggestion_2 = [6, 28, "Identify any steps that must occur in a specific order and verify that they do."]
    validating_suggestion_3 = [6, 28, "Check each step in your strategy. Is each step necessary? Can it be shortened or optimized in some way?"]
    validating_suggestion_4 = [6, 28, "Check each step in your strategy. Is each step feasible? What evidence supports this?"]
    validating_suggestion_5 = [6, 28, "Check to see if you have access to necessary resources, and if not, propose substitutes."]
    validating_suggestion_6 = [6, 28, "Check that your strategy is practical and functional, with respect to time, cost, safety, personnel, regulations, etc."]
    validating_suggestion_7 = [6, 28, "Take time to continuously assess your strategy throughout the process."]
    executing_suggestion_1 = [6, 29, "Use authentic values and reasonable estimates for information needed to solve the problem"]
    executing_suggestion_2 = [6, 29, "Make sure that the information you are using applies to the conditions of the problem."]
    executing_suggestion_3 = [6, 29, "List the assumptions that you are making and provide a reason for why those are valid assumptions."]
    executing_suggestion_4 = [6, 29, "Double check that you are following all the steps in your strategy."]
    executing_suggestion_5 = [6, 29, "List any barriers that you are encountering in executing the steps"]
    executing_suggestion_6 = [6, 29, "Identify ways to overcome barriers in implementation steps of the strategy"]
    executing_suggestion_7 = [6, 29, "Check the outcome of each step of the strategy for effectiveness."]
    # (Latest update is July 19, 2022)
    interacting_suggestion_1 = [7, 30, "Speak up and share your ideas/insights with team members."]
    interacting_suggestion_2 = [7, 30, "Listen to other team members who are sharing their ideas or insights and do not interrupt their communications."]
    interacting_suggestion_3 = [7, 30, "Be sure that others can hear you speak and can see you face, so they can read your facial expressions and body language."]
    interacting_suggestion_4 = [7, 30, "Explicitly react (nod, speak out loud, write a note, etc.) to contributions from other team members to indicate that you are engaged."]
    interacting_suggestion_5 = [7, 30, "Restate the prompt to make sure everyone is at the same place on the task."]
    interacting_suggestion_6 = [7, 30, "Have all members of the team consider the same task at the same time rather than working independently"]
    contributing_suggestion_1 = [7, 31, "Acknowledge or point out particularly effective contributions."]
    contributing_suggestion_2 = [7, 31, "Initiate discussions of agreement or disagreement with statements made by team members."]
    contributing_suggestion_3 = [7, 31, "Contribute your insights and reasoning if you disagree with another member of the team."]
    contributing_suggestion_4 = [7, 31, "Regularly ask members of the team to share their ideas or explain their reasoning."]
    contributing_suggestion_5 = [7, 31, "Add information or reasoning to contributions from other team members."]
    contributing_suggestion_6 = [7, 31, "Ask for clarification or rephrase statements of other team members to ensure understanding."]
    progressing_suggestion_1 = [7, 32, "Minimize distractions and focus on the assignment (close unrelated websites or messaging on phone or computer, turn off music, put away unrelated materials)."]
    progressing_suggestion_2 = [7, 32, "Redirect team members to current task."]
    progressing_suggestion_3 = [7, 32, "Ask other team members for their input on a task to move discussion forward."]
    progressing_suggestion_4 = [7, 32, "Ask for assistance if your team is stuck on a task and making little progress."]
    progressing_suggestion_5 = [7, 32, "Compare progress on task to the time remaining on assignment."]
    progressing_suggestion_6 = [7, 32, "Communicate to team members that you need to move on."]
    progressing_suggestion_7 = [7, 32, "As a team, list tasks to be done and agree on order for these tasks."]
    building_community_suggestion_1 = [7, 33, "Address team members by name."]
    building_community_suggestion_2 = [7, 33, "Use inclusive (collective) team cues that draw all team members together."]
    building_community_suggestion_3 = [7, 33, "Encourage every team member to contribute toward the goal."]
    building_community_suggestion_4 = [7, 33, "Make sure everyone feels ready to begin the task."]
    building_community_suggestion_5 = [7, 33, "Check that all team members are ready to move on to the next step in the task."]
    building_community_suggestion_6 = [7, 33, "Encourage all team members to work together on the same tasks at the same time, as needed."]
    building_community_suggestion_7 = [7, 33, "Celebrate team successes and persistence through roadblocks."]
    building_community_suggestion_8 = [7, 33, "Invite other team members to provide alternative views and reasoning."]
    # (Latest update is June 7, 2022)
    create_sfi(identifying_the_goal_suggestion_1)
    create_sfi(identifying_the_goal_suggestion_2)
    create_sfi(identifying_the_goal_suggestion_3)
    create_sfi(identifying_the_goal_suggestion_4)
    create_sfi(evaluating_suggestion_1)
    create_sfi(evaluating_suggestion_2)
    create_sfi(evaluating_suggestion_3)
    create_sfi(evaluating_suggestion_4)
    create_sfi(evaluating_suggestion_5)
    create_sfi(analyzing_suggestion_1)
    create_sfi(analyzing_suggestion_2)
    create_sfi(analyzing_suggestion_3)
    create_sfi(analyzing_suggestion_4)
    create_sfi(analyzing_suggestion_5)
    create_sfi(sythesizing_suggestion_1)
    create_sfi(sythesizing_suggestion_2)
    create_sfi(sythesizing_suggestion_3)
    create_sfi(sythesizing_suggestion_4)
    create_sfi(sythesizing_suggestion_5)
    create_sfi(forming_argmuents_structure_suggestion_1)
    create_sfi(forming_argmuents_structure_suggestion_2)
    create_sfi(forming_argmuents_structure_suggestion_3)
    create_sfi(forming_argmuents_structure_suggestion_4)
    create_sfi(forming_argmuents_structure_suggestion_5)
    create_sfi(forming_argmuents_structure_suggestion_6)
    create_sfi(forming_argmuents_structure_suggestion_7)
    create_sfi(forming_arguments_validity_1)
    create_sfi(forming_arguments_validity_2)
    create_sfi(forming_arguments_validity_3)
    create_sfi(forming_arguments_validity_4)
    create_sfi(forming_arguments_validity_5)
    # (Latest update is November, 2022)
    create_sfi(intent_suggestion_1)
    create_sfi(intent_suggestion_2)
    create_sfi(intent_suggestion_3)
    create_sfi(intent_suggestion_4)
    create_sfi(intent_suggestion_5)
    create_sfi(audience_suggestion_1)
    create_sfi(audience_suggestion_2)
    create_sfi(audience_suggestion_3)
    create_sfi(audience_suggestion_4)
    create_sfi(audience_suggestion_5)
    create_sfi(audience_suggestion_6)
    create_sfi(organization_suggestion_1)
    create_sfi(organization_suggestion_2)
    create_sfi(organization_suggestion_3)
    create_sfi(organization_suggestion_4)
    create_sfi(organization_suggestion_5)
    create_sfi(organization_suggestion_6)
    create_sfi(visual_representations_suggestion_1)
    create_sfi(visual_representations_suggestion_2)
    create_sfi(visual_representations_suggestion_3)
    create_sfi(visual_representations_suggestion_4)
    create_sfi(visual_representations_suggestion_5)
    create_sfi(visual_representations_suggestion_6)
    create_sfi(format_style_suggestion_1)
    create_sfi(format_style_suggestion_2)
    create_sfi(format_style_suggestion_3)
    create_sfi(format_style_suggestion_4)
    create_sfi(format_style_suggestion_5)
    create_sfi(format_style_suggestion_6)
    create_sfi(mechanics_written_words_suggestion_1)
    create_sfi(mechanics_written_words_suggestion_2)
    create_sfi(mechanics_written_words_suggestion_3)
    create_sfi(mechanics_written_words_suggestion_4)
    create_sfi(mechanics_written_words_suggestion_5)
    create_sfi(mechanics_written_words_suggestion_6)
    create_sfi(mechanics_written_words_suggestion_7)
    create_sfi(delivery_oral_suggestion_1)
    create_sfi(delivery_oral_suggestion_2)
    create_sfi(delivery_oral_suggestion_3)
    create_sfi(delivery_oral_suggestion_4)
    create_sfi(delivery_oral_suggestion_5)
    # (Latest update is December 29, 2021)
    create_sfi(evaluating_suggestion_6)
    create_sfi(evaluating_suggestion_7)
    create_sfi(evaluating_suggestion_8)
    create_sfi(evaluating_suggestion_9)
    create_sfi(evaluating_suggestion_10)
    create_sfi(evaluating_suggestion_11)
    create_sfi(interpreting_suggestion_1)
    create_sfi(interpreting_suggestion_2)
    create_sfi(interpreting_suggestion_3)
    create_sfi(interpreting_suggestion_4)
    create_sfi(interpreting_suggestion_5)
    create_sfi(manipulating_or_transforming_extent_suggestion_1)
    create_sfi(manipulating_or_transforming_extent_suggestion_2)
    create_sfi(manipulating_or_transforming_extent_suggestion_3)
    create_sfi(manipulating_or_transforming_extent_suggestion_4)
    create_sfi(manipulating_or_transforming_extent_suggestion_5)
    create_sfi(manipulating_or_transforming_accuracy_suggestion_1)
    create_sfi(manipulating_or_transforming_accuracy_suggestion_2)
    create_sfi(manipulating_or_transforming_accuracy_suggestion_3)
    create_sfi(manipulating_or_transforming_accuracy_suggestion_4)
    # (Latest update is July 5, 2022)
    create_sfi(speaking_suggestion_1)
    create_sfi(speaking_suggestion_2)
    create_sfi(speaking_suggestion_3)
    create_sfi(speaking_suggestion_4)
    create_sfi(speaking_suggestion_5)
    create_sfi(speaking_suggestion_6)
    create_sfi(listening_suggestion_1)
    create_sfi(listening_suggestion_2)
    create_sfi(listening_suggestion_3)
    create_sfi(listening_suggestion_4)
    create_sfi(listening_suggestion_5)
    create_sfi(listening_suggestion_6)
    create_sfi(listening_suggestion_7)
    create_sfi(responding_suggestion_1)
    create_sfi(responding_suggestion_2)
    create_sfi(responding_suggestion_3)
    create_sfi(responding_suggestion_4)
    create_sfi(responding_suggestion_5)
    # (Latest update is April 24, 2023)
    create_sfi(planning_suggestion_1)
    create_sfi(planning_suggestion_2)
    create_sfi(planning_suggestion_3)
    create_sfi(planning_suggestion_4)
    create_sfi(planning_suggestion_5)
    create_sfi(planning_suggestion_6)
    create_sfi(organizing_suggestion_1)
    create_sfi(organizing_suggestion_2)
    create_sfi(organizing_suggestion_3)
    create_sfi(coordinating_suggestion_1)
    create_sfi(coordinating_suggestion_2)
    create_sfi(coordinating_suggestion_3)
    create_sfi(coordinating_suggestion_4)
    create_sfi(coordinating_suggestion_5)
    create_sfi(coordinating_suggestion_6)
    create_sfi(coordinating_suggestion_7)
    create_sfi(overseeing_suggestion_1)
    create_sfi(overseeing_suggestion_2)
    create_sfi(overseeing_suggestion_3)
    create_sfi(overseeing_suggestion_4)
    create_sfi(overseeing_suggestion_5)
    create_sfi(overseeing_suggestion_6)
    create_sfi(overseeing_suggestion_7)
    create_sfi(overseeing_suggestion_8)
    # (Latest update is September 16, 2022)
    create_sfi(analyzing_the_situation_suggestion_1)
    create_sfi(analyzing_the_situation_suggestion_2)
    create_sfi(analyzing_the_situation_suggestion_3)
    create_sfi(analyzing_the_situation_suggestion_4)
    create_sfi(analyzing_the_situation_suggestion_5)
    create_sfi(analyzing_the_situation_suggestion_6)
    create_sfi(identifying_suggestion_1)
    create_sfi(identifying_suggestion_2)
    create_sfi(identifying_suggestion_3)
    create_sfi(identifying_suggestion_4)
    create_sfi(identifying_suggestion_5)
    create_sfi(strategizing_suggestion_1)
    create_sfi(strategizing_suggestion_2)
    create_sfi(strategizing_suggestion_3)
    create_sfi(strategizing_suggestion_4)
    create_sfi(strategizing_suggestion_5)
    create_sfi(validating_suggestion_1)
    create_sfi(validating_suggestion_2)
    create_sfi(validating_suggestion_3)
    create_sfi(validating_suggestion_4)
    create_sfi(validating_suggestion_5)
    create_sfi(validating_suggestion_6)
    create_sfi(validating_suggestion_7)
    create_sfi(executing_suggestion_1)
    create_sfi(executing_suggestion_2)
    create_sfi(executing_suggestion_3)
    create_sfi(executing_suggestion_4)
    create_sfi(executing_suggestion_5)
    create_sfi(executing_suggestion_6)
    create_sfi(executing_suggestion_7)
    # (Latest update is July 19, 2022)
    create_sfi(interacting_suggestion_1)
    create_sfi(interacting_suggestion_2)
    create_sfi(interacting_suggestion_3)
    create_sfi(interacting_suggestion_4)
    create_sfi(interacting_suggestion_5)
    create_sfi(interacting_suggestion_6)
    create_sfi(contributing_suggestion_1)
    create_sfi(contributing_suggestion_2)
    create_sfi(contributing_suggestion_3)
    create_sfi(contributing_suggestion_4)
    create_sfi(contributing_suggestion_5)
    create_sfi(contributing_suggestion_6)
    create_sfi(progressing_suggestion_1)
    create_sfi(progressing_suggestion_2)
    create_sfi(progressing_suggestion_3)
    create_sfi(progressing_suggestion_4)
    create_sfi(progressing_suggestion_5)
    create_sfi(progressing_suggestion_6)
    create_sfi(progressing_suggestion_7)
    create_sfi(building_community_suggestion_1)
    create_sfi(building_community_suggestion_2)
    create_sfi(building_community_suggestion_3)
    create_sfi(building_community_suggestion_4)
    create_sfi(building_community_suggestion_5)
    create_sfi(building_community_suggestion_6)
    create_sfi(building_community_suggestion_7)
    create_sfi(building_community_suggestion_8)