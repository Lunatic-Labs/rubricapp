import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ErrorMessage from "../../../Error/ErrorMessage";
import AdminAddCustomRubricView from "./AdminAddCustomRubricView";
// import '../AddUsers/addStyles.css';
// import validator from 'validator';
// import { API_URL } from '../../../../App';

class AdminAddCustomRubric extends Component {
  constructor(props) {
    super(props);
    // TODO: Need to determine the correct state variables
    this.state = {
      errorMessage: null,
      rubric_name: "",
      categories: [],
      category_name: "",
      category_weight: "",
    };
  }
  // NOTE: Started on the structure of the page
  render() {
    const {
      errorMessage,
      rubric_name,
      categories,
      category_name,
      category_weight,
    } = this.state;

    // TODO: Need to determine how we will fill the tables with the correct data
    if (errorMessage) {
      return (
        <div className="container">
          <ErrorMessage
            fetchedResource={"Rubric"}
            errorMessage={errorMessage}
          />
        </div>
      );
    } else {
      return (
        // TODO: Add correct props
        <AdminAddCustomRubricView
          rubric_name={rubric_name}
          categories={categories}
          category_name={category_name}
          category_weight={category_weight}
          navbar={this.props.navbar}
        />
      );
    }
  }
}

export default AdminAddCustomRubric;
