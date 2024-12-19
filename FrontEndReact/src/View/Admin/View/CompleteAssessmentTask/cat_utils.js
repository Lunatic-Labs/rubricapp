import { StatusIndicatorState } from "./StatusIndicator";

export function getUnitCategoryStatus(unit, assessmentTask, categoryName) {
	const showSuggestions = assessmentTask["show_suggestions"];
	const categoryData = unit.rocsData[categoryName];
	
	const obsCharHasChecked = categoryData["observable_characteristics"].includes("1");
	const suggestionsHasChecked = showSuggestions ? categoryData["suggestions"].includes("1") : false;
	
	if (obsCharHasChecked && (!showSuggestions || suggestionsHasChecked)) {
		return StatusIndicatorState.COMPLETED;
	} else if (obsCharHasChecked || suggestionsHasChecked) {
		return StatusIndicatorState.IN_PROGRESS;
	}

	return StatusIndicatorState.NOT_STARTED;
}

/**
 * This class holds the list of checked in users and allows performing
 *  optimized queries on them.
 */
export class CheckinsTracker {
	/** 
	 * List of all checkin objects.
	 * @type {object[]}
	 */
	checkinsList;
	
	/** 
	 * Map from user id to the index of that user's checkin object in checkinsList.
	 * @type {Map<number, number>}
	 */
	checkinsByUserId;
	
	constructor(checkins) {
		this.checkinsList = checkins;
		
		const checkinsByUserId = new Map();
		
		checkins.forEach((checkin, index) => {
			if ("user_id" in checkin) {
				checkinsByUserId.set(checkin["user_id"], index);
			}
		});
		
		this.checkinsByUserId = checkinsByUserId;
	}
	
	/**
	 * @param {number} userId The user's id.
	 * @returns {object | null} The checkin entry or null if the user doesn't have one.
	 */
	getUserCheckIn(userId) {
		const index = this.checkinsByUserId.get(userId);
		
		return index === undefined ? null : this.checkinsList[index];
	}
	
	/**
	 * @param {number} userId The user's id.
	 * @returns {boolean} If the user has a checkin entry.
	 */
	hasCheckInForUser(userId) {
		return this.checkinsByUserId.has(userId);
	}
}
