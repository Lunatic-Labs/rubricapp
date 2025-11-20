// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import { Component } from "react";
import { genericResourceGET } from "../../../../utility";
import CollapsableRubricCategoryTable from "../../Add/AddCustomRubric/CollapsableRubricCategoryTable";
import ErrorMessage from "../../../Error/ErrorMessage";
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Grid } from "@mui/material";
import CustomButton from "../../Add/AddCustomRubric/Components/CustomButton.js";
import Loading from "../../../Loading/Loading.js";



class AdminViewCustomRubrics extends Component {
    props: any;
    state: any;
    constructor(props: any) {
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
        } = this.state;


        if (!isLoaded || !rubrics || !categories) {
            return(
                // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
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

                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
                            this.props.navbar.setAddCustomRubric(true);
                        }}
                        aria-label="myCustomRubricsAddCustomRubricButton"
                    />
                </Grid>
            </Grid>
        );
    }
}

export default AdminViewCustomRubrics;