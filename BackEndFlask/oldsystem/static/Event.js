class Event extends React.Component {
    render() {
        return(
            <React.Fragment>
                <h1>Event Page!!!</h1>
            </React.Fragment>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Event/>);