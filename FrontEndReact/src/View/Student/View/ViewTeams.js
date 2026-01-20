import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../Components/CustomDataTable";
import { getHumanReadableDueDate } from "../../../utility";

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
class ViewTeams extends Component{
    render() {
        var teams = this.props.teams;
        var users = this.props.users;
        var navbar = this.props.navbar;

        const columns = [
            {
                name: "team_name",
                label: "Team Name",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"230px" } },
                    setCellProps: () => { return { width:"230px" } },
                }
            },
            {
                name: "observer_id",
                label: navbar.state.chosenCourse["use_tas"] ? "TA Name" : "Instructor Name",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"230px" } },
                    setCellProps: () => { return { width:"230px" } },
                    customBodyRender: (observerId) => {
                        return(
                            <p className="pt-3" variant="contained">{users[observerId]}</p>
                        )
                    }
                }
            },
            {
                name: "team_users",
                label: "Members",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"230px" } },
                    setCellProps: () => { return { width:"230px" } },
                    customBodyRender: (user) => {
                        return(
                            <>{user + " "}</>
                        );
                    }
                },
            },
            {
                name: "date_created",
                label: "Date Created",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"160px" } },
                    setCellProps: () => { return { width:"160px" } },
                    customBodyRender: (date_created) => {
                        let dateCreatedString = getHumanReadableDueDate(date_created);

                        return(
                            <p className="pt-3" variant='contained'>
                                {date_created ? dateCreatedString : "N/A"}
                            </p>
                        )
                    }
                }
            },
        ];

        const options = {
            onRowsDelete: false,
            download: false,
            print: false,
            viewColumns: false,
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "vertical",
            tableBodyMaxHeight: "21rem"
        };

        return (
            <CustomDataTable
                data={teams ? teams : []}
                columns={columns}
                options={options}
            />
        )
    }
}

export default ViewTeams;
