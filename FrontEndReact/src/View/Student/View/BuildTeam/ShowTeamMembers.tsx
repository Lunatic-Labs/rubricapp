// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// @ts-expect-error TS(2307): Cannot find module '@mui/icons-material/RemoveCirc... Remove this comment to see the full error message
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { IconButton } from '@mui/material';
import CustomDataTable from '../../../Components/CustomDataTable.js'
import { genericResourceGET } from '../../../../utility.js';



class ShowTeamMembers extends Component {
    props: any;
    removeUser: any;
    setState: any;
    state: any;
    constructor(props: any) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            selectedTeam: null,
            users: null
        }

        this.removeUser = (userId: any) => {
            var students = this.state.users;
            var studentsRemaining: any = [];

            for(var student = 0; student < students.length; student++) {
                if(students[student]["user_id"]!==userId) {
                studentsRemaining = [...studentsRemaining, students[student]];
                }
            }

            this.setState({
                users: studentsRemaining
            });
        }
    }

    componentDidUpdate() {
        var navbar = this.props.navbar;
        var teamId = navbar.buildTeam.selectedTeam;
        var courseID = navbar.state.chosenCourse.course_id; 

        if (teamId !== null && teamId !== this.state.selectedTeam) {
            genericResourceGET(
                `/user?course_id=${courseID}&team_id=${teamId}`, 
                'users', this);
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
            // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
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
