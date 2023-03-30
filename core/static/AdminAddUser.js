class AdminAddUser extends React.Component {
    componentDidMount() {
        var createButton = document.getElementById("createButton");
        createButton.addEventListener("click", () => {
            var firstName = document.getElementById("firstName").value;
            var lastName = document.getElementById("lastName").value;
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
            var role = document.getElementById("role").value;
            var institution = document.getElementById("institution").value;
            var consent = document.getElementById("consent").value;
            fetch( "http://127.0.0.1:5000/api/user",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "first_name": firstName,
                        "last_name": lastName,
                        "email": email,
                        "password": password,
                        "role": role,
                        "institution": institution,
                        "consent": consent
                })
            })
            .then(res => res.json())
            .then(
                (result) => {
                    window.location.href="http://127.0.0.1:5000/admin/user";
                },
                (error) => {
                    alert("An error occured: ", error)
                }
            )
        });
    }
    render() {
        return (
            <React.Fragment>
                <h1 className="text-center mt-5">Add New User</h1>
                <div className="d-flex flex-column p-2 m-4"> 
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="firstNameLabel">First Name</label>
                        <input type="text" id="firstName" name="newFirstName" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="lastNameLabel">Last Name</label>
                        <input type="text" id="lastName" name="newLastName" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="emailLabel">Email</label>
                        <input type="email" id="email" name="newEmail" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="passwordLabel">Password</label>
                        <input type="password" id="password" name="newPassword" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    {/* Dropdown has options: Admin, Student, TA */}
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="roleLabel">Role</label>
                        <input type="text" id="role" name="newRole" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="institutionLabel">Institution</label>
                        <input type="text" id="institution" name="newInstitution" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    {/* Consent is a checkbox */}
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="consentLabel">Consent</label>
                        <input type="checkbox" id="consent" name="newConsent" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                        <button id="createButton" className="btn btn-dark">Create User</button>
                        <a href="http://127.0.0.1:5000/admin/user" className="btn btn-dark">Cancel</a>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<AdminAddUser/>)