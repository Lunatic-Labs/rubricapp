class Usere extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const name = this.props.name;
        return(
            <React.Fragement>
                <h2>Welcome{name}!</h2>
            </React.Fragement>
        )
    }
}

class Ta extends React.Component{
    render(){
        const username ="exampleUsername";
        const password ="examplePassword";
        const status = "addUser";
        return(
            <React.Fragment>
                <h1> Here is my Ta Template!</h1>
                {    username== "exampleUsername" &&
                    <h1>Welcome User!</h1>
}
                {password == "examplePassword" &&
                    <h1>Correct Password</h1>
                }
                {
                    status == "addUser" && 
                    <form>
                        <input palceholder={username}/>
                        <input placeholder={password}/>
                        
                    </form>
                }
            </React.Fragment>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Template/>);