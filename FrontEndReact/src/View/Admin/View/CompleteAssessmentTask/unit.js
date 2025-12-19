import { Box } from '@mui/material';

export const UnitType = Object.freeze({
	INDIVIDUAL: "individual",
	FIXED_TEAM: "fixed_team",
	AD_HOC_TEAM: "ad_hoc_team", // Currently unused, made in preparation of adding ad hoc teams
});

// Terminology:
// ROCS Data - An object that stores information about how an assessment task has been completed.
//  This includes things like what checkboxes have been clicked and comments. This object
//  also includes information about the rubric it's based on.
//  
//  Structure:
//  A map of rubric category names to category objects.
//    Category objects:
//      - comments: string - The comments for this category.
//      - description: string - The description of this rubric category. This is the same as the description in the rubric itself.
//      - observable_characteristics: string of 1s and 0s - Each 1 or 0 in the string represents if that checkbox is checked for Observable Characteristics.
//      - suggestions: string of 1s and 0s - Has the same meaning as observable_characteristics except for Suggestions.
//      - rating: integer - The rating for the category.
//      - rating_json: map from tick mark position to tick mark name - Used for the tick mark names on the Ratings slider.
//   This map also may contain "comments" and "done" entries. These are unused and a legacy artifact.
//
// Completed Assessment Task (CAT) - An object fetched by the completedAssessments route that
//  associates ROCS data and whether the AT is done or not with a user/team.

/**
 * @param {object} args
 * @param {string} args.roleName The user's role name.
 * @param {string} args.currentUserId The user's user id.
 * @param {object|null} args.chosenCompleteAssessmentTask The currently chosen CAT or null
 *  if this AT hasn't been completed before.
 * @param {UnitType[keyof UnitType]} args.unitType The type of unit this AT uses.
 * @param {object} args.assessmentTaskRubric This AT's rubric.
 * @param {object[]} args.completedAssessments The list of all CATs.
 * @param {object[]} args.users The list of all users.
 * @param {object[]|null} args.fixedTeams The list of all fixed teams or null
 *  if this isn't a fixed team AT.
 * @param {object|null} args.fixedTeamMembers A mapping from fixed team id to team members or null
 *  if this isn't a fixed team AT.
 * @param {object|null} args.userFixedTeam The fixed team that this user belongs to or null
 *  if this isn't a fixed team AT.
 * @returns {ATUnit[]}
 */

//The benifit of this class and global call is that you can keep certain things static to help with the debugger.
/* class Debug {
    static data = {};

    static increment(that){
        ++Debug.data[that];
    }
    static firstZero(that){
        if(Debug.data[that] === undefined){
            Debug.data[that] = 0;
            return true;
        }
        else return false;
    }
    static change(that, val){
        try{
            Debug.data[that] = val;
        }catch{
            return false;
        }
        return true;
    }
    static get(that){
        return Debug.data[that];
    }
}
if(module.hot){
    Debug.data = {}; 
}  */

