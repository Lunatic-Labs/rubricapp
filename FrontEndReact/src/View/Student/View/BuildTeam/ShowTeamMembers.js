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
            error: null,
            errorMessage: null,
            isLoaded: false,
            selectedTeam: null,
            users: null
        }

        this.removeUser = (user_id) => {
            var students = this.state.users;
            var studentsRemaining = [];

            for(var student = 0; student < students.length; student++) {
                if(students[student]["user_id"]!==user_id) {
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
        var team_id = navbar.buildTeam.selectedTeam;

        if (team_id !== null && team_id !== this.state.selectedTeam) {
            genericResourceGET(`/user?team_id=${team_id}`, 'users', this);
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
                    filter: true,
                    sort: false,
                    customBodyRender: (user_id) => {
                        return (
                            <IconButton aria-label='controlled'
                                onClick={() => {
                                    this.removeUser(user_id);
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
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "standard",
            tableBodyMaxHeight: "21rem",
        };

        var navbar = this.props.navbar;
        var team_id = navbar.buildTeam.selectedTeam;
        var students = this.state.users;

        return (
            <>
                { (team_id !== null) && students !== null &&
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
