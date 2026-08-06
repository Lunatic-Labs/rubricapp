DELIMITER // 
CREATE PROCEDURE FilterStudentAssessmentTasks (
    IN procedure_user_id int,
    IN procedure_course_id int
) BEGIN
WITH
    StudentsTeams AS (
        SELECT
            TU.team_id
        FROM
            TeamUser AS TU
            JOIN Team as T ON TU.team_id = T.team_id
        WHERE
            TU.user_id = procedure_user_id
            AND T.course_id = procedure_course_id
    ),
    ViewableAssessments AS (
        SELECT
            AT.*
        FROM
            AssessmentTask AS AT
        WHERE
            AT.course_id = procedure_course_id
            AND AT.published = TRUE
    ),
    MatchATToCAT AS (
        SELECT
            VA.*,
            CAT.completed_assessment_id,
            CAT.completed_by,
            CAT.team_id,
            CAT.user_id,
            CAT.initial_time,
            CAT.last_update,
            CAT.rating_observable_characteristics_suggestions_data,
            CAT.done
        FROM
            ViewableAssessments AS VA
            LEFT JOIN CompletedAssessment AS CAT ON VA.assessment_task_id = CAT.assessment_task_id
            AND (
                CAT.user_id = procedure_user_id
                OR CAT.team_id in (
                    SELECT
                        team_id
                    from
                        StudentsTeams
                )
            )
    )
SELECT
    M.*
FROM
    MatchATToCAT AS M
WHERE
    NOT (
        M.completed_assessment_id IS NULL
        AND (
            M.due_date < NOW()
            OR M.locked = true
        )
    );

END // 
DELIMITER ;
