import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';

/**
 * Renders Ratings table for both Individual and Team ATs.
 * - Individual: shows "Feedback Time Lag" per student.
 * - Team: shows a single "Feedback Information" column. Each entry lists team members,
 *         colors the name GREEN if they've viewed feedback (has a lag), RED if not,
 *         and shows the lag (e.g., "1d 10h") or "-" beneath the name.
 */
class ViewRatingsTable extends Component {
  /**
   * Normalize any "student" payload into an array of { name, lag } objects.
   * Handles a few common shapes so we don't need exact schema right now.
   */
  normalizeFeedbackArray = (raw) => {
    if (!raw) return [];

    const toName = (obj) => {
      // Try a few possibilities
      if (!obj) return '';
      const nameFromParts = [obj.first_name, obj.last_name].filter(Boolean).join(' ').trim();
      return (
        nameFromParts ||
        obj.name ||
        obj.student_name ||
        obj.full_name ||
        String(obj) // fallback if raw strings are provided
      );
    };

    const toLag = (obj) => {
      if (!obj) return null;
      return (
        obj.lag_time ??
        obj.lag ??
        obj.feedback_time_lag ??
        (typeof obj === 'string' ? null : null)
      );
    };

    // If backend returns a single object, wrap it.
    if (!Array.isArray(raw)) raw = [raw];

    return raw.map((entry) => ({
      name: toName(entry),
      lag: toLag(entry),
    }));
  };

  render() {
    const isTeamMap = parseAssessmentIndividualOrTeam(this.props.assessmentTasks);
    const isTeam = isTeamMap[this.props.chosenAssessmentId] === true;

    // Transform API rows into flat table rows for MUIDataTable
    const allRatings = [];
    const nameLabel = isTeam ? 'Team Name' : 'Student Name';

    this.props.ratings.map((currentRating) => {
      const row = {};

      // Left-most name cell
      if (currentRating['first_name'] && currentRating['last_name']) {
        row['name'] = `${currentRating['first_name']} ${currentRating['last_name']}`;
      } else if (currentRating['team_name']) {
        row['name'] = currentRating['team_name'];
      }

      // Rating values per category
      if (currentRating['rating_observable_characteristics_suggestions_data']) {
        Object.keys(currentRating['rating_observable_characteristics_suggestions_data']).forEach((category) => {
          row[category] =
            currentRating['rating_observable_characteristics_suggestions_data'][category]['rating'];
        });
      }

      // Feedback info
      if (!isTeam) {
        // Individual AT: one lag per row
        row['feedback_time_lag'] = currentRating['lag_time'] ?? currentRating['feedback_time_lag'] ?? null;
      } else {
        // Team AT: possibly many students — render as grid in one cell
        // Prefer explicit "student" field if it's an array; otherwise try to synthesize from whatever we have.
        const rawStudents = currentRating['student'] ?? currentRating['students'] ?? [];
        row['feedback_info'] = this.normalizeFeedbackArray(rawStudents);
      }

      // Only push when we have category payload (matches your previous guard)
      if (currentRating['rating_observable_characteristics_suggestions_data']) {
        allRatings.push(row);
      }

      return allRatings;
    });

    // Base columns
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

    // Category columns (retain the rotated header styling for team ATs)
    this.props.categories.map((cat) => {
      const common = {
        name: cat['category_name'],
        label: cat['category_name'],
        options: { filter: true },
      };

      if (isTeam) {
        common.options.customHeadLabelRender = (columnMeta) => (
          <div
            style={{
              transform: 'rotate(45deg)',
              transformOrigin: 'center',
              whiteSpace: 'wrap',
              height: '150px',
              width: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'left',
            }}
          >
            {columnMeta.label}
          </div>
        );
        common.options.setCellHeaderProps = () => ({
          style: {
            minWidth: '40px',
            maxWidth: '40px',
            padding: 0,
            margin: 0,
            height: 'auto',
            verticalAlign: 'middle',
          },
        });
      }

      columns.push(common);
      return cat;
    });

    // Feedback columns (differs for team vs individual)
    if (!isTeam) {
      columns.splice(1, 0, {
        name: 'feedback_time_lag',
        label: 'Feedback Time Lag',
        options: { filter: true },
      });
    } else {
      columns.push({
        name: 'feedback_info',
        label: 'Feedback Information',
        options: {
          filter: false,
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

            // Layout as a simple responsive grid; each person shows name (colored) and small lag text below.
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
