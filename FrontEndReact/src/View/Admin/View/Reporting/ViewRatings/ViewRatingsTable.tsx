import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';

interface ViewRatingsTableStateprops {
  
}

class ViewRatingsTable extends Component<any, ViewRatingsTableStateprops> {
  getStudentName = (ratingRow: any) => {
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
  getLagFromRow = (ratingRow: any) => {
    if (ratingRow.lag_time != null) return ratingRow.lag_time;
    if (ratingRow.feedback_time_lag != null) return ratingRow.feedback_time_lag;
    return null;
  };

  render() {
    const isTeamMap: any = parseAssessmentIndividualOrTeam(this.props.assessmentTasks);
    const isTeam = isTeamMap[this.props.chosenAssessmentId] === true;

    const allRatings: any[] = [];
    const nameLabel = isTeam ? 'Team Name' : 'Student Name';

    if (isTeam) {
      const teamMap: Map<any, any> = new Map();

      this.props.ratings.forEach((ratingRow: any) => {
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

        studentsArray.forEach((student: any) => {
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
      this.props.ratings.forEach((currentRating: any) => {
        const ratingData = currentRating['rating_observable_characteristics_suggestions_data'];
        if (!ratingData) return;

        const row: any = {};

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
    const columns: any[] = [
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

    // Category columns
    this.props.categories.map((cat: any) => {
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
      columns.splice(1, 0, {
        name: 'feedback_time_lag',
        label: 'Feedback Time Lag',
        options: {
          filter: true,
        },
      });
    } else {
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
          customBodyRender: (value: any) => {
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
                {people.map((p: any, idx: number) => {
                  const viewed = !!p.lag;
                  const nameStyle: React.CSSProperties = {
                    fontWeight: 600,
                    color: viewed ? '#2e7d32' : '#d32f2f',
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

    const options: any = {
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
