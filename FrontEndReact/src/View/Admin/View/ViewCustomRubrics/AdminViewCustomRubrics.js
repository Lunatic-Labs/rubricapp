import { Component } from "react";
import { genericResourceGET } from "../../../../utility";

class AdminViewCustomRubrics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            rubrics: null,
            categories: null,
        };
    }

    componentDidMount() {
        genericResourceGET(`/rubric?custom=${true}`, "rubrics", this);

        genericResourceGET(`/category?custom=${true}`, "categories", this);
    }

    render() {
        const { rubrics, categories } = this.state;

        console.log(rubrics);

        console.log(categories);

        return(
            <>
                <h1>My Custom Rubrics</h1>
            </>
        );
    }
}

export default AdminViewCustomRubrics;