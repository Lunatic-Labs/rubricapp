class User extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const name = this.props.name;
        return(
            <React.Fragment>
                <h1>Welcome {name}!</h1>
            </React.Fragment>
        )
    }
}

class Ta extends React.Component {
    render() {
        const username="exampleUsername";
        const password="examplepassword";
        const status = "addUser";
        return(
            <React.Fragment>
                <User name={"Karen"}/>
                <h1>Here is the Template</h1>
                {
                    username=="exampleUsername" &&
                    <h1>Welcome user!</h1>
                }

                {
                    password=="examplepassword" &&
                    <h1>Correct Password!</h1>
                }

                {
                    status == "addUser" &&
                    <form>
                        <input placeholder={username}/>
                        <input placeholder={password}/>
                    </form>
                }

            </React.Fragment>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Template/>);
