class Signup extends React.Component {
    render() {
        return(
            <React.Fragment>
            <div className="container" style={{"max-width":"20rem"}}>
                    <div className="row mt-5 mb-5">
                        <h1 className="text-center">ELIPSS SkillBuilder</h1>
                    </div>
                    <div className="row mb-3">
                        <h2>Please Sign Up:</h2>
                        <a href="/login">Already have an account? Log in. </a>
                    </div>
                    <div className="row">
                        {% block content %}
                         <form method="POST" action="/signup">

                            <div class="form-outline mb-4">
                            <label id="emailLabel">Email</label>
                            <input type="email" id="email" class="form-control form-control-lg" />
                            </div>

                            <div class="form-outline mb-4">
                            <label class="form-label">Password</label>
                            <input type="password" id="password" class="form-control form-control-lg" />
                            <small id="emailHelp" class="form-text text-muted">Password size between 8-80.</small>
                            </div>

                            <div class="form-outline mb-4">
                            <label class="form-label"> Check Password</label>
                            <input type="passwordCheck" id="passwordCheck" class="form-control form-control-lg" />
                            <small id="emailHelp" class="form-text text-muted">Write password again</small>
                            </div>
                            <div class="d-flex mb-4">
                                <button type="button"
                                    class="btn btn-primary btn-block btn-lg mt-3 text-white">Create Account</button>
                            </div>

                        </form>
                    </div>
            </div>
            </React.Fragment>
        )
    }

}

ReactDOM.render(<Signup/>, document.getElementById('root'));