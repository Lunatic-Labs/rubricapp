class User extends React.Component {
    render() {
        const user = this.props.user;
        return(
            <div className="card p-2 m-4">
                <div className="row d-flex justify-content-around">
                    <div className="card col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <h2 className="fs-6" style={{"maxWidth": "fit-content"}}>{ user["username"] }</h2>
                    </div>
                    <div className=" card col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <h2 className="fs-6" style={{"maxWidth": "fit-content"}}>{ user["email"] }</h2>
                    </div>
                </div>
                <div className="row d-flex justify-content-around">
                    <div className="card col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <h2 className="fs-6" style={{"maxWidth": "fit-content"}}>{ user["password"] }</h2>
                    </div>
                    <div className="card col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <h2 className="fs-6" style={{"maxWidth": "fit-content"}}>{ user["firstName"] }</h2>
                    </div>
                    <div className="card col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <h2 className="fs-6" style={{"maxWidth": "fit-content"}}>{ user["lastName"] }</h2>
                    </div>
                    <div className="card col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <h2 className="fs-6" style={{"maxWidth": "fit-content"}}>{ user["role"] }</h2>
                    </div>
                </div>
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="card col d-flex justify-content-center m-1" style={{"maxWidth":"fit-content", "height":"3rem"}}>
                        <h2 className="fs-6 text-center" style={{"maxWidth": "fit-content"}}>{ user["bio"] }</h2>
                    </div>
                </div>
            </div>
        )
    }
}

class Users extends React.Component {
    render() {
        const users = this.props.users;
        var usersList = [];
        for(var i = 0; i < users.length; i++) {
            usersList.push(
                <User user={users[i]} key={i}/>
            )
        }
        return(
            <React.Fragment>
                { usersList }
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
                    JSON: result["content"]
                })
                console.log(result["content"]);
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