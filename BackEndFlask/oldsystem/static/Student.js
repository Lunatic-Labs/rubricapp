


class AddStudent extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div>
          <h1 style={{"textAlign":"center", "paddingTop":"10rem"}}>Add Student</h1>
        </div>
        <div
          id="mySidenav"
          className="sidenav"
          style={{
            "display":"flex",
            "flexDirection":"column",
            "justifyContent":"start",
            "alignItems":"center",
            "position":"fixed",
            "top":"0",
            "left":"0",
            "backgroundColor": "#a3a2ab",
            "borderBlock":"none",
            "margin":"0",
            "padding":"0",
            "height":"100vh",
            "width":"10rem"
          }}>
          <img style={{
            "height":"5rem",
            "width":"5rem"
          }} src="http://127.0.0.1:5000/static/pogil_logo.png" />
          <div className="navbar">
            <a style={{
              "textDecoration":"none",
              "fontSize": "1.5rem",
              "display":"block"
            }} href="#">Dashboard</a>
          </div>
          <div className="navbar">
            <a style={{
              "textDecoration":"none",
              "fontSize":"1.5rem"
            }} href="#">Rubrics</a>
          </div>
          <div className="navbar">
            <a style={{
              "textDecoration":"none",
              "fontSize":"1.5rem"

            }} href="#">Evaluations</a>
          </div>
          <div className="navbar">
            <a style={{
              "textDecoration":"none",
              "fontSize":"1.5rem",
            }} href="#">Account</a>
          </div>
      </div>
      
        <form style={{"display":"flex", "justifyContent": "center", "alignItems":"center"}} method="POST" action="http://127.0.0.1:5000/api/create_user">
          <div style={{"display":"flex", "flexDirection":"column", "gap":"0.55rem"}}>
            <div>
              <input style={{"fontSize":"1rem"}} placeholder="First Name" type="text" name="studentName" />
            </div>
            <div>
              <input style={{"fontSize":"1rem"}} placeholder="Last Name" type="text" name="LastName" />
            </div>
            <div>
              <input style={{"fontSize":"1rem"}} placeholder="Email" type="text" name="Email" />
            </div>
            <div>
              <button style={{"fontSize":"1rem"}} type="submit">Add Student</button>
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<AddStudent />, document.getElementById('root'));