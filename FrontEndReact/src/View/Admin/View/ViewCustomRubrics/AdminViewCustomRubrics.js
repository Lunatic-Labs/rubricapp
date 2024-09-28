import { Component } from "react";
import { genericResourceGET } from "../../../../utility";
import CollapsableRubricCategoryTable from "../../Add/AddCustomRubric/CollapsableRubricCategoryTable";
import ErrorMessage from "../../../Error/ErrorMessage";
import { Grid } from "@mui/material";
import CustomButton from "../../Add/AddCustomRubric/Components/CustomButton.js";
import Loading from "../../../Loading/Loading.js";



class AdminViewCustomRubrics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            rubrics: null,
            categories: null,
            navbar: props.navbar,
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
            categories,
            navbar
        } = this.state;

        //this.state.navbar = props.navbar;

        if (!isLoaded || !rubrics || !categories) {
            return(
                <Loading />
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
                        readOnly={true}
                        showEditButton={true}
                        showDeleteButton={true}
                        navbar={this.state.navbar}
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