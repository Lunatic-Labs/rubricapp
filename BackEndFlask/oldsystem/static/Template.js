const json = 
{
    "Projects": [
        {
            "project_id":"1",
            "project_name": "Project 1",
            "project_status": "Active",
            "project_author": "Brian Lugo"
        },
        {
            "project_id":"2",
            "project_name": "Project 2",
            "project_status": "Inactive",
            "project_author": "Mekeal Brown"
        },
        {
            "project_id":"3",
            "project_name": "Project 3",
            "project_status": "Active",
            "project_author": "Aldo Velarde"
        }
    ],
    "Users": [
        {
            "user_name": "user1",
            "user_position": "TA",
            "user_email": "userTA@gmail.com"
        },
        {
            "user_name": "user2",
            "user_position": "Student",
            "user_email": "userStudent@gmail.com"
        },
        {
            "user_name": "user3",
            "user_position": "Admin",
            "user_email": "userAdmin@gmail.com"
        }
    ]
}

class Project extends React.Component {
    render() {
        const project = this.props.project;
        const projectID = project["project_id"];
        const projectName = project["project_name"];
        const projectStatus = project["project_status"];
        const projectAuthor = project["project_author"];
        return (
            <div className="card m-1" style={{"maxWidth":"30rem", "borderRadius": "0.5rem"}}>
                <h1 className="fs-3 p-3" style={{"borderRadius": "0.5rem"}}>{projectName}</h1>
                <div className="p-3" style={{"width":"25rem"}}>
                    <h2 className="fs-4 text-end">ID: {projectID}</h2>
                </div>
                <div className="d-inline">
                    <p className="fs-4 text-center">{projectStatus}</p>
                    <p className="fs-6 text-end">{projectAuthor}</p>
                </div>
            </div>
        )
    }
}

class Projects extends React.Component {
    render() {
        const projects = this.props.projects;
        const projectList = [];
        for(var i = 0; i < projects.length; i++) {
            projectList.push(
                <Project project={projects[i]} key={i}/>
            );
        }
        return(
            <div className="row">
                { projectList }
            </div>
        )
    }
}

class User extends React.Component {
    render() {
        const user = this.props.user;
        const userName = user["user_name"];
        const userPosition = user["user_position"];
        const userEmail = user["user_email"];
        return (
            <div className="card m-2" style={{"maxWidth":"16rem", "borderRadius": "0.5rem"}}>
                <h1 className="fs-3">User's Name: { userName }</h1>
                <h2 className="fs-4">User's Position: { userPosition }</h2>
                <p>User's Email: { userEmail }</p>
            </div>
        )
    }
}

class Users extends React.Component {
    render() {
        const users = this.props.users;
        const userList = [];
        for(var i = 0; i < users.length; i++) {
            userList.push(
                <User user={users[i]} key={i}/>
            );
        }
        return (
            <div className="d-flex justify-content-center row">
                { userList }
            </div>
        )
    }
}

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const data = this.props.data;
        const projects = data["Projects"];
        const users = data["Users"];
        return(
            <React.Fragment>
                <div className="d-flex justify-content-center">
                    <Projects projects={projects}/>
                </div>
                {/* <div className="d-flex">
                    <Users users={users}/>
                </div> */}
            </React.Fragment>
        )
    }
}

class Template extends React.Component {
    render() {
        return(
            <React.Fragment>
                <Controller data={json}/>
            </React.Fragment>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Template/>);