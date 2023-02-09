class AdminAddUser extends React.Component {
    render() {
        return (
            <React.Fragment>
                <h1>Add New User</h1>
                <form className="card p-2 m-4" method="POST" action="/api/user">
                    <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <label id="firstNameLabel">First Name</label>
                        <input type="text" id="firstName" name="newFirstName" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <label id="lastNameLabel">Last Name</label>
                        <input type="text" id="lastName" name="newLastName" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <label id="emailLabel">Email</label>
                        <input type="email" id="email" name="newEmail" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <label id="passwordLabel">Password</label>
                        <input type="password" id="password" name="newPassword" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <label id="roleLabel">Role</label>
                        <input type="text" id="role" name="newRole" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <label id="institutionLabel">Institution</label>
                        <input type="text" id="institution" name="newInstitution" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <label id="consentLabel">Consent</label>
                        <input type="text" id="consent" name="newConsent" className="m-1 fs-6" style={{"width": "20rem"}} required/>
                    </div>
                    <div className="d-flex flex-row">
                        <button type="submit" className="btn btn-dark">Create User</button>
                        <a href="http://127.0.0.1:5000/admin/user" className="btn btn-dark">Cancel</a>
                    </div>
                </form>
            </React.Fragment>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<AdminAddUser/>)