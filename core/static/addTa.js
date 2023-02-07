class addTa extends React.Component {
    render() {
        return(
            <React.Fragment>
                <div className="container" style={{"maxWidth":"20rem"}}>
                    <div className="row mt-5 mb-5">
                        <h1 className="text-center">ELIPSS SkillBuilder</h1>
                    </div>
                    <div className="row mb-3">
                        <h2>Please Add a TA:</h2>
                    
                    </div>
                    <div className="row">
                        <form className="card d-flex" method="POST" action="/addTa">
                            /**what should the action be for this*/
                            <div className="card-body row">
                                <div className="column d-flex gap-2 mt-1 mb-3">
                                    <label id="emailLabel">Email</label>
                                    <input id="email" type="email" name="email" placeholder="" required/>
                                </div>
                
                                <div class="dropdown">
                                <button onclick="myFunction()" class="dropbtn">Dropdown</button>
                                <div id="myDropdown" class="dropdown-content">
                                    <a href="#">Class 1</a>
                                    <a href="#">Class 2</a>
                                    <a href="#">Class 3</a>
                                </div>
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