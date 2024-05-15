import { Component } from "react";
import { genericResourceGET } from "../../../../utility";
import CollapsableRubricCategoryTable from "../../Add/AddCustomRubric/CollapsableRubricCategoryTable";
import ErrorMessage from "../../../Error/ErrorMessage";
import { Grid } from "@mui/material";
import CustomButton from "../../Add/AddCustomRubric/Components/CustomButton.js";

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
        const {
            isLoaded,
            errorMessage,
            rubrics,
            categories
        } = this.state;

        if (!isLoaded || !rubrics || !categories) {
            return(
                <>
                    <h1>Loading...</h1>
                </>
            );
        }

        return(
            <Grid container spacing={6.5}>
                <Grid item xs={6}>
                    { errorMessage &&
                        <ErrorMessage
                            errorMessage={errorMessage}
                        />
                    }

                    <h2
                        style={{
                            borderBottom: "1px solid #D9D9D9",
                            paddingTop: "16px",
                            paddingBottom: "16px",
                            textAlign: "left",
                            bold: true,
                        }}
                        aria-label="addCustomRubricTitle"
                    >
                        My Custom Rubrics
                    </h2>

                    <CollapsableRubricCategoryTable
                        categories={categories}
                        rubrics={rubrics}
                        onCategorySelect={null}
                        readOnly={true}
                    />
                </Grid>

                <Grid item xs={6} container justifyContent="flex-end">
                    <CustomButton
                        label="Add Custom Rubric"
                        isOutlined={false}
                        onClick={() => {
                            this.props.navbar.setNewTab("AddCustomRubric");
                        }}
                        aria-label="myCustomRubricsAddCustomRubricButton"
                    />
                </Grid>
            </Grid>
        );
    }
}

export default AdminViewCustomRubrics;