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
                 
                    <Form data={JSON}/>

                </React.Fragment>
            )
        }
    }
}

class Form extends React.Component {

    render(){
        const data = this.props.data;
        const recordList = [];
        var compoList = []
        data["category"].map(record => {
            return (
                recordList.push(record)
               
                // <div key={record.name}>
                //     <form>
                //         <p>{record.name}</p>
                //         <div key={record.name}>
                //         {record.section.map( detail => {
                //             return (
                //                 <div>
                //                     <p>{detail.name}</p>
                //                     <p>{detail.type}</p>
                //                     <div key={record.name}>
                //                     {detail.values.map(value => {
                //                         return (
                //                             <option>{value.name} {value.desc}</option>
                //                         )
                //                     })}
                //                     </div>
                //                 </div>
                //             )
                //         })}
                //         </div>
                //     </form> 
                // </div>
            )
        })
        for(var i = 0; i < recordList.length; i++) {
            compoList.push(
                <Category record={recordList[i]} key={i} show={true}/>
            )
        }    

        // console.log(compoList)
        return (
            <React.Fragment>
                {compoList}
            </React.Fragment>
        )

    }
    

}

class Category extends React.Component {
    

    render () {
        const record = this.props.record;
        const show = this.props.show;
        
        
        
        return (
        <div className="card m-3 bg-secondary" key={record.name}>
           
            <div className="d-flex align-items-center p-1 pt-2">
            {/* <button onClick={showComponent()}>Click me</button> */}
             <p className="card-title text-white p-1">{record.name}</p>
             </div>
             
                    {show?
                    <form>
                        
                        <div key={record.name}>
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
                        </div>
                        <div className="d-grid gap-2 col-6 mx-auto mb-2">
                            <button className="btn btn-success" type="button">Save</button>
                        </div>    
                    </form> 
    : null}
        </div>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<JSON/>)