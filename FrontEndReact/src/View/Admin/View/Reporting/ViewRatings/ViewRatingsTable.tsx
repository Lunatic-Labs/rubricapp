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

          const notificationSent = student.notification_sent ?? ratingRow.notification_sent ?? false;

          teamRow.feedback_info.push({
            name: fullName,
            lag: lag,
            notification_sent: notificationSent,
            is_assessor: student.is_assessor ?? false,
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

        // Feedback lag and notification status
        row.feedback_time_lag = this.getLagFromRow(currentRating);
        row.notification_sent = currentRating.notification_sent ?? false;

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
          customBodyRender: (value: any, tableMeta: any) => {
            const rowData = allRatings[tableMeta.rowIndex];
            const viewed = !!value;
            const notified = rowData?.notification_sent;

            const color = viewed
              ? '#2e7d32'   // Green - feedback viewed
              : notified
              ? '#ed6c02'  // Orange - notification sent, not viewed
              : '#d32f2f'; // Red - not notified

            const text = viewed
              ? (typeof value === 'string' ? value : String(value))
              : notified
              ? 'Sent, not viewed'
              : 'Not notified';

            return <span style={{ color, fontWeight: 500 }}>{text}</span>;
          },
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

            const hasAssessor = people.some((p: any) => p.is_assessor);

            return (
              <div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '6px 12px',
                  }}
                >
                  {people.map((p: any, idx: number) => {
                    const viewed = !!p.lag;
                    const notified = p.notification_sent;

                    // 3 states: viewed (green), sent but not viewed (orange), not notified (red)
                    const color = viewed
                      ? '#2e7d32'   // Green - feedback viewed
                      : notified
                      ? '#ed6c02'  // Orange - notification sent, not viewed
                      : '#d32f2f'; // Red - not notified

                    const nameStyle: React.CSSProperties = {
                      fontWeight: 600,
                      color: color,
                      lineHeight: 1.1,
                    };

                    const lagText = viewed
                      ? (typeof p.lag === 'string' ? p.lag : String(p.lag))
                      : notified
                      ? 'Sent, not viewed'
                      : 'Not notified';

                    return (
                      <div key={`${p.name || 'member'}-${idx}`} style={{ minWidth: 0 }}>
                        <div style={nameStyle}>
                          {p.name || 'Unknown'}{p.is_assessor ? '*' : ''}
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{lagText}</div>
                      </div>
                    );
                  })}
                </div>
                {hasAssessor && (
                  <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '6px' }}>
                    * Submitted the assessment
                  </div>
                )}
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

    const title = isTeam ? 'Team Ratings' : 'Student Ratings';

    return (
      <MUIDataTable
        title={title}
        data={allRatings}
        columns={columns}
        options={options}
      />
    );
  }
}

export default ViewRatingsTable;
