import React, { Component } from "react";
import Button from "@mui/material/Button";
import "bootstrap/dist/css/bootstrap.css";
import CustomDataTable from "../../../Components/CustomDataTable";
import { genericResourceGET, genericResourcePOST, genericResourcePUT } from "../../../../utility";
import { Checkbox, Typography } from "@mui/material";
import { User } from "../../../../types/User";
import { GridColDef } from '@mui/x-data-grid';

interface AdminEditTeamMembersProps {
    navbar: any;
    addTeamAction: string;
}

interface AdminEditTeamMembersState {
    errorMessage: string | null;
    isLoaded: boolean;
    users: User[];
    userEdits: { [key: string]: User };
}

class AdminEditTeamMembers extends Component<AdminEditTeamMembersProps, AdminEditTeamMembersState> {
    saveUser: (userId: number) => void;
    sendUsers: () => void;
    constructor(props: AdminEditTeamMembersProps) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            users: [],
            userEdits: {},
        };

        this.saveUser = (userId: number) => {
            var userEdits = this.state.userEdits;

            for (var user = 0; user < this.state.users.length; user++) {
                if (this.state.users[user]!["user_id"] === userId) {
                    if (userEdits[userId] === undefined) {
                        userEdits[userId] = this.state.users[user]!;
                    } else {
                        delete userEdits[userId];
                    }
                }
            }

            this.setState({
                userEdits: userEdits,
            });
        };

        this.sendUsers = () => {
            var users: any = [];

            Object.keys(this.state.userEdits).map((userId) => {
                users = [...users, Number(userId)];
                return userId;
            });

            var navbar = this.props.navbar;

            var confirmCreateResource = navbar.confirmCreateResource;

            var state = navbar.state;

            var team = state.team;

            var url = `/user?team_id=${team["team_id"]}&user_ids=${users}`;
            
            let promise;

            if (this.props.addTeamAction === "Add") {
                promise = genericResourcePOST(url, this, users);
            } else {
                promise = genericResourcePUT(url, this, users);
            }

            promise.then(result => {
                if (result !== undefined && result.errorMessage === null) {
                    confirmCreateResource("TeamMembers");
                }
            });
        };
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var team = state.team;

        var courseID = state.chosenCourse.course_id;

        genericResourceGET(
          `/user?course_id=${courseID}&team_id=${team["team_id"]}` + (this.props.addTeamAction === "Add" ? "" : `&assign=${true}`),
          "users", this,
      );
    }

    render() {
        
        const columns: GridColDef[] = [
            {
                field: "first_name",
                headerName: "First Name",
                width: 300,
            },
            {
                field: "last_name",
                headerName: "Last Name",
                width: 300,
            },
            {
              field: "team_name",
              headerName: "Current Team",
              width: 300,
              renderCell: (params) => (
                <>{params.value ? params.value : "No team assigned"}</>
              )
            },
            {
                field: "email",
                headerName: "Email",
                width: 300,
            },
            {
                field: "user_id",
                headerName: this.props.addTeamAction,
                width: 130,
                sortable: false,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                    const userId = params.value;
                    return (
                        <Checkbox
                            checked={this.state.userEdits[userId] !== undefined}
                            onChange={() => {
                                this.saveUser(userId);
                            }}
                            sx={{ color: "black" }}
                        />
                    );
                },
            },
        ];

        return (
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    <Typography
                        sx={{ fontWeight: "700" }}
                        variant="h5"
                        aria-label={this.props.addTeamAction + "TeamMembersTitle"}
                    >
                        {this.props.addTeamAction} Members {this.props.addTeamAction === "Add" ? "to" : "from"} Team {this.props.navbar.state.team.team_name}
                    </Typography>

                    <Button
                        id="saveTeam"
                        className="mt-3 mb-3"

                        style={{
                            backgroundColor: "#2E8BEF",
                            color: "white",
                        }}

                        onClick={() => {
                            this.sendUsers();
                        }}

                        aria-label="adminEditTeamMembersSaveTeamButton"
                    >
                        Save Team
                    </Button>
                </div>

                <CustomDataTable
                    data={this.state.users ? this.state.users : []}
                    columns={columns}
                    getRowId={(row) => row.user_id}
                    height="500px"
                />
            </div>
        );
    }
}

export default AdminEditTeamMembers;
