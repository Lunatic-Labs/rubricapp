import React, { Component } from 'react';
// @ts-ignore: allow importing CSS without type declarations
import 'bootstrap/dist/css/bootstrap.css';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { IconButton } from '@mui/material';
import CustomDataTable from '../../../Components/CustomDataTable'
import { genericResourceGET } from '../../../../utility';

/**
 * @description
 * Shows the current members of the selected team in a table, with an
 * option to remove/unassign members on the client side.
 *
 * Responsibilities:
 *  - Watches navbar.buildTeam.selectedTeam for changes.
 *  - When the selected team changes, fetches the users for that team.
 *  - Renders a CustomDataTable of team members with an "Unassign" action.
 *
 * @prop {Object} navbar - Navbar instance; expects:
 *                         navbar.state.chosenCourse.course_id and
 *                         navbar.buildTeam.selectedTeam.
 *
 * @property {string|null} state.errorMessage - Error string if the user fetch fails.
 * @property {boolean}     state.isLoaded     - True once the current team’s users have been loaded.
 * @property {number|null} state.selectedTeam - Team_id last loaded (used to avoid unnecessary refetches).
 * @property {Array|null}  state.users        - Users in the currently selected team.
 */

interface ShowTeamMembersProps {
    navbar: any;
}

interface ShowTeamMembersState {
    errorMessage: string | null;
    isLoaded: boolean;
    selectedTeam: string | number | null;
    users: any[] | null;
}

class ShowTeamMembers extends Component<ShowTeamMembersProps, ShowTeamMembersState> {
    removeUser: any;
    constructor(props: ShowTeamMembersProps) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            selectedTeam: null,
            users: null
        }

        /**
         * @method removeUser
         * @description
         * Removes a user from the local users array (front-end only).
         * This does not call the backend; it just updates state.users so the
         * table refreshes.
         *
         * @param {number} userId - ID of the user to remove from the table.
         */
        
        this.removeUser = (userId: any) => {
            var students = this.state.users;
            var studentsRemaining: any = [];

            if (students) {
                for(var student = 0; student < students.length; student++) {
                    if(students[student]["user_id"]!==userId) {
                    studentsRemaining = [...studentsRemaining, students[student]];
                    }
                }
            }

            this.setState({
                users: studentsRemaining
            });
        }
    }

    /**
     * @method componentDidUpdate
     * @description
     * Whenever the selected team changes in navbar.buildTeam, fetch the roster
     * for that team.
     *
     * Fetch:
     *  - GET /user?course_id={course_id}&team_id={team_id}
     *    - Query params:
     *        * course_id — ID of the chosen course (navbar.state.chosenCourse.course_id).
     *        * team_id   — ID of the team whose members should be returned.
     *    - genericResourceGET stores the result in state.users and updates isLoaded/errorMessage.
     *
     * Sorting:
     *  - No explicit sorting is done here; ordering is whatever the backend returns.
     *    Column sorting is handled by CustomDataTable.
     *
     * Notes / JIRA candidate:
     *  - state.selectedTeam is only used for comparison here. If it is not updated
     *    when the fetch completes (e.g., inside genericResourceGET’s success path),
     *    this condition can trigger repeated fetches for the same team.
     *  - If other team-management views also call /user?course_id&team_id for the
     *    same team, consider consolidating this into a shared fetch to avoid
     *    multiple requests for identical data.
     */
    componentDidUpdate() {
        var navbar = this.props.navbar;
        var teamId = navbar.buildTeam.selectedTeam;
        var courseID = navbar.state.chosenCourse.course_id; 

        if (teamId !== null && teamId !== this.state.selectedTeam) {
            genericResourceGET(
                `/user?course_id=${courseID}&team_id=${teamId}`, 
                'users', this as any);
        }
    }

    render() {
        const studentColumns = [
            {
                name: "first_name",
                label: "First Name",
                options: {
                    filter: true,
                    align: "center",
                }
            },
            {
                name: "last_name",
                label: "Last Name",
                options: {
                    filter: true,
                    align: "center"
                }
            },
            {
                name: "user_id",
                label: "Unassign",
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (userId: any) => {
                        return (
                            <IconButton aria-label='controlled'
                                onClick={() => {
                                    this.removeUser(userId);
                                }}
                            >
                                <RemoveCircleOutlineIcon/>
                            </IconButton>
                        );
                    }
                }
            }
        ];

        const options = {
            onRowsDelete: false,
            download: false,
            print: false,
            viewColumns: false,
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "standard",
            tableBodyMaxHeight: "21rem",
        };

        var navbar = this.props.navbar;
        var teamId = navbar.buildTeam.selectedTeam;
        var students = this.state.users;

        return (
            <>
                { (teamId !== null) && students !== null &&
                    <>
                        <CustomDataTable 
                            data={students}
                            columns={studentColumns}
                            options={options}
                        />
                    </>
                }
            </>
        )
    }
}

export default ShowTeamMembers;
