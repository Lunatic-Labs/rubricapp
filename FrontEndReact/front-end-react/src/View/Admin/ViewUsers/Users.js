import React, { Component } from 'react';
import User from './User';
import 'bootstrap/dist/css/bootstrap.css';

class Users extends Component {
  render() {
    const user = this.props.users[0];
    const users = [];
    for(var u = 0; u < user.length; u++) {
        users.push(<User user={user[u]} key={u}/>);
    }
    return(
        <React.Fragment>
            <div className="card p-2 m-4">
                <div className="row d-flex flex-row">
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>User Id</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>First Name</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>Last Name</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>Email</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>Role</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>LMS_ID</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>Consent</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>Owner_ID</h2>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>      </h2>
                    </div>
                    {/* Commented out because Delete button is not supported right now and thus does not need the column in the header row!!! */}
                    {/* <div className="col d-flex justify-content-center align-items-center">
                        <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}>      </h2>
                    </div> */}
                </div>
            </div>
            { users }
            <div className='d-flex'>
                <a href="http://127.0.0.1:3000/admin/add_user" className="btn btn-dark">Add User</a>
            </div>
        </React.Fragment>
    )
  }
}

export default Users;