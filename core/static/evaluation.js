class JSON extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            
            isLoaded: false,
          
            JSON: [],
         
        }
    }
    componentDidMount() {
        fetch("http://127.0.0.1:5000/api/rubric/1")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    JSON: result["content"],
                })
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                })
            }
        )
    
    }
    render() {
        
        const { error, isLoaded, JSON } = this.state;
       
        if(error) {
            return(
                <React.Fragment>
                  
                    <h1>Fetching data resulted in an error: { error.message }</h1>
                </React.Fragment>
            )
       
        } else if (!isLoaded) {
            return(
                <React.Fragment>
                    <h1>Loading...</h1>
                </React.Fragment>
            )
        } else {
            return(
                <React.Fragment>
                     {/* renders the whole card. May need to be changed.  */}
                    <div class="container">  
                   
                            
                            <Form data={JSON}/>
                     
              
                    
                   
                    
                    </div>
                </React.Fragment>
            )
        }
    }
}

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTabs: false
        }
    }
    render(){
       
        const data = this.props.data;
        const recordList = [];
        var compoList = []
        data["category"].map(record => {
            return (
                recordList.push(record)

            )
        })
        for(var i = 0; i < recordList.length; i++) {
            compoList.push(
                
                <Category record={recordList[i]} key={i} show={false}/>
                
            )
        }    

        
        return (
            <React.Fragment>
                <div>
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        {compoList}
                     </ul>
                  
                </div>    
               
            </React.Fragment>
        )

    }
    

}

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show
        }
    }
    render () {
        const toggleTab = async () => {
            if(this.state.show==false) {
                await this.setState({
                    show: true
                });
            } else {
                // Write code here to save!!!!
                // Most likely the fetch request will be made to the api!!!
                await this.setState({
                    show: false
                });
            }
            
        }

        const record = this.props.record;
        return (
            <React.Fragment>

        <div key={record.name}>
             <li>
                <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">{record.name}</button>
             </li>
             
             <div class="tab-content" id="myTabContent">
            <Tab record={this.props.record} />
            </div>

{/* should be in each category */}
          
             { this.state.show==true &&
                <form>

                    {record.section.map( detail => {
                        return (
                            
                            <div key = {detail.name} className="bg-white p-2 m-3 rounded">
                                
                                <p>{detail.name}</p>
                                
                                <div className={detail.type === "radio" ? "d-flex flex-row justify-content-around" : "" }>

                                {detail.values.map(value => {
                                    
                                    return (
                                        detail.type === "radio" ?
                                        <div className="">
                                            <div className="p-2 text-white">
                                                    <div className="card text-white bg-secondary mb-4">
                                                    <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                                                    <div className="m-2">
                                                    <p className="form-check-label p-1">{value.name} {value.desc}</p>
                                                    </div>
                                                    </div>
                                            </div>
                                        </div>
                                    
                                        :
                                        <div className="m-3 bg-secondary p-2 rounded text-white">
                                            <input className="m-3" type="checkbox" value="" id="flexCheckDefault"></input>
                                            <label className="form-check-label">
                                                {value.desc}
                                            </label>
                                        </div> 
                                    )
                                })}
                                </div>
                            </div>
                        )
                    })}
                
                    <div className="d-grid gap-2 col-6 mx-auto mb-2">
                        <button className="btn btn-success" type="button">Save</button>
                    </div>    
                </form> 
                 }
             
   </div>
            </React.Fragment>
        )



        // return (
        //     <div className="card m-3 bg-secondary" key={record.name}>
        //         <div className="d-flex align-items-center p-1 pt-2">
        //         <button onClick={() => toggleTab()}>Show tab</button>
        //          <p className="card-title text-white p-1">{record.name}</p>
        //          </div>
        //             { this.state.show==true &&
        //             <form>
    
        //                 <div key={record.name}>
        //                 {record.section.map( detail => {
        //                     return (
                                
        //                         <div key = {detail.name} className="bg-white p-2 m-3 rounded">
                                    
        //                             <p>{detail.name}</p>
                                    
        //                             <div className={detail.type === "radio" ? "d-flex flex-row justify-content-around" : "" }>
    
        //                             {detail.values.map(value => {
                                        
        //                                 return (
        //                                     detail.type === "radio" ?
        //                                     <div className="">
        //                                         <div className="p-2 text-white">
        //                                                 <div className="card text-white bg-secondary mb-4">
        //                                                 <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
        //                                                 <div className="m-2">
        //                                                 <p className="form-check-label p-1">{value.name} {value.desc}</p>
        //                                                 </div>
        //                                                 </div>
        //                                         </div>
        //                                     </div>
                                        
        //                                     :
        //                                     <div className="m-3 bg-secondary p-2 rounded text-white">
        //                                         <input className="m-3" type="checkbox" value="" id="flexCheckDefault"></input>
        //                                         <label className="form-check-label">
        //                                             {value.desc}
        //                                         </label>
        //                                     </div> 
        //                                 )
        //                             })}
        //                             </div>
        //                         </div>
        //                     )
        //                 })}
        //                 </div>
        //                 <div className="d-grid gap-2 col-6 mx-auto mb-2">
        //                     <button className="btn btn-success" type="button">Save</button>
        //                 </div>    
        //             </form> 
        //             }
        //     </div>
        //     )
    }
}

class Tab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show
        }
    }
    
    render () {
        const record = this.props.record;
    <div>
        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
        <form>
                    {record.section.map( detail => {
                    return (
                        
                        <div key = {detail.name} className="bg-white p-2 m-3 rounded">
                            
                            <p>{detail.name}</p>
                            
                            <div className={detail.type === "radio" ? "d-flex flex-row justify-content-around" : "" }>

                            {detail.values.map(value => {
                                
                                return (
                                    detail.type === "radio" ?
                                    <div className="">
                                        <div className="p-2 text-white">
                                                <div className="card text-white bg-secondary mb-4">
                                                <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                                                <div className="m-2">
                                                <p className="form-check-label p-1">{value.name} {value.desc}</p>
                                                </div>
                                                </div>
                                        </div>
                                    </div>
                                
                                    :
                                    <div className="m-3 bg-secondary p-2 rounded text-white">
                                        <input className="m-3" type="checkbox" value="" id="flexCheckDefault"></input>
                                        <label className="form-check-label">
                                            {value.desc}
                                        </label>
                                    </div> 
                                )
                            })}
                            </div>
                        </div>
                    )
                })}

                <div className="d-grid gap-2 col-6 mx-auto mb-2">
                    <button className="btn btn-success" type="button">Save</button>
                </div>    
                </form> 
        </div>
    </div>
}
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<JSON/>)