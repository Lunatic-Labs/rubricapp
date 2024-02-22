import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ErrorMessage from "../../../Error/ErrorMessage";
import { genericResourceGET, parseCategoriesToContained, parseCategoryIDToCategories } from '../../../../utility.js';
import AddCustomRubric from "./AddCustomRubric";



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
    genericResourceGET(`/rubric?default='${true}'`, "rubrics", this);
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
        <AddCustomRubric
          navbar={this.props.navbar}
          rubrics={rubrics}
          categories={categories}
          chosenCategoryJson={parseCategoriesToContained(categories)}
          categoryMap={parseCategoryIDToCategories(categories)}
        />
      );
    }
  }
}

export default AdminAddCustomRubric;
