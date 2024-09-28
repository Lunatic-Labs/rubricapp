import React from "react";
import Cookies from "universal-cookie";
import { Grid, IconButton, TextField, Tooltip, FormControl } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CustomButton from "./Components/CustomButton.js";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import { genericResourcePOST, genericResourcePUT } from "../../../../utility";
import CustomDataTable from "../../../Components/CustomDataTable.js";
import CollapsableRubricCategoryTable from "./CollapsableRubricCategoryTable.js";
import ImageModal from "./CustomRubricModal.js";
import RubricDescriptionsImage from "../../../../../src/RubricDetailedOverview.png";
import FormHelperText from '@mui/material/FormHelperText';

class AddCustomRubric extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCategories: {},
            errorMessage: null,
            isLoaded: null,
            isHelpOpen: false,

            errors: {
                rubricName: '',
                rubricDescription: '',
                rubricCategories: '',
            }
        };

        this.toggleHelp = () => {
            this.setState({
                isHelpOpen: !this.state.isHelpOpen,
            });
        };

        this.handleCreateRubric = (pickedCategories) => {
            var categoryIds = [];

            for (
                var categoryIndex = 0;
                categoryIndex < pickedCategories.length;
                categoryIndex++
            ) {
                categoryIds = [
                    ...categoryIds,
                    pickedCategories[categoryIndex]["category_id"],
                ];
            }

            if (document.getElementById("rubricNameInput").value === "") {
                this.setState({
                    errors: {
                        rubricName: "Missing New Rubric Name."
                    }
                });

                return;
            }

            if (document.getElementById("rubricDescriptionInput").value === "") {
                this.setState({
                    errors: {
                        rubricDescription: "Missing New Rubric Description."
                    }
                });

                return;
            }

            if (categoryIds.length === 0) {
                this.setState({
                    isLoaded: true,
                    errors: {
                        rubricCategories: "Missing categories, at least one category must be selected.",
                    }
                });

                return;
            }

            var cookies = new Cookies();
            if (categoryIds !== null) {
                genericResourcePUT(
                    `/rubric`,
                    this,
                    JSON.stringify({
                        rubric: {
                            rubric_name: document.getElementById("rubricNameInput").value,
                            rubric_description: document.getElementById(
                                "rubricDescriptionInput",
                            ).value,
                            owner: cookies.get("user")["user_id"],
                        },
                    }),
                );
            } else {
                genericResourcePOST(
                    `/rubric`,
                    this,
                    JSON.stringify({
                        rubric: {
                            rubric_name: document.getElementById("rubricNameInput").value,
                            rubric_description: document.getElementById(
                                "rubricDescriptionInput",
                            ).value,
                            owner: cookies.get("user")["user_id"],
                        },

                        categories: categoryIds,
                    }),
                );
            }

            this.props.navbar.confirmCreateResource("MyCustomRubrics");
        };
    }

    handleCategorySelect = (categoryId, isSelected) => {
        const selectedCategories = { ...this.state.selectedCategories };

        if (isSelected)
            selectedCategories[categoryId] = true;

        else
            delete selectedCategories[categoryId];

        this.setState({
            selectedCategories: selectedCategories
        });
    };

    render() {
        const { rubrics, categories } = this.props;

        const { selectedCategories, isHelpOpen, errors } = this.state;

        const categoryTableColumns = [
            {
                name: "category_name",
                label: "Category",
                options: {
                    filter: true,
                    align: "center",
                    customBodyRender: (categoryName) => {
                        return <p>{categoryName}</p>;
                    },
                },
            },
            {
                name: "rubric_name",
                label: "Rubric",
                options: {
                    align: "center",
                    customBodyRender: (rubricName) => {
                        return <p>{rubricName}</p>;
                    },
                },
            },
        ];

        const options = {
            onRowsDelete: false,
            download: false,
            print: false,
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "vertical",
            tableBodyMaxHeight: "21rem",
            search: false,
            filter: false,
            viewColumns: false,
        };

        var pickedCategories = [];

        Object.keys(selectedCategories).map((categoryId) => {
            if (selectedCategories[categoryId]) {
                for (var i = 0; i < categories.length; i++) {
                    if (categories[i]["category_id"] === categoryId - "0") {
                        pickedCategories = [...pickedCategories, categories[i]];
                    }
                }
            }

            return categoryId;
        });

        return (
            <>
                {this.state.isLoaded && this.state.errorMessage && (
                    <ErrorMessage errorMessage={this.state.errorMessage} />
                )}

                <div>
                    <Grid container spacing={10}>
                        <Grid item xs={6}>
                            <h2
                                style={{
                                    borderBottom: "1px solid #D9D9D9",
                                    paddingTop: "16px",
                                    paddingBottom: "16px",
                                    textAlign: "left",
                                    bold: true,
                                }}
                                aria-label="addCustomizeYourRubricTitle"
                            >
                                Customize Your Rubric
                            </h2>
                        </Grid>

                        <Grid item xs={6} container justifyContent="flex-end">
                            <CustomButton
                                label="Create Rubric"
                                isOutlined={false}
                                aria-label="customizeYourRubricCreateRubricButton"
                                onClick={() => {
                                    this.handleCreateRubric(pickedCategories);
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Grid
                        style={{
                            justifyContent: "space-between",
                            marginBottom: "1.25rem",
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: "0.5rem",
                            display: "flex",
                            width: "100%",
                        }}
                    >
                        <Grid style={{ width: "48.25%" }}>
                            <TextField
                                required
                                id="rubricNameInput"
                                label="Rubric Name"
                                style={{ width: "100%" }}
                                error={!!errors.rubricName}
                                helperText={errors.rubricName}
                                aria-label="customizeYourRubricRubricName"
                            />
                        </Grid>

                        <Grid style={{ width: "48.5%" }}>
                            <TextField
                                required
                                id="rubricDescriptionInput"
                                label="Rubric Description"
                                multiline
                                style={{ width: "100%" }}
                                aria-label="customizeYourRubricRubricDescription"
                                error={!!errors.rubricDescription}
                                helperText={errors.rubricDescription}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={6.5}>
                        <Grid item xs={6}>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h3 className="d-flex mb-3">Rubrics</h3>
                                <Tooltip title="Help">
                                    <IconButton aria-label="help" onClick={this.toggleHelp}>
                                        <HelpOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>

                            <FormControl error={!!errors.rubricCategories} required fullWidth>
                                <CollapsableRubricCategoryTable
                                    categories={categories}
                                    rubrics={rubrics}
                                    onCategorySelect={this.handleCategorySelect}
                                    aria-label="customizeYourRubricRubricCategoryTable"
                                    readOnly={false}
                            />

                                <FormHelperText>{errors.rubricCategories ? "At least one category must be selected" : ""}</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <h3 className="d-flex mb-3" aria-label="yourSelectedCategories">Your Selected Categories</h3>

                            <CustomDataTable
                                data={pickedCategories}
                                columns={categoryTableColumns}
                                options={options}
                            />
                        </Grid>

                        <ImageModal
                            isOpen={isHelpOpen}
                            handleClose={this.toggleHelp}
                            imageUrl={RubricDescriptionsImage}
                        />
                    </Grid>
                </div>
            </>
        );
    }
}

export default AddCustomRubric;
