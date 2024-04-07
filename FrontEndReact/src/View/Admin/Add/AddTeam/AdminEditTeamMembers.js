import React, { Component } from "react";
import Button from "@mui/material/Button";
import "bootstrap/dist/css/bootstrap.css";
import CustomDataTable from "../../../Components/CustomDataTable";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { genericResourceGET, genericResourcePOST, genericResourcePUT } from "../../../../utility.js";
import { IconButton, Typography } from "@mui/material";



class AdminEditTeamMembers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            users: [],
            userEdits: {},
        };

        this.saveUser = (userId) => {
            var userEdits = this.state.userEdits;

            for (var user = 0; user < this.state.users.length; user++) {
                if (this.state.users[user]["user_id"] === userId) {
                    if (userEdits[userId] === undefined) {
                        userEdits[userId] = this.state.users[user];
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
            var users = [];

            Object.keys(this.state.userEdits).map((userId) => {
                users = [...users, userId - "0"];
                return userId;
            });

            var navbar = this.props.navbar;

            var confirmCreateResource = navbar.confirmCreateResource;

            var state = navbar.state;

            var team = state.team;

            var chosenCourse = state.chosenCourse.course_id;

            var url = `/user?team_id=${team["team_id"]}&user_ids=${users}`;

            if (this.props.addTeamAction === "Add") {
                genericResourcePOST(url, this, users);
            } else {
                genericResourcePUT(url, this, users);
            }

            setTimeout(() => {
                confirmCreateResource("TeamMembers");
            }, 1000);
        };
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var team = state.team;

        var chosenCourse = state.chosenCourse.course_id;
        
        genericResourceGET(
          `/user?course_id=${chosenCourse}&team_id=${team["team_id"]}` + (this.props.addTeamAction === "Add" ? "" : `&assign=${true}`),
          "users", this,
      );
    }

    render() {
        const columns = [
            {
                name: "first_name",
                label: "First Name",
                options: {
                    filter: true,
                    setCellHeaderProps: () => {
                        return { width: "300px" };
                    },
                    setCellProps: () => {
                        return { width: "300px" };
                    },
                },
            },
            {
                name: "last_name",
                label: "Last Name",
                options: {
                    filter: true,
                    setCellHeaderProps: () => {
                        return { width: "300px" };
                    },
                    setCellProps: () => {
                        return { width: "300px" };
                    },
                },
            },
            {
              name: "team_name",
              label: "Current Team",
              options: {
                  filter: true,
                  setCellHeaderProps: () => {
                      return { width: "300px" };
                  },
                  setCellProps: () => {
                      return { width: "300px" };
                  },
              },
          },
            {
                name: "email",
                label: "Email",
                options: {
                    filter: true,
                    setCellHeaderProps: () => {
                        return { width: "300px" };
                    },
                    setCellProps: () => {
                        return { width: "300px" };
                    },
                },
            },
            {
                name: "user_id",
                label: this.props.addTeamAction,
                options: {
                    filter: true,
                    sort: false,
                    setCellHeaderProps: () => {
                        return {
                            align: "center",
                            width: "130px",
                            className: "button-column-alignment",
                        };
                    },
                    setCellProps: () => {
                        return {
                            align: "center",
                            width: "130px",
                            className: "button-column-alignment",
                        };
                    },
                    customBodyRender: (userId) => {
                        return (
                            <IconButton
                                onClick={() => {
                                    this.saveUser(userId);
                                }}
                            >
                                {this.state.userEdits[userId] === undefined ?
                                    this.props.addTeamAction === "Add" ? (
                                        <AddCircleOutlineIcon sx={{ color: "black" }} />
                                    ) : (
                                        <RemoveCircleOutlineIcon sx={{ color: "black" }} />
                                    )

                                    :

                                    this.props.addTeamAction !== "Add" ? (
                                        <AddCircleOutlineIcon sx={{ color: "black" }} />
                                    ) : (
                                        <RemoveCircleOutlineIcon sx={{ color: "black" }} />
                                    )
                                }
                            </IconButton>
                        );
                    },
                },
            },
        ];

        const options = {
            onRowsDelete: false,
            download: false,
            print: false,
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "vertical",
            tableBodyMaxHeight: "500px",
        };

        return (
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    <Typography
                        sx={{ fontWeight: "700" }}
                        variant="h5"
                        aria-label={this.props.addTeamAction + "TeamMembersTitle"}
                    >
                        {this.props.addTeamAction} Members
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
                    options={options}
                />
            </div>
        );
    }
}

export default AdminEditTeamMembers;
