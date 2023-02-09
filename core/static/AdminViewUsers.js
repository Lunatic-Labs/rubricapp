class User extends React.Component {
    render() {
        const user = this.props.user;
        const deleteUser = () => {
            console.log("Deleting User!");
            fetch("http://127.0.0.1:5000/api/user", method="DELETE")
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
        return(
            <div className="card p-2 m-4">
                <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                    <h2 className="m-1 fs-6" style={{"width": "20rem"}}>User ID: { user["user_id"] }</h2>
                </div>
                <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                    <h2 className="m-1 fs-6" style={{"width": "20rem"}}>First Name: { user["first_name"] }</h2>
                </div>
                <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                    <h2 className="m-1 fs-6" style={{"width": "20rem"}}>Last Name: { user["last_name"] }</h2>
                </div>
                <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                    <h2 className="m-1 fs-6" style={{"width": "20rem"}}>Email: { user["email"] }</h2>
                </div>
                <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                    <h2 className="m-1 fs-6" style={{"width": "20rem"}}>Role: { user["role"] }</h2>
                </div>
                <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                    <h2 className="m-1 fs-6" style={{"width": "20rem"}}>Institution: { user["institution"] }</h2>
                </div>
                <div className="col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                    <h2 className="m-1 fs-6" style={{"width": "20rem"}}>Consent: { user["consent"] }</h2>
                </div>
                <div>
                    <button type="Submit" className="m-1 btn btn-dark">Edit</button>
                </div>
                <form method="DELETE" action="api/user">
                    <input type="hidden" value={user['user_id']} />
                    <button type="Submit" className="m-1 btn btn-dark">Delete</button>
                </form>
            </div>
        )
    }
}

class Users extends React.Component {
    render() {
        const users = this.props.users[0];
        var usersList = [];
        for(var i = 0; i < users.length; i++) {
            usersList.push(
                <User user={users[i]} key={i}/>
            )
        }
        return(
            <React.Fragment>
                { usersList }
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