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