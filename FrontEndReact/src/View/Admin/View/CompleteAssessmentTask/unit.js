const UnitType = Object.freeze({
	INDIVIDUAL: "individual",
	FIXED_TEAM: "fixed_team",
});

class ATUnit {
	/** 
	 * The completed AT object associated with this unit.
	 * @type {object} 
	 */
	completedAssessmentTask;
	
	/** 
	 * @type {UnitType[keyof UnitType]}
	 */
	unitType;
	
	/**
	 * @param {object} cat Complete assessment task object.
	 * @param {UnitType[keyof UnitType]} unitType Unit type.
	 */
	constructor(cat, unitType) {
		this.completedAssessmentTask = cat;
		this.unitType = unitType;
	}
	
	/**
	 * @returns {object} The rating_observable_characteristics_suggestions_data of the completed assessment task for this unit.
	 */
	get rocsData() {
		return this.completedAssessmentTask["rating_observable_characteristics_suggestions_data"];
	}
	
	/**
	 * @abstract
	 * @returns {string} The display name for this unit's unit tab.
	 */
	get displayName() {
		throw "Not implemented"
	}
	
	/**
	 * @returns {boolean} If this unit has been marked as done.
	 */
	get isDone() {
		return this.rocsData["done"];
	}
	
	/**
	 * @returns {string[]|null} A list of the student's names checked into the unit. Null for individual units.
	 */
	get checkedInNames() {
		return null;
	}
}

class IndividualUnit extends ATUnit {
	/** 
	 * The user object associated with this unit.
	 * @type {object}
	 */
	user;
	
	/**
	 * @param {object} cat Complete assessment task object.
	 * @param {object} user User object.
	 */
	constructor(cat, user) {
		super(cat, UnitType.INDIVIDUAL);
		this.user = user;
	}
	
	get displayName() {
		return this.user["first_name"] + " " + this.user["last_name"];
	}
}

class FixedTeamUnit extends ATUnit {
	/** 
	 * The team object associated with this unit.
	 * @type {object}
	 */
	team;
	
	/** 
	 * List of user objects that are checked into this fixed team.
	 * @type {object[]}
	 */
	checkedInUsers;
	
	/**
	 * @param {object} cat Complete assessment task object.
	 * @param {object} team Team object.
	 * @param {object[]} checkedInUsers List of user objects that are checked into this fixed team.
	 */
	constructor(cat, team, checkedInUsers) {
		super(cat, UnitType.FIXED_TEAM);
		this.team = team;
		this.checkedInUsers = checkedInUsers;
	}
	
	get displayName() {
		return this.team["team_name"];
	}
	
	get checkedInNames() {
		return this.checkedInUsers.map(user => user["first_name"] + " " + user["last_name"]);
	}
}
