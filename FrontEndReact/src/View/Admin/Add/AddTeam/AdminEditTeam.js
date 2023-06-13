import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from "mui-datatables";

class AdminEditTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            users: [],
            usersEdit: [],

        }
    }
    userExists(user_id) {
        console.log(user_id)
        if(user_id === true){
            console.log("Yes")
        }
    }
    
    userRemove() {

    }

    userAdd() {

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
                    users: result['content']['users'][0],
                    
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
        //console.log(team_id);
        const columns = [
            {
            name: "first_name",
            label: "First Name",
            options: {
                filter: true,
            }
            },   
            {
            name: "last_name",
            label: "Last Name",
            options: {
                filter: true,
            }
            },
            {
            name: "email",
            label: "Email",
            options: {
                filter: true,
            }
            },   
            {
            name: "team_id",
            label: "Add/Remove",
            options : {
                filter: true,
                sort: false,

                // customBodyRender: (user_id) => {
                //     return(
                //         <button id="change" className ="btn btn-primary" onClick = {() => this.userExists(user_id)}>
                //             ----
                //     </button>
                //     )
                // }
            }
            }
        ]
        const options = {
            onRowsDelete: false,
            download: false,
            print: false,
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "vertical",
            tableBodyMaxHeight: "500px"
        };
        return (
            <>
            <div className='container'>
                <h1
                    className='mt-5'
                >
                    Edit Team
                </h1>
            </div>
            <MUIDataTable
                data={this.state.users ? this.state.users : []}
                columns={columns}
                options={options}
            />
            </>
            
        )
    }
}

export default AdminEditTeam;