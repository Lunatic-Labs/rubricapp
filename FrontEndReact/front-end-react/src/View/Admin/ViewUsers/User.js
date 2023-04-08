import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class User extends Component {
//   constructor(props) {
//       super(props);
//       this.state = {
//           editUser: false,
//           changed: false,
//           content: {}
//       }
//   }
//   componentDidUpdate() {
//       if(this.state.changed === true) {
//           const { user_id } = this.props.user;
//           console.log(user_id);
//           // console.log(this.state.content);
//           // const data = JSON.stringify();
//           // console.log(data);
//           // console.log(JSON.stringify(this.state.content));
//           // fetch(`http://127.0.0.1:5000/api/user/${user_id}`, {
//           //     method: "PUT",
//           //     headers: {
//           //         "Accept": "application/json",
//           //         "Content-Type": "application/json" 
//           //     },
//           //     // body: JSON.stringify(this.state.content)
//           //     // body: JSON.stringify({
//           //     //     "first_name": this.state.content["first_name"],
//           //     //     "last_name": this.state.content["last_name"],
//           //     //     "email": this.state.content["email"],
//           //     //     "role": this.state.content["role"],
//           //     //     "institution": this.state.content["institution"],
//           //     //     "consent": this.state.content["consent"]
//           //     // })
//           // })
//           // .then(res => res.json())
//           // .then(
//           //     (result) => {
//           //         window.location.href="http://127.0.0.1:5000/admin/user";
//           //     },
//           //     (error) => {
//           //         this.setState({
//           //             isLoaded: true,
//           //             error
//           //         })
//           //     }
//           // )
//           this.setState({ changed: false});
//       }
//   }
  render() {
    //   const { user_id, first_name, last_name, email, role, institution, consent } = this.props.user;
    //   const toggleValues = async () => {
    //       if(this.state.editUser===true) {
    //           var changed = false;
    //           var newFirstName = document.getElementById("firstNameInput").value;
    //           if(newFirstName === "") {
    //               newFirstName = first_name;
    //           } else {
    //               changed = true;
    //           }
    //           var newLastName = document.getElementById("lastNameInput").value;
    //           if(newLastName === "") {
    //               newLastName = last_name;
    //           } else {
    //               changed = true;
    //           }
    //           var newEmail = document.getElementById("emailInput").value;
    //           if(newEmail == "") {
    //               newEmail = email;
    //           } else {
    //               changed = true;
    //           }
    //           var newRole = document.getElementById("roleInput").value;
    //           if(newRole == "") {
    //               newRole = role;
    //           } else {
    //               changed = true;
    //           }
    //           var newInstitution = document.getElementById("institutionInput").value;
    //           if(newInstitution == "") {
    //               newInstitution = institution;
    //           } else {
    //               changed = true;
    //           }
    //           var newConsent = document.getElementById("consentInput").value;
    //           if(newConsent == "") {
    //               newConsent = consent;
    //           } else {
    //               changed = true;
    //           }
    //           if(changed==true) {
    //               await this.setState({
    //                   content: {
    //                       "first_name": newFirstName,
    //                       "last_name": newLastName,
    //                       "email": newEmail,
    //                       "role": newRole,
    //                       "institution": newInstitution,
    //                       "consent": newConsent
    //                   }
    //               });
    //               this.setState({changed: true});
    //           }
    //           // Saved Edited User
    //           await this.setState({editUser: false});
    //       } else {
    //           // Edit User
    //           await this.setState({editUser: true});
    //       }
    //   }
    //   const deleteUser = () => {
    //       fetch(
    //           `http://127.0.0.1:5000/api/user/${user_id}`,
    //           {
    //               method: "DELETE",
    //           })
    //           .then(res => res.json())
    //           .then(
    //               (result) => {
    //                   window.location.href="http://127.0.0.1:5000/admin/user";
    //           },
    //           (error) => {
    //               this.setState({
    //                   isLoaded: true,
    //                   error
    //               })
    //           }
    //       )
    //   } 
  return(
        <div>User</div>
        //   <div className="card p-2 m-4">
        //       <div className="row d-flex flex-row">
        //           <div className="col d-flex justify-content-center align-items-center">
        //               <h2 id="user_id" className="m-1 fs-6" style={{"width": "5rem"}}>{ user_id }</h2>
        //           </div>
        //           <div className="col d-flex justify-content-center align-items-center">
        //               {(this.state.editUser==true) ?
        //                   <input id="firstNameInput" style={{"width": "5rem"}} placeholder={ first_name } name="first_name" type="text"/>
        //               : 
        //                   <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ first_name }</h2>
        //               }
        //           </div>
        //           <div className="col d-flex justify-content-center align-items-center">
        //               {(this.state.editUser==true) ?
        //                   <input id="lastNameInput" style={{"width": "5rem"}} placeholder={ last_name } name="last_name" type="text"/>
        //               :
        //                   <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ last_name }</h2>
        //               }
        //           </div>
        //           <div className="col d-flex justify-content-center align-items-center">
        //               {(this.state.editUser==true) ?
        //                   <input id="emailInput" style={{"width": "5rem"}} placeholder={ email } name="email" type="email"/>
        //               :
        //                   <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ email }</h2>
        //               }
        //           </div>
        //           <div className="col d-flex justify-content-center align-items-center">
        //               {(this.state.editUser==true) ?
        //                   <input id="roleInput" style={{"width": "5rem"}} placeholder={ role } name="role" type="text"/>
        //               :
        //                   <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ role }</h2>
        //               }
        //           </div>
        //           <div className="col d-flex justify-content-center align-items-center">
        //               {(this.state.editUser==true) ?
        //                   <input id="institutionInput" style={{"width": "5rem"}} placeholder={ institution } name="institution" type="text"/>
        //               :
        //                   <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{ institution }</h2>
        //               }
        //           </div>
        //           <div className="col d-flex justify-content-center align-items-center">
        //               {(this.state.editUser==true) ?
        //                   <input id="consentInput" style={{"width": "5rem"}} placeholder={ ((consent=="on") && "Approved") || ((consent=="off" && "Not Approved")) } name="consent" type="text"/>
        //               :
        //                   <h2 className="m-1 fs-6" style={{"width": "5rem"}}>{((consent=="on") && "Approved") || ((consent=="off" && "Not Approved"))}</h2>
        //               }
        //           </div>
        //           <div className="col d-flex justify-content-center align-items-center">
        //               <button id="editButton" onClick={() => {toggleValues()}} className="m-1 btn btn-dark">
        //                   {(this.state.editUser==false) && "Edit"}
        //                   {(this.state.editUser==true) && "Save"}
        //               </button>
        //           </div>
        //           <div className="col d-flex justify-content-center align-items-center">
        //               <button id="deleteButton" onClick={() => {deleteUser()}} className="m-1 btn btn-dark">Delete</button>
        //           </div>
        //       </div>
        //   </div>
      )
  }
}

export default User;