from core import app, db
from models.rubric import create_rubric
from models.category import create_category
from models.observable_characteristics import create_observable_characteristic
from models.suggestions import create_suggestion
from models.rubric_categories import create_rubric_category
from models.ratings_numbers import *

  
def load_existing_rubrics():
    rubrics = [
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
        [11, "Mathematical thinking", "Used any number of mathematical tools such as constructing and solving equations for establishing relationships among variables.", completely],
        [11, "Preparing for computation", "Identified the problem that can be solved using computation and developed a plan for solving it.", completely],
        [11, "Preparing computation", "Used any number of computational tools, such as programming, simulation, etc., for modeling data or solving a problem.", completely],
        # Modeling Categories 1-3
        [12, "Evaluating models", "Evaluated a set of models for their relevancy before using.", completely],
        [12, "Using models", "Used existing models to make sense of the observations made or measurements taken.", completely],
        [12, "Developing models", "Developed new models or revised existing models to make sense of the observations made or measurements taken.", completely],
        # Analyzing data Categories 1-3
        [13, "Preparing for data analysis", "Prepared for data analysis by identifying relevant data and method(s)", completely],
        [13, "Analyzing the data", "Used any number of scientifically accepted tools such as graphs, statistics, etc., and analyzed the generated (or given) data to identify significant patterns and trends.", completely],
        [13, "Interpreting the data", "Interpreted the analyzed data to derive meaning/construct explanations/answer questions/know implications.", completely],
        # Explaining phenomena Categories 1-2
        [14, "Presenting evidence", "Listed the evidence required to support the explanation", completely],
        [14, "Constructing explanations", "Constructed a logically sound explanation to provide explanatory accounts of the phenomenon of interest.", completely],
        # Arguing Categories 1-5
        [15, "Making claims", "Made the claim of the argument", completely],
        [15, "Presenting evidence", "Listed the evidence required to support the claim.", completely],
        [15, "Forming an argument from evidence", "Constructed a logically sound argument with reasoning that explains how the evidence supports the claim.", completely],
        [15, "Critiquing arguments", "Engaged in argumentation by critically evaluating competing arguments.", completely],
        [15, "Engaging in diabolical argumentation", "Engaged in verbal argumentation by articulating one’s argument and questioning competing ones.", completely],
        # (Latest update is June 17, 2025) Disseminating findings Categories 1-10
        [16, "Obtaining information", "Collected relevant information from multiple sources of scientific knowledge such as books, journal articles, technical databases, etc.", completely],
        [16, "Evaluating information", "Critically evaluated the reliability of the obtained information.", completely],
        [16, "Synthesing information", "Combined information obtained from different sources to suit the purpose of the current investigation.", completely],
        [16, "Intent", "Clearly conveys the purpose, and the content is well-aligned towards this intent", completely],
        [16, "Audience", "Uses language and delivery style that is consistent with the norms of the subject area and suitable for the audience", consistently],
        [16, "Organization", "Presents ideas in a logical and cohesive manner", consistently],
        [16, "Visual Representations", "Constructs and uses visual representations effectively and appropriately", consistently],
        [16, "Format and Style", "Selects a format and style that enhances the effectiveness of the communication", consistently],
        [16, "Mechanics (written words)", "Uses expected writing conventions for the form of communication", consistently],
        [16, "Delivery (oral)", "Uses voice and body language to convey the intended message in a clear and engaging manner", consistently]
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

with app.app_context():
    print("attempting to add Science Stanards to db...")

    load_existing_rubrics()
          
