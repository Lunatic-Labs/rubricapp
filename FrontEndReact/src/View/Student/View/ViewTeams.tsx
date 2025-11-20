// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../Components/CustomDataTable";
import { getHumanReadableDueDate } from "../../../utility";

class ViewTeams extends Component{
    props: any;
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
                    customBodyRender: (observerId: any) => {
                        return(
                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
                    customBodyRender: (user: any) => {
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
                    customBodyRender: (date_created: any) => {
                        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                        let dateCreatedString = getHumanReadableDueDate(date_created);

                        return(
                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                            <p className="pt-3" variant='contained'>
                                {date_created ? dateCreatedString : "N/A"}
                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
