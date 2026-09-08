import React, { Component } from 'react';
import CustomDataTable from '../../../../Components/CustomDataTable';
import { GridColDef } from '@mui/x-data-grid';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';
import { AssessmentTask } from '../../../../../types/AssessmentTask';
import { Category } from '../../../../../types/Category';

interface ViewRatingsTableProps {
    navbar: any;
    assessmentTasks: AssessmentTask[];
    chosenAssessmentId: string | number;
    ratings: unknown[];
    categories: Category[];
}


class ViewRatingsTable extends Component<ViewRatingsTableProps> {
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
    const isTeamMap = parseAssessmentIndividualOrTeam(this.props.assessmentTasks);
    const isTeam = isTeamMap[this.props.chosenAssessmentId] === true;

    const allRatings: Record<string, unknown>[] = [];
    const nameLabel = isTeam ? 'Team Name' : 'Student Name';

    if (isTeam) {
      const teamMap: Map<Record<string, unknown>, any> = new Map();

      this.props.ratings.forEach((ratingRow: any) => {
        const ratingData = ratingRow['rating_observable_characteristics_suggestions_data'];
        if (!ratingData) return;

        const teamName = ratingRow.team_name || 'Unknown Team';

        // Get existing aggregated row or create a new one
        let teamRow = teamMap.get(teamName);
        if (!teamRow) {
          teamRow = {
            _row_id: teamMap.size,
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
      this.props.ratings.forEach((currentRating: any, index: number) => {
        const ratingData = currentRating['rating_observable_characteristics_suggestions_data'];
        if (!ratingData) return;

        const row: any = { _row_id: index };

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
    const columns: GridColDef[] = [
      {
        field: 'name',
        headerName: nameLabel,
        width: 160,
      },
    ];

    // Category columns
    this.props.categories.map((cat: Category) => {
      columns.push({
        field: cat['category_name'],
        headerName: cat['category_name'],
        width: 160,
      });
      return cat;
    });

    // Feedback column(s)
    if (!isTeam) {
      columns.splice(1, 0, {
        field: 'feedback_time_lag',
        headerName: 'Feedback Time Lag',
        width: 180,
        renderCell: (params) => {
          const viewed = !!params.value;
          const notified = params.row.notification_sent;

          const color = viewed
            ? '#2e7d32'   // Green - feedback viewed
            : notified
            ? '#ed6c02'  // Orange - notification sent, not viewed
            : '#d32f2f'; // Red - not notified

          const text = viewed
            ? (typeof params.value === 'string' ? params.value : String(params.value))
            : notified
            ? 'Sent, not viewed'
            : 'Not notified';

          return <span style={{ color, fontWeight: 500 }}>{text}</span>;
        },
      });
    } else {
      columns.push({
        field: 'feedback_info',
        headerName: 'Feedback Information',
        width: 220,
        sortable: false,
        renderCell: (params) => {
          const value = params.value;
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
      });
    }

    return (
      <CustomDataTable
        data={allRatings}
        columns={columns}
        getRowId={(row) => row._row_id}
        height="70%"
      />
    );
  }
}

export default ViewRatingsTable;
