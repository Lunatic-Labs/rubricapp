import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { IconButton } from '@mui/material';
import CustomDataTable from '../../../Components/CustomDataTable.js'
import { genericResourceGET } from '../../../../utility.js';



class ShowTeamMembers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            selectedTeam: null,
            users: null
        }

        this.removeUser = (userId) => {
            var students = this.state.users;
            var studentsRemaining = [];

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
                    customBodyRender: (userId) => {
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
