class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editUser: false,
            changed: false,
            content: {}
        }
    }
    componentDidUpdate() {
        if(this.state.changed == true) {
            const { user_id } = this.props.user;
            console.log(this.state.content);
            fetch(`http://127.0.0.1:5000/api/user/${user_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json" 
                },
                // body: JSON.stringify(this.state.content)
                body: JSON.stringify({
                    "first_name": this.state.content["first_name"],
                    "last_name": this.state.content["last_name"],
                    "email": this.state.content["email"],
                    "role": this.state.content["role"],
                    "institution": this.state.content["institution"],
                    "consent": this.state.content["consent"]
                })
            })
            .then(res => res.json())
            .then(
                (result) => {
                    window.location.href="http://127.0.0.1:5000/admin/user";
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )
            this.setState({ changed: false});
        }
    }
    render() {
        const { user_id, first_name, last_name, email, role, institution, consent } = this.props.user;
        const toggleValues = async () => {
            if(this.state.editUser==true) {
                var changed = false;
                var newFirstName = document.getElementById("firstNameInput").value;
                if(newFirstName == "") {
                    newFirstName = first_name;
                } else {
                    changed = true;
                }
                var newLastName = document.getElementById("lastNameInput").value;
                if(newLastName == "") {
                    newLastName = last_name;
                } else {
                    changed = true;
                }
                var newEmail = document.getElementById("emailInput").value;
                if(newEmail == "") {
                    newEmail = email;
                } else {
                    changed = true;
                }
                var newRole = document.getElementById("roleInput").value;
                if(newRole == "") {
                    newRole = role;
                } else {
                    changed = true;
                }
                var newInstitution = document.getElementById("institutionInput").value;
                if(newInstitution == "") {
                    newInstitution = institution;
                } else {
                    changed = true;
                }
                var newConsent = document.getElementById("consentInput").value;
                if(newConsent == "") {
                    newConsent = consent;
                } else {
                    changed = true;
                }
                if(changed==true) {
                    await this.setState({
                        content: {
                            "first_name": newFirstName,
                            "last_name": newLastName,
                            "email": newEmail,
                            "role": newRole,
                            "institution": newInstitution,
                            "consent": newConsent
                        }
                    });
                    this.setState({changed: true});
                }
                // Saved Edited User
                await this.setState({editUser: false});
            } else {
                // Edit User
                await this.setState({editUser: true});
            }
        }
        const deleteUser = () => {
            fetch(
                `http://127.0.0.1:5000/api/user/${user_id}`,
                {
                    method: "DELETE",
                })
                .then(res => res.json())
                .then(
                    (result) => {
                        window.location.href="http://127.0.0.1:5000/admin/user";
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )
        } 
    return(
            <div className="card p-2 m-4">
                <div className="row d-flex flex-row">
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 id="user_id" className="m-1 fs-6" style={{"width": "5rem"}}>{ user_id }</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        {(this.state.editUser==true) ?
                            <input id="firstNameInput" style={{"width": "5rem"}} placeholder={ first_name } name="first_name" type="text"/>
                        : 
                            <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ first_name }</h2>
                        }
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        {(this.state.editUser==true) ?
                            <input id="lastNameInput" style={{"width": "5rem"}} placeholder={ last_name } name="last_name" type="text"/>
                        :
                            <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ last_name }</h2>
                        }
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        {(this.state.editUser==true) ?
                            <input id="emailInput" style={{"width": "5rem"}} placeholder={ email } name="email" type="email"/>
                        :
                            <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ email }</h2>
                        }
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        {(this.state.editUser==true) ?
                            <input id="roleInput" style={{"width": "5rem"}} placeholder={ role } name="role" type="text"/>
                        :
                            <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ role }</h2>
                        }
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        {(this.state.editUser==true) ?
                            <input id="institutionInput" style={{"width": "5rem"}} placeholder={ institution } name="institution" type="text"/>
                        :
                            <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ institution }</h2>
                        }
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        {(this.state.editUser==true) ?
                            <input id="consentInput" style={{"width": "5rem"}} placeholder={ ((consent=="on") && "Approved") || ((consent=="off" && "Not Approved")) } name="consent" type="text"/>
                        :
                            <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{((consent=="on") && "Approved") || ((consent=="off" && "Not Approved"))}</h2>
                        }
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <button id="editButton" onClick={() => {toggleValues()}} className="m-1 btn btn-dark">
                            {(this.state.editUser==false) && "Edit"}
                            {(this.state.editUser==true) && "Save"}
                        </button>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <button id="deleteButton" onClick={() => {deleteUser()}} className="m-1 btn btn-dark">Delete</button>
                    </div>
                </div>
            </div>
        )
    }
}

