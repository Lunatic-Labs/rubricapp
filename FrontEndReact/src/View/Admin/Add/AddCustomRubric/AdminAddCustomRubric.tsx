import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ErrorMessage from "../../../Error/ErrorMessage";
import { genericResourceGET, parseCategoriesToContained, parseCategoryIDToCategories, } from "../../../../utility";
import AddCustomRubric from "./AddCustomRubric";
import Loading from "../../../Loading/Loading";

class AdminAddCustomRubric extends Component {
    props: any;
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
                <div className="container">
                    <ErrorMessage
                        fetchedResource={"Rubric or Category"}
                        errorMessage={errorMessage}
                    />
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
