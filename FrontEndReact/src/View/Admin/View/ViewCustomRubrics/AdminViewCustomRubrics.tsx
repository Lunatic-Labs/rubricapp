import { Component } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { genericResourceGET } from "../../../../utility";
import CollapsableRubricCategoryTable from "../../Add/AddCustomRubric/CollapsableRubricCategoryTable";
import ErrorMessage from "../../../Error/ErrorMessage";
import CustomButton from "../../Add/AddCustomRubric/Components/CustomButton";
import Loading from "../../../Loading/Loading";
import { Rubric } from '../../../../types/Rubric';
import { Category } from '../../../../types/Category';
import { Course } from '../../../../types/Course';

interface AdminViewCustomRubricsProps {
    navbar: any;
}

interface AdminViewCustomRubricsState {
    isLoaded: boolean | null;
    errorMessage: string | null;
    rubrics: Rubric[] | null;
    categories: Category[] | null;
    courses: Course[] | null;
    courseFilter: string;
    navbar: any;
}

class AdminViewCustomRubrics extends Component<AdminViewCustomRubricsProps, AdminViewCustomRubricsState> {
    handleCourseFilterChange: (event: SelectChangeEvent<string>) => void;

    constructor(props: AdminViewCustomRubricsProps) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            rubrics: null,
            categories: null,
            courses: null,
            // Default the filter to the course the admin navigated here from.
            courseFilter: props.navbar?.state?.chosenCourse
                ? String(props.navbar.state.chosenCourse["course_id"])
                : "all",
            navbar: props.navbar,
        };

        this.handleCourseFilterChange = (event: SelectChangeEvent<string>) => {
            this.setState({ courseFilter: event.target.value });
        };
    }

    componentDidMount() {
        // All of this user's custom rubrics (no course scope): the page
        // shows every rubric they created, with a Course column and a
        // course filter. The backend filters by user_id, which
        // genericResourceGET appends automatically.
        genericResourceGET(`/rubric?custom=${true}`, "rubrics", this);

        genericResourceGET(`/category?custom=${true}`, "categories", this);

        // Courses this admin can assign rubrics to, for the Course column
        // and filter (same pattern as AddCustomRubric).
        var navbar = this.props.navbar;
        if (navbar.props.isSuperAdmin) {
            genericResourceGET(`/course?admin_id=${navbar.state.user.user_id}`, "courses", this);
        } else {
            genericResourceGET(`/course`, "courses", this);
        }
    }

    componentDidUpdate() {
        // If the default filter course isn't in the fetched course list
        // (e.g. a stale chosenCourse), fall back to showing everything.
        const { courses, courseFilter } = this.state;

        if (courses && courseFilter !== "all" &&
            !courses.some((course: Course) => String(course.course_id) === courseFilter)) {
            this.setState({ courseFilter: "all" });
        }
    }

    render() {
        const {
            isLoaded,
            errorMessage,
            rubrics,
            categories,
            courses,
            courseFilter,
        } = this.state;

        if (!isLoaded || !rubrics || !categories || !courses) {
            return(
                <Loading />
            );
        }

        // Map course_id -> course name for the Course column.
        var courseMap: { [courseId: number]: string } = {};
        courses.forEach((course: Course) => {
            courseMap[course.course_id] = course.course_name;
        });

        // Filter by the selected course, then sort by course name and
        // rubric name so the list groups by course.
        var visibleRubrics = courseFilter === "all"
            ? rubrics
            : rubrics.filter((rubric: Rubric) => String(rubric.course_id) === courseFilter);

        visibleRubrics = [...visibleRubrics].sort((a: Rubric, b: Rubric) => {
            var courseA = a.course_id != null ? (courseMap[a.course_id] ?? "") : "";
            var courseB = b.course_id != null ? (courseMap[b.course_id] ?? "") : "";
            if (courseA !== courseB) {
                return courseA.localeCompare(courseB);
            }
            return a.rubric_name.localeCompare(b.rubric_name);
        });

        return(
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: "16px"}}>
                    <h2
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                        }}
                        aria-label="addCustomRubricTitle"
                    >
                        My Custom Rubrics
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: "16px" }}>
                        <FormControl
                            size="small"
                            sx={{
                                minWidth: "200px",
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'var(--dropdown-bg)',
                                    color: 'var(--dropdown-text)',
                                    '& fieldset': {
                                        borderColor: 'var(--dropdown-border)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'var(--dropdown-border)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'var(--dropdown-border)',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--dropdown-label)',
                                    '&.Mui-focused': {
                                        color: 'var(--dropdown-border)',
                                    },
                                },
                            }}
                        >
                            <InputLabel id="rubricCourseFilterLabel">Filter by Course</InputLabel>
                            <Select
                                labelId="rubricCourseFilterLabel"
                                id="rubricCourseFilter"
                                label="Filter by Course"
                                value={courseFilter}
                                onChange={this.handleCourseFilterChange}
                                aria-label="myCustomRubricsCourseFilterDropdown"
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: 'var(--dropdown-bg)',
                                            color: 'var(--dropdown-text)',
                                            '& .MuiMenuItem-root': {
                                                '&:hover': {
                                                    backgroundColor: 'var(--dropdown-hover)',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: 'var(--dropdown-selected)',
                                                    '&:hover': {
                                                        backgroundColor: 'var(--dropdown-selected)',
                                                    },
                                                },
                                            },
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="all" aria-label="myCustomRubricsCourseFilterAll">All Courses</MenuItem>
                                {courses.map((course: Course) => (
                                    <MenuItem
                                        key={course.course_id}
                                        value={String(course.course_id)}
                                        aria-label="myCustomRubricsCourseFilterChoice"
                                    >
                                        {course.course_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <CustomButton
                            label="Add Custom Rubric"
                            isOutlined={false}
                            onClick={() => {
                                this.props.navbar.setAddCustomRubric(true);
                            }}
                            aria-label="myCustomRubricsAddCustomRubricButton"
                        />
                    </div>
                </div>
                <hr style={{ border: 0, borderTop: "1px solid #787878", margin: 0 }} />

                { errorMessage &&
                    <ErrorMessage
                        errorMessage={errorMessage}
                    />
                }

                <CollapsableRubricCategoryTable
                    categories={categories}
                    rubrics={visibleRubrics}
                    readOnly={true}
                    showEditButton={true}
                    courseMap={courseMap}
                    navbar={this.state.navbar}
                />
            </div>
        );
    }
}

export default AdminViewCustomRubrics;