class Users extends React.Component {
    render() {
        const users = this.props.users[0];
        // users.sort(function(a, b){return a.user_id-b.user_id});
        const orderByRow = (column) => {
            // const cars = [
            //     {type:"Volvo", year: 2016},
            //     {type:"Saab", year: 2001},
            //     {type:"BMW", year: 2010},
            // ];
            // alert(cars);
            // const elements = [1, 5, 6, 10];
            // alert(elements.sort(function (a, b){return a-b}));
            // alert(`Sorting by ${column}!!!`);
        }
        return(
            <React.Fragment>
                <div className="card p-2 m-4">
                    <div className="row d-flex flex-row">
                        {/* Display First and Last Name as one, not seperate! */}
                        <div className="col d-flex justify-content-center align-items-center">
                            <h2 onClick={()=> {orderByRow("user_id")}} className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>User Id</h2>
                        </div>
                        <div className="col d-flex justify-content-center align-items-center">
                            <h2 onClick={()=> {orderByRow("first_name")}} className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>First Name</h2>
                        </div>
                        <div className="col d-flex justify-content-center align-items-center">
                            <h2 onClick={()=> {orderByRow("last_name")}} className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>Last Name</h2>
                        </div>
                        <div className="col d-flex justify-content-center align-items-center">
                            <h2 onClick={()=> {orderByRow("email")}} className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>Email</h2>
                        </div>
                        <div className="col d-flex justify-content-center align-items-center">
                            <h2 onClick={()=> {orderByRow("role")}} className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>Role</h2>
                        </div>
                        <div className="col d-flex justify-content-center align-items-center">
                            <h2 onClick={()=> {orderByRow("institution")}} className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>Institution</h2>
                        </div>
                        <div className="col d-flex justify-content-center align-items-center">
                            <h2 onClick={()=> {orderByRow("consent")}} className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>Consent</h2>
                        </div>
                        <div className="col d-flex justify-content-center align-items-center">
                            <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}></h2>
                        </div>
                        <div className="col d-flex justify-content-center align-items-center">
                            <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}></h2>
                        </div>
                    </div>
                </div>
                {users.map((user, index) => {
                    return (<User user={user} key={index}/>)
                })}
                <div>
                    <a href="http://127.0.0.1:5000/admin/add_user" className="btn btn-dark">Add User</a>
                </div>
            </React.Fragment>
        )
    }
}

class JSON extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            // errorUSERS: null,
            // errorCOURSES: null,
            isLoaded: false,
            // isLoadedUSERS: false,
            // isLoadedCOURES: false,
            JSON: [],
            // USERS: [],
            // COURES: []
        }
    }
    componentDidMount() {
        fetch("http://127.0.0.1:5000/api/user")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    JSON: result['content']
                    // isLoadedUSERS: true,
                    // USERS: result['content']
                })
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                    // isLoadedUSERS: true,
                    // errorUSERS: error
                })
            }
        )
        // fetch("http://127.0.0.1:5000/api/course")
        // .then( res => res.json())
        // .then(
        //     (result) => {
        //         this.setState({
        //             isLoadedCOURES: true,
        //             COURES: result['content']
        //         })
        //     },
        //     (error) => {
        //         this.setState({
        //             isLoadedCOURES: true,
        //             errorCOURSES: error
        //         })
        //     }
        // )
    }
    render() {
        // const { errorUSERS, errorCOURSES, isLoadedUSERS, isLoadedCOURES, USERS, COURSES } = this.state;
        // if(errorUSERS) {
        const { error, isLoaded, JSON } = this.state;
        if(error) {
            return(
                <React.Fragment>
                    {/* <h1>Fetchirg users resulted in an error: { errorUSERS.message }</h1> */}
                    <h1>Fetchirg users resulted in an error: { error.message }</h1>
                </React.Fragment>
            )
        // } else if (!isLoadedUSERS) {
        } else if (!isLoaded) {
            return(
                <React.Fragment>
                    <h1>Loading...</h1>
                </React.Fragment>
            )
        } else {
            return(
                <React.Fragment>
                    <h1>Users</h1>
                    {/* <Users users={USERS["users"]}/> */}
                    <Users users={JSON["users"]}/>
                </React.Fragment>
            )
        }
        // if(errorCOURSES) {
        //     return(
        //         <React.Fragment>
        //             <h1>Fetching courses resulted in an error: { errorCOURSES.message }</h1>
        //         </React.Fragment>
        //     )
        // } else if (!isLoadedUSERS) {
        //     return(
        //         <React.Fragment>
        //             <h1>Loading...</h1>
        //         </React.Fragment>
        //     )
        // } else {
        //     return(
        //         <React.Fragment>
        //             <h1>Users</h1>
        //             <Users users={USERS["users"]}/>
        //         </React.Fragment>
        //     )
        // }
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<JSON/>)