class Signup extends React.Component {
    render() {
        return(
            <React.Fragment>
            <div className="container" style={{"maxWidth":"20rem"}}>
                    <div className="row mt-5 mb-5">
                        <h1 className="text-center">ELIPSS SkillBuilder</h1>
                    </div>
                    <div className="row mb-3">
                        <h2>Please Sign Up:</h2>
                        <a href="/login">Already have an account? Log in. </a>
                    </div>
                    <div className="row">
                         <form method="POST" action="/signup">
                            <div className="form-outline mb-4">
                                <label id="emailLabel">Email</label>
                                <input type="email" id="email" name="newEmail" className="form-control form-control-lg" required/>
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label">Password</label>
                                <input type="password" id="password" name="newPassword" className="form-control form-control-lg" minlength="8" required/>
                                <small id="emailHelp" className="form-text text-muted">Password size between 8-80.</small>
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label"> Check Password</label>
                                <input type="password" id="checkpassword" name="checkPassword" className="form-control form-control-lg" minlength="8" required/>
                                <small id="emailHelp" className="form-text text-muted">Write password again</small>
                            </div>
                            <div className="d-flex mb-4">
                                <button type="submit" className="btn btn-primary btn-block btn-lg mt-3 text-white">Create Account</button>
                            </div>
                        </form>
                    </div>
            </div>
            </React.Fragment>
        )
    }
}
const root = ReactDOM.createRoot(
    document.getElementById("root")
);
root.render(<Signup/>);