export function generateUnitList(args) {
	let unitList = [];

	if (args.roleName === "Student") {
		if (args.unitType === UnitType.INDIVIDUAL) {
			const userId = args.chosenCompleteAssessmentTask?.["user_id"] ?? args.currentUserId;
			const user = args.users.find(user => user["user_id"] === userId);
			
			unitList.push(createIndividualUnit(
				user, args.chosenCompleteAssessmentTask,
				args.assessmentTaskRubric
			));
		} else {
			// Note that when we are here args.ChosenCompleteAssessmentTask is not populated.
			let team;
			const isFixedTeams = args.unitType === UnitType.FIXED_TEAM;
			
			if (args.chosenCompleteAssessmentTask && "team_id" in args.chosenCompleteAssessmentTask && isFixedTeams) {
				const teamId = args.chosenCompleteAssessmentTask["team_id"];
				team = args.fixedTeams.find(team => team["team_id"] === teamId);
			} else {
 				team = args.userFixedTeam;// Despite the var name this works for adhocs.
			}

			let chosenCAT = args.chosenCompleteAssessmentTask

			const exitsAndMeaningful = (i) =>{return i && i.length > 0;}
			
			// Next if statement allows for quicksaved data to be reflected in the AT view.
			if (chosenCAT === null && exitsAndMeaningful(args.completedAssessments)){
				chosenCAT = args.completedAssessments.find(cat => cat.team_id === team.team_id);
			}

			unitList.push(isFixedTeams ? 
				createFixedTeamUnit(
					team, chosenCAT,
					args.assessmentTaskRubric, args.fixedTeamMembers
			): createAdHocTeamUnit(
				team, chosenCAT,
				args.assessmentTaskRubric, args.fixedTeamMembers,
			));
		} 
	} else {
		// Otherwise we must be an admin or TA
		
		if (args.unitType === UnitType.INDIVIDUAL) {
			unitList = args.users.map(user => {
				const userId = user["user_id"];
				const cat = args.completedAssessments.find(cat => cat["user_id"] === userId);
				
				return createIndividualUnit(user, cat, args.assessmentTaskRubric);
			});

		} else {
			const isFixed = args.unitType === UnitType.FIXED_TEAM;
			unitList = args.fixedTeams.map(team => {
				const teamId = team["team_id"];
				const cat = args.completedAssessments.find(cat => cat["team_id"] === teamId);
				return isFixed ?
					createFixedTeamUnit(team, cat, args.assessmentTaskRubric, args.fixedTeamMembers):
					createAdHocTeamUnit(team, cat, args.assessmentTaskRubric, args.fixedTeamMembers);
			});
		} 
	}
	
	return unitList;
}

function getOrGenerateUnitData(cat, rubric) {
	let rocsData;
	let isDone;
	
	if (cat && Object.keys(cat).length > 0) {
		// The unit already has a complete AT entry (it has been completed before)
		rocsData = cat["rating_observable_characteristics_suggestions_data"];
		isDone = cat["done"];
	} else {
		// Otherwise this is a new CAT
		
		// Create new ROCS data from rubric
		rocsData = structuredClone(rubric["category_rating_observable_characteristics_suggestions_json"]);
		isDone = false;
	}
	
	return [rocsData, isDone];
}

function createIndividualUnit(user, cat, rubric) {
	const [rocsData, isDone] = getOrGenerateUnitData(cat, rubric);
	
	return new IndividualUnit(cat ?? null, rocsData, isDone, user);
}

function createFixedTeamUnit(team, cat, rubric, fixedTeamMembers) {
	const teamId = team["team_id"];
	
	const [rocsData, isDone] = getOrGenerateUnitData(cat, rubric);
	const teamMembers = fixedTeamMembers[teamId];
		
	return new FixedTeamUnit(
		cat ?? null, rocsData, isDone,
		team, teamMembers,
	);
}

function createAdHocTeamUnit(team, cat, rubric, fixedTeamMembers) {
	const teamId = team["team_id"]; //|| team["team_number"];
	
	const [rocsData, isDone] = getOrGenerateUnitData(cat, rubric);
	const teamMembers = fixedTeamMembers[teamId];


	return new AdHocTeamUnit(
		cat ?? null, rocsData, isDone,
		team, teamMembers,
	);
}

export class ATUnit {
	/** 
	 * The completed AT object associated with this unit, if it exists.
	 * If the unit hasn't been completed before, then this will be null.
	 * @type {object|null} 
	 */
	completedAssessmentTask;
	
	/** 
	 * The rating_observable_characteristics_suggestions_data for this unit. 
	 * @type {object}
	 */
	rocsData;
	
	/** 
	 * If this unit has been marked as done.
	 * @type {boolean}
	 */
	isDone;
	
	/** 
	 * @type {UnitType[keyof UnitType]}
	 */
	unitType;
	
	constructor(unitType, cat, rocsData, isDone) {
		this.unitType = unitType;
		this.completedAssessmentTask = cat;
		this.rocsData = rocsData;
		this.isDone = isDone;
	}
	
	/**
	 * @abstract
	 * @returns {string} The display name for this unit's unit tab.
	 */
	get displayName() {
		throw new Error("Not implemented");
	}

	/**
	 * @abstract
	 * @returns {integer} The integer id of this unit's unit tab.
	 */
	get id() {
		throw new Error("Not implemented");
	}
	
