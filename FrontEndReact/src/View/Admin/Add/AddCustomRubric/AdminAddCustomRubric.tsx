// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ErrorMessage from "../../../Error/ErrorMessage";
import { genericResourceGET, parseCategoriesToContained, parseCategoryIDToCategories, } from "../../../../utility.js";
import AddCustomRubric from "./AddCustomRubric";
import Loading from "../../../Loading/Loading.js";

class AdminAddCustomRubric extends Component {
    props: any;
    setState: any;
    state: any;
    constructor(props: any) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            rubrics: null,
            categories: null,
        };
    }

    fetchData = () => {
        genericResourceGET(`/rubric`, "rubrics", this);
        genericResourceGET(`/category`, "categories", this);
        };

    setErrorMessage = (errorMessage: any) => {
    this.setState({ errorMessage });
    // Clear the banner after 3s, same feel as AdminViewUsers
    setTimeout(() => {
        this.setState({ errorMessage: null });
    }, 1000);
};


    componentDidMount() {
        genericResourceGET(`/rubric`, "rubrics", this);

        genericResourceGET(`/category`, "categories", this);
        this.fetchData();
    }

    render() {
        const { isLoaded, errorMessage, rubrics, categories } = this.state;

        if (errorMessage) {
            return (
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className="container">
                    <ErrorMessage
                        fetchedResource={"Rubric or Category"}
                        errorMessage={errorMessage}
                    />
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
            );
        } else if (!isLoaded || !rubrics || !categories) {
            return (
                <Loading />
            );
        } else {
            return (
                <AddCustomRubric
                    navbar={this.props.navbar}
                    rubrics={rubrics}
                    categories={categories}
                    chosenCategoryJson={parseCategoriesToContained(categories)}
                    categoryMap={parseCategoryIDToCategories(categories)}
                    onError={this.setErrorMessage}
                    refreshData={this.fetchData}
                />
            );
        }
    }
}

export default AdminAddCustomRubric;
