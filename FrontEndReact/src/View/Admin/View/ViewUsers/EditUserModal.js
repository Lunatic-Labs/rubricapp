import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Component } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

class EditUserModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            user: null,
            isLoaded: false,
            errorMessage: null,
            error: null
        }
        this.toggleOpen = () => {
            this.setState({open: this.state.open===true ? false: true});
        };
    }
    render() {
        const saveUser = (id, users) => {
            var user;
            var changed = false;
            for(var i = 0; i < users.length; i++) {
                if(users[i]["user_id"]===id) {
                    user = users[i];
                }
            }
            var firstName = document.getElementById("firstNameInput");
            if(firstName.value) {
                firstName = firstName.value;
                changed = true;
            } else {
                firstName = user["first_name"];
            }
            var lastName = document.getElementById("lastNameInput");
            if(lastName.value) {
                lastName = lastName.value;
                changed = true;
            } else {
                lastName = user["last_name"];
            }
            var email = document.getElementById("emailInput");
            if(email.value) {
                email = email.value;
                changed = true;
            } else {
                email = user["email"];
            }
            var role = document.getElementById("roleInput");
            if(role.value) {
                role = role.value;
                changed = true;
            } else {
                role = user["role_id"];
            }
            var lmsID = document.getElementById("lmsIDInput");
            if(lmsID.value) {
                lmsID = lmsID.value;
                changed = true;
            } else {
                lmsID = user["lms_id"];
            }
            var consent = document.getElementById("consentInput");
            if(consent.value) {
                consent = consent.value==="Approved" ? true: false;
                changed = true;
            } else {
                consent = user["consent"];
            }
            var ownerID = document.getElementById("ownerIDInput");
            if(ownerID.value) {
                ownerID = ownerID.value;
                changed = true;
            } else {
                ownerID = user["owner_id"];
            }
            var updatedUser = {
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "role_id": role,
                "lms_id": lmsID,
                "consent": consent,
                "owner_id": ownerID
            }
            console.log(updatedUser);
            if(changed) {
                fetch(`http://127.0.0.1:5000/api/user/${id}`, {
                    method: "PUT",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json" 
                    },
                    body: JSON.stringify(updatedUser)
                })
                .then(res => res.json())
                .then(
                    (result) => {
                        if(result["success"]) {
                            window.location.href = "http://127.0.0.1:3000/";
                        } else {
                            console.log(result["message"]);
                        }
                    },
                    (error) => {
                        console.log(error);
                    }
                )
            }
        }
        var user_id = this.props.user_id;
        var users = this.props.users[0];
        return(
            <div>
                <Button onClick={() => this.toggleOpen()} varient="contained">Edit</Button>
                <Modal open={this.state.open} onClose={() => {this.toggleOpen()}}>
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h4" component="h2" style={{margin: ".25rem"}}> Edit User</Typography>
                        <TextField id="firstNameInput" name="first_name" label="First Name" defaultValue="" style={{margin: ".25rem"}}/>
                        <TextField id="lastNameInput" name="last_name" label="Last Name" defaultValue="" style={{margin: ".25rem"}}/>
                        <TextField id="emailInput" name="email" label="Email" defaultValue="" placeholder="" style={{margin: ".25rem"}}/>
                        <TextField id="roleInput" name="role" label="Role" defaultValue="" style={{margin: ".25rem"}}/>
                        <TextField id="lmsIDInput" name="lms_id" label="LMS ID" defaultValue="" style={{margin: ".25rem"}}/>
                        <TextField id="consentInput" name="consent" label="Consent" defaultValue="" style={{margin: ".25rem"}}/>
                        <TextField id="ownerIDInput" name="owner_id" label="Owner ID" defaultValue="" style={{margin: ".25rem"}}/>
                        <Button style={{backgroundColor: "#2E8BEF", color:"white",margin: "0.5rem", float:"right"}} onClick={() => {saveUser(user_id, users); this.toggleOpen()}}>Save User</Button>
                    </Box>
                </Modal>
            </div>
        )
    }
}

export default EditUserModal;