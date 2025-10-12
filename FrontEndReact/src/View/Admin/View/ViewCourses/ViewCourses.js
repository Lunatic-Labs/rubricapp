import React, { Component } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

class ViewCourses extends Component {
  // ... other component code above unchanged ...

  render() {
    const { courses, courseRoles, setAddCourseTabWithCourse, navbar } = this.props;

    const columns = [
      // ... other columns ...
      {
        name: "use_tas",
        label: "Use TAs",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width: "6%" } },
        }
      },
      // ... other columns ...
    ];

    // ... some code omitted for brevity ...

    return (
      // ... surrounding table rendering ...
      // inside a customBodyRender for edit button
      <IconButton
        id={/* courseId placeholder - actual render provides courseId */}
        aria-label="Edit course"
        className="editCourseButton btn btn-primary"
        disabled={courseRoles && courseRoles[/* courseId placeholder */] !== 3}
        onClick={() => {
          const courseId = /* courseId placeholder - actual render provides courseId */ null;
          if (courseRoles && courseRoles[courseId] === 3) {
            setAddCourseTabWithCourse(courses, courseId, "AddCourse");
          }
        }}
      >
        <EditIcon sx={{ color: "black" }} />
      </IconButton>

      // inside a customBodyRender for view button
      <IconButton
        id={/* courseId placeholder - actual render provides courseId */}
        aria-label="View course"
        disabled={courseRoles && courseRoles[/* courseId placeholder */] !== 3}
        onClick={() => {
          const courseId = /* courseId placeholder - actual render provides courseId */ null;
          if (courseRoles && courseRoles[courseId] === 3) {
            navbar.setStudentDashboardWithCourse(courseId, courses);
          }
        }}
      >
        <VisibilityIcon sx={{ color: "black" }} />
      </IconButton>

      // ... rest of render ...
    );
  }
}

export default ViewCourses