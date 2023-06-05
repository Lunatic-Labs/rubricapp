import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewConsent from './ViewConsent';
// import AdminAddUser from '../../Add/AddUsers/AdminAddUser';

class AdminViewConsent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            users: []
        }
    }
    componentDidMount() {
        fetch(`http://127.0.0.1:5000/api/user?course_id=${this.props.chosenCourse["course_id"]}`)
        .then(res => res.json())
        .then((result) => {
            if(result["success"]===false) {
                this.setState({
                    isLoaded: true,
                    errorMessage: result["message"]
                })
            } else {
                this.setState({
                    isLoaded: true,
                    users: result['content']['users'][0]
                })
        }},
        (error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        })
    }
    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            users
        } = this.state;
        // var user = this.props.user;
        if(error) {
            return(
                <div className='container'>
                    <h1 className="text-danger">Fetching users resulted in an error: { error.message }</h1>
                </div>
            )
        } else if(errorMessage) {
            return(
                <div className='container'>
                    <h1 className="text-danger">Fetching users resulted in an error: { errorMessage }</h1>
                </div>
            )
        } else if (!isLoaded) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        // } else if (user) {
        //     return(
        //         <div className="container">
        //             <AdminAddUser
        //                 user={user}
        //                 chosenCourse={this.props.chosenCourse}
        //             />
        //         </div>
        //     )
        } else {
            return(
                <div className='container'>
                    <h1
                        className='mt-5'
                    >
                        View Consent
                    </h1>
                    <ViewConsent
                        setEditConsentWithUser={this.props.setEditConsentWithUser}
                        users={users}
                        chosenCourse={this.props.chosenCourse}
                    />
                </div>
            )
        }
    }
}

export default AdminViewConsent;