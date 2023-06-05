import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './addStyles.css';

class EditConsent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            validMessage: ""
        }
    }
    componentDidMount() {
        if(this.props.user_consent!==null) {
            document.getElementById("consent").checked = this.props.user_consent["consent"];
        }
        document.getElementById("editConsent").addEventListener("click", () => {
            var new_user_consent = this.props.user_consent;
            new_user_consent["consent"] = document.getElementById("consent").checked;
            fetch(
                (
                    `http://127.0.0.1:5000/api/user/${this.props.user_consent["user_id"]}`
                ),
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(new_user_consent)
                }
            )
            .then(res => res.json())
            .then((result) => {
                if(result["success"] === false) {
                    this.setState({
                        errorMessage: result["message"]
                    })
            }},
            (error) => {
                this.setState({
                    error: error
                })
            })
            setTimeout(() => {
                if(document.getElementsByClassName("text-danger")[0]!==undefined) {
                    setTimeout(() => {
                        this.setState({error: null, errorMessage: null, validMessage: ""});
                    }, 1000);
                }
            }, 1000);
        });
    }
    render() {
        const { error , errorMessage, validMessage } = this.state;
        return (
            <React.Fragment>
                { error &&
                    <React.Fragment>
                        <h1 className="text-danger text-center p-3">Creating a new users resulted in an error: { error.message }</h1>
                    </React.Fragment>
                }
                { errorMessage &&
                    <React.Fragment>
                        <h1 className="text-danger text-center p-3">Creating a new users resulted in an error: { errorMessage }</h1>
                    </React.Fragment>
                }
                { validMessage!=="" &&
                    <React.Fragment>
                        <h1 className="text-danger text-center p-3">{ validMessage }</h1>
                    </React.Fragment>
                }
                <div id="outside">
                    <h1 id="editConsentTitle" className="d-flex justify-content-around" style={{margin:".5em auto auto auto"}}>Edit Consent</h1>
                    <div id="editConsentDescription" className="d-flex justify-content-around">Please edit the user's consent</div>
                    <form>
                        {/* <div className="d-flex flex-column">
                            <div className="d-flex flex-row justify-content-between">
                                <div className="w-25 p-2 justify-content-between" style={{}}><label id="firstNameLabel">First Name</label></div>
                                <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}><input type="text" id="firstName" name="newFirstName" className="m-1 fs-6" style={{maxWidth:"100%"}} placeholder="First Name" required/></div>
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row justify-content-between">
                                <div className="w-25 p-2 justify-content-between"><label id="lastNameLabel">Last Name</label></div>
                                <div className="w-75 p-2 justify-content-around "><input type="text" id="lastName" name="newLastName" className="m-1 fs-6" style={{}} placeholder="Last Name" required/></div>
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row justify-content-between">
                                <div className="w-25 p-2 justify-content-between"><label id="emailLabel">Email</label></div>
                                <div className="w-75 p-2 justify-content-around"><input type="email" id="email" name="newEmail" className="m-1 fs-6" style={{}} placeholder="example@email.com" autoComplete='username' required/></div>
                            </div>
                        </div> */}
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row justify-content-between">
                                <div className="w-25 p-2 justify-content-between"><label id="consentLabel">Consent</label></div>
                                <div className="w-75 p-2 justify-content-around"><input type="checkbox" id="consent" name="newConsent" className="m-1 fs-6" style={{}}/></div>
                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default EditConsent;