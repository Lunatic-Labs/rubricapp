import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../Components/CustomDataTable";
import { getHumanReadableDueDate } from "../../../utility";
import { GridColDef } from '@mui/x-data-grid';

/**
 * @description
 * Read-only table of teams for the current student view.
 *
 * Responsibilities:
 *  - Receives a teams[] array (each with team_name, observer_id, team_users, date_created).
 *  - Receives a users map (observer_id → observer display name).
 *  - Renders a CustomDataTable with columns for team name, TA/instructor name,
 *    members, and date created.
 *
 * Props:
 *  @prop {Array}  teams   - List of team objects to show in the table.
 *  @prop {Object} users   - Map of user_id → "First Last" (from parseUserNames).
 *  @prop {Object} navbar  - Navbar instance to inspect chosenCourse.use_tas
 *                           (to label the observer column).
 *
 * Notes:
 *  - This component does not perform any fetches.
 *  - Sorting is handled by CustomDataTable’s built-in column sorting; this file
 *    simply defines column metadata and uses getHumanReadableDueDate for dates.
 */

interface ViewTeamsProps {
    teams: any[];
    users: { [key: string]: string };
    navbar: any;
}

class ViewTeams extends Component<ViewTeamsProps> {
    render() {
        var teams = this.props.teams;
        var users = this.props.users;
        var navbar = this.props.navbar;

        const columns: GridColDef[] = [
            {
                field: "team_name",
                headerName: "Team Name",
                width: 230,
            },
            {
                field: "observer_id",
                headerName: navbar.state.chosenCourse["use_tas"] ? "TA Name" : "Instructor Name",
                width: 230,
                renderCell: (params) => (
                    <p className="pt-3">{users[params.value]}</p>
                )
            },
            {
                field: "team_users",
                headerName: "Members",
                width: 230,
                renderCell: (params) => (
                    <>{params.value + " "}</>
                )
            },
            {
                field: "date_created",
                headerName: "Date Created",
                width: 160,
                renderCell: (params) => {
                    let dateCreatedString = getHumanReadableDueDate(params.value);

                    return (
                        <p className="pt-3">
                            {params.value ? dateCreatedString : "N/A"}
                        </p>
                    )
                }
            },
        ];

        return (
            <CustomDataTable
                data={teams ? teams : []}
                columns={columns}
                getRowId={(row) => row.team_id}
                height="21rem"
            />
        )
    }
}

export default ViewTeams;
