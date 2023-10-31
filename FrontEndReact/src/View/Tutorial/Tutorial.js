import { Component } from "react";
import ErrorMessage from "../Error/ErrorMessage";
import ViewUsers from "../Admin/View/ViewUsers/ViewUsers";


class Tutorial extends Component{
    constructor(props){
        super(props);
        this.state ={
            errorMessage: null,
            isLoaded: null,
            fetchedDate: null
        }
    }
    componentDidMount(){
        fetch(
            "https://127.0.0.1:5000/api/user"
        )
        .then(res => res.json())
        .then(
            //Response received
            (result) => {
                //response was a success
                if(result["success"]){
                    this.setState(()=>( {
                        isLoaded: true,
                        fetchedData: result["content"]["users"][0]
                    }))
                } else {
                    //response received, but a client error occurred
                    this.setState(() => ({
                        isLoaded: true,
                        errorMessage: result["message"]
                    }))
                }
            }
            (error) => {
                // Response received, but a server error occurred
                this.setState(() => ({
                    isLoaded: false,
                    fetchedData: error
                }))
            }
        )
    }
    render(){
        const{ errorMessage,isLoaded, fetchedData } = this.state;
        let user =[];
        if(isLoaded && fetchedData){
            fetchedData.map((user, index)=> {
                return user.push(
                    <div key={index}className="card-body">
                        <h1 className="card-title fs-2">{user["first_name"] + " " + user["last_name"]}</h1>
                        <p className="card-text fs-4">{"Email: " + user["email"]}</p>
                        <div className="d-flex flex-row gap-5 justify-content-center">
                            <div className="btn bg-primary text-white m-1">
                                <p className="card-text">{"User ID: " + user["user_id"]}</p>
                            </div>
                            <div className="btn bg-primary text-white m-1">
                                <p className="card-text">{"Owner ID: " + user["owner_id"]}</p>
                            </div>
                            <div className="btn bg-primary text-white m-1">
                                <p className="card-text">{"Role ID: " + user["role_id"]}</p>
                            </div>
                        </div>
                        <div className="d-flex flex-row gap-5 justify-content-center">
                            <div className="card-text"></div>
                        </div>
                    </div>
                )
            })
        }
        return(
            <>
                {/*A response has not been received*/}
                {   isLoaded ===null  && fetchedData===null && errorMessage === null &&
                    <div className="container">
                        <h1>Loading...</h1>
                    </div>
                }
                {/*A resonse has been received and valid data is returned*/}
                { isLoaded && fetchedData && errorMessage === null && 
                    <div className="container">
                        <h1> Tutorial: Users</h1>
                        <div className="d-flex flex-column gap-3">
                            <ViewUsers users={fetchedData}/>
                            { users }
                        </div>
                    </div>
                }
                {/* A response jas neem received nut a client error occurred */}
                { isLoaded && fetchedData===null && errorMessage && }
            </>
        )
        
    }
};

export default Tutorial;