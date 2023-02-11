class User extends React.Component {
    render() {
        const { user_id, first_name, last_name, email, role, institution, consent } = this.props.user;
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
                        <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ first_name }</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ last_name }</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ email }</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ role }</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ institution }</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{((consent=="on") && "Approved") || ((consent=="off" && "Not Approved"))}</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <button id="editButton" className="m-1 btn btn-dark">Edit</button>
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
            isLoaded: false,
            JSON: []
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
                })
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                })
            }
        )
    }
    render() {
        const { error, isLoaded, JSON } = this.state;
        if(error) {
            return(
                <React.Fragment>
                    <h1>Fetching users resulted in an error: { error.message }</h1>
                </React.Fragment>
            )
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
                    <Users users={JSON["users"]}/>
                </React.Fragment>
            )
        }
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<JSON/>)
// class AdminViewUsers extends React.Compenent {
//     constructor(props) {
//         super(props)
//     }
//     render() {
//         return (
//             <React.Fragment>
//                 <h1>Admin view all users!!!</h1>
//             </React.Fragment>
//         )
//     }
// }

// const root = ReactDOM.createRoot(document.getElementById("root"))
// root.render(<AdminViewUsers />)