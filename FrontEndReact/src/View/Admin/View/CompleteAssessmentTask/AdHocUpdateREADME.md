!! Delete this file after Ad Hoc Teams have been integrated into unit.js and CompleteAssessmentTask.js !!

Form.js and it's children have been transitioned to use units rather than reference specific database units. This allows Complete Assessment Task (CAT) data to be handled the same way regardless of the type of unit being handled. The logic for units is contained entirely in "unit.js" through the abstract class `ATUnit` and its children, `IndividualUnit` and `FixedTeamUnit`. These units are created in `generateUnitList()` and their own respective creation functions: `createIndividualUnit` and `createFixedTeamUnit`. An enum `UnitType` is used to help determine the type of a unit. 

"CompleteAssessmentTask.js" is in charge of fetching the unit information for all types of units from the backend, and calling `generateUnitList()` with the correct arguments. "unit.js" holds all of the logic for the unit classes and creation.

Here's what we think will need to be changed to update these files for Ad Hoc teams:

"CompleteAssessmentTask.js":
- Update Fetches to include Ad Hoc data
- Pass in new information into `generateUnitList()`

"unit.js":
- Use ad hoc UnitType in enum
- Add new child class of ATUnit for ad hoc units
- Update unit list generation in generateUnitList
- Create new functions to createAdHocUnits
- Likely will need to track ad hoc team members with a CheckinTracker Object from cat_utils.js

Check for any places that assume fixed teams. We removed as many of these as we could find, but we may have missed a couple.