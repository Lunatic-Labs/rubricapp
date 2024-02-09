import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ErrorMessage from "../../../Error/ErrorMessage";
import AdminAddCustomRubricView from "./AdminAddCustomRubricView";
import { genericResourceGET, parseCategoriesToContained, parseCategoryIDToCategories } from '../../../../utility.js';
import AddCustomRubric from "./AddCustomRubric";

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

  componentDidMount() {
    genericResourceGET(`/rubric`, "rubrics", this);
    genericResourceGET(`/category`, "categories", this);
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
      return (
        // <AdminAddCustomRubricView
        //   navbar={this.props.navbar}
        //   rubrics={rubrics}
        //   categories={categories}
        //   chosen_category_json={parseCategoriesToContained(categories)}
        //   category_map={parseCategoryIDToCategories(categories)}
        // />
        <AddCustomRubric
          navbar={this.props.navbar}
          rubrics={rubrics}
          categories={categories}
          chosen_category_json={parseCategoriesToContained(categories)}
          category_map={parseCategoryIDToCategories(categories)}
        />
      );
    }
  }
}

export default AdminAddCustomRubric;
