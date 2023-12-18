// import React, { Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.css';

// class Suggestion extends Component {
//     constructor(props) {
//         super(props);
//         var navbar = this.props.navbar;
//         var suggestionComponent = navbar.suggestionComponent;
//         var suggestions = suggestionComponent.suggestions;
//         var id = suggestionComponent.id;
//         this.state = {
//             color: suggestions[id]==="1",
//             clicked: suggestions[id]==="1"
//         }
//     }
//     render() {
//         var navbar = this.props.navbar;
//         var suggestionComponent = navbar.suggestionComponent;
//         var suggestion = suggestionComponent.suggestion;
//         var completeAssessmentTaskReadOnly = navbar.completeAssessmentTaskReadOnly;

//         var suggestionID = suggestion["suggestion_id"];
//         var suggestionText = suggestion["suggestion_text"];

//         var gray = "#cccccc";
//         var blue = "#2E8BEF40";

//         var readOnly = completeAssessmentTaskReadOnly.readOnly;
//         var id = suggestionComponent.id;
//         var suggestions = suggestionComponent.suggestions;
//         var setSuggestions = suggestionComponent.setSuggestions;
//         var category_name = suggestionComponent.category_name;
//         return (
//             <React.Fragment>
//                 <div
//                     onClick={
//                         () => {
//                             if(!readOnly) {
//                                 this.setState({
//                                     color: !this.state.color,
//                                     clicked: !this.state.clicked
//                                 })
//                                 var new_data = "";
//                                 for(var i = 0; i < suggestions.length; i++) {
//                                     if(i===id) {
//                                         new_data += suggestions[i]==="0" ? "1" : "0";
//                                     } else {
//                                         new_data += suggestions[i];
//                                     }
//                                 }
//                                 setSuggestions(
//                                     category_name,
//                                     new_data
//                                 );
//                             }
//                         }
//                     }
//                     className="
//                         d-flex
//                         justify-content-start
//                         align-items-center
//                         input-color
//                         text-black
//                         rounded
//                         m-1
//                     "
//                     style={{
//                         "backgroundColor": this.state.color ? blue:gray
//                     }}>
//                     <input
//                         className="
//                             m-2
//                             text-left
//                         "
//                         style={{
//                             "width":"1.25rem",
//                             "height":"1.25rem"
//                         }}
//                         id={"suggestion"+suggestionID}
//                         name={suggestionText}
//                         type="checkbox"
//                         readOnly
//                         checked={this.state.clicked}
//                         disabled={readOnly}
//                     ></input>
//                     <label
//                         className="
//                             form-check-label
//                             text-left
//                             h3
//                         "
//                         style={{"width":"100%"}}
//                     >
//                         {suggestionText}
//                     </label>
//                 </div>
//             </React.Fragment>
//         )
//     }
// }

// export default Suggestion;

import React, { Component } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';

class Suggestion extends Component {
  constructor(props) {
    super(props);
    var navbar = this.props.navbar;
    var suggestionComponent = navbar.suggestionComponent;
    var suggestions = suggestionComponent.suggestions;
    var id = suggestionComponent.id;
    this.state = {
      checked: suggestions[id] === "1",
    };
  }

  render() {
    var navbar = this.props.navbar;
    var suggestionComponent = navbar.suggestionComponent;
    var suggestion = suggestionComponent.suggestion;
    var completeAssessmentTaskReadOnly = navbar.completeAssessmentTaskReadOnly;

    var suggestionID = suggestion["suggestion_id"];
    var suggestionText = suggestion["suggestion_text"];

    var readOnly = completeAssessmentTaskReadOnly.readOnly;
    var id = suggestionComponent.id;
    var suggestions = suggestionComponent.suggestions;
    var setSuggestions = suggestionComponent.setSuggestions;
    var category_name = suggestionComponent.category_name;

    const handleChange = () => {
      if (!readOnly) {
        this.setState((prevState) => ({
          checked: !prevState.checked,
        }));

        var new_data = "";
        for (var i = 0; i < suggestions.length; i++) {
          new_data += i === id ? (suggestions[i] === "0" ? "1" : "0") : suggestions[i];
        }

        setSuggestions(category_name, new_data);
      }
    };

    return (
      <React.Fragment>
        <Box
          onClick={handleChange}
          className="checkbox-alignment"
          style={{
            backgroundColor: this.state.checked ? "#ADCBEE" : "#D9D9D9",
          }}
        >
          <Checkbox
            sx={{
              p: 2,
              width: "1.25rem",
              height: "1.25rem",
              color: this.state.checked ? "#2E8BEF !important" : "none",
            }}
            id={"suggestion" + suggestionID}
            name={suggestionText}
            checked={this.state.checked}
            readOnly
            disabled={readOnly}
          />
          <label>{suggestionText}</label>
        </Box>
      </React.Fragment>
    );
  }
}

export default Suggestion;