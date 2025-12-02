import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ErrorMessage from "../../../Error/ErrorMessage";
import { genericResourceGET, parseCategoriesToContained, parseCategoryIDToCategories, } from "../../../../utility";
import AddCustomRubric from "./AddCustomRubric";
import Loading from "../../../Loading/Loading";

interface AdminEditCustomRubricProps {
    navbar: any;
}

interface AdminEditCustomRubricState {
    isLoaded: any;
    errorMessage: any;
    rubrics: any;
    categories: any;
}

class AdminEditCustomRubric extends Component<AdminEditCustomRubricProps, AdminEditCustomRubricState> {
    constructor(props: AdminEditCustomRubricProps) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            rubrics: null,
            categories: null,
        };
    }

    componentDidMount() {
        genericResourceGET(`/rubric`, "rubrics", this);

        genericResourceGET(`/category`, "categories", this);
    }

    render() {
        const { isLoaded, errorMessage, rubrics, categories } = this.state;

        if (errorMessage) {
            return (
                <div className="container">
                    <ErrorMessage
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
                />
            );
        }
    }
}

export default AdminEditCustomRubric;
