import React, { Component } from 'react';
import User from './User';
import 'bootstrap/dist/css/bootstrap.css';

class Users extends Component {
  render() {
      const users = this.props.users[0];
      return(
          <React.Fragment>
              <div className="card p-2 m-4">
                  <div className="row d-flex flex-row">
                      <div className="col d-flex justify-content-center align-items-center">
                          <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "6rem"}}>User Id</h2>
                      </div>
                      <div className="col d-flex justify-content-center align-items-center">
                          <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "6rem"}}>First Name</h2>
                      </div>
                      <div className="col d-flex justify-content-center align-items-center">
                          <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "6rem"}}>Last Name</h2>
                      </div>
                      <div className="col d-flex justify-content-center align-items-center">
                          <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "6rem"}}>Email</h2>
                      </div>
                      <div className="col d-flex justify-content-center align-items-center">
                          <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "6rem"}}>Role</h2>
                      </div>
                      <div className="col d-flex justify-content-center align-items-center">
                          <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "6rem"}}>Institution</h2>
                      </div>
                      <div className="col d-flex justify-content-center align-items-center">
                          <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "6rem"}}>Consent</h2>
                      </div>
                      {/* <div className="col d-flex justify-content-center align-items-center">
                          <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}></h2>
                      </div> */}
                      {/* <div className="col d-flex justify-content-center align-items-center">
                          <h2 className="m-1 fs-6" style={{"cursor": "pointer", "width": "5rem"}}></h2>
                      </div> */}
                  </div>
              </div>
              {users.map((user, index) => {
                  return (<User user={user} key={index}/>)
              })}
              <div className='d-flex'>
                  {/* <a href="http://127.0.0.1:5000/admin/add_user" className="btn btn-dark">Add User</a> */}
                  <a href="http://127.0.0.1:3000/admin/add_user" className="btn btn-dark">Add User</a>
              </div>
          </React.Fragment>
      )
  }
}

export default Users;