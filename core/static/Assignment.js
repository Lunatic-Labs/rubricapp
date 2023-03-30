class Assignment_id extends React.Component {
    render() {
        const a_id = this.props.a_id;
        return(
            <React.Fragment>
                <h1> The Assignment id is { a_id }.</h1>
            </React.Fragment>
        )
    }
}
class Assignment_name extends React.Component {
    render() {
        const a_name = this.props.a_name;
        return(
            <React.Fragment>
                <h1> The Assignment name is { a_name }.</h1>
            </React.Fragment>
        )
    }
}

class Assignment extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <React.Fragment>
                <Assignment_id a_id={"1.1"}/>
                <Assignment_id a_id={"1.2"}/>
                <Assignment_id a_id={"1.3"}/>
                <Assignment_name a_name={"Assignment 1"}/>
                <Assignment_name a_name={"Assignment 2"}/>
                <Assignment_name a_name={"Assignment 3"}/>
            </React.Fragment>
        )
    }
}

const root = ReactDOM.createRoot( document.getElementById("root") );
root.render(<Assignment />);