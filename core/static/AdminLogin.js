class AdminLogin extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <h1 className="mt-5">Admin Login!!!</h1>
                    <form method="POST" action="/admin/" className="card d-flex gap-3 p-4" style={{"width":"20rem"}}>
                        <div className="d-flex justify-content-around">
                            <label>Username</label>
                            <input id="username" name="username" type="text" />
                        </div>
                        <div className="d-flex justify-content-around">
                            <label>Password</label>
                            <input id="password" name="password" type="password"/>
                        </div>
                        <button className="btn btn-dark">Login</button>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<AdminLogin/>)