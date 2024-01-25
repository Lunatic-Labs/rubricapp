import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ErrorMessage from "../../../Error/ErrorMessage";
import AdminAddCustomRubricView from "./AdminAddCustomRubricView";
import { genericResourceGET } from '../../../../utility.js';
// import '../AddUsers/addStyles.css';
// import validator from 'validator';
// import { API_URL } from '../../../../App';

// NOTE: Using Rubric_routes.py
class AdminAddCustomRubric extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: null,
      errorMessage: null,
      rubrics: null,
      categories: null,
    }
  }

  // NOTE: Code grabs the rubric id from the navbar state and uses it to fetch the rubric
  componentDidMount() {
    var rubric_id = this.props.navbar.state.chosenRubric.rubric_id;
    genericResourceGET(`/rubric?rubric_id=${rubric_id}`, "rubrics", this);
    genericResourceGET(`/category?rubric_id=${rubric_id}`, "categories", this);
  }

  render() {
    const { 
      isLoaded,
      errorMessage, 
      rubrics,
      categories,
    } = this.state;

    if (errorMessage) {
      return (
        <div className="container">
          <ErrorMessage
            fetchedResource={"Rubric or Category"}
            errorMessage={errorMessage}
          />
        </div>
      );
    } else if (!isLoaded || !rubrics || !categories) {
      return (
        <div className="container">
          <h1> Loading... </h1>
        </div>
      );
    } else {
      console.log(rubrics);
      console.log(categories);
      return (
        <AdminAddCustomRubricView
          rubrics={rubrics}
          categories={categories}
          navbar={this.props.navbar}
        />
      );
    }
  }
}

export default AdminAddCustomRubric;
