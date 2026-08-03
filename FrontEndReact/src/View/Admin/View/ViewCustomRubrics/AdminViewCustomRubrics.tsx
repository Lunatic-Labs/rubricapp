import { Component } from "react";
import { genericResourceGET } from "../../../../utility";
import CollapsableRubricCategoryTable from "../../Add/AddCustomRubric/CollapsableRubricCategoryTable";
import ErrorMessage from "../../../Error/ErrorMessage";
import { Grid, Box} from "@mui/material";
import CustomButton from "../../Add/AddCustomRubric/Components/CustomButton";
import Loading from "../../../Loading/Loading";
import { Rubric } from '../../../../types/Rubric';
import { Category } from '../../../../types/Category';

interface AdminViewCustomRubricsProps {
    navbar: any;
}

interface AdminViewCustomRubricsState {
    isLoaded: boolean | null;
    errorMessage: string | null;
    rubrics: Rubric[] | null;
    categories: Category[] | null;
    navbar: any;
}

class AdminViewCustomRubrics extends Component<AdminViewCustomRubricsProps, AdminViewCustomRubricsState> {
    constructor(props: AdminViewCustomRubricsProps) {
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
                <Loading />
            );
        }

        return(
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: "16px"}}>
                    <h2
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                        }}
                        aria-label="addCustomRubricTitle"
                    >
                        My Custom Rubrics
                    </h2>
                    <CustomButton
                        label="Add Custom Rubric"
                        isOutlined={false}
                        onClick={() => {
                            this.props.navbar.setAddCustomRubric(true);
                        }}
                        aria-label="myCustomRubricsAddCustomRubricButton"
                    />
                </div>
                <hr style={{ borderTop: "1px solid #787878"}}/>

                { errorMessage &&
                    <ErrorMessage
                        errorMessage={errorMessage}
                    />
                }
                
                <CollapsableRubricCategoryTable
                    categories={categories}
                    rubrics={rubrics}
                    readOnly={true}
                    showEditButton={true}
                    navbar={this.state.navbar}
                />
            </div>
        );
    }
}

export default AdminViewCustomRubrics;