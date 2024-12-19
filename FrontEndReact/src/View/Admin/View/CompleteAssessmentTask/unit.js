import { Box } from '@mui/material';
import { CheckinsTracker } from './cat_utils';

export const UnitType = Object.freeze({
	INDIVIDUAL: "individual",
	FIXED_TEAM: "fixed_team",
});

// Terminology:
// ROCS Data - An object that stores information about how an assessment task has been completed.
//  This includes things like what checkboxes have been clicked and comments. This object
//  also includes information about the rubric it's based on.
//
// Completed Assessment Task (CAT) - An object fetched by the completedAssessments route that
//  associates ROCS data and whether the AT is done or not with a user/team.

/**
 * @param {object} args
 * @param {string} args.roleName The user's role name.
 * @param {string} args.userId The user's user id.
 * @param {object|null} args.chosenCompleteAssessmentTask The currently chosen CAT or null
 *  if this AT hasn't been completed before.
 * @param {UnitType[keyof UnitType]} args.unitType The type of unit this AT uses.
 * @param {object} args.rubric This AT's rubric.
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
export function generateUnitList(args) {
	let unitList = [];
	
	if (args.roleName === "Student") {
		
		if (args.unitType === UnitType.INDIVIDUAL) {
			const userId = args.chosenCompleteAssessmentTask?.["user_id"] ?? args.userId;
			const user = findUser(args.users, userId);
			
			unitList.push(createIndividualUnit(
				user, args.chosenCompleteAssessmentTask,
				args.rubric
			));
		} else if (args.unitType === UnitType.FIXED_TEAM) {
			let team;
			
			if (args.chosenCompleteAssessmentTask && "team_id" in args.chosenCompleteAssessmentTask) {
				const teamId = args.chosenCompleteAssessmentTask["team_id"];
				team = findTeam(args.fixedTeams, teamId);
			} else {
				team = args.userFixedTeam;
			}
			
			unitList.push(createFixedTeamUnit(
				team, args.chosenCompleteAssessmentTask,
				args.rubric, args.fixedTeamMembers
			));
		}
	} else {
		// Otherwise we must be an admin or TA
		
		if (args.unitType === UnitType.INDIVIDUAL) {
			unitList = args.users.map(user => {
				const userId = user["user_id"];
				const cat = args.completedAssessments.find(cat => cat["user_id"] === userId);
				
				return createIndividualUnit(user, cat, args.rubric);
			});
		} else if (args.unitType === UnitType.FIXED_TEAM) {
			unitList = args.fixedTeams.map(team => {
				const teamId = team["team_id"];
				const cat = args.completedAssessments.find(cat => cat["team_id"] === teamId);
				
				return createFixedTeamUnit(team, cat, args.rubric, args.fixedTeamMembers);
			});
		}
	}
	
	return unitList;
}

// Finds a team with a certain ID from a list
function findTeam(teams, teamId) {
	return teams.find(team => team["team_id"] === teamId);
}

// Finds a user with a certain ID from a list
function findUser(users, userId) {
	return users.find(user => user["user_id"] === userId);
}

function createIndividualUnit(user, cat, rubric) {
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
	
	return new IndividualUnit(cat ?? null, rocsData, isDone, user);
}

function createFixedTeamUnit(team, cat, rubric, fixedTeamMembers) {
	const teamId = team["team_id"];
	
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
		
	const teamMembers = fixedTeamMembers[teamId];
		
	return new FixedTeamUnit(
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
	 * @abstract
	 * @param {CheckinsTracker} checkinsTracker
	 * @returns {object[]} The contents of the checked in tooltip.
	 */
	getCheckedInTooltip(checkinsTracker) {
		throw new Error("Not implemented");
	}
	
	/**
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
		
		if (newCat && Object.keys(newCat).length > 0) {
			newUnit.rocsData = newCat["rating_observable_characteristics_suggestions_data"];
			newUnit.isDone = newCat["done"];
		}
		
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
}
