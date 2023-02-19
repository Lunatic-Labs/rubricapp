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
                <Category record={recordList[i]} key={i}/>
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
        return (
        <div className="card" key={record.name}>
                    <form>
                        <p>{record.name}</p>
                        <div key={record.name}>
                        {record.section.map( detail => {
                            return (
                                <div>
                                    <p>{detail.name}</p>
                                    <div key={record.name}>
                                    {detail.values.map(value => {
                                        return (
                                            detail.type === "radio" ?
                                            <div className="container">
                                            <input class="form-check-input" type={detail.type} value="" id="defaultCheck1"></input>
                                            <option>{value.name} {value.desc}</option>
                                            </div>
                                            :
                                            <p>test</p>
                                        )
                                    })}
                                    </div>
                                </div>
                            )
                        })}
                        </div>
                    </form> 
        </div>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<JSON/>)