import React, { Component } from "react";
import Button from "@mui/material/Button";
import "bootstrap/dist/css/bootstrap.css";
import CustomDataTable from "../../../Components/CustomDataTable";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { genericResourceGET, genericResourcePOST, genericResourcePUT } from "../../../../utility.js";
import { IconButton, Typography } from "@mui/material";

// TODO: Find out why when I select some of the team members to place 
// into a team it only saves some of the members or doesn't save any

class AdminEditTeam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            users: [],
            userEdits: {},
        };

        // NOTE: Checked to ensure that all the users that are selected to be in the team are saved in the userEdits state
        // Worked on the functionality of saving the users in the team
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
            var state = navbar.state;
            var team = state.team;
            var url = `/user?team_id=${team["team_id"]}&user_ids=${users}`;

            if (this.props.addTeamAction === "Add") {
                genericResourcePOST(url, this, users);
            } else {
                genericResourcePUT(url, this, users);
            }

            setTimeout(() => {
                navbar.setNewTab("TeamMembers");
            }, 1000);
        };
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var team = state.team;

        genericResourceGET(
            `/user?team_id=${team["team_id"]}` +
            (this.props.addTeamAction === "Add" ? "" : `&assign=${true}`),
            "users",
            this,
        );
    }

    render() {
        var editTrue =
            this.props.addTeamAction === "Add" ? (
                <AddCircleOutlineIcon sx={{ color: "black" }} />
            ) : (
                <RemoveCircleOutlineIcon sx={{ color: "black" }} />
            );
        var editFalse =
            this.props.addTeamAction !== "Add" ? (
                <AddCircleOutlineIcon sx={{ color: "black" }} />
            ) : (
                <RemoveCircleOutlineIcon sx={{ color: "black" }} />
            );

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
                label: "Add/Remove",
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
                                {this.state.userEdits[userId] === undefined
                                    ? editTrue
                                    : editFalse}
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
                    <Typography sx={{ fontWeight: "700" }} variant="h5">
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

export default AdminEditTeam;
