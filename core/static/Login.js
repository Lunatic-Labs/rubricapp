class Login extends React.Component {
    render() {
        return(
            <React.Fragment>
                <div className="container" style={{"maxWidth":"20rem"}}>
                    <div className="row mt-5 mb-5">
                        <h1 className="text-center">ELIPSS SkillBuilder</h1>
                    </div>
                    <div className="row mb-3">
                        <h2>Please Login:</h2>
                        <a href="/signup">Don't yet have an account? Sign up.</a>
                    </div>
                    <div className="row">
                        <form className="card d-flex" method="POST" action="/login">
                            <div className="card-body row">
                                <div className="column d-flex gap-2 mt-1 mb-3">
                                    <label id="emailLabel">Email</label>
                                    <input id="email" type="email" name="email" placeholder="" required/>
                                </div>
                                <div className="column d-flex gap-2 mt-1 mb-3">
                                    <label id="passwordLabel">Password</label>
                                    <input id="password" type="password" name="password" placeholder="" minlength="8" required/>
                                </div>
                                <div className="column d-flex gap-2 mt-1 mb-3">
                                    <input id="rememberMeInput" type="checkbox" name="rememberMe"/>
                                    <label id="rememberMeLabel">Remember Me</label>
                                </div>
                                <div className="column">
                                    <button className="btn btn-dark" id="loginButton" type="submit">Login</button>
                                </div>
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
root.render(<Login/>);