	/**
	 * Gets the elements for the check in tooltip of this unit's tab on the form.
	 * @abstract
	 * @param {CheckinsTracker} checkinsTracker
	 * @returns {object[]} The contents of the checked in tooltip.
	 */
	getCheckedInTooltip(checkinsTracker) {
		throw new Error("Not implemented");
	}
	
	/**
	 * Creates a shallow clone of this unit.
	 * @abstract
	 * @returns {ATUnit}
	 */
	shallowClone() {
		throw new Error("Not implemented");
	}
	
	/**
	 * Creates a copy of this unit with ROCS data modified by modifier
	 * @param modifier
	 * @returns {ATUnit}
	 */
	withNewRocsData(modifier) {
		const newRocs = structuredClone(this.rocsData);
		modifier(newRocs);
		
		const newUnit = this.shallowClone();
		newUnit.rocsData = newRocs;
		return newUnit;
	}

	/**
	 * Creates a copy of this unit with the isDone property modified.
	 * @param {boolean} isDone
	 * @returns {ATUnit}
	 */
	withNewIsDone(isDone) {
		const newUnit = this.shallowClone();
		newUnit.isDone = isDone;
		return newUnit;
	}
	
	/**
	 * Creates a copy of this unit with a new complete assessment task entry.
	 * @param {object} newCat
	 * @returns {ATUnit}
	 */
	withNewCAT(newCat) {
		const newUnit = this.shallowClone();
		newUnit.completedAssessmentTask = newCat;
		return newUnit;
	}
	
	/**
	 * Returns a list of the category names.
	 * @returns {string[]}
	 */
	categoryNames() {
		return Object.keys(this.rocsData)
			.filter(category => category !== "comments" && category !== "done");
	}
	
	/**
	 * Returns the query parameter that's used to identify this unit
	 *  when saving the unit.
	 * @abstract
	 * @returns {string}
	 */
	getSubmitQueryParam() {
		throw new Error("Not implemented");
	}
	
	/**
	 * Returns a new CAT entry ready to be saved to the server.
	 * @abstract
	 * @param {number} assessmentTaskId The ID of the assessment task.
	 * @param {number} completedBy The user ID of the user that completed this assessment task.
	 * @param {Date} completedAt The date and time that this assessment task was completed/updated.
	 * @returns {object}
	 */
	generateNewCAT(assessmentTaskId, completedBy, completedAt) {
		if (this.completedAssessmentTask) {
			const newCAT = structuredClone(this.completedAssessmentTask);
			
			newCAT["rating_observable_characteristics_suggestions_data"] = this.rocsData;
			newCAT["last_update"] = completedAt;
			newCAT["done"] = this.isDone;
			
			return newCAT;
		} else {
			return {
				"assessment_task_id": assessmentTaskId,
				"rating_observable_characteristics_suggestions_data": this.rocsData,
				"completed_by": completedBy,
				"initial_time": completedAt,
				"last_update": completedAt,
				"done": this.isDone,
			};
		}
	}
}

export class IndividualUnit extends ATUnit {
	/** 
	 * The user object associated with this unit.
	 * @type {object}
	 */
	user;

	/**
	 * @param {object} cat Complete assessment task object.
	 * @param {object} user User object.
	 */
	constructor(cat, rocs, done, user) {
		super(UnitType.INDIVIDUAL, cat, rocs, done);
		this.user = user;
	}
	
	get userId() {
		return this.user["user_id"];
	}
	
	get displayName() {
		return this.user["first_name"] + " " + this.user["last_name"];
	}

	get id() {
		return this.userId;
	}

	getCheckedInTooltip(checkinsTracker) {
		if (checkinsTracker.hasCheckInForUser(this.userId)) {
			return [ <Box key={0}>Checked In</Box> ];
		} else {
			return [];
		}
	}
	
	shallowClone() {
		return new IndividualUnit(
			this.completedAssessmentTask, this.rocsData, this.isDone,
			this.user, this.isCheckedIn
		);
	}
	
	getSubmitQueryParam() {
		return `uid=${this.userId}`;
	}
	
	generateNewCAT(assessmentTaskId, completedBy, completedAt, isDone) {
		return {
			...super.generateNewCAT(assessmentTaskId, completedBy, completedAt, isDone),
			"user_id": this.userId,
			"team_id": -1,
		};
	}
}

export class FixedTeamUnit extends ATUnit {
	/** 
	 * The team object associated with this unit.
	 * @type {object}
	 */
	team;
	
	/** 
	 * List of user objects that are members of this fixed team.
	 * @type {object[]}
	 */
	teamMembers;
	
	/**
	 * @param {object} cat Complete assessment task object.
	 * @param {object} team Team object.
	 * @param {object[]} teamMembers List of user objects that are members of this fixed team.
	 */
	constructor(cat, rocs, done, team, teamMembers) {
		super(UnitType.FIXED_TEAM, cat, rocs, done);
		this.team = team;
		this.teamMembers = teamMembers;
	}
	
	get teamId() {
		return this.team["team_id"];
	}
	
	get displayName() {
		return this.team["team_name"];
	}

	get id() {
		return this.teamId;
	}
	
	getCheckedInTooltip(checkinsTracker) {
		const checkedInMembers = this.teamMembers.filter(user => {
			const checkin = checkinsTracker.getUserCheckIn(user["user_id"]);
			
			return checkin && checkin["team_number"] === this.teamId;
		});
		
		if (checkedInMembers.length !== 0) {
			return checkedInMembers.map((user, index) => <Box key={index}>{user["first_name"] + " " + user["last_name"]}</Box>);
		} else {
			return [ <Box key={0}>No Team Members Checked In</Box> ];
		}
	}
	
	shallowClone() {
		return new FixedTeamUnit(
			this.completedAssessmentTask, this.rocsData, this.isDone,
			this.team, this.teamMembers
		);
	}
	
	getSubmitQueryParam() {
		return `team_id=${this.teamId}`;
	}
	
	generateNewCAT(assessmentTaskId, completedBy, completedAt, isDone) {
		return {
			...super.generateNewCAT(assessmentTaskId, completedBy, completedAt, isDone),
			"user_id": -1,
			"team_id": this.teamId,
		};
	}
}

// Do we even need the classes FIXED and AdHoc? it seems both can be the same and generalization works anyways.
export class AdHocTeamUnit extends FixedTeamUnit{
	/**
	 * @param {object} cat Complete assessment task object.
	 * @param {object} team Team object.
	 * @param {object[]} teamMembers List of user objects that are members of this fixed team.
	 * @param {int} currentUserId - The current user to save data under.
	 */

	constructor(cat, rocs, done, team, teamMembers) {
		super(cat, rocs, done, team, teamMembers);
		this.unitType = UnitType.AD_HOC_TEAM;
		this.team = team;
		this.teamMembers = teamMembers;
	}

	shallowClone() {
		return new AdHocTeamUnit(
			this.completedAssessmentTask, this.rocsData, this.isDone,
			this.team, this.teamMembers, this.currentUserId,
		);
	}

	getCheckedInTooltip(checkinsTracker) {
		const teamMembersArray = Array.isArray(this.teamMembers) ? this.teamMembers : [this.teamMembers];
		const checkedInMembers = teamMembersArray.filter(user => {
			const checkin = checkinsTracker.getUserCheckIn(user["user_id"]);
			return checkin && checkin["team_number"] === this.team.team_id;
		});

		/**
		 * If we do:
		 * const checkedInMembers = Array.from(checkinsTracker.checkinsByUserId);
		 * Then we can by pass the issue but everything is undefined. 
		 * The error exists for the ta/teacher views when viewing who is checked in on adhoc teams.
		 * In that situation, the checkedInMembers will always be an empty array in part due to line 500.
		 * If bypassed and checkins are directly given to the next lines, you will get undefineds since data is not binding correctly.
		 * Checkin data sent by the backend and in the frontend object are stored correctly. - Aldo Vera-Espinoza
		 */

		
		if (checkedInMembers.length !== 0) {
			return checkedInMembers.map((user, index) => <Box key={index}>{user["first_name"] + " " + user["last_name"]}</Box>);
		} else {
			return [ <Box key={0}>No Team Members Checked In</Box> ];
		}
	}
}