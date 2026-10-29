import { Component } from "react";
import { genericResourceGET } from "../../../../utility";
import CollapsableRubricCategoryTable from "../../Add/AddCustomRubric/CollapsableRubricCategoryTable";
import ErrorMessage from "../../../Error/ErrorMessage";
import CustomButton from "../../../Components/CustomButton";
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
                <div style={{ paddingTop: "16px"}}>
                    <h2
                        className="sb-page-title"
                        style={{ textAlign: "left" }}
                        data-testid="add-custom-rubric-title"
                    >
                        My Custom Rubrics
                    </h2>
                </div>
                <hr style={{ border: 0, borderTop: "1px solid #787878", margin: 0 }} />

                { errorMessage &&
                    <ErrorMessage
                        errorMessage={errorMessage}
                    />
                }

                <div style={{ marginTop: "1rem" }}>
                    <CollapsableRubricCategoryTable
                        categories={categories}
                        rubrics={rubrics}
                        readOnly={true}
                        showEditButton={true}
                        navbar={this.state.navbar}
                    />
                </div>

                <CustomButton
                    label="Add Custom Rubric"
                    isOutlined={false}
                    onClick={() => {
                        this.props.navbar.setAddCustomRubric(true);
                    }}
                    style={{ width: "100%", marginTop: "1.25rem" }}
                    data-testid="my-custom-rubrics-add-custom-rubric-button"
                />
            </div>
        );
    }
}

export default AdminViewCustomRubrics;