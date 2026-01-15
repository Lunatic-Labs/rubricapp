import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';

/**
 * Ratings table for both Individual and Team ATs.
 *
 * - Individual:
 *    • One row per student.
 *    • Shows "Feedback Time Lag" as a separate column.
 *
 * - Team:
 *    • One row per team.
 *    • "Feedback Information" column shows all team members.
 *      - Name is RED if they have not viewed feedback (no lag_time).
 *      - Name is GREEN if they have viewed feedback (lag_time present).
 *      - Lag text is shown under the name (or "-" if none).
 */
class ViewRatingsTable extends Component {

  /**
   * Helper to get a clean student name string.
   */
  getStudentName = (ratingRow) => {
    // Backend may send a single "student" string, or first_name / last_name
    if (ratingRow.student) {
      return String(ratingRow.student);
    }

    const first = ratingRow.first_name || '';
    const last = ratingRow.last_name || '';
    const full = `${first} ${last}`.trim();

    if (full) return full;
    if (ratingRow.student_name) return String(ratingRow.student_name);

    return 'Unknown';
  };

  /**
   * Helper to extract lag string (if any) from a row.
   */
  getLagFromRow = (ratingRow) => {
    if (ratingRow.lag_time != null) return ratingRow.lag_time;
    if (ratingRow.feedback_time_lag != null) return ratingRow.feedback_time_lag;
    return null;
  };

  render() {
    const isTeamMap = parseAssessmentIndividualOrTeam(this.props.assessmentTasks);
    const isTeam = isTeamMap[this.props.chosenAssessmentId] === true;

    const allRatings = [];
    const nameLabel = isTeam ? 'Team Name' : 'Student Name';

    if (isTeam) {
      /**
       * TEAM MODE
       * ---------
       * Backend returns one row per team with:
       *   - team_name
       *   - rating_observable_characteristics_suggestions_data
       *   - students: [{ first_name, last_name, lag_time }, ...]
       *
       * We map that into one table row per team, and render the students
       * in the "Feedback Information" column.
       *
       * If the backend is still returning the older "one row per student"
       * shape (no `students` array), we fall back to grouping by team_name
       * and treating each rating row as a single student.
       */
      const teamMap = new Map();

      this.props.ratings.forEach((ratingRow) => {
        const ratingData = ratingRow['rating_observable_characteristics_suggestions_data'];
        if (!ratingData) return;

        const teamName = ratingRow.team_name || 'Unknown Team';

        // Get existing aggregated row or create a new one
        let teamRow = teamMap.get(teamName);
        if (!teamRow) {
          teamRow = {
            name: teamName,
            feedback_info: [],
          };

          // Copy the rating values (same for all members of the team)
          Object.keys(ratingData).forEach((category) => {
            teamRow[category] = ratingData[category]['rating'];
          });

          teamMap.set(teamName, teamRow);
        }

        // Normal path: backend sends `students` array on each team row.
        // Fallback: if no `students`, treat this row itself as a single student.
        const studentsArray =
          Array.isArray(ratingRow.students) && ratingRow.students.length > 0
            ? ratingRow.students
            : [ratingRow];

        studentsArray.forEach((student) => {
          const first = student.first_name || '';
          const last = student.last_name || '';
          const fullName = `${first} ${last}`.trim() || 'Unknown';

          const lag =
            student.lag_time != null
              ? student.lag_time
              : this.getLagFromRow(student);

          teamRow.feedback_info.push({
            name: fullName,
            lag: lag,
          });
        });
      });

      // Flatten map into an array
      teamMap.forEach((row) => {
        allRatings.push(row);
      });

    } else {
      /**
       * INDIVIDUAL MODE
       * ---------------
       * One row per student, with “Feedback Time Lag” in its own column.
       */
      this.props.ratings.forEach((currentRating) => {
        const ratingData = currentRating['rating_observable_characteristics_suggestions_data'];
        if (!ratingData) return;

        const row = {};

        // Name column
        if (currentRating.first_name || currentRating.last_name) {
          const first = currentRating.first_name || '';
          const last = currentRating.last_name || '';
          row.name = `${first} ${last}`.trim();
        } else if (currentRating.student_name) {
          row.name = currentRating.student_name;
        } else if (currentRating.team_name) {
          row.name = currentRating.team_name;
        } else {
          row.name = 'Unknown';
        }

        // Category ratings
        Object.keys(ratingData).forEach((category) => {
          row[category] = ratingData[category]['rating'];
        });

        // Feedback lag
        row.feedback_time_lag = this.getLagFromRow(currentRating);

        allRatings.push(row);
      });
    }

    // === Columns ===
    const columns = [
      {
        name: 'name',
        label: nameLabel,
        options: {
          filter: true,
          setCellHeaderProps: () => ({ style: { width: '10%' } }),
          setCellProps: () => ({ style: { width: '10%' } }),
        },
      },
    ];

    // Category columns – same for individual & team, no diagonal text.
    this.props.categories.map((cat) => {
      columns.push({
        name: cat['category_name'],
        label: cat['category_name'],
        options: {
          filter: true,
        },
      });
      return cat;
    });

    // Feedback column(s)
    if (!isTeam) {
      // Individual AT: simple “Feedback Time Lag” column
      columns.splice(1, 0, {
        name: 'feedback_time_lag',
        label: 'Feedback Time Lag',
        options: {
          filter: true,
        },
      });
    } else {
      // Team AT: “Feedback Information” with member grid
      columns.push({
        name: 'feedback_info',
        label: 'Feedback Information',
        options: {
          filter: true,
          sort: false,
          setCellProps: () => ({
            style: {
              verticalAlign: 'top',
              paddingTop: '8px',
              paddingBottom: '8px',
            },
          }),
          customBodyRender: (value) => {
            const people = Array.isArray(value) ? value : [];
            if (!people.length) {
              return <span style={{ color: '#d32f2f' }}>No team members</span>;
            }

            return (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '6px 12px',
                }}
              >
                {people.map((p, idx) => {
                  const viewed = !!p.lag; // lag present => viewed feedback
                  const nameStyle = {
                    fontWeight: 600,
                    color: viewed ? '#2e7d32' /* green */ : '#d32f2f' /* red */,
                    lineHeight: 1.1,
                  };
                  const lagText =
                    typeof p.lag === 'string'
                      ? p.lag
                      : p.lag == null || p.lag === false
                      ? '-'
                      : String(p.lag);

                  return (
                    <div key={`${p.name || 'member'}-${idx}`} style={{ minWidth: 0 }}>
                      <div style={nameStyle}>{p.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{lagText}</div>
                    </div>
                  );
                })}
              </div>
            );
          },
        },
      });
    }

    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      viewColumns: false,
      selectableRows: 'none',
      selectableRowsHeader: false,
      responsive: 'standard',
      tableBodyMaxHeight: '70%',
    };

    return <MUIDataTable data={allRatings} columns={columns} options={options} />;
  }
}

export default ViewRatingsTable